import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-canvas px-12 py-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-[16px] font-medium text-ink">Bantuan</h3>
            <Link to="#" className="mb-2.5 block text-[14px] text-ink hover:underline">Pusat Bantuan</Link>
            <Link to="#" className="mb-2.5 block text-[14px] text-ink hover:underline">Cara Pembelian</Link>
            <Link to="#" className="mb-2.5 block text-[14px] text-ink hover:underline">Hubungi Kami</Link>
          </div>

          <div>
            <h3 className="mb-4 text-[16px] font-medium text-ink">Tentang</h3>
            <Link to="#" className="mb-2.5 block text-[14px] text-ink hover:underline">Tentang BookSales</Link>
            <Link to="#" className="mb-2.5 block text-[14px] text-ink hover:underline">Blog</Link>
            <Link to="#" className="mb-2.5 block text-[14px] text-ink hover:underline">Karir</Link>
          </div>

          <div>
            <h3 className="mb-4 text-[16px] font-medium text-ink">BookSales</h3>
            <Link to="#" className="mb-2.5 block text-[14px] text-ink hover:underline">Syarat & Ketentuan</Link>
            <Link to="#" className="mb-2.5 block text-[14px] text-ink hover:underline">Kebijakan Privasi</Link>
            <Link to="#" className="mb-2.5 block text-[14px] text-ink hover:underline">Status Layanan</Link>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-hairline-soft pt-6 text-[13px] text-muted md:flex-row md:items-center">
          <p>© {year} BookSales. All rights reserved.</p>
          <p>Dibuat untuk pengalaman belanja buku yang lebih hangat.</p>
        </div>
      </div>
    </footer>
  );
}