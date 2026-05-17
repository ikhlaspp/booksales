# 07 — API Integration (Frontend)

> Pola Axios, Bearer token, error handling, pagination, dan inkonsistensi yang perlu diperhatikan.

---

## 1. Base URL Configuration

Ada dua pattern di codebase (NOT consistent — perlu di-rapikan):

### Pattern A: Pakai `/api` di env
```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

axios.get(`${API_BASE_URL}/catalog`);   // → http://localhost:8000/api/catalog
```

Dipakai di: `pages/public/index.jsx`, `pages/public/cart/index.jsx`, `pages/public/checkout/index.jsx`, dll.

### Pattern B: Tidak pakai `/api`, prepend manual
```js
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

axios.get(`${API_URL}/api/dashboard`);  // → http://localhost:8000/api/dashboard
```

Dipakai di: `pages/admin/index.jsx`, `pages/admin/books/index.jsx`, `pages/profile/index.jsx`, `ChatWidget.jsx`, dll.

### Mana yang benar?

`.env` saat ini di-set:
```dotenv
VITE_API_BASE_URL=http://localhost:8000/api
```

→ Pattern A correct. Pattern B yang pakai variable yang sama akan bug (hasil URL `.../api/api/...`).

**Realita di codebase:** Banyak file Pattern B pakai `.replace('/api', '')` untuk strip duplicate:
```js
const imageUrl = `${API_BASE_URL.replace('/api', '')}/storage/covers/${cover_photo}`;
```

### Rekomendasi: Standardize

Pilih SATU pattern (saya rekomendasi Pattern A — env include `/api`, lebih clean), lalu refactor semua file. Untuk static asset prefix:

```js
const ASSET_BASE = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
// → http://localhost:8000
```

---

## 2. HTTP Client: Axios

### 2.1 Pattern Standard

```js
import axios from 'axios';

const response = await axios.get(`${API_URL}/api/books`);
const data = response.data;
```

### 2.2 Dengan Bearer Token (Auth)

