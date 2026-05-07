import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/admin';
import UserLayout from './layouts/user';
import UserDashboard from './pages/user/index';
import Login from './pages/auth/login';
import AdminGenres from './pages/admin/genres/index';
import AdminAuthors from './pages/admin/authors/index';
import Profile from './pages/profile/index';
// Silakan import komponen halaman/view yang lain sesuai kebutuhan project

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === Rute Publik (Bisa diakses siapa saja) === */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<div>Halaman Beranda Umum</div>} />
        
        {/* === Rute Terproteksi Khusus User (Semua role) === */}
        {/* Misalnya baik user maupun admin boleh melihat profil */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* === Rute Terproteksi Khusus Admin === */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          {/* Route AdminLayout akan membungkus (Outlet) anak-anaknya di dalamnya */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div>Halaman Overview Admin</div>} />
            
            <Route path="genres" element={<AdminGenres />} />
            <Route path="genres/create" element={<div>Form Create Genre</div>} />
            
            <Route path="authors" element={<AdminAuthors />} />
            <Route path="profile" element={<Profile />} />
            {/* Tambahkan sisa daftar rute pengelolaan admin lainnya di sini */}
          </Route>
        </Route>
        
        {/* === Fallback / Rute 404 (Not Found) === */}
        <Route path="*" element={<div>Halaman Tidak Ditemukan (404)</div>} />
      </Routes>
    </BrowserRouter>
  );
}