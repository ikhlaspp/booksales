import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminCrudForm, { FormField, FormSelect } from '../../../components/admin/AdminCrudForm';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'dibayar', label: 'Dibayar' },
  { value: 'dikirim', label: 'Dikirim' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'dibatalkan', label: 'Dibatalkan' },
];

export default function TransactionFormModal({ isOpen, onClose, onSuccess, transaction = null }) {
  const isEditMode = !!transaction;
  const [formData, setFormData] = useState({ status: 'pending' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && transaction) {
        setFormData({ status: transaction.status || 'pending' });
      } else {
        setFormData({ status: 'pending' });
      }
    }
  }, [isOpen, isEditMode, transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };
      await axios.put(`${API_URL}/api/transactions/${transaction.id}`, formData, { headers });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating transaction status:', error);
      alert('Gagal memperbarui status transaksi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminCrudForm
      isOpen={isOpen}
      onClose={onClose}
      title="Update Status Transaksi"
      subtitle={transaction ? `Pesanan No: ${transaction.order_number}` : ''}
      isEditMode={true}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      submitLabel="Perbarui Status"
      confirmMessage={`Apakah Anda yakin ingin mengubah status transaksi ini menjadi "${formData.status}"?`}
    >
      <FormField label="Status Pesanan" required>
        <FormSelect
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={STATUS_OPTIONS}
        />
      </FormField>
    </AdminCrudForm>
  );
}
