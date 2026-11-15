import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { rowEntrance } from '../../lib/motion';
import { useEntranceValues } from '../../lib/useAccessibleMotion';

/** A capped entrance that can snap to rest when motion is reduced. */
export function AnimatedTableRow({ index, reduced, entering = true, className, children }: {
  index: number; reduced: boolean; entering?: boolean; className?: string; children: ReactNode;
}) {
  const entrance = rowEntrance(index, reduced || !entering);
  const values = useEntranceValues(reduced, entrance.initial);
  return <motion.tr {...entrance} style={values} className={className}>{children}</motion.tr>;
}
