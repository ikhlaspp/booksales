import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function EditProfile() {
  const navigate = useNavigate();

  const [infoForm, setInfoForm] = useState({ name: '', email: '', address: '', city: '', postal_code: '' });
  const [infoError, setInfoError] = useState('');
  const [infoSuccess, setInfoSuccess] = useState('');
  const [savingInfo, setSavingInfo] = useState(false);

  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      try {
        const res = await axios.get(`${API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const u = res.data;
        setInfoForm({
          name:        u.name        || '',
          email:       u.email       || '',
          address:     u.address     || '',
          city:        u.city        || '',
          postal_code: u.postal_code || '',
        });
      } catch (err) {
        if (err.response?.status === 401) navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setInfoError('');
    setInfoSuccess('');
    setSavingInfo(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/api/user/profile`, infoForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem('user_name', res.data.name);
      setInfoSuccess('Perubahan berhasil disimpan.');
      setTimeout(() => setInfoSuccess(''), 3000);
    } catch (err) {
      if (err.response?.status === 422) {
        const data = err.response.data;
        if (data.errors) {
          const firstKey = Object.keys(data.errors)[0];
          setInfoError(data.errors[firstKey][0]);
        } else {
          setInfoError(data.message || 'Validasi gagal.');
        }
      } else {
        setInfoError('Gagal menyimpan perubahan. Coba lagi.');
      }
    } finally {
      setSavingInfo(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (!pwForm.current_password || !pwForm.new_password || !pwForm.new_password_confirmation) {
      setPwError('Semua field password wajib diisi.');
      return;
    }
    if (pwForm.new_password.length < 8) {
      setPwError('Password minimal 8 karakter.');
      return;
    }
    if (pwForm.new_password !== pwForm.new_password_confirmation) {
      setPwError('Password baru tidak cocok.');
      return;
    }

    setSavingPw(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/user/password`, pwForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPwForm({ current_password: '', new_password: '', new_password_confirmation: '' });
      setPwSuccess('Password berhasil diubah.');
    } catch (err) {
      if (err.response?.status === 422) {
        setPwError(err.response.data.message || 'Validasi gagal.');
      } else {
        setPwError('Gagal mengubah password. Coba lagi.');
      }
    } finally {
      setSavingPw(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 bg-surface-soft border border-hairline rounded-md focus:outline-none focus:border-ink focus:bg-canvas transition-colors text-body-md';
  const labelClass = 'block text-body-sm font-semibold text-ink mb-1.5';

  return (
    <div className="bg-canvas min-h-screen text-ink pb-20">
      <div className="max-w-2xl mx-auto px-6 md:px-8 pt-12 md:pt-16">

        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-muted hover:text-ink transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Profil
        </Link>

        <h1 className="text-display-xl font-bold mb-8">Edit Profil</h1>

        {/* Card 1 — Informasi Akun */}
        <div className="bg-canvas border border-hairline rounded-[14px] p-6 mb-6">
          <h2 className="text-title-md font-bold mb-5">Informasi Akun</h2>
          <form onSubmit={handleSaveInfo} className="space-y-4">
            <div>
              <label className={labelClass}>Nama Lengkap</label>
              <input
                type="text"
                value={infoForm.name}
                onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                className={inputClass}
                placeholder="Nama lengkap Anda"
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={infoForm.email}
                onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                className={inputClass}
                placeholder="email@contoh.com"
              />
            </div>
            <div>
              <label className={labelClass}>Nama Jalan</label>
              <textarea
                value={infoForm.address}
                onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
                className={inputClass}
                placeholder="Jl. Contoh No. 123, RT 01/RW 02"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Kota</label>
                <input
                  type="text"
                  value={infoForm.city}
                  onChange={(e) => setInfoForm({ ...infoForm, city: e.target.value })}
                  className={inputClass}
                  placeholder="Jakarta Selatan"
                />
              </div>
              <div>
                <label className={labelClass}>Kode Pos</label>
                <input
                  type="text"
                  value={infoForm.postal_code}
                  onChange={(e) => setInfoForm({ ...infoForm, postal_code: e.target.value })}
                  className={inputClass}
                  placeholder="12345"
                />
              </div>
            </div>
            {infoError && <p className="text-[#e00b41] text-body-sm">{infoError}</p>}
            {infoSuccess && <p className="text-[#2e7d32] text-body-sm">{infoSuccess}</p>}
            <div className="pt-2">
              <button
                type="submit"
                disabled={savingInfo}
                className="w-full py-3.5 bg-ink text-white rounded-full font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {savingInfo ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>

        {/* Card 2 — Ganti Password */}
        <div className="bg-canvas border border-hairline rounded-[14px] p-6">
          <h2 className="text-title-md font-bold mb-5">Ganti Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className={labelClass}>Password Sekarang</label>
              <input
                type="password"
                value={pwForm.current_password}
                onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })}
                className={inputClass}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className={labelClass}>Password Baru</label>
              <input
                type="password"
                value={pwForm.new_password}
                onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
                className={inputClass}
                placeholder="Minimal 8 karakter"
              />
            </div>
            <div>
              <label className={labelClass}>Konfirmasi Password Baru</label>
              <input
                type="password"
                value={pwForm.new_password_confirmation}
                onChange={(e) => setPwForm({ ...pwForm, new_password_confirmation: e.target.value })}
                className={inputClass}
                placeholder="Ulangi password baru"
              />
            </div>
            {pwError && <p className="text-[#e00b41] text-body-sm">{pwError}</p>}
            {pwSuccess && <p className="text-[#2e7d32] text-body-sm">{pwSuccess}</p>}
            <div className="pt-2">
              <button
                type="submit"
                disabled={savingPw}
                className="w-full py-3.5 bg-ink text-white rounded-full font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {savingPw ? 'Mengubah...' : 'Ganti Password'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
