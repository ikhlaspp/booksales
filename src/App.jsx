import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// --- Import Layouts & Components ---
import PublicLayout from './layouts/public';
import AdminLayout from './layouts/admin';
import ProtectedRoute from './components/ProtectedRoute';

// --- Import Auth Pages ---
import Login from './pages/auth/login';
import Register from './pages/auth/Register';

// --- Import Public Pages ---
import PublicHome from './pages/public/index';
import Books from './pages/public/books/index';
import ShowBook from './pages/public/books/show';

// --- Import Admin Pages ---
import AdminDashboard from './pages/admin/index';
import AdminGenres from './pages/admin/genres/index';
import AdminGenreForm from './pages/admin/genres/Form';
import AdminAuthors from './pages/admin/authors/index';
import AdminAuthorForm from './pages/admin/authors/Form';

// --- 404 Not Found Component ---
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#ffffff] text-[#222222] text-center p-6">
    <div className="w-16 h-16 bg-[#ffd1da] rounded-full flex items-center justify-center text-[#c13515] mb-6 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h1 className="text-[28px] font-bold tracking-[-0.44px] mb-2">Halaman Tidak Ditemukan</h1>
    <p className="text-[16px] text-[#6a6a6a] max-w-md mb-8">Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
    <Link to="/" className="inline-flex h-[48px] items-center justify-center px-[24px] bg-[#ff385c] text-[#ffffff] text-[16px] font-medium rounded-[8px] hover:bg-[#e00b41] transition-colors">
      Kembali ke Beranda
    </Link>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Auth Routes (Tanpa Layout Globals) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Public Routes (Menggunakan PublicLayout) --- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicHome />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<ShowBook />} />
        </Route>

        {/* --- Admin Routes (Protected & Nested dengan AdminLayout) --- */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          
          <Route path="genres" element={<AdminGenres />} />
          <Route path="genres/create" element={<AdminGenreForm />} />
          <Route path="genres/edit/:id" element={<AdminGenreForm />} />
          
          <Route path="authors" element={<AdminAuthors />} />
          <Route path="authors/create" element={<AdminAuthorForm />} />
          <Route path="authors/edit/:id" element={<AdminAuthorForm />} />
          
          {/* Profile rute yang sudah dikonsolidasi */}
          <Route path="profile" element={<div className="p-4 text-[16px] text-[#222222]">Admin Profile Placeholder</div>} />
        </Route>

        {/* --- User Routes --- */}
        <Route 
          path="/user" 
          element={
            <ProtectedRoute allowedRoles={['user', 'customer']}>
              <PublicLayout />
            </ProtectedRoute>
          }
        >
          <Route path="profile" element={<div className="p-12 text-center text-[16px] text-[#222222]">User Profile Placeholder</div>} />
        </Route>

        {/* --- Catch All (404) --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}