# 04 — State Management (Frontend)

> BookSales frontend pakai **React Context API** (bukan Redux/Zustand). Hanya satu context global: **CartContext**. State lainnya local per-component. Auth disimpan langsung di **localStorage**.

---

## 1. Overview

| State | Mekanisme | Lokasi |
|-------|-----------|--------|
| Cart items | React Context + localStorage | `CartContext.jsx` |
| Auth (token, user info) | localStorage langsung | (dibaca per-component) |
| Form input | `useState` lokal | per-component |
| Fetched data (books, transactions, dll) | `useState` lokal | per-component |
| UI state (modal open, loading, dll) | `useState` lokal | per-component |

---

## 2. CartContext

### 2.1 Definisi

File: [`src/context/CartContext.jsx`](../src/context/CartContext.jsx)

```jsx
const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem('user_id'));
  // ... loadCart, addToCart, removeFromCart, ...

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, clearCart,
      cartCount, cartTotal, increaseQuantity, decreaseQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};
```

### 2.2 Storage Strategy: Per-User di localStorage

Key: `cart_${user_id}`

```jsx
localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
```

**Kenapa per-user?** Supaya:
- Cart user A tidak bocor ke user B kalau pakai komputer yang sama
- Saat logout, cart di-clear dari memory tapi storage tetap (tersimpan kalau user login lagi)

### 2.3 API yang Disediakan

```jsx
const {
  cartItems,           // Array<{ id, title, price, cover_photo, stock, quantity, author, genre }>
  addToCart,           // (book, quantity = 1) => void
  removeFromCart,      // (productId) => void
  clearCart,           // () => void
  increaseQuantity,    // (productId) => void
  decreaseQuantity,    // (productId) => void
  cartCount,           // number — total qty across all items
  cartTotal,           // number — sum(price × qty)
} = useCart();
```

#### Contoh pakai

```jsx
import { useCart } from '../context/CartContext';

function BookDetail() {
  const { addToCart, cartCount } = useCart();

  return (
    <button onClick={() => addToCart(book, 1)}>
      Add to Cart (current: {cartCount})
    </button>
  );
}
```

### 2.4 Mount & Auth-Change Listener

```jsx
useEffect(() => {
  loadCart();

  const handleAuthChange = () => loadCart();
  window.addEventListener('authChange', handleAuthChange);
  return () => window.removeEventListener('authChange', handleAuthChange);
}, [loadCart]);
```

**Saat mount:** Load cart dari localStorage berdasarkan `user_id`.
**Saat `authChange` event fire:** Re-load cart (untuk handle login/logout).

### 2.5 Auto-Save on Change

```jsx
useEffect(() => {
  if (userId) {
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
  }
}, [cartItems, userId]);
```

Setiap perubahan `cartItems` atau `userId` → write ke localStorage. Sehingga state selalu sync.

### 2.6 Add to Cart — React Strict Mode Bug Fix

Saat dev pakai `<StrictMode>`, effect/render run 2x. Bisa cause `addToCart` jadi double-increment quantity.

**Fix di codebase:**
```jsx
const addToCart = (product, quantity = 1) => {
  setCartItems((prevItems) => {
    const existingItemIndex = prevItems.findIndex((item) => item.id === product.id);

    if (existingItemIndex >= 0) {
      // Deep copy biar tidak mutate prev state reference
      const updatedItems = [...prevItems];
      const currentItem = { ...updatedItems[existingItemIndex] };

      if (currentItem.quantity + quantity <= product.stock) {
        currentItem.quantity += quantity;
      } else {
        currentItem.quantity = product.stock;   // cap di stock max
      }

      updatedItems[existingItemIndex] = currentItem;
      return updatedItems;
    }

    return [...prevItems, { ...product, quantity }];
  });
};
```

Detail di [`CartContext.jsx`](../src/context/CartContext.jsx) baris 53–75.

### 2.7 Stock-Aware Operations

`increaseQuantity` & `addToCart` keduanya respect `item.stock`:

```jsx
const increaseQuantity = (productId) => {
  setCartItems((prevItems) =>
    prevItems.map(item => {
      if (item.id === productId && item.quantity < item.stock) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    })
  );
};
```

