import React, { useState, useCallback, RefObject, useEffect } from "react";

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
  edgeIndices: number[] | null; // Array containing the two vertex indices that form the edge
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  isResizing: boolean;
  isEdgeResizing: boolean; // New flag for edge resizing
}

type SVGRef = RefObject<SVGSVGElement | null>;

// Properly named React Hook for non-passive touch handling
export function useNonPassiveTouchHandling(svgRef: SVGRef) {
  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    // This function will be applied to the SVG element directly
    const handleTouchStart = (e: TouchEvent) => {
      if (e.target && 
         ((e.target as HTMLElement).classList.contains('resize-handle') || 
          (e.target as HTMLElement).classList.contains('resize-edge') || 
          (e.target as HTMLElement).classList.contains('room-polygon'))) {
        // Only prevent default for our interactive elements
        e.preventDefault();
        document.body.setAttribute("data-room-touch-interaction", "true");
      }
    };

    // This prevents scrolling while dragging
    const handleTouchMove = (e: TouchEvent) => {
      if (document.body.hasAttribute("data-room-touch-interaction")) {
        e.preventDefault();
      }
    };

    // Add directly to the SVG with non-passive option
    svgElement.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    
    return () => {
      svgElement.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [svgRef]);
}

export function handleMouseDown(
  event: React.MouseEvent, 
  roomId: string,
  svgRef: SVGRef,
  setDragState: React.Dispatch<React.SetStateAction<DragState>>,
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedRoomId: React.Dispatch<React.SetStateAction<string | null>>
) {
  event.stopPropagation();
  
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
    edgeIndices: null,
    startX: mouseX,
    startY: mouseY,
    lastX: mouseX,
    lastY: mouseY,
    isResizing: false,
    isEdgeResizing: false
  });

  setHasChanges(true);
  setSelectedRoomId(roomId);
}

export function handleVertexMouseDown(
  event: React.MouseEvent,
  roomId: string,
  vertexIndex: number,
  svgRef: SVGRef,
  setDragState: React.Dispatch<React.SetStateAction<DragState>>,
  setSelectedRoomId: React.Dispatch<React.SetStateAction<string | null>>,
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>
) {
  event.stopPropagation();

  const svgElement = svgRef.current;
  if (!svgElement) return;

  const svgRect = svgElement.getBoundingClientRect();
  const mouseX = event.clientX - svgRect.left;
  const mouseY = event.clientY - svgRect.top;

  setDragState({
    active: true,
    roomId,
    vertexIndex,
    edgeIndices: null,
    startX: mouseX,
    startY: mouseY,
    lastX: mouseX,
    lastY: mouseY,
    isResizing: true,
    isEdgeResizing: false
  });

  setSelectedRoomId(roomId);
  setHasChanges(true);
}

// New function for edge mouse down
export function handleEdgeMouseDown(
  event: React.MouseEvent,
  roomId: string,
  edgeIndices: number[], // The indices of the two vertices that form the edge
  svgRef: SVGRef,
  setDragState: React.Dispatch<React.SetStateAction<DragState>>,
  setSelectedRoomId: React.Dispatch<React.SetStateAction<string | null>>,
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>
) {
  event.stopPropagation();

  const svgElement = svgRef.current;
  if (!svgElement) return;

  const svgRect = svgElement.getBoundingClientRect();
  const mouseX = event.clientX - svgRect.left;
  const mouseY = event.clientY - svgRect.top;

  setDragState({
    active: true,
    roomId,
    vertexIndex: null,
    edgeIndices,
    startX: mouseX,
    startY: mouseY,
    lastX: mouseX,
    lastY: mouseY,
    isResizing: true,
    isEdgeResizing: true
  });

  setSelectedRoomId(roomId);
  setHasChanges(true);
}

export function handleTouchStart(
  event: React.TouchEvent,
  roomId: string,
  svgRef: SVGRef,
  setDragState: React.Dispatch<React.SetStateAction<DragState>>,
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedRoomId: React.Dispatch<React.SetStateAction<string | null>>
) {
  // DON'T call preventDefault here - it causes errors with passive listeners
  event.stopPropagation();

  if (event.touches.length !== 1) return;

  // This attribute will be used to detect and stop scrolling
  document.body.setAttribute("data-room-touch-interaction", "true");

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
    edgeIndices: null,
    startX: touchX,
    startY: touchY,
    lastX: touchX,
    lastY: touchY,
    isResizing: false,
    isEdgeResizing: false
  });

  setHasChanges(true);
  setSelectedRoomId(roomId);
}

