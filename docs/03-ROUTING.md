# 03 — Routing (Frontend)

> React Router 7 dengan nested layouts dan role-based protection. Semua route didefinisikan di **satu file**: [`src/App.jsx`](../src/App.jsx).

---

## 1. Route Tree

```
┌─ <PublicLayout />                              ← Layout publik (Navbar + Footer + ChatWidget)
│  ├─ /                       MainCatalog        ← Halaman utama (catalog buku)
│  ├─ /books/:id              BookDetail         ← Detail buku
│  ├─ /about                  About
│  ├─ /contact                Contact            ← Submit form kontak (public)
│  ├─ /login                  Login
│  └─ /register               Register
│
├─ <ProtectedRoute allowedRoles={['user']} />     ← Hanya untuk role 'user'
│  ├─ /user                   PublicLayout > MainCatalog
│  ├─ /profile                PublicLayout > Profile        ← /profile (index)
│  │  ├─ /profile/orders/:id  PublicLayout > OrderDetail
│  │  └─ /profile/edit        PublicLayout > EditProfile
│  └─ /checkout               PublicLayout > Checkout
│
├─ <ProtectedRoute allowedRoles={['admin']} />    ← Hanya untuk role 'admin'
│  └─ /admin                  AdminLayout
│     ├─ /admin (index)       AdminDashboard
│     ├─ /admin/users         AdminUsers
│     ├─ /admin/authors       AdminAuthors
│     ├─ /admin/genres        AdminGenres
│     ├─ /admin/books         AdminBooks
│     ├─ /admin/transactions  AdminTransactions
│     └─ /admin/contacts      AdminContacts          ← Chat inbox (UI: "Pesan")
│
└─ *                          404 fallback (inline JSX)
```

---

## 2. Daftar Route Lengkap

| Path | Component | Layout | Auth Required | Role | Tujuan |
|------|-----------|--------|---------------|------|--------|
| `/` | `MainCatalog` | Public | — | — | Catalog buku publik |
| `/books/:id` | `BookDetail` | Public | — | — | Detail buku |
| `/about` | `About` | Public | — | — | Halaman about |
| `/contact` | `Contact` | Public | — | — | Halaman contact (form) |
| `/login` | `Login` | Public | — | — | Halaman login |
| `/register` | `Register` | Public | — | — | Halaman register |
| `/user` | `MainCatalog` | Public | ✅ | user | Alias catalog untuk user logged-in |
| `/profile` | `Profile` | Public | ✅ | user | Profil + riwayat pesanan |
| `/profile/orders/:id` | `OrderDetail` | Public | ✅ | user | Detail order (dengan PDF export) |
| `/profile/edit` | `EditProfile` | Public | ✅ | user | Edit profil & ganti password |
| `/checkout` | `Checkout` | Public | ✅ | user | Halaman checkout |
| `/admin` | `AdminDashboard` | Admin | ✅ | admin | Stats homepage admin |
| `/admin/users` | `AdminUsers` | Admin | ✅ | admin | List user |
| `/admin/authors` | `AdminAuthors` | Admin | ✅ | admin | CRUD author |
| `/admin/genres` | `AdminGenres` | Admin | ✅ | admin | CRUD genre |
| `/admin/books` | `AdminBooks` | Admin | ✅ | admin | CRUD buku |
| `/admin/transactions` | `AdminTransactions` | Admin | ✅ | admin | List & manage transaksi |
| `/admin/contacts` | `AdminContacts` | Admin | ✅ | admin | Inbox chat admin |
| `*` | 404 JSX | none | — | — | Fallback page not found |

### Catatan tentang `/cart`

Halaman `/cart` ([`pages/public/cart/index.jsx`](../src/pages/public/cart/index.jsx)) **ada tapi tidak didaftarkan** di `App.jsx`. UI utama-nya pakai modal (`CartModal.jsx`) yang dibuka via icon di Navbar.

Jika ingin enable navigation ke `/cart` sebagai page, tambah di App.jsx:
```jsx
<Route path="/cart" element={<Cart />} />
```

---

## 3. ProtectedRoute Implementation

[`src/components/ProtectedRoute.jsx`](../src/components/ProtectedRoute.jsx):

