import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useEntityManager } from '../components/crud/useEntityManager';
import { useAuth } from '../auth/AuthContext';
import { hasAbility } from '../lib/abilities';
import { api } from '../lib/api';
import { useI18n } from '../i18n';
import { Avatar, displayName } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import type { BusinessUnit } from '../lib/types';

export function OrganizationPage() {
  const { t } = useI18n();
  const { abilities } = useAuth();
  const canViewTeams = hasAbility(abilities, 'teams.view');
  const unitsQ = useQuery({ queryKey: ['bms', 'units'], queryFn: () => api.units() });
  const teamsQ = useQuery({ queryKey: ['bms', 'teams'], queryFn: () => api.teams(), enabled: canViewTeams });
  const [selected, setSelected] = useState<number | null>(null);
  const manager = useEntityManager('teams');

  const units = unitsQ.data ?? [];
  const roots = useMemo(() => units.filter((u) => !u.parent_id), [units]);
  const childrenOf = (id: number) => units.filter((u) => u.parent_id === id);
  const current = units.find((u) => u.id === selected) ?? roots[0];
  const currentUnit = useQuery({ queryKey: ['bms', 'unit', String(current?.id ?? '')], queryFn: () => api.unit(current!.id), enabled: Boolean(current) && manager.canManage && !api.demo });
  const canCreateTeam = Boolean(current && canViewTeams && manager.canManage && (api.demo || currentUnit.data?.can_manage_teams));
  const teams = (teamsQ.data ?? []).filter((tm) => !current || tm.business_unit_id === current.id);

  if (unitsQ.isLoading || teamsQ.isLoading) return <LoadingState />;
  if (unitsQ.isError) return <ErrorState message={(unitsQ.error as Error)?.message} onRetry={() => void unitsQ.refetch()} />;
  if (teamsQ.isError) return <ErrorState message={(teamsQ.error as Error)?.message} onRetry={() => void teamsQ.refetch()} />;

  return (
    <div className="space-y-5">
      <PageHeader eyebrow={t('grpOrganization')} title={t('organization')} subtitle={t('structure')} actions={canCreateTeam && <Button onClick={() => manager.openCreate({ business_unit_id: current!.id })}><Plus size={16} />{t('newTeam')}</Button>} />
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card className="p-3">
          <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{t('units')}</div>
          <ul className="space-y-0.5">
            {roots.map((u) => (
              <UnitNode key={u.id} unit={u} childrenOf={childrenOf} selected={current?.id} onSelect={setSelected} />
            ))}
          </ul>
        </Card>
        <div className="space-y-4">
          {current && (
            <Card className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <Link to={`/units/${current.id}`} className="text-lg font-semibold text-slate-900 hover:underline">{current.name}</Link>
                  <p className="mt-1 text-sm text-slate-500">{current.description || '—'}</p>
                </div>
                <Badge tone={current.is_active ? 'success' : 'neutral'}>{current.is_active ? t('active') : t('inactive')}</Badge>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <Avatar name={displayName(current.director)} size="sm" />
                {t('director')}: {displayName(current.director)}
              </div>
            </Card>
          )}
          <Card>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 text-sm font-semibold"><span>{t('teams')}</span>{canCreateTeam && <Button size="sm" variant="secondary" onClick={() => manager.openCreate({ business_unit_id: current!.id })}><Plus size={14} />{t('newTeam')}</Button>}</div>
            {!canViewTeams ? <EmptyState body={t('noAccessBody')} /> : teams.length === 0 ? <EmptyState /> : (
              <ul className="divide-y divide-slate-100">
                {teams.map((tm) => (
                  <li key={tm.id} className="px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-800">{tm.name}</div>
                        <div className="text-xs text-slate-400">{tm.description}</div>
                      </div>
                      <div className="flex items-center gap-2"><Badge>{tm.members_count ?? tm.members?.length ?? 0} {t('members')}</Badge>{manager.canManage && (api.demo || tm.can_manage === true) && <><button onClick={() => manager.openEdit(tm)} aria-label={`${t('edit')} ${tm.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-brand-600"><Pencil size={15} /></button><button onClick={() => manager.openDelete(tm, tm.name)} aria-label={`${t('remove')} ${tm.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-brand-600"><Trash2 size={15} /></button></>}</div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">{t('teamLead')}: {displayName(tm.lead)}</div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
      {manager.dialogs}
    </div>
  );
}

function UnitNode({
  unit, childrenOf, selected, onSelect, depth = 0,
}: {
  unit: BusinessUnit;
  childrenOf: (id: number) => BusinessUnit[];
  selected?: number;
  onSelect: (id: number) => void;
  depth?: number;
}) {
  const kids = childrenOf(unit.id);
  return (
    <li>
      <button
        onClick={() => onSelect(unit.id)}
        className={`flex w-full rounded-lg px-2 py-1.5 text-start text-sm ${selected === unit.id ? 'bg-brand-50 font-medium text-brand-800' : 'text-slate-600 hover:bg-slate-50'}`}
        style={{ paddingInlineStart: 8 + depth * 14 }}
      >
        {unit.name}
      </button>
      {kids.length > 0 && (
        <ul>
          {kids.map((c) => (
            <UnitNode key={c.id} unit={c} childrenOf={childrenOf} selected={selected} onSelect={onSelect} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
