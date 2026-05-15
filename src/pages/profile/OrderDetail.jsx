import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useCountdown } from '../../hooks/useCountdown';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const SNAP_SCRIPT_URL = 'https://app.sandbox.midtrans.com/snap/snap.js';

const formatRupiah = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount ?? 0);

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

function StatusBadge({ status }) {
  const map = {
    pending:     { label: 'Menunggu Pembayaran', cls: 'bg-[#fff3cd] text-[#856404] border-[#ffeeba]' },
    dibayar:     { label: 'Dibayar',             cls: 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]' },
    dikirim:     { label: 'Dikirim',             cls: 'bg-[#e3f2fd] text-[#1976d2] border-[#bbdefb]' },
    selesai:     { label: 'Selesai',             cls: 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]' },
    dibatalkan:  { label: 'Dibatalkan',          cls: 'bg-[#ffeef1] text-[#e00b41] border-[#ffd1da]' },
  };
  const s = map[status] || { label: status, cls: 'bg-surface-strong text-muted border-hairline' };
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${s.cls}`}>
      {s.label}
    </span>
  );
}

function CountdownTimer({ createdAt }) {
  const expiresAt = new Date(createdAt).getTime() + 60 * 60 * 1000;
  const { minutes, seconds, isExpired } = useCountdown(expiresAt);

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 bg-[#ffeef1] border border-[#ffd1da] rounded-[14px] p-4">
        <AlertCircle className="w-5 h-5 text-[#e00b41] shrink-0" />
        <div>
          <p className="text-body-sm font-semibold text-[#e00b41]">Waktu pembayaran telah habis</p>
          <p className="text-caption-sm text-[#e00b41]/80">Pesanan ini akan segera dibatalkan secara otomatis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-[#fff3cd] border border-[#ffeeba] rounded-[14px] p-4">
      <Clock className="w-5 h-5 text-[#856404] shrink-0 animate-pulse" />
      <div>
        <p className="text-body-sm font-semibold text-[#856404]">Segera selesaikan pembayaran</p>
        <p className="text-caption-sm text-[#856404]/80">
          Sisa waktu:{' '}
          <span className="font-mono font-bold">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </p>
      </div>
    </div>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tx, setTx] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const snapLoaded = useRef(false);

  // Compute expiry before conditional returns so the hook call is always at top level
  const expiresAt = tx ? new Date(tx.created_at).getTime() + 60 * 60 * 1000 : 0;
  const { isExpired } = useCountdown(expiresAt);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    axios
      .get(`${API_BASE_URL}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTx(res.data?.data || res.data))
      .catch((err) => {
        if (err.response?.status === 403 || err.response?.status === 404) {
          navigate('/profile');
        }
      })
      .finally(() => setIsLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (snapLoaded.current) return;
    const existing = document.querySelector(`script[src="${SNAP_SCRIPT_URL}"]`);
    if (existing) { snapLoaded.current = true; return; }
    const script = document.createElement('script');
    script.src = SNAP_SCRIPT_URL;
    script.async = true;
    script.onload = () => { snapLoaded.current = true; };
    document.head.appendChild(script);
  }, []);

  const handleRetryPay = () => {
    if (!tx?.snap_token || !window.snap) return;
    setIsPaying(true);
    window.snap.pay(tx.snap_token, {
      onSuccess: () =>
        navigate('/profile', {
          state: { checkoutSuccess: true, orderId: tx.order_number },
        }),
      onPending: () => navigate('/profile'),
      onError:   () => setIsPaying(false),
      onClose:   () => setIsPaying(false),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas pt-24 flex justify-center items-start">
        <div className="w-8 h-8 border-4 border-hairline border-t-rausch rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tx) return null;

  const canPay = tx.status === 'pending' && !isExpired && tx.snap_token;

  const hasItems = tx.items && tx.items.length > 0;
  const displayItems = hasItems
    ? tx.items
    : tx.book
      ? [{ book: tx.book, quantity: 1, price: tx.total_amount }]
      : [];

  return (
    <div className="bg-canvas min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-12 md:pt-16">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            to="/profile"
            className="p-2 rounded-full hover:bg-surface-soft transition-colors text-muted hover:text-ink"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-display-xl font-bold text-ink">Detail Pesanan</h1>
            <p className="text-body-sm text-muted mt-1">{tx.order_number}</p>
          </div>
        </div>

        <div className="space-y-6">

          {/* Status + Countdown + Pay button */}
          <div className="bg-canvas border border-hairline rounded-[14px] p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-caption-sm text-muted mb-1">Status Pesanan</p>
                <StatusBadge status={tx.status} />
              </div>
              <div className="text-right">
                <p className="text-caption-sm text-muted mb-1">Tanggal Pesanan</p>
                <p className="text-body-sm font-medium text-ink">{formatDate(tx.created_at)}</p>
              </div>
            </div>

            {tx.status === 'pending' && <CountdownTimer createdAt={tx.created_at} />}

            {canPay && (
              <button
                onClick={handleRetryPay}
                disabled={isPaying}
                className="w-full py-3.5 bg-rausch text-white rounded-full font-bold text-button-md transition-all hover:bg-rausch-active disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {isPaying ? 'Membuka Pembayaran...' : 'Bayar Sekarang'}
              </button>
            )}
          </div>

          {/* Shipping Address */}
          {(tx.shipping_address || tx.city) && (
            <div className="bg-canvas border border-hairline rounded-[14px] p-6">
              <h2 className="text-title-sm font-bold text-ink mb-4">Alamat Pengiriman</h2>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted mt-0.5 shrink-0" />
                <p className="text-body-sm text-muted leading-relaxed">
                  {tx.shipping_address}<br />
                  {tx.city}{tx.postal_code ? `, ${tx.postal_code}` : ''}
                </p>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="bg-canvas border border-hairline rounded-[14px] p-6">
            <h2 className="text-title-sm font-bold text-ink mb-4">Item Pesanan</h2>
            <div className="space-y-4">
              {displayItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-14 h-[72px] bg-surface-strong rounded-md overflow-hidden shrink-0 border border-hairline-soft">
                    {item.book?.cover_photo ? (
                      <img
                        src={
                          item.book.cover_photo.startsWith('http')
                            ? item.book.cover_photo
                            : `${API_BASE_URL.replace('/api', '')}/storage/covers/${item.book.cover_photo}`
                        }
                        alt={item.book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted text-xs">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-semibold text-ink leading-tight">
                      {item.book?.title || 'Buku Dihapus'}
                    </p>
                    <p className="text-caption-sm text-muted mt-1">
                      Qty: {item.quantity} × {formatRupiah(item.price)}
                    </p>
                  </div>
                  <p className="text-body-sm font-bold text-ink shrink-0">
                    {formatRupiah(item.quantity * item.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-canvas border border-hairline rounded-[14px] p-6">
            <h2 className="text-title-sm font-bold text-ink mb-4">Rincian Pembayaran</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-body-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium text-ink">{formatRupiah(tx.subtotal)}</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-muted">Pajak (11%)</span>
                <span className="font-medium text-ink">{formatRupiah(tx.tax_amount)}</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-muted">Ongkos Kirim</span>
                <span className="font-medium text-ink">{formatRupiah(tx.shipping_cost)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-hairline">
                <span className="text-title-sm font-bold text-ink">Total</span>
                <span className="text-title-md font-bold text-rausch">{formatRupiah(tx.total_amount)}</span>
              </div>
            </div>
            {tx.payment_type && (
              <p className="text-caption-sm text-muted mt-3">
                Dibayar via:{' '}
                <span className="font-semibold text-ink capitalize">
                  {tx.payment_type.replace('_', ' ')}
                </span>
              </p>
            )}
          </div>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 text-muted-soft">
            <ShieldCheck className="w-4 h-4" />
            <p className="text-caption-sm">Transaksi dilindungi enkripsi SSL 256-bit</p>
          </div>

        </div>
      </div>
    </div>
  );
}
