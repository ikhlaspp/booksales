import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/public';
import Home from './pages/public/index';
import Login from './pages/login';
import AdminLayout from './layouts/admin';
import AdminDashboard from './pages/admin/index';
import AdminAuthors from './pages/admin/authors/index';
import AdminAuthorCreate from './pages/admin/authors/create';
import AdminAuthorEdit from './pages/admin/authors/edit';
import AdminGenres from './pages/admin/genres/index';
import AdminGenreCreate from './pages/admin/genres/create';
import AdminGenreEdit from './pages/admin/genres/edit';
import AdminBooks from './pages/admin/books/index';
import AdminTransactions from './pages/admin/transactions/index';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
        </Route>
        
        {/* Route Auth */}
        <Route path="/login" element={<Login />} />

        {/* Route Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="authors" element={<AdminAuthors />} />
          <Route path="authors/create" element={<AdminAuthorCreate />} />
          <Route path="authors/edit/:id" element={<AdminAuthorEdit />} />
          <Route path="genres" element={<AdminGenres />} />
          <Route path="genres/create" element={<AdminGenreCreate />} />
          <Route path="genres/edit/:id" element={<AdminGenreEdit />} />
          <Route path="books" element={<AdminBooks />} />
          <Route path="transactions" element={<AdminTransactions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
