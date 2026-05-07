import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  
  // Mengambil token dan role dari localStorage yang di-set saat login
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role');

  // Jika tidak ada token (belum login), kembalikan ke halaman login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika rolenya tidak ada di daftar allowedRoles, lempar ke beranda
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; 
  }

  // Jika lolos pengecekan, render komponen / halaman yang dituju
  return <Outlet />;
}