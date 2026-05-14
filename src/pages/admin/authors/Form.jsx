import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminCrudForm, { FormField, FormInput, FormSelect } from '../../../components/admin/AdminCrudForm';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function AuthorFormModal({ isOpen, onClose, onSuccess, author = null }) {
  const isEditMode = !!author;
  const [formData, setFormData] = useState({ name: '', email: '', status: 'Active' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && author) {
        setFormData({ name: author.name || '', email: author.email || '', status: author.status || 'Active' });
      } else {
        setFormData({ name: '', email: '', status: 'Active' });
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

      <FormField label="Email" required>
        <FormInput
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="email@contoh.com"
        />
      </FormField>

      <FormField label="Status">
        <FormSelect
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
          ]}
        />
      </FormField>
    </AdminCrudForm>
  );
}