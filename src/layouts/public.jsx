import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function PublicLayout() {
  const location = useLocation();
  const isUserRoute = location.pathname.startsWith('/user');
  const userRole = localStorage.getItem('user_role');

  if (userRole === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas font-sans text-ink relative">
      <Navbar />

      {isUserRoute ? (
        <main className="flex-1 flex flex-col p-6 md:p-8 max-w-7xl mx-auto w-full">
          <div className="bg-surface-soft rounded-[20px] border border-hairline p-8 min-h-[500px] w-full">
            <Outlet />
          </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      )}

      <Footer />
    </div>
  );
}