```js
const token = localStorage.getItem('token');

const response = await axios.get(`${API_URL}/api/dashboard`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

### 2.3 POST dengan JSON

```js
await axios.post(`${API_URL}/api/transactions`, {
  items: [{ book_id: 1, quantity: 2 }],
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

### 2.4 Multipart (Upload File)

```js
const formData = new FormData();
formData.append('type', 'image');
formData.append('attachment', file);

await axios.post(`${API_URL}/api/conversations/messages`, formData, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  },
});
```

### 2.5 Query Params

```js
await axios.get(`${API_URL}/api/books`, {
  params: {
    search: 'harry',
    genre_id: 2,
    page: 1,
    per_page: 12,
  },
});
// → http://localhost:8000/api/books?search=harry&genre_id=2&page=1&per_page=12
```

Lebih baik daripada string interpolation manual (auto-encode special chars).

---

## 3. Inkonsistensi: fetch() vs axios

Sebagian besar pakai axios. Tapi `pages/auth/login.jsx` pakai `fetch()`:

```jsx
const response = await fetch('http://localhost:8000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  body: JSON.stringify(formData)
});
const data = await response.json();
```

**Recommendation:** Refactor ke axios untuk konsistensi. Tidak ada alasan khusus untuk fetch di sini.

---

## 4. Error Handling Pattern

### 4.1 Try-catch dengan async/await

```jsx
const fetchData = async () => {
  try {
    setIsLoading(true);
    setError(null);
    const res = await axios.get(URL);
    setData(res.data);
  } catch (err) {
    console.error('Error:', err);
    setError(err.response?.data?.message || 'Gagal memuat data');
  } finally {
    setIsLoading(false);
  }
};
```

### 4.2 .then().catch().finally()

```jsx
axios.get(URL)
  .then(res => setData(res.data))
  .catch(err => console.error(err))
  .finally(() => setLoading(false));
```

### 4.3 Common Error Handling Snippets

#### 401 → Logout
```jsx
try {
  await axios.get(URL, { headers: ... });
} catch (err) {
  if (err.response?.status === 401) {
    localStorage.removeItem('token');
    navigate('/login');
  } else {
    setError(err.response?.data?.message || 'Error');
  }
}
```

#### Validation error (422)
```jsx
catch (err) {
  if (err.response?.status === 422) {
    const errors = err.response.data.errors; // { email: ["..."], ... }
    setErrors(errors);
  }
}
```

#### Network error
```jsx
catch (err) {
  if (!err.response) {
    showToast('Tidak dapat terhubung ke server.', 'error');
  } else {
    showToast(err.response.data.message || 'Server error', 'error');
  }
}
```

---

## 5. Response Structure

### 5.1 Paginator (untuk list endpoint)

Backend return:
```json
{
  "data": [...],
  "current_page": 1,
  "last_page": 5,
  "per_page": 12,
  "total": 60,
  "from": 1,
  "to": 12,
  "first_page_url": "...",
  "last_page_url": "...",
  "next_page_url": "...",
  "prev_page_url": null,
  "path": "...",
  "links": [...]
}
```

Frontend extract:
```jsx
const res = await axios.get(URL);
const items = res.data.data;
const totalPages = res.data.last_page;
const total = res.data.total;
```

### 5.2 Single Resource

Backend return langsung object:
```json
{ "id": 1, "title": "...", ... }
```

Frontend:
```jsx
const book = res.data;
```

### 5.3 Wrapped (custom)

Sebagian endpoint wrap dengan `data` key:
```json
{ "message": "Book created", "data": { ... } }
```

Frontend:
```jsx
const book = res.data.data;
```

### 5.4 Defensive Extraction (Bekerja untuk Semua Format)

Pattern aman untuk handle 3 format di atas:
```jsx
const items = res.data?.data ?? res.data ?? [];
```

Banyak dipakai di codebase.

---

## 6. Authentication Flow

### 6.1 Set token saat login
```jsx
// pages/auth/login.jsx
localStorage.setItem('token', token);
localStorage.setItem('user_id', user.id);
localStorage.setItem('user_name', user.name);
localStorage.setItem('user_role', userRole);
window.dispatchEvent(new Event('authChange'));
```

### 6.2 Gunakan token di setiap request protected
```jsx
const token = localStorage.getItem('token');
axios.get(URL, { headers: { Authorization: `Bearer ${token}` } });
```

### 6.3 Clear saat logout
```jsx
localStorage.removeItem('token');
localStorage.removeItem('user_id');
localStorage.removeItem('user_name');
localStorage.removeItem('user_role');
navigate('/login');
```

### 6.4 Token expired (saat ini tidak handle otomatis)

Sanctum default tidak set expiry pada token. Tapi kalau backend tiba-tiba revoke token (mis. user dihapus), API akan return 401. Frontend perlu handle:

```jsx
catch (err) {
  if (err.response?.status === 401) {
    localStorage.clear();
    navigate('/login', { state: { message: 'Sesi berakhir, silakan login ulang.' } });
  }
}
```

> Belum di-DRY — di-implement per-page yang butuh. Sebaiknya migrate ke axios interceptor global.

---

## 7. Pagination Pattern

### 7.1 Standard pattern

```jsx
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(0);
const [items, setItems] = useState([]);

const fetchItems = async () => {
  const res = await axios.get(URL, {
    params: { page: currentPage, per_page: 10 }
  });
  setItems(res.data.data);
  setTotalPages(res.data.last_page);
};

useEffect(() => { fetchItems(); }, [currentPage]);

// UI:
<button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Prev</button>
<span>Page {currentPage} / {totalPages}</span>
<button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</button>
```

### 7.2 Page numbers dengan ellipsis

Dipakai di Profile orders table & AdminCrudTable:

```jsx
function getPageNumbers(currentPage, lastPage) {
  if (lastPage <= 7) return Array.from({ length: lastPage }, (_, i) => i + 1);
  if (currentPage <= 4)            return [1, 2, 3, 4, 5, '...', lastPage];
  if (currentPage >= lastPage - 3) return [1, '...', lastPage - 4, ..., lastPage];
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage];
}
```

Render:
```jsx
{getPageNumbers(currentPage, lastPage).map((p, i) =>
  p === '...'
    ? <span key={i}>...</span>
    : <button key={p} onClick={() => setPage(p)}>{p}</button>
)}
```

### 7.3 Reset page saat filter berubah

PENTING — kalau filter berubah tapi `currentPage` tetap, bisa error "page out of range":

```jsx
const handleGenreSelect = (id) => {
  setSelectedGenre(id);
  setCurrentPage(1);  // ← reset!
};
```

---

## 8. Search dengan Debounce

```jsx
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearch(searchTerm);
    setCurrentPage(1);  // reset page saat search berubah
  }, 300);
  return () => clearTimeout(handler);
}, [searchTerm]);

useEffect(() => {
  axios.get(URL, { params: { search: debouncedSearch, page: currentPage }});
}, [debouncedSearch, currentPage]);
```

300-400ms biasanya optimal — cukup cepat untuk responsive, cukup lambat untuk skip middle-typing.

---

## 9. Polling Pattern (untuk Chat)

```jsx
useEffect(() => {
  const interval = setInterval(() => {
    axios.get(`${URL}/api/conversations/messages?after=${lastId}`)
      .then(res => {
        const newMsgs = res.data.messages;
        if (newMsgs.length) {
          setMessages(prev => [...prev, ...newMsgs]);
          setLastId(Math.max(...newMsgs.map(m => m.id)));
        }
      })
      .catch(() => {});  // silently fail (jaga UX, log via console saja)
  }, 5000);

  return () => clearInterval(interval);
}, [lastId, open]);
```

Detail: [10-CHAT-WIDGET.md](10-CHAT-WIDGET.md).

---

## 10. CORS

Backend Laravel default CORS di `config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_origins' => ['*'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

Frontend di port `5173` bisa langsung call backend di `8000` tanpa setup tambahan.

> Untuk production, **batasi `allowed_origins`** ke domain frontend Anda saja (security).

---

## 11. Recommended Future Improvements

### 11.1 Axios Interceptor Global

Setup di `main.jsx`:

```jsx
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

// Request interceptor: auto-attach token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle 401 global
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
```

Benefit:
- Tidak perlu manual attach token di setiap call
- Auto-logout saat 401
- Single source of truth untuk base URL

### 11.2 API Service Layer

Daripada axios calls scattered di components, group per-resource:

```js
// src/services/booksApi.js
import axios from 'axios';

export const fetchBooks = (params) => axios.get('/api/books', { params });
export const fetchBook = (id) => axios.get(`/api/books/${id}`);
export const createBook = (data) => axios.post('/api/books', data);
export const updateBook = (id, data) => axios.put(`/api/books/${id}`, data);
export const deleteBook = (id) => axios.delete(`/api/books/${id}`);
```

Page jadi lebih clean:
```jsx
import { fetchBooks } from '../../services/booksApi';

useEffect(() => {
  fetchBooks({ search, page }).then(res => setBooks(res.data.data));
}, []);
```

### 11.3 React Query Migration

Pertimbangkan migrasi ke `@tanstack/react-query` untuk:
- Auto-caching dengan stale-while-revalidate
- Built-in loading/error/refetching states
- Deduplication request
- Optimistic updates
- Pagination & infinite scroll helpers

Sangat worth it kalau jumlah data fetching point > 20.

### 11.4 Standardize Base URL

Pilih SATU pattern (env include `/api`), refactor semua file, tambahkan helper:

```js
// src/utils/url.js
export const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const ASSET = API.replace('/api', '');

// Usage:
axios.get(`${API}/books`);
img.src = `${ASSET}/storage/covers/${file}`;
```

---

## 12. Testing API Calls

### 12.1 Manual dari DevTools

```js
// Buka Console di /admin
const token = localStorage.getItem('token');
const res = await fetch('http://localhost:8000/api/dashboard', {
  headers: { Authorization: `Bearer ${token}` }
});
console.log(await res.json());
```

### 12.2 cURL

```bash
TOKEN="paste-token"
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/dashboard
```

### 12.3 Postman / Insomnia

Import collection (belum ada di repo — bisa di-export dari Postman).

---

## Berikutnya

- Mau tahu design system? → [08-DESIGN-SYSTEM.md](08-DESIGN-SYSTEM.md)
- Mau tahu detail Midtrans? → [09-MIDTRANS-SNAP-FLOW.md](09-MIDTRANS-SNAP-FLOW.md)
