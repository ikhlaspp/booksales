import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, X, Clock, Search } from 'lucide-react';
import { useCountdown } from '../../hooks/useCountdown';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const formatRupiah = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount ?? 0);

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

function PendingCountdownBadge({ createdAt, transactionId, onExpire }) {
  const expiresAt = new Date(createdAt).getTime() + 60 * 60 * 1000;
  const { minutes, seconds, isExpired } = useCountdown(expiresAt);
  const hasExpired = useRef(false);

  useEffect(() => {
    if (isExpired && !hasExpired.current) {
      hasExpired.current = true;
      const token = localStorage.getItem('token');
      axios.put(`${API_URL}/api/transactions/${transactionId}`, { status: 'dibatalkan' }, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => {
        onExpire?.(transactionId);
      }).catch(console.error);
    }
  }, [isExpired, transactionId, onExpire]);

  if (isExpired) {
    return (
      <span className="flex items-center gap-1 text-[11px] font-semibold text-[#e00b41]">
        <Clock className="w-3 h-3" /> Pembayaran Gagal
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#856404]">
      <Clock className="w-3 h-3 animate-pulse" />
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  );
}

const STATUS_TABS = [
  { value: '', label: 'Semua' },
  { value: 'pending', label: 'Pending' },
  { value: 'dibayar', label: 'Dibayar' },
  { value: 'dikirim', label: 'Dikirim' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'dibatalkan', label: 'Dibatalkan' },
];

function getStatusClass(status) {
  if (status === 'dibayar' || status === 'selesai') return 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]';
  if (status === 'pending')   return 'bg-[#fff3cd] text-[#856404] border-[#ffeeba]';
  if (status === 'dikirim')   return 'bg-[#e3f2fd] text-[#1565c0] border-[#bbdefb]';
  return 'bg-surface-strong text-muted border-hairline';
}

function getPageNumbers(currentPage, lastPage) {
  if (lastPage <= 7) return Array.from({ length: lastPage }, (_, i) => i + 1);
  if (currentPage <= 4)           return [1, 2, 3, 4, 5, '...', lastPage];
  if (currentPage >= lastPage - 3) return [1, '...', lastPage - 4, lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage];
}

