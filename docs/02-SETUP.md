# 02 — Setup (Frontend)

> Panduan lengkap setup frontend React BookSales di mesin lokal.

---

## 1. Prasyarat

| Tool | Versi minimum | Cek dengan |
|------|---------------|-----------|
| **Node.js** | 20+ (LTS) | `node -v` |
| **npm** | 10+ | `npm -v` |
| **Git** | any | `git --version` |

Saya rekomendasi pakai [nvm](https://github.com/nvm-sh/nvm) (atau nvm-windows) untuk manage versi Node:

```bash
nvm install 20
nvm use 20
```

---

## 2. Install Dependency

```bash
cd booksales
npm install
```

Ini akan install ~600+ package (Vite, React, Tailwind, Axios, dll). Membutuhkan ~2-3 menit + ~250MB disk space di `node_modules/`.

Jika koneksi lambat:
```bash
# Pakai mirror Indonesia
npm config set registry https://registry.npmmirror.com
npm install
```

---

## 3. Konfigurasi `.env`

Buat file `.env` di root folder `booksales/` (kalau belum ada):

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api
```

### Penjelasan variable

| Variable | Wajib | Default fallback | Deskripsi |
|----------|-------|------------------|-----------|
| `VITE_API_BASE_URL` | Tidak | `http://localhost:8000/api` | Base URL backend API |

> **Penting:** Variable yang akan di-expose ke browser **HARUS** diawali `VITE_`. Vite akan filter sisanya.

### Untuk Laragon auto virtual host

Jika backend Laravel di Laragon punya virtual host otomatis:

```dotenv
VITE_API_BASE_URL=http://booksales-api-laravel.test/api
```

### Restart server setelah ubah `.env`

Vite tidak hot-reload `.env` — tekan `Ctrl+C` dan run `npm run dev` lagi.

---

## 4. Jalankan Backend Dulu

Frontend butuh backend Laravel aktif. Pastikan dulu:

```bash
# Terminal 1
cd ../booksales-api-laravel
php artisan serve   # → http://localhost:8000

# Test:
curl http://localhost:8000/api/catalog
# Harus return JSON
```

Detail setup backend: [`../booksales-api-laravel/docs/02-SETUP.md`](../../booksales-api-laravel/docs/02-SETUP.md).

---

## 5. Jalankan Frontend

```bash
# Terminal 2
cd booksales
npm run dev
```

Output:

```
  VITE v8.0.1  ready in 432 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Buka **http://localhost:5173** di browser. Halaman katalog harus tampil.

### Akses dari device lain (mis. HP untuk test mobile)

```bash
npm run dev -- --host
```

Vite akan listen di `0.0.0.0` dan tampilkan IP lokal:

```
  ➜  Network: http://192.168.1.10:5173/
```

Buka URL ini di HP yang seJaringan WiFi.

> **Catatan:** Untuk test API dari HP, set `VITE_API_BASE_URL=http://192.168.1.10:8000/api` (IP komputer di-LAN), bukan `localhost`.

---

## 6. Verifikasi Setup

### 6.1 Cek katalog tampil

Buka `http://localhost:5173` — harus tampil 12 buku (default per_page).

### 6.2 Login

Klik avatar → **Masuk** → input:
- Email: `admin@toko.com`
- Password: `adminpass`

Setelah login, harus auto-redirect ke `/admin`.

### 6.3 Test cart

Login sebagai user:
- Email: `budi@email.com`
- Password: `password123`

Add buku ke cart → cek icon cart di navbar → buka modal → klik checkout.

### 6.4 Test browser dev tools

Buka DevTools (F12) → Network tab → reload halaman. Pastikan request ke `http://localhost:8000/api/catalog` ada dan response 200.

Jika error CORS / network error → cek backend jalan.

---

## 7. NPM Scripts

Defined di [`package.json`](../package.json):

```bash
npm run dev        # Vite dev server (HMR @ http://localhost:5173)
npm run build      # Production build → dist/ (minified, hashed assets)
npm run preview    # Preview build secara lokal (jangan dipakai untuk production!)
npm run lint       # ESLint check
```

### Build untuk production

```bash
npm run build
```

Output di folder `dist/`:
```
dist/
├── index.html
├── favicon.svg
├── assets/
│   ├── index-Abc123.css
│   └── index-Xyz456.js
```

Deploy folder `dist/` ke static hosting (Vercel, Netlify, Nginx, Apache, dll).

### Test build lokal

```bash
npm run preview    # → http://localhost:4173
```

---

## 8. ESLint

[`eslint.config.js`](../eslint.config.js) sudah ada dengan rules:
- React hooks rules
- React refresh (Vite HMR)
- Standard JS rules

Run:
```bash
npm run lint
```

Jika ingin auto-fix:
```bash
npm run lint -- --fix
```

---

## 9. Troubleshooting Setup

| Gejala | Solusi |
|--------|--------|
| `EACCES: permission denied` di node_modules | Jangan run dengan sudo. Pakai nvm + permissions home dir |
| `Cannot find module 'axios'` | `npm install` belum jalan / corrupt. Hapus `node_modules/` & `package-lock.json`, lalu `npm install` lagi |
| Port 5173 sudah dipakai | `npm run dev -- --port 5174` atau matikan proses lama |
| Halaman blank putih | Cek browser console (F12) untuk error JS. Common: import path salah |
| CORS error di Network tab | Backend Laravel `config/cors.php` set `allowed_origins => ['*']`. Restart `php artisan serve` |
| `process is not defined` | Pakai `import.meta.env` (Vite), bukan `process.env` (Node-only) |
| HMR tidak jalan | Tutup tab Chrome dengan DevTools Network tab "Disable cache", reload |

Lebih lengkap: [11-TROUBLESHOOTING.md](11-TROUBLESHOOTING.md).

---

## 10. IDE Setup

### VS Code (rekomendasi)

Install extension:
- **Tailwind CSS IntelliSense** — autocomplete class names
- **ES7+ React/Redux/React-Native snippets** — boilerplate cepat
- **ESLint** — show errors inline
- **Prettier** (opsional) — formatting

Settings (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### WebStorm / IntelliJ

React + Tailwind support built-in. Pastikan pakai Node interpreter yang sama dengan terminal.

---

## 11. Browser yang Didukung

Vite default build target ES2020 → support:
- Chrome 87+
- Firefox 78+
- Safari 14+
- Edge 88+

IE 11 tidak didukung (skip polyfill).

---

## 12. Build Optimization Tips

### Code splitting otomatis

Vite split per-route via dynamic import. Kalau perlu manual:
```js
const AdminBooks = lazy(() => import('./pages/admin/books/index'));
```

### Analisa bundle size

```bash
npm install --save-dev rollup-plugin-visualizer
```

Tambah ke `vite.config.js`:
```js
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  react(),
  tailwindcss(),
  visualizer({ open: true, filename: 'dist/stats.html' }),
],
```

Run `npm run build` → buka `dist/stats.html` untuk visualize.

---

## Berikutnya

- Setup sudah jalan? → Pelajari routing di [03-ROUTING.md](03-ROUTING.md)
- Mau memahami cart? → [04-STATE-MANAGEMENT.md](04-STATE-MANAGEMENT.md)
