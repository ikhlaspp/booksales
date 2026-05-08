export default function About() {
  return (
    <div className="max-w-4xl mx-auto w-full px-6 md:px-12 py-16 space-y-8">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6">
          <span className="text-white font-bold text-4xl">B</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Tentang BookSales.</h1>
        <div className="w-16 h-1.5 bg-blue-600 rounded-full mx-auto"></div>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto pt-2">
          BookSales adalah platform penyedia layanan perpustakaan digital dan toko buku modern yang mempermudah Anda menemukan berbagai macam bacaan berkualitas. 
        </p>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Misi kami adalah mendigitalisasi dan mempermudah akses buku bagi semua kalangan. Kami terus berusaha memberikan antarmuka yang bersih, cepat, dan mudah digunakan layaknya pengalaman membaca buku secara langsung.
        </p>
      </div>
    </div>
  );
}