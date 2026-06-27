import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const role = localStorage.getItem('user_role');

  const navigation = [
    { name: "Overview", href: "/admin", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { name: "Users", href: "/admin/users", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
    { name: "Authors", href: "/admin/authors", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /> },
    { name: "Genres", href: "/admin/genres", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /> },
    { name: "Books", href: "/admin/books", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
    { name: "Transactions", href: "/admin/transactions", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { name: "Pesan", href: "/admin/contacts", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /> },
  ];

  const pageTitle = location.pathname === "/admin"
    ? "Overview"
    : location.pathname.split('/').pop().replace(/-/g, ' ');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-canvas font-sans text-ink">
      {/* Sidebar Panel */}
      <aside className={`bg-canvas border-r border-hairline flex-col hidden md:flex transition-all duration-300 ${isSidebarExpanded ? 'w-64' : 'w-20'}`}>
        <div className={`h-20 flex items-center border-b border-hairline ${isSidebarExpanded ? 'px-6' : 'justify-center'}`}>
          <img src="/favicon.svg" alt="LiteraNusa" className="w-10 h-10 flex-shrink-0 rounded-sm shadow-sm" />
          {isSidebarExpanded && <span className="text-lg font-semibold tracking-tight text-ink ml-3 whitespace-nowrap overflow-hidden">LiteraNusa.</span>}
        </div>

        <nav className={`flex-1 overflow-y-auto py-6 space-y-1.5 ${isSidebarExpanded ? 'px-4' : 'px-2'}`}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center py-3 rounded-md text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-rausch text-white font-semibold'
                    : 'text-muted hover:bg-surface-soft hover:text-ink'
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

        <div className="p-4 border-t border-hairline bg-surface-soft/50">
          <div className={`flex items-center mb-3 ${isSidebarExpanded ? 'gap-3 px-3' : 'justify-center px-0'}`}>
            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-surface-strong overflow-hidden border border-hairline">
              <img src="https://ui-avatars.com/api/?name=Admin&background=222222&color=ffffff" alt="Profile" className="w-full h-full object-cover" />
            </div>
            {isSidebarExpanded && (
              <div className="flex flex-col overflow-hidden whitespace-nowrap">
                <span className="text-sm font-semibold text-ink">Admin</span>
                <span className="text-xs text-muted capitalize">{role || 'Administrator'}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className={`flex items-center w-full py-2.5 text-sm font-medium text-rausch rounded-sm hover:bg-rausch-disabled/30 transition-colors group ${isSidebarExpanded ? 'px-3' : 'justify-center px-0'}`}
            title={!isSidebarExpanded ? "Keluar" : undefined}
          >
            <svg className={`w-5 h-5 flex-shrink-0 text-rausch ${isSidebarExpanded ? 'mr-3' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isSidebarExpanded && <span className="whitespace-nowrap">Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-canvas">
        <header className="h-20 bg-canvas/80 backdrop-blur-md border-b border-hairline flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center">
            <button className="md:hidden mr-4 text-ink">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="hidden md:block mr-4 text-muted hover:text-ink transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-ink tracking-tight capitalize">
              {pageTitle}
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-surface-soft p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="bg-canvas rounded-[20px] border border-hairline p-8 min-h-[500px]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}