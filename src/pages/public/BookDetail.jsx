import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, BookOpen, Star, Clock, ShoppingCart, CheckCircle2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const formatRupiah = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount ?? 0);

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/books/${id}`);
        setBook(response.data);
      } catch (err) {
        console.error('Error fetching book detail:', err);
        setError('Gagal memuat detail buku. Buku mungkin tidak ditemukan.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('user_role');

    if (!token || role !== 'user') {
      navigate('/login', { 
        state: { 
          message: "anda harus login sebelum membeli buku",
          from: location
        } 
      });
      return;
    }

    addToCart(book, quantity);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setQuantity(1); // Reset local quantity after adding
  };

  const handleIncrease = () => {
    if (quantity < book?.stock) setQuantity(q => q + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas pt-24 pb-12 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-hairline border-t-rausch rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-canvas pt-24 pb-12 px-4 flex flex-col items-center justify-center text-center">
        <h2 className="text-display-sm font-bold text-ink mb-2">Oops!</h2>
        <p className="text-body-md text-muted mb-6">{error || 'Buku tidak ditemukan.'}</p>
        <Link 
          to="/" 
          className="px-6 py-2 bg-rausch text-white rounded-full font-medium hover:bg-rausch-active transition-colors"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const imageUrl = !imgError && book.cover_photo
    ? (book.cover_photo.startsWith('http') ? book.cover_photo : `${API_BASE_URL.replace('/api', '')}/storage/covers/${book.cover_photo}`)
    : `https://placehold.co/400x600/f2f2f2/929292?text=${encodeURIComponent(book.title ?? 'Buku')}`;

  return (
    <div className="min-h-screen bg-canvas pt-20 pb-20 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] animate-fadeInUp">
          <div className="bg-ink text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#4ade80]" />
            <span className="text-body-sm font-medium">Buku telah dimasukkan ke keranjang</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-body-sm font-medium text-muted hover:text-ink transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Link>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
          
          {/* Left Column: Cover */}
          <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
            <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-xl" style={{ backgroundColor: 'var(--color-surface-soft)' }}>
              <img
                src={imageUrl}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="flex-1 flex flex-col">
            <div className="mb-4">
              {book.genre?.name && (
                <span className="inline-block px-3 py-1 bg-surface-strong text-ink text-caption-sm font-bold uppercase tracking-wider rounded-sm mb-4">
                  {book.genre.name}
                </span>
              )}
              <h1 className="text-display-md font-bold text-ink leading-tight mb-2">
                {book.title}
              </h1>
              <p className="text-title-lg text-muted">
                Karya <span className="font-semibold text-ink">{book.author?.name || 'Penulis Tidak Diketahui'}</span>
              </p>
            </div>

            {/* Price & Action */}
            <div className="my-6 p-6 rounded-lg border border-hairline bg-surface-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-caption-sm text-muted mb-1">Harga</p>
                <p className="text-display-sm font-bold text-ink">
                  {formatRupiah(book.price)}
                </p>
                <p className="text-body-sm text-muted mt-1">Stok tersisa: <span className="font-semibold">{book.stock}</span></p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-canvas border border-hairline rounded-full px-2 py-1 h-12 w-full sm:w-32 justify-between">
                  <button 
                    onClick={handleDecrease}
                    disabled={quantity <= 1 || book.stock <= 0}
                    className="p-2 text-ink hover:bg-surface-soft rounded-full transition-colors disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-body-md font-bold text-ink w-6 text-center">
                    {book.stock <= 0 ? 0 : quantity}
                  </span>
                  <button 
                    onClick={handleIncrease}
                    disabled={quantity >= book.stock || book.stock <= 0}
                    className="p-2 text-ink hover:bg-surface-soft rounded-full transition-colors disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button 
                  onClick={handleAddToCart}
                  disabled={book.stock <= 0}
                  className="w-full sm:w-auto h-12 px-8 bg-rausch text-white rounded-full font-bold text-button-md transition-all hover:bg-rausch-active hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {book.stock > 0 ? 'Tambahkan ke Keranjang' : 'Stok Habis'}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <h3 className="text-title-md font-bold text-ink mb-3">Sinopsis</h3>
              <p className="text-body-md text-ink/80 leading-relaxed whitespace-pre-line">
                {book.description || 'Tidak ada deskripsi tersedia untuk buku ini.'}
              </p>
            </div>

            {/* Additional Meta */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-t border-hairline-soft">
              <div>
                <p className="text-caption-sm text-muted mb-1">Format</p>
                <p className="text-body-sm font-semibold text-ink flex items-center"><BookOpen className="w-4 h-4 mr-2 text-muted" /> Cetak</p>
              </div>
              <div>
                <p className="text-caption-sm text-muted mb-1">Kondisi</p>
                <p className="text-body-sm font-semibold text-ink flex items-center"><Star className="w-4 h-4 mr-2 text-muted" /> Baru</p>
              </div>
              <div>
                <p className="text-caption-sm text-muted mb-1">Pengiriman</p>
                <p className="text-body-sm font-semibold text-ink flex items-center"><Clock className="w-4 h-4 mr-2 text-muted" /> Standar</p>
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}
