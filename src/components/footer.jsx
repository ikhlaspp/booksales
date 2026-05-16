import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-canvas border-t border-hairline py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div>
          <h3 className="text-[16px] font-medium text-ink mb-4">Bantuan</h3>
          <ul className="space-y-2.5">
            <li><Link to="/contact" className="text-[14px] text-ink hover:underline block">Hubungi Kami</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-[16px] font-medium text-ink mb-4">Tentang</h3>
          <ul className="space-y-2.5">
            <li><Link to="/about" className="text-[14px] text-ink hover:underline block">Tentang PustakaIkhlas</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-[16px] font-medium text-ink mb-4">PustakaIkhlas</h3>
          <ul className="space-y-2.5">
            <li><Link to="/register" className="text-[14px] text-ink hover:underline block">Daftar Akun Baru</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-hairline-soft pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-muted">
        <div>
          © {currentYear} PustakaIkhlas. Memudahkan akses literasi Anda.
        </div>
      </div>
    </footer>
  );
}