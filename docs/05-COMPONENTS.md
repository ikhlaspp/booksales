# 05 — Components Catalog (Frontend)

> Katalog komponen reusable di `src/components/`. Setiap entry punya: tujuan, props, contoh pakai, dan catatan implementasi.

---

## Index

### Layout & Navigation
- [Navbar](#navbar)
- [Footer](#footer)
- [ProtectedRoute](#protectedroute)

### Modal & Overlay
- [CartModal](#cartmodal)
- [DeleteModal](#deletemodal)
- [ConfirmModal](#confirmmodal)

### Chat
- [ChatWidget](#chatwidget)

### Admin Reusable
- [AdminCrudTable](#admincrudtable)
- [AdminCrudForm](#admincrudform)

---

## Navbar

**File:** [`src/components/navbar.jsx`](../src/components/navbar.jsx)

Sticky header utama untuk public layout. Berisi: logo, nav links, cart icon (dengan badge count), avatar/dropdown user.

### Props
None — semua state internal.

### State internal
- `isMobileOpen`, `isDropdownOpen`, `isCartOpen` — UI flags
- Reads `localStorage.token`, `user_role`, `user_name`
- Uses `useCart()` untuk `cartCount`

### Behavior
- Sticky top dengan `bg-canvas/80 backdrop-blur-lg` (glassmorphism)
- Click outside menutup dropdown (via `useEffect` + `addEventListener('mousedown')`)
- Route change menutup semua menu
- Logout: clear localStorage + navigate ke `/login`
- Cart icon hanya muncul kalau logged in
- Cart icon click → `setIsCartOpen(true)` → buka `<CartModal />`

### Catatan
- Mobile responsive: avatar dropdown di mobile expanded full-width
- Active link highlight via `isActive(href)` helper

---

## Footer

**File:** [`src/components/footer.jsx`](../src/components/footer.jsx)

Static footer di bottom semua public pages. Berisi: brand info, link kategori, kontak, copyright.

### Props
None.

### Catatan
- Hanya muncul di `PublicLayout`, TIDAK di `AdminLayout`
- Tidak ada logic dinamis — pure presentational

---

## ProtectedRoute

**File:** [`src/components/ProtectedRoute.jsx`](../src/components/ProtectedRoute.jsx)

Route guard yang cek auth & role.

### Props
| Prop | Tipe | Required | Deskripsi |
|------|------|----------|-----------|
| `allowedRoles` | `string[]` | Opsional | Array role yang boleh akses, mis. `['admin']`. Kalau kosong/undefined, asal logged-in OK. |
| `children` | ReactNode | Opsional | Jika dipakai untuk wrap single component (bukan group route) |

### Contoh
```jsx
// Wrap group (RECOMMENDED)
<Route element={<ProtectedRoute allowedRoles={['admin']} />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Dashboard />} />
  </Route>
</Route>

// Wrap single
<Route path="/secret" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <SecretPage />
  </ProtectedRoute>
} />
```

Detail logic: [03-ROUTING.md](03-ROUTING.md#3-protectedroute-implementation).

---

## CartModal

**File:** [`src/components/CartModal.jsx`](../src/components/CartModal.jsx)

Modal yang muncul saat user klik cart icon di Navbar. Berisi: list cart items, qty controls, subtotal, tombol checkout.

### Props
| Prop | Tipe | Required | Deskripsi |
|------|------|----------|-----------|
| `isOpen` | boolean | ✅ | Apakah modal terbuka |
| `onClose` | `() => void` | ✅ | Handler tutup modal |

### State internal
- Pakai `useCart()` untuk akses items, quantity, total, dan operations

### Behavior
- Background overlay click → close
- Klik tombol checkout → close modal + `navigate('/checkout')`
- Empty state: tampilkan ilustrasi + tombol "Mulai Belanja"

### Contoh pakai (di Navbar)
```jsx
const [isCartOpen, setIsCartOpen] = useState(false);

<button onClick={() => setIsCartOpen(true)}>Cart</button>
<CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
```

---

## DeleteModal

**File:** [`src/components/DeleteModal.jsx`](../src/components/DeleteModal.jsx)

Confirmation modal untuk delete action. Dipakai di semua admin CRUD via `AdminCrudTable`.

### Props
| Prop | Tipe | Required | Deskripsi |
|------|------|----------|-----------|
| `isOpen` | boolean | ✅ | Apakah modal terbuka |
| `isLoading` | boolean | Opsional | Disable tombol & tampilkan spinner saat delete in-progress |
| `onClose` | `() => void` | ✅ | Handler tutup |
| `onConfirm` | `() => void` | ✅ | Handler delete (called saat klik confirm) |
| `message` | string | Opsional | Custom message, default "Apakah Anda yakin ingin menghapus item ini?" |

### Contoh
```jsx
const [isOpen, setIsOpen] = useState(false);

<DeleteModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={async () => {
    await axios.delete(URL);
    setIsOpen(false);
  }}
  message={`Hapus buku "${item.title}"?`}
/>
```

### Catatan
- Tombol konfirmasi pakai warna `bg-rausch` (red) untuk emphasize destructive action
- Loading state mencegah double-click

---

## ConfirmModal

**File:** [`src/components/ConfirmModal.jsx`](../src/components/ConfirmModal.jsx)

Generic confirmation modal — mirip DeleteModal tapi untuk action non-destructive (mis. konfirmasi pembayaran di Checkout).

### Props
| Prop | Tipe | Required | Deskripsi |
|------|------|----------|-----------|
| `isOpen` | boolean | ✅ | |
| `isLoading` | boolean | Opsional | |
| `onClose` | `() => void` | ✅ | |
| `onConfirm` | `() => void` | ✅ | |
| `title` | string | Opsional | Heading modal |
| `message` | string | Opsional | Body message |

### Contoh (di Checkout)
```jsx
<ConfirmModal
  isOpen={isConfirmOpen}
  onClose={() => setIsConfirmOpen(false)}
  onConfirm={() => {
    setIsConfirmOpen(false);
    handlePayment();
  }}
  isLoading={isProcessing}
  title="Konfirmasi Pembayaran"
  message={`Total yang akan dibayar: ${formatRupiah(grandTotal)}. Lanjutkan?`}
/>
```

---

## ChatWidget

**File:** [`src/components/ChatWidget.jsx`](../src/components/ChatWidget.jsx)

Floating chat widget di kanan-bawah halaman publik. Hanya muncul untuk role `user`. Polling backend tiap 5 detik untuk pesan baru.

### Props
None — internal state only.

### State internal
- `open` — Panel chat terbuka/tertutup
- `conversationId`, `messages`, `lastId` — data percakapan
- `text` — Input text
- `unreadCount` — Badge angka di icon
- `notification` — Toast notif saat ada pesan baru
- `userTransactions` — List untuk transaction picker
- `showTxPicker` — Apakah picker terbuka

### Behavior

1. **Mount:**
   - GET `/api/conversations` → load conversation + messages
   - GET `/api/user/transactions` → load list untuk transaction picker

2. **Polling (setiap 5 detik):**
   - GET `/api/conversations/messages?after={lastId}`
   - Append messages baru
   - Update `unreadCount` kalau ada admin message baru
   - Tampilkan toast notification kalau panel tertutup

3. **Mark as read:**
   - Saat panel dibuka (`open === true`) → PUT `/api/conversations/read`
   - Reset `unreadCount` dan `notification`

4. **Send text:**
   - POST `/api/conversations/messages` body `{ type: 'text', body: '...' }`

5. **Send image:**
   - POST multipart/form-data: `type: 'image'`, `attachment: <File>`

6. **Send transaction reference:**
   - Buka transaction picker → user pilih tx
   - POST `{ type: 'transaction', transaction_id: <id> }`

### Catatan
- TIDAK render jika `!token` atau `role !== 'user'` (admin pakai inbox `/admin/contacts`)
- Lebih lengkap: [10-CHAT-WIDGET.md](10-CHAT-WIDGET.md)

---

## AdminCrudTable

**File:** [`src/components/admin/AdminCrudTable.jsx`](../src/components/admin/AdminCrudTable.jsx)

Reusable table untuk SEMUA admin list pages (Books, Genres, Authors, Users, Transactions). Highly configurable via props.

### Props lengkap

| Prop | Tipe | Required | Deskripsi |
|------|------|----------|-----------|
| `title` | string | ✅ | Heading utama |
| `subtitle` | string | Opsional | Deskripsi kecil di bawah title |
| `addLink` | string | Opsional | URL untuk tombol "Tambah" (gunakan ini ATAU `onAddClick`) |
| `addLabel` | string | Opsional | Label tombol add, default `"Tambah"` |
| `onAddClick` | `() => void` | Opsional | Handler tombol add (gunakan ini untuk modal form) |
| `columns` | `Array<{key, label, align?, render?}>` | ✅ | Definisi kolom |
| `data` | `Array<object>` | ✅ | Rows untuk halaman aktif |
| `searchValue` | string | Opsional | Value search input |
| `onSearchChange` | `(val) => void` | Opsional | Handler search input |
| `searchPlaceholder` | string | Opsional | Placeholder default `"Cari..."` |
| `filters` | `Array<{value, options, onChange}>` | Opsional | Dropdown filter tambahan |
| `pagination` | `{currentPage, totalPages, from, to, total}` | Opsional | Info pagination |
| `onPageChange` | `(page) => void` | Opsional | Handler navigasi halaman |
| `editLink` | `(item) => string` | Opsional | Builds URL edit page |
| `onEditClick` | `(item) => void` | Opsional | Handler edit (untuk modal form) |
| `onViewClick` | `(item) => void` | Opsional | Handler "Detail" button |
| `onDelete` | `(item) => Promise<void>` | Opsional | Handler delete (akan trigger DeleteModal) |
| `deleteMessage` | `(item) => string` | Opsional | Custom message untuk modal delete |
| `actions` | `(item) => ReactNode` | Opsional | Override default edit/delete buttons |
| `emptyLabel` | string | Opsional | Empty state title |
| `emptySubLabel` | string | Opsional | Empty state subtitle |

### Definisi `columns`

```js
const columns = [
  {
    key: 'title',
    label: 'Judul',
    align: 'left',       // 'left' | 'center' | 'right' (default 'left')
    render: (item) => (  // optional custom render
      <div className="flex items-center gap-3">
        <img src={item.cover_photo} className="w-10 h-14" />
        <span className="font-bold">{item.title}</span>
      </div>
    ),
  },
  { key: 'author', label: 'Penulis', render: (item) => item.author?.name || '-' },
  { key: 'price', label: 'Harga', render: (item) => formatRupiah(item.price) },
];
```

Tanpa `render`, field diambil langsung via `item[col.key]`.

### Contoh lengkap (dari `pages/admin/books/index.jsx`)

```jsx
<AdminCrudTable
  title="Kelola Buku"
  subtitle="Daftar buku yang tersedia di sistem."
  onAddClick={handleAddClick}
  addLabel="Tambah Buku"
  columns={columns}
  data={books}
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  searchPlaceholder="Cari judul buku..."
  filters={[
    {
      value: genreFilter,
      onChange: (val) => { setGenreFilter(val); setCurrentPage(1); },
      options: genreFilterOptions,
    },
  ]}
  pagination={{ currentPage, totalPages, from, to, total }}
  onPageChange={setCurrentPage}
  onEditClick={handleEditClick}
  onDelete={handleDelete}
  deleteMessage={(item) => `Hapus buku "${item.title}"?`}
  emptyLabel="Buku tidak ditemukan"
  emptySubLabel="Coba kata kunci lain."
/>
```

### Features built-in
- Search input dengan icon
- Filter dropdowns (multi-filter support)
- Auto pagination buttons (dengan ellipsis untuk page > 5)
- Auto integrated `DeleteModal`
- Auto empty state dengan ilustrasi
- Responsive (horizontal scroll table di mobile)

### Catatan
- Jika `onDelete` di-omit → tidak tampilkan tombol Delete
- Jika `editLink` & `onEditClick` keduanya di-omit → tidak tampilkan tombol Edit
- Bisa fully custom via `actions={(item) => <CustomButtons />}` (override default buttons)

---

## AdminCrudForm

**File:** [`src/components/admin/AdminCrudForm.jsx`](../src/components/admin/AdminCrudForm.jsx)

Reusable form modal/page untuk create & edit di admin. Lebih jarang dipakai langsung — sebagian besar admin page punya `Form.jsx` masing-masing yang custom.

### Catatan
- Dipakai sebagai base untuk pages/admin/<feature>/Form.jsx
- Cek source file untuk pattern lengkap (input field, validation, submit handler)

---

## Pattern Komponen di Pages

Selain `components/` shared, pages folder punya sub-component lokal:

| Page | Local component |
|------|----------------|
| `pages/admin/transactions/index.jsx` | `DetailModal.jsx` — Modal detail transaksi dengan items |
| `pages/admin/transactions/Form.jsx` | (Modal untuk update status) |
| `pages/public/index.jsx` | `BookCard`, `BookCardSkeleton`, `EmptyState`, `ErrorBanner`, `CategoryTab` |
| `pages/public/checkout/index.jsx` | `Toast`, `AddressModal` |
| `pages/profile/index.jsx` | `PendingCountdownBadge`, `OrdersTable` |
| `pages/admin/contacts/index.jsx` | `MessageBubble`, `Avatar` |
| `components/ChatWidget.jsx` | `TransactionCard`, `MessageBubble` |

Pattern: local component cuma dipakai di file itu, jadi tidak perlu di-extract ke `components/`. Kalau dipakai 2+ file → pertimbangkan extract.

---

## Conventions

### 1. Naming

- File component pakai PascalCase atau camelCase: `Navbar.jsx`, `navbar.jsx` (tidak konsisten di codebase — mostly lowercase untuk single-word, PascalCase untuk multi)
- Component name **always** PascalCase: `function Navbar()`
- Export default untuk single main component

### 2. Component anatomy

```jsx
// 1. Imports
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'lucide-react';

// 2. Constants
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// 3. Helper functions
const formatRupiah = (n) => `Rp ${n.toLocaleString('id-ID')}`;

// 4. Local sub-components (jika perlu)
function SubComponent({ data }) { return <div>...</div>; }

// 5. Main component
export default function MainComponent({ prop1, prop2 }) {
  const [state, setState] = useState(...);

  useEffect(() => {
    // ...
  }, [...]);

  return (
    <div className="...">
      ...
    </div>
  );
}
```

### 3. Styling

- Tailwind utility classes inline di JSX
- Custom CSS variables (`var(--color-rausch)`) untuk dinamis
- TIDAK pakai CSS modules atau CSS-in-JS
- Animasi pakai `transition-*` Tailwind atau `@keyframes` di `index.css`

### 4. Event handlers

- Inline arrow: `onClick={() => doSomething(item.id)}`
- Atau named function untuk yang kompleks: `onClick={handleSubmit}`

### 5. Conditional rendering

```jsx
{loading && <Spinner />}
{!loading && error && <ErrorState />}
{!loading && !error && data.length > 0 && (
  <List items={data} />
)}
{!loading && !error && data.length === 0 && <EmptyState />}
```

---

## Berikutnya

- Mau tahu detail tiap halaman? → [06-PAGES.md](06-PAGES.md)
- Mau tahu pola API call? → [07-API-INTEGRATION.md](07-API-INTEGRATION.md)
