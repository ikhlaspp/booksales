import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AdminCrudTable from '../../../components/admin/AdminCrudTable';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [paginationMeta, setPaginationMeta] = useState({ from: 0, to: 0, total: 0 });

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedSearch(searchTerm); setCurrentPage(1); }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/users`, {
        params: { search: debouncedSearch, role: roleFilter || undefined, page: currentPage, per_page: 15 },
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      const res = response.data;
      setUsers(res.data || []);
      setTotalPages(res.last_page || 0);
      setPaginationMeta({ from: res.from || 0, to: res.to || 0, total: res.total || 0 });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [debouncedSearch, roleFilter, currentPage]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : '?');

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const columns = [
    { key: 'id', label: 'ID', render: (item) => <span className="font-medium text-ink">#{item.id}</span> },
    {
      key: 'name',
      label: 'Pengguna',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-surface-strong text-ink flex items-center justify-center text-body-sm font-bold flex-shrink-0">
            {getInitials(item.name)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-ink truncate">{item.name}</span>
            <span className="text-caption-sm text-muted truncate">{item.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (item) => {
        const isAdmin = item.role === 'admin';
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-badge font-semibold border ${isAdmin
            ? 'bg-[#fff3e0] text-[#e65100] border-[#ffe0b2]'
            : 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]'
            }`}>
            {isAdmin ? 'Admin' : 'User'}
          </span>
        );
      },
    },
    {
      key: 'last_access',
      label: 'Terakhir Aktif',
      render: (item) => <span className="text-muted">{formatDate(item.last_access || item.updated_at)}</span>,
    },
  ];

  return (
    <AdminCrudTable
      title="Data Pengguna"
      subtitle="Daftar semua pengguna yang terdaftar di sistem (read-only)."
      columns={columns}
      data={users}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Cari nama atau email..."
      filters={[{
        value: roleFilter,
        onChange: (val) => { setRoleFilter(val); setCurrentPage(1); },
        options: [
          { value: '', label: 'Semua Role' },
          { value: 'admin', label: 'Admin' },
          { value: 'customer', label: 'Customer' },
        ],
      }]}
      pagination={{ currentPage, totalPages, from: paginationMeta.from, to: paginationMeta.to, total: paginationMeta.total }}
      onPageChange={setCurrentPage}
      emptyLabel="Pengguna tidak ditemukan"
      emptySubLabel="Tidak ada pengguna yang cocok dengan pencarian."
    />
  );
}
