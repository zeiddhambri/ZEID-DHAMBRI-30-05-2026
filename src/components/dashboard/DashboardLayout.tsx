import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';

export default function DashboardLayout() {
  return (
    <div className="flex bg-mist min-h-screen">
      <AppSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