function OrdersTable() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, last_page: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const tableTopRef = useRef(null);

  // Debounce raw search: after 400ms update debouncedSearch and reset to page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch transactions — all setState calls inside async function to satisfy lint
  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = { page: currentPage, per_page: 10 };
    if (debouncedSearch) params.search = debouncedSearch;
    if (activeStatus)   params.status  = activeStatus;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}/api/user/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });
        setTransactions(res.data.data || []);
        setPagination({ total: res.data.total || 0, last_page: res.data.last_page || 1 });
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Gagal memuat pesanan. Coba lagi.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, debouncedSearch, activeStatus, navigate, retryCount]);

  const handleTransactionExpire = (transactionId) => {
    setTransactions(prev =>
      prev.map(tx => (tx.id === transactionId ? { ...tx, status: 'dibatalkan' } : tx))
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    tableTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const startItem = pagination.total === 0 ? 0 : (currentPage - 1) * 10 + 1;
  const endItem   = Math.min(currentPage * 10, pagination.total);

  return (
    <div ref={tableTopRef}>
      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari nomor pesanan atau judul buku..."
          className="w-full bg-surface-soft border border-hairline rounded-[8px] pl-10 pr-10 py-2.5 text-body-sm focus:outline-none focus:border-ink transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status tab pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => { setActiveStatus(tab.value); setCurrentPage(1); }}
            className={`shrink-0 px-4 py-1.5 rounded-full text-body-sm font-semibold transition-colors ${
              activeStatus === tab.value
                ? 'bg-[#ff385c] text-white'
                : 'border border-hairline text-muted hover:text-ink hover:border-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-8 text-center border border-hairline border-dashed rounded-[14px] bg-surface-soft">
          <p className="text-body-sm text-muted mb-3">{error}</p>
          <button
            onClick={() => { setError(null); setRetryCount(c => c + 1); }}
            className="text-body-sm font-semibold text-[#ff385c] hover:underline"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Loading spinner */}
      {isLoading && !error && (
        <div className="py-12 flex justify-center">
          <div className="w-6 h-6 border-4 border-hairline border-t-[#ff385c] rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && transactions.length === 0 && (
        <div className="p-10 text-center border border-hairline border-dashed rounded-[14px] bg-surface-soft">
          <Search className="w-8 h-8 text-muted mx-auto mb-3" />
          <p className="text-body-md text-muted mb-3">Tidak ada pesanan ditemukan.</p>
          {(search || activeStatus) && (
            <button
              onClick={() => { setSearch(''); setActiveStatus(''); }}
              className="text-body-sm font-semibold text-[#ff385c] hover:underline"
            >
              Tampilkan semua pesanan
            </button>
          )}
        </div>
      )}

      {/* Table + Pagination */}
      {!isLoading && !error && transactions.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-[14px] border border-hairline">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-soft border-b border-hairline">
                  <th className="px-4 py-3 text-caption-sm font-semibold text-muted uppercase tracking-wider whitespace-nowrap">No. Pesanan</th>
                  <th className="px-4 py-3 text-caption-sm font-semibold text-muted uppercase tracking-wider">Buku</th>
                  <th className="px-4 py-3 text-caption-sm font-semibold text-muted uppercase tracking-wider text-center whitespace-nowrap">Jml. Item</th>
                  <th className="px-4 py-3 text-caption-sm font-semibold text-muted uppercase tracking-wider text-right whitespace-nowrap">Total</th>
                  <th className="px-4 py-3 text-caption-sm font-semibold text-muted uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {transactions.map(tx => {
                  const hasItems = tx.items && tx.items.length > 0;
                  const firstBook = hasItems ? tx.items[0].book : tx.book;
                  const extraCount = hasItems ? tx.items.length - 1 : 0;
                  const totalQty  = hasItems
                    ? tx.items.reduce((sum, item) => sum + item.quantity, 0)
                    : 1;

                  return (
                    <tr key={tx.id} className="hover:bg-surface-soft transition-colors">
                      {/* No. Pesanan */}
                      <td className="px-4 py-3.5">
                        <p className="text-body-sm font-bold text-ink whitespace-nowrap">{tx.order_number}</p>
                        <p className="text-caption-sm text-muted mt-0.5 whitespace-nowrap">{formatDate(tx.created_at)}</p>
                      </td>

                      {/* Buku */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-10 bg-surface-strong rounded-sm overflow-hidden shrink-0">
                            {firstBook?.cover_photo ? (
                              <img
                                src={firstBook.cover_photo.startsWith('http') ? firstBook.cover_photo : `${API_URL}/storage/covers/${firstBook.cover_photo}`}
                                alt={firstBook.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted text-[10px]">—</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-body-sm font-semibold text-ink line-clamp-1">{firstBook?.title || 'Buku Dihapus'}</p>
                            {extraCount > 0 && (
                              <p className="text-caption-sm text-muted">+{extraCount} lainnya</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Jml. Item */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-body-sm text-ink">{totalQty}</span>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-body-sm font-bold text-ink whitespace-nowrap">{formatRupiah(tx.total_amount)}</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border whitespace-nowrap ${getStatusClass(tx.status)}`}>
                            {tx.status}
                          </span>
                          {tx.status === 'pending' && (
                            <PendingCountdownBadge
                              createdAt={tx.created_at}
                              transactionId={tx.id}
                              onExpire={handleTransactionExpire}
                            />
                          )}
                        </div>
                      </td>

                      {/* Aksi */}
                      <td className="px-4 py-3.5">
                        <Link
                          to={`/profile/orders/${tx.id}`}
                          className="px-3 py-1.5 border border-hairline rounded-full text-caption-sm font-semibold text-ink hover:bg-surface-soft transition-colors whitespace-nowrap"
                        >
                          Lihat
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5">
            <p className="text-caption-sm text-muted">
              Menampilkan {startItem}–{endItem} dari {pagination.total} pesanan
            </p>
            <div className="flex items-center gap-1 flex-wrap justify-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-full border border-hairline text-body-sm font-semibold text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-soft transition-colors"
              >
                ← Prev
              </button>

              {getPageNumbers(currentPage, pagination.last_page).map((page, idx) =>
                page === '...' ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-8 h-8 flex items-center justify-center text-muted text-body-sm select-none"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-full text-body-sm font-semibold transition-colors ${
                      currentPage === page
                        ? 'bg-[#ff385c] text-white'
                        : 'border border-hairline text-ink hover:bg-surface-soft'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.last_page}
                className="px-3 py-1.5 rounded-full border border-hairline text-body-sm font-semibold text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-soft transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successBanner, setSuccessBanner] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.checkoutSuccess) {
      setSuccessBanner(`Pembayaran berhasil! Pesanan ${location.state.orderId || ''} sedang diproses.`);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        setIsLoading(true);
        const userRes = await axios.get(`${API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user_role');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas pt-24 flex justify-center items-start">
        <div className="w-8 h-8 border-4 border-hairline border-t-rausch rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-canvas min-h-screen text-ink pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-16">

        {/* Success Banner */}
        {successBanner && (
          <div className="mb-8 bg-[#e8f5e9] border border-[#c8e6c9] rounded-[14px] p-4 flex items-center gap-3 animate-fade-in-up relative">
            <CheckCircle2 className="w-5 h-5 text-[#2e7d32] shrink-0" />
            <p className="text-body-sm font-medium text-[#2e7d32] flex-1">{successBanner}</p>
            <button onClick={() => setSuccessBanner(null)} className="text-[#2e7d32]/60 hover:text-[#2e7d32] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <h1 className="text-display-xl font-bold mb-8 md:mb-12">Profil Saya</h1>

        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">

          {/* Sisi Kiri: Informasi Akun */}
          <div className="w-full md:w-1/3 shrink-0">
            <div className="bg-canvas border border-hairline rounded-[14px] p-6 shadow-sm flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-surface-strong mb-4 overflow-hidden shadow-inner">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=222222&color=ffffff&size=128`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-title-lg font-bold text-ink mb-1">{user.name}</h2>
              <p className="text-body-sm text-muted mb-4">{user.email}</p>

              <Link
                to="/profile/edit"
                className="border border-hairline rounded-full px-4 py-1.5 text-body-sm font-semibold text-ink hover:bg-surface-soft transition-colors mb-4"
              >
                Edit Profil
              </Link>

              <div className="w-full border-t border-hairline pt-4 mt-2">
                <div className="flex flex-col items-start text-left w-full space-y-3">
                  <div>
                    <span className="text-caption-sm text-muted block mb-0.5">Bergabung Sejak</span>
                    <span className="text-body-sm font-medium">{formatDate(user.created_at)}</span>
                  </div>
                  <div className="w-full pt-3 border-t border-hairline-soft">
                    <span className="text-caption-sm text-muted block mb-2">Alamat Pengiriman</span>
                    {user.address ? (
                      <p className="text-body-sm text-ink leading-relaxed">
                        {user.address}<br />{user.city}, {user.postal_code}
                      </p>
                    ) : (
                      <p className="text-body-sm text-muted italic">Belum ada alamat</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Histori Transaksi */}
          <div className="w-full md:flex-1">
            <h3 className="text-title-md font-bold mb-6">Pesanan Saya</h3>
            <OrdersTable />
          </div>

        </div>
      </div>

    </div>
  );
}
