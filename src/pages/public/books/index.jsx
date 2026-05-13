import { useState } from 'react';
import BookCard from '../../../components/BookCard';

const categories = ['Semua', 'Fiksi', 'Self Improvement', 'Romance', 'Sejarah', 'Anak', 'Sains'];

const mockBooks = [
  {
    id: 1,
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 'Rp 120.000',
    image: 'https://placehold.co/640x800/f7f7f7/222222?text=Atomic+Habits',
    badge: 'Bestseller',
    category: 'Self Improvement',
  },
  {
    id: 2,
    title: 'Laut Bercerita',
    author: 'Leila S. Chudori',
    price: 'Rp 110.000',
    image: 'https://placehold.co/640x800/f7f7f7/222222?text=Laut+Bercerita',
    badge: 'Pilihan Editor',
    category: 'Fiksi',
  },
  {
    id: 3,
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    price: 'Rp 135.000',
    image: 'https://placehold.co/640x800/f7f7f7/222222?text=Sapiens',
    badge: 'Terlaris',
    category: 'Sejarah',
  },
  {
    id: 4,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 'Rp 150.000',
    image: 'https://placehold.co/640x800/f7f7f7/222222?text=The+Great+Gatsby',
    badge: 'Klasik',
    category: 'Fiksi',
  },
];

export default function Books() {
  const [activeCategory, setActiveCategory] = useState('Semua');

  const filteredBooks = mockBooks.filter(
    (book) => activeCategory === 'Semua' || book.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* Filter Bar / Category Strip */}
      <div className="sticky top-0 z-10 border-b border-[#dddddd] bg-[#ffffff] px-6 py-4">
        <div className="mx-auto flex max-w-[1280px] gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-[14px] font-medium leading-[1.29] transition-colors ${
                activeCategory === cat
                  ? 'bg-[#f7f7f7] text-[#222222]'
                  : 'bg-transparent text-[#6a6a6a] hover:bg-[#f7f7f7] hover:text-[#222222]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Grid Area */}
      <main className="mx-auto max-w-[1280px] px-6 py-[64px]">
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg
              className="mb-4 h-16 w-16 text-[#dddddd]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="text-[16px] font-normal leading-[1.5] text-[#222222]">
              Buku tidak ditemukan
            </p>
            <p className="mt-2 text-[14px] font-normal leading-[1.43] text-[#6a6a6a]">
              Coba pilih kategori lain atau periksa kembali nanti.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
