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
  touch-action: none !important; 
}

svg {
  vector-effect: non-scaling-stroke;
  touch-action: none !important; 
}

.floor-plan-container {
  touch-action: none !important;
}

/* Updated selection styles */
.room-polygon.selected {
  fill: rgba(224, 224, 255, 0.8);
  stroke: #0000ff;
  stroke-width: 4px; 
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 255, 0.3));
}

/* Style for first selected room (primary selection) */
.room-polygon.primary-selection {
  stroke: #1e88e5;
  stroke-width: 4px;
  filter: drop-shadow(0px 0px 5px rgba(30, 136, 229, 0.5));
}

/* Secondary selection style */
.room-polygon.secondary-selection {
  stroke: #0000ff;
  stroke-width: 3px;
  stroke-dasharray: 0;
}

.room-polygon.overlapping {
  stroke: #ff0000;
  stroke-width: 4px;
  stroke-dasharray: 5,5;
}

/* Multi-selection indicator */
.multi-select-indicator {
  fill: rgba(66, 133, 244, 0.1);
  stroke: #4285F4;
  stroke-width: 1px;
  stroke-dasharray: 5,3;
  pointer-events: none;
}

/* Group selection count badge */
.selection-badge {
  fill: #4285F4;
  stroke: white;
  stroke-width: 1px;
  font-size: 12px;
  font-weight: bold;
  text-anchor: middle;
  pointer-events: none;
}

/* Edge handle styles */
.resize-edge {
  cursor: move;
  stroke-opacity: 0.1; /* Always slightly visible */
  transition: stroke-opacity 0.2s;
  touch-action: none !important;
}

.resize-edge:hover {
  stroke-opacity: 0.3;
  stroke: #0000ff;
}

/* Edge indicators */
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
  touch-action: none !important;
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

/* Multi-selection toolbar */
.selection-toolbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 8px 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1000;
}

.selection-count {
  font-weight: bold;
  color: #4285F4;
  margin-right: 8px;
}

.selection-action-button {
  padding: 4px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.selection-action-button.group {
  background-color: #4285F4;
  color: white;
}

.selection-action-button.ungroup {
  background-color: #EA4335;
  color: white;
}

.selection-action-button:hover {
  filter: brightness(1.1);
}

.selection-action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 850px) {
  .room-label {
    font-size: 8px !important;
  }
  
  .room-name {
    font-size: 10px !important;
  }
  
  /* Improve touch targets for mobile */
  .resize-handle {
    r: 8 !important; /* Bigger radius for touch */
  }
  
  .resize-edge {
    stroke-width: 20 !important; /* Much wider to make it easier to tap */
    stroke-opacity: 0.15 !important; /* More visible on mobile */
  }
  
  .edge-indicator {
    stroke-width: 3 !important;
    stroke-opacity: 0.6 !important; /* More visible on mobile */
  }
  
  .room-polygon {
    stroke-width: 4px !important; /* More visible on mobile */
  }
  
  .selection-toolbar {
    padding: 6px 12px;
  }
  
  .selection-action-button {
    padding: 3px 8px;
    font-size: 12px;
  }
}
  .room-polygon.long-press-highlight {
  filter: brightness(1.1) drop-shadow(0 0 8px rgba(255, 255, 0, 0.8));
  stroke: #FFD700;
  stroke-width: 3;
  animation: pulse 0.5s infinite alternate;
}

@keyframes pulse {
  from { filter: brightness(1.1) drop-shadow(0 0 8px rgba(255, 255, 0, 0.8)); }
  to { filter: brightness(1.2) drop-shadow(0 0 12px rgba(255, 255, 0, 0.9)); }
}
`;