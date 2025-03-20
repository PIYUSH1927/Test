import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  renderOverlapAlert,
  getOverlappingRoomNames,
  isRoomOverlapping,
} from "./features/warning";
import {
  handleMouseDown,
  handleVertexMouseDown,
  handleTouchStart,
  handleVertexTouchStart,
} from "./features/resizing";

import { handleUndoChanges } from "./features/undo1";
import {
  calculateRoomCentroid,
  calculateRoomArea,
  calculateRoomDimensions,
} from "./features/roomCalculations";
import {
  calculateBounds,
  useCoordinateTransforms,
} from "./features/coordinates";
import { roomColors, floorPlanStyles } from "./features/styles";
import { useInterval } from "./features/intervalHooks";
import { useEventHandlers, handleRoomClick } from "./features/eventHandlers";
import { saveFloorPlan } from "./features/save";
import { initialFloorPlanData } from "./features/initialData";
import {
  handleRotateRoom,
  checkAndUpdateOverlaps as checkRoomOverlaps,
} from "./features/rotation";
import { useSimpleUndoHistory, useUndoShortcut } from "./features/history";

interface Point {
  x: number;
  z: number;
}

interface Room {
  id: string;
  room_type: string;
  area: number;
  height: number;
  width: number;
  floor_polygon: Point[];
}

interface FloorPlanData {
  room_count: number;
  total_area: number;
  room_types: string[];
  rooms: Room[];
}

interface DragState {
  active: boolean;
  roomId: string | null;
  vertexIndex: number | null;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  isResizing: boolean;
}

