import { Link } from 'react-router-dom';

const featuredBooks = [
  {
    id: 1,
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 'Rp 120.000',
    image: 'https://placehold.co/640x800/f7f7f7/222222?text=Atomic+Habits',
    tag: 'Bestseller',
  },
  {
    id: 2,
    title: 'Laut Bercerita',
    author: 'Leila S. Chudori',
    price: 'Rp 110.000',
    image: 'https://placehold.co/640x800/f7f7f7/222222?text=Laut+Bercerita',
    tag: 'Pilihan Editor',
  },
  {
    id: 3,
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    price: 'Rp 135.000',
    image: 'https://placehold.co/640x800/f7f7f7/222222?text=Sapiens',
    tag: 'Terlaris',
  },
  {
    id: 4,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 'Rp 150.000',
    image: 'https://placehold.co/640x800/f7f7f7/222222?text=The+Great+Gatsby',
    tag: 'Klasik',
  },
];

const categories = [
  'Fiksi',
  'Self Improvement',
  'Romance',
  'Sejarah',
  'Anak',
  'Sains',
];

const highlights = [
  { value: '2.5K+', label: 'judul siap jelajah' },
  { value: '4.8/5', label: 'rating pengalaman pembaca' },
  { value: '24 jam', label: 'respons pemesanan' },
];

export default function PublicHome() {
  return (
    <div className="bg-white text-[#222222]">
      <section className="relative overflow-hidden border-b border-[#ebebeb]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,56,92,0.12),transparent_30%),radial-gradient(circle_at_20%_20%,rgba(34,34,34,0.06),transparent_28%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-6 py-14 md:px-12 lg:flex-row lg:items-center lg:py-20">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ebebeb] bg-white px-4 py-2 text-sm font-medium text-[#6a6a6a] shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff385c]" />
              Rekomendasi buku yang terasa personal dan rapi
            </div>

            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.32px] text-[#929292]">BookSales marketplace</p>
              <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#222222] md:text-5xl lg:text-[64px]">
                Temukan buku berikutnya lewat pengalaman yang lebih hangat.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[#3f3f3f] md:text-lg">
                Jelajahi katalog pilihan, baca ringkasan singkat, dan lanjutkan ke buku yang paling relevan tanpa tampilan yang berisik. Fokusnya tetap pada koleksi, bukan dekorasi.
              </p>
            </div>

            <div className="rounded-[9999px] border border-[#ebebeb] bg-white p-2 shadow-[0_2px_6px_rgba(0,0,0,0.04),0_4px_10px_rgba(0,0,0,0.08)]">
              <div className="grid gap-2 md:grid-cols-[1.3fr_1fr_0.9fr_auto] md:gap-0">
                <label className="flex flex-col gap-1 rounded-full px-5 py-3 md:rounded-none md:border-r md:border-[#ebebeb]">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.32px] text-[#929292]">Cari buku</span>
                  <span className="text-sm text-[#222222]">Judul, penulis, atau genre</span>
                </label>
                <label className="flex flex-col gap-1 rounded-full px-5 py-3 md:rounded-none md:border-r md:border-[#ebebeb]">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.32px] text-[#929292]">Kategori</span>
                  <span className="text-sm text-[#222222]">Fiksi, nonfiksi, dan lainnya</span>
                </label>
                <label className="flex flex-col gap-1 rounded-full px-5 py-3 md:rounded-none md:border-r md:border-[#ebebeb]">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.32px] text-[#929292]">Format</span>
                  <span className="text-sm text-[#222222]">Beli atau pinjam</span>
                </label>
                <div className="flex items-center justify-end px-2 pb-2 md:pb-0 md:pr-2">
                  <Link
                    to="/books"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#ff385c] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#e00b41]"
                  >
                    Jelajah
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-[#f7f7f7] px-4 py-2 text-sm font-medium text-[#3f3f3f]"
                >
                  {category}
                </span>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[0_2px_6px_rgba(0,0,0,0.04)]"
                >
                  <div className="text-2xl font-semibold tracking-[-0.03em] text-[#222222]">{item.value}</div>
                  <div className="mt-1 text-sm leading-6 text-[#6a6a6a]">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:max-w-xl">
            {featuredBooks.map((book, index) => (
              <article
                key={book.id}
                className={`overflow-hidden rounded-[20px] border border-[#ebebeb] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:-translate-y-1 ${
                  index === 0 ? 'sm:mt-10' : ''
                }`}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#f7f7f7]">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32px] text-[#222222] shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                    {book.tag}
                  </span>
                  <button
                    type="button"
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#222222] shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                    aria-label={`Simpan ${book.title}`}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.8 4.6c-1.7-1.8-4.4-1.8-6.1 0L12 7.3l-2.7-2.7c-1.7-1.8-4.4-1.8-6.1 0-1.7 1.8-1.7 4.7 0 6.5L12 21l8.8-10c1.7-1.8 1.7-4.7 0-6.4Z" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div>
                    <h2 className="text-base font-semibold leading-6 text-[#222222]">{book.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-[#6a6a6a]">{book.author}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-[#929292]">Mulai dari</div>
                      <div className="text-lg font-semibold tracking-[-0.02em] text-[#222222]">{book.price}</div>
                    </div>
                    <Link
                      to="/books"
                      className="inline-flex h-11 items-center rounded-full border border-[#222222] px-4 text-sm font-semibold text-[#222222] transition-colors hover:bg-[#222222] hover:text-white"
                    >
                      Lihat
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#ebebeb] bg-[#f7f7f7]">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-14 md:px-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-[72px]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.32px] text-[#929292]">Kenapa BookSales</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#222222] md:text-4xl">
              Tampilan lebih tenang, pilihan lebih cepat dibaca.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-[#3f3f3f]">
              Struktur visual dibuat seperti marketplace modern: putih bersih, aksen merah hangat, kartu foto yang tegas, dan CTA yang langsung terlihat tanpa harus memaksa pengguna membaca terlalu banyak.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              'Kurasi buku terpilih dalam kartu yang ringan dan rapi.',
              'CTA utama menonjol dengan aksen merah sebagai satu titik fokus.',
              'Tata letak responsif agar nyaman di desktop maupun mobile.',
            ].map((text) => (
              <div key={text} className="rounded-[20px] border border-[#ebebeb] bg-white p-5 shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
                <div className="mb-3 h-2.5 w-10 rounded-full bg-[#ff385c]" />
                <p className="text-sm leading-6 text-[#3f3f3f]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 md:px-12 md:py-[72px]">
        <div className="rounded-[32px] bg-[#222222] px-6 py-10 text-white md:px-10 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.32px] text-white/70">Siap jelajah</p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Mulai dari beranda, lanjutkan ke katalog yang lebih lengkap.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-white/80">
                Gunakan halaman ini sebagai pintu masuk yang lebih fokus, lalu arahkan pembaca ke katalog buku untuk melihat daftar yang lebih besar dan detail per buku.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                to="/books"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#ff385c] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#e00b41]"
              >
                Buka Katalog
              </Link>
              <Link
                to="/about"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#222222]"
              >
                Tentang Kami
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}