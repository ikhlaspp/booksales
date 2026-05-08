import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/admin';
import UserDashboard from './pages/user/index';
import PublicLayout from './layouts/public';
import Home from './pages/public/home';
import PublicBooks from './pages/public/books';
import About from './pages/public/about';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import AdminGenres from './pages/admin/genres/index';
import AdminAuthors from './pages/admin/authors/index';
import Profile from './pages/profile/index';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<PublicBooks />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/register" element={<Register />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
          <Route path="/user" element={<PublicLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div>Halaman Overview Admin</div>} />
            
            <Route path="genres" element={<AdminGenres />} />
            <Route path="genres/create" element={<div>Form Create Genre</div>} />
            
            <Route path="authors" element={<AdminAuthors />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
        
        <Route path="*" element={<div>Halaman Tidak Ditemukan (404)</div>} />
      </Routes>
    </BrowserRouter>
  );
}