import { useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteModal from '../../../components/DeleteModal';

export default function AdminGenres() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [genres, setGenres] = useState([
    { id: 1, name: "Fiksi Ilmiah", description: "Buku yang mengeksplorasi konsep futuristik.", total_books: 45 },
    { id: 2, name: "Fantasi", description: "Dunia sihir, makhluk mitologis, dan petualangan epik.", total_books: 32 },
    { id: 3, name: "Romansa", description: "Kisah cinta dan hubungan antar karakter.", total_books: 68 },
    { id: 4, name: "Misteri & Thriller", description: "Penuh ketegangan, teka-teki, dan plot twist.", total_books: 24 },
    { id: 5, name: "Pengembangan Diri", description: "Buku panduan untuk motivasi dan produktivitas.", total_books: 55 },
  ]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (genre) => {
    setItemToDelete(genre);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    
    setTimeout(() => {
      setGenres(prev => prev.filter(genre => genre.id !== itemToDelete.id));
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }, 800);
  };

  const filteredGenres = genres
    .filter(genre => genre.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filteredGenres.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentGenres = filteredGenres.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Kelola Genres</h2>
          <p className="text-sm text-gray-500 mt-1">Kategori dan klasifikasi buku pada sistem.</p>
        </div>
        <Link 
          to="/admin/genres/create" 
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/30 transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Tambah Genre
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 sm:text-sm transition-colors" 
              placeholder="Cari genre..." 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Genre & Deskripsi</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Buku Tertaut</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentGenres.length > 0 ? (
                currentGenres.map((genre) => (
                  <tr key={genre.id} className="hover:bg-blue-50/30 transition-colors duration-150 group">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{genre.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-blue-600">{genre.name}</span>
                        <span className="text-xs text-gray-500 mt-0.5 truncate max-w-md">{genre.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 text-center">
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-xl text-xs font-bold shadow-sm">{genre.total_books} Buku</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <Link to={`/admin/genres/edit/${genre.id}`} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(genre)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" 
                          title="Hapus"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                      <p className="text-base font-medium text-gray-900">Genre tidak ditemukan</p>
                      <p className="text-sm mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
          <div className="hidden sm:block text-sm text-gray-500">
            Menampilkan <span className="font-semibold text-gray-900">{filteredGenres.length === 0 ? 0 : startIndex + 1}</span> ke <span className="font-semibold text-gray-900">{Math.min(startIndex + itemsPerPage, filteredGenres.length)}</span> dari <span className="font-semibold text-gray-900">{filteredGenres.length}</span> hasil
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-between">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages || totalPages === 0}
              className="px-4 py-2 border border-gray-200 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      <DeleteModal 
        isOpen={isDeleteModalOpen}
        isLoading={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={`Apakah Anda yakin ingin menghapus genre "${itemToDelete?.name}"?`}
      />
    </div>
  );
}