```jsx
import { Navigate, useLocation, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user_role');
  const location = useLocation();

  // 1. Cek auth
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Cek role
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // 3. Render children atau Outlet
  return children ? children : <Outlet />;
}
```

### Cara pakai

```jsx
// Pattern 1: Wrap group route (RECOMMENDED, dipakai di App.jsx)
<Route element={<ProtectedRoute allowedRoles={['admin']} />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
  </Route>
</Route>

// Pattern 2: Wrap single route
<Route path="/secret" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <SecretPage />
  </ProtectedRoute>
} />
```

### Behavior

| Kondisi | Hasil |
|---------|-------|
| Tidak ada `token` di localStorage | Redirect ke `/login` dengan state `{ from: location }` (untuk back-to-where-i-was setelah login) |
| Ada `token` tapi `user_role` tidak match `allowedRoles` | Redirect ke `/` |
| `token` valid + role match | Render `children` atau `<Outlet />` (untuk nested routes) |

### Catatan keamanan

`ProtectedRoute` hanya **client-side guard** — UX, BUKAN security boundary. Backend tetap WAJIB validate token + role di tiap endpoint protected. Kalau user manipulasi localStorage (set `user_role: 'admin'` manual), backend akan tolak request (403 dari middleware Admin).

---

## 4. PublicLayout Auto-Redirect Logic

[`src/layouts/public.jsx`](../src/layouts/public.jsx) baris 8-13:

```jsx
const userRole = localStorage.getItem('user_role');

if (userRole === 'admin') {
  return <Navigate to="/admin" replace />;
}
```

**Efek:** Kalau admin coba akses URL publik (mis. `/`, `/books/123`), auto-redirect ke `/admin`. Admin tidak bisa "browse sebagai customer" tanpa logout dulu.

> Bisa di-relax kalau perlu (mis. admin ingin preview UI publik). Hapus block ini & adjust UX di Navbar untuk admin.

---

## 5. AdminLayout Sidebar Navigation

[`src/layouts/admin.jsx`](../src/layouts/admin.jsx) baris 11-19:

```jsx
const navigation = [
  { name: "Overview",     href: "/admin",              icon: ... },
  { name: "Users",        href: "/admin/users",        icon: ... },
  { name: "Authors",      href: "/admin/authors",      icon: ... },
  { name: "Genres",       href: "/admin/genres",       icon: ... },
  { name: "Books",        href: "/admin/books",        icon: ... },
  { name: "Transactions", href: "/admin/transactions", icon: ... },
  { name: "Pesan",        href: "/admin/contacts",     icon: ... },
];
```

Mau tambah halaman admin baru? Tambah:
1. Component di `src/pages/admin/<feature>/index.jsx`
2. Route di `App.jsx`:
   ```jsx
   <Route path="<feature>" element={<AdminFeature />} />
   ```
3. Link di `navigation` array di `layouts/admin.jsx`
4. Endpoint di backend `routes/api.php`

---

## 6. URL Params

Pakai `useParams` dari React Router:

```jsx
// /books/:id
import { useParams } from 'react-router-dom';

export default function BookDetail() {
  const { id } = useParams();
  // ... fetch /api/books/{id}
}
```

Dipakai di:
- `pages/public/BookDetail.jsx` — `:id`
- `pages/profile/OrderDetail.jsx` — `:id`

---

## 7. Navigation Programmatic

Pakai `useNavigate`:

```jsx
const navigate = useNavigate();
navigate('/profile');                          // pindah halaman
navigate('/profile', { replace: true });       // ganti history (tidak bisa back)
navigate('/login', { state: { message: '...' } }); // kirim state
navigate(-1);                                  // back
```

Contoh pakai state untuk pass message ke login screen:

```jsx
// Saat cart click checkout tapi belum login
navigate('/login', {
  state: { message: 'Silakan login terlebih dahulu untuk melakukan pemesanan.' }
});

// Di Login.jsx
const location = useLocation();
if (location.state?.message) {
  // tampilkan message
}
```

---

## 8. Link vs `<a>` Tag

Selalu pakai `<Link>` (atau `<NavLink>`) dari React Router untuk navigasi internal — pakai History API tanpa full reload.

```jsx
import { Link } from 'react-router-dom';

<Link to="/books/123">Lihat detail</Link>     // ✅
<a href="/books/123">Lihat detail</a>          // ❌ full reload, kehilangan state
```

