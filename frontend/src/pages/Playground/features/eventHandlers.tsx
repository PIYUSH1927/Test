// features/eventHandlers.tsx
import React, { useCallback, RefObject, useEffect } from "react";
import {
  handleMouseMove,
  handleTouchMove,
  handleMouseUp,
  handleTouchEnd,
  useNonPassiveTouchHandling,
  showLongPressIndicator  // Import this function from resizing.tsx
} from "./resizing";

interface Point {
  x: number;
  z: number;
}

interface DragState {
  active: boolean;
  roomId: string | null;
  roomIds: string[];
  vertexIndex: number | null;
  edgeIndices: number[] | null;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  isResizing: boolean;
  isEdgeResizing: boolean;
  isGroupOperation: boolean;
  initialPolygons?: Record<string, Point[]>;
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

// Use the same longPress variables as in resizing.tsx
// These should be declared and exported in resizing.tsx, and imported here
// For simplicity, we'll redeclare them here
let longPressTimer: number | null = null;
let isLongPress = false;
const LONG_PRESS_DURATION = 500;

export function setupLongPress(
  event: React.TouchEvent,
  roomId: string,
  callback: () => void
) {
  if (longPressTimer) {
    window.clearTimeout(longPressTimer);
  }

  longPressTimer = window.setTimeout(() => {
    isLongPress = true;
    showLongPressIndicator(roomId, true);
    callback();
    longPressTimer = null;
  }, LONG_PRESS_DURATION);
}

export function cancelLongPress() {
  if (longPressTimer) {
    window.clearTimeout(longPressTimer);
    longPressTimer = null;
  }
}

export function useEventHandlers(
  dragState: DragState,
  svgRef: RefObject<SVGSVGElement>,
  scale: number,
  reverseTransformCoordinates: (
    x: number,
    y: number
  ) => { x: number; z: number },
  calculateRoomDimensions: (polygon: Point[]) => {
    width: number;
    height: number;
  },
  calculateRoomArea: (polygon: Point[]) => number,
  setFloorPlanData: React.Dispatch<React.SetStateAction<FloorPlanData>>,
  setDragState: React.Dispatch<React.SetStateAction<DragState>>,
  checkAndUpdateOverlaps: () => boolean | void
) {
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
    [
      dragState,
      reverseTransformCoordinates,
      scale,
      calculateRoomDimensions,
      calculateRoomArea,
      setFloorPlanData,
    ]
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
    [
      dragState,
      reverseTransformCoordinates,
      scale,
      calculateRoomDimensions,
      calculateRoomArea,
      setFloorPlanData,
    ]
  );

  const handleMouseUpCallback = useCallback(() => {
    handleMouseUp(setDragState, checkAndUpdateOverlaps);
  }, [checkAndUpdateOverlaps, setDragState]);

  const handleTouchEndCallback = useCallback(() => {
    handleTouchEnd(setDragState, checkAndUpdateOverlaps);
  }, [checkAndUpdateOverlaps, setDragState]);

  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (
        dragState.active ||
        document.body.hasAttribute("data-room-touch-interaction")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventScroll);
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
    handleTouchEndCallback,
  };
}

export function handleRoomSelection(
  roomId: string,
  event: React.MouseEvent | React.TouchEvent,
  selectedRoomIds: string[],
  setSelectedRoomIds: React.Dispatch<React.SetStateAction<string[]>>
) {
  event.stopPropagation();

  // For mouse events, use ctrl/cmd key for multi-select
  if ("ctrlKey" in event) {
    const isMultiSelectMode = event.ctrlKey || event.metaKey;
    
    if (isMultiSelectMode) {
      setSelectedRoomIds((prev) => {
        if (prev.includes(roomId)) {
          return prev.filter((id) => id !== roomId);
        } else {
          return [...prev, roomId];
        }
      });
    } else {
      setSelectedRoomIds([roomId]);
    }
  } 
  // For touch events, only toggle selection if in long press mode
  else if ("touches" in event) {
    if (isLongPress) {
      // If long press is detected, toggle selection
      setSelectedRoomIds((prev) => {
        if (prev.includes(roomId)) {
          return prev.filter((id) => id !== roomId);
        } else {
          return [...prev, roomId];
        }
      });
      
      // Show visual feedback
      showLongPressIndicator(roomId, true);
    } else {
      // Regular touch behavior - single selection
      setSelectedRoomIds([roomId]);
    }
  }
}