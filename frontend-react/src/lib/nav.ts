import {
  BarChart3, Briefcase, Building2, Calendar, CalendarCheck, FileText,
  FolderOpen, Network, Package, Shield, ShoppingCart, Sparkles, SquareKanban,
  Users, UserPlus, Workflow, Gift,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { MsgKey } from '../i18n';

export interface NavLink {
  path: string;
  label: MsgKey;
  ability: string;
  icon: LucideIcon;
}

export interface NavGroup {
  id: string;
  label: MsgKey;
  links: NavLink[];
}

/** Information architecture mirrors BMS navigation groups, not the old visual design. */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'insight',
    label: 'grpReports',
    links: [
      { path: '/dashboard', label: 'dashboard', ability: 'dashboard.view', icon: BarChart3 },
      { path: '/reports', label: 'reports', ability: 'reports.view', icon: FileText },
    ],
  },
  {
    id: 'business',
    label: 'grpBusinessDev',
    links: [
      { path: '/opportunities', label: 'opportunities', ability: 'opportunities.view', icon: Briefcase },
      { path: '/leads', label: 'leads', ability: 'leads.view', icon: Network },
    ],
  },
  {
    id: 'execution',
    label: 'grpExecution',
    links: [
      { path: '/plans', label: 'plans', ability: 'plans.view', icon: CalendarCheck },
      { path: '/my-tasks', label: 'myTasks', ability: 'plans.view', icon: SquareKanban },
    ],
  },
  {
    id: 'organization',
    label: 'grpOrganization',
    links: [
      { path: '/units', label: 'units', ability: 'units.view', icon: Building2 },
      { path: '/organization', label: 'organization', ability: 'units.view', icon: Workflow },
      { path: '/employees', label: 'employees', ability: 'directory.view', icon: Users },
      { path: '/bonuses', label: 'bonuses', ability: 'bonuses.view', icon: Gift },
      { path: '/recruitment', label: 'recruitment', ability: 'recruitment.view', icon: UserPlus },
      { path: '/development', label: 'development', ability: 'development.view', icon: Sparkles },
    ],
  },
  {
    id: 'operations',
    label: 'grpOperations',
    links: [
      { path: '/meetings', label: 'meetings', ability: 'meetings.view', icon: Calendar },
      { path: '/products', label: 'products', ability: 'products.view', icon: Package },
      { path: '/procurement', label: 'procurement', ability: 'procurement.view', icon: ShoppingCart },
      { path: '/events', label: 'events', ability: 'events.view', icon: Calendar },
      { path: '/documents', label: 'documents', ability: 'documents.view', icon: FolderOpen },
    ],
  },
  {
    id: 'access',
    label: 'grpAccessManagement',
    links: [
      { path: '/access', label: 'accessRoles', ability: 'roles.manage', icon: Shield },
    ],
  },
];
