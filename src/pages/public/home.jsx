import { Link } from 'react-router-dom';

const categories = [
  { name: 'Fiksi', desc: 'Buku fiksi dan imajinasi' },
  { name: 'Self Improvement', desc: 'Pengembangan diri' },
  { name: 'Romance', desc: 'Kisah cinta dan romansa' },
  { name: 'Sejarah', desc: 'Catatan masa lalu' },
];

export default function Home() {
  return (
    <div className="bg-[#ffffff] text-[#222222]">
      <section className="mx-auto flex max-w-[1280px] flex-col items-center px-6 py-[64px] text-center">
        <div className="mb-10 w-full max-w-3xl">
          <h1 className="text-[28px] font-bold leading-[1.43] text-[#222222]">
            Temukan Buku Favoritmu di BookSales.
          </h1>
        </div>

        <div className="flex h-[64px] w-full max-w-2xl items-center rounded-full border border-[#dddddd] bg-[#ffffff] px-2 shadow-[0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)]">
          <div className="flex flex-1 flex-col items-start px-6">
            <span className="text-[14px] font-medium text-[#222222]">Cari buku</span>
            <input
              type="text"
              placeholder="Judul, penulis, atau genre"
              className="w-full bg-transparent text-[14px] font-normal text-[#6a6a6a] outline-none"
            />
          </div>
          <button className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#ff385c] text-white transition-colors hover:bg-[#e00b41]">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-[64px]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, idx) => (
            <Link key={idx} to={`/books?category=${cat.name}`} className="flex flex-col justify-center rounded-[14px] border border-[#dddddd] bg-[#ffffff] p-6 shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
              <h3 className="text-[16px] font-semibold text-[#222222]">{cat.name}</h3>
              <p className="mt-1 text-[14px] text-[#6a6a6a]">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}