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
          <h2 className="text-[22px] font-bold text-[#222222] tracking-[-0.44px]">
            {isEditMode ? 'Edit Genre' : 'Tambah Genre Baru'}
          </h2>
          <p className="text-[14px] text-[#6a6a6a] mt-1">
            {isEditMode ? 'Perbarui informasi detail genre.' : 'Masukkan informasi detail untuk genre baru.'}
          </p>
        </div>
        <Link
          to="/admin/genres"
          className="inline-flex h-[48px] items-center px-[23px] text-[16px] font-medium text-[#222222] bg-[#ffffff] border border-[#222222] rounded-[8px] hover:bg-[#f7f7f7] transition-colors"
        >
          Kembali
        </Link>
      </div>

      <div className="bg-[#ffffff] border border-[#ebebeb] rounded-[14px] shadow-[0_2px_6px_rgba(0,0,0,0.04)] p-6 md:p-8">
        <form onSubmit={handleSubmitClick} className="space-y-6">
          <div>
            <label className="block text-[12px] font-bold text-[#222222] mb-1.5 uppercase tracking-[0.32px]">Nama Genre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="block w-full h-[56px] px-[12px] bg-[#ffffff] border border-[#dddddd] rounded-[8px] text-[#222222] text-[16px] focus:outline-none focus:border-2 focus:border-[#222222] transition-colors"
              placeholder="Masukkan nama genre"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#222222] mb-1.5 uppercase tracking-[0.32px]">Deskripsi Singkat</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="block w-full p-[12px] bg-[#ffffff] border border-[#dddddd] rounded-[8px] text-[#222222] text-[16px] focus:outline-none focus:border-2 focus:border-[#222222] transition-colors resize-none"
              placeholder="Masukkan deskripsi genre..."
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-[48px] justify-center items-center px-[24px] rounded-[8px] text-[16px] font-medium text-[#ffffff] bg-[#ff385c] hover:bg-[#e00b41] focus:outline-none disabled:opacity-50 transition-colors"
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