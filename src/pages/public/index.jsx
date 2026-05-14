import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, BookOpen, Sparkles, Heart, Globe, Coffee, Flame, Star, Clock, ChevronRight, ChevronLeft } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */
const formatRupiah = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount ?? 0);

// Map genre names (case-insensitive) to a Lucide icon component
const GENRE_ICONS = {
  fiksi: BookOpen,
  novel: BookOpen,
  fantasi: Sparkles,
  romansa: Heart,
  romance: Heart,
  petualangan: Globe,
  perjalanan: Globe,
  komedi: Coffee,
  humor: Coffee,
  thriller: Flame,
  horor: Flame,
  biografi: Star,
  sejarah: Clock,
  sains: Sparkles,
  bisnis: Star,
};

function getGenreIcon(genreName = '') {
  const key = genreName.toLowerCase().trim();
  for (const [pattern, Icon] of Object.entries(GENRE_ICONS)) {
    if (key.includes(pattern)) return Icon;
  }
  return BookOpen; // default
}

/* -------------------------------------------------------
   Skeleton Card
------------------------------------------------------- */
const BookCardSkeleton = () => (
  <div className="flex flex-col gap-3">
    {/* Cover placeholder */}
    <div className="aspect-[3/4] rounded-md overflow-hidden">
      <div className="w-full h-full animate-shimmer" />
    </div>
    {/* Meta placeholders */}
    <div className="space-y-2 px-0.5">
      <div className="h-4 animate-shimmer rounded w-4/5" />
      <div className="h-3 animate-shimmer rounded w-2/5" />
      <div className="h-4 animate-shimmer rounded w-1/3 mt-1" />
    </div>
  </div>
);

/* -------------------------------------------------------
   Book Card
------------------------------------------------------- */
const BookCard = ({ book, style }) => {
  const [imgError, setImgError] = useState(false);

  const imageUrl = !imgError && book.cover_photo
    ? (book.cover_photo.startsWith('http') ? book.cover_photo : `${API_BASE_URL.replace('/api', '')}/storage/covers/${book.cover_photo}`)
    : `https://placehold.co/400x600/f2f2f2/929292?text=${encodeURIComponent(book.title ?? 'Buku')}`;

  return (
    <Link
      to={`/books/${book.id}`}
      className="group flex flex-col gap-2.5 cursor-pointer"
      style={style}
    >
      {/* Cover */}
      <div
        className="relative aspect-[3/4] rounded-md overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface-soft)' }}
      >
        <img
          src={imageUrl}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Wishlist heart — decorative, top-right */}
        <button
          type="button"
          aria-label={`Simpan ${book.title}`}
          onClick={(e) => e.preventDefault()}
          className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none"
          style={{ background: 'rgba(0,0,0,0)', color: 'white' }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 drop-shadow-md"
            fill="rgba(0,0,0,0.35)"
            stroke="white"
            strokeWidth="1.5"
          >
            <path d="M20.8 4.6c-1.7-1.8-4.4-1.8-6.1 0L12 7.3l-2.7-2.7c-1.7-1.8-4.4-1.8-6.1 0-1.7 1.8-1.7 4.7 0 6.5L12 21l8.8-10c1.7-1.8 1.7-4.7 0-6.4Z" />
          </svg>
        </button>

        {/* Genre badge — top-left */}
        {book.genre?.name && (
          <span
            className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-badge font-semibold"
            style={{
              background: 'white',
              color: 'var(--color-ink)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              letterSpacing: 0,
            }}
          >
            {book.genre.name}
          </span>
        )}

        {/* Hover overlay — subtle */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.04)' }}
        />
      </div>

      {/* Meta info — below cover, no card padding */}
      <div className="px-0.5 transition-shadow duration-300 group-hover:shadow-none">
        <h3 className="text-title-md font-semibold text-ink truncate">
          {book.title}
        </h3>
        <p className="text-body-sm text-muted mt-0.5 truncate">
          {book.author?.name ?? 'Penulis Tidak Diketahui'}
        </p>
        <p className="text-body-md font-bold text-ink mt-1">
          {formatRupiah(book.price)}
        </p>
      </div>
    </Link>
  );
};

/* -------------------------------------------------------
   Empty State
------------------------------------------------------- */
const EmptyState = ({ query, onReset }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
      style={{ background: 'var(--color-surface-soft)' }}
    >
      <BookOpen className="w-7 h-7" style={{ color: 'var(--color-muted)' }} />
    </div>
    <h3 className="text-display-sm font-semibold text-ink mb-2">
      Tidak ada buku ditemukan
    </h3>
    <p className="text-body-md text-muted max-w-xs mb-6">
      {query
        ? `Tidak ada hasil untuk "${query}". Coba kata kunci lain atau reset filter.`
        : 'Coba pilih kategori yang berbeda.'}
    </p>
    <button
      onClick={onReset}
      className="px-6 py-2.5 rounded-full text-body-sm font-medium border transition-all"
      style={{
        borderColor: 'var(--color-hairline)',
        color: 'var(--color-ink)',
        background: 'var(--color-canvas)',
      }}
    >
      Reset Filter
    </button>
  </div>
);

/* -------------------------------------------------------
   Error Banner
------------------------------------------------------- */
const ErrorBanner = ({ message, onRetry }) => (
  <div
    className="rounded-md p-4 mb-10 flex items-center justify-between gap-4"
    style={{
      background: '#fff5f5',
      border: '1px solid #ffd1d1',
    }}
  >
    <p className="text-body-sm" style={{ color: '#c13515' }}>
      {message}
    </p>
    <button
      onClick={onRetry}
      className="px-4 py-1.5 rounded-full text-body-sm font-medium text-white flex-shrink-0 transition-opacity hover:opacity-90"
      style={{ background: 'var(--color-rausch)' }}
    >
      Coba Lagi
    </button>
  </div>
);

/* -------------------------------------------------------
   Main Component — MainCatalog (Single Discovery Page)
------------------------------------------------------- */
export default function MainCatalog() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  // 1. Fetch Genres (Once)
  useEffect(() => {
    axios.get(`${API_BASE_URL}/genres`)
      .then(res => {
        const genresData = res.data?.data ?? res.data ?? [];
        setGenres(Array.isArray(genresData) ? genresData : []);
      })
      .catch(err => console.error('Error fetching genres:', err));
  }, []);

  // 2. Fetch Books from Catalog API (Triggered on state changes)
  const fetchBooks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {
        per_page: 12,
        page: currentPage,
      };

      if (activeSearch) params.search = activeSearch;
      if (selectedGenre) params.genre_id = selectedGenre;

      const response = await axios.get(`${API_BASE_URL}/catalog`, { params });
      
      const booksData = response.data?.data ?? response.data ?? [];
      setBooks(Array.isArray(booksData) ? booksData : []);

      if (response.data) {
        setLastPage(response.data.last_page || 1);
        setTotalItems(response.data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching catalog data:', err);
      setError('Gagal memuat data. Periksa koneksi dan coba lagi.');
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, activeSearch, selectedGenre]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  /* ---- Handlers ---- */
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setActiveSearch(searchQuery);
    setCurrentPage(1); // Reset page on new search
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchSubmit();
    if (e.key === 'Escape') {
      setSearchQuery('');
      setActiveSearch('');
      setCurrentPage(1);
    }
  };

  const handleGenreSelect = (genreId) => {
    setSelectedGenre((prev) => (prev === genreId ? null : genreId));
    setCurrentPage(1); // Reset page on filter change
  };

  const handleReset = () => {
    setSearchQuery('');
    setActiveSearch('');
    setSelectedGenre(null);
    setCurrentPage(1);
    inputRef.current?.focus();
  };

  /* ---- Derived values ---- */
  const resultLabel = (() => {
    if (isLoading) return null;
    if (!activeSearch && selectedGenre === null) return `${totalItems} buku tersedia`;
    return `${totalItems} hasil ditemukan`;
  })();

  /* ================================================================
     RENDER
  ================================================================ */
  return (
    <div className="bg-canvas min-h-screen">

      {/* ============================================================
          HERO SECTION — Greeting + Search Pill
      ============================================================ */}
      <section
        className="px-4 md:px-8 lg:px-12 pt-12 pb-8 md:pt-16 md:pb-10 max-w-7xl mx-auto"
        aria-label="Pencarian Buku"
      >
        {/* Greeting headline */}
        <h1 className="text-display-xl font-bold text-ink mb-6 max-w-xl leading-snug">
          Temukan dan miliki buku cetak pilihan{' '}
          <span style={{ color: 'var(--color-rausch)' }}>untuk melengkapi rak buku Anda.</span>
        </h1>
        <p className="text-body-md text-muted mb-8 max-w-md">
          Eksplorasi dunia literasi, langsung dikirim ke pintu rumah Anda dengan aman.
        </p>

        {/* Search Pill */}
        <form
          onSubmit={handleSearchSubmit}
          className="mb-0 max-w-2xl"
          role="search"
          aria-label="Cari buku"
        >
          <div
            className="flex items-center h-16 px-5 rounded-full transition-shadow duration-300"
            style={{
              background: 'var(--color-canvas)',
              border: '1px solid var(--color-hairline)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                'rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px, rgba(0,0,0,0.1) 0 4px 8px')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                '0 1px 2px rgba(0,0,0,0.04)')
            }
          >
            <Search
              className="w-5 h-5 flex-shrink-0 mr-3"
              style={{ color: 'var(--color-muted)' }}
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              id="book-search-input"
              type="text"
              placeholder="Cari judul buku, penulis, atau kategori..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Live-filter if the field is cleared
                if (!e.target.value) {
                  setActiveSearch('');
                  setCurrentPage(1);
                }
              }}
              onKeyDown={handleSearchKeyDown}
              className="flex-1 bg-transparent text-body-md font-normal text-ink placeholder-muted focus:outline-none w-full"
              style={{ color: 'var(--color-ink)' }}
              aria-label="Kata kunci pencarian"
              autoComplete="off"
            />

            {/* Clear button when there's input */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveSearch('');
                  setCurrentPage(1);
                  inputRef.current?.focus();
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center mr-2 transition-colors hover:opacity-70 flex-shrink-0"
                style={{
                  background: 'var(--color-surface-strong)',
                  color: 'var(--color-muted)',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
                aria-label="Hapus pencarian"
              >
                ✕
              </button>
            )}

            {/* Search orb — Rausch circle */}
            <button
              id="search-submit-btn"
              type="submit"
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ml-1 transition-opacity duration-200 hover:opacity-90 active:scale-95"
              style={{ background: 'var(--color-rausch)' }}
              aria-label="Mulai pencarian"
            >
              <Search className="w-4 h-4 text-white" aria-hidden="true" />
            </button>
          </div>
        </form>
      </section>

      {/* ============================================================
          CATEGORY STRIP — horizontal scroll genre filter
      ============================================================ */}
      {(genres.length > 0 || isLoading) && (
        <section
          className="max-w-7xl mx-auto"
          aria-label="Filter Kategori"
        >
          {/* Divider */}
          <div
            className="mx-4 md:mx-8 lg:mx-12 mb-0"
            style={{ borderBottom: '1px solid var(--color-hairline-soft)' }}
          />

          <div className="overflow-x-auto scrollbar-hide px-4 md:px-8 lg:px-12">
            <div className="flex gap-1 py-1 min-w-min" role="tablist" aria-label="Pilih genre">

              {/* "Semua" button */}
              <CategoryTab
                label="Semua"
                icon={BookOpen}
                isActive={selectedGenre === null}
                onClick={() => handleGenreSelect(null)}
              />

              {/* Genre buttons */}
              {genres.map((genre) => {
                const Icon = getGenreIcon(genre.name);
                return (
                  <CategoryTab
                    key={genre.id}
                    label={genre.name}
                    icon={Icon}
                    isActive={selectedGenre === genre.id}
                    onClick={() => handleGenreSelect(genre.id)}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          BOOK GRID
      ============================================================ */}
      <section
        className="px-4 md:px-8 lg:px-12 pb-20 max-w-7xl mx-auto"
        aria-label="Daftar Buku"
      >
        {/* Result count label */}
        {resultLabel && (
          <p
            className="text-body-sm font-medium mb-6 pt-8"
            style={{ color: 'var(--color-muted)' }}
          >
            {resultLabel}
          </p>
        )}

        {/* Error state */}
        {error && <ErrorBanner message={error} onRetry={fetchBooks} />}

        {/* Loading skeleton grid */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 pt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Books grid */}
        {!isLoading && !error && books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {books.map((book, i) => (
              <BookCard
                key={book.id}
                book={book}
                style={{
                  animationDelay: `${Math.min(i * 40, 320)}ms`,
                  animation: 'fadeInUp 0.35s ease-out both',
                }}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && books.length === 0 && (
          <div className="grid grid-cols-1">
            <EmptyState
              query={activeSearch}
              onReset={handleReset}
            />
          </div>
        )}

        {/* ============================================================
            PAGINATION CONTROLS
        ============================================================ */}
        {!isLoading && !error && lastPage > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-hairline bg-canvas text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-soft"
              aria-label="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-body-sm font-medium text-ink">
              Halaman {currentPage} dari {lastPage}
            </span>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(lastPage, p + 1))}
              disabled={currentPage === lastPage}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-hairline bg-canvas text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-soft"
              aria-label="Halaman Berikutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

/* -------------------------------------------------------
   CategoryTab sub-component
------------------------------------------------------- */
function CategoryTab({ label, icon: Icon, isActive, onClick }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 px-4 pt-3 pb-3 whitespace-nowrap transition-all duration-200 group focus:outline-none"
      style={{
        borderBottom: isActive
          ? '2px solid var(--color-ink)'
          : '2px solid transparent',
        color: isActive ? 'var(--color-ink)' : 'var(--color-muted)',
      }}
    >
      <Icon
        className="w-6 h-6 transition-colors duration-200"
        style={{
          color: isActive ? 'var(--color-ink)' : 'var(--color-muted)',
          strokeWidth: isActive ? 2 : 1.5,
        }}
        aria-hidden="true"
      />
      <span
        className="text-button-sm transition-all duration-200"
        style={{
          fontWeight: isActive ? 600 : 400,
          color: isActive ? 'var(--color-ink)' : 'var(--color-muted)',
        }}
      >
        {label}
      </span>
    </button>
  );
}