export function handleVertexTouchStart(
  event: React.TouchEvent,
  roomId: string,
  vertexIndex: number,
  svgRef: SVGRef,
  setDragState: React.Dispatch<React.SetStateAction<DragState>>,
  setSelectedRoomId: React.Dispatch<React.SetStateAction<string | null>>,
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>
) {
  // DON'T call preventDefault here - it causes errors with passive listeners
  event.stopPropagation();

  if (event.touches.length !== 1) return;

  // This attribute will be used to detect and stop scrolling
  document.body.setAttribute("data-room-touch-interaction", "true");

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
    edgeIndices: null,
    startX: touchX,
    startY: touchY,
    lastX: touchX,
    lastY: touchY,
    isResizing: true,
    isEdgeResizing: false
  });

  setSelectedRoomId(roomId);
  setHasChanges(true);
}

// New function for edge touch start
export function handleEdgeTouchStart(
  event: React.TouchEvent,
  roomId: string,
  edgeIndices: number[],
  svgRef: SVGRef,
  setDragState: React.Dispatch<React.SetStateAction<DragState>>,
  setSelectedRoomId: React.Dispatch<React.SetStateAction<string | null>>,
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>
) {
  // DON'T call preventDefault here - it causes errors with passive listeners
  event.stopPropagation();

  if (event.touches.length !== 1) return;

  // This attribute will be used to detect and stop scrolling
  document.body.setAttribute("data-room-touch-interaction", "true");

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
    edgeIndices,
    startX: touchX,
    startY: touchY,
    lastX: touchX,
    lastY: touchY,
    isResizing: true,
    isEdgeResizing: true
  });

  setSelectedRoomId(roomId);
  setHasChanges(true);
}

// Helper function to calculate the edge midpoint
export function getEdgeMidpoint(point1: Point, point2: Point): Point {
  return {
    x: (point1.x + point2.x) / 2,
    z: (point1.z + point2.z) / 2
  };
}

// Helper function to calculate the normal vector of an edge
export function getEdgeNormal(point1: Point, point2: Point): { x: number; z: number } {
  // Calculate the direction vector of the edge
  const dx = point2.x - point1.x;
  const dz = point2.z - point1.z;
  
  // Normalize the direction vector
  const length = Math.sqrt(dx * dx + dz * dz);
  if (length === 0) return { x: 0, z: 0 };
  
  // Calculate the normal vector (perpendicular to the edge)
  // For a 2D vector (x,y), the perpendicular vector can be (-y,x) or (y,-x)
  return {
    x: -dz / length,
    z: dx / length
  };
}

export function handleMouseMove(
  event: MouseEvent,
  dragState: DragState,
  svgRef: SVGRef,
  scale: number,
  reverseTransformCoordinates: (x: number, y: number) => { x: number; z: number },
  calculateRoomDimensions: (polygon: Point[]) => { width: number; height: number },
  calculateRoomArea: (polygon: Point[]) => number,
  setFloorPlanData: React.Dispatch<React.SetStateAction<FloorPlanData>>,
  setDragState: React.Dispatch<React.SetStateAction<DragState>>
) {
  if (!dragState.active || !dragState.roomId) return;

  const svgElement = svgRef.current;
  if (!svgElement) return;

  const svgRect = svgElement.getBoundingClientRect();
  const mouseX = event.clientX - svgRect.left;
  const mouseY = event.clientY - svgRect.top;

  const deltaX = mouseX - dragState.lastX;
  const deltaY = mouseY - dragState.lastY;

  updateRoomPosition(
    dragState,
    mouseX,
    mouseY,
    deltaX,
    deltaY,
    scale,
    reverseTransformCoordinates,
    calculateRoomDimensions,
    calculateRoomArea,
    setFloorPlanData,
    setDragState
  );
}

