import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="bg-[#ffffff] px-6 py-20 text-center flex flex-col items-center justify-center border-b border-[#ebebeb]">
      <div className="max-w-3xl space-y-8 w-full flex flex-col items-center">
        <h1 className="text-[28px] font-semibold text-[#222222] leading-[1.43] tracking-[-0.44px]">
          Temukan Buku Berikutnya Lewat Pengalaman yang Lebih Hangat.
        </h1>
        <p className="text-[16px] text-[#3f3f3f] leading-[1.5] max-w-2xl mx-auto">
          Jelajahi katalog pilihan, baca ringkasan singkat, dan lanjutkan ke buku yang paling relevan tanpa tampilan yang berisik.
        </p>
        
        <div className="mt-8 flex h-[64px] w-full max-w-2xl items-center rounded-full border border-[#dddddd] bg-[#ffffff] px-2 shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px_0,rgba(0,0,0,0.1)_0_4px_8px_0]">
          <div className="flex flex-1 flex-col items-start px-6">
            <span className="text-[12px] font-bold uppercase tracking-[0.32px] text-[#222222]">Cari Buku</span>
            <input
              type="text"
              placeholder="Judul, penulis, atau genre"
              className="w-full bg-transparent text-[14px] font-normal text-[#6a6a6a] outline-none"
            />
          </div>
          <Link to="/books" className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#ff385c] text-white transition-colors hover:bg-[#e00b41]">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}