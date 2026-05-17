# BookSales / PustakaIkhlas — Frontend React

> Single Page Application (SPA) untuk **PustakaIkhlas**, toko buku online Indonesia. Dibangun dengan **React 19**, **Vite 8**, **Tailwind CSS 4**, **React Router 7**, dan terhubung ke backend Laravel via REST API. Mendukung pembayaran **Midtrans Snap** (Sandbox) dengan currency **Rupiah (IDR)**.

Frontend ini menyajikan:
- **Halaman publik**: catalog buku, detail buku, halaman about & contact
- **Auth**: login & register
- **User area**: cart, checkout, profile, riwayat pesanan, chat dengan admin
- **Admin dashboard**: kelola buku, genre, author, transaksi, user, inbox chat

---

## ⚡ Quick Start

```bash
# 1. Install dependency
npm install

# 2. Konfigurasi backend URL (opsional jika backend di port 8000)
cp .env.example .env       # jika ada, atau buat manual
# Edit .env:
# VITE_API_BASE_URL=http://localhost:8000/api

# 3. Jalankan dev server
npm run dev
```

Frontend siap di **http://localhost:5173**.

> Pastikan **backend Laravel sudah jalan** di `http://localhost:8000` sebelum buka frontend. Lihat [`../booksales-api-laravel/README.md`](../booksales-api-laravel/README.md).

### Akun untuk test

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@toko.com` | `adminpass` |
| User | `budi@email.com` | `password123` |
| User | `siti@email.com` | `rahasia321` |

---

## 📚 Dokumentasi Lengkap

Semua dokumentasi mendetail ada di folder [`docs/`](docs/):

| # | Dokumen | Untuk Anda yang ingin... |
|---|---------|--------------------------|
| 01 | [Architecture](docs/01-ARCHITECTURE.md) | Memahami stack, struktur folder, alur boot, dan keputusan desain |
| 02 | [Setup](docs/02-SETUP.md) | Setup lingkungan dev + konfigurasi `.env` + npm scripts |
| 03 | [Routing](docs/03-ROUTING.md) | Tree route lengkap + `ProtectedRoute` + role-based access |
| 04 | [State Management](docs/04-STATE-MANAGEMENT.md) | `CartContext`, `localStorage` strategy, event `authChange` |
| 05 | [Components](docs/05-COMPONENTS.md) | Katalog komponen reusable (Navbar, CartModal, AdminCrudTable, ChatWidget, dll) |
| 06 | [Pages](docs/06-PAGES.md) | Deep-dive tiap halaman (catalog, checkout, profile, admin, dll) |
| 07 | [API Integration](docs/07-API-INTEGRATION.md) | Pola Axios, Bearer token, error handling, pagination |
| 08 | [Design System](docs/08-DESIGN-SYSTEM.md) | Design tokens (warna Rausch, typography scale, radius, shadow) |
| 09 | [Midtrans Snap Flow](docs/09-MIDTRANS-SNAP-FLOW.md) | Step-by-step integrasi Snap di frontend (script load, callback handlers) |
| 10 | [Chat Widget](docs/10-CHAT-WIDGET.md) | Polling 5s, notifikasi unread, transaction picker, attachment upload |
| 11 | [Troubleshooting](docs/11-TROUBLESHOOTING.md) | Masalah umum + cara debug |

---

## 🛠️ NPM Scripts

```bash
npm run dev        # Vite dev server (HMR) @ http://localhost:5173
npm run build      # Production build → dist/
npm run preview    # Preview production build secara lokal
npm run lint       # Run ESLint
```

---

## 🗺️ Route Cheat-sheet

| Path | Layout | Auth | Tujuan |
|------|--------|------|--------|
| `/` | Public | — | Catalog buku |
| `/books/:id` | Public | — | Detail buku |
| `/about`, `/contact` | Public | — | Halaman statis |
| `/login`, `/register` | Public | — | Auth |
| `/profile` | Public | `user` | Profil + riwayat pesanan |
| `/profile/orders/:id` | Public | `user` | Detail order |
| `/profile/edit` | Public | `user` | Edit profil & password |
| `/checkout` | Public | `user` | Checkout (dari cart) |
| `/admin` | Admin | `admin` | Dashboard |
| `/admin/users`, `/authors`, `/genres`, `/books`, `/transactions`, `/contacts` | Admin | `admin` | Kelola resource |

Cart sendiri pakai modal (tidak ada route khusus, dibuka via icon di navbar). Cart standalone page ada di `/cart` tapi flow utama via modal.

Detail lengkap: [docs/03-ROUTING.md](docs/03-ROUTING.md).

---

## 🎨 Design System Singkat

- **Primary color**: `#ff385c` (Rausch — terinspirasi Airbnb)
- **Font**: Inter (loaded dari Google Fonts)
- **Spacing unit**: 4px base
- **Border radius**: 8px (`rounded-sm`), 14px (`rounded-md`), 20px (`rounded-lg`)
- **Icons**: Lucide React (jangan campur dengan icon library lain)
- **Currency format**: `Rp` + `id-ID` locale (mis. `Rp 100.000`)

Lihat token lengkap: [`src/index.css`](src/index.css) atau [docs/08-DESIGN-SYSTEM.md](docs/08-DESIGN-SYSTEM.md).

---

## 🏗️ Arsitektur Singkat

```
src/
├── App.jsx                 ← Routes utama (BrowserRouter + Routes)
├── main.jsx                ← React entry point
├── index.css               ← Tailwind + design tokens (CSS custom properties)
├── context/
│   └── CartContext.jsx     ← Cart state (per-user localStorage)
├── layouts/
│   ├── public.jsx          ← Wrapper untuk halaman publik + cart modal + chat widget
│   └── admin.jsx           ← Wrapper untuk admin dashboard (sidebar + content)
├── components/             ← Reusable UI components
├── hooks/
│   └── useCountdown.js     ← Hook custom (untuk pending order countdown)
└── pages/
    ├── auth/
    ├── public/             ← Catalog, BookDetail, Cart, Checkout, About, Contact
    ├── profile/            ← Profile, OrderDetail, EditProfile
    └── admin/              ← Dashboard, books, genres, authors, transactions, users, contacts
```

Detail: [docs/01-ARCHITECTURE.md](docs/01-ARCHITECTURE.md).

---

## 🚦 Aturan Project (untuk Developer)

1. **Currency** selalu IDR — pakai `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })`
2. **Auth** disimpan di `localStorage` dengan keys: `token`, `user_id`, `user_name`, `user_role`
3. **HTTP** pakai **Axios** (jangan campur dengan `fetch` kecuali file sudah pakai itu)
4. **State** pakai **React Context API** (jangan tambah Redux/Zustand)
5. **Styling** pakai **Tailwind CSS 4** (jangan tambah CSS-in-JS library)
6. **Icons** pakai **Lucide React** only
7. **Roles**: hanya `'admin'` dan `'user'`
8. **Transaction status** persis: `pending`, `dibayar`, `dikirim`, `selesai`, `dibatalkan`

Detail lebih lengkap: [`../CLAUDE.md`](../CLAUDE.md) di root project.

---

## 🔗 Repo Backend

Backend Laravel-nya ada di folder kakak: **`../booksales-api-laravel/`**.
Lihat [`../booksales-api-laravel/README.md`](../booksales-api-laravel/README.md) untuk setup-nya.

---

## 📜 Lisensi

Internal project — tidak open source.
