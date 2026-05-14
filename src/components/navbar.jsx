import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role');

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Hubungi Kami', href: '/contact' },
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
    <header className="sticky top-0 z-50 bg-canvas/80 backdrop-blur-lg border-b border-hairline">
      <nav className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex items-center justify-between h-20">

          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rausch rounded-sm flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-ink">BookSales.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm transition-colors py-1 ${active
                    ? 'text-ink font-semibold border-b-2 border-rausch'
                    : 'text-muted hover:text-ink font-medium'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center">
            {token ? (
              <div className="flex items-center bg-surface-soft p-1.5 pr-5 rounded-full border border-hairline">
                <Link to={role === 'admin' ? '/admin' : '/user'} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-surface-strong flex items-center justify-center overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${currentRole}&background=222222&color=ffffff`} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-medium text-ink capitalize group-hover:underline">
                    {currentRole}
                  </span>
                </Link>
                <div className="w-px h-4 bg-hairline mx-4"></div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-rausch hover:text-rausch-active transition-colors"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/register" className="px-5 py-2.5 bg-canvas text-ink border border-hairline text-sm font-medium rounded-sm hover:bg-surface-soft transition-all">
                  Daftar
                </Link>
                <Link to="/login" className="px-5 py-2.5 bg-rausch text-white text-sm font-medium rounded-sm hover:bg-rausch-active transition-all">
                  Masuk
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileOpen((value) => !value)}
              className="text-ink p-2"
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
          <div className="md:hidden py-4 border-t border-hairline bg-canvas">
            <div className="flex flex-col space-y-4 px-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-base font-medium py-1 ${isActive(link.href) ? 'text-rausch font-semibold' : 'text-ink'
                    }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="border-t border-hairline pt-4 mt-2">
                {token ? (
                  <div className="flex flex-col space-y-4">
                    <Link to={role === 'admin' ? '/admin' : '/user'} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-strong overflow-hidden">
                        <img src={`https://ui-avatars.com/api/?name=${currentRole}&background=222222&color=ffffff`} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-ink capitalize">{currentRole}</div>
                        <div className="text-xs text-muted">Lihat Dasbor</div>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-left text-base font-medium text-rausch"
                    >
                      Keluar
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link to="/login" className="w-full py-3 bg-rausch text-white text-center text-sm font-medium rounded-sm">
                      Masuk
                    </Link>
                    <Link to="/register" className="w-full py-3 bg-canvas text-ink text-center text-sm font-medium rounded-sm border border-hairline">
                      Daftar
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