import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Temukan Buku Favoritmu di <span className="text-blue-600">BookSales.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto">
          Platform terbaik untuk meminjam dan membeli buku bacaan terkini. Jelajahi ribuan koleksi dari berbagai genre dengan mudah dan cepat.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/books" className="px-8 py-3.5 bg-blue-600 text-white text-base font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all duration-200">
            Mulai Membaca
          </Link>
          <Link to="/about" className="px-8 py-3.5 bg-white text-gray-700 border border-gray-200 text-base font-semibold rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 shadow-sm">
            Pelajari Lebih Lanjut
          </Link>
        </div>
      </div>
    </div>
  );
}