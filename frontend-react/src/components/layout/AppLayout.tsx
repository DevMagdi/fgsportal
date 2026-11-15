import { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { LoadingState } from '../ui/States';

export function AppLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-full bg-surface">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setOpen(true)} menuOpen={open} />
        <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-5 sm:px-6 lg:px-7 lg:py-5">
          <Suspense fallback={<LoadingState />}><Outlet /></Suspense>
        </main>
      </div>
    </div>
  );
}
