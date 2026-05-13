import { useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteModal from '../../../components/DeleteModal';

export default function AdminAuthors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Batas item per halaman (diatur 3 agar Anda bisa mencoba pagination-nya)

  // Menggunakan State untuk menyimpan data agar UI terupdate saat data dihapus
  const [authors, setAuthors] = useState([
    { id: 1, name: "Andrea Hirata", email: "andrea@hirata.com", total_books: 12, status: "Active" },
    { id: 2, name: "Tere Liye", email: "tereliye@mail.com", total_books: 8, status: "Active" },
    { id: 3, name: "Pramoedya Ananta Toer", email: "pramoedya@toer.com", total_books: 15, status: "Inactive" },
    { id: 4, name: "Eka Kurniawan", email: "eka@kusuma.com", total_books: 5, status: "Active" },
    { id: 5, name: "Dee Lestari", email: "dee@lestari.com", total_books: 20, status: "Active" },
  ]);

  // State untuk Pop-up Modal Delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (author) => {
    setItemToDelete(author);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    
    // Simulasi loading API hapus data
    setTimeout(() => {
      setAuthors(prev => prev.filter(author => author.id !== itemToDelete.id));
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }, 800);
  };

  // Logika Pencarian
  const filteredAuthors = authors
    .filter(author => author.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Menghitung Item untuk Halaman Saat Ini
  const totalPages = Math.ceil(filteredAuthors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAuthors = filteredAuthors.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-[#222222] tracking-[-0.44px]">Kelola Authors</h2>
          <p className="text-[14px] text-[#6a6a6a] mt-1">Daftar penulis buku yang terdaftar di sistem.</p>
        </div>
        <Link 
          to="/admin/authors/create" 
          className="inline-flex items-center px-[24px] py-[14px] bg-[#ff385c] text-[#ffffff] text-[16px] font-medium rounded-[8px] hover:bg-[#e00b41] transition-colors h-[48px]"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Tambah Author
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar: Search */}
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
                setCurrentPage(1); // Reset ke halaman 1 saat melakukan pencarian
              }}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 sm:text-sm transition-colors" 
              placeholder="Cari nama author..." 
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Author Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Total Books</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentAuthors.length > 0 ? (
                currentAuthors.map((author) => (
                  <tr key={author.id} className="hover:bg-blue-50/30 transition-colors duration-150 group">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{author.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{author.name}</span>
                        <span className="text-xs text-gray-500">{author.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 text-center">
                      <span className="bg-gray-100 px-2.5 py-1 rounded-lg text-gray-700">{author.total_books}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        author.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {author.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <Link to={`/admin/authors/edit/${author.id}`} className="flex h-10 items-center justify-center px-4 bg-[#ffffff] border border-[#222222] text-[#222222] hover:bg-[#f7f7f7] rounded-[8px] transition-colors text-[14px] font-medium" title="Edit">
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(author)}
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
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                      <p className="text-base font-medium text-gray-900">Author tidak ditemukan</p>
                      <p className="text-sm mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
          <div className="hidden sm:block text-sm text-gray-500">
            Menampilkan <span className="font-semibold text-gray-900">{filteredAuthors.length === 0 ? 0 : startIndex + 1}</span> ke <span className="font-semibold text-gray-900">{Math.min(startIndex + itemsPerPage, filteredAuthors.length)}</span> dari <span className="font-semibold text-gray-900">{filteredAuthors.length}</span> hasil
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

      {/* Modal Hapus */}
      <DeleteModal 
        isOpen={isDeleteModalOpen}
        isLoading={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={`Apakah Anda yakin ingin menghapus author "${itemToDelete?.name}"?`}
      />
    </div>
  );
}
