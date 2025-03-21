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
  
  export const initialFloorPlanData: FloorPlanData = {
    room_count: 8,
    total_area: 62.57,
    room_types: [
        "MasterRoom",
        "LivingRoom",
        "ChildRoom",
        "Kitchen",
        "Bathroom",
        "Balcony",
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
  };