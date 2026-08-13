import { useState, useEffect } from 'react';

/**
 * useCountUp — Animates a number from 0 to the target value.
 *
 * @param {number} end — The target number
 * @param {number} duration — Animation duration in ms
 * @returns {number} — The current interpolated value
 */
export function useCountUp(end, duration = 1000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const easeOutExpo = (t) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const currentVal = end * easeOutExpo(progress);
      setValue(currentVal);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setValue(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return value;
}
