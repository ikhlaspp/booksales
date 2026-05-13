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
          <h2 className="text-[22px] font-bold text-[#222222] tracking-[-0.44px]">Kelola Genres</h2>
          <p className="text-[14px] text-[#6a6a6a] mt-1">Kategori dan klasifikasi buku pada sistem.</p>
        </div>
        <Link 
          to="/admin/genres/create" 
          className="inline-flex items-center px-[24px] py-[14px] bg-[#ff385c] text-[#ffffff] text-[16px] font-medium rounded-[8px] hover:bg-[#e00b41] transition-colors h-[48px]"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Tambah Genre
        </Link>
      </div>

      <div className="bg-[#ffffff] border border-[#ebebeb] rounded-[14px] shadow-[0_2px_6px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#ebebeb] bg-[#ffffff] flex items-center">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-[#6a6a6a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              className="block w-full h-[48px] pl-10 pr-3 border border-[#dddddd] rounded-[8px] leading-5 bg-[#ffffff] text-[#222222] placeholder-[#6a6a6a] focus:outline-none focus:border-2 focus:border-[#222222] text-[14px] transition-colors" 
              placeholder="Cari genre..." 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f7f7f7] border-b border-[#ebebeb]">
                <th className="px-6 py-4 text-[12px] font-bold text-[#6a6a6a] uppercase tracking-wider w-20">ID</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#6a6a6a] uppercase tracking-wider">Nama Genre & Deskripsi</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#6a6a6a] uppercase tracking-wider text-center">Buku Tertaut</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#6a6a6a] uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebebeb]">
              {currentGenres.length > 0 ? (
                currentGenres.map((genre) => (
                  <tr key={genre.id} className="hover:bg-[#f7f7f7] transition-colors duration-150 group">
                    <td className="px-6 py-4 text-[14px] font-medium text-[#222222]">#{genre.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-[#222222]">{genre.name}</span>
                        <span className="text-[14px] text-[#6a6a6a] mt-0.5 truncate max-w-md">{genre.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[14px] font-medium text-[#222222] text-center">
                      <span className="bg-[#f2f2f2] text-[#222222] border border-[#ebebeb] px-3 py-1 rounded-[14px] text-[12px] font-bold">{genre.total_books} Buku</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <Link to={`/admin/genres/edit/${genre.id}`} className="flex h-10 items-center justify-center px-4 bg-[#ffffff] border border-[#222222] text-[#222222] hover:bg-[#f7f7f7] rounded-[8px] transition-colors text-[14px] font-medium" title="Edit">
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(genre)}
                          className="flex h-10 items-center justify-center px-4 bg-[#ffffff] border border-[#dddddd] text-[#c13515] hover:bg-[#ffd1da] hover:border-[#ffd1da] hover:text-[#b32505] rounded-[8px] transition-colors text-[14px] font-medium" 
                          title="Hapus"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-[#dddddd] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                      <p className="text-[16px] font-medium text-[#222222]">Genre tidak ditemukan</p>
                      <p className="text-[14px] mt-1 text-[#6a6a6a]">Coba gunakan kata kunci pencarian yang lain.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-[#ebebeb] bg-[#ffffff]">
          <div className="hidden sm:block text-[14px] text-[#6a6a6a]">
            Menampilkan <span className="font-semibold text-[#222222]">{filteredGenres.length === 0 ? 0 : startIndex + 1}</span> ke <span className="font-semibold text-[#222222]">{Math.min(startIndex + itemsPerPage, filteredGenres.length)}</span> dari <span className="font-semibold text-[#222222]">{filteredGenres.length}</span> hasil
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-between">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-10 items-center px-[23px] border border-[#222222] text-[16px] font-medium rounded-[8px] text-[#222222] bg-[#ffffff] hover:bg-[#f7f7f7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:border-[#dddddd]"
            >
              Sebelumnya
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages || totalPages === 0}
              className="flex h-10 items-center px-[23px] border border-[#222222] text-[16px] font-medium rounded-[8px] text-[#222222] bg-[#ffffff] hover:bg-[#f7f7f7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:border-[#dddddd]"
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