Jadi user tidak bisa over-order. Backend juga validate ulang saat checkout (defense in depth).

---

## 3. Auth State

### 3.1 Disimpan di localStorage

| Key | Value | Diisi saat | Dipakai untuk |
|-----|-------|-----------|---------------|
| `token` | `"1|abcdef..."` | Login success | `Authorization: Bearer <token>` header |
| `user_id` | `"3"` | Login success | Identify user (cart key, owner check) |
| `user_name` | `"Admin Utama"` | Login success | Display di Navbar avatar/dropdown |
| `user_role` | `"admin"` \| `"user"` | Login success | RBAC check di ProtectedRoute |

### 3.2 Pattern Set Auth (di Login)

[`src/pages/auth/login.jsx`](../src/pages/auth/login.jsx) baris 63–68:

```jsx
localStorage.setItem('token', token);
localStorage.setItem('user_id', user?.id || '');
localStorage.setItem('user_name', user?.name || '');
localStorage.setItem('user_role', userRole);

window.dispatchEvent(new Event('authChange'));
```

**`authChange` event** trigger `CartContext` reload cart untuk user baru.

### 3.3 Pattern Clear Auth (Logout)

[`layouts/admin.jsx`](../src/layouts/admin.jsx) baris 25–30, dan [`components/navbar.jsx`](../src/components/navbar.jsx) baris 26–34:

```jsx
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_name');
  navigate('/login');
};
```

> **Bug minor**: Logout di `admin.jsx` TIDAK fire `authChange` event, sementara di `navbar.jsx` JUGA TIDAK fire. Saat ini OK karena tujuan navigate ke `/login` yang akan reset state context juga. Tapi untuk safety, sebaiknya dispatch event:
> ```jsx
> window.dispatchEvent(new Event('authChange'));
> ```

### 3.4 Pattern Baca Auth (per-component)

```jsx
function MyComponent() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role');
  const userName = localStorage.getItem('user_name');
  // ...
}
```

> **Catatan reactivity**: `localStorage` BUKAN reactive — perubahan tidak trigger re-render. Solusi:
> 1. Dispatch custom event `authChange` setelah set/remove (sudah dipakai di login)
> 2. Atau pakai `useEffect` + interval polling (anti-pattern)
> 3. Atau pindahkan ke React Context (refactor)

Saat ini pattern current OK karena auth change biasanya disertai navigate (yang trigger remount).

---

## 4. Component-Local State

Pakai `useState` + `useEffect` untuk:

### 4.1 Form state

```jsx
const [formData, setFormData] = useState({
  email: '',
  password: '',
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};
```

### 4.2 Loading & Error state

```jsx
const [data, setData] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  setIsLoading(true);
  axios.get(URL)
    .then(res => setData(res.data))
    .catch(err => setError(err.message))
    .finally(() => setIsLoading(false));
}, [deps]);
```

### 4.3 UI state (modal, dropdown)

```jsx
const [isModalOpen, setIsModalOpen] = useState(false);
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
```

### 4.4 Pagination state

```jsx
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(0);
const [totalItems, setTotalItems] = useState(0);
```

### 4.5 Search dengan debounce

[`pages/admin/books/index.jsx`](../src/pages/admin/books/index.jsx) baris 24–31:

```jsx
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearch(searchTerm);
    setCurrentPage(1);  // reset ke page 1 saat search berubah
  }, 300);
  return () => clearTimeout(handler);
}, [searchTerm]);

// Lalu fetch pakai debouncedSearch
useEffect(() => {
  axios.get(URL, { params: { search: debouncedSearch, ... } });
}, [debouncedSearch, ...]);
```

Pattern ini hindari hit endpoint setiap keystroke.

---

## 5. Custom Hooks

### 5.1 `useCountdown`

[`src/hooks/useCountdown.js`](../src/hooks/useCountdown.js):

```jsx
import { useState, useEffect } from 'react';

export function useCountdown(expiresAt) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, expiresAt - now);
  return {
    minutes: Math.floor(diff / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    isExpired: diff === 0,
  };
}
```

**Dipakai di:** `pages/profile/index.jsx` (`PendingCountdownBadge`) untuk display "MM:SS" countdown 1 jam dari `created_at` order pending.

