import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  return (
    <Link
      to={`/books/${book.id}`}
      className="group flex flex-col gap-3 rounded-[14px] bg-[#ffffff] p-2 transition-shadow duration-300 hover:shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px_0,rgba(0,0,0,0.1)_0_4px_8px_0]"
    >
      {/* Foto Buku */}
      <div className="relative w-full overflow-hidden rounded-[14px] bg-[#f7f7f7] aspect-[3/4]">
        <img
          src={book.image}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge "Terlaris" / "Baru" */}
        {book.badge && (
          <span className="absolute left-3 top-3 inline-block rounded-full bg-[#ffffff] px-[6px] py-[2px] text-[8px] font-bold uppercase leading-[1.25] tracking-[0.32px] text-[#222222] shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
            {book.badge}
          </span>
        )}

        {/* Tombol Simpan (Heart) - Opsional */}
        <button
          type="button"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-white transition-transform hover:scale-110"
          aria-label={`Simpan ${book.title}`}
          onClick={(e) => e.preventDefault()}
        >
          <svg className="h-6 w-6 drop-shadow-md" viewBox="0 0 24 24" fill="rgba(0,0,0,0.3)" stroke="currentColor" strokeWidth="2">
            <path d="M20.8 4.6c-1.7-1.8-4.4-1.8-6.1 0L12 7.3l-2.7-2.7c-1.7-1.8-4.4-1.8-6.1 0-1.7 1.8-1.7 4.7 0 6.5L12 21l8.8-10c1.7-1.8 1.7-4.7 0-6.4Z" />
          </svg>
        </button>
      </div>

      {/* Metadata */}
      <div className="flex flex-col px-1 pb-1">
        <h3 className="truncate text-[16px] font-semibold leading-[1.25] text-[#222222]">
          {book.title}
        </h3>
        <p className="mt-1 truncate text-[14px] font-normal leading-[1.43] text-[#6a6a6a]">
          {book.author}
        </p>
        <div className="mt-1 text-[14px] font-normal leading-[1.43] text-[#222222]">
          {book.price}
        </div>
      </div>
    </Link>
  );
}