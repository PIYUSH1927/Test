import React, { useState, useEffect, useRef } from "react";

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

const styles = `
.floor-plan {
  position: relative;
  background-color: #f8f8f8;
  border: 2px solid #000;
  overflow: hidden;
}

.room-polygon {
  fill: #E8E8E8;
  opacity: 0.8;
  stroke: #000;  
  stroke-width: 3px;  
  cursor: pointer;
  transition: all 0.2s ease;
  stroke-linejoin: miter; 
  shape-rendering: crispEdges
}

svg {
  vector-effect: non-scaling-stroke;
}

.room-polygon.selected {
  fill: rgba(224, 224, 255, 0.8);
  stroke: #0000ff;
  stroke-width: 4px; 
}

.room-label {
  pointer-events: none;
  user-select: none;
  font-size: 11px;
  text-anchor: middle;
}

.room-name {
  font-weight: bold;
  font-size: 13px;
}

.controls {
  
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.room-info {
  margin-top: 20px;
 
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input-group label {
  width: 100px;
  font-weight: bold;
}

.input-group input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
`;

export default function Generated() {
  const [floorPlanData, setFloorPlanData] = useState<FloorPlanData>({
    room_count: 8,
    total_area: 62.57,
   "room_types": [
    "SecondRoom",
    "MasterRoom",
    "Bathroom",
    "LivingRoom",
    "Balcony",
    "Kitchen",
    "Balcony",
    "Balcony"
  ],
    rooms: [
      {
        id: "room|0",
        room_type: "MasterRoom",
        area: 10.01,
        height: 2.88,
        width: 3.52,
        floor_polygon: [
          { x: 141, z: 75 },
          { x: 191, z: 75 },
          { x: 191, z: 116 },
          { x: 141, z: 116 },
        ],
      },
      {
        id: "room|1",
        room_type: "LivingRoom",
        area: 25.14,
        height: 5.48,
        width: 8.86,
        floor_polygon: [
          { x: 65, z: 75 },
          { x: 137, z: 75 },
          { x: 137, z: 122 },
          { x: 191, z: 122 },
          { x: 191, z: 139 },
          { x: 141, z: 139 },
          { x: 141, z: 153 },
          { x: 123, z: 153 },
          { x: 123, z: 139 },
          { x: 65, z: 139 },
        ],
      },
      {
        id: "room|2",
        room_type: "ChildRoom",
        area: 8.31,
        height: 2.67,
        width: 3.23,
        floor_polygon: [
          { x: 145, z: 143 },
          { x: 191, z: 143 },
          { x: 191, z: 181 },
          { x: 145, z: 181 },
        ],
      },
      {
        id: "room|3",
        room_type: "Kitchen",
        area: 4.75,
        height: 1.27,
        width: 3.8,
        floor_polygon: [
          { x: 65, z: 143 },
          { x: 119, z: 143 },
          { x: 119, z: 161 },
          { x: 65, z: 161 },
        ],
      },
      {
        id: "room|4",
        room_type: "Bathroom",
        area: 2.37,
        height: 1.69,
        width: 1.27,
        floor_polygon: [
          { x: 123, z: 157 },
          { x: 141, z: 157 },
          { x: 141, z: 181 },
          { x: 123, z: 181 },
        ],
      },
      {
        id: "room|5",
        room_type: "Balcony",
        area: 3.11,
        height: 0.98,
        width: 3.8,
        floor_polygon: [
          { x: 65, z: 55 },
          { x: 119, z: 55 },
          { x: 119, z: 69 },
          { x: 65, z: 69 },
        ],
      },
      {
        id: "room|6",
        room_type: "Balcony",
        area: 3.11,
        height: 1.12,
        width: 3.8,
        floor_polygon: [
          { x: 65, z: 165 },
          { x: 119, z: 165 },
          { x: 119, z: 181 },
          { x: 65, z: 181 },
        ],
      },
      {
        id: "room|7",
        room_type: "Balcony",
        area: 5.76,
        height: 1.12,
        width: 3.8,
        floor_polygon: [
          { x: 145, z: 185 },
          { x: 191, z: 185 },
          { x: 191, z: 197 },
          { x: 145, z: 197 },
        ],
      },
    ],
  });

  const tlength = 15;
  const twidth = 10;

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const [scale, setScale] = useState(window.innerWidth < 786 ? 2 : 3.5);
  const floorPlanRef = useRef<HTMLDivElement>(null);
  const calculateBounds = () => {
    const allPoints = floorPlanData.rooms.flatMap((room) => room.floor_polygon);
    const minX = Math.min(...allPoints.map((p) => p.x));
    const maxX = Math.max(...allPoints.map((p) => p.x));
    const minZ = Math.min(...allPoints.map((p) => p.z));
    const maxZ = Math.max(...allPoints.map((p) => p.z));

    return { minX, maxX, minZ, maxZ };
  };

  useEffect(() => {
    const handleResize = () => {
      setScale(window.innerWidth < 786 ? 2 : 3.5);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const isMobile = window.innerWidth < 786;
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickOutsideRooms = !Array.from(
        document.querySelectorAll(".room-polygon")
      ).some((polygon) => polygon.contains(event.target as Node));

      if (isClickOutsideRooms && selectedRoomId) {
        setSelectedRoomId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedRoomId]);

  const bounds = calculateBounds();
  const padding = 20;
  const contentWidth = bounds.maxX - bounds.minX + 2 * padding;
  const contentHeight = bounds.maxZ - bounds.minZ + 2 * padding;

  const transformCoordinates = (point: Point) => {
    return {
      x: (point.x - bounds.minX + padding) * scale,
      y: (point.z - bounds.minZ + padding) * scale,
    };
  };

  const handleRoomClick = (roomId: string) => {
    setSelectedRoomId(roomId === selectedRoomId ? null : roomId);
  };

  const calculateRoomCentroid = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return { x: 0, y: 0 };

    let sumX = 0;
    let sumY = 0;

    points.forEach((point) => {
      sumX += point.x;
      sumY += point.y;
    });

    return {
      x: sumX / points.length,
      y: sumY / points.length,
    };
  };

  return (
    <div>
      <style>{styles}</style>

      

<div
  ref={floorPlanRef}
  style={{
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: isMobile ? "translate(-40%, -46%)" : "translate(-30%, -46%)",
    width: `${contentWidth * scale}px`,
    height: `${contentHeight * scale}px`,
    justifyContent: "center",
    alignItems: "center",
  }}
>

           <p style={{textAlign:"center", marginBottom:"-35px"}}>
          <b>Total Area:</b> {floorPlanData.total_area} ft² &nbsp;|&nbsp;{" "}
          <b>Total Rooms:</b> {floorPlanData.room_count}
        </p>

        <svg width="100%" height="100%">
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
            x1={transformCoordinates({ x: bounds.minX - 10, z: bounds.minZ }).x}
            y1={transformCoordinates({ x: bounds.minX, z: bounds.minZ }).y}
            x2={transformCoordinates({ x: bounds.minX - 10, z: bounds.maxZ }).x}
            y2={transformCoordinates({ x: bounds.minX, z: bounds.maxZ }).y}
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
            {tlength} ft
          </text>

          <line
            x1={transformCoordinates({ x: bounds.minX, z: bounds.maxZ + 10 }).x}
            y1={transformCoordinates({ x: bounds.minX, z: bounds.maxZ + 10 }).y}
            x2={transformCoordinates({ x: bounds.maxX, z: bounds.maxZ + 10 }).x}
            y2={transformCoordinates({ x: bounds.maxX, z: bounds.maxZ + 10 }).y}
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
            {twidth} ft
          </text>

          {floorPlanData.rooms.map((room) => {
            const transformedPoints =
              room.floor_polygon.map(transformCoordinates);

            const polygonPoints = transformedPoints
              .map((p) => `${p.x},${p.y}`)
              .join(" ");

            const centroid = calculateRoomCentroid(transformedPoints);

            return (
              <g key={room.id}>
                <polygon
                  id={room.id}
                  className={`room-polygon ${
                    selectedRoomId === room.id ? "selected" : ""
                  }`}
                  points={polygonPoints}
                  onClick={() => handleRoomClick(room.id)}
                />

                <text
                  className="room-label room-name"
                  x={centroid.x}
                  y={centroid.y - 10}
                >
                  {room.room_type}
                </text>

                {room.area < 5 ? (
                  <>
                    <text
                      className="room-label"
                      x={centroid.x}
                      y={centroid.y + 10}
                    >
                      {room.width.toFixed(1)}' × {room.height.toFixed(1)}'
                    </text>
                    <text
                      className="room-label"
                      x={centroid.x}
                      y={centroid.y + 25}
                    >
                      ({room.area.toFixed(2)} ft²)
                    </text>
                  </>
                ) : (
                  <text
                    className="room-label"
                    x={centroid.x}
                    y={centroid.y + 10}
                  >
                    {room.width.toFixed(1)}' × {room.height.toFixed(1)}' (
                    {room.area.toFixed(2)} ft²)
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
