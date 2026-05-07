import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ConfirmModal from '../../../components/ConfirmModal';

export default function AdminAuthorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Jika 'id' ada, maka isEditMode bernilai true
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'Active',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    // Jika dalam mode edit, kita ambil (fetch) data eksisting
    if (isEditMode) {
      // TODO: Ganti dengan fetch API sesungguhnya, contoh simulasi:
      setFormData({
        name: 'Andrea Hirata',
        email: 'andrea@hirata.com',
        status: 'Active',
      });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    setIsConfirmModalOpen(true);
  };

  const executeSubmit = async () => {
    setIsLoading(true);
    
    // Simulasi Proses API
    setTimeout(() => {
      setIsLoading(false);
      setIsConfirmModalOpen(false);
      alert(`Author berhasil ${isEditMode ? 'diperbarui' : 'ditambahkan'}!`);
      navigate('/admin/authors');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isEditMode ? 'Edit Author' : 'Tambah Author Baru'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isEditMode ? 'Perbarui informasi detail author.' : 'Masukkan informasi detail untuk author baru.'}
          </p>
        </div>
        <Link
          to="/admin/authors"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          Kembali
        </Link>
      </div>

      {/* Form Container */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">
        <form onSubmit={handleSubmitClick} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200"
              placeholder="Masukkan nama author"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200"
              placeholder="email@contoh.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200 cursor-pointer"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-md shadow-blue-500/30 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Author'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal Konfirmasi */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={executeSubmit}
        isLoading={isLoading}
        title={isEditMode ? 'Konfirmasi Edit' : 'Konfirmasi Tambah'}
        message={`Apakah Anda yakin ingin ${isEditMode ? 'menyimpan perubahan pada' : 'menambahkan'} author ini?`}
      />
    </div>
  );
}