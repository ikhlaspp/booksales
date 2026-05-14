import { Navigate, useLocation, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user_role');
  const location = useLocation();

  // 1. Periksa ketersediaan otentikasi login
  if (!token) {
    // Melempar kembali ke login sambil membawa state referensi rute agar bisa kembali setelah sukses
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Evaluasi aturan tingkat akses / RBAC secara ketat
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Mencegah user biasa masuk ke area Admin dan sebaliknya
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}