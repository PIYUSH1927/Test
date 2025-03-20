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
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  isResizing: boolean;
}

type SVGRef = RefObject<SVGSVGElement | null>;

// Properly named React Hook for non-passive touch handling
export function useNonPassiveTouchHandling(svgRef: SVGRef) {
  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    // Function to add non-passive event listeners to all room polygons and resize handles
    const addNonPassiveListeners = () => {
      const roomPolygons = svgElement.querySelectorAll('.room-polygon');
      const resizeHandles = svgElement.querySelectorAll('.resize-handle');

      // Remove default touch listeners that might be passive
      roomPolygons.forEach(polygon => {
        polygon.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: false });
      });

      resizeHandles.forEach(handle => {
        handle.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: false });
      });
    };

    // Run once on mount
    addNonPassiveListeners();

    // Also set up a mutation observer to handle dynamically added elements
    const observer = new MutationObserver(addNonPassiveListeners);
    observer.observe(svgElement, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
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
    startX: mouseX,
    startY: mouseY,
    lastX: mouseX,
    lastY: mouseY,
    isResizing: false,
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
    startX: mouseX,
    startY: mouseY,
    lastX: mouseX,
    lastY: mouseY,
    isResizing: true,
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
  // Don't call preventDefault here - it causes errors with passive listeners
  event.stopPropagation();

  if (event.touches.length !== 1) return;

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
    startX: touchX,
    startY: touchY,
    lastX: touchX,
    lastY: touchY,
    isResizing: false,
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
  // Don't call preventDefault here - it causes errors with passive listeners
  event.stopPropagation();

  if (event.touches.length !== 1) return;

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
    startX: touchX,
    startY: touchY,
    lastX: touchX,
    lastY: touchY,
    isResizing: true,
  });

  setSelectedRoomId(roomId);
  setHasChanges(true);
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

  setFloorPlanData((prevData) => {
    const updatedRooms = [...prevData.rooms];
    const roomIndex = updatedRooms.findIndex(
      (room) => room.id === dragState.roomId
    );

    if (roomIndex === -1) return prevData;

    const room = { ...updatedRooms[roomIndex] };

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
      const updatedPolygon = room.floor_polygon.map((point) => {
        return {
          x: point.x + deltaX / scale,
          z: point.z + deltaY / scale,
        };
      });

      room.floor_polygon = updatedPolygon;
    }

    updatedRooms[roomIndex] = room;

    const totalArea = updatedRooms.reduce(
      (sum, room) => sum + room.area,
      0
    );

    return {
      ...prevData,
      rooms: updatedRooms,
      total_area: parseFloat(totalArea.toFixed(2)),
    };
  });

  setDragState((prev) => ({
    ...prev,
    lastX: mouseX,
    lastY: mouseY,
  }));
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

  // Avoid calling preventDefault here if you can
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

  setFloorPlanData((prevData) => {
    const updatedRooms = [...prevData.rooms];
    const roomIndex = updatedRooms.findIndex(
      (room) => room.id === dragState.roomId
    );

    if (roomIndex === -1) return prevData;

    const room = { ...updatedRooms[roomIndex] };

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
      const updatedPolygon = room.floor_polygon.map((point) => {
        return {
          x: point.x + deltaX / scale,
          z: point.z + deltaY / scale,
        };
      });

      room.floor_polygon = updatedPolygon;
    }

    updatedRooms[roomIndex] = room;

    const totalArea = updatedRooms.reduce(
      (sum, room) => sum + room.area,
      0
    );

    return {
      ...prevData,
      rooms: updatedRooms,
      total_area: parseFloat(totalArea.toFixed(2)),
    };
  });

  setDragState((prev) => ({
    ...prev,
    lastX: touchX,
    lastY: touchY,
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
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    isResizing: false,
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
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    isResizing: false,
  });

  checkAndUpdateOverlaps();
}