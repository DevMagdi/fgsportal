import palette from '../brand.json';
import type { PipelineSegment } from './dashboard';

// Presentation only: retain the underlying stage/delay groups and their counts.
// Delayed and closed outcomes keep their semantic colours; other stages use the
// official secondary palette to make neighbouring segments easier to follow.
const stageColors: Record<string, string> = {
  review: palette.violet,
  qualification: palette.cyan,
  rfp: palette.lavender,
  proposal: palette.turquoise,
  financial_proposal: palette.skin,
  submission: palette.cyan,
  submitted: palette.violet,
  negotiation: palette.lavender,
};

export function pipelineDisplayColor(segment: Pick<PipelineSegment, 'stage' | 'delayed' | 'color'>): string {
  if (segment.delayed || ['won', 'lost', 'declined', 'closed'].includes(segment.stage)) return segment.color;
  return stageColors[segment.stage] ?? segment.color;
}

/** Mix a highlight with the primary ink so small progress arcs remain legible on white. */
export function progressInk(color: string): string {
  const channel = (hex: string, offset: number) => parseInt(hex.slice(offset, offset + 2), 16);
  return `#${[1, 3, 5].map((offset) => Math.round(
    channel(color, offset) * 0.4 + channel(palette.indigo, offset) * 0.6,
  ).toString(16).padStart(2, '0')).join('')}`;
}
