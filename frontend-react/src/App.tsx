import { Navigate, Route, Routes } from 'react-router-dom';
import { AbilityRoute, ProtectedRoute } from './auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { useAuth } from './auth/AuthContext';
import { firstAllowedPath } from './lib/abilities';
import { ErrorState, LoadingState } from './components/ui/States';
import { lazy } from 'react';
import { LoginPage } from './pages/LoginPage';

// Keep charts and less frequently used modules out of the initial sign-in bundle.
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const OpportunitiesPage = lazy(() => import('./pages/OpportunitiesPage').then((m) => ({ default: m.OpportunitiesPage })));
const OpportunityShowPage = lazy(() => import('./pages/OpportunitiesPage').then((m) => ({ default: m.OpportunityShowPage })));
const UnitsPage = lazy(() => import('./pages/UnitsPage').then((m) => ({ default: m.UnitsPage })));
const UnitShowPage = lazy(() => import('./pages/UnitsPage').then((m) => ({ default: m.UnitShowPage })));
const MyTasksPage = lazy(() => import('./pages/PlansPage').then((m) => ({ default: m.MyTasksPage })));
const PlanShowPage = lazy(() => import('./pages/PlansPage').then((m) => ({ default: m.PlanShowPage })));
const PlansPage = lazy(() => import('./pages/PlansPage').then((m) => ({ default: m.PlansPage })));
const LeadsPage = lazy(() => import('./pages/ListsPages').then((m) => ({ default: m.LeadsPage })));
const MeetingsPage = lazy(() => import('./pages/ListsPages').then((m) => ({ default: m.MeetingsPage })));
const NoAccessPage = lazy(() => import('./pages/ListsPages').then((m) => ({ default: m.NoAccessPage })));
const ProductsPage = lazy(() => import('./pages/ListsPages').then((m) => ({ default: m.ProductsPage })));
const EmployeeShowPage = lazy(() => import('./pages/EmployeesPage').then((m) => ({ default: m.EmployeeShowPage })));
const EmployeesPage = lazy(() => import('./pages/EmployeesPage').then((m) => ({ default: m.EmployeesPage })));
const OrganizationPage = lazy(() => import('./pages/OrganizationPage').then((m) => ({ default: m.OrganizationPage })));
const RecruitmentPage = lazy(() => import('./pages/RecruitmentPage').then((m) => ({ default: m.RecruitmentPage })));
const DevelopmentPage = lazy(() => import('./pages/OperationsPages').then((m) => ({ default: m.DevelopmentPage })));
const DocumentsPage = lazy(() => import('./pages/OperationsPages').then((m) => ({ default: m.DocumentsPage })));
const EventsPage = lazy(() => import('./pages/OperationsPages').then((m) => ({ default: m.EventsPage })));
const ProcurementPage = lazy(() => import('./pages/OperationsPages').then((m) => ({ default: m.ProcurementPage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const AccessPage = lazy(() => import('./pages/AccessPage').then((m) => ({ default: m.AccessPage })));
const BonusesPage = lazy(() => import('./pages/BonusesPage').then((m) => ({ default: m.BonusesPage })));

function HomeRedirect() {
  const { abilities, loading, lookupsError, reloadLookups } = useAuth();
  if (loading) return <LoadingState />;
  if (lookupsError) return <ErrorState message={lookupsError.message} onRetry={reloadLookups} />;
  return <Navigate to={firstAllowedPath(abilities)} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<HomeRedirect />} />
          <Route element={<AbilityRoute ability="dashboard.view" />}>
            <Route path="dashboard" element={<DashboardPage />} />
          </Route>
          <Route element={<AbilityRoute ability="opportunities.view" />}>
            <Route path="opportunities" element={<OpportunitiesPage />} />
            <Route path="opportunities/:id" element={<OpportunityShowPage />} />
          </Route>
          <Route element={<AbilityRoute ability="units.view" />}>
            <Route path="units" element={<UnitsPage />} />
            <Route path="units/:id" element={<UnitShowPage />} />
            <Route path="organization" element={<OrganizationPage />} />
          </Route>
          <Route element={<AbilityRoute ability="plans.view" />}>
            <Route path="plans" element={<PlansPage />} />
            <Route path="plans/:id" element={<PlanShowPage />} />
            <Route path="my-tasks" element={<MyTasksPage />} />
          </Route>
          <Route element={<AbilityRoute ability="leads.view" />}>
            <Route path="leads" element={<LeadsPage />} />
          </Route>
          <Route element={<AbilityRoute ability="meetings.view" />}>
            <Route path="meetings" element={<MeetingsPage />} />
          </Route>
          <Route element={<AbilityRoute ability="products.view" />}>
            <Route path="products" element={<ProductsPage />} />
          </Route>
          <Route element={<AbilityRoute ability="directory.view" />}>
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="employees/:id" element={<EmployeeShowPage />} />
          </Route>
          <Route element={<AbilityRoute ability="bonuses.view" />}>
            <Route path="bonuses" element={<BonusesPage />} />
          </Route>
          <Route element={<AbilityRoute ability="recruitment.view" />}>
            <Route path="recruitment" element={<RecruitmentPage />} />
          </Route>
          <Route element={<AbilityRoute ability="development.view" />}>
            <Route path="development" element={<DevelopmentPage />} />
          </Route>
          <Route element={<AbilityRoute ability="procurement.view" />}>
            <Route path="procurement" element={<ProcurementPage />} />
          </Route>
          <Route element={<AbilityRoute ability="events.view" />}>
            <Route path="events" element={<EventsPage />} />
          </Route>
          <Route element={<AbilityRoute ability="documents.view" />}>
            <Route path="documents" element={<DocumentsPage />} />
          </Route>
          <Route element={<AbilityRoute ability="reports.view" />}>
            <Route path="reports" element={<ReportsPage />} />
          </Route>
          <Route element={<AbilityRoute ability="roles.manage" />}>
            <Route path="access" element={<AccessPage />} />
          </Route>
          <Route path="no-access" element={<NoAccessPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
