import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AdminCrudTable from '../../../components/admin/AdminCrudTable';
import GenreFormModal from './Form';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function AdminGenres() {
  const [genres, setGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [paginationMeta, setPaginationMeta] = useState({ from: 0, to: 0, total: 0 });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchGenres = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/genres`, {
        params: { search: debouncedSearch, page: currentPage, per_page: 10 },
      });
      const res = response.data;
      setGenres(res.data || []);
      setTotalPages(res.last_page || 0);
      setPaginationMeta({ from: res.from || 0, to: res.to || 0, total: res.total || 0 });
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  }, [debouncedSearch, currentPage]);

  useEffect(() => { fetchGenres(); }, [fetchGenres]);

  const handleDelete = async (genre) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/genres/${genre.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGenres();
    } catch (error) {
      console.error('Error deleting genre:', error);
    }
  };

  const columns = [
    { key: 'id', label: 'ID', render: (item) => <span className="font-medium text-ink">#{item.id}</span> },
    { key: 'name', label: 'Nama Genre', render: (item) => <span className="font-bold text-ink">{item.name}</span> },
    { key: 'description', label: 'Deskripsi', render: (item) => <p className="text-muted truncate max-w-md">{item.description || '-'}</p> },
  ];

  const handleAddClick = () => {
    setSelectedGenre(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (genre) => {
    setSelectedGenre(genre);
    setIsFormOpen(true);
  };

  return (
    <>
      <AdminCrudTable
        title="Kelola Genres"
        subtitle="Kategori dan klasifikasi buku pada sistem."
        onAddClick={handleAddClick}
        addLabel="Tambah Genre"
        columns={columns}
      data={genres}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Cari genre..."
      pagination={{
        currentPage,
        totalPages,
        from: paginationMeta.from,
        to: paginationMeta.to,
        total: paginationMeta.total,
      }}
        onPageChange={setCurrentPage}
        onEditClick={handleEditClick}
        onDelete={handleDelete}
        deleteMessage={(item) => `Apakah Anda yakin ingin menghapus genre "${item.name}"?`}
        emptyLabel="Genre tidak ditemukan"
        emptySubLabel="Coba gunakan kata kunci pencarian yang lain."
      />
      <GenreFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchGenres}
        genre={selectedGenre}
      />
    </>
  );
}
