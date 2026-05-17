# 09 — Midtrans Snap Flow (Frontend)

> Integrasi Midtrans Snap di frontend BookSales — load script, request token, handle callback, dan UX flow lengkap.

---

## 1. Konsep

[Midtrans Snap](https://docs.midtrans.com/docs/snap-overview) menyediakan popup payment yang di-render via JavaScript library `snap.js`. Frontend tinggal:
1. Load script `snap.js` dari CDN Midtrans
2. Request `snap_token` ke backend kita
3. Panggil `window.snap.pay(token, callbacks)` → popup muncul
4. Handle callback `onSuccess`/`onPending`/`onError`/`onClose`

---

## 2. Files Terlibat

| File | Tujuan |
|------|--------|
| [`src/pages/public/checkout/index.jsx`](../src/pages/public/checkout/index.jsx) | Halaman checkout, integrasi Snap |
| Backend [`../booksales-api-laravel/app/Http/Controllers/TransactionController.php`](../../booksales-api-laravel/app/Http/Controllers/TransactionController.php) | Endpoint `POST /api/transactions` + webhook |

---

## 3. Load Script `snap.js`

[`Checkout.jsx`](../src/pages/public/checkout/index.jsx) baris 188–209:

```jsx
const SNAP_SCRIPT_URL = 'https://app.sandbox.midtrans.com/snap/snap.js';
const snapLoaded = useRef(false);

useEffect(() => {
  if (snapLoaded.current) return;

  // Cek apakah script sudah ada (mis. dari mount sebelumnya)
  const existingScript = document.querySelector(`script[src="${SNAP_SCRIPT_URL}"]`);
  if (existingScript) {
    snapLoaded.current = true;
    return;
  }

  // Inject script tag
  const script = document.createElement('script');
  script.src = SNAP_SCRIPT_URL;
  script.setAttribute('data-client-key', ''); // di-set kemudian dari response backend
  script.async = true;
  script.onload = () => {
    snapLoaded.current = true;
  };
  document.head.appendChild(script);

  return () => {
    // Sengaja TIDAK remove script di cleanup
    // (kalau user back ke checkout, script tidak perlu re-load)
  };
}, []);
```

### Catatan
- URL untuk **sandbox**: `https://app.sandbox.midtrans.com/snap/snap.js`
- URL untuk **production**: `https://app.midtrans.com/snap/snap.js` (ganti saat go-live)
- `data-client-key` attribute di-set setelah dapat response dari backend (karena `client_key` ada di backend `.env`)
- Script disimpan di document.head, persist di seluruh navigation

### Production switch

Bisa di-toggle via env:
```js
const SNAP_SCRIPT_URL = import.meta.env.PROD
  ? 'https://app.midtrans.com/snap/snap.js'
  : 'https://app.sandbox.midtrans.com/snap/snap.js';
```

(Saat ini hardcoded ke sandbox — manual edit saat deploy production.)

---

## 4. Alur Checkout End-to-End

```
┌────────────────────────────────────────────────────────────────┐
│  1. User di /checkout                                          │
│     - Cart sudah berisi items                                  │
│     - Profil sudah diisi (atau modal alamat muncul)            │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  2. User klik "Bayar Sekarang"                                 │
│     - ConfirmModal muncul: "Total Rp 287.500. Lanjutkan?"      │
│     - User klik "Bayar"                                        │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  3. handlePayment() jalan:                                     │
│     a. Validate: address ada, token valid                      │
│     b. Build payload:                                          │
│        {                                                       │
│          items: cartItems.map(i => ({                          │
│            book_id: i.id, quantity: i.quantity                 │
│          })),                                                  │
│          shipping_address: savedAddress.street,                │
│          city: savedAddress.city,                              │
│          postal_code: savedAddress.postalCode                  │
│        }                                                       │
│     c. POST /api/transactions                                  │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  4. Backend hitung total + create transaction + get snap_token │
│     Return: { transaction, snap_token, client_key }            │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  5. Frontend:                                                  │
│     - Set data-client-key attribute pada script tag (dari      │
│       client_key di response)                                  │
│     - Check window.snap exists (kalau tidak ready, show toast) │
│     - snapActive.current = true                                │
│     - Call window.snap.pay(snap_token, callbacks)              │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  6. Popup Midtrans muncul                                      │
│     - User pilih metode pembayaran (BCA VA, GoPay, dll)        │
│     - Bayar via simulator sandbox / kartu test                 │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  7. Snap.js fire callback (lihat section 5):                   │
│     - onSuccess  → user bayar sukses                           │
│     - onPending  → user pilih bank transfer (tunggu konfirmasi)│
│     - onError    → ada error saat pembayaran                   │
│     - onClose    → user tutup popup tanpa selesai              │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  8. Frontend handle callback (lihat section 6)                 │
│     - update status via PUT /api/transactions/{id}             │
│     - clear cart                                               │
│     - navigate ke /profile or /profile/orders/{id}             │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  9. (Async) Webhook ke backend dari Midtrans                   │
│     - Backend verify signature SHA512                          │
│     - Update status definitif (settlement, cancel, dll)        │
│     - Decrement stok jika sukses                               │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. Snap Callbacks

```jsx
window.snap.pay(snap_token, {
  onSuccess: async (result) => { ... },
  onPending: (result) => { ... },
  onError: (result) => { ... },
  onClose: () => { ... },
});
```

### 5.1 `onSuccess` — Pembayaran sukses (capture/settlement)

```jsx
onSuccess: async () => {
  try {
    await axios.put(`${API_BASE_URL}/transactions/${transaction.id}`, { status: 'dibayar' }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (e) {
    console.error('Status update failed:', e);
    // Tetap proceed — webhook akan handle update status
  }
  clearCart();
  navigate(`/profile/orders/${transaction.id}`, {
    state: {
      checkoutSuccess: true,
      orderId: transaction.order_number,
    }
  });
}
```

**Yang terjadi:**
1. PUT status `dibayar` ke backend (juga akan handle backend webhook)
2. Clear cart dari localStorage
3. Navigate ke detail order dengan `state.checkoutSuccess` untuk show banner

### 5.2 `onPending` — Pembayaran pending (bank transfer)

```jsx
onPending: (result) => {
  showToast(
    `Pesanan ${result.order_id} berhasil dibuat! Silakan selesaikan pembayaran sesuai instruksi.`,
    'pending'
  );
  clearCart();
  navigate('/profile');
}
```

**Yang terjadi:**
1. Show toast "pending" (kuning)
2. Clear cart (order sudah disubmit, kalau dibatalkan akan auto-cancel via cron)
3. Navigate ke `/profile` untuk lihat status order

### 5.3 `onError` — Error saat pembayaran

```jsx
onError: (result) => {
  console.error('Payment error:', result);
  snapActive.current = false;
  setIsProcessing(false);
  showToast(
    'Terjadi kendala saat memproses pembayaran. Keranjang Anda tetap tersimpan — silakan coba lagi.',
    'error'
  );
}
```

**Yang terjadi:**
1. Reset `snapActive` flag
2. Reset `isProcessing` (re-enable button)
3. Show toast error
4. Cart TIDAK di-clear — user bisa retry

### 5.4 `onClose` — User tutup popup

```jsx
onClose: () => {
  snapActive.current = false;
  setIsProcessing(false);
  navigate('/profile');
}
```

**Yang terjadi:**
1. Reset flags
2. Navigate ke `/profile` (lihat order dengan status `pending`)
3. Order tetap ada di DB, status `pending`
4. Akan auto-cancel jika tidak bayar dalam 1 jam (lihat backend [08-CONSOLE-COMMANDS.md](../../booksales-api-laravel/docs/08-CONSOLE-COMMANDS.md))

---

## 6. Refs untuk Avoid Race Condition

Dua refs penting:

```jsx
const snapLoaded = useRef(false);   // Script Snap sudah load?
const snapActive = useRef(false);   // Popup Snap sedang aktif?
```

### `snapActive` mencegah unwanted redirect

`useEffect` ini di-set:
```jsx
useEffect(() => {
  if (!isLoadingUser && !snapActive.current && cartItems.length === 0) {
    navigate('/cart', { replace: true });
  }
}, [cartItems, isLoadingUser, navigate]);
```

**Skenario:** Saat checkout sukses, `clearCart()` dipanggil di `onSuccess`. Tanpa `snapActive` check, useEffect ini bisa fire DUA KALI:
1. Snap popup muncul → `snapActive = true`
2. User bayar → `onSuccess` → `clearCart()` → `cartItems.length === 0`
3. useEffect fire... TAPI `snapActive = true`, jadi skip redirect (BAGUS)
4. `onSuccess` navigate ke `/profile/orders/X` ← yang ini yang kita mau

Tanpa `snapActive`, step 3 akan redirect ke `/cart` sebelum step 4 selesai → user lihat halaman cart sebelum dialihkan ke order detail (flicker UX).

---

## 7. Address Modal

Sebelum bisa bayar, user harus punya alamat. Implementasi:

```jsx
const [savedAddress, setSavedAddress] = useState(null);
const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

// Load dari profile saat mount
useEffect(() => {
  axios.get('/api/user', { headers: ... }).then(res => {
    if (res.data.address && res.data.city && res.data.postal_code) {
      setSavedAddress({
        street: res.data.address,
        city: res.data.city,
        postalCode: res.data.postal_code,
      });
    }
  });
}, []);

// UI:
{savedAddress ? (
  <div>
    {/* display address */}
    <button onClick={() => setIsAddressModalOpen(true)}>Ubah Alamat</button>
  </div>
) : (
  <div>
    <p>Anda belum menambahkan alamat.</p>
    <button onClick={() => setIsAddressModalOpen(true)}>Tambah Alamat</button>
  </div>
)}

<AddressModal
  isOpen={isAddressModalOpen}
  onClose={() => setIsAddressModalOpen(false)}
  onSave={async (data) => {
    // Update di backend
    await axios.put('/api/user/profile', {
      address: data.street,
      city: data.city,
      postal_code: data.postalCode,
    }, { headers: ... });

    // Update di state lokal
    setSavedAddress(data);
  }}
  initialData={savedAddress}
/>
```

Tombol "Bayar Sekarang" disabled kalau `!savedAddress`.

---

## 8. Cost Calculation di Frontend

```jsx
const taxAmount = cartTotal * 0.11;
const shippingCost = 10000;
const grandTotal = cartTotal + taxAmount + shippingCost;
```

Ditampilkan di UI breakdown:
- Subtotal: `formatRupiah(cartTotal)`
- Pajak (11%): `formatRupiah(taxAmount)`
- Ongkos Kirim: `formatRupiah(shippingCost)`
- Total Akhir: `formatRupiah(grandTotal)` (highlight rausch)

> **Important:** Backend recalculate ulang dari DB (jangan trust frontend). Frontend hitung hanya untuk display.

---

## 9. Format Rupiah Utility

Pattern yang dipakai di banyak file:

```jsx
const formatRupiah = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount ?? 0);

formatRupiah(287500);  // → "Rp 287.500"
```

> **Improvement**: Extract ke utility shared:
> ```js
> // src/utils/format.js
> export const formatRupiah = (amount) => ...
> export const formatDate = (dateStr) => ...
> ```

---

## 10. Error Handling Checkout

```jsx
catch (error) {
  console.error('Checkout error:', error);
  snapActive.current = false;

  const errorMsg = error.response?.data?.message;

  if (error.response?.status === 422 && errorMsg) {
    // Validation error (mis. stok habis)
    showToast(errorMsg, 'error');
  } else if (error.response?.status === 404 && errorMsg) {
    // Book not found
    showToast(errorMsg, 'error');
  } else if (!error.response) {
    // Network error
    showToast('Tidak dapat terhubung ke server. Cek koneksi internet.', 'error');
  } else {
    showToast('Terjadi kesalahan yang tidak terduga. Coba lagi nanti.', 'error');
  }
  setIsProcessing(false);
}
```

Common errors:
- **422 stok kurang**: `"Stok buku \"...\" tidak mencukupi. Tersedia: N."` (dari backend validation)
- **404 buku tidak ada**: `"Buku dengan ID X tidak ditemukan."`
- **401 token invalid**: `"Unauthenticated."` (cek di response)

---

## 11. Testing Pembayaran Sandbox

### 11.1 Kartu Kredit Test
- Sukses: `4811 1111 1111 1114`
- Denied: `4911 1111 1111 1113`
- CVV: `123`, Exp: `01/25`
- OTP/3DS: `112233`

### 11.2 GoPay/E-Wallet
- Pilih GoPay di popup
- QR code dummy muncul
- Buka https://simulator.sandbox.midtrans.com/gopay/ui/v1/login → tap "Authorize"

### 11.3 Bank VA
- Pilih BCA/Mandiri/BNI di popup
- VA number dummy muncul
- Buka https://simulator.sandbox.midtrans.com/bca/va/index → input VA → bayar

Setelah bayar di simulator, callback `onSuccess` di frontend AKAN fire.

---

## 12. Troubleshooting

| Gejala | Solusi |
|--------|--------|
| `window.snap is not defined` | Script belum load. Cek Network tab di DevTools, pastikan `snap.js` 200 OK. Atau MIDTRANS_CLIENT_KEY salah |
| Popup tidak muncul | Pop-up blocker browser nyala. Allow popup untuk localhost |
| Error "snap_token invalid" | Backend gagal generate token. Cek `storage/logs/laravel.log` di backend |
| Setelah bayar tidak redirect | Callback `onSuccess` error. Cek browser Console |
| Status tidak ter-update | PUT request gagal. Cek Network tab. Atau webhook tidak fire (lihat backend troubleshooting) |
| Cart tidak di-clear setelah bayar | `clearCart()` tidak ke-call. Cek apakah `onSuccess` fire (browser console.log) |

---

## 13. Production Checklist

Saat siap go-live:

- [ ] Ganti `SNAP_SCRIPT_URL` ke production CDN: `https://app.midtrans.com/snap/snap.js`
- [ ] Backend `.env`: `MIDTRANS_IS_PRODUCTION=true`
- [ ] Backend `.env`: production server key & client key
- [ ] Backend Midtrans dashboard: set notification URL ke domain production
- [ ] Test dengan kartu/VA asli (nominal kecil)
- [ ] Monitor `laravel.log` 24-48 jam pertama setelah deploy
- [ ] Backup DB sebelum deploy (untuk rollback)

---

## Berikutnya

- Mau tahu chat widget? → [10-CHAT-WIDGET.md](10-CHAT-WIDGET.md)
- Backend Midtrans detail → [`../../booksales-api-laravel/docs/06-MIDTRANS-INTEGRATION.md`](../../booksales-api-laravel/docs/06-MIDTRANS-INTEGRATION.md)
