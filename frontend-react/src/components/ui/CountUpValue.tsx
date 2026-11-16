import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';
import { formatNumber } from '../../lib/utils';

/** Animate only the visual copy; assistive technology receives the final value once. */
export function CountUpValue({ value, lang }: { value: number; lang: string }) {
  const reduced = usePrefersReducedMotion();
  const canAnimate = Number.isFinite(value);
  const current = useRef(reduced || !canAnimate ? value : 0);
  const [display, setDisplay] = useState(current.current);

  useEffect(() => {
    if (reduced || !canAnimate) {
      current.current = value;
      setDisplay(value);
      return;
    }
    const controls = animate(Number.isFinite(current.current) ? current.current : 0, value, {
      duration: 0.7,
      ease: 'easeOut',
      onUpdate: (next) => {
        const rounded = Math.round(next);
        if (rounded !== current.current) {
          current.current = rounded;
          setDisplay(rounded);
        }
      },
    });
    return () => controls.stop();
  }, [value, reduced, canAnimate]);

  return <span className="relative inline-block max-w-full break-all"><span aria-hidden="true">{formatNumber(reduced || !canAnimate ? value : display, lang)}</span><span className="sr-only">{formatNumber(value, lang)}</span></span>;
}
