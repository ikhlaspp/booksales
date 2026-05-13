﻿import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user_role') || 'User';
  const isLoggedIn = Boolean(token);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    window.location.href = '/login';
  };

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Katalog', path: '/books' },
    { name: 'Tentang', path: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 h-20 border-b border-hairline bg-canvas">
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M5 6.5C5 5.12 6.12 4 7.5 4H18V17H7.5C6.12 17 5 18.12 5 19.5V6.5Z" stroke="#ff385c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 8H16" stroke="#ff385c" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M7 11H16" stroke="#ff385c" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M5 19.5H18" stroke="#ff385c" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span className="text-[22px] font-semibold tracking-[-0.44px] text-ink">BookSales</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`border-b-2 pb-1 text-[16px] transition-colors ${
                  isActive 
                    ? 'border-rausch text-ink font-semibold'
                    : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3 rounded-md bg-surface-soft px-4 py-2">
              <Link to="/user/profile" className="text-sm font-medium text-ink capitalize">
                {userRole}
              </Link>
              <button type="button" onClick={handleLogout} className="text-sm font-medium text-rausch">
                Keluar
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-sm bg-rausch px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rausch-active"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="rounded-sm border border-hairline bg-canvas px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-soft"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center text-ink"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Sheet */}
      {isMenuOpen && (
        <div className="absolute left-0 top-20 w-full border-b border-hairline bg-canvas shadow-card md:hidden">
          <div className="flex flex-col gap-1 p-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`border-l-2 py-2 pl-3 text-[16px] ${
                    isActive ? 'border-rausch text-ink font-semibold' : 'border-transparent text-muted hover:text-ink'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {isLoggedIn ? (
              <div className="mt-4 flex items-center justify-between rounded-md bg-surface-soft px-4 py-3">
                <Link to="/user/profile" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-ink capitalize">
                  {userRole}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm font-medium text-rausch"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-sm bg-rausch px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-rausch-active"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-sm border border-hairline bg-canvas px-4 py-2.5 text-center text-sm font-medium text-ink transition-colors hover:bg-surface-soft"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}