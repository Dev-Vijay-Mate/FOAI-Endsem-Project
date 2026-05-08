import { useState, useEffect, useRef } from 'react';
import { animateValue } from '../utils/helpers';

/**
 * Custom hook for animated counter display
 */
export function useAnimatedCounter(targetValue, duration = 800) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    if (targetValue === prevRef.current) return;
    const start = prevRef.current;
    animateValue(start, targetValue, duration, setDisplayValue);
    prevRef.current = targetValue;
  }, [targetValue, duration]);

  return displayValue;
}