`<a href>` masih OK untuk:
- External link (mis. `<a href="https://twitter.com/...">`)
- Mailto, tel (`mailto:`, `tel:`)
- Download file (`<a href="/file.pdf" download>`)

---

## 9. Active Link Highlight

Pattern manual di codebase (Navbar):

```jsx
const isActive = (href) => {
  return location.pathname === href || (href !== '/' && location.pathname.startsWith(href));
};

<Link className={`... ${isActive(link.href) ? 'text-rausch font-semibold' : ''}`}>
  {link.name}
</Link>
```

Atau pakai `<NavLink>` dari React Router (lebih clean):

```jsx
<NavLink
  to="/about"
  className={({ isActive }) => isActive ? 'font-bold' : 'font-normal'}
>
  About
</NavLink>
```

(Saat ini codebase pakai pattern manual, tidak masalah.)

---

## 10. 404 Fallback

Defined inline di [`App.jsx`](../src/App.jsx) baris 69-82:

```jsx
<Route path="*" element={
  <div className="min-h-screen flex flex-col items-center justify-center text-center bg-canvas text-ink">
    <div className="space-y-4">
      <h2 className="text-display-xl font-bold">404</h2>
      <p className="text-body-md text-muted">Halaman yang Anda cari tidak ditemukan.</p>
      <a href="/" className="inline-block mt-4 px-6 py-2 bg-rausch text-white rounded-sm hover:bg-rausch-active transition-colors">
        Kembali ke Beranda
      </a>
    </div>
  </div>
} />
```

Match path `*` (wildcard) — render kalau tidak ada route lain match.

> Bisa di-extract jadi component `NotFound.jsx` kalau perlu animasi/fitur tambahan.

---

## 11. Cara Menambah Route Baru

### 11.1 Halaman publik baru

1. Buat component:
   ```jsx
   // src/pages/public/faq.jsx
   export default function FAQ() {
     return <div>...</div>;
   }
   ```

2. Import & daftarkan di `App.jsx`:
   ```jsx
   import FAQ from './pages/public/faq';
   ...
   <Route element={<PublicLayout />}>
     ...
     <Route path="/faq" element={<FAQ />} />
   </Route>
   ```

3. (Opsional) Tambah link di `Navbar.jsx`:
   ```jsx
   const navLinks = [
     { name: 'Beranda', href: '/' },
     ...
     { name: 'FAQ', href: '/faq' },
   ];
   ```

### 11.2 Halaman admin baru

1. Buat component di `src/pages/admin/<feature>/index.jsx`
2. Daftarkan di `App.jsx` di dalam `<Route path="/admin" element={<AdminLayout />}>`
3. Tambah link di `layouts/admin.jsx` array `navigation`

### 11.3 Halaman user-protected baru

1. Buat component
2. Daftarkan di dalam `<Route element={<ProtectedRoute allowedRoles={['user']} />}>`

---

## 12. Tips & Best Practices

### 12.1 Lazy load admin pages untuk reduce initial bundle

```jsx
import { lazy, Suspense } from 'react';
const AdminBooks = lazy(() => import('./pages/admin/books/index'));

<Route path="books" element={
  <Suspense fallback={<div>Loading...</div>}>
    <AdminBooks />
  </Suspense>
} />
```

(Belum diimplementasi, tapi worth considering jika bundle size membengkak.)

### 12.2 Scroll restoration

React Router 7 punya `ScrollRestoration` component. Tambah di `App.jsx`:

```jsx
import { ScrollRestoration } from 'react-router-dom';

<BrowserRouter>
  <ScrollRestoration />
  <Routes>...</Routes>
</BrowserRouter>
```

Auto-scroll ke top setiap pindah halaman. (Belum diimplementasi — saat ini scroll position random saat navigasi.)

### 12.3 Title page dinamis

Belum diimplementasi. Bisa pakai `document.title` di tiap page:

```jsx
useEffect(() => {
  document.title = 'Catalog | PustakaIkhlas';
}, []);
```

Atau pakai library `react-helmet-async` untuk lebih clean.

---

## Berikutnya

- Mau tahu state management? → [04-STATE-MANAGEMENT.md](04-STATE-MANAGEMENT.md)
- Mau tahu komponen reusable? → [05-COMPONENTS.md](05-COMPONENTS.md)
