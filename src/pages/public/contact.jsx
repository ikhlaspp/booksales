import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="bg-canvas min-h-screen text-ink pb-24">
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-12">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-display-xl font-bold tracking-tight text-ink">
            Hubungi Kami
          </h1>
          <p className="text-display-lg text-muted font-medium leading-snug">
            Ada pertanyaan, saran, atau sekadar ingin menyapa? Kami selalu siap mendengarkan.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Contact Form */}
        <div className="order-2 md:order-1">
          {isSuccess && (
            <div className="mb-8 p-4 bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] rounded-sm text-body-md font-medium flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-caption font-medium text-ink block">Nama Lengkap</label>
              <input 
                type="text" 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-canvas text-ink text-body-md rounded-sm border border-hairline focus:border-ink focus:ring-0 px-3 py-3 h-14 transition-colors"
                placeholder="Masukkan nama Anda"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-caption font-medium text-ink block">Email</label>
              <input 
                type="email" 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-canvas text-ink text-body-md rounded-sm border border-hairline focus:border-ink focus:ring-0 px-3 py-3 h-14 transition-colors"
                placeholder="nama@email.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-caption font-medium text-ink block">Subjek</label>
              <input 
                type="text" 
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full bg-canvas text-ink text-body-md rounded-sm border border-hairline focus:border-ink focus:ring-0 px-3 py-3 h-14 transition-colors"
                placeholder="Topik pesan"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-caption font-medium text-ink block">Pesan</label>
              <textarea 
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full bg-canvas text-ink text-body-md rounded-sm border border-hairline focus:border-ink focus:ring-0 px-3 py-3 transition-colors resize-none"
                placeholder="Tulis pesan Anda di sini..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full md:w-auto h-12 px-6 bg-rausch text-white rounded-sm text-button-md font-medium hover:bg-rausch-active transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Mengirim...
                </>
              ) : 'Kirim Pesan'}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="order-1 md:order-2 space-y-10">
          <div className="space-y-4">
            <h3 className="text-display-md font-bold text-ink">Informasi Kontak</h3>
            <p className="text-body-md text-muted leading-relaxed">
              Anda juga dapat menghubungi kami secara langsung melalui kontak di bawah ini. Tim kami tersedia pada hari kerja (Senin - Jumat, 09:00 - 17:00 WIB).
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-strong flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-caption font-medium text-ink">Email</p>
                <a href="mailto:hello@booksales.com" className="text-body-md text-muted hover:text-rausch transition-colors">hello@booksales.com</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-strong flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-caption font-medium text-ink">Telepon</p>
                <p className="text-body-md text-muted">+62 811 2233 4455</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-strong flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-caption font-medium text-ink">Kantor</p>
                <p className="text-body-md text-muted">Jl. Jend. Sudirman No. 1<br/>Jakarta Pusat, 10220</p>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
