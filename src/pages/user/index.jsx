import { useState } from 'react';

export default function Profile() {
  const role = localStorage.getItem('user_role') || 'user';
  const [activeTab, setActiveTab] = useState('info');

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const userInfo = {
    name: role === 'admin' ? 'Administrator' : 'Customer User',
    email: role === 'admin' ? 'admin@booksales.com' : 'user@booksales.com',
    joined: '12 Jan 2024'
  };

  const borrowHistory = [
    { id: 1, title: 'The Great Gatsby', date: '01 May 2026', status: 'Dipinjam' },
    { id: 2, title: 'Atomic Habits', date: '15 Apr 2026', status: 'Dikembalikan' },
  ];

  const handlePasswordChange = (e) => {
    e.preventDefault();
    alert('Password berhasil diperbarui!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight border-b border-gray-100 pb-4">Pengaturan Profil</h2>
        <nav className="flex flex-row space-x-2 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('info')}
            className={`flex items-center px-5 py-3 text-sm font-medium rounded-xl transition-colors whitespace-nowrap ${activeTab === 'info' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 bg-gray-50 hover:bg-gray-100'}`}
          >
            Informasi Akun
          </button>
          <button 
            onClick={() => setActiveTab('password')}
            className={`flex items-center px-5 py-3 text-sm font-medium rounded-xl transition-colors whitespace-nowrap ${activeTab === 'password' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 bg-gray-50 hover:bg-gray-100'}`}
          >
            Ganti Password
          </button>
          
          {role !== 'admin' && (
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex items-center px-5 py-3 text-sm font-medium rounded-xl transition-colors whitespace-nowrap ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 bg-gray-50 hover:bg-gray-100'}`}
            >
              Riwayat Peminjaman
            </button>
          )}
        </nav>
      </div>

      <div className="w-full bg-white">
        {activeTab === 'info' && (
          <div className="max-w-xl space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Detail Informasi Akun</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
                <input type="text" readOnly value={userInfo.name} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input type="email" readOnly value={userInfo.email} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role Pengguna</label>
                <input type="text" readOnly value={role.toUpperCase()} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 cursor-not-allowed" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="max-w-xl space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Ganti Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password Saat Ini</label>
                <input type="password" required value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" placeholder="Masukkan password saat ini" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password Baru</label>
                <input type="password" required value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" placeholder="Masukkan password baru" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
                <input type="password" required value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" placeholder="Ketik ulang password baru" />
              </div>
              <div className="pt-2">
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/30 transition-all duration-200">
                  Perbarui Password
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'history' && role !== 'admin' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Riwayat Peminjaman</h3>
            <div className="space-y-3">
              {borrowHistory.map(item => (
                <div key={item.id} className="p-4 border border-gray-100 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500 mt-0.5">Tanggal: {item.date}</p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-lg border ${
                      item.status === 'Dipinjam' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}