export default function PublicBooks() {
  const featuredBooks = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: "Rp 150.000", image: "https://placehold.co/150x200?text=Book+Cover", category: "Fiksi" },
    { id: 2, title: "Atomic Habits", author: "James Clear", price: "Rp 120.000", image: "https://placehold.co/150x200?text=Book+Cover", category: "Self Improvement" },
    { id: 3, title: "1984", author: "George Orwell", price: "Rp 95.000", image: "https://placehold.co/150x200?text=Book+Cover", category: "Fiksi Ilmiah" },
    { id: 4, title: "Sapiens", author: "Yuval Noah Harari", price: "Rp 135.000", image: "https://placehold.co/150x200?text=Book+Cover", category: "Sejarah" },
    { id: 5, title: "Laut Bercerita", author: "Leila S. Chudori", price: "Rp 110.000", image: "https://placehold.co/150x200?text=Book+Cover", category: "Fiksi" },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Koleksi Publik</h2>
          <p className="text-gray-500 mt-1">Jelajahi cuplikan buku yang tersedia di perpustakaan kami.</p>
        </div>
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 sm:text-sm transition-colors" 
            placeholder="Cari judul buku..." 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {featuredBooks.map((book) => (
          <div key={book.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 group flex flex-col">
            <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
              <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-3 left-3">
                <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-700 shadow-sm">{book.category}</span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{book.title}</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">{book.author}</p>
              <div className="mt-auto text-lg font-bold text-blue-600">{book.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}