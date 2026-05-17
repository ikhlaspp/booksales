# 01 — Architecture (Frontend)

> Tujuan dokumen ini: memberi gambaran utuh **bagaimana frontend BookSales disusun**. Setelah membaca dokumen ini Anda akan tahu di mana harus mencari/menambah kode untuk fitur baru.

---

## 1. Stack Teknologi

| Lapisan | Teknologi | Versi (`package.json`) |
|---------|-----------|------------------------|
| Build tool | Vite | `^8.0.1` |
| UI library | React | `^19.2.4` |
| Routing | React Router DOM | `^7.14.2` |
| HTTP client | Axios | `^1.16.0` |
| Styling | Tailwind CSS | `^4.2.4` (pakai `@tailwindcss/vite` plugin) |
| Icons | lucide-react | `^1.14.0` |
| Charts | Recharts | `^3.8.1` (hanya di admin dashboard) |
| PDF generation | html2pdf.js | `^0.14.0` (untuk export invoice di OrderDetail) |
| Linter | ESLint | `^9.39.4` |

---

## 2. Struktur Folder

```
booksales/
├── public/                    ← Static assets (favicon, dll)
├── src/
│   ├── main.jsx               ← React entry point (renders <App />)
│   ├── App.jsx                ← Definisi ALL routes
│   ├── index.css              ← Tailwind config + design tokens (CSS custom props)
│   ├── context/
│   │   └── CartContext.jsx    ← Cart state global (per-user di localStorage)
│   ├── layouts/
│   │   ├── public.jsx         ← Layout publik (Navbar + Footer + ChatWidget + Outlet)
│   │   └── admin.jsx          ← Layout admin (Sidebar + Header + Outlet)
│   ├── components/
│   │   ├── navbar.jsx
│   │   ├── footer.jsx
│   │   ├── ProtectedRoute.jsx ← Route guard (cek token + role)
│   │   ├── CartModal.jsx
│   │   ├── CartContext.jsx
│   │   ├── DeleteModal.jsx
│   │   ├── ConfirmModal.jsx
│   │   ├── ChatWidget.jsx     ← Widget chat user (polling 5s)
│   │   └── admin/
│   │       ├── AdminCrudTable.jsx  ← Reusable table untuk semua admin list
│   │       └── AdminCrudForm.jsx   ← Reusable form untuk semua admin create/edit
│   ├── hooks/
│   │   └── useCountdown.js    ← Hook untuk pending order countdown
│   └── pages/
│       ├── auth/
│       │   ├── login.jsx
│       │   └── register.jsx
│       ├── public/
│       │   ├── index.jsx       ← Main Catalog
│       │   ├── BookDetail.jsx
│       │   ├── about.jsx
│       │   ├── contact.jsx
│       │   ├── cart/
│       │   │   └── index.jsx
│       │   ├── checkout/
│       │   │   └── index.jsx
│       │   └── Checkout.jsx    ← (LEGACY, sudah diganti checkout/index.jsx)
│       ├── profile/
│       │   ├── index.jsx       ← Profile + Orders table
│       │   ├── OrderDetail.jsx
│       │   └── EditProfile.jsx
│       └── admin/
│           ├── index.jsx       ← Dashboard
│           ├── books/
│           │   ├── index.jsx
│           │   └── Form.jsx
│           ├── genres/
│           │   ├── index.jsx
│           │   └── Form.jsx
│           ├── authors/
│           │   ├── index.jsx
│           │   └── Form.jsx
│           ├── transactions/
│           │   ├── index.jsx
│           │   ├── Form.jsx
│           │   └── DetailModal.jsx
│           ├── users/
│           │   └── index.jsx
│           └── contacts/
│               └── index.jsx   ← Chat inbox admin (UI-nya disebut "Pesan")
├── eslint.config.js
├── package.json
├── vite.config.js
└── index.html
```

> **Catatan:** Nama project di `package.json` adalah `"pustakaikhlas"`, sama persis dengan branding di UI. Folder-nya `booksales/` (legacy/internal). Frontend juga dirujuk sebagai "PustakaIkhlas" di UI text.

---

## 3. Alur Boot (dari `index.html` ke UI)

```
1) index.html dimuat → <div id="root"></div>
       │
       ▼
2) src/main.jsx
   - createRoot(document.getElementById('root'))
   - render(<StrictMode><App /></StrictMode>)
       │
       ▼
3) src/App.jsx
   - <CartProvider>          ← Context global cart
       <BrowserRouter>       ← History API routing
         <Routes>            ← Definisi semua route
           <Route element={<PublicLayout />}>...</Route>
           <Route element={<ProtectedRoute allowedRoles={['user']} />}>...</Route>
           <Route element={<ProtectedRoute allowedRoles={['admin']} />}>...</Route>
           <Route path="*" element={<404 fallback />} />
         </Routes>
       </BrowserRouter>
     </CartProvider>
       │
       ▼
4) React Router cocokkan path dengan Route, render component yang sesuai
   - Layout component render <Outlet /> untuk child route
   - Public route render PublicLayout → punya Navbar + ChatWidget + Outlet
   - Admin route render AdminLayout → punya Sidebar + Outlet
```

---

## 4. Routing

Semua route didefinisikan di **satu file**: [`src/App.jsx`](../src/App.jsx).

```
/                              → MainCatalog
/books/:id                     → BookDetail
/about                         → About
/contact                       → Contact
/login                         → Login
/register                      → Register
                               
/user                          → MainCatalog (alias, di dalam protected route 'user')
/profile                       → Profile (orders + profile info)
/profile/orders/:id            → OrderDetail
/profile/edit                  → EditProfile
/checkout                      → Checkout
                               
/admin                         → AdminDashboard
/admin/users                   → AdminUsers
/admin/authors                 → AdminAuthors
/admin/genres                  → AdminGenres
/admin/books                   → AdminBooks
/admin/transactions            → AdminTransactions
/admin/contacts                → AdminContacts (Chat Inbox)
                               
*                              → 404 fallback
```

Detail per-route + protection logic: [03-ROUTING.md](03-ROUTING.md).

---

## 5. Layout Strategy

### 5.1 `PublicLayout` ([`layouts/public.jsx`](../src/layouts/public.jsx))

Wrapper untuk semua halaman publik & user. Punya:
- `<Navbar />` — sticky di top, integrasi cart icon + dropdown user
- `<Outlet />` — child route render di sini
- `<Footer />`
- `<ChatWidget />` — hanya muncul untuk role `user` (lihat [10-CHAT-WIDGET.md](10-CHAT-WIDGET.md))

**Special behavior:**
- Jika `localStorage.user_role === 'admin'` → auto-redirect ke `/admin` (admin tidak boleh stay di public layout)
- Jika path mulai `/user`, isi dibungkus card `bg-surface-soft rounded-[20px]` (untuk profile-style pages)

### 5.2 `AdminLayout` ([`layouts/admin.jsx`](../src/layouts/admin.jsx))

Wrapper untuk semua halaman admin. Punya:
- Sidebar kiri (collapsible) dengan link ke Overview, Users, Authors, Genres, Books, Transactions, Pesan
- Header atas dengan toggle sidebar
- `<Outlet />` di content area (di dalam card `rounded-[20px] border border-hairline`)
- Tombol logout di sidebar bottom (clear localStorage + redirect ke /login)

---

## 6. State Management

### 6.1 Auth State — `localStorage`

Tidak pakai context untuk auth, langsung baca `localStorage` di tiap component yang perlu:

| Key | Diisi saat | Dipakai untuk |
|-----|-----------|---------------|
| `token` | Login success | Bearer token Axios |
| `user_id` | Login success | Identify user (untuk per-user cart) |
| `user_name` | Login success | Display di Navbar avatar |
| `user_role` | Login success | RBAC check di `ProtectedRoute` |

**Event sinkronisasi:** Saat login/logout, dispatch `window.dispatchEvent(new Event('authChange'))` agar `CartContext` reload cart untuk user yang sesuai.

### 6.2 Cart State — `CartContext`

`src/context/CartContext.jsx` — context global untuk cart items.

- Per-user storage: `localStorage[`cart_${user_id}`]`
- Item: `{ id, title, price, cover_photo, stock, quantity, author, genre }`
- Methods: `addToCart`, `removeFromCart`, `clearCart`, `increaseQuantity`, `decreaseQuantity`
- Auto-load saat mount + listen `authChange` event

Detail: [04-STATE-MANAGEMENT.md](04-STATE-MANAGEMENT.md).

### 6.3 Component-local state

Halaman lain pakai `useState`/`useEffect` lokal. Fetched data tidak di-cache global — tiap halaman fetch sendiri saat mount. Pattern yang konsisten:

```jsx
const [data, setData] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  setIsLoading(true);
  axios.get(URL).then(res => setData(res.data)).catch(setError).finally(() => setIsLoading(false));
}, [deps]);
```

---

## 7. HTTP Client

Pakai **Axios** untuk semua HTTP. Pattern auth:

