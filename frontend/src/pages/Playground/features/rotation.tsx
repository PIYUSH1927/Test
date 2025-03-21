// Updated rotation.tsx
import { checkRoomOverlap } from "./overlap1";

export const handleRotateRoom = (
  roomId: string,
  direction: "left" | "right",
  roomRotations: { [key: string]: number },
  setRoomRotations: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>,
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>,
  checkAndUpdateOverlaps: () => void,
  selectedRoomIds: string[] = [] 
) => {
  const rotationAmount = direction === "right" ? 15 : -15;
  
  setRoomRotations((prevRotations) => {
    const newRotations = { ...prevRotations };
    if (selectedRoomIds.length > 1 && selectedRoomIds.includes(roomId)) {
      selectedRoomIds.forEach(id => {
        newRotations[id] = (prevRotations[id] || 0) + rotationAmount;
      });
    } else {
      newRotations[roomId] = (prevRotations[roomId] || 0) + rotationAmount;
    }

    setTimeout(() => {
      checkAndUpdateOverlaps();
    }, 10);

    return newRotations;
  });

  setHasChanges(true);
};

export const checkAndUpdateOverlaps = (
  floorPlanData: any,
  roomRotations: { [key: string]: number },
  setOverlappingRooms: React.Dispatch<React.SetStateAction<string[][]>>
) => {
  const overlaps = checkRoomOverlap(floorPlanData, roomRotations);
  setOverlappingRooms(overlaps);
  return overlaps.length > 0;
};