import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, X } from 'lucide-react';

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

export default function Profile() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successBanner, setSuccessBanner] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Show checkout success banner
  useEffect(() => {
    if (location.state?.checkoutSuccess) {
      setSuccessBanner(`Pembayaran berhasil! Pesanan ${location.state.orderId || ''} sedang diproses.`);
      // Clean up state so banner doesn't reappear on refresh
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
        // Fetch User Info
        const userRes = await axios.get(`${API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data);

        // Fetch User Transactions
        const txRes = await axios.get(`${API_URL}/api/user/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Assuming paginated response or direct array
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

                  // Determine display: use items if available, otherwise fallback to book
                  const hasItems = tx.items && tx.items.length > 0;
                  const displayItems = hasItems ? tx.items : (tx.book ? [{ book: tx.book, quantity: 1, price: tx.total_amount }] : []);

                  return (
                    <div key={tx.id} className="border border-hairline rounded-[14px] p-5 bg-canvas transition-shadow hover:shadow-sm">
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-hairline-soft">
                        <div className="flex items-center gap-2">
                          <span className="text-caption-sm text-muted">{tx.order_number}</span>
                          <span className="text-caption-sm text-muted">•</span>
                          <span className="text-caption-sm text-muted">{formatDate(tx.created_at)}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${statusClass}`}>
                          {tx.status}
                        </span>
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

                      {/* Total */}
                      <div className="flex justify-end items-center mt-3 pt-3 border-t border-hairline-soft">
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
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
