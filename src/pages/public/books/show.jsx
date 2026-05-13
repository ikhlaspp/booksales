export default function ShowBook() {
  return (
    <div className="min-h-screen bg-[#ffffff] pb-24 font-sans text-[#222222]">
      <main className="mx-auto max-w-[1080px] px-6 py-8">
        {/* Title & Metadata Section */}
        <div className="mb-6">
          <h1 className="text-[28px] font-semibold leading-[1.18] tracking-[-0.44px] text-[#222222] md:text-[32px]">
            Atomic Habits: Perubahan Kecil yang Memberikan Hasil Luar Biasa
          </h1>
          <div className="mt-2 flex items-center gap-2 text-[14px] font-medium text-[#222222]">
            <span>★ 4.81</span>
            <span>·</span>
            <span className="underline">345 ulasan</span>
            <span>·</span>
            <span className="text-[#6a6a6a]">James Clear</span>
          </div>
        </div>

        {/* Photo Section */}
        <div className="relative mb-10 flex aspect-[2/1] w-full items-center justify-center overflow-hidden rounded-[14px] bg-[#f7f7f7] md:aspect-[2.5/1]">
          <img
            src="https://placehold.co/640x800/f7f7f7/222222?text=Atomic+Habits"
            alt="Atomic Habits Cover"
            className="h-full mix-blend-multiply object-contain py-8"
          />
          <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.32px] text-[#222222] shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
            Pilihan Editor
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="relative flex flex-col items-start gap-12 lg:flex-row lg:gap-[8%]">
          
          {/* Kolom Kiri: Detail, Deskripsi, Ulasan (64%) */}
          <div className="w-full lg:w-[64%]">
            {/* Intro Detail */}
            <div className="mb-8">
              <h2 className="text-[22px] font-medium leading-[1.25] text-[#222222]">
                Buku Self-Improvement oleh James Clear
              </h2>
              <p className="mt-1 text-[16px] text-[#6a6a6a]">
                320 halaman · Diterbitkan Tahun 2018
              </p>
            </div>

            {/* Hairline Separator */}
            <hr className="my-8 border-t border-[#dddddd]" />

            {/* Description */}
            <div className="py-2">
              <p className="text-[16px] font-normal leading-[1.5] text-[#222222]">
                Orang mengira saat Anda ingin mengubah hidup, Anda perlu memikirkan hal-hal besar. 
                Namun, pakar kebiasaan terkenal kelas dunia James Clear telah menemukan cara lain. 
                Ia tahu bahwa perubahan nyata berasal dari efek gabungan ratusan keputusan kecil: 
                mulai dari mengerjakan dua *push-up* sehari, bangun lima menit lebih awal, hingga menahan hasrat untuk menelepon.
              </p>
              <p className="mt-4 text-[16px] font-normal leading-[1.5] text-[#222222]">
                Dalam buku yang inovatif ini, Clear mengungkapkan dengan tepat bagaimana perubahan-perubahan 
                sangat remeh ini dapat tumbuh menjadi hasil-hasil yang sangat mengubah hidup.
              </p>
            </div>

            <hr className="my-8 border-t border-[#dddddd]" />

            {/* Ulasan & Rating (Besar untuk Trust Signal) */}
            <div className="py-2">
              <div className="mb-6 flex items-center gap-4 text-[#222222]">
                {/* Tampilan Rating 64px */}
                <h2 className="text-[64px] font-bold leading-[1.1] tracking-[-1px]">
                  4.81
                </h2>
                <div>
                  <div className="text-[20px] font-semibold">Pilihan Pembaca</div>
                  <p className="text-[14px] text-[#6a6a6a]">Dari 345 ulasan di marketplace</p>
                </div>
              </div>

              {/* Daftar Ulasan Minimalis */}
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ebebeb] font-bold text-[#222222]">A</div>
                    <div>
                      <div className="text-[16px] font-medium text-[#222222]">Andi</div>
                      <div className="text-[14px] text-[#6a6a6a]">2 minggu lalu</div>
                    </div>
                  </div>
                  <p className="text-[16px] font-normal leading-[1.5] text-[#222222]">"Sangat praktis dan mudah diaplikasikan. Konsep 1% lebih baik setiap hari benar-benar mengubah cara pandang saya."</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ebebeb] font-bold text-[#222222]">B</div>
                    <div>
                      <div className="text-[16px] font-medium text-[#222222]">Budi</div>
                      <div className="text-[14px] text-[#6a6a6a]">1 bulan lalu</div>
                    </div>
                  </div>
                  <p className="text-[16px] font-normal leading-[1.5] text-[#222222]">"Buku wajib untuk siapa saja yang merasa stuck dengan rutinitas. Penjelasannya runut dan berbasis sains."</p>
                </div>
              </div>
            </div>

            <hr className="my-8 border-t border-[#dddddd]" />

            {/* Informasi Penulis */}
            <div className="py-2">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#ebebeb]">
                  <img src="https://placehold.co/100x100/f7f7f7/222222?text=JC" alt="James Clear" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="text-[22px] font-medium text-[#222222]">Ditulis oleh James Clear</h3>
                  <p className="text-[14px] text-[#6a6a6a]">Penulis & Pembicara</p>
                </div>
              </div>
              <p className="mb-6 text-[16px] font-normal leading-[1.5] text-[#222222]">
                James Clear adalah penulis dan pembicara yang fokus pada kebiasaan, pengambilan keputusan, 
                dan peningkatan berkelanjutan. Karyanya telah muncul di New York Times, Time, dan Entrepreneur.
              </p>
              <button className="rounded-[8px] border border-[#222222] bg-white px-6 py-3 text-[16px] font-medium text-[#222222] transition-colors hover:bg-[#f7f7f7]">
                Ikuti Penulis
              </button>
            </div>
          </div>

          {/* Kolom Kanan: Reservation Card Sticky (32%) */}
          <div className="sticky top-28 mb-12 w-full lg:w-[32%]">
            <div className="rounded-[14px] border border-[#dddddd] bg-[#ffffff] p-6 shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px_0,rgba(0,0,0,0.1)_0_4px_8px_0]">
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-[22px] font-bold text-[#222222]">Rp 120.000</span>
              </div>

              <div className="mb-4 overflow-hidden rounded-[8px] border border-[#b0b0b0]">
                <div className="flex border-b border-[#b0b0b0]">
                  <div className="w-1/2 border-r border-[#b0b0b0] p-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.32px] text-[#222222]">Format</div>
                    <div className="mt-1 text-[14px] text-[#222222]">Buku Fisik</div>
                  </div>
                  <div className="w-1/2 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.32px] text-[#222222]">Kondisi</div>
                    <div className="mt-1 text-[14px] text-[#222222]">Baru</div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-[10px] font-bold uppercase tracking-[0.32px] text-[#222222]">Jumlah</div>
                  <select className="mt-1 w-full bg-transparent text-[14px] outline-none">
                    <option>1 Buku</option>
                    <option>2 Buku</option>
                    <option>3 Buku</option>
                  </select>
                </div>
              </div>

              <button className="flex h-[48px] w-full items-center justify-center rounded-[8px] bg-[#ff385c] text-[16px] font-medium text-[#ffffff] transition-colors hover:bg-[#e00b41]">
                Beli Sekarang
              </button>
              
              <div className="mt-4 text-center text-[14px] text-[#6a6a6a]">
                Pembayaran dilakukan di langkah berikutnya.
              </div>

              <div className="mt-6 space-y-3 border-b border-[#dddddd] pb-4">
                <div className="flex justify-between text-[16px] text-[#222222]">
                  <span className="underline">Buku (1x)</span>
                  <span>Rp 120.000</span>
                </div>
                <div className="flex justify-between text-[16px] text-[#222222]">
                  <span className="underline">Ongkos Kirim</span>
                  <span>Rp 15.000</span>
                </div>
              </div>
              <div className="pt-4 flex justify-between text-[16px] font-bold text-[#222222]">
                <span>Total</span>
                <span>Rp 135.000</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
