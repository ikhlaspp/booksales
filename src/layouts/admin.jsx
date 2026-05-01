import { Outlet, Link, useLocation, Navigate, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const navigation = [
    { name: "Overview", href: "/admin" },
    { name: "Users", href: "/admin/users" },
    { name: "Authors", href: "/admin/authors" },
    { name: "Genres", href: "/admin/genres" },
    { name: "Books", href: "/admin/books" },
    { name: "Transactions", href: "/admin/transactions" },
  ];

  // Mendapatkan judul halaman dari URL
  const pageTitle = location.pathname === "/admin" 
    ? "Overview" 
    : location.pathname.split('/').pop().replace(/-/g, ' ');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex">
        <div className="h-16 flex items-center px-8 border-b border-gray-100">
          <span className="text-xl font-bold tracking-tight text-gray-900">BookSales.</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navigation.map((item) => {
            // Kondisi untuk menentukan item navigasi mana yang sedang aktif
            const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center">
            <button className="md:hidden mr-4 text-gray-500 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-800 capitalize">
              {pageTitle}
            </h1>
          </div>
          
          <div className="flex items-center space-x-5">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                <img src="https://ui-avatars.com/api/?name=Admin&background=f3f4f6&color=374151" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
