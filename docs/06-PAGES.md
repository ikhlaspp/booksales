# 06 — Pages (Frontend)

> Deep-dive tiap halaman: tujuan, state, fetch yang dilakukan, fitur utama, dan alur user interaction.

---

## Index Halaman

### Auth
- [Login](#login)
- [Register](#register)

### Public
- [MainCatalog](#maincatalog)
- [BookDetail](#bookdetail)
- [About & Contact](#about--contact)

### Cart & Checkout
- [Cart](#cart)
- [Checkout](#checkout)

### User (Protected)
- [Profile](#profile)
- [OrderDetail](#orderdetail)
- [EditProfile](#editprofile)

### Admin (Protected)
- [AdminDashboard](#admindashboard)
- [AdminBooks](#adminbooks)
- [AdminGenres / AdminAuthors](#admingenres--adminauthors)
- [AdminTransactions](#admintransactions)
- [AdminUsers](#adminusers)
- [AdminContacts](#admincontacts-inbox-chat)

---

## Login

**File:** [`src/pages/auth/login.jsx`](../src/pages/auth/login.jsx)

### Tujuan
Autentikasi user. Setelah sukses → redirect ke `/admin` (admin) atau `/profile` (user).

### Form fields
- `email` (required, email format)
- `password` (required, with show/hide toggle)

### Flow
1. Submit form → POST `/api/login`
2. Backend return `{ access_token, user, role }`
3. Save ke localStorage: `token`, `user_id`, `user_name`, `user_role`
4. Dispatch `authChange` event (→ CartContext reload)
5. Determine redirect:
   - `admin` → `/admin`
   - `user`/`customer` → `/profile`
6. Honor `location.state.from` (redirect-back setelah login dari protected route)

### Catatan
- Pakai `fetch()` (bukan axios) — satu-satunya page yang inkonsisten. Bisa di-refactor ke axios untuk konsistensi.
- Show error message dari `location.state.message` (mis. "Silakan login dulu" dari Cart)

---

## Register

**File:** [`src/pages/auth/register.jsx`](../src/pages/auth/register.jsx)

### Tujuan
Daftar user baru. Auto-set role `user`.

### Form fields
- `name`, `email`, `password`, (mungkin `password_confirmation`)

### Flow
1. POST `/api/register`
2. Backend return token + user
3. Save ke localStorage
4. Redirect ke `/profile`

---

## MainCatalog

**File:** [`src/pages/public/index.jsx`](../src/pages/public/index.jsx)

### Tujuan
Halaman utama. Browse buku dengan:
- Hero section dengan tagline
- Search pill bar (cari title/author/genre)
- Category strip (horizontal scrollable, klik filter by genre)
- Grid buku dengan pagination
- Skeleton loader saat fetch

### State internal
- `books[]`, `genres[]`
- `searchQuery` (input), `activeSearch` (debounced/submitted)
- `selectedGenre` (id atau null)
- `currentPage`, `lastPage`, `totalItems`
- `isLoading`, `error`

### Fetch
- GET `/api/genres` saat mount (untuk category strip)
- GET `/api/catalog?search=&genre_id=&page=&per_page=12` saat state berubah

### Sub-components (lokal)
- `BookCard` — card untuk satu buku (cover, title, author, harga)
- `BookCardSkeleton` — shimmer placeholder
- `CategoryTab` — tab untuk genre filter
- `EmptyState` — saat tidak ada hasil
- `ErrorBanner` — saat error dengan retry button

### Fitur khusus
- Genre icons mapping: `getGenreIcon('Fiksi') → BookOpen icon`. Hardcoded list di `GENRE_ICONS` const baris 19–35.
- Search trigger: Enter di input atau klik tombol search orb
- Clear search: Escape atau klik X
- Reset filter: tombol di empty state

### Catatan
- `per_page` hardcoded 12 (sesuaikan dengan grid 4 col × 3 rows)
- Animation fade-in-up untuk book cards saat load

---

## BookDetail

**File:** [`src/pages/public/BookDetail.jsx`](../src/pages/public/BookDetail.jsx)

### Tujuan
Halaman detail satu buku. Berisi: cover besar, info lengkap, tombol add to cart.

### Path
`/books/:id`

### Fetch
- GET `/api/books/{id}` saat mount
- Mungkin juga GET related books (cek file untuk detail)

### Behavior
- Tombol "Add to Cart" → `addToCart(book, 1)` via `useCart()`
- Quantity selector (opsional)
- Out of stock state (jika `book.stock === 0`)

---

## About & Contact

**File:** [`src/pages/public/about.jsx`](../src/pages/public/about.jsx), [`src/pages/public/contact.jsx`](../src/pages/public/contact.jsx)

### About
Halaman statis: misi, vision, team info, dll.

### Contact
Form yang submit ke POST `/api/contact`:
- `name`, `email`, `subject`, `message`

Tidak butuh auth.

---

## Cart

**File:** [`src/pages/public/cart/index.jsx`](../src/pages/public/cart/index.jsx)

### Tujuan
Halaman standalone cart (alternatif dari modal).

### Note
Saat ini tidak terdaftar di `App.jsx` — UI utama via `CartModal`. Tetap ada untuk future use.

### Konten
- List items
- Subtotal, "Biaya Layanan: Gratis", Total
- Tombol Checkout (cek auth dulu, redirect login kalau belum)

---

## Checkout

**File:** [`src/pages/public/checkout/index.jsx`](../src/pages/public/checkout/index.jsx)

### Tujuan
Halaman checkout dengan alamat pengiriman, ringkasan pesanan, dan integrasi Midtrans Snap.

### State internal
- `user` (dari GET `/api/user`)
- `savedAddress` ({street, city, postalCode})
- `cartItems` (dari `useCart()`)
- `isProcessing`, `isLoadingUser`, `isAddressModalOpen`, `isConfirmOpen`
- `toast` (untuk notifikasi sukses/error)
- `snapLoaded`, `snapActive` (ref untuk Snap.js state)

### Fetch
- GET `/api/user` untuk dapat profile + alamat
- Load script `https://app.sandbox.midtrans.com/snap/snap.js` sekali di useEffect

### Flow

```
1. User buka /checkout (sudah punya items di cart)
2. Frontend GET /api/user → ambil profile
3. Jika ada address di profile → auto-set savedAddress
4. Jika belum → tampilkan modal "Tambah Alamat"
5. User isi alamat → onSave:
   a. PUT /api/user/profile untuk save ke server
   b. setSavedAddress untuk update UI
6. User klik "Bayar Sekarang"
7. ConfirmModal muncul → user konfirmasi
8. handlePayment:
   a. POST /api/transactions { items, shipping_address, city, postal_code }
   b. Backend return { snap_token, client_key, transaction }
   c. window.snap.pay(snap_token, { onSuccess, onPending, onError, onClose })
9. Snap popup muncul, user bayar
10. Callback:
    - onSuccess → PUT /api/transactions/{id} { status: 'dibayar' } → navigate /profile/orders/{id}
    - onPending → navigate /profile, clear cart
    - onError → show toast error
    - onClose → navigate /profile (user batalkan)
```

### Sub-components
- `Toast` — notifikasi auto-dismiss 8 detik
- `AddressModal` — form alamat

### Cost breakdown UI
- Subtotal (dari cart)
- Pajak 11% (`cartTotal * 0.11`)
- Ongkos kirim `Rp 10.000`
- Total = sum semua

> **Catatan:** Frontend hitung sendiri untuk display, tapi backend recalculate untuk security. Kalau ada selisih, source of truth = backend.

### Detail lengkap Midtrans integration: [09-MIDTRANS-SNAP-FLOW.md](09-MIDTRANS-SNAP-FLOW.md)

---

## Profile

**File:** [`src/pages/profile/index.jsx`](../src/pages/profile/index.jsx)

### Tujuan
Dashboard user: info akun + riwayat pesanan dengan search/filter/pagination.

### State internal
- `user` (dari GET `/api/user`)
- `successBanner` (dari `location.state.checkoutSuccess`)
- `OrdersTable` punya state sendiri (search, status filter, pagination, transactions)

### Fetch
- GET `/api/user` untuk profile
- `OrdersTable`: GET `/api/user/transactions?page=&search=&status=`

### Sections

#### Sidebar kiri (1/3 width)
- Avatar (generated dari name)
- Nama + email
- Tombol "Edit Profil" → `/profile/edit`
- Info bergabung sejak
- Alamat pengiriman (atau "Belum ada alamat")

#### Konten kanan (2/3 width)
- Heading "Pesanan Saya"
- `OrdersTable` component:
  - Search bar (debounce 400ms)
  - Status tabs (Semua | Pending | Dibayar | Dikirim | Selesai | Dibatalkan)
  - Table responsive
  - Pagination dengan ellipsis (max 7 button visible)

### Special: PendingCountdownBadge

Untuk order dengan `status === 'pending'`, tampilkan badge dengan countdown MM:SS dari `created_at + 1 jam`.

```jsx
const expiresAt = new Date(createdAt).getTime() + 60 * 60 * 1000;
const { minutes, seconds, isExpired } = useCountdown(expiresAt);
```

Saat expired → PUT `/api/transactions/{id}` `{ status: 'dibatalkan' }` + callback `onExpire` untuk update parent state.

> **Catatan:** Backend punya cron job yang juga handle ini setiap menit. Frontend update untuk UX instant tanpa nunggu refresh.

### Success banner
Saat redirect dari checkout sukses (`location.state.checkoutSuccess`), banner hijau muncul: "Pembayaran berhasil! Pesanan XYZ sedang diproses."

---

## OrderDetail

**File:** [`src/pages/profile/OrderDetail.jsx`](../src/pages/profile/OrderDetail.jsx)

### Tujuan
Detail satu transaksi: items, alamat, total, status, dan opsi download invoice PDF.

### Path
`/profile/orders/:id`

### Fetch
- GET `/api/transactions/{id}`

### Fitur
- Header dengan order number, status badge, tanggal
- List items (cover, title, qty, harga)
- Cost breakdown (subtotal, tax, shipping, total)
- Alamat pengiriman
- **Download invoice PDF** (via `html2pdf.js`)
- Back to profile button

### PDF Export
Pakai library `html2pdf.js`:
```jsx
import html2pdf from 'html2pdf.js';

const exportPDF = () => {
  const element = document.getElementById('invoice');
  html2pdf().from(element).save(`invoice-${orderNumber}.pdf`);
};
```

> Catatan: html2pdf.js generates PDF from HTML — quality OK tapi tidak pixel-perfect. Untuk production-grade invoice, pertimbangkan server-side PDF (mis. via Laravel DOMPDF).

---

## EditProfile

**File:** [`src/pages/profile/EditProfile.jsx`](../src/pages/profile/EditProfile.jsx)

### Tujuan
Edit info user: nama, email, alamat. Ganti password juga di sini.

### Sections (umumnya)
1. **Info Akun** — form name, email
2. **Alamat** — form address, city, postal_code
3. **Ubah Password** — current_password, new_password, new_password_confirmation

### Fetch
- PUT `/api/user/profile` untuk update profile fields
- PUT `/api/user/password` untuk ganti password

### Validasi
- Frontend: required fields, email format, password min length
- Backend: ulang validate (defense in depth)

---

## AdminDashboard

**File:** [`src/pages/admin/index.jsx`](../src/pages/admin/index.jsx)

### Tujuan
Stats overview untuk admin.

### Fetch
- GET `/api/dashboard`

### Sections
1. **4 stats card** di atas:
   - Total Users
   - Total Books
   - Total Transactions
   - Revenue (dari status `selesai`)

2. **Chart "Tren Buku Terbeli"** (area chart pakai Recharts):
   - Data: 6 bulan terakhir
   - X axis: nama bulan
   - Y axis: jumlah transaksi
   - Stroke + fill warna Rausch

3. **Table "Transaksi Terbaru"** — 5 transaksi terakhir dengan:
   - ID Transaksi (order_number)
   - Pelanggan
   - Buku
   - Tanggal (formatted)
   - Jumlah (formatted Rupiah)
   - Status (capitalize)
   - Link "Lihat Semua" → `/admin/transactions`

### Catatan
- Pakai `recharts` library
- Loading state: spinner Rausch di tengah halaman

---

## AdminBooks

**File:** [`src/pages/admin/books/index.jsx`](../src/pages/admin/books/index.jsx)

### Tujuan
CRUD buku.

### Fetch
- GET `/api/genres` (untuk filter dropdown)
- GET `/api/books?search=&genre_id=&page=&per_page=10` (dengan debounce 300ms)

### Sub-components
- `BookFormModal` ([`Form.jsx`](../src/pages/admin/books/Form.jsx)) — Modal untuk create & edit

### UI: Pakai `AdminCrudTable`
```jsx
<AdminCrudTable
  title="Kelola Buku"
  onAddClick={handleAddClick}
  columns={[
    { key: 'title',  render: (item) => <CoverPlusTitle item={item} /> },
    { key: 'author', render: (item) => item.author?.name || '-' },
    { key: 'genre',  render: (item) => item.genre?.name || '-' },
    { key: 'price',  render: (item) => formatRupiah(item.price) },
  ]}
  data={books}
  pagination={{ ... }}
  filters={[{ value: genreFilter, options: ..., onChange: ... }]}
  onEditClick={handleEditClick}
  onDelete={handleDelete}
/>
<BookFormModal isOpen={...} book={selectedBook} ... />
```

### Form fields (di Form.jsx)
- title, description, price, stock, cover_photo, genre_id, author_id

Submit POST/PUT `/api/books` dengan Bearer token.

---

## AdminGenres / AdminAuthors

**Files:**
- [`src/pages/admin/genres/index.jsx`](../src/pages/admin/genres/index.jsx)
- [`src/pages/admin/genres/Form.jsx`](../src/pages/admin/genres/Form.jsx)
- [`src/pages/admin/authors/index.jsx`](../src/pages/admin/authors/index.jsx)
- [`src/pages/admin/authors/Form.jsx`](../src/pages/admin/authors/Form.jsx)

Pola identik dengan AdminBooks — pakai `AdminCrudTable` + modal `Form.jsx`. Fields lebih simple (genre: name + description, author: name + photo + bio).

---

## AdminTransactions

**File:** [`src/pages/admin/transactions/index.jsx`](../src/pages/admin/transactions/index.jsx)

### Tujuan
List semua transaksi (admin view). Update status order.

### Fetch
- GET `/api/transactions?search=&status=&page=&per_page=15`

### Sub-components
- `DetailModal` ([`DetailModal.jsx`](../src/pages/admin/transactions/DetailModal.jsx)) — Modal detail transaksi (items, customer, alamat, dll)
- `Form` ([`Form.jsx`](../src/pages/admin/transactions/Form.jsx)) — Modal/form untuk update status (mis. set ke `dikirim`/`selesai`)

### UI
Pakai `AdminCrudTable` dengan filter status dropdown:
```jsx
filters={[{
  options: [
    { value: '', label: 'Semua Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'dibayar', label: 'Dibayar' },
    { value: 'dikirim', label: 'Dikirim' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'dibatalkan', label: 'Dibatalkan' },
  ],
  ...
}]}
```

Action button khusus: "Detail" (buka DetailModal) dan "Update Status" (buka Form).

---

## AdminUsers

**File:** [`src/pages/admin/users/index.jsx`](../src/pages/admin/users/index.jsx)

### Tujuan
List semua user (read-only). Search by name/email, filter by role.

### Fetch
- GET `/api/users?search=&role=&page=&per_page=15`

### UI
Pakai `AdminCrudTable` tanpa edit/delete (read-only). Bisa ditambah action ban/promote jika backend implement endpoint-nya.

---

## AdminContacts (Inbox Chat)

**File:** [`src/pages/admin/contacts/index.jsx`](../src/pages/admin/contacts/index.jsx)

### Tujuan
Inbox chat admin — komunikasi dengan user.

### Layout 2-panel

#### Sidebar kiri (w-72)
- Header dengan total unread badge
- Search input (cari nama user)
- List user (dengan conversation indicator + unread badge)
- Pagination "Lihat N pengguna lainnya"

#### Panel kanan (flex-1)
- Header dengan nama + email user
- List pesan (auto-scroll ke bottom)
- Form input pesan + tombol attach + tombol send

### Fetch
- GET `/api/users?role=user&per_page=100` (untuk list semua user)
- GET `/api/admin/conversations` (poll setiap 5 detik untuk inbox refresh)
- GET `/api/admin/conversations/{id}` (saat klik user)
- POST `/api/admin/conversations/{id}/messages` (kirim balasan)
- PUT `/api/admin/conversations/{id}/read` (mark as read saat buka)

### Behavior

#### Merged list (users + conversations)
```jsx
const mergedList = users.map(u => ({
  userId: u.id,
  userName: u.name,
  userEmail: u.email,
  conv: convByUserId[u.id] ?? null,
})).sort(byLastMessageThenAlphabetical);
```

Tampilkan SEMUA user terdaftar (bukan hanya yang punya conversation). User yang belum chat tampil dengan label "Belum memulai percakapan".

#### Send message
3 tipe: text (default), image (via paperclip), transaction (admin tidak punya picker di sini, hanya bisa text & image).

#### Auto-poll
Inbox sidebar refresh tiap 5 detik untuk update unread count & last message. Selected conversation messages tidak auto-poll — refresh manual saat klik user lagi.

---

## Pola Umum Page

### 1. Structure

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export default function MyPage() {
  // 1. State
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Side effects
  useEffect(() => {
    fetchData();
  }, [deps]);

  // 3. Handlers
  const handleAction = async () => { ... };

  // 4. Early returns (loading, error, empty)
  if (isLoading) return <Spinner />;
  if (!data) return null;

  // 5. Render
  return <div className="...">{...}</div>;
}
```

### 2. Loading states

Sebagian besar page pakai spinner inline:
```jsx
<div className="w-8 h-8 border-4 border-hairline border-t-rausch rounded-full animate-spin"></div>
```

Catalog page pakai skeleton shimmer (lebih polished).

### 3. Error states

Pattern: tampilkan `ErrorBanner` dengan retry button.

### 4. Empty states

Always provide friendly empty state dengan ilustrasi + action button.

---

## Berikutnya

- Mau tahu pola API call? → [07-API-INTEGRATION.md](07-API-INTEGRATION.md)
- Mau tahu design tokens? → [08-DESIGN-SYSTEM.md](08-DESIGN-SYSTEM.md)
- Detail Midtrans? → [09-MIDTRANS-SNAP-FLOW.md](09-MIDTRANS-SNAP-FLOW.md)
- Detail chat widget? → [10-CHAT-WIDGET.md](10-CHAT-WIDGET.md)
