import { Navigate, Route, Routes } from 'react-router-dom';
import { AbilityRoute, ProtectedRoute } from './auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { OpportunitiesPage, OpportunityShowPage } from './pages/OpportunitiesPage';
import { UnitsPage, UnitShowPage } from './pages/UnitsPage';
import { MyTasksPage, PlanShowPage, PlansPage } from './pages/PlansPage';
import { LeadsPage, MeetingsPage, NoAccessPage, ProductsPage } from './pages/ListsPages';
import { EmployeeShowPage, EmployeesPage } from './pages/EmployeesPage';
import { OrganizationPage } from './pages/OrganizationPage';
import { RecruitmentPage } from './pages/RecruitmentPage';
import { DevelopmentPage, DocumentsPage, EventsPage, ProcurementPage } from './pages/OperationsPages';
import { ReportsPage } from './pages/ReportsPage';
import { AccessPage } from './pages/AccessPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
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
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
