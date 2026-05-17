# 11 — Troubleshooting (Frontend)

> Masalah umum di frontend BookSales, cara diagnosis, dan solusinya.

---

## 1. Tools Debugging

### 1.1 Browser DevTools (F12)

| Tab | Pakai untuk |
|-----|-------------|
| **Console** | Lihat `console.log`, error JS, warning React |
| **Network** | Cek HTTP requests/responses, headers, timing |
| **Application → Local Storage** | Cek/edit `token`, `user_id`, `user_role`, `cart_<id>` |
| **Application → Session Storage** | (Tidak dipakai project ini) |
| **Sources** | Debug breakpoint di kode |
| **Elements** | Inspect & test Tailwind classes |
| **React DevTools** (extension) | Inspect component tree, hooks state, props |

### 1.2 Vite Dev Server Output

Saat run `npm run dev`, terminal nampilkan:
- Compile errors
- HMR updates
- Warning ESLint (jika auto-trigger)

### 1.3 Eslint

```bash
npm run lint
```

Catch banyak issues sebelum runtime (unused vars, missing deps di useEffect, dll).

---

## 2. Masalah Setup

### `npm install` gagal

**Possible cause:**
- Node.js version < 20
- Network issue (firewall, slow connection)
- Corrupt `package-lock.json`

**Solusi:**
```bash
# Cek version
node -v   # harus >= 20

# Hapus dan install ulang
rm -rf node_modules package-lock.json
npm install

# Atau pakai mirror
npm config set registry https://registry.npmmirror.com
```

### `npm run dev` gagal di port 5173

**Penyebab:** Port sudah dipakai (mis. instance Vite lain, atau aplikasi lain).

**Solusi:**
```bash
npm run dev -- --port 5174
```

Atau matikan proses yang pakai port 5173:
```bash
# Linux/Mac
lsof -ti:5173 | xargs kill

# Windows PowerShell
Get-NetTCPConnection -LocalPort 5173 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

### Halaman blank putih saat buka `http://localhost:5173`

**Diagnosa:**
1. Buka DevTools → Console
2. Lihat error pertama (biasanya import path salah atau runtime error di App.jsx)

**Common causes:**
- Import path typo: `./components/Navbar` vs `./components/navbar` (case-sensitive di Linux/Mac)
- Missing dependency: `Cannot find module '...'` → `npm install` belum
- Syntax error di file yang baru di-edit

---

## 3. Masalah Komunikasi dengan Backend

### Error `Network Error` di axios

**Penyebab:**
1. Backend Laravel tidak jalan
2. URL backend di `.env` salah
3. CORS issue (jarang, default OK)

**Solusi:**
```bash
# 1. Cek backend jalan
curl http://localhost:8000/api/catalog
# Harus return JSON. Kalau "connection refused", backend belum jalan.

# 2. Cek .env frontend
cat .env
# Harus ada: VITE_API_BASE_URL=http://localhost:8000/api

# 3. Restart Vite (karena .env tidak hot-reload)
# Ctrl+C, lalu npm run dev
```

### CORS error: "blocked by CORS policy"

**Penyebab:** Browser block request karena beda origin (port 5173 → 8000).

**Solusi:**
Cek di backend [`config/cors.php`](../../booksales-api-laravel/config/cors.php):
```php
'paths' => ['api/*'],
'allowed_origins' => ['*'],   // atau spesifik http://localhost:5173
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

Pastikan `paths` include endpoint yang Anda call. Lalu restart `php artisan serve`.

### 401 Unauthorized walaupun sudah login

**Diagnosa:**
1. Cek `localStorage.token` di Application tab DevTools — ada?
2. Cek Network tab → request header `Authorization: Bearer <token>` ada?
3. Cek backend logs: `tail -f storage/logs/laravel.log`

**Common causes:**
- Token expired/revoked di backend (saat ini token tidak expire kecuali manual delete)
- Header tidak terkirim (typo di axios config)
- User logout di tab lain (localStorage cleared di session yang sama)

**Solusi cepat:** Logout, login ulang.

### 403 Forbidden saat akses admin endpoint

**Penyebab:** User bukan admin tapi coba akses endpoint admin.

**Cek:**
```js
// Di console DevTools
localStorage.getItem('user_role')   // harus 'admin'
```

Kalau bukan admin → logout, login ulang dengan akun admin.

### Response field `data` undefined

**Penyebab:** Response format dari backend tidak sesuai yang diharapkan.

**Solusi:** Pakai defensive extraction:
```jsx
const items = res.data?.data ?? res.data ?? [];
```

---

## 4. Masalah Auth & State

### Cart kosong setelah login

**Penyebab:** `authChange` event tidak fire setelah login, atau `cart_<userId>` di localStorage memang kosong.

**Diagnosa:**
```js
// Di console DevTools
localStorage.getItem('user_id')         // misal "3"
localStorage.getItem('cart_3')          // cek isi cart
```

**Solusi:** Pastikan login dispatch event:
```jsx
window.dispatchEvent(new Event('authChange'));
```

(Sudah di-implement di `pages/auth/login.jsx`.)

### Logout tidak benar-benar clear cart

**Diagnosa:** Kemungkinan cart context masih punya items karena state tidak di-reset.

**Solusi:** Saat logout, dispatch event juga:
```jsx
localStorage.clear();   // atau hapus key satu-satu
window.dispatchEvent(new Event('authChange'));
navigate('/login');
```

> Saat ini di [`layouts/admin.jsx`](../src/layouts/admin.jsx) dan [`components/navbar.jsx`](../src/components/navbar.jsx), logout TIDAK fire `authChange`. Bug minor — bisa di-fix.

### Cart user A bocor ke user B

**Penyebab:** Setelah user A logout dan user B login, cart context masih display items user A (kalau `authChange` event tidak fire).

**Solusi:** Sama dengan di atas — pastikan event fire setelah ubah `user_id` di localStorage.

---

## 5. Masalah UI/UX

### Modal tidak bisa di-close

**Cek:**
1. Apakah `onClose` prop diteruskan dengan benar?
2. Apakah ada `e.stopPropagation()` yang block bubbling?

### Toast tidak muncul

**Cek:**
- State `toast` ter-set? (`setToast({ message, type: 'success' })`)
- Render conditional bener? (`{toast && <Toast .../>}`)
- Z-index cukup tinggi? Toast default `z-[9999]`.

### Layout broken di mobile

**Diagnosa:** Test di DevTools responsive mode (Ctrl+Shift+M di Chrome).

**Common issues:**
- Container `max-w-7xl mx-auto px-6 md:px-12` — pastikan padding responsive
- Grid `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4` — pastikan breakpoints sesuai
- Overflow elements: tambah `overflow-x-auto` untuk table

### Tailwind class tidak apply

**Penyebab:**
1. Typo class name (mis. `text-medium` (salah) vs `font-medium`)
2. Tailwind tidak detect class (dynamic class name tidak ter-scan)
3. Custom class belum di-define di `index.css`

**Solusi:**
1. Cek dengan Inspector — apakah class ada di DOM tapi tidak ada CSS?
2. Hindari dynamic class name: `bg-${color}-500` ❌ — pakai full string: `color === 'red' ? 'bg-red-500' : 'bg-blue-500'` ✅
3. Restart Vite kalau tambah custom class baru

### Animation tidak smooth

- Pastikan `transition-*` class ada
- Gunakan `transform` (`translate-x-*`, `scale-*`) drpd `top/left` (more performant)
- Hindari animate property yang trigger layout (mis. `width`, `height`)

---

## 6. Masalah Pembayaran (Midtrans)

### Popup Midtrans tidak muncul

**Diagnosa:**
1. Cek browser Console → ada error?
2. Cek `window.snap` di console:
   ```js
   typeof window.snap   // harus 'object'
   ```
3. Kalau `undefined` → script `snap.js` belum load. Cek Network tab.

**Common causes:**
- Pop-up blocker browser nyala → allow untuk localhost
- Script `snap.js` 404 → cek URL di [`Checkout.jsx`](../src/pages/public/checkout/index.jsx) baris 9
- `MIDTRANS_CLIENT_KEY` di backend salah → cek backend response

**Solusi:**
1. Reload halaman
2. Allow popup di browser settings
3. Cek backend response `client_key` valid

### Setelah bayar, status tidak ter-update

**Diagnosa:**
1. Cek Network tab → `PUT /api/transactions/{id}` 200 OK?
2. Cek backend logs untuk webhook callback
3. Cek backend DB: `php artisan tinker` → `Transaction::find(X)->status`

**Common causes:**
- `onSuccess` callback error → cek browser console
- Backend tidak terima webhook (kalau dev di localhost tanpa ngrok)

Detail: [`../../booksales-api-laravel/docs/10-TROUBLESHOOTING.md#4-masalah-checkout--midtrans`](../../booksales-api-laravel/docs/10-TROUBLESHOOTING.md).

### Cart tidak di-clear setelah bayar sukses

**Penyebab:** `clearCart()` tidak ter-call di `onSuccess`.

**Cek:** Apakah `onSuccess` benar-benar fire? Tambah `console.log` untuk debug:
```jsx
onSuccess: async (result) => {
  console.log('onSuccess fired', result);
  // ...
  clearCart();
  console.log('cart cleared');
  // ...
}
```

---

## 7. Masalah Chat Widget

### Widget tidak muncul

**Cek:**
```js
localStorage.getItem('token')       // ada?
localStorage.getItem('user_role')   // harus 'user'
```

Kalau admin login, widget memang TIDAK muncul (admin pakai inbox).

### Pesan tidak masuk realtime

**Diagnosa:**
1. Network tab — apakah `GET /api/conversations/messages?after=X` fire setiap 5s?
2. Apakah response berisi messages baru?

**Common causes:**
- Backend offline → polling fail silently
- `lastId` tidak ter-update → polling pakai stale value

### Upload image gagal

**Penyebab:**
1. File > 2MB → backend reject
2. File bukan image → backend reject
3. Backend storage symlink belum dibuat

**Solusi:**
1. Resize image dulu
2. Pastikan format JPG/PNG/GIF
3. Backend: `php artisan storage:link`

### Attachment image 404

**Penyebab:** Backend `php artisan storage:link` belum jalan.

**Solusi:** Di backend folder:
```bash
php artisan storage:link
```

Verifikasi: `ls -la public/storage` (harus symlink).

---

## 8. Masalah Performance

### Halaman lambat load (initial)

**Diagnosa:**
1. Lighthouse audit (DevTools → Lighthouse)
2. Bundle size: `npm run build` → cek `dist/assets/*.js` size

**Solusi:**
- Lazy load route admin: `lazy(() => import('./pages/admin/...'))`
- Tree-shake unused imports (Vite auto, tapi cek imports manual)
- Compress images (jangan upload 5MB photo untuk avatar)

### React re-render terlalu sering

**Diagnosa:** Pakai React DevTools Profiler tab.

**Common causes:**
- `useEffect` deps tidak benar (mis. include function tanpa `useCallback`)
- Inline object/array di props: `<Comp data={{ key: 'val' }} />` → new ref tiap render
- Context value change tiap render

**Solusi:**
- Wrap fetch function dengan `useCallback`
- Memoize derived values dengan `useMemo`
- Pisahkan context untuk reduce re-render scope

### Polling chat bikin halaman berat

**Solusi sementara:**
- Increase interval ke 10s
- Stop polling saat document hidden:
  ```jsx
  document.addEventListener('visibilitychange', () => {
    // pause/resume polling
  });
  ```

---

## 9. Masalah Build / Deploy

### `npm run build` error

**Common causes:**
1. ESLint error (build gagal jika ada warning di config strict)
2. Unused import yang dianggap error
3. TypeScript error (jika pakai TS, tapi project ini JS only)

**Solusi:**
```bash
npm run lint -- --fix     # auto-fix yang bisa
npm run build
```

### Build sukses tapi production blank/error

**Cek:**
1. Buka `dist/` di local: `npm run preview`
2. Cek browser console untuk error
3. Cek path import (case-sensitive di linux server!)

**Common causes:**
- Hardcoded `localhost:8000` di JS → di production akan call localhost user
- `.env` tidak di-deploy ke server
- Relative path import salah case

**Solusi:**
- Selalu pakai `import.meta.env.VITE_API_BASE_URL`
- Pastikan `.env.production` ada di build step
- Standardize naming convention file (mis. PascalCase atau lowercase consistent)

### Asset 404 di production

**Penyebab:** Public path salah.

**Solusi:** Edit [`vite.config.js`](../vite.config.js):
```js
export default defineConfig({
  base: '/booksales/',   // kalau deploy di subdir
  // atau biarkan default '/' kalau di root
});
```

---

## 10. Masalah Spesifik Browser

### Safari: localStorage hilang

**Penyebab:** Safari di Private Mode disable localStorage.

**Solusi:** User harus pakai normal browsing mode.

### Firefox: animasi laggy

**Penyebab:** GPU acceleration tidak optimal untuk certain CSS.

**Solusi:**
- Pakai `transform` instead of `top/left`
- Tambah `will-change: transform` ke element heavy animation

### IE 11

**Tidak didukung.** Tampilkan banner upgrade browser.

---

## 11. Common React Hooks Errors

### "React Hook useEffect has a missing dependency"

```jsx
// ❌ Wrong
useEffect(() => {
  fetchData(currentPage);
}, []);   // missing currentPage

// ✅ Right
useEffect(() => {
  fetchData(currentPage);
}, [currentPage]);
```

Atau pakai `// eslint-disable-next-line react-hooks/exhaustive-deps` jika sengaja.

### "Cannot read property of undefined"

Pakai optional chaining:
```jsx
// ❌
{user.address.street}

// ✅
{user?.address?.street}
{user?.address?.street || 'N/A'}
```

### "Warning: Each child in a list should have a unique key"

```jsx
// ❌
{items.map(item => <div>{item.name}</div>)}

// ✅
{items.map(item => <div key={item.id}>{item.name}</div>)}
```

### Hooks called conditionally

```jsx
// ❌
if (condition) {
  const [state, setState] = useState();
}

// ✅
const [state, setState] = useState();
if (condition) {
  // ...
}
```

---

## 12. Reset / Fresh Start

Kalau benar-benar stuck:

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Clear browser data
# - DevTools → Application → Clear storage → Clear site data

# 3. Restart dev server
npm run dev

# 4. Refresh hard di browser (Ctrl+Shift+R)
```

---

## 13. Help Hierarchy

Kalau stuck:
1. **Cek browser Console** untuk error
2. **Cek Network tab** untuk failed requests
3. **Cek backend logs** (`storage/logs/laravel.log` di backend folder)
4. **Bandingkan dengan code di repo** — apakah ada perbedaan sengaja?
5. **Search GitHub issues** untuk lib yang dipakai (React, Vite, Tailwind)
6. **Tanya tim** dengan: screenshot error + step reproduce + apa yang sudah dicoba

---

## Berikutnya

- Kembali ke [README.md](../README.md)
- Backend troubleshooting → [`../../booksales-api-laravel/docs/10-TROUBLESHOOTING.md`](../../booksales-api-laravel/docs/10-TROUBLESHOOTING.md)