**Side effect saat expired:** Komponen `PendingCountdownBadge` panggil PUT `/api/transactions/{id}` dengan `{ status: 'dibatalkan' }` lalu callback `onExpire` ke parent. Backend tidak strict-enforce 1 jam expiry (yang strict adalah scheduled job tiap menit di backend), tapi frontend bantu UX dengan langsung mark sebagai cancelled tanpa nunggu refresh.

---

## 6. Mengapa Tidak Pakai Redux/Zustand?

Project ini sengaja minimalis state management. Justifikasi:

| Pertimbangan | Alasan |
|--------------|--------|
| **Scope kecil** | Hanya cart yang butuh share state across components |
| **Reduce deps** | Tambah Redux = +20KB minified, learning curve untuk dev baru |
| **Pattern Context cukup** | React Context API native, no boilerplate |
| **Auth via localStorage** | Simple, no global subscriber needed (komponen baca direct) |

**Kapan harus migrate ke Zustand/Redux?**
- Kalau jumlah context > 3 dan ada nesting hell
- Kalau perlu time-travel debugging
- Kalau ada cross-cutting concerns kompleks (mis. real-time sync)

Untuk MVP saat ini: Context API + localStorage cukup.

---

## 7. State Persistence Strategy

| Data | Persistence | Lifetime | Catatan |
|------|-------------|----------|---------|
| Cart items | `localStorage[cart_<userId>]` | Forever (sampai user clear browser) | Per-user |
| Auth token | `localStorage[token]` | Forever (sampai logout) | Single |
| User info | `localStorage[user_name, user_role, user_id]` | Forever | Single |
| Form draft | `useState` (memory only) | Component lifetime | Lost on remount |
| Fetched data | `useState` (memory only) | Component lifetime | Refetch on mount |
| UI state | `useState` (memory only) | Component lifetime | OK |
| Cart modal open state | `useState` di Navbar | Navbar lifetime | OK |

> **Tidak ada caching layer** (mis. React Query/SWR). Setiap kali halaman di-mount, fetch ulang dari API. Untuk skala ini OK; jika butuh optimisasi, pertimbangkan migrasi ke React Query.

---

## 8. Data Fetching Patterns

### 8.1 Pattern Standar (axios + useEffect)

```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  let cancelled = false;

  axios.get(URL)
    .then(res => { if (!cancelled) setData(res.data); })
    .catch(err => { if (!cancelled) console.error(err); })
    .finally(() => { if (!cancelled) setLoading(false); });

  return () => { cancelled = true; };
}, []);
```

> Saat ini codebase TIDAK pakai cancellation pattern di mayoritas tempat (potensi memory leak kalau component unmount sebelum fetch selesai). Belum jadi masalah karena requests cepat.

### 8.2 Pattern dengan Token

```jsx
const token = localStorage.getItem('token');
axios.get(URL, {
  headers: { Authorization: `Bearer ${token}` }
});
```

Bisa di-DRY dengan axios interceptor di `main.jsx`:

```jsx
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

(Belum diimplementasi — pattern manual di tiap call.)

### 8.3 Pattern dengan Search + Pagination

Lihat [`pages/admin/books/index.jsx`](../src/pages/admin/books/index.jsx) sebagai contoh canonical (debounce + multiple deps).

---

## 9. Future Improvements

| Improvement | Benefit |
|-------------|---------|
| Migrate auth ke Context (mis. `AuthContext`) | Reactive, no manual localStorage read |
| Tambah `axios.interceptors` untuk auth header otomatis | DRY, easier untuk handle 401 globally (auto-logout) |
| Tambah `axios.interceptors` untuk 401 → redirect login | Better UX |
| Pertimbangkan React Query untuk cache layer | Auto-refetch, deduplication, stale-while-revalidate |
| Implement `ScrollRestoration` | Better UX saat navigasi |
| Implement cancellation di useEffect | Hindari memory leak |

---

## Berikutnya

- Mau tahu komponen reusable? → [05-COMPONENTS.md](05-COMPONENTS.md)
- Mau tahu pola API call detail? → [07-API-INTEGRATION.md](07-API-INTEGRATION.md)