export function handleTouchMove(
  event: TouchEvent,
  dragState: DragState,
  svgRef: SVGRef,
  scale: number,
  reverseTransformCoordinates: (x: number, y: number) => { x: number; z: number },
  calculateRoomDimensions: (polygon: Point[]) => { width: number; height: number },
  calculateRoomArea: (polygon: Point[]) => number,
  setFloorPlanData: React.Dispatch<React.SetStateAction<FloorPlanData>>,
  setDragState: React.Dispatch<React.SetStateAction<DragState>>
) {
  if (!dragState.active || !dragState.roomId) return;

  // We don't call preventDefault here - it's handled by the event listener in useNonPassiveTouchHandling
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

  // Only update if there's a significant movement (helps with jittery touch)
  if (Math.abs(deltaX) < 0.1 && Math.abs(deltaY) < 0.1) return;

  updateRoomPosition(
    dragState,
    touchX,
    touchY,
    deltaX,
    deltaY,
    scale,
    reverseTransformCoordinates,
    calculateRoomDimensions,
    calculateRoomArea,
    setFloorPlanData,
    setDragState
  );
}

// Extracted common logic to avoid duplication
function updateRoomPosition(
  dragState: DragState,
  cursorX: number,
  cursorY: number,
  deltaX: number,
  deltaY: number,
  scale: number,
  reverseTransformCoordinates: (x: number, y: number) => { x: number; z: number },
  calculateRoomDimensions: (polygon: Point[]) => { width: number; height: number },
  calculateRoomArea: (polygon: Point[]) => number,
  setFloorPlanData: React.Dispatch<React.SetStateAction<FloorPlanData>>,
  setDragState: React.Dispatch<React.SetStateAction<DragState>>
) {
  setFloorPlanData((prevData) => {
    const updatedRooms = [...prevData.rooms];
    const roomIndex = updatedRooms.findIndex(
      (room) => room.id === dragState.roomId
    );

    if (roomIndex === -1) return prevData;

    const room = { ...updatedRooms[roomIndex] };
    const updatedPolygon = [...room.floor_polygon];

    if (dragState.isResizing) {
      if (dragState.vertexIndex !== null) {
        // Vertex resizing
        const point = reverseTransformCoordinates(cursorX, cursorY);
        updatedPolygon[dragState.vertexIndex] = point;
      } else if (dragState.isEdgeResizing && dragState.edgeIndices) {
        // Edge resizing
        const [idx1, idx2] = dragState.edgeIndices;
        
        // Get the current positions of the edge vertices
        const vertex1 = updatedPolygon[idx1];
        const vertex2 = updatedPolygon[idx2];
        
        // Calculate the normal vector to the edge (perpendicular direction)
        const normal = getEdgeNormal(vertex1, vertex2);
        
        // Get cursor movement in world coordinates
        const cursorPoint = reverseTransformCoordinates(cursorX, cursorY);
        const prevCursorPoint = reverseTransformCoordinates(dragState.lastX, dragState.lastY);
        const movementX = cursorPoint.x - prevCursorPoint.x;
        const movementZ = cursorPoint.z - prevCursorPoint.z;
        
        // Project the movement onto the normal vector (perpendicular to the edge)
        const movementAlongNormal = movementX * normal.x + movementZ * normal.z;
        
        // Move both vertices of the edge along the normal vector
        updatedPolygon[idx1] = {
          x: vertex1.x + normal.x * movementAlongNormal,
          z: vertex1.z + normal.z * movementAlongNormal
        };
        
        updatedPolygon[idx2] = {
          x: vertex2.x + normal.x * movementAlongNormal,
          z: vertex2.z + normal.z * movementAlongNormal
        };
      }
      
      // Recalculate room dimensions and area after resizing
      const dimensions = calculateRoomDimensions(updatedPolygon);
      const area = calculateRoomArea(updatedPolygon);

      room.floor_polygon = updatedPolygon;
      room.width = dimensions.width;
      room.height = dimensions.height;
      room.area = area;
    } else {
      // Room dragging - move all vertices
      for (let i = 0; i < updatedPolygon.length; i++) {
        updatedPolygon[i] = {
          x: updatedPolygon[i].x + deltaX / scale,
          z: updatedPolygon[i].z + deltaY / scale,
        };
      }

      room.floor_polygon = updatedPolygon;
    }

    updatedRooms[roomIndex] = room;

    // Recalculate total area
    const totalArea = updatedRooms.reduce((sum, room) => sum + room.area, 0);

    return {
      ...prevData,
      rooms: updatedRooms,
      total_area: parseFloat(totalArea.toFixed(2)),
    };
  });

  // Update last cursor position for next movement calculation
  setDragState((prev) => ({
    ...prev,
    lastX: cursorX,
    lastY: cursorY,
  }));
}

