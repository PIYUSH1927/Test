import { useRef, useEffect } from "react";

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void | undefined>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};