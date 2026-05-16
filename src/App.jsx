import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/admin';
import PublicLayout from './layouts/public';
import MainCatalog from './pages/public/index';
import BookDetail from './pages/public/BookDetail';
import About from './pages/public/about';
import Contact from './pages/public/contact';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Profile from './pages/profile/index';
import OrderDetail from './pages/profile/OrderDetail';
import EditProfile from './pages/profile/EditProfile';
import Cart from './pages/public/cart/index';
import Checkout from './pages/public/checkout/index';
import AdminDashboard from './pages/admin/index';
import AdminGenres from './pages/admin/genres/index';
import AdminAuthors from './pages/admin/authors/index';
import AdminBooks from './pages/admin/books/index';
import AdminTransactions from './pages/admin/transactions/index';
import AdminUsers from './pages/admin/users/index';
import AdminContacts from './pages/admin/contacts/index';
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Rute Publik */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<MainCatalog />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Rute Dasbor Pengguna */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/user" element={<PublicLayout />}>
              <Route index element={<MainCatalog />} />
            </Route>
            <Route path="/profile" element={<PublicLayout />}>
              <Route index element={<Profile />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="edit" element={<EditProfile />} />
            </Route>
            <Route path="/checkout" element={<PublicLayout />}>
              <Route index element={<Checkout />} />
            </Route>
          </Route>

          {/* Rute Dasbor Admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="authors" element={<AdminAuthors />} />
              <Route path="genres" element={<AdminGenres />} />
              <Route path="books" element={<AdminBooks />} />
              <Route path="transactions" element={<AdminTransactions />} />
              <Route path="contacts" element={<AdminContacts />} />
            </Route>
          </Route>

          {/* Fallback 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center text-center bg-canvas text-ink">
              <div className="space-y-4">
                <h2 className="text-display-xl font-bold">404</h2>
                <p className="text-body-md text-muted">Halaman yang Anda cari tidak ditemukan.</p>
                <a
                  href="/"
                  className="inline-block mt-4 px-6 py-2 bg-rausch text-white rounded-sm hover:bg-rausch-active transition-colors"
                >
                  Kembali ke Beranda
                </a>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}