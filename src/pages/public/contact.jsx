import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      await axios.post(`${API_URL}/api/contact`, formData);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      if (err.response?.status === 422) {
        const apiErrors = err.response.data.errors || {};
        setErrors(apiErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-canvas min-h-screen text-ink pb-24">
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-12">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-display-xl font-bold tracking-tight text-ink">Hubungi Kami</h1>
          <p className="text-display-lg text-muted font-medium leading-snug">
            Ada pertanyaan, saran, atau sekadar ingin menyapa? Kami selalu siap mendengarkan.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16">
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
            {[
              { id: 'name', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan nama Anda' },
              { id: 'email', label: 'Email', type: 'email', placeholder: 'nama@email.com' },
              { id: 'subject', label: 'Subjek', type: 'text', placeholder: 'Topik pesan' },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id} className="space-y-2">
                <label htmlFor={id} className="text-caption font-medium text-ink block">{label}</label>
                <input
                  type={type} id={id} name={id}
                  value={formData[id]} onChange={handleChange} required
                  className="w-full bg-canvas text-ink text-body-md rounded-sm border border-hairline focus:border-ink focus:ring-0 px-3 py-3 h-14 transition-colors"
                  placeholder={placeholder}
                />
                {errors[id] && <p className="text-xs text-rausch mt-1">{errors[id]?.[0]}</p>}
              </div>
            ))}

            <div className="space-y-2">
              <label htmlFor="message" className="text-caption font-medium text-ink block">Pesan</label>
              <textarea
                id="message" name="message" value={formData.message}
                onChange={handleChange} required rows="5"
                className="w-full bg-canvas text-ink text-body-md rounded-sm border border-hairline focus:border-ink focus:ring-0 px-3 py-3 transition-colors resize-none"
                placeholder="Tulis pesan Anda di sini..."
              />
              {errors.message && <p className="text-xs text-rausch mt-1">{errors.message?.[0]}</p>}
            </div>

            <button
              type="submit" disabled={isSubmitting}
              className="w-full md:w-auto h-12 px-6 bg-rausch text-white rounded-sm text-button-md font-medium hover:bg-rausch-active transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Mengirim...</>
              ) : 'Kirim Pesan'}
            </button>
          </form>
        </div>

        <div className="order-1 md:order-2 space-y-10">
          <div className="space-y-4">
            <h3 className="text-display-md font-bold text-ink">Informasi Kontak</h3>
            <p className="text-body-md text-muted leading-relaxed">
              Anda juga dapat menghubungi kami secara langsung. Tim kami tersedia pada hari kerja (Senin–Jumat, 09:00–17:00 WIB).
            </p>
          </div>
          <div className="space-y-6">
            {[
              { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Email', value: 'hello@pustakaikhlas.com', href: 'mailto:hello@pustakaikhlas.com' },
            ].map(({ icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-strong flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-caption font-medium text-ink">{label}</p>
                  {href ? <a href={href} className="text-body-md text-muted hover:text-rausch transition-colors">{value}</a> : <p className="text-body-md text-muted">{value}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
