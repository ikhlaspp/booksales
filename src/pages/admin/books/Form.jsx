import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminCrudForm, { FormField, FormInput, FormTextarea, FormSelect } from '../../../components/admin/AdminCrudForm';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function BookFormModal({ isOpen, onClose, onSuccess, book = null }) {
  const isEditMode = !!book;
  const [formData, setFormData] = useState({
    title: '', author_id: '', genre_id: '', price: '', description: '', cover_photo: '',
  });
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/api/authors`, { params: { per_page: 100 } }),
      axios.get(`${API_URL}/api/genres`),
    ]).then(([a, g]) => {
      setAuthors(a.data.data || a.data || []);
      setGenres(g.data.data || g.data || []);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && book) {
        setFormData({
          title: book.title || '',
          author_id: String(book.author_id || ''),
          genre_id: String(book.genre_id || ''),
          price: String(book.price || ''),
          description: book.description || '',
          cover_photo: book.cover_photo || '',
        });
      } else {
        setFormData({
          title: '', author_id: '', genre_id: '', price: '', description: '', cover_photo: '',
        });
      }
    }
  }, [isOpen, isEditMode, book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const payload = { ...formData, price: Number(formData.price) };
      if (isEditMode) {
        await axios.put(`${API_URL}/api/books/${book.id}`, payload, { headers });
      } else {
        await axios.post(`${API_URL}/api/books`, payload, { headers });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Gagal menyimpan buku.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminCrudForm
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Buku' : 'Tambah Buku Baru'}
      subtitle={isEditMode ? 'Perbarui informasi detail buku.' : 'Masukkan informasi detail untuk buku baru.'}
      isEditMode={isEditMode}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      confirmMessage={`Apakah Anda yakin ingin ${isEditMode ? 'menyimpan perubahan pada' : 'menambahkan'} buku ini?`}
    >
      <FormField label="Judul Buku" required>
        <FormInput type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Masukkan judul buku" />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="Penulis" required>
          <FormSelect name="author_id" value={formData.author_id} onChange={handleChange} required
            options={[{ value: '', label: 'Pilih penulis...' }, ...authors.map((a) => ({ value: String(a.id), label: a.name }))]} />
        </FormField>
        <FormField label="Genre" required>
          <FormSelect name="genre_id" value={formData.genre_id} onChange={handleChange} required
            options={[{ value: '', label: 'Pilih genre...' }, ...genres.map((g) => ({ value: String(g.id), label: g.name }))]} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="Harga (IDR)" required>
          <FormInput type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="Contoh: 120000" min="0" />
        </FormField>
        <FormField label="URL Foto Sampul">
          <FormInput type="url" name="cover_photo" value={formData.cover_photo} onChange={handleChange} placeholder="https://images.unsplash.com/..." />
          {formData.cover_photo && (
            <div className="mt-3 relative w-32 h-44 rounded-md overflow-hidden border border-hairline shadow-sm">
              <img src={formData.cover_photo} alt="Preview Sampul" className="w-full h-full object-cover" />
            </div>
          )}
        </FormField>
      </div>

      <FormField label="Deskripsi">
        <FormTextarea name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="Masukkan deskripsi buku..." />
      </FormField>
    </AdminCrudForm>
  );
}
