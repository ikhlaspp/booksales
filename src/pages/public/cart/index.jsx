import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { ShoppingCart, Trash2, ArrowLeft, CreditCard } from 'lucide-react';
import axios from 'axios';
import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const formatRupiah = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount ?? 0);

export default function Cart() {
  const { cartItems, removeFromCart, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { message: "Silakan login terlebih dahulu untuk melakukan pemesanan." } });
      return;
    }

    if (cartItems.length === 0) return;

    navigate('/checkout');
  };

  return (
    <div className="bg-canvas min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-16">
        <h1 className="text-display-xl font-bold text-ink mb-8 md:mb-12">Keranjang Belanja</h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-surface-soft rounded-[20px] border border-hairline border-dashed">
            <div className="w-20 h-20 bg-canvas rounded-full flex items-center justify-center mb-6 shadow-sm">
              <ShoppingCart className="w-8 h-8 text-muted" />
            </div>
            <h2 className="text-title-lg font-bold text-ink mb-2">Keranjangmu kosong</h2>
            <p className="text-body-md text-muted mb-8">Sepertinya kamu belum memilih buku apa pun.</p>
            <Link 
              to="/" 
              className="px-8 py-3 bg-rausch text-white rounded-full font-bold hover:bg-rausch-active transition-all shadow-lg shadow-rausch/20"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* List Item */}
            <div className="flex-1 w-full space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-hairline">
                <span className="text-body-sm font-bold text-ink uppercase tracking-wider">{cartItems.length} Buku Pilihan</span>
                <button 
                  onClick={clearCart}
                  className="text-body-sm font-semibold text-rausch hover:underline"
                >
                  Hapus Semua
                </button>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-canvas border border-hairline rounded-[14px] p-4 flex gap-4 md:gap-6 transition-shadow hover:shadow-md">
                    <div className="w-24 h-32 md:w-28 md:h-40 bg-surface-soft rounded-md overflow-hidden shrink-0">
                      <img 
                        src={item.cover_photo?.startsWith('http') ? item.cover_photo : `${API_BASE_URL.replace('/api', '')}/storage/covers/${item.cover_photo}`} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-title-md font-bold text-ink leading-tight line-clamp-2">{item.title}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-muted hover:text-rausch transition-colors"
                            aria-label="Hapus item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-body-sm text-muted mt-1">{item.author?.name || 'Penulis Tidak Diketahui'}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-body-md font-bold text-ink">{formatRupiah(item.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link 
                to="/" 
                className="inline-flex items-center text-body-sm font-bold text-muted hover:text-ink transition-colors mt-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Lanjut Belanja
              </Link>
            </div>

            {/* Summary Sidebar */}
            <div className="w-full lg:w-96 shrink-0 sticky top-28">
              <div className="bg-canvas border border-hairline rounded-[14px] p-6 shadow-sm">
                <h3 className="text-title-md font-bold text-ink mb-6">Ringkasan Pesanan</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-body-md text-ink">
                    <span>Total Harga ({cartItems.length} buku)</span>
                    <span>{formatRupiah(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-body-md text-ink">
                    <span>Biaya Layanan</span>
                    <span className="text-[#2e7d32]">Gratis</span>
                  </div>
                  <div className="pt-4 border-t border-hairline flex justify-between items-center">
                    <span className="text-title-md font-bold text-ink">Total Tagihan</span>
                    <span className="text-title-md font-bold text-ink">{formatRupiah(cartTotal)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-[#e00b41] text-white rounded-full font-bold text-button-lg transition-all hover:bg-rausch-active hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isCheckingOut ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <CreditCard className="w-5 h-5" />
                  )}
                  {isCheckingOut ? 'Memproses...' : 'Checkout Sekarang'}
                </button>

                <p className="text-[11px] text-center text-muted mt-4">
                  Dengan mengklik Checkout, Anda menyetujui Ketentuan Layanan PustakaIkhlas.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
