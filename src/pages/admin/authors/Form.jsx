import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminCrudForm, { FormField, FormInput, FormTextarea } from '../../../components/admin/AdminCrudForm';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function AuthorFormModal({ isOpen, onClose, onSuccess, author = null }) {
  const isEditMode = !!author;
  const [formData, setFormData] = useState({ name: '', bio: '', photo: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && author) {
        setFormData({ 
          name: author.name || '', 
          bio: author.bio || '', 
          photo: author.photo || '' 
        });
      } else {
        setFormData({ name: '', bio: '', photo: '' });
      }
    }
  }, [isOpen, isEditMode, author]);

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
        await axios.put(`${API_URL}/api/authors/${author.id}`, formData, { headers });
      } else {
        await axios.post(`${API_URL}/api/authors`, formData, { headers });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving author:', error);
      alert('Gagal menyimpan author. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminCrudForm
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Author' : 'Tambah Author Baru'}
      subtitle={isEditMode ? 'Perbarui informasi detail author.' : 'Masukkan informasi detail untuk author baru.'}
      isEditMode={isEditMode}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      confirmMessage={`Apakah Anda yakin ingin ${isEditMode ? 'menyimpan perubahan pada' : 'menambahkan'} author ini?`}
    >
      <FormField label="Nama Lengkap" required>
        <FormInput
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Masukkan nama author"
        />
      </FormField>

      <FormField label="Bio">
        <FormTextarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          placeholder="Masukkan biografi singkat author"
        />
      </FormField>

      <FormField label="Photo URL">
        <FormInput
          type="text"
          name="photo"
          value={formData.photo}
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
        />
      </FormField>
    </AdminCrudForm>
  );
}
