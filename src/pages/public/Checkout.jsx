import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { MapPin, ShoppingBag, CreditCard, ChevronLeft, Plus, Minus, Trash2, X } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const formatRupiah = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount ?? 0);

export default function Checkout() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Address State
  const [address, setAddress] = useState({
    street: 'Jl. Merdeka No. 123',
    city: 'Jakarta Selatan',
    zipCode: '12345'
  });
  
  const [tempAddress, setEditAddress] = useState({ ...address });
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Calculations
  const subtotal = cartTotal;
  const tax = subtotal * 0.11;
  const shipping = 10000;
  const grandTotal = subtotal + tax + shipping;

  useEffect(() => {
    if (cartItems.length === 0 && !isProcessing) {
      navigate('/');
    }
  }, [cartItems, navigate, isProcessing]);

  const handleUpdateAddress = (e) => {
    e.preventDefault();
    setAddress({ ...tempAddress });
    setIsAddressModalOpen(false);
  };

  const handlePayment = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { message: "Silakan login untuk melanjutkan pembayaran.", from: location } });
      return;
    }

    try {
      setIsProcessing(true);
      
      const itemsPayload = cartItems.map(item => ({
        book_id: item.id,
        quantity: item.quantity || 1
      }));

      // Send checkout data to backend
      const response = await axios.post(`${API_BASE_URL}/transactions`, {
        items: itemsPayload,
        shipping_address: address.street,
        city: address.city,
        postal_code: address.zipCode
      }, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const { snap_token, transaction } = response.data;

      if (snap_token) {
        window.snap.pay(snap_token, {
          onSuccess: async function(result){
            await axios.put(`${API_BASE_URL}/transactions/${transaction.id}`, { status: 'dibayar' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            clearCart();
            navigate(`/profile/orders/${transaction.id}`, {
              state: { checkoutSuccess: true, orderId: transaction.order_number }
            });
          },
          onPending: function(result){
            clearCart();
            navigate('/profile');
          },
          onError: function(result){
            setIsProcessing(false);
          },
          onClose: function(){
            navigate('/profile');
          }
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.response?.data?.message || 'Gagal memproses pesanan.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-canvas min-h-screen pb-24 pt-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link to="/" className="p-2 hover:bg-surface-soft rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-ink" />
          </Link>
          <h1 className="text-display-md font-bold text-ink text-display-xl">Konfirmasi Pesanan</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Column: Forms */}
          <div className="flex-1 w-full space-y-8">
            
            {/* Address Card */}
            <div className="bg-canvas border border-hairline rounded-[14px] p-8 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-soft rounded-full flex items-center justify-center text-ink">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-title-md font-bold text-ink">Alamat Pengiriman</h2>
                    <p className="text-body-sm text-muted">Buku fisik akan dikirim ke alamat ini</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddressModalOpen(true)}
                  className="text-body-sm font-bold text-ink underline hover:text-rausch transition-colors"
                >
                  Ubah Alamat
                </button>
              </div>

              <div className="p-4 bg-surface-soft rounded-lg border border-hairline/50">
                <p className="text-body-md font-semibold text-ink">{address.street}</p>
                <p className="text-body-md text-ink">{address.city}</p>
                <p className="text-body-sm text-muted mt-1">Kode Pos: {address.zipCode}</p>
              </div>
            </div>

            {/* Items List */}
            <div className="bg-canvas border border-hairline rounded-[14px] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-surface-soft rounded-full flex items-center justify-center text-ink">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h2 className="text-title-md font-bold text-ink">Daftar Buku ({cartItems.length})</h2>
              </div>

              <div className="divide-y divide-hairline">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex gap-6 group">
                    <div className="w-20 h-28 bg-surface-soft rounded-md overflow-hidden shrink-0 border border-hairline">
                      <img 
                        src={item.cover_photo?.startsWith('http') ? item.cover_photo : `${API_BASE_URL.replace('/api', '')}/storage/covers/${item.cover_photo}`} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-body-md font-bold text-ink line-clamp-1">{item.title}</h3>
                          <p className="text-caption-sm text-muted mt-1">{item.author?.name || 'Penulis'}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-muted hover:text-rausch transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center gap-3 bg-surface-soft rounded-full px-2 py-1">
                          <button 
                            onClick={() => decreaseQuantity(item.id)}
                            className="p-1.5 hover:bg-canvas rounded-full transition-colors disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-body-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => increaseQuantity(item.id)}
                            className="p-1.5 hover:bg-canvas rounded-full transition-colors disabled:opacity-30"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-body-md font-bold text-ink">{formatRupiah(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-24">
            <div className="bg-canvas border border-hairline rounded-[14px] p-8 shadow-sm">
              <h2 className="text-title-md font-bold text-ink mb-8">Ringkasan Biaya</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-body-md text-muted">
                  <span>Subtotal</span>
                  <span className="text-ink font-medium">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-body-md text-muted">
                  <span>Pajak (11%)</span>
                  <span className="text-ink font-medium">{formatRupiah(tax)}</span>
                </div>
                <div className="flex justify-between text-body-md text-muted">
                  <span>Biaya Pengiriman</span>
                  <span className="text-ink font-medium">{formatRupiah(shipping)}</span>
                </div>
                
                <div className="pt-4 border-t border-hairline mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-title-md font-bold text-ink">Total Bayar</span>
                    <span className="text-display-sm font-bold text-rausch">{formatRupiah(grandTotal)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsConfirmOpen(true)}
                disabled={isProcessing || cartItems.length === 0}
                className="w-full py-4 bg-rausch text-white rounded-full font-bold text-button-lg transition-all hover:bg-rausch-active hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <CreditCard className="w-5 h-5" />
                )}
                {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
              </button>

              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-caption-sm text-muted">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Transaksi Terenkripsi & Aman</span>
                </div>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_Midtrans.png/1200px-Logo_Midtrans.png" 
                  alt="Midtrans" 
                  className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-help"
                  title="Powered by Midtrans"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Address Edit Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fadeIn" onClick={() => setIsAddressModalOpen(false)} />
          <div className="relative bg-canvas w-full max-w-md rounded-[14px] shadow-2xl p-8 animate-fadeInUp">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-title-md font-bold text-ink">Ubah Alamat Pengiriman</h3>
              <button onClick={() => setIsAddressModalOpen(false)} className="p-2 hover:bg-surface-soft rounded-full">
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>

            <form onSubmit={handleUpdateAddress} className="space-y-4">
              <div>
                <label className="block text-caption-sm font-bold text-ink uppercase mb-1.5">Nama Jalan & No Rumah</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-hairline rounded-md focus:ring-1 focus:ring-rausch outline-none text-body-md"
                  value={tempAddress.street}
                  onChange={(e) => setEditAddress({ ...tempAddress, street: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-caption-sm font-bold text-ink uppercase mb-1.5">Kota</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-hairline rounded-md focus:ring-1 focus:ring-rausch outline-none text-body-md"
                  value={tempAddress.city}
                  onChange={(e) => setEditAddress({ ...tempAddress, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-caption-sm font-bold text-ink uppercase mb-1.5">Kode Pos</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-hairline rounded-md focus:ring-1 focus:ring-rausch outline-none text-body-md"
                  value={tempAddress.zipCode}
                  onChange={(e) => setEditAddress({ ...tempAddress, zipCode: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full mt-6 py-3 bg-ink text-white rounded-full font-bold hover:bg-ink/90 transition-colors"
              >
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}

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
