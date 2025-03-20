// features/coordinates.tsx
import { useCallback } from "react";

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

export function calculateBounds(rooms: Room[]) {
  const allPoints = rooms.flatMap((room) => room.floor_polygon);
  const minX = Math.min(...allPoints.map((p) => p.x));
  const maxX = Math.max(...allPoints.map((p) => p.x));
  const minZ = Math.min(...allPoints.map((p) => p.z));
  const maxZ = Math.max(...allPoints.map((p) => p.z));

  return { minX, maxX, minZ, maxZ };
}

export function useCoordinateTransforms(bounds: { minX: number; minZ: number; maxX: number; maxZ: number }, padding: number, scale: number) {
  const transformCoordinates = useCallback(
    (point: Point) => {
      return {
        x: (point.x - bounds.minX + padding) * scale,
        y: (point.z - bounds.minZ + padding) * scale,
      };
    },
    [bounds.minX, bounds.minZ, padding, scale]
  );

  const reverseTransformCoordinates = useCallback(
    (x: number, y: number) => {
      return {
        x: x / scale + bounds.minX - padding,
        z: y / scale + bounds.minZ - padding,
      };
    },
    [bounds.minX, bounds.minZ, padding, scale]
  );

  return { transformCoordinates, reverseTransformCoordinates };
}
