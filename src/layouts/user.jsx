import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

export default function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const role = localStorage.getItem('user_role');

  const navigation = [
    { name: "Browse Books", href: "/user", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
    { name: "My Transactions", href: "/user/transactions", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
    { name: "Profile", href: "/user/profile", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
  ];

  const pageTitle = location.pathname === "/user" 
    ? "Browse Books" 
    : location.pathname.split('/').pop().replace(/-/g, ' ');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 flex-col hidden md:flex transition-all duration-300 ${isSidebarExpanded ? 'w-64' : 'w-20'}`}>
        <div className={`h-20 flex items-center border-b border-gray-100 ${isSidebarExpanded ? 'px-6' : 'justify-center'}`}>
          <div className="w-10 h-10 flex-shrink-0 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          {isSidebarExpanded && <span className="text-xl font-bold tracking-tight text-gray-900 ml-3 whitespace-nowrap overflow-hidden">BookSales.</span>}
        </div>
        
        <nav className={`flex-1 overflow-y-auto py-6 space-y-1.5 ${isSidebarExpanded ? 'px-4' : 'px-2'}`}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/user' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center py-3 rounded-xl text-sm font-semibold no-underline transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-gray-500 hover:bg-blue-50 hover:text-blue-700'
                } ${isSidebarExpanded ? 'px-4' : 'justify-center px-0'}`}
                title={!isSidebarExpanded ? item.name : undefined}
              >
                <svg className={`w-5 h-5 flex-shrink-0 ${isSidebarExpanded ? 'mr-3' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {item.icon}
                </svg>
                {isSidebarExpanded && <span className="whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className={`flex items-center mb-3 ${isSidebarExpanded ? 'gap-3 px-3' : 'justify-center px-0'}`}>
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-200 overflow-hidden ring-2 ring-blue-500/30">
              <img src="https://ui-avatars.com/api/?name=User&background=eff6ff&color=2563eb" alt="Profile" className="w-full h-full object-cover" />
            </div>
            {isSidebarExpanded && (
              <div className="flex flex-col overflow-hidden whitespace-nowrap">
                <span className="text-sm font-bold text-gray-900">Customer</span>
                <span className="text-xs font-medium text-gray-500 capitalize">{role || 'User'}</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleLogout} 
            className={`flex items-center w-full py-3 text-sm font-semibold no-underline text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors group ${isSidebarExpanded ? 'px-4' : 'justify-center px-0'}`}
            title={!isSidebarExpanded ? "Sign out" : undefined}
          >
            <svg className={`w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-red-500 transition-colors ${isSidebarExpanded ? 'mr-3' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isSidebarExpanded && <span className="whitespace-nowrap">Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="mr-4 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight capitalize">
              {pageTitle}
            </h1>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}