// features/eventHandlers.tsx
import React, { useCallback, RefObject, useEffect } from "react";
import { 
  handleMouseMove, 
  handleTouchMove, 
  handleMouseUp, 
  handleTouchEnd, 
  useNonPassiveTouchHandling 
} from "./resizing";

interface Point {
  x: number;
  z: number;
}

interface DragState {
  active: boolean;
  roomId: string | null;
  vertexIndex: number | null;
  edgeIndices: number[] | null; 
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  isResizing: boolean;
  isEdgeResizing: boolean; 
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

export function useEventHandlers(
  dragState: DragState,
  svgRef: RefObject<SVGSVGElement>,
  scale: number,
  reverseTransformCoordinates: (x: number, y: number) => { x: number; z: number },
  calculateRoomDimensions: (polygon: Point[]) => { width: number; height: number },
  calculateRoomArea: (polygon: Point[]) => number,
  setFloorPlanData: React.Dispatch<React.SetStateAction<FloorPlanData>>,
  setDragState: React.Dispatch<React.SetStateAction<DragState>>,
  checkAndUpdateOverlaps: () => boolean | void
) {
  // Add non-passive touch handling
  useNonPassiveTouchHandling(svgRef);

  const handleMouseMoveCallback = useCallback(
    (event: MouseEvent) => {
      handleMouseMove(
        event,
        dragState,
        svgRef,
        scale,
        reverseTransformCoordinates,
        calculateRoomDimensions,
        calculateRoomArea,
        setFloorPlanData,
        setDragState
      );
    },
    [dragState, reverseTransformCoordinates, scale, calculateRoomDimensions, calculateRoomArea, setFloorPlanData]
  );

  const handleTouchMoveCallback = useCallback(
    (event: TouchEvent) => {
      handleTouchMove(
        event,
        dragState,
        svgRef,
        scale,
        reverseTransformCoordinates,
        calculateRoomDimensions,
        calculateRoomArea,
        setFloorPlanData,
        setDragState
      );
    },
    [dragState, reverseTransformCoordinates, scale, calculateRoomDimensions, calculateRoomArea, setFloorPlanData]
  );

  const handleMouseUpCallback = useCallback(() => {
    handleMouseUp(setDragState, checkAndUpdateOverlaps);
  }, [checkAndUpdateOverlaps, setDragState]);

  const handleTouchEndCallback = useCallback(() => {
    handleTouchEnd(setDragState, checkAndUpdateOverlaps);
  }, [checkAndUpdateOverlaps, setDragState]);

  useEffect(() => {
    const preventDefaultTouchMove = (e: TouchEvent) => {
      if (dragState.active) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventDefaultTouchMove, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", preventDefaultTouchMove);
    };
  }, [dragState.active]);

  useEffect(() => {
    if (dragState.active) {
      document.addEventListener("mousemove", handleMouseMoveCallback);
      document.addEventListener("mouseup", handleMouseUpCallback);

      document.addEventListener("touchmove", handleTouchMoveCallback, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEndCallback);
      document.addEventListener("touchcancel", handleTouchEndCallback);

      return () => {
        document.removeEventListener("mousemove", handleMouseMoveCallback);
        document.removeEventListener("mouseup", handleMouseUpCallback);
        document.removeEventListener("touchmove", handleTouchMoveCallback);
        document.removeEventListener("touchend", handleTouchEndCallback);
        document.removeEventListener("touchcancel", handleTouchEndCallback);
      };
    }
  }, [
    dragState.active,
    handleMouseMoveCallback,
    handleMouseUpCallback,
    handleTouchMoveCallback,
    handleTouchEndCallback,
  ]);

  return {
    handleMouseMoveCallback,
    handleTouchMoveCallback,
    handleMouseUpCallback,
    handleTouchEndCallback
  };
}

export function handleRoomClick(
  roomId: string,
  event: React.MouseEvent | React.TouchEvent,
  selectedRoomId: string | null,
  setSelectedRoomId: React.Dispatch<React.SetStateAction<string | null>>
) {
  event.stopPropagation();

  if (roomId !== selectedRoomId) {
    setSelectedRoomId(roomId);
  }
}