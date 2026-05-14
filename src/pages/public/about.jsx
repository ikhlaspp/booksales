export default function About() {
  return (
    <div className="bg-canvas min-h-screen text-ink pb-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-16">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-display-xl font-bold tracking-tight text-ink">
            Membuka jendela dunia,<br />satu halaman pada satu waktu.
          </h1>
          <p className="text-display-lg text-muted font-medium leading-snug">
            BookSales adalah perpustakaan digital dan toko buku modern yang mempermudah Anda menemukan karya-karya terbaik dari penulis di seluruh dunia.
          </p>
        </div>
      </section>

      {/* Image Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2 h-64 md:h-96 bg-surface-soft rounded-lg overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Perpustakaan modern" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-64 md:h-96 bg-surface-soft rounded-lg overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Membaca buku" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-hairline">
        <h2 className="text-display-md font-bold text-ink mb-12">Misi Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-surface-strong rounded-full flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-title-md font-bold text-ink">Aksesibilitas</h3>
            <p className="text-body-md text-muted leading-relaxed">
              Kami percaya setiap orang berhak mendapatkan akses ke bacaan berkualitas tanpa terhalang jarak dan waktu.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-surface-strong rounded-full flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-title-md font-bold text-ink">Kecepatan</h3>
            <p className="text-body-md text-muted leading-relaxed">
              Antarmuka yang bersih dan cepat memberikan pengalaman mencari dan membaca buku senyaman mungkin.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-surface-strong rounded-full flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-title-md font-bold text-ink">Komunitas</h3>
            <p className="text-body-md text-muted leading-relaxed">
              Membangun ruang bagi pembaca dan penulis untuk terhubung, berbagi inspirasi, dan tumbuh bersama.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}