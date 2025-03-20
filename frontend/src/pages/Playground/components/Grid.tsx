import { useRef, useEffect } from "react";

interface InfiniteGridProps {
  width: number;
  height: number;
  scale: number;
  position: { x: number; y: number };
  rotation: number;
}

export const InfiniteGrid = ({ width, height, scale, position, rotation }: InfiniteGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    updateCanvasSize();

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gridSize = 20 * scale;
      const smallGridSize = gridSize / 5; 
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1;

      const offsetX = (position.x * scale) % gridSize;
      const offsetY = (position.y * scale) % gridSize;

      for (let x = offsetX; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = offsetY; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      if (scale > 2) {
        ctx.strokeStyle = "#F0F4F8"; 
        ctx.lineWidth = 0.5;

        const smallOffsetX = (position.x * scale) % smallGridSize;
        const smallOffsetY = (position.y * scale) % smallGridSize;

        for (let x = smallOffsetX; x < canvas.width; x += smallGridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }

        for (let y = smallOffsetY; y < canvas.height; y += smallGridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }
    };

    
    const handleResize = () => {
      updateCanvasSize();
      drawGrid();
    };

    window.addEventListener('resize', handleResize);
    drawGrid();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [scale, position, rotation]);

  return (
    <div
      style={{
        position: "relative",

      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
      />

    </div>
  );
};