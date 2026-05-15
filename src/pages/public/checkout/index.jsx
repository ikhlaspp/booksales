import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { ShieldCheck, Lock, ArrowLeft, Package, CreditCard, AlertCircle, CheckCircle2, Clock, X, MapPin, Plus, Minus, Trash2 } from 'lucide-react';
import axios from 'axios';
import ConfirmModal from '../../../components/ConfirmModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const SNAP_SCRIPT_URL = 'https://app.sandbox.midtrans.com/snap/snap.js';

const formatRupiah = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount ?? 0);

// Toast Notification Component
function Toast({ message, type = 'info', onClose }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#2e7d32]" />,
    error: <AlertCircle className="w-5 h-5 text-[#e00b41]" />,
    pending: <Clock className="w-5 h-5 text-[#856404]" />,
    info: <AlertCircle className="w-5 h-5 text-[#1976d2]" />,
  };

  const bgColors = {
    success: 'bg-[#e8f5e9] border-[#c8e6c9]',
    error: 'bg-[#ffeef1] border-[#ffd1da]',
    pending: 'bg-[#fff3cd] border-[#ffeeba]',
    info: 'bg-[#e3f2fd] border-[#bbdefb]',
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-24 right-6 z-[9999] max-w-md animate-fade-in-up`}>
      <div className={`${bgColors[type]} border rounded-[14px] p-4 pr-10 shadow-[0_4px_20px_rgba(0,0,0,0.12)] relative`}>
        <button onClick={onClose} className="absolute top-3 right-3 text-muted hover:text-ink transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3">
          {icons[type]}
          <p className="text-body-sm text-ink font-medium leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Address Modal Component
function AddressModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    street: initialData?.street || '',
    city: initialData?.city || '',
    postalCode: initialData?.postalCode || '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-canvas w-full max-w-md rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-hairline">
          <h3 className="text-title-md font-bold text-ink">Alamat Pengiriman</h3>
          <button onClick={onClose} className="text-muted hover:text-ink transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-body-sm font-semibold text-ink mb-1.5">Nama Jalan & Detail Rumah</label>
            <textarea
              required
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
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
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 bg-surface-soft border border-hairline rounded-md focus:outline-none focus:border-ink focus:bg-canvas transition-colors text-body-md"
                placeholder="Jakarta Selatan"
              />
            </div>
            <div>
              <label className="block text-body-sm font-semibold text-ink mb-1.5">Kode Pos</label>
              <input
                type="text"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-4 py-3 bg-surface-soft border border-hairline rounded-md focus:outline-none focus:border-ink focus:bg-canvas transition-colors text-body-md"
                placeholder="12345"
              />
            </div>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3.5 bg-ink text-white rounded-full font-bold text-button-md transition-all hover:opacity-90"
            >
              Simpan Alamat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Checkout() {
  const { cartItems, clearCart, cartTotal, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const snapLoaded = useRef(false);

  // Address State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);

  // Cost Calculations
  const taxAmount = cartTotal * 0.11;
  const shippingCost = 10000;
  const grandTotal = cartTotal + taxAmount + shippingCost;

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoadingUser && cartItems.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [cartItems, isLoadingUser, navigate]);

  // Load user data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { message: 'Silakan login terlebih dahulu.' } });
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL.replace('/api', '')}/api/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        if (res.data.address && res.data.city && res.data.postal_code) {
          setSavedAddress({
            street: res.data.address,
            city: res.data.city,
            postalCode: res.data.postal_code,
          });
        }
      } catch {
        navigate('/login');
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Load Midtrans Snap script
  useEffect(() => {
    if (snapLoaded.current) return;

    const existingScript = document.querySelector(`script[src="${SNAP_SCRIPT_URL}"]`);
    if (existingScript) {
      snapLoaded.current = true;
      return;
    }

    const script = document.createElement('script');
    script.src = SNAP_SCRIPT_URL;
    script.setAttribute('data-client-key', ''); // Will be set from backend response
    script.async = true;
    script.onload = () => {
      snapLoaded.current = true;
    };
    document.head.appendChild(script);

    return () => {
      // Don't remove the script on cleanup since it might be needed
    };
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleSaveAddress = async (data) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_BASE_URL}/user/profile`, {
        address: data.street,
        city: data.city,
        postal_code: data.postalCode,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      showToast('Gagal menyimpan alamat ke profil.', 'error');
    }
    setSavedAddress(data);
  };

  const handlePayment = async () => {
    if (isProcessing || cartItems.length === 0) return;

    if (!savedAddress) {
      showToast('Silakan isi alamat pengiriman terlebih dahulu.', 'error');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setIsProcessing(true);

      // Kirim data ke backend
      const items = cartItems.map(item => ({
        book_id: item.id,
        quantity: item.quantity || 1,
      }));

      const payload = {
        items,
        shipping_address: savedAddress.street,
        city: savedAddress.city,
        postal_code: savedAddress.postalCode,
      };

      const response = await axios.post(`${API_BASE_URL}/transactions`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { snap_token: snapToken, client_key: clientKey, transaction } = response.data;

      if (!snapToken) {
        showToast('Tidak dapat membuat token pembayaran. Silakan coba lagi nanti.', 'error');
        setIsProcessing(false);
        return;
      }

      // Update client key for Snap
      const snapScript = document.querySelector(`script[src="${SNAP_SCRIPT_URL}"]`);
      if (snapScript && clientKey) {
        snapScript.setAttribute('data-client-key', clientKey);
      }

      // Tunggu Snap tersedia
      if (!window.snap) {
        showToast('Sistem pembayaran sedang dimuat, silakan coba lagi dalam beberapa detik.', 'info');
        setIsProcessing(false);
        return;
      }

      window.snap.pay(snapToken, {
        onSuccess: (result) => {
          clearCart();
          navigate(`/profile/orders/${transaction.id}`, {
            state: {
              checkoutSuccess: true,
              orderId: transaction.order_number,
            }
          });
        },
        onPending: (result) => {
          showToast(
            `Pesanan ${result.order_id} berhasil dibuat! Silakan selesaikan pembayaran sesuai instruksi yang diberikan.`,
            'pending'
          );
          clearCart();
          setTimeout(() => navigate('/profile'), 3000);
        },
        onError: (result) => {
          console.error('Payment error:', result);
          showToast(
            'Terjadi kendala saat memproses pembayaran. Keranjang belanja Anda tetap tersimpan — silakan coba lagi.',
            'error'
          );
        },
        onClose: () => {
          navigate('/profile');
        }
      });

    } catch (error) {
      console.error('Checkout error:', error);

      const errorMsg = error.response?.data?.message;

      if (error.response?.status === 422 && errorMsg) {
        showToast(errorMsg, 'error');
      } else if (error.response?.status === 404 && errorMsg) {
        showToast(errorMsg, 'error');
      } else if (!error.response) {
        showToast(
          'Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.',
          'error'
        );
      } else {
        showToast(
          'Terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu — silakan coba lagi nanti.',
          'error'
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-canvas pt-24 flex justify-center items-start">
        <div className="w-8 h-8 border-4 border-hairline border-t-rausch rounded-full animate-spin"></div>
      </div>
    );
  }

  if (cartItems.length === 0) return null;

  return (
    <div className="bg-canvas min-h-screen pb-20">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveAddress}
        initialData={savedAddress}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 md:mb-14">
          <Link
            to="/cart"
            className="p-2 rounded-full hover:bg-surface-soft transition-colors text-muted hover:text-ink"
            aria-label="Kembali ke keranjang"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-display-xl font-bold text-ink">Checkout</h1>
            <p className="text-body-sm text-muted mt-1">Konfirmasi pesanan dan selesaikan pembayaran</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

          {/* Left Column - Shipping & Payment Info */}
          <div className="flex-1 w-full space-y-8">

            {/* Delivery Info */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-ink text-white text-caption-sm font-bold flex items-center justify-center">1</span>
                  <h2 className="text-title-md font-bold text-ink">Alamat Pengiriman</h2>
                </div>
              </div>
              <div className="bg-canvas border border-hairline rounded-[14px] p-5 md:p-6">
                {savedAddress ? (
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-muted mt-0.5 shrink-0" />
                      <div>
                        <p className="text-body-md font-semibold text-ink mb-1">{user?.name}</p>
                        <p className="text-body-sm text-muted leading-relaxed">
                          {savedAddress.street}<br />
                          {savedAddress.city}, {savedAddress.postalCode}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsAddressModalOpen(true)}
                      className="text-body-sm font-semibold text-rausch hover:underline"
                    >
                      Ubah Alamat
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <MapPin className="w-8 h-8 text-muted mx-auto mb-3" />
                    <p className="text-body-md text-muted mb-4">Anda belum menambahkan alamat pengiriman.</p>
                    <button
                      onClick={() => setIsAddressModalOpen(true)}
                      className="px-6 py-2.5 bg-surface-strong text-ink rounded-full font-semibold hover:bg-hairline transition-colors"
                    >
                      Tambah Alamat
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <div className="flex items-center gap-2 mb-5">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-caption-sm font-bold flex items-center justify-center">2</span>
                <h2 className="text-title-md font-bold text-ink">Metode Pembayaran</h2>
              </div>
              <div className="bg-canvas border border-hairline rounded-[14px] p-5 md:p-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#2e7d32] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-body-md font-semibold text-ink mb-1">Pembayaran Aman via Midtrans</p>
                    <p className="text-body-sm text-muted leading-relaxed">
                      Anda akan diarahkan ke halaman pembayaran Midtrans yang aman. Tersedia berbagai metode pembayaran termasuk Transfer Bank, E-Wallet, Kartu Kredit, dan lainnya.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['BCA', 'BNI', 'Mandiri', 'GoPay', 'QRIS', 'DANA'].map((method) => (
                        <span
                          key={method}
                          className="px-3 py-1 bg-surface-soft border border-hairline-soft rounded-full text-caption-sm font-medium text-muted"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-[450px] shrink-0 sticky top-28">
            <div className="bg-canvas border border-hairline rounded-[14px] shadow-sm overflow-hidden">

              {/* Summary Header */}
              <div className="p-6 pb-0">
                <h3 className="text-title-md font-bold text-ink mb-5">Ringkasan Pesanan</h3>
              </div>

              {/* Items List with Increment/Decrement */}
              <div className="px-6 max-h-[320px] overflow-y-auto scrollbar-hide">
                <div className="space-y-5 pb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-20 bg-surface-soft rounded-md overflow-hidden shrink-0 border border-hairline-soft">
                        <img
                          src={item.cover_photo?.startsWith('http') ? item.cover_photo : `${API_BASE_URL.replace('/api', '')}/storage/covers/${item.cover_photo}`}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <p className="text-body-sm font-semibold text-ink leading-tight line-clamp-2 mb-1">{item.title}</p>
                        <p className="text-body-sm font-bold text-ink">{formatRupiah(item.price)}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between shrink-0">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted hover:text-rausch p-1 -mr-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-3 bg-surface-soft rounded-full px-2 py-1 border border-hairline-soft mt-2">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="p-1 rounded-full hover:bg-canvas text-ink transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-caption-sm font-semibold w-3 text-center">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="p-1 rounded-full hover:bg-canvas text-ink transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="px-6 pt-5 border-t border-hairline">
                <div className="space-y-3">
                  <div className="flex justify-between text-body-sm">
                    <span className="text-muted">Subtotal ({cartItems.reduce((t, i) => t + (i.quantity || 1), 0)} buku)</span>
                    <span className="text-ink font-medium">{formatRupiah(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-body-sm">
                    <span className="text-muted">Pajak (11%)</span>
                    <span className="text-ink font-medium">{formatRupiah(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-body-sm">
                    <span className="text-muted">Ongkos Kirim</span>
                    <span className="text-ink font-medium">{formatRupiah(shippingCost)}</span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="px-6 py-4 mt-3 border-t border-hairline bg-surface-soft/50">
                <div className="flex justify-between items-center">
                  <span className="text-title-md font-bold text-ink">Total Akhir</span>
                  <span className="text-title-lg font-bold text-rausch">{formatRupiah(grandTotal)}</span>
                </div>
              </div>

              {/* Pay Button */}
              <div className="p-6 pt-4">
                <button
                  id="checkout-pay-button"
                  onClick={() => setIsConfirmOpen(true)}
                  disabled={isProcessing || !savedAddress}
                  className="w-full py-4 bg-rausch text-white rounded-full font-bold text-button-lg transition-all hover:bg-rausch-active hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Memproses Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 transition-transform group-hover:scale-110" />
                      <span>Bayar Sekarang</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-muted-soft" />
                  <p className="text-[11px] text-muted-soft">
                    Transaksi dilindungi enkripsi SSL 256-bit
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          handlePayment();
        }}
        isLoading={isProcessing}
        title="Konfirmasi Pembayaran"
        message={`Total yang akan dibayar: ${formatRupiah(grandTotal)}. Lanjutkan ke pembayaran?`}
      />
    </div>
  );
}
