﻿import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role');

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Katalog Buku', href: '/books' },
    { name: 'Tentang Kami', href: '/about' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    setIsMobileOpen(false);
    navigate('/login');
  };

  const isActive = (href) => {
    return location.pathname === href || (href !== '/' && location.pathname.startsWith(href));
  };

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const currentRole = role || 'Customer';

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <nav className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">BookSales.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            {token ? (
              <div className="flex items-center bg-gray-900 p-1.5 pr-5 rounded-2xl shadow-md">
                <Link to={role === 'admin' ? '/admin' : '/user/profile'} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center overflow-hidden ring-2 ring-gray-700 group-hover:ring-gray-500 transition-all">
                    <img src={`https://ui-avatars.com/api/?name=${currentRole}&background=374151&color=f9fafb`} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-bold text-white capitalize group-hover:text-gray-200 transition-colors">
                    {currentRole}
                  </span>
                </Link>
                <div className="w-px h-4 bg-gray-700 mx-4"></div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Link to="/register" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                  Daftar
                </Link>
                <Link to="/login" className="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-md">
                  Masuk
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileOpen((value) => !value)}
              className="text-gray-500 hover:text-gray-900 p-2"
              aria-label="Buka menu navigasi"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-base font-semibold px-2 ${
                    isActive(link.href) ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="border-t border-gray-100 pt-4 mt-2">
                {token ? (
                  <div className="flex flex-col space-y-4 px-2">
                    <Link to={role === 'admin' ? '/admin' : '/user/profile'} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        <img src={`https://ui-avatars.com/api/?name=${currentRole}&background=eff6ff&color=2563eb`} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 capitalize">{currentRole}</div>
                        <div className="text-xs text-gray-500">Lihat Profil</div>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-left text-base font-semibold text-red-500"
                    >
                      Keluar
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 px-2">
                    <Link to="/login" className="w-full py-3 bg-gray-900 text-white text-center text-base font-bold rounded-xl">
                      Masuk
                    </Link>
                    <Link to="/register" className="w-full py-3 bg-gray-100 text-gray-900 text-center text-base font-bold rounded-xl border border-gray-200">
                      Daftar Akun Baru
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