```jsx
const token = localStorage.getItem('token');
axios.get(`${API_URL}/api/dashboard`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

Base URL diatur via env var `VITE_API_BASE_URL`:

```js
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
```

> **Inkonsistensi**: Beberapa file pakai `API_URL` yang ada `/api`-nya, ada yang tidak (kadang di-strip pakai `.replace('/api', '')`). Sebaiknya standardize. Lihat [07-API-INTEGRATION.md](07-API-INTEGRATION.md) untuk detail.

---

## 8. Styling Architecture

### 8.1 Tailwind CSS 4

Vite plugin `@tailwindcss/vite` di [`vite.config.js`](../vite.config.js):

```js
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
});
```

Tidak ada `tailwind.config.js` separate — semua config inline di [`src/index.css`](../src/index.css) pakai directive `@theme`.

### 8.2 Design Tokens (CSS Custom Properties)

```css
@theme {
  --color-rausch: #ff385c;
  --color-ink: #222222;
  --color-muted: #6a6a6a;
  --color-canvas: #ffffff;
  --color-surface-soft: #f7f7f7;
  --color-hairline: #dddddd;
  /* ... typography, radius, shadows ... */
}
```

Bisa dipakai sebagai:
- Utility class Tailwind: `bg-rausch`, `text-ink`, `border-hairline`
- Inline CSS variable: `style={{ color: 'var(--color-rausch)' }}`

Detail token: [08-DESIGN-SYSTEM.md](08-DESIGN-SYSTEM.md).

### 8.3 Typography Utilities

Custom typography class (defined di `index.css`):
- `text-display-xl` (28px, line-height 1.43)
- `text-display-lg` (22px)
- `text-display-md`, `text-display-sm`
- `text-title-md` (16px)
- `text-body-md` (16px), `text-body-sm` (14px)
- `text-caption`, `text-caption-sm`, `text-badge`, `text-micro-label`
- `text-button-md`, `text-button-sm`

---

## 9. Keputusan Desain Penting

### 9.1 Cart Modal vs Cart Page

Cart utama dibuka **sebagai modal** dari icon di Navbar ([`components/CartModal.jsx`](../src/components/CartModal.jsx)). Halaman `/cart` ([`pages/public/cart/index.jsx`](../src/pages/public/cart/index.jsx)) ada tapi rarely dipakai sebagai standalone navigation target — modal-first UX.

### 9.2 Per-user Cart di localStorage

Cart disimpan per-user-id (`cart_${user_id}`), bukan global. Saat logout/login → cart di-reload sesuai user baru. Lihat [04-STATE-MANAGEMENT.md](04-STATE-MANAGEMENT.md).

### 9.3 Pagination via Backend

Semua list pakai server-side pagination via Laravel paginator. Frontend tinggal kirim `page` & `per_page` di query string. Lihat field standar di [07-API-INTEGRATION.md](07-API-INTEGRATION.md).

### 9.4 ProtectedRoute pakai `<Outlet />`

`<ProtectedRoute />` membungkus group route dengan `<Outlet />` (bukan single child). Pattern:

```jsx
<Route element={<ProtectedRoute allowedRoles={['admin']} />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    ...
  </Route>
</Route>
```

Lebih clean dari pattern lama `<ProtectedRoute><AdminLayout /></ProtectedRoute>`.

### 9.5 Image URL Resolver

Banyak entitas (book cover, message attachment) bisa berisi URL absolut atau path relatif. Pattern resolve:

```jsx
const imageUrl = item.cover_photo?.startsWith('http')
  ? item.cover_photo
  : `${API_URL.replace('/api', '')}/storage/covers/${item.cover_photo}`;
```

Di-duplikasi di banyak file — bisa di-extract ke util function jika perlu (saat ini OK karena pattern jelas).

### 9.6 PDF Export Invoice

`html2pdf.js` dipakai di `pages/profile/OrderDetail.jsx` untuk generate invoice PDF dari DOM. Tidak ada server-side PDF gen di project ini.

---

## 10. Diagram Komponen High-Level

```
                ┌──────────────────────────────────────────┐
                │           Browser                        │
                │                                          │
                │   React App (SPA)                        │
                │   ┌──────────────────────────────────┐   │
                │   │ CartProvider (Context)           │   │
                │   │  ┌────────────────────────────┐  │   │
                │   │  │ BrowserRouter              │  │   │
                │   │  │  ┌──────────────────────┐  │  │   │
                │   │  │  │ Routes               │  │  │   │
                │   │  │  │  - PublicLayout      │  │  │   │
                │   │  │  │     ▶ MainCatalog    │  │  │   │
                │   │  │  │     ▶ BookDetail     │  │  │   │
                │   │  │  │     ▶ ChatWidget     │  │  │   │
                │   │  │  │  - ProtectedRoute    │  │  │   │
                │   │  │  │     ▶ AdminLayout    │  │  │   │
                │   │  │  │        ▶ Dashboard   │  │  │   │
                │   │  │  │        ▶ AdminBooks  │  │  │   │
                │   │  │  └──────────────────────┘  │  │   │
                │   │  └────────────────────────────┘  │   │
                │   └──────────────────────────────────┘   │
                │                  │                       │
                │                  │ Axios (Bearer token)  │
                └──────────────────┼───────────────────────┘
                                   │
                                   ▼
                ┌──────────────────────────────────────────┐
                │     Laravel API (port 8000)              │
                └──────────────────────────────────────────┘
                                   │
                                   ▼
                ┌──────────────────────────────────────────┐
                │     Midtrans Snap (sandbox)              │
                │     (loaded via <script>                 │
                │      app.sandbox.midtrans.com/snap.js)   │
                └──────────────────────────────────────────┘
```

---

## 11. Berikutnya

- Mau setup lokal? → [02-SETUP.md](02-SETUP.md)
- Mau tahu detail routing? → [03-ROUTING.md](03-ROUTING.md)
- Mau tahu pola state? → [04-STATE-MANAGEMENT.md](04-STATE-MANAGEMENT.md)
