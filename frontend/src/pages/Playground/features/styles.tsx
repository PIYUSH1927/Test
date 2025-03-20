// features/styles.tsx

export const roomColors: Record<string, string> = {
  MasterRoom: "#FFD3B6",
  LivingRoom: "#FFAAA5",
  ChildRoom: "#D5AAFF",
  Kitchen: "#FFCC5C",
  Bathroom: "#85C1E9",
  Balcony: "#B2DFDB",
  SecondRoom: "#F6D55C",
  DiningRoom: "#A5D6A7",
};

export const floorPlanStyles = `
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

.room-polygon.overlapping {
  stroke: #ff0000;
  stroke-width: 4px;
  stroke-dasharray: 5,5;
}

/* Edge handle styles */
.resize-edge {
  cursor: move;
  stroke-opacity: 0;
  transition: stroke-width 0.2s;
}

.resize-edge:hover {
  stroke-opacity: 0.2;
  stroke: #0000ff;
}

.edge-indicator {
  stroke-opacity: 0;
  transition: stroke-opacity 0.2s ease-in-out;
  pointer-events: none;
}

.resize-edge:hover + .edge-indicator,
.resize-edge:active + .edge-indicator {
  stroke-opacity: 1;
  stroke: #0000ff;
}

/* Vertex handle styles */
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
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button {
  background-color: #4CAF50;
  color: white;

}

.save-button:hover {
  background-color: #45a049;
}

.undo-button {
  background-color: #f44336;
  color: white;
}

.undo-button:hover {
  background-color: #d32f2f;
}

.buttons-container {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.overlap-alert {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(244, 67, 54, 0.8); 
  color: white;
  padding: 10px 15px;
  text-align: center;
  font-weight: bold;
  z-index: 9999;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}
  

@media (max-width: 850px) {
  .room-label {
    font-size: 8px !important;
  }
  
  .room-name {
    font-size: 10px !important;
  }

  .resize-handle {
    r: 5;
  }
  
  .resize-edge {
    stroke-width: 10;
  }
  
  .edge-indicator {
    stroke-width: 2;
  }
}
`;