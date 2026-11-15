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
