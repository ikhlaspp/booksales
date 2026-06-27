import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navbarRef = useRef(null);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role');
  const userName = localStorage.getItem('user_name');

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Hubungi Kami', href: '/contact' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (href) => {
    return location.pathname === href || (href !== '/' && location.pathname.startsWith(href));
  };

  // Close menus when route changes
  useEffect(() => {
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
    setIsCartOpen(false);
  }, [location.pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navbarRef]);

  const currentRole = role || 'Customer';
  const displayName = userName || currentRole;

  return (
    <>
      <header className="sticky top-0 z-50 bg-canvas/80 backdrop-blur-lg border-b border-hairline" ref={navbarRef}>
        <nav className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="flex items-center justify-between h-20">

            <Link to="/" className="flex items-center gap-3">
              <img src="/favicon.svg" alt="LiteraNusa" className="w-10 h-10 rounded-sm shadow-sm" />
              <span className="text-lg font-semibold tracking-tight text-ink">LiteraNusa.</span>
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

            <div className="hidden md:flex items-center gap-4 relative">
              {/* Cart Icon - Triggers Modal */}
              {token && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-ink hover:bg-surface-soft rounded-full transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 min-w-[18px] h-4.5 bg-rausch text-white text-[10px] font-bold px-1 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              {token ? (
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-canvas p-1 pl-3 rounded-full border border-hairline hover:shadow-md transition-shadow duration-200"
                >
                  <svg className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <div className="w-8 h-8 rounded-full bg-surface-strong flex items-center justify-center overflow-hidden ml-1">
                    <img src={`https://ui-avatars.com/api/?name=${displayName}&background=222222&color=ffffff`} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-canvas p-1 pl-3 rounded-full border border-hairline hover:shadow-md transition-shadow duration-200"
                >
                  <svg className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <div className="w-8 h-8 rounded-full bg-surface-strong flex items-center justify-center overflow-hidden ml-1">
                    <svg className="w-5 h-5 text-muted" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              )}

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-12 mt-2 w-60 bg-canvas rounded-[14px] shadow-[0_2px_16px_rgba(0,0,0,0.12)] border border-hairline overflow-hidden py-2 z-50 animate-fadeInUp">
                  {token ? (
                    <>
                      <div className="px-4 py-2 mb-1 border-b border-hairline">
                        <p className="text-sm font-semibold text-ink capitalize">{displayName}</p>
                      </div>
                      {role === 'admin' ? (
                        <Link to="/admin" className="block px-4 py-3 text-sm text-ink font-medium hover:bg-surface-soft transition-colors">
                          Dasbor Admin
                        </Link>
                      ) : (
                        <>
                          <Link to="/profile" className="block px-4 py-3 text-sm text-ink font-medium hover:bg-surface-soft transition-colors">
                            Profil Saya
                          </Link>
                        </>
                      )}
                      <div className="border-t border-hairline my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm font-medium text-ink hover:bg-surface-soft transition-colors"
                      >
                        Keluar
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/register" className="block px-4 py-3 text-sm font-semibold text-ink hover:bg-surface-soft transition-colors">
                        Daftar
                      </Link>
                      <Link to="/login" className="block px-4 py-3 text-sm text-ink hover:bg-surface-soft transition-colors">
                        Masuk
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex md:hidden relative gap-2 items-center">
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-ink">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 min-w-[16px] h-4 bg-rausch text-white text-[9px] font-bold px-1 rounded-full flex items-center justify-center border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-canvas p-1 pl-3 rounded-full border border-hairline shadow-sm"
              >
                <svg className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <div className="w-8 h-8 rounded-full bg-surface-strong flex items-center justify-center overflow-hidden ml-1">
                  {token ? (
                    <img src={`https://ui-avatars.com/api/?name=${displayName}&background=222222&color=ffffff`} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-5 h-5 text-muted" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>

          {isDropdownOpen && (
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
                      {role === 'admin' ? (
                        <Link to="/admin" className="text-base font-medium text-ink">Dasbor Admin</Link>
                      ) : (
                        <>
                          <Link to="/profile" className="text-base font-medium text-ink">Profil Saya</Link>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="text-left text-base font-medium text-ink"
                      >
                        Keluar
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-4">
                      <Link to="/register" className="text-base font-semibold text-ink">
                        Daftar
                      </Link>
                      <Link to="/login" className="text-base font-medium text-ink">
                        Masuk
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Cart Modal Integration */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}