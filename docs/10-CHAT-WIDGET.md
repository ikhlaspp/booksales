# 10 — Chat Widget (Frontend)

> Komponen `<ChatWidget />` adalah widget floating chat di kanan-bawah halaman publik. User (bukan admin) bisa chat dengan admin secara real-time-ish via polling 5 detik. Mendukung text, image attachment, dan transaction reference.

---

## 1. Lokasi & Trigger

**File:** [`src/components/ChatWidget.jsx`](../src/components/ChatWidget.jsx)

**Render:** Di [`src/layouts/public.jsx`](../src/layouts/public.jsx) baris 4 & 32:
```jsx
import ChatWidget from '../components/ChatWidget';

return (
  <div>
    <Navbar />
    <Outlet />
    <Footer />
    <ChatWidget />   {/* ← Selalu render di public layout */}
  </div>
);
```

**Conditional render:** Inside ChatWidget itself:
```jsx
export default function ChatWidget() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role');
  if (!token || role !== 'user') return null;   // hanya muncul untuk user logged in
  return <ChatWidgetInner token={token} />;
}
```

Sehingga widget:
- ✅ Tampil untuk user yang sudah login dengan role `user`
- ❌ Tidak tampil untuk admin (admin pakai `/admin/contacts` inbox)
- ❌ Tidak tampil untuk guest (belum login)
- ❌ Tidak tampil di admin pages (admin layout tidak include `<ChatWidget />`)

---

## 2. UI Components

### 2.1 Floating Button

```
┌──────────────────────┐
│                      │
│       Halaman        │
│                      │
│                  ┌──┐│
│                  │💬││ ← Floating button (bottom-right)
│                  └──┘│  + unread badge (top-right corner)
└──────────────────────┘
```

```jsx
<button className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-rausch text-white rounded-full shadow-lg">
  {open ? <X /> : <MessageCircle />}
  {!open && unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 ...">{unreadCount > 9 ? '9+' : unreadCount}</span>
  )}
</button>
```

### 2.2 Chat Panel (saat dibuka)

```
            ┌─────────────────────────┐
            │ Chat dengan Admin   [▼] │ ← Header
            │ PustakaIkhlas Support   │
            ├─────────────────────────┤
            │ User:  Halo admin       │
            │              (kanan)    │
            │ Admin:  Halo, ada apa?  │
            │ (kiri)                  │
            │ User:  [Transaksi card] │
            │              (kanan)    │
            ├─────────────────────────┤
            │ [📎][🔗] Tulis... [▶]   │ ← Input bar
            └─────────────────────────┘
```

Size: 340×480px, positioned `fixed bottom-24 right-6`.

### 2.3 Notification Toast

Saat panel tertutup dan ada pesan baru dari admin:

```
            ┌──────────────────────┐
            │ Pesan baru dari Admin│ ← Toast (atas floating button)
            │ Halo, ada yang bisa  │
            │ dibantu? ...         │
            └──────────────────────┘
                              ↓
                            ┌──┐
                            │💬│
                            └──┘
```

Click toast → buka chat panel.

---

## 3. State Management

```jsx
const [open, setOpen] = useState(false);              // Panel terbuka?
const [conversationId, setConversationId] = useState(null);
const [messages, setMessages] = useState([]);
const [lastId, setLastId] = useState(0);              // Tracking polling
const [text, setText] = useState('');                 // Input text
const [sending, setSending] = useState(false);
const [notification, setNotification] = useState(null);   // Toast text
const [userTransactions, setUserTransactions] = useState([]);
const [showTxPicker, setShowTxPicker] = useState(false);
const [unreadCount, setUnreadCount] = useState(0);    // Badge angka
const bottomRef = useRef(null);                       // Auto-scroll
const fileRef = useRef(null);                         // File input
const notifTimerRef = useRef(null);                   // Timeout untuk hide toast
```

---

## 4. Lifecycle

### 4.1 Mount: Load Conversation + Transactions

```jsx
// Load conversation history (initial)
useEffect(() => {
  authAxios({ method: 'get', url: `${API_URL}/api/conversations` })
    .then(res => {
      setConversationId(res.data.conversation_id);
      setMessages(res.data.messages);

      // Track lastId untuk polling
      const ids = res.data.messages.map(m => m.id);
      if (ids.length) setLastId(Math.max(...ids));

      // Count unread admin messages
      const unread = res.data.messages.filter(m => m.sender_type === 'admin' && !m.is_read).length;
      setUnreadCount(unread);
    })
    .catch(() => {});
}, []);

// Load user transactions untuk transaction picker
useEffect(() => {
  authAxios({ method: 'get', url: `${API_URL}/api/user/transactions` })
    .then(res => setUserTransactions(res.data.data || res.data || []))
    .catch(() => {});
}, []);
```

### 4.2 Polling Loop (setiap 5 detik)

```jsx
useEffect(() => {
  const interval = setInterval(() => {
    authAxios({ method: 'get', url: `${API_URL}/api/conversations/messages?after=${lastId}` })
      .then(res => {
        const newMsgs = res.data.messages;
        if (!newMsgs.length) return;

        // Append messages baru
        setMessages(prev => [...prev, ...newMsgs]);
        const maxId = Math.max(...newMsgs.map(m => m.id));
        setLastId(maxId);

        // Handle unread + notification
        const newAdminMsgs = newMsgs.filter(m => m.sender_type === 'admin');
        if (newAdminMsgs.length > 0) {
          setUnreadCount(c => c + newAdminMsgs.length);

          // Show toast jika panel tertutup
          if (!open) {
            setNotification(newAdminMsgs[newAdminMsgs.length - 1].body?.slice(0, 50) ?? 'Pesan baru');

            // Auto-hide setelah 6 detik
            if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
            notifTimerRef.current = setTimeout(() => setNotification(null), 6000);
          }
        }
      })
      .catch(() => {});  // silent fail
  }, 5000);

  return () => clearInterval(interval);
}, [lastId, open]);
```

**Key behaviors:**
- Poll dengan `?after={lastId}` → backend return hanya message dengan `id > lastId`
- Update `lastId` ke max id baru
- Tambah unread count
- Show toast notification jika panel ditutup
- Silent fail (jangan toast error setiap polling fail — annoying UX)

### 4.3 Auto Mark-as-Read saat Panel Dibuka

```jsx
useEffect(() => {
  if (open) {
    setUnreadCount(0);
    setNotification(null);
    if (conversationId) {
      authAxios({ method: 'put', url: `${API_URL}/api/conversations/read` }).catch(() => {});
    }
  }
}, [open]);
```

User buka panel → backend mark semua admin message sebagai dibaca + reset frontend state.

### 4.4 Auto-Scroll ke Bottom saat Ada Pesan Baru

```jsx
useEffect(() => {
  if (open) {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages]);
```

`bottomRef` adalah `<div ref={bottomRef} />` di akhir list message — `scrollIntoView` mendorong viewport ke sana.

---

## 5. Send Message

### 5.1 Text

```jsx
const handleSendText = (e) => {
  e.preventDefault();
  if (!text.trim()) return;
  sendMessage({ type: 'text', body: text.trim() });
};
```

Dispatch ke `sendMessage()`:
```jsx
const sendMessage = async (payload) => {
  setSending(true);
  try {
    const res = await (payload instanceof FormData
      ? axios.post(`${API_URL}/api/conversations/messages`, payload, {
          headers: { ...headers, 'Content-Type': 'multipart/form-data' }
        })
      : authAxios({ method: 'post', url: `${API_URL}/api/conversations/messages`, data: payload })
    );
    setMessages(prev => [...prev, res.data]);
    setLastId(res.data.id);
    setText('');
  } catch (e) {
    alert('Gagal mengirim pesan. Coba lagi.');
  } finally {
    setSending(false);
  }
};
```

### 5.2 Image

```jsx
const handleImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const fd = new FormData();
  fd.append('type', 'image');
  fd.append('attachment', file);
  sendMessage(fd);
};
```

Trigger via `<input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleImage} />` dan paperclip button:
```jsx
<button type="button" onClick={() => fileRef.current?.click()}>
  <Paperclip />
</button>
```

### 5.3 Transaction Reference

```jsx
const handleTransaction = (tx) => {
  setShowTxPicker(false);
  sendMessage({ type: 'transaction', transaction_id: tx.id });
};
```

User klik link icon → toggle `showTxPicker` → list user's transactions → klik salah satu → send.

```jsx
{showTxPicker && (
  <div className="border-t border-hairline px-3 py-2 bg-surface-soft max-h-32 overflow-y-auto">
    <p className="text-xs font-semibold text-muted mb-2">Pilih Transaksi</p>
    {userTransactions.map(tx => (
      <button key={tx.id} onClick={() => handleTransaction(tx)} className="...">
        #{tx.order_number} — {tx.status}
      </button>
    ))}
  </div>
)}
```

---

## 6. Render Message Bubbles

```jsx
function MessageBubble({ msg }) {
  const isUser = msg.sender_type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className="max-w-[75%] flex flex-col gap-1">
        {/* Text */}
        {msg.type === 'text' && (
          <div className={`px-3 py-2 rounded-[14px] text-sm ${
            isUser ? 'bg-rausch text-white rounded-br-[4px]' : 'bg-surface-soft text-ink rounded-bl-[4px]'
          }`}>
            {msg.body}
          </div>
        )}

        {/* Image */}
        {msg.type === 'image' && msg.attachment_url && (
          <img
            src={msg.attachment_url}
            alt="lampiran"
            className="max-w-[180px] rounded-[10px] cursor-pointer object-cover border border-hairline"
            onClick={() => window.open(msg.attachment_url, '_blank')}
          />
        )}

        {/* Transaction card */}
        {msg.type === 'transaction' && msg.transaction && (
          <TransactionCard transaction={msg.transaction} />
        )}

        {/* Timestamp + read receipt */}
        <div className="flex items-center gap-1 px-1">
          <span className="text-[10px] text-muted">
            {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isUser && (
            <span className="text-[10px] text-muted">{msg.is_read ? '✓✓' : '✓'}</span>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Read receipt convention
- `✓` (single) = sent, belum dibaca admin
- `✓✓` (double) = sudah dibaca admin

Mirip WhatsApp style.

### TransactionCard

```jsx
function TransactionCard({ transaction }) {
  const statusColor = {
    pending:    'bg-yellow-100 text-yellow-800',
    dibayar:    'bg-blue-100 text-blue-800',
    dikirim:    'bg-purple-100 text-purple-800',
    selesai:    'bg-green-100 text-green-800',
    dibatalkan: 'bg-red-100 text-red-800',
  }[transaction.status] ?? 'bg-gray-100 text-gray-800';

  return (
    <div className="border border-hairline rounded-[8px] p-3 bg-surface-soft text-sm max-w-[220px]">
      <p className="font-semibold text-ink text-xs mb-1">Transaksi #{transaction.order_number}</p>
      <p className="text-muted text-xs">Rp {Number(transaction.total_amount).toLocaleString('id-ID')}</p>
      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
        {transaction.status}
      </span>
    </div>
  );
}
```

---

## 7. API Endpoints yang Dipakai

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| `GET` | `/api/conversations` | Load conversation + initial messages |
| `GET` | `/api/conversations/messages?after={id}` | Polling pesan baru |
| `POST` | `/api/conversations/messages` | Kirim pesan (text/image/transaction) |
| `PUT` | `/api/conversations/read` | Mark admin messages as read |
| `GET` | `/api/user/transactions` | Load list untuk transaction picker |

Backend detail: [`../../booksales-api-laravel/docs/07-CHAT-SYSTEM.md`](../../booksales-api-laravel/docs/07-CHAT-SYSTEM.md).

---

## 8. Performance Considerations

### Network overhead
- 1 polling request per 5 detik
- Bandwidth per polling: ~1KB (header) + payload (kosong jika tidak ada pesan baru)
- Untuk 100 user aktif: 20 req/sec ke backend — trivial

### Memory
- `messages` array grow over time (semua history loaded ke memory)
- Untuk percakapan > 1000 messages, bisa jadi heavy
- **Improvement potensial**: implement virtualization (react-window) atau lazy-load older messages saat scroll up

### React re-render
- Setiap polling fire setState → re-render seluruh widget
- Bisa di-optimize dengan `useMemo` untuk derived values + `React.memo` untuk MessageBubble

---

## 9. Customization

### Ubah polling interval

```jsx
setInterval(..., 10000);   // 10 detik (lebih hemat)
setInterval(..., 3000);    // 3 detik (lebih responsive)
```

Default 5 detik adalah middle ground.

### Ubah toast auto-hide duration

```jsx
notifTimerRef.current = setTimeout(() => setNotification(null), 10000);  // 10 detik
```

Default 6 detik.

### Ubah max widget size

```jsx
<div className="fixed bottom-24 right-6 z-50 w-[400px] h-[600px] ...">
```

Default 340×480px.

---

## 10. Sisi Admin: `/admin/contacts`

Counterpart admin di [`src/pages/admin/contacts/index.jsx`](../src/pages/admin/contacts/index.jsx). Lihat [06-PAGES.md](06-PAGES.md#admincontacts-inbox-chat) untuk detail.

Key differences:
- Layout 2-panel (sidebar users + chat content)
- List SEMUA user (bukan hanya yang punya conversation)
- Tidak ada transaction picker (admin tidak punya order)
- Polling hanya untuk inbox refresh (5s), bukan untuk per-conversation messages (manual refresh saat klik user)

---

## 11. Future Improvements

| Improvement | Benefit |
|-------------|---------|
| WebSocket migration | Real real-time, no polling overhead |
| Typing indicator | Lebih engaging UX |
| Push notification | Notif walaupun tab tidak aktif |
| Sound notification | Audio alert untuk pesan baru |
| Emoji picker | Lebih ekspresif |
| Reply ke pesan spesifik | Threading |
| Edit/delete own message | Standard chat feature |
| Search dalam history | Find old messages |
| Voice note | Audio messages |
| Multi-image upload | Saat ini cuma 1 image per pesan |

---

## 12. Troubleshooting

| Gejala | Solusi |
|--------|--------|
| Widget tidak muncul | Cek `localStorage.token` dan `localStorage.user_role` (harus `'user'`) |
| Polling tidak update | Cek Network tab. Pastikan `?after={lastId}` request fire setiap 5s |
| Pesan terkirim tapi tidak muncul di list | Backend response format berubah. Cek `res.data` structure |
| Attachment 404 | Backend belum jalankan `php artisan storage:link`. Lihat backend setup |
| Polling spam (lebih dari 1/5s) | Multiple useEffect issue — pastikan `lastId` deps di useEffect correct |
| Notification toast stuck | Timer reference issue — pastikan `clearTimeout` di-call sebelum setTimeout baru |

---

## Berikutnya

- Ada masalah umum? → [11-TROUBLESHOOTING.md](11-TROUBLESHOOTING.md)
- Kembali ke [README.md](../README.md)
