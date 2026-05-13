import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#ffffff] border-t border-[#dddddd] pt-12 pb-6 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Kolom 1 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[16px] font-medium text-[#222222]">Bantuan</h3>
            <Link to="#" className="text-[14px] text-[#6a6a6a] transition-colors hover:text-[#222222] hover:underline">Pusat Bantuan</Link>
            <Link to="#" className="text-[14px] text-[#6a6a6a] transition-colors hover:text-[#222222] hover:underline">Cara Pembelian</Link>
            <Link to="#" className="text-[14px] text-[#6a6a6a] transition-colors hover:text-[#222222] hover:underline">Hubungi Kami</Link>
          </div>
          {/* Kolom 2 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[16px] font-medium text-[#222222]">Tentang</h3>
            <Link to="#" className="text-[14px] text-[#6a6a6a] transition-colors hover:text-[#222222] hover:underline">Tentang BookSales</Link>
            <Link to="#" className="text-[14px] text-[#6a6a6a] transition-colors hover:text-[#222222] hover:underline">Blog</Link>
            <Link to="#" className="text-[14px] text-[#6a6a6a] transition-colors hover:text-[#222222] hover:underline">Karir</Link>
          </div>
          {/* Kolom 3 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[16px] font-medium text-[#222222]">Legal</h3>
            <Link to="#" className="text-[14px] text-[#6a6a6a] transition-colors hover:text-[#222222] hover:underline">Syarat & Ketentuan</Link>
            <Link to="#" className="text-[14px] text-[#6a6a6a] transition-colors hover:text-[#222222] hover:underline">Kebijakan Privasi</Link>
          </div>
        </div>
        
        <div className="border-t border-[#ebebeb] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[14px] text-[#6a6a6a]">© 2026 BookSales, Inc.</p>
          <div className="flex gap-4">
            {/* Social Icons Placeholder */}
            <Link to="#" className="text-[#6a6a6a] hover:text-[#222222]">
              <span className="sr-only">Facebook</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </Link>
            <Link to="#" className="text-[#6a6a6a] hover:text-[#222222]">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}