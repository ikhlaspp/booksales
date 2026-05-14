import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AdminCrudTable from '../../../components/admin/AdminCrudTable';
import TransactionFormModal from './Form';
import TransactionDetailModal from './DetailModal';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const formatRupiah = (amount) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount ?? 0);

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', bg: 'bg-[#fff3cd]', text: 'text-[#856404]', border: 'border-[#ffeeba]' },
  { value: 'dibayar', label: 'Dibayar', bg: 'bg-[#d4edda]', text: 'text-[#155724]', border: 'border-[#c3e6cb]' },
  { value: 'dikirim', label: 'Dikirim', bg: 'bg-[#cce5ff]', text: 'text-[#004085]', border: 'border-[#b8daff]' },
  { value: 'selesai', label: 'Selesai', bg: 'bg-[#e8f5e9]', text: 'text-[#2e7d32]', border: 'border-[#c8e6c9]' },
  { value: 'dibatalkan', label: 'Dibatalkan', bg: 'bg-surface-strong', text: 'text-muted', border: 'border-hairline' },
];

function getStatusStyle(status) {
  return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [paginationMeta, setPaginationMeta] = useState({ from: 0, to: 0, total: 0 });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDetailTransaction, setSelectedDetailTransaction] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedSearch(searchTerm); setCurrentPage(1); }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchTransactions = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/transactions`, {
        params: { search: debouncedSearch, status: statusFilter || undefined, page: currentPage, per_page: 15 },
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      const res = response.data;
      setTransactions(res.data || []);
      setTotalPages(res.last_page || 0);
      setPaginationMeta({ from: res.from || 0, to: res.to || 0, total: res.total || 0 });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [debouncedSearch, statusFilter, currentPage]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleDelete = async (transaction) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/transactions/${transaction.id}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const columns = [
    { key: 'order_number', label: 'No. Pesanan', render: (item) => <span className="font-semibold text-ink">{item.order_number}</span> },
    { key: 'customer', label: 'Pelanggan', render: (item) => <span className="text-muted">{item.customer?.name || '-'}</span> },
    { key: 'book', label: 'Buku', render: (item) => <span className="text-muted">{item.book?.title || '-'}</span> },
    { key: 'total_amount', label: 'Total', align: 'right', render: (item) => <span className="font-medium text-ink">{formatRupiah(item.total_amount)}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (item) => {
        const current = getStatusStyle(item.status);
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-badge font-semibold border ${current.bg} ${current.text} ${current.border}`}>
            {current.label}
          </span>
        );
      }
    },
  ];

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleViewClick = (transaction) => {
    setSelectedDetailTransaction(transaction);
    setIsDetailOpen(true);
  };

  return (
    <>
      <AdminCrudTable
        title="Kelola Transaksi"
        subtitle="Kelola pesanan, ubah status pengiriman, atau batalkan transaksi."
        columns={columns}
        data={transactions}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Cari no pesanan atau pembeli..."
        filters={[{
          value: statusFilter,
          onChange: (val) => { setStatusFilter(val); setCurrentPage(1); },
          options: [
            { value: '', label: 'Semua Status' },
            ...STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label })),
          ],
        }]}
        pagination={{ currentPage, totalPages, from: paginationMeta.from, to: paginationMeta.to, total: paginationMeta.total }}
        onPageChange={setCurrentPage}
        onEditClick={handleEditClick}
        onViewClick={handleViewClick}
        onDelete={handleDelete}
        deleteMessage={(item) => `Apakah Anda yakin ingin menghapus transaksi "${item.order_number}"? Tindakan ini tidak dapat dibatalkan.`}
        emptyLabel="Transaksi tidak ditemukan"
        emptySubLabel="Belum ada data transaksi."
      />
      <TransactionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchTransactions}
        transaction={selectedTransaction}
      />
      <TransactionDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        transaction={selectedDetailTransaction}
      />
    </>
  );
}