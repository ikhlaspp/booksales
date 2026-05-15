import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Trash2, X, CreditCard, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const formatRupiah = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount ?? 0);

export default function CartModal({ isOpen, onClose }) {
  const { cartItems, removeFromCart, clearCart, cartTotal, increaseQuantity, decreaseQuantity } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      onClose();
      navigate('/login', { state: { message: "Silakan login terlebih dahulu untuk melakukan pemesanan.", from: location } });
      return;
    }

    if (cartItems.length === 0) return;

    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity animate-fadeIn" 
        onClick={onClose}
      />
      
      {/* Modal Content - Slide from right style like many modern carts */}
      <div className="relative w-full max-w-md h-full bg-canvas shadow-2xl flex flex-col animate-slideInRight">
        
        {/* Header */}
        <div className="p-6 border-b border-hairline flex items-center justify-between bg-canvas sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-ink" />
            <h2 className="text-title-lg font-bold text-ink">Keranjang Belanja</h2>
            <span className="bg-rausch/10 text-rausch px-2 py-0.5 rounded-full text-caption-sm font-bold">
              {cartItems.length}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-soft rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-20 h-20 bg-surface-soft rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="w-8 h-8 text-muted" />
              </div>
              <h3 className="text-title-md font-bold text-ink mb-2">Keranjangmu kosong</h3>
              <p className="text-body-sm text-muted mb-8">Mulailah mengeksplorasi buku-buku menarik di katalog kami.</p>
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-ink text-white rounded-full font-bold hover:bg-ink/90 transition-all"
              >
                Lihat Katalog
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-28 bg-surface-soft rounded-md overflow-hidden shrink-0 shadow-sm">
                    <img 
                      src={item.cover_photo?.startsWith('http') ? item.cover_photo : `${API_BASE_URL.replace('/api', '')}/storage/covers/${item.cover_photo}`} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-body-md font-bold text-ink leading-tight line-clamp-2">{item.title}</h4>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-muted hover:text-rausch transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-caption-sm text-muted mt-1">{item.author?.name || 'Penulis'}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-surface-soft rounded-full px-1 py-0.5">
                        <button 
                          onClick={() => decreaseQuantity(item.id)}
                          className="p-1.5 hover:bg-canvas rounded-full transition-colors text-ink disabled:opacity-30 disabled:hover:bg-transparent"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-body-sm font-semibold text-ink w-4 text-center">
                          {item.quantity || 1}
                        </span>
                        <button 
                          onClick={() => increaseQuantity(item.id)}
                          className="p-1.5 hover:bg-canvas rounded-full transition-colors text-ink disabled:opacity-30 disabled:hover:bg-transparent"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-body-sm font-bold text-ink">{formatRupiah(item.price * (item.quantity || 1))}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-canvas border-t border-hairline shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <span className="text-body-md font-bold text-ink">Total Tagihan</span>
                <span className="text-title-md font-bold text-rausch">{formatRupiah(cartTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-[#ff385c] text-white rounded-full font-bold text-button-lg transition-all hover:bg-[#e00b41] hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <CreditCard className="w-5 h-5" />
              Checkout Sekarang
            </button>
            
            <button 
              onClick={clearCart}
              className="w-full mt-3 py-2 text-caption-sm font-semibold text-muted hover:text-ink transition-colors"
            >
              Kosongkan Keranjang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}