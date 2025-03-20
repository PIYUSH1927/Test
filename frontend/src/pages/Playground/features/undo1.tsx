import React from "react";

interface FloorPlanData {
  room_count: number;
  total_area: number;
  room_types: string[];
  rooms: any[];
}

export const handleUndoChanges = (
  initialFloorPlanData: FloorPlanData,
  setFloorPlanData: React.Dispatch<React.SetStateAction<FloorPlanData>>,
  setSelectedRoomId: React.Dispatch<React.SetStateAction<string | null>>,
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>,
  setRoomRotations: React.Dispatch<React.SetStateAction<{ [key: string]: number }>> 
): void => {
  setFloorPlanData(initialFloorPlanData);
  setSelectedRoomId(null);
  setHasChanges(false);
  setRoomRotations({}); 
};
