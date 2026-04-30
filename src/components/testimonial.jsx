export default function Testimonial() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-12 lg:py-24">
      <div className="max-w-screen-xl px-4 mx-auto text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">
          Apa Kata Pembaca?
        </h2>
        <figure className="max-w-screen-md mx-auto">
          <svg className="h-10 mx-auto mb-4 text-indigo-500 dark:text-indigo-400 opacity-70" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" fill="currentColor"/>
          </svg>
          <blockquote>
            <p className="text-xl italic font-medium text-gray-700 dark:text-gray-300">
              "Koleksi bukunya sangat lengkap! Saya selalu bisa menemukan novel-novel klasik incaran saya dengan kualitas cetakan terbaik dan pengiriman yang luar biasa cepat."
            </p>
          </blockquote>
          <figcaption className="flex items-center justify-center mt-8 space-x-4">
            <img className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-white dark:border-gray-700" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" alt="profile picture" />
            <div className="flex flex-col items-start font-medium dark:text-white">
              <span className="text-gray-900 dark:text-white">Rio Setiawan</span>
              <span className="text-sm font-light text-gray-500 dark:text-gray-400">Penulis & Kolektor Buku</span>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
