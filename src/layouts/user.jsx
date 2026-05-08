import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

export default function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem('user_role');

  const navigation = [
    { name: "Beranda Utama", href: "/" },
    { name: "Dashboard User", href: "/user" },
    { name: "Transaksi Saya", href: "/user/transactions" },
    { name: "Profil Saya", href: "/user/profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-gray-900 relative">
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex-shrink-0 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">BookSales.</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && item.href !== '/user' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-semibold transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-200 overflow-hidden ring-2 ring-blue-500/30 hidden sm:block">
              <img src="https://ui-avatars.com/api/?name=User&background=eff6ff&color=2563eb" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold text-gray-900 hidden sm:block capitalize">{role || 'Customer'}</span>
          </div>
          <button 
            onClick={handleLogout} 
            className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
          >
            Keluar
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-6 md:p-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
            <Outlet />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-center items-center text-center">
          <p className="text-sm text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} BookSales. Memudahkan akses literasi Anda.
          </p>
        </div>
      </footer>
    </div>
  );
}