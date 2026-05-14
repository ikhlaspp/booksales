import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AdminCrudTable from '../../../components/admin/AdminCrudTable';
import AuthorFormModal from './Form';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function AdminAuthors() {
  const [authors, setAuthors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [paginationMeta, setPaginationMeta] = useState({ from: 0, to: 0, total: 0 });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchAuthors = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/authors`, {
        params: { search: debouncedSearch, page: currentPage, per_page: 10 },
      });
      const res = response.data;
      setAuthors(res.data || []);
      setTotalPages(res.last_page || 0);
      setPaginationMeta({ from: res.from || 0, to: res.to || 0, total: res.total || 0 });
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  }, [debouncedSearch, currentPage]);

  useEffect(() => { fetchAuthors(); }, [fetchAuthors]);

  const handleDelete = async (author) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/authors/${author.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAuthors();
    } catch (error) {
      console.error('Error deleting author:', error);
    }
  };

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : '?');

  const columns = [
    { key: 'id', label: 'ID', render: (item) => <span className="font-medium text-ink">#{item.id}</span> },
    {
      key: 'name',
      label: 'Author',
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.photo ? (
            <img src={item.photo} alt={item.name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-surface-strong text-ink flex items-center justify-center text-body-sm font-bold">
              {getInitials(item.name)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-ink">{item.name}</span>
            {item.email && <span className="text-caption-sm text-muted">{item.email}</span>}
          </div>
        </div>
      ),
    },
    {
      key: 'total_books',
      label: 'Total Buku',
      align: 'center',
      render: (item) => (
        <span className="bg-surface-strong px-2.5 py-1 rounded-sm text-body-sm font-medium text-ink">
          {item.total_books ?? 0}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => {
        const isActive = item.status === 'Active';
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-badge font-semibold ${
            isActive
              ? 'bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]'
              : 'bg-surface-strong text-muted border border-hairline'
          }`}>
            {item.status || 'Unknown'}
          </span>
        );
      },
    },
  ];

  const handleAddClick = () => {
    setSelectedAuthor(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (author) => {
    setSelectedAuthor(author);
    setIsFormOpen(true);
  };

  return (
    <>
      <AdminCrudTable
        title="Kelola Authors"
        subtitle="Daftar penulis buku yang terdaftar di sistem."
        onAddClick={handleAddClick}
        addLabel="Tambah Author"
        columns={columns}
      data={authors}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Cari nama author..."
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
        deleteMessage={(item) => `Apakah Anda yakin ingin menghapus author "${item.name}"?`}
        emptyLabel="Author tidak ditemukan"
        emptySubLabel="Coba gunakan kata kunci pencarian yang lain."
      />
      <AuthorFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchAuthors}
        author={selectedAuthor}
      />
    </>
  );
}