export default function InteractiveFloorPlan({
  rotation = 0,
}: {
  rotation?: number;
}) {
  const [hasChanges, setHasChanges] = useState(false);
  const [leftPosition, setLeftPosition] = useState("10%");
  const [floorPlanData, setFloorPlanData] =
    useState<FloorPlanData>(initialFloorPlanData);
  const [roomRotations, setRoomRotations] = useState<{ [key: string]: number }>(
    {}
  );

  const tlength = 15;
  const twidth = 10;

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [scale, setScale] = useState(window.innerWidth < 850 ? 2.1 : 3.2);
  const floorPlanRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [overlappingRooms, setOverlappingRooms] = useState<string[][]>([]);

  const [dragState, setDragState] = useState<DragState>({
    active: false,
    roomId: null,
    vertexIndex: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    isResizing: false,
  });

  const { saveState, undo, hasUndoState } = useSimpleUndoHistory();

  const handleUndo = useCallback(() => {
    undo((state) => {
      if (state) {
        setFloorPlanData(state.floorPlanData);
        setRoomRotations(state.roomRotations);
      }
    });
  }, [undo]);

  useUndoShortcut(handleUndo);

  const isCapturingState = useRef(false);

  const captureStateBeforeChange = () => {
    if (!isCapturingState.current) {
      isCapturingState.current = true;
      saveState({
        floorPlanData: JSON.parse(JSON.stringify(floorPlanData)),
        roomRotations: { ...roomRotations },
      });
    }
  };

  useEffect(() => {
    if (!dragState.active) {
      isCapturingState.current = false;
    }
  }, [dragState.active]);

  const handleMouseDownWithHistory = (
    event: React.MouseEvent,
    roomId: string,
    svgRef: React.RefObject<SVGSVGElement | null>,
    setDragState: React.Dispatch<React.SetStateAction<DragState>>,
    setHasChanges: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedRoomId: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    captureStateBeforeChange();

    handleMouseDown(
      event,
      roomId,
      svgRef as React.RefObject<SVGSVGElement>,
      setDragState,
      setHasChanges,
      setSelectedRoomId
    );
  };

  const handleVertexMouseDownWithHistory = (
    event: React.MouseEvent,
    roomId: string,
    vertexIndex: number,
    svgRef: React.RefObject<SVGSVGElement | null>,
    setDragState: React.Dispatch<React.SetStateAction<DragState>>,
    setSelectedRoomId: React.Dispatch<React.SetStateAction<string | null>>,
    setHasChanges: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    captureStateBeforeChange();

    handleVertexMouseDown(
      event,
      roomId,
      vertexIndex,
      svgRef as React.RefObject<SVGSVGElement>,
      setDragState,
      setSelectedRoomId,
      setHasChanges
    );
  };

  const handleTouchStartWithHistory = (
    event: React.TouchEvent,
    roomId: string,
    svgRef: React.RefObject<SVGSVGElement | null>,
    setDragState: React.Dispatch<React.SetStateAction<DragState>>,
    setHasChanges: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedRoomId: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    captureStateBeforeChange();

    handleTouchStart(
      event,
      roomId,
      svgRef as React.RefObject<SVGSVGElement>,
      setDragState,
      setHasChanges,
      setSelectedRoomId
    );
  };

  const handleVertexTouchStartWithHistory = (
    event: React.TouchEvent,
    roomId: string,
    vertexIndex: number,
    svgRef: React.RefObject<SVGSVGElement | null>,
    setDragState: React.Dispatch<React.SetStateAction<DragState>>,
    setSelectedRoomId: React.Dispatch<React.SetStateAction<string | null>>,
    setHasChanges: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    captureStateBeforeChange();

    handleVertexTouchStart(
      event,
      roomId,
      vertexIndex,
      svgRef as React.RefObject<SVGSVGElement>,
      setDragState,
      setSelectedRoomId,
      setHasChanges
    );
  };

  const handleRotateRoomWithHistory = (
    roomId: string,
    direction: "left" | "right",
    roomRotations: { [key: string]: number },
    setRoomRotations: React.Dispatch<
      React.SetStateAction<{ [key: string]: number }>
    >,
    setHasChanges: React.Dispatch<React.SetStateAction<boolean>>,
    checkAndUpdateOverlaps: () => void
  ) => {
    captureStateBeforeChange();

    handleRotateRoom(
      roomId,
      direction,
      roomRotations,
      setRoomRotations,
      setHasChanges,
      checkAndUpdateOverlaps
    );

    setTimeout(() => {
      isCapturingState.current = false;
    }, 10);
  };

  const checkAndUpdateOverlaps = () => {
    return checkRoomOverlaps(floorPlanData, roomRotations, setOverlappingRooms);
  };

  useInterval(() => {
    checkAndUpdateOverlaps();
  }, 300);

  useEffect(() => {
    checkAndUpdateOverlaps();
  }, []);

  useInterval(() => {
    checkAndUpdateOverlaps();
  }, 500);

  const getRoomType = (roomId: string) => {
    const room = floorPlanData.rooms.find((r) => r.id === roomId);
    return room?.room_type;
  };

  useEffect(() => {
    const handleResize = () => {
      setScale(window.innerWidth < 850 ? 2 : 3.5);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!dragState.active) {
        const target = event.target as HTMLElement;

        const isClickInsideRoom = target.closest(".room-polygon");
        const isClickOnRotateButton = target.closest(".rotate-button");

        if (!isClickInsideRoom && !isClickOnRotateButton && selectedRoomId) {
          setSelectedRoomId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [selectedRoomId, dragState.active]);

  const bounds = calculateBounds(floorPlanData.rooms);
  const padding = 20;
  const contentWidth = bounds.maxX - bounds.minX + 2 * padding;
  const contentHeight = bounds.maxZ - bounds.minZ + 2 * padding;
  const isMobile = window.innerWidth < 850;

  const { transformCoordinates, reverseTransformCoordinates } =
    useCoordinateTransforms(bounds, padding, scale);

  const eventHandlers = useEventHandlers(
    dragState,
    svgRef as React.RefObject<SVGSVGElement>,
    scale,
    reverseTransformCoordinates,
    calculateRoomDimensions,
    calculateRoomArea,
    setFloorPlanData,
    setDragState,
    checkAndUpdateOverlaps
  );

  useEffect(() => {
    const updateLeft = () => {
      if (window.innerWidth > 850) {
        setLeftPosition("23%");
      } else {
        setLeftPosition("10%");
      }
    };

    updateLeft();
    window.addEventListener("resize", updateLeft);

    return () => window.removeEventListener("resize", updateLeft);
  }, []);

  const getOverlappingRoomNamesHelper = () => {
    return getOverlappingRoomNames(overlappingRooms, getRoomType);
  };

  return (
    <div>
      {renderOverlapAlert({
        overlappingRooms,
        getOverlappingRoomNames: getOverlappingRoomNamesHelper,
      })}

      <div>
        <style>{floorPlanStyles}</style>

        <div
          ref={floorPlanRef}
          className="floor-plan-container"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: isMobile
              ? "translate(-40%, -46%)"
              : "translate(-30%, -49%)",
            width: `${contentWidth * scale}px`,
            height: `${contentHeight * scale}px`,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ textAlign: "center", marginBottom: "-30px" }}>
            <b>Total Area:</b> {floorPlanData.total_area.toFixed(2)} m²
            &nbsp;|&nbsp; <b>Total Rooms:</b> {floorPlanData.room_count}
            {hasUndoState && !isMobile && (
              <span
                style={{ fontSize: "0.8em", marginLeft: "10px", color: "#666" }}
              >
                (Ctrl+Z to undo last change)
              </span>
            )}
          </p>

          <svg
            width="100%"
            height="100%"
            ref={svgRef}
            style={{ touchAction: "none" }}
          >
            <defs>
              <marker
                id="arrow"
                markerWidth="10"
                markerHeight="10"
                refX="5"
                refY="5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M 0 0 L 10 5 L 0 10 Z" fill="black" />
              </marker>

              <marker
                id="arrow1"
                markerWidth="10"
                markerHeight="10"
                refX="5"
                refY="5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M 10 0 L 0 5 L 10 10 Z" fill="black" />
              </marker>
            </defs>

            <line
              x1={
                transformCoordinates({ x: bounds.minX - 10, z: bounds.minZ })
                  .x + 10
              }
              y1={
                transformCoordinates({ x: bounds.minX, z: bounds.minZ }).y + 10
              }
              x2={
                transformCoordinates({ x: bounds.minX - 10, z: bounds.maxZ })
                  .x + 10
              }
              y2={
                transformCoordinates({ x: bounds.minX, z: bounds.maxZ }).y + 10
              }
              stroke="black"
              strokeWidth="1"
              markerStart="url(#arrow1)"
              markerEnd="url(#arrow)"
            />
            <text
              x={
                transformCoordinates({
                  x: bounds.minX - 14,
                  z: (bounds.minZ + bounds.maxZ) / 2,
                }).x
              }
              y={
                transformCoordinates({
                  x: bounds.minX,
                  z: (bounds.minZ + bounds.maxZ) / 2,
                }).y
              }
              fontSize="11"
              fill="black"
              textAnchor="middle"
            >
              {tlength} m
            </text>

            <line
              x1={
                transformCoordinates({ x: bounds.minX, z: bounds.maxZ + 8 }).x
              }
              y1={
                transformCoordinates({ x: bounds.minX, z: bounds.maxZ + 8 }).y
              }
              x2={
                transformCoordinates({ x: bounds.maxX, z: bounds.maxZ + 8 }).x
              }
              y2={
                transformCoordinates({ x: bounds.maxX, z: bounds.maxZ + 8 }).y
              }
              stroke="black"
              strokeWidth="1"
              markerStart="url(#arrow1)"
              markerEnd="url(#arrow)"
            />
            <text
              x={
                transformCoordinates({
                  x: (bounds.minX + bounds.maxX) / 2,
                  z: bounds.maxZ + 20,
                }).x
              }
              y={
                transformCoordinates({
                  x: (bounds.minX + bounds.maxX) / 2,
                  z: bounds.maxZ + 14,
                }).y
              }
              fontSize="11"
              fill="black"
              textAnchor="middle"
            >
              {twidth} m
            </text>

            {floorPlanData.rooms.map((room) => {
              const transformedPoints =
                room.floor_polygon.map(transformCoordinates);

              const polygonPoints = transformedPoints
                .map((p) => `${p.x},${p.y}`)
                .join(" ");

              const centroid = calculateRoomCentroid(transformedPoints);

              const isOverlapping = isRoomOverlapping(
                room.id,
                overlappingRooms
              );

              return (
                <g
                  key={room.id}
                  transform={`rotate(${roomRotations[room.id] || 0}, ${
                    centroid.x
                  }, ${centroid.y})`}
                >
                  <polygon
                    id={room.id}
                    className={`room-polygon ${
                      selectedRoomId === room.id ? "selected" : ""
                    } ${isOverlapping ? "overlapping" : ""}`}
                    points={polygonPoints}
                    fill={
                      roomColors[room.room_type as keyof typeof roomColors] ||
                      "#E8E8E8"
                    }
                    onClick={(e) =>
                      handleRoomClick(
                        room.id,
                        e,
                        selectedRoomId,
                        setSelectedRoomId
                      )
                    }
                    onMouseDown={(e) =>
                      handleMouseDownWithHistory(
                        e,
                        room.id,
                        svgRef,
                        setDragState,
                        setHasChanges,
                        setSelectedRoomId
                      )
                    }
                    onTouchStart={(e) =>
                      handleTouchStartWithHistory(
                        e,
                        room.id,
                        svgRef,
                        setDragState,
                        setHasChanges,
                        setSelectedRoomId
                      )
                    }
                  />

                  {selectedRoomId === room.id &&
                    transformedPoints.map((point, index) => (
                      <circle
                        key={`handle-${room.id}-${index}`}
                        cx={point.x}
                        cy={point.y}
                        r={6}
                        className="resize-handle"
                        onMouseDown={(e) =>
                          handleVertexMouseDownWithHistory(
                            e,
                            room.id,
                            index,
                            svgRef,
                            setDragState,
                            setSelectedRoomId,
                            setHasChanges
                          )
                        }
                        onTouchStart={(e) =>
                          handleVertexTouchStartWithHistory(
                            e,
                            room.id,
                            index,
                            svgRef,
                            setDragState,
                            setSelectedRoomId,
                            setHasChanges
                          )
                        }
                      />
                    ))}

                  {selectedRoomId === room.id && (
                    <foreignObject
                      x={centroid.x - (isMobile ? 8 : 15)}
                      y={centroid.y - (isMobile ? 8 : 15)}
                      width={isMobile ? "20" : "30"}
                      height={isMobile ? "20" : "30"}
                    >
                      <button
                        className="rotate-button"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const direction =
                            e.ctrlKey || e.metaKey || e.altKey
                              ? "left"
                              : "right";
                          handleRotateRoomWithHistory(
                            room.id,
                            direction,
                            roomRotations,
                            setRoomRotations,
                            setHasChanges,
                            checkAndUpdateOverlaps
                          );
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRotateRoomWithHistory(
                            room.id,
                            "left",
                            roomRotations,
                            setRoomRotations,
                            setHasChanges,
                            checkAndUpdateOverlaps
                          );
                        }}
                        style={{
                          width: isMobile ? "25px" : "40px",
                          height: isMobile ? "25px" : "40px",
                          position: "relative",
                          right: isMobile ? "8px" : "12px",
                          borderRadius: "50%",
                          zIndex: "100",
                          background: "transparent",
                          color: "green",
                          fontWeight: "bolder",
                          fontSize: isMobile ? "20px" : "35px",
                          border: "none",
                          cursor: "pointer",
                        }}
                        title="Left-click to rotate clockwise, Right-click to rotate counter-clockwise"
                      >
                        <b>↻</b>
                      </button>
                    </foreignObject>
                  )}

                  <text
                    className="room-label room-name"
                    x={centroid.x}
                    y={centroid.y - 3}
                    pointerEvents="none"
                  >
                    {room.room_type}
                  </text>

                  {room.area < 5 ? (
                    <>
                      <text
                        className="room-label"
                        x={centroid.x}
                        y={centroid.y + 10}
                        pointerEvents="none"
                      >
                        {room.width.toFixed(1)}' × {room.height.toFixed(1)}'
                      </text>
                      <text
                        className="room-label"
                        x={centroid.x}
                        y={centroid.y + 20}
                        pointerEvents="none"
                      >
                        ({room.area.toFixed(2)} m²)
                      </text>
                    </>
                  ) : (
                    <text
                      className="room-label"
                      x={centroid.x}
                      y={centroid.y + 10}
                      pointerEvents="none"
                    >
                      {room.width.toFixed(1)}' × {room.height.toFixed(1)}' (
                      {room.area.toFixed(2)} m²)
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          {hasChanges && (
            <div
              style={{
                position: "fixed",
                display: "flex",
                gap: "10px",
                width: "80%",
                bottom: "80",
                left: leftPosition,
                pointerEvents: "auto",
              }}
            >
              <button
                className="save-button"
                onClick={() =>
                  saveFloorPlan(floorPlanData, roomRotations, setHasChanges)
                }
              >
                Save Floor Plan
              </button>
              <button
                className="undo-button"
                onClick={() =>
                  handleUndoChanges(
                    initialFloorPlanData,
                    setFloorPlanData,
                    setSelectedRoomId,
                    setHasChanges,
                    setRoomRotations
                  )
                }
              >
                Reset Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
