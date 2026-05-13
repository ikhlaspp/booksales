import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function PublicLayout() {
  const location = useLocation();
  const isUserRoute = location.pathname.startsWith('/user');

  return (
    <div className="min-h-screen flex flex-col bg-canvas font-sans text-ink">
      <Navbar />
      <main className="flex-1">
        {isUserRoute ? (
          <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
            <div className="rounded-[20px] bg-surface-soft p-4 md:p-6">
              <Outlet />
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
    </div>
  );
}