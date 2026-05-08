import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('info');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const role = localStorage.getItem('user_role') || 'user';

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const borrowHistory = [
    { id: 'TRX-001', title: 'The Great Gatsby', date: '01 May 2026', status: 'Dipinjam' },
    { id: 'TRX-002', title: 'Atomic Habits', date: '15 Apr 2026', status: 'Dikembalikan' },
    { id: 'TRX-003', title: 'Sapiens', date: '10 Mar 2026', status: 'Terlambat' },
  ];

  const handlePasswordChange = (e) => {
    e.preventDefault();
    alert('Simulasi: Password berhasil diperbarui!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error("Sesi tidak valid, silakan login kembali.");
        }

        const response = await fetch('http://localhost:8000/api/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });

        if (response.status === 401) {
          handleLogout();
          return;
        }

        if (!response.ok) {
          throw new Error('Gagal memuat data profil');
        }

        const data = await response.json();
        setUserData(data?.data || data);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        await fetch('http://localhost:8000/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });
      } catch (err) {
        console.error("Gagal memanggil API logout:", err);
      }
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    
    navigate('/login', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 font-medium">Memuat data profil...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-center mx-auto max-w-lg mt-10">
        <p className="font-semibold">{error}</p>
        <button onClick={handleLogout} className="mt-4 text-sm underline hover:text-red-800">
          Kembali ke Login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pengaturan Akun</h1>
        <p className="text-gray-500 mt-1">Kelola informasi pribadi, keamanan, dan riwayat aktivitas Anda.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        <aside className="w-full md:w-72 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-shrink-0 sticky top-28">
          <div className="p-6 border-b border-gray-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 border-4 border-white shadow-md overflow-hidden mb-3">
              <img src={`https://ui-avatars.com/api/?name=${userData?.name || 'User'}&background=eff6ff&color=2563eb&size=100`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">{userData?.name || 'Pengguna'}</h2>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mt-1">{role}</span>
          </div>
          
          <nav className="p-4 flex flex-col space-y-1.5">
            <button 
              onClick={() => setActiveTab('info')}
              className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 text-left ${activeTab === 'info' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              Informasi Akun
            </button>
            <button 
              onClick={() => setActiveTab('password')}
              className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 text-left ${activeTab === 'password' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              Keamanan & Sandi
            </button>
            
            {role !== 'admin' && (
              <button 
                onClick={() => setActiveTab('transactions')}
                className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 text-left ${activeTab === 'transactions' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                Riwayat Transaksi
              </button>
            )}
          </nav>

          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-3 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 text-sm font-semibold rounded-xl transition-all duration-200 border border-gray-200 hover:border-red-200 shadow-sm"
            >
              Logout / Keluar
            </button>
          </div>
        </aside>

        <main className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
          
          {activeTab === 'info' && userData && (
            <div className="max-w-2xl animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Detail Informasi Akun</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                  <input type="text" readOnly value={userData.name} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Email</label>
                  <input type="email" readOnly value={userData.email} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hak Akses (Role)</label>
                  <input type="text" readOnly value={role.toUpperCase()} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 cursor-not-allowed" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="max-w-2xl animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Ubah Kata Sandi</h3>
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kata Sandi Saat Ini</label>
                  <input type="password" required value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kata Sandi Baru</label>
                  <input type="password" required value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Konfirmasi Sandi Baru</label>
                  <input type="password" required value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors" placeholder="••••••••" />
                </div>
                <div className="pt-4">
                  <button type="submit" className="px-8 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all duration-200">
                    Simpan Perubahan Sandi
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'transactions' && role !== 'admin' && (
            <div className="animate-fade-in w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Riwayat Transaksi Buku</h3>
              </div>
              <div className="space-y-4">
                {borrowHistory.map(item => (
                  <div key={item.id} className="p-5 border border-gray-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow bg-gray-50/30 group">
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.id}</span>
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                          item.status === 'Dipinjam' ? 'bg-amber-50 text-amber-700 border-amber-200' 
                          : item.status === 'Terlambat' ? 'bg-red-50 text-red-700 border-red-200' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">Tanggal Transaksi: {item.date}</p>
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm">
                      Lihat Detail
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}