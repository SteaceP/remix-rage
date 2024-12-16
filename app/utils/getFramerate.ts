import { useState, useEffect } from 'react';

export const useFramerate = () => {
  const [fps, setFps] = useState<number>(60);

  useEffect(() => {
    const frameTimes: number[] = [];
    let lastFrameTime: number = performance.now();
    let animationFrameId: number;

    const updateFrameRate = () => {
      const now: number = performance.now();
      const delta: number = now - lastFrameTime;
      lastFrameTime = now;

      frameTimes.push(delta);
      if (frameTimes.length > 60) {
        frameTimes.shift();
      }

      const averageDelta: number = frameTimes.reduce((sum: number, value: number) => sum + value, 0) / frameTimes.length;
      const calculatedFps: number = 1000 / averageDelta;
      
      if (calculatedFps >= 160 && calculatedFps <= 170) setFps(165);
      else if (calculatedFps >= 110 && calculatedFps <= 130) setFps(120);
      else if (calculatedFps >= 50 && calculatedFps <= 70) setFps(60);
      else setFps(60);

      animationFrameId = requestAnimationFrame(updateFrameRate);
    };
    animationFrameId = requestAnimationFrame(updateFrameRate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return fps;
};