export function handleMouseUp(
  setDragState: React.Dispatch<React.SetStateAction<DragState>>,
  checkAndUpdateOverlaps: () => boolean | void
) {
  setDragState({
    active: false,
    roomId: null,
    vertexIndex: null,
    edgeIndices: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    isResizing: false,
    isEdgeResizing: false
  });

  checkAndUpdateOverlaps();
}

export function handleTouchEnd(
  setDragState: React.Dispatch<React.SetStateAction<DragState>>,
  checkAndUpdateOverlaps: () => boolean | void
) {
  document.body.removeAttribute("data-room-touch-interaction");

  setDragState({
    active: false,
    roomId: null,
    vertexIndex: null,
    edgeIndices: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    isResizing: false,
    isEdgeResizing: false
  });

  checkAndUpdateOverlaps();
}

export function renderEdgeHandles(
  room: Room,
  transformCoordinates: (point: Point) => { x: number; y: number },
  handleEdgeMouseDown: (event: React.MouseEvent, roomId: string, edgeIndices: number[], svgRef: RefObject<SVGSVGElement | null>, setDragState: React.Dispatch<React.SetStateAction<DragState>>, setSelectedRoomId: React.Dispatch<React.SetStateAction<string | null>>, setHasChanges: React.Dispatch<React.SetStateAction<boolean>>) => void,
  handleEdgeTouchStart: (event: React.TouchEvent, roomId: string, edgeIndices: number[], svgRef: RefObject<SVGSVGElement | null>, setDragState: React.Dispatch<React.SetStateAction<DragState>>, setSelectedRoomId: React.Dispatch<React.SetStateAction<string | null>>, setHasChanges: React.Dispatch<React.SetStateAction<boolean>>) => void,
  svgRef: RefObject<SVGSVGElement | null>,
  setDragState: React.Dispatch<React.SetStateAction<DragState>>,
  setSelectedRoomId: React.Dispatch<React.SetStateAction<string | null>>,
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>,
  isMobile: boolean
) {
  const edgeHandles = [];
  const polygon = room.floor_polygon;
  const transformedPolygon = polygon.map(transformCoordinates);

  for (let i = 0; i < polygon.length; i++) {
    const nextIndex = (i + 1) % polygon.length;
    const point1 = transformedPolygon[i];
    const point2 = transformedPolygon[nextIndex];
    
    // Calculate the midpoint of the edge
    const midX = (point1.x + point2.x) / 2;
    const midY = (point1.y + point2.y) / 2;
    
    // Calculate edge direction vector
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    
    // Calculate edge length
    const edgeLength = Math.sqrt(dx * dx + dy * dy);
    
    // Skip very short edges
    if (edgeLength < 15) continue;

    // Calculate normalized direction vector
    const dirX = dx / edgeLength;
    const dirY = dy / edgeLength;
    
    // Edge handle width - make it bigger on mobile
    const handleWidth = Math.min(edgeLength * 0.9, isMobile ? 60 : 40);
    
    // Create edge handle positions
    const x1 = midX - (handleWidth / 2) * dirX;
    const y1 = midY - (handleWidth / 2) * dirY;
    const x2 = midX + (handleWidth / 2) * dirX;
    const y2 = midY + (handleWidth / 2) * dirY;
    
    // Define edge handle as a line with substantial thickness
    edgeHandles.push(
      <line
        key={`edge-handle-${room.id}-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className="resize-edge"
        strokeWidth={isMobile ? 30 : 16} // Much thicker on mobile
        stroke="rgba(0,0,255,0.2)" // Slightly visible always, especially for mobile
        strokeLinecap="round"
        onMouseDown={(e) => handleEdgeMouseDown(e, room.id, [i, nextIndex], svgRef, setDragState, setSelectedRoomId, setHasChanges)}
        onTouchStart={(e) => handleEdgeTouchStart(e, room.id, [i, nextIndex], svgRef, setDragState, setSelectedRoomId, setHasChanges)}
      />
    );
    
    // Visual indicator for the edge handle
    edgeHandles.push(
      <line
        key={`edge-indicator-${room.id}-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className="edge-indicator"
        strokeWidth={isMobile ? 3 : 4}
        strokeDasharray={isMobile ? "2,2" : "3,3"}  // Smaller dashes on mobile
        stroke="rgba(0,0,0,0.6)"
        strokeLinecap="round"
        pointerEvents="none"
      />
    );
  }

  return edgeHandles;
}