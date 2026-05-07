import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ConfirmModal from '../../../components/ConfirmModal';

export default function AdminGenreForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    // Jika dalam mode edit, fetch data eksisting
    if (isEditMode) {
      setFormData({
        name: 'Fiksi Ilmiah',
        description: 'Buku yang mengeksplorasi konsep futuristik.',
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
    
    setTimeout(() => {
      setIsLoading(false);
      setIsConfirmModalOpen(false);
      alert(`Genre berhasil ${isEditMode ? 'diperbarui' : 'ditambahkan'}!`);
      navigate('/admin/genres');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isEditMode ? 'Edit Genre' : 'Tambah Genre Baru'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isEditMode ? 'Perbarui informasi detail genre.' : 'Masukkan informasi detail untuk genre baru.'}
          </p>
        </div>
        <Link
          to="/admin/genres"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          Kembali
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">
        <form onSubmit={handleSubmitClick} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Genre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200"
              placeholder="Masukkan nama genre"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi Singkat</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200 resize-none"
              placeholder="Masukkan deskripsi genre..."
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-md shadow-blue-500/30 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Genre'}
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
        message={`Apakah Anda yakin ingin ${isEditMode ? 'menyimpan perubahan pada' : 'menambahkan'} genre ini?`}
      />
    </div>
  );
}