import { checkRoomOverlap } from "./overlap1";

export const handleRotateRoom = (
  roomId: string,
  direction: "left" | "right",
  roomRotations: { [key: string]: number },
  setRoomRotations: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>,
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>,
  checkAndUpdateOverlaps: () => void
) => {
  const rotationAmount = direction === "right" ? 15 : -15;
  
  setRoomRotations((prevRotations) => {
    const newRotations = {
      ...prevRotations,
      [roomId]: (prevRotations[roomId] || 0) + rotationAmount,
    };

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