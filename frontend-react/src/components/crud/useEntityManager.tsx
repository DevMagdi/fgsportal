import { useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { ENTITY_CONFIG } from '../../lib/entity-config';
import { hasAbility } from '../../lib/abilities';
import type { EntityKind, EntityMap, EntityPayload } from '../../lib/types';
import { useAuth } from '../../auth/AuthContext';
import { useI18n } from '../../i18n';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useToast } from '../ui/Toast';
import { EntityDialog } from './EntityDialog';

const queryNames: Record<EntityKind, string> = {
  units: 'units', employees: 'directory', opportunities: 'opportunities', bonuses: 'bonuses', teams: 'teams', plans: 'plans', tasks: 'my-tasks',
  leads: 'leads', meetings: 'meetings', products: 'products', recruitment: 'recruitment', development: 'development', procurement: 'procurement',
  events: 'events', documents: 'documents', procedures: 'procedures',
};

type Snapshot = [QueryKey, unknown][];

class PartialRemoveError extends Error {
  constructor(message: string, readonly completed: number[]) { super(message); }
}

export function useEntityManager<K extends EntityKind>(kind: K, options?: { onDeleted?: () => void }) {
  const { abilities } = useAuth();
  const canManage = hasAbility(abilities, ENTITY_CONFIG[kind].permission);
  const { t } = useI18n();
  const toast = useToast();
  const client = useQueryClient();
  const [dialog, setDialog] = useState<{ record: EntityMap[K] | null; defaults?: EntityPayload; instance: number } | null>(null);
  // A rapidly reopened form must be fresh even while the previous one is exiting.
  const dialogInstance = useRef(0);
  const [deletion, setDeletion] = useState<{ ids: number[]; name: string } | null>(null);
  const prefix = ['bms', queryNames[kind]];

  const save = useMutation({
    mutationFn: ({ data, id }: { data: EntityPayload; id?: number }) => id ? api.update(kind, id, data) : api.create(kind, data),
    onMutate: async ({ data, id }) => {
      if (!id) return undefined;
      await client.cancelQueries({ queryKey: prefix });
      const snapshots = client.getQueriesData({ queryKey: prefix });
      client.setQueriesData({ queryKey: prefix }, (old: unknown) => Array.isArray(old) ? old.map((item: { id: number }) => item.id === id ? { ...item, ...data } : item) : old);
      return snapshots;
    },
    onError: (error, _variables, snapshots) => {
      snapshots?.forEach(([key, value]) => client.setQueryData(key, value));
      toast.error(error instanceof Error ? error.message : t('saveError'));
    },
    onSuccess: (_result, variables) => { toast.success(variables.id ? t('updatedSuccess') : t('createdSuccess')); setDialog(null); },
    onSettled: () => { void client.invalidateQueries({ queryKey: ['bms'] }); },
  });
  const remove = useMutation({
    mutationFn: async (ids: number[]) => {
      const completed: number[] = [];
      for (const id of ids) {
        try { await api.remove(kind, id); completed.push(id); }
        catch (error) {
          const message = error instanceof Error ? error.message : t('deleteError');
          if (completed.length) {
            throw new PartialRemoveError(t('bulkPartial').replace('{completed}', String(completed.length)).replace('{total}', String(ids.length)).replace('{message}', message), completed);
          }
          throw error;
        }
      }
    },
    onMutate: async (ids) => {
      await client.cancelQueries({ queryKey: prefix });
      const snapshots: Snapshot = client.getQueriesData({ queryKey: prefix });
      client.setQueriesData({ queryKey: prefix }, (old: unknown) => Array.isArray(old) ? old.filter((item: { id: number }) => !ids.includes(item.id)) : old);
      return snapshots;
    },
    onError: (error, _ids, snapshots) => {
      const completed = error instanceof PartialRemoveError ? error.completed : [];
      snapshots?.forEach(([key, value]) => client.setQueryData(key, Array.isArray(value) ? value.filter((item: { id: number }) => !completed.includes(item.id)) : value));
      // A bulk request can partially succeed. Don't leave a retry dialog pointing
      // at records already processed; refetch authoritative state instead.
      if (completed.length) setDeletion(null);
      toast.error(error instanceof Error ? error.message : t('deleteError'));
    },
    onSuccess: () => { toast.success(!api.demo && kind === 'employees' ? t('deactivatedSuccess') : !api.demo && kind === 'products' ? t('archivedSuccess') : !api.demo && kind === 'meetings' ? t('cancelledSuccess') : t('deletedSuccess')); setDeletion(null); options?.onDeleted?.(); },
    onSettled: () => { void client.invalidateQueries({ queryKey: ['bms'] }); },
  });
  const action = !api.demo && kind === 'employees' ? { label: t('deactivateEmployee'), warning: t('deactivateWarning') }
    : !api.demo && kind === 'products' ? { label: t('archiveProduct'), warning: t('archiveWarning') }
    : !api.demo && kind === 'meetings' ? { label: t('cancelMeeting'), warning: t('cancelMeetingWarning') }
    : null;
  return {
    canManage,
    openCreate: (defaults?: EntityPayload) => setDialog({ record: null, defaults, instance: ++dialogInstance.current }),
    openEdit: (record: EntityMap[K]) => {
      // Directory list records omit manager and work-degree IDs; load the full
      // employee before editing so unchanged fields are never cleared.
      if (kind === 'employees') {
        void api.employee(record.id).then((full) => setDialog({ record: full as EntityMap[K], instance: ++dialogInstance.current })).catch((error) => toast.error(error instanceof Error ? error.message : t('errorTitle')));
      } else setDialog({ record, instance: ++dialogInstance.current });
    },
    openDelete: (record: EntityMap[K], name: string) => setDeletion({ ids: [record.id], name }),
    openBulkDelete: (ids: number[]) => setDeletion({ ids, name: `${ids.length} ${t('selectedCount')}` }),
    dialogs: <>
      <AnimatePresence mode="wait">
        {dialog && <EntityDialog key={`${kind}-${dialog.instance}`} kind={kind} record={dialog.record} defaults={dialog.defaults} onClose={() => setDialog(null)} busy={save.isPending} onSave={async (data, id) => { await save.mutateAsync({ data, id }); }} />}
      </AnimatePresence>
      <ConfirmDialog open={Boolean(deletion)} onClose={() => setDeletion(null)} onConfirm={() => { if (deletion) remove.mutate(deletion.ids); }} name={deletion?.name} title={action ? `${action.label}?` : undefined} message={action?.warning} confirmLabel={action?.label} busy={remove.isPending} />
    </>,
  };
}
