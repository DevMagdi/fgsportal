export const OPPORTUNITY_STAGES = [
  'review',
  'qualification',
  'rfp',
  'proposal',
  'financial_proposal',
  'submission',
  'submitted',
  'negotiation',
  'won',
  'lost',
  'declined',
] as const;

export const OPEN_STAGES = OPPORTUNITY_STAGES.filter((s) => !['won', 'lost', 'declined'].includes(s));

export const OPPORTUNITY_TYPES = ['opportunity', 'tender', 'project', 'client', 'internal', 'external'] as const;

export const GO_NO_GO = ['pending', 'go', 'no_go'] as const;

export const TASK_STATUSES = ['achieved', 'in_progress', 'not_done'] as const;

export function stageTone(stage: string): 'neutral' | 'brand' | 'accent' | 'warn' | 'danger' | 'success' {
  if (stage === 'won') return 'success';
  if (stage === 'lost' || stage === 'declined') return 'danger';
  if (stage === 'negotiation' || stage === 'submitted') return 'accent';
  if (stage === 'review' || stage === 'qualification') return 'neutral';
  return 'brand';
}
