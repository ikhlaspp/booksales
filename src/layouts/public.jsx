import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function PublicLayout() {
  const location = useLocation();

  const isUserRoute = location.pathname.startsWith('/user');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-gray-900 relative">
      
      <Navbar />

      {isUserRoute ? (
        <main className="flex-1 flex flex-col p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
              <Outlet />
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      )}

      <footer className="bg-white border-t border-gray-100 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-center items-center gap-4 text-center">
          <p className="text-sm text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} BookSales. Memudahkan akses literasi Anda.
          </p>
        </div>
      </footer>
    </div>
  );
}