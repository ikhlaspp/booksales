import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role');

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
}