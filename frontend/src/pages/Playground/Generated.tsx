import React, { useState, useEffect, useRef, useCallback } from "react";

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

const roomColors: Record<string, string> = {
  MasterRoom: "#FFD3B6",  
  LivingRoom: "#FFAAA5",  
  ChildRoom: "#D5AAFF",   
  Kitchen: "#FFCC5C",    
  Bathroom: "#85C1E9",    
  Balcony: "#B2DFDB",     
  SecondRoom: "#F6D55C",  
  DiningRoom: "#A5D6A7",  
};

const styles = `
.floor-plan {
  position: relative;
  background-color: #f8f8f8;
  border: 2px solid #000;
  overflow: hidden;
}

.room-polygon {
  opacity: 0.8;
  stroke: #000;  
  stroke-width: 3px;  
  cursor: move;
  transition: all 0.2s ease;
  stroke-linejoin: miter; 
  shape-rendering: crispEdges;
  touch-action: none; 
}

svg {
  vector-effect: non-scaling-stroke;
  touch-action: none; 
}


.floor-plan-container {
  touch-action: none;
}

.room-polygon.selected {
  fill: rgba(224, 224, 255, 0.8);
  stroke: #0000ff;
  stroke-width: 4px; 
}

.resize-handle {
  fill: white;
  stroke: black;
  stroke-width: 2px;
  cursor: nwse-resize;
}

.resize-handle:hover {
  fill: #ffcc00;
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

@media (max-width: 786px) {
  .room-label {
    font-size: 8px !important;
  }
  
  .room-name {
    font-size: 10px !important;
  }
}
`;

export default function InteractiveFloorPlan({ rotation = 0 }: { rotation?: number }) {

  const [hasChanges, setHasChanges] = useState(false);
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
  const [scale, setScale] = useState(window.innerWidth < 786 ? 2.1 : 3.5);
  const floorPlanRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [dragState, setDragState] = useState<DragState>({
    active: false,
    roomId: null,
    vertexIndex: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    isResizing: false
  });

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!dragState.active) {
        const isClickOutsideRooms = !Array.from(
          document.querySelectorAll(".room-polygon")
        ).some((polygon) => polygon.contains(event.target as Node));

        if (isClickOutsideRooms && selectedRoomId) {
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

  const bounds = calculateBounds();
  const padding = 20;
  const contentWidth = bounds.maxX - bounds.minX + 2 * padding;
  const contentHeight = bounds.maxZ - bounds.minZ + 2 * padding;
  const isMobile = window.innerWidth < 786;

  const transformCoordinates = useCallback((point: Point) => {
    return {
      x: (point.x - bounds.minX + padding) * scale,
      y: (point.z - bounds.minZ + padding) * scale,
    };
  }, [bounds.minX, bounds.minZ, padding, scale]);

  const reverseTransformCoordinates = useCallback((x: number, y: number) => {
    return {
      x: x / scale + bounds.minX - padding,
      z: y / scale + bounds.minZ - padding,
    };
  }, [bounds.minX, bounds.minZ, padding, scale]);

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

  const calculateRoomArea = (polygon: Point[]) => {
    if (polygon.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      area += polygon[i].x * polygon[j].z;
      area -= polygon[j].x * polygon[i].z;
    }
    
    area = Math.abs(area) / 2;
    return area / 100; 
  };

  const calculateRoomDimensions = (polygon: Point[]) => {
    if (polygon.length < 3) return { width: 0, height: 0 };
    
    const xCoords = polygon.map(p => p.x);
    const zCoords = polygon.map(p => p.z);
    
    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minZ = Math.min(...zCoords);
    const maxZ = Math.max(...zCoords);
    
    return {
      width: (maxX - minX) / 10, 
      height: (maxZ - minZ) / 10, 
    };
  };

  const handleRoomClick = (roomId: string, event: React.MouseEvent | React.TouchEvent) => {
    event.stopPropagation();
    
    if (roomId !== selectedRoomId) {
      setSelectedRoomId(roomId);
    }
  };

  const handleMouseDown = (event: React.MouseEvent, roomId: string) => {
    event.stopPropagation();
    event.preventDefault();
    
    if (event.button !== 0) return; 
    
    const svgElement = svgRef.current;
    if (!svgElement) return;
    
    const svgRect = svgElement.getBoundingClientRect();
    const mouseX = event.clientX - svgRect.left;
    const mouseY = event.clientY - svgRect.top;
    
    setDragState({
      active: true,
      roomId,
      vertexIndex: null,
      startX: mouseX,
      startY: mouseY,
      lastX: mouseX,
      lastY: mouseY,
      isResizing: false
    });

    setHasChanges(true);
    setSelectedRoomId(roomId);
  };

  const handleVertexMouseDown = (event: React.MouseEvent, roomId: string, vertexIndex: number) => {
    event.stopPropagation();
    event.preventDefault();
    
    const svgElement = svgRef.current;
    if (!svgElement) return;
    
    const svgRect = svgElement.getBoundingClientRect();
    const mouseX = event.clientX - svgRect.left;
    const mouseY = event.clientY - svgRect.top;
    
    setDragState({
      active: true,
      roomId,
      vertexIndex,
      startX: mouseX,
      startY: mouseY,
      lastX: mouseX,
      lastY: mouseY,
      isResizing: true
    });
    
    setSelectedRoomId(roomId);

    setHasChanges(true);
  };

  const handleTouchStart = (event: React.TouchEvent, roomId: string) => {
    event.stopPropagation();
    
    if (event.touches.length !== 1) return; 

    event.preventDefault();

    document.body.setAttribute('data-room-touch-interaction', 'true');
    
    const touch = event.touches[0];
    const svgElement = svgRef.current;
    if (!svgElement) return;
    
    const svgRect = svgElement.getBoundingClientRect();
    const touchX = touch.clientX - svgRect.left;
    const touchY = touch.clientY - svgRect.top;
    
    setDragState({
      active: true,
      roomId,
      vertexIndex: null,
      startX: touchX,
      startY: touchY,
      lastX: touchX,
      lastY: touchY,
      isResizing: false
    });
  
    setHasChanges(true);
    setSelectedRoomId(roomId);
  };

  const handleVertexTouchStart = (event: React.TouchEvent, roomId: string, vertexIndex: number) => {
    event.stopPropagation();

    
    if (event.touches.length !== 1) return;

    event.preventDefault();

    document.body.setAttribute('data-room-touch-interaction', 'true');
    
    const touch = event.touches[0];
    const svgElement = svgRef.current;
    if (!svgElement) return;
    
    const svgRect = svgElement.getBoundingClientRect();
    const touchX = touch.clientX - svgRect.left;
    const touchY = touch.clientY - svgRect.top;
    
    setDragState({
      active: true,
      roomId,
      vertexIndex,
      startX: touchX,
      startY: touchY,
      lastX: touchX,
      lastY: touchY,
      isResizing: true
    });
    
    setSelectedRoomId(roomId);

    setHasChanges(true);
  };

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!dragState.active || !dragState.roomId) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    if (event.touches.length !== 1) return;
    
    const touch = event.touches[0];
    const svgElement = svgRef.current;
    if (!svgElement) return;
    
    const svgRect = svgElement.getBoundingClientRect();
    const touchX = touch.clientX - svgRect.left;
    const touchY = touch.clientY - svgRect.top;
    
    const deltaX = touchX - dragState.lastX;
    const deltaY = touchY - dragState.lastY;
    
    setFloorPlanData(prevData => {
      const updatedRooms = [...prevData.rooms];
      const roomIndex = updatedRooms.findIndex(room => room.id === dragState.roomId);
      
      if (roomIndex === -1) return prevData;
      
      const room = {...updatedRooms[roomIndex]};
      
      if (dragState.isResizing && dragState.vertexIndex !== null) {
        const updatedPolygon = [...room.floor_polygon];
        const point = reverseTransformCoordinates(touchX, touchY);
        updatedPolygon[dragState.vertexIndex] = point;
        
        const dimensions = calculateRoomDimensions(updatedPolygon);
        const area = calculateRoomArea(updatedPolygon);
        
        room.floor_polygon = updatedPolygon;
        room.width = dimensions.width;
        room.height = dimensions.height;
        room.area = area;
      } else {
        const updatedPolygon = room.floor_polygon.map(point => {
          return {
            x: point.x + deltaX / scale,
            z: point.z + deltaY / scale
          };
        });
        
        room.floor_polygon = updatedPolygon;
      }
      
      updatedRooms[roomIndex] = room;
      
      const totalArea = updatedRooms.reduce((sum, room) => sum + room.area, 0);
      
      return {
        ...prevData,
        rooms: updatedRooms,
        total_area: parseFloat(totalArea.toFixed(2))
      };
    });
    
    setDragState(prev => ({
      ...prev,
      lastX: touchX,
      lastY: touchY
    }));
  }, [dragState, reverseTransformCoordinates, scale]);

  useEffect(() => {
    const preventDefaultTouchMove = (e: TouchEvent) => {
      if (dragState.active) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventDefaultTouchMove, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventDefaultTouchMove);
    };
  }, [dragState.active]);

  const handleTouchEnd = useCallback(() => {

    document.body.removeAttribute('data-room-touch-interaction');

    setDragState({
      active: false,
      roomId: null,
      vertexIndex: null,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      isResizing: false
    });
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!dragState.active || !dragState.roomId) return;
    
    const svgElement = svgRef.current;
    if (!svgElement) return;
    
    const svgRect = svgElement.getBoundingClientRect();
    const mouseX = event.clientX - svgRect.left;
    const mouseY = event.clientY - svgRect.top;
    
    const deltaX = mouseX - dragState.lastX;
    const deltaY = mouseY - dragState.lastY;
    
    setFloorPlanData(prevData => {
      const updatedRooms = [...prevData.rooms];
      const roomIndex = updatedRooms.findIndex(room => room.id === dragState.roomId);
      
      if (roomIndex === -1) return prevData;
      
      const room = {...updatedRooms[roomIndex]};
      
      if (dragState.isResizing && dragState.vertexIndex !== null) {

        const updatedPolygon = [...room.floor_polygon];
        const point = reverseTransformCoordinates(mouseX, mouseY);
        updatedPolygon[dragState.vertexIndex] = point;
        
        const dimensions = calculateRoomDimensions(updatedPolygon);
        const area = calculateRoomArea(updatedPolygon);
        
        room.floor_polygon = updatedPolygon;
        room.width = dimensions.width;
        room.height = dimensions.height;
        room.area = area;
      } else {
        const updatedPolygon = room.floor_polygon.map(point => {
          return {
            x: point.x + deltaX / scale,
            z: point.z + deltaY / scale
          };
        });
        
        room.floor_polygon = updatedPolygon;
      }
      
      updatedRooms[roomIndex] = room;
      
      const totalArea = updatedRooms.reduce((sum, room) => sum + room.area, 0);
      
      return {
        ...prevData,
        rooms: updatedRooms,
        total_area: parseFloat(totalArea.toFixed(2))
      };
    });
    
    setDragState(prev => ({
      ...prev,
      lastX: mouseX,
      lastY: mouseY
    }));
  }, [dragState, reverseTransformCoordinates, scale]);

  const handleMouseUp = useCallback(() => {
    setDragState({
      active: false,
      roomId: null,
      vertexIndex: null,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      isResizing: false
    });
  }, []);

  useEffect(() => {
    if (dragState.active) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      document.addEventListener('touchcancel', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('touchcancel', handleTouchEnd);
      };
    }
  }, [dragState.active, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const checkRoomOverlap = () => {
    const overlaps = [];
    
    for (let i = 0; i < floorPlanData.rooms.length; i++) {
      for (let j = i + 1; j < floorPlanData.rooms.length; j++) {

        const room1 = floorPlanData.rooms[i];
        const room2 = floorPlanData.rooms[j];
        
        const xCoords1 = room1.floor_polygon.map(p => p.x);
        const zCoords1 = room1.floor_polygon.map(p => p.z);
        const minX1 = Math.min(...xCoords1);
        const maxX1 = Math.max(...xCoords1);
        const minZ1 = Math.min(...zCoords1);
        const maxZ1 = Math.max(...zCoords1);
        
        const xCoords2 = room2.floor_polygon.map(p => p.x);
        const zCoords2 = room2.floor_polygon.map(p => p.z);
        const minX2 = Math.min(...xCoords2);
        const maxX2 = Math.max(...xCoords2);
        const minZ2 = Math.min(...zCoords2);
        const maxZ2 = Math.max(...zCoords2);
        
        const overlap = !(
          maxX1 < minX2 || 
          minX1 > maxX2 || 
          maxZ1 < minZ2 || 
          minZ1 > maxZ2
        );
        
        if (overlap) {
          overlaps.push([room1.id, room2.id]);
        }
      }
    }
    
    return overlaps;
  };

  const saveFloorPlan = () => {
    console.log('Floor plan data:', JSON.stringify(floorPlanData));
    alert('Floor plan saved! Check console for data.');
    setHasChanges(false); 
  };

  return (
    <div>
      <style>{styles}</style>

      <div
        ref={floorPlanRef}
        className="floor-plan-container"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: isMobile ? "translate(-40%, -46%)" : "translate(-30%, -49%)",
          width: `${contentWidth * scale}px`,
          height: `${contentHeight * scale}px`,
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        <p style={{textAlign:"center", marginBottom:"-35px"}}>
          <b>Total Area:</b> {floorPlanData.total_area.toFixed(2)} m² &nbsp;|&nbsp;{" "}
          <b>Total Rooms:</b> {floorPlanData.room_count}
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
            x1={transformCoordinates({ x: bounds.minX - 10, z: bounds.minZ }).x + 10}
            y1={transformCoordinates({ x: bounds.minX, z: bounds.minZ }).y + 10}
            x2={transformCoordinates({ x: bounds.minX - 10, z: bounds.maxZ }).x + 10}
            y2={transformCoordinates({ x: bounds.minX, z: bounds.maxZ }).y + 10}
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
            {twidth} m
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
                  fill={roomColors[room.room_type as keyof typeof roomColors] || "#E8E8E8"}
                  onClick={(e) => handleRoomClick(room.id, e)}
                  onMouseDown={(e) => handleMouseDown(e, room.id)}
                  onTouchStart={(e) => handleTouchStart(e, room.id)}
                />
                
                {selectedRoomId === room.id && transformedPoints.map((point, index) => (
                  <circle
                    key={`handle-${room.id}-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={6}
                    className="resize-handle"
                    onMouseDown={(e) => handleVertexMouseDown(e, room.id, index)}
                    onTouchStart={(e) => handleVertexTouchStart(e, room.id, index)}
                  />
                ))}

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
        <div style={{ 
          position: 'absolute', 
          bottom: '-20px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          marginTop: '20px' 
        }}>
          <button onClick={saveFloorPlan}>Save Floor Plan</button>
        </div>
      )}
      </div>
    </div>
  );
}