import { BookOpen, ShieldCheck, Truck } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-canvas min-h-screen text-ink pb-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-16">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-display-xl font-bold tracking-tight text-ink">
            Tentang BookSales
          </h1>
          <p className="text-display-lg text-muted font-medium leading-snug">
            Kami hadir untuk memberikan pengalaman terbaik dalam menjelajahi katalog dan memesan buku fisik cetak favorit Anda, langsung ke depan pintu rumah Anda.
          </p>
        </div>
      </section>

      {/* Image Banner */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
        <div className="w-full h-64 md:h-[400px] bg-surface-soft rounded-[14px] overflow-hidden relative border border-hairline">
          <img 
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Toko Buku Fisik BookSales" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-display-md font-bold text-ink mb-10">Keunggulan Layanan Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* USP 1 */}
          <div className="p-8 border border-hairline rounded-[14px] bg-canvas hover:shadow-sm transition-shadow">
            <div className="w-12 h-12 bg-surface-strong rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6 text-ink" />
            </div>
            <h3 className="text-title-md font-bold text-ink mb-3">Koleksi Buku Cetak Berkualitas</h3>
            <p className="text-body-md text-muted leading-relaxed">
              Menyediakan beragam pilihan judul dan genre buku cetak asli. Katalog kami dikurasi dengan cermat untuk memastikan Anda hanya mendapatkan kualitas fisik terbaik untuk melengkapi rak perpustakaan pribadi Anda.
            </p>
          </div>

          {/* USP 2 */}
          <div className="p-8 border border-hairline rounded-[14px] bg-canvas hover:shadow-sm transition-shadow">
            <div className="w-12 h-12 bg-surface-strong rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-ink" />
            </div>
            <h3 className="text-title-md font-bold text-ink mb-3">Pembayaran Aman Terintegrasi</h3>
            <p className="text-body-md text-muted leading-relaxed">
              Kenyamanan dan keamanan transaksi Anda adalah prioritas kami. Semua pesanan diproses melalui gerbang pembayaran resmi sebelum pengiriman, memberikan ketenangan pikiran dalam setiap pembelanjaan.
            </p>
          </div>

          {/* USP 3 */}
          <div className="p-8 border border-hairline rounded-[14px] bg-canvas hover:shadow-sm transition-shadow">
            <div className="w-12 h-12 bg-surface-strong rounded-full flex items-center justify-center mb-6">
              <Truck className="w-6 h-6 text-ink" />
            </div>
            <h3 className="text-title-md font-bold text-ink mb-3">Pengiriman Cepat & Kemasan Aman</h3>
            <p className="text-body-md text-muted leading-relaxed">
              Setiap buku yang Anda pesan akan dikemas dengan perlindungan maksimal untuk mencegah kerusakan. Kami memastikan pesanan Anda dikirim dengan cepat dan dapat dilacak hingga tiba di tangan Anda.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}