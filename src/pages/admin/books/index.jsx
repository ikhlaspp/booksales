import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AdminCrudTable from '../../../components/admin/AdminCrudTable';
import BookFormModal from './Form';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const formatRupiah = (amount) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount ?? 0);

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [paginationMeta, setPaginationMeta] = useState({ from: 0, to: 0, total: 0 });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch genres for filter dropdown
  useEffect(() => {
    axios.get(`${API_URL}/api/genres`)
      .then((res) => setGenres(res.data.data || res.data || []))
      .catch((err) => console.error('Error fetching genres:', err));
  }, []);

  const fetchBooks = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/books`, {
        params: {
          search: debouncedSearch,
          genre_id: genreFilter || undefined,
          page: currentPage,
          per_page: 10,
        },
      });
      const res = response.data;
      setBooks(res.data || []);
      setTotalPages(res.last_page || 0);
      setPaginationMeta({ from: res.from || 0, to: res.to || 0, total: res.total || 0 });
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  }, [debouncedSearch, genreFilter, currentPage]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const handleDelete = async (book) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/books/${book.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Judul',
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.cover_photo ? (
            <img src={item.cover_photo} alt={item.title} className="w-10 h-14 object-cover rounded-sm shadow-sm" />
          ) : (
            <div className="w-10 h-14 bg-surface-strong rounded-sm flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
          <span className="font-bold text-ink">{item.title}</span>
        </div>
      )
    },
    { key: 'author', label: 'Penulis', render: (item) => <span className="text-muted">{item.author?.name || '-'}</span> },
    { key: 'genre', label: 'Genre', render: (item) => <span className="text-muted">{item.genre?.name || '-'}</span> },
    { key: 'price', label: 'Harga', render: (item) => <span className="font-medium text-ink">{formatRupiah(item.price)}</span> },
  ];

  const genreFilterOptions = [
    { value: '', label: 'Semua Genre' },
    ...genres.map((g) => ({ value: String(g.id), label: g.name })),
  ];

  const handleAddClick = () => {
    setSelectedBook(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setIsFormOpen(true);
  };

  return (
    <>
      <AdminCrudTable
        title="Kelola Buku"
        subtitle="Daftar buku yang tersedia di sistem."
        onAddClick={handleAddClick}
        addLabel="Tambah Buku"
        columns={columns}
      data={books}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Cari judul buku..."
      filters={[
        {
          value: genreFilter,
          onChange: (val) => { setGenreFilter(val); setCurrentPage(1); },
          options: genreFilterOptions,
        },
      ]}
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
        deleteMessage={(item) => `Apakah Anda yakin ingin menghapus buku "${item.title}"?`}
        emptyLabel="Buku tidak ditemukan"
        emptySubLabel="Coba gunakan kata kunci pencarian atau filter yang lain."
      />
      <BookFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchBooks}
        book={selectedBook}
      />
    </>
  );
}
