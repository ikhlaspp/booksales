import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminCrudForm, { FormField, FormInput, FormTextarea } from '../../../components/admin/AdminCrudForm';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function GenreFormModal({ isOpen, onClose, onSuccess, genre = null }) {
  const isEditMode = !!genre;
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && genre) {
        setFormData({ name: genre.name || '', description: genre.description || '' });
      } else {
        setFormData({ name: '', description: '' });
      }
    }
  }, [isOpen, isEditMode, genre]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      if (isEditMode) {
        await axios.put(`${API_URL}/api/genres/${genre.id}`, formData, { headers });
      } else {
        await axios.post(`${API_URL}/api/genres`, formData, { headers });
      }
      onSuccess(); // Refresh table
      onClose();   // Close modal
    } catch (error) {
      console.error('Error saving genre:', error);
      alert('Gagal menyimpan genre. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminCrudForm
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Genre' : 'Tambah Genre Baru'}
      subtitle={isEditMode ? 'Perbarui informasi detail genre.' : 'Masukkan informasi detail untuk genre baru.'}
      isEditMode={isEditMode}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      confirmMessage={`Apakah Anda yakin ingin ${isEditMode ? 'menyimpan perubahan pada' : 'menambahkan'} genre ini?`}
    >
      <FormField label="Nama Genre" required>
        <FormInput
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Masukkan nama genre"
        />
      </FormField>

      <FormField label="Deskripsi Singkat" required>
        <FormTextarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Masukkan deskripsi genre..."
        />
      </FormField>
    </AdminCrudForm>
  );
}