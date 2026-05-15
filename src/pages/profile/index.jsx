import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, X, MapPin, ChevronRight, Clock } from 'lucide-react';
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

function PendingCountdownBadge({ createdAt }) {
  const expiresAt = new Date(createdAt).getTime() + 60 * 60 * 1000;
  const { minutes, seconds, isExpired } = useCountdown(expiresAt);

  if (isExpired) {
    return (
      <span className="flex items-center gap-1 text-[11px] font-semibold text-[#e00b41]">
        <Clock className="w-3 h-3" /> Kadaluwarsa
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

export default function Profile() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successBanner, setSuccessBanner] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({ address: '', city: '', postal_code: '' });
  const [savingAddress, setSavingAddress] = useState(false);
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
        setAddressForm({
          address: userRes.data.address || '',
          city: userRes.data.city || '',
          postal_code: userRes.data.postal_code || '',
        });

        const txRes = await axios.get(`${API_URL}/api/user/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const txData = txRes.data?.data || txRes.data || [];
        setTransactions(txData);

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

  const hasAddress = !!(user?.address && user?.city && user?.postal_code);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      setSavingAddress(true);
      const res = await axios.put(`${API_URL}/api/user/profile`, addressForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setIsAddressModalOpen(false);
    } catch (err) {
      console.error('Failed to save address:', err);
    } finally {
      setSavingAddress(false);
    }
  };

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

              <div className="w-full border-t border-hairline pt-4 mt-2">
                <div className="flex flex-col items-start text-left w-full space-y-3">
                  <div>
                    <span className="text-caption-sm text-muted block mb-0.5">Role Akun</span>
                    <span className="text-body-sm font-semibold capitalize bg-surface-strong px-2 py-0.5 rounded-sm">{user.role}</span>
                  </div>
                  <div>
                    <span className="text-caption-sm text-muted block mb-0.5">Bergabung Sejak</span>
                    <span className="text-body-sm font-medium">{formatDate(user.created_at)}</span>
                  </div>
                  <div className="w-full pt-3 border-t border-hairline-soft">
                    <span className="text-caption-sm text-muted block mb-2">Alamat Pengiriman</span>
                    {hasAddress ? (
                      <div className="text-left">
                        <p className="text-body-sm text-ink leading-relaxed">
                          {user.address}<br />{user.city}, {user.postal_code}
                        </p>
                        <button
                          onClick={() => {
                            setAddressForm({
                              address: user.address || '',
                              city: user.city || '',
                              postal_code: user.postal_code || '',
                            });
                            setIsAddressModalOpen(true);
                          }}
                          className="text-caption-sm font-semibold text-rausch hover:underline mt-1.5"
                        >
                          Edit Alamat
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsAddressModalOpen(true)}
                        className="w-full border border-dashed border-hairline rounded-md py-2.5 text-caption-sm font-semibold text-muted hover:border-ink hover:text-ink transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        + Tambah Alamat
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Histori Transaksi */}
          <div className="w-full md:flex-1">
            <h3 className="text-title-md font-bold mb-6">Pesanan Saya</h3>

            {transactions.length === 0 ? (
              <div className="p-8 text-center border border-hairline border-dashed rounded-[14px] bg-surface-soft">
                <p className="text-body-md text-muted">Belum ada transaksi.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => {
                  const isSuccess = tx.status === 'selesai' || tx.status === 'dibayar';
                  const isPending = tx.status === 'pending';

                  let statusClass = 'bg-surface-strong text-muted border-hairline';
                  if (isSuccess) statusClass = 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]';
                  else if (isPending) statusClass = 'bg-[#fff3cd] text-[#856404] border-[#ffeeba]';

                  const hasItems = tx.items && tx.items.length > 0;
                  const displayItems = hasItems
                    ? tx.items
                    : tx.book ? [{ book: tx.book, quantity: 1, price: tx.total_amount }] : [];

                  return (
                    <Link
                      key={tx.id}
                      to={`/profile/orders/${tx.id}`}
                      className="block border border-hairline rounded-[14px] p-5 bg-canvas transition-shadow hover:shadow-sm hover:border-ink/10"
                    >
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-hairline-soft">
                        <div className="flex items-center gap-2">
                          <span className="text-caption-sm text-muted">{tx.order_number}</span>
                          <span className="text-caption-sm text-muted">•</span>
                          <span className="text-caption-sm text-muted">{formatDate(tx.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${statusClass}`}>
                            {tx.status}
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted" />
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {displayItems.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-12 h-16 bg-surface-strong rounded-sm overflow-hidden shrink-0">
                              {item.book?.cover_photo ? (
                                <img
                                  src={item.book.cover_photo.startsWith('http') ? item.book.cover_photo : `${API_URL}/storage/covers/${item.book.cover_photo}`}
                                  alt={item.book.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted text-xs">No img</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-body-sm font-semibold text-ink leading-tight line-clamp-1">{item.book?.title || 'Buku Dihapus'}</p>
                              {hasItems && <p className="text-caption-sm text-muted mt-0.5">Qty: {item.quantity} × {formatRupiah(item.price)}</p>}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total + countdown */}
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-hairline-soft">
                        {isPending ? (
                          <PendingCountdownBadge createdAt={tx.created_at} />
                        ) : (
                          <div />
                        )}
                        <div className="text-right">
                          <span className="text-caption-sm text-muted block">Total Belanja</span>
                          <span className="text-body-md font-bold text-ink">{formatRupiah(tx.total_amount)}</span>
                        </div>
                      </div>

                      {/* Payment type badge */}
                      {tx.payment_type && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="text-caption-sm text-muted">Dibayar via</span>
                          <span className="text-caption-sm font-semibold text-ink capitalize">{tx.payment_type.replace('_', ' ')}</span>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
          <div className="bg-canvas w-full max-w-md rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-hairline">
              <h3 className="text-title-md font-bold text-ink">Alamat Pengiriman</h3>
              <button onClick={() => setIsAddressModalOpen(false)} className="text-muted hover:text-ink transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveAddress} className="p-6 space-y-4">
              <div>
                <label className="block text-body-sm font-semibold text-ink mb-1.5">Nama Jalan & Detail Rumah</label>
                <textarea
                  required
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-soft border border-hairline rounded-md focus:outline-none focus:border-ink focus:bg-canvas transition-colors text-body-md"
                  placeholder="Jl. Contoh No. 123, RT 01/RW 02"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-body-sm font-semibold text-ink mb-1.5">Kota / Kabupaten</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-soft border border-hairline rounded-md focus:outline-none focus:border-ink focus:bg-canvas transition-colors text-body-md"
                    placeholder="Jakarta Selatan"
                  />
                </div>
                <div>
                  <label className="block text-body-sm font-semibold text-ink mb-1.5">Kode Pos</label>
                  <input
                    type="text"
                    required
                    value={addressForm.postal_code}
                    onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-soft border border-hairline rounded-md focus:outline-none focus:border-ink focus:bg-canvas transition-colors text-body-md"
                    placeholder="12345"
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="w-full py-3.5 bg-ink text-white rounded-full font-bold text-button-md transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {savingAddress ? 'Menyimpan...' : 'Simpan Alamat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
