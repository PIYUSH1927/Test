import React from "react";
import { applyRotationToPolygon } from "./overlap1"; 

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

function rotatePoint(point: Point, center: { x: number, z: number }, angleDegrees: number): Point {
  const angleRadians = (angleDegrees * Math.PI) / 180;
  
  const translatedX = point.x - center.x;
  const translatedZ = point.z - center.z;

  const rotatedX = translatedX * Math.cos(angleRadians) - translatedZ * Math.sin(angleRadians);
  const rotatedZ = translatedX * Math.sin(angleRadians) + translatedZ * Math.cos(angleRadians);
  
  return {
    x: rotatedX + center.x,
    z: rotatedZ + center.z
  };
}

function applyRoomRotations(
  floorPlanData: FloorPlanData, 
  roomRotations: { [key: string]: number }
): FloorPlanData {
  const updatedRooms = floorPlanData.rooms.map(room => {
    const rotation = roomRotations[room.id] || 0;
    
    if (rotation === 0) {
      return room;
    }

    
    const rotatedPolygon = applyRotationToPolygon(room.floor_polygon, rotation);
    
    return {
      ...room,
      floor_polygon: rotatedPolygon
    };
  });
  
  return {
    ...floorPlanData,
    rooms: updatedRooms
  };
}
  

export function saveFloorPlan(
  floorPlanData: FloorPlanData, 
  roomRotations: { [key: string]: number },
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>
) {
  try {
    const finalFloorPlanData = applyRoomRotations(floorPlanData, roomRotations);
    
   console.log("floorPlanData", JSON.stringify(finalFloorPlanData));
    
    setHasChanges(false);
    
    alert("Floor plan saved successfully!");
    
    return finalFloorPlanData;
  } catch (error) {
    console.error("Error saving floor plan:", error);
    alert("Failed to save floor plan");
    return floorPlanData;
  }
}