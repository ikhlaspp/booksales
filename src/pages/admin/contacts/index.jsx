import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Send, Paperclip, Search, MessageCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const PAGE_SIZE = 8;

function MessageBubble({ msg }) {
  const isAdmin = msg.sender_type === 'admin';
  return (
    <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className="max-w-[75%] flex flex-col gap-1">
        {msg.type === 'text' && (
          <div className={`px-3 py-2 rounded-[14px] text-sm leading-relaxed ${isAdmin ? 'bg-rausch text-white rounded-br-[4px]' : 'bg-surface-soft text-ink rounded-bl-[4px]'}`}>
            {msg.body}
          </div>
        )}
        {msg.type === 'image' && msg.attachment_url && (
          <img src={msg.attachment_url} alt="lampiran"
            className="max-w-[160px] rounded-[10px] cursor-pointer border border-hairline"
            onClick={() => window.open(msg.attachment_url, '_blank')} />
        )}
        {msg.type === 'transaction' && msg.transaction && (
          <div className="border border-hairline rounded-[8px] p-3 bg-surface-soft text-xs max-w-[200px]">
            <p className="font-semibold mb-1">#{msg.transaction.order_number}</p>
            <p className="text-muted">Rp {Number(msg.transaction.total_amount).toLocaleString('id-ID')}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-surface-strong rounded-full text-xs">{msg.transaction.status}</span>
          </div>
        )}
        <div className="flex items-center gap-1 px-1">
          <span className="text-[10px] text-muted">
            {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isAdmin && <span className="text-[10px] text-muted">{msg.is_read ? '✓✓' : '✓'}</span>}
        </div>
      </div>
    </div>
  );
}

function Avatar({ name, size = 'sm' }) {
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-sm';
  return (
    <div className={`${sizeClass} rounded-full bg-rausch/10 text-rausch flex items-center justify-center font-semibold flex-shrink-0`}>
      {name?.charAt(0).toUpperCase() ?? '?'}
    </div>
  );
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export default function AdminContacts() {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const authAxios = useCallback((cfg) => axios({ ...cfg, headers }), [token]);

  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null); // { userId, userName, userEmail, conv | null }
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  const fetchUsers = useCallback(() => {
    authAxios({ method: 'get', url: `${API_URL}/api/users`, params: { role: 'user', per_page: 100 } })
      .then(res => {
        setUsers(res.data?.data ?? res.data ?? []);
      }).catch(() => {});
  }, [authAxios]);

  const fetchConversations = useCallback(() => {
    authAxios({ method: 'get', url: `${API_URL}/api/admin/conversations` })
      .then(res => {
        setConversations(res.data ?? []);
        setTotalUnread((res.data ?? []).reduce((s, c) => s + (c.unread_count ?? 0), 0));
      }).catch(() => {});
  }, [authAxios]);

  useEffect(() => {
    fetchUsers();
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [fetchUsers, fetchConversations]);

  // Gabungkan semua user dengan data conversation (jika ada)
  // Urutan: user yang punya pesan terbaru dulu, sisanya alphabetical
  const mergedList = useMemo(() => {
    const convByUserId = {};
    conversations.forEach(c => { convByUserId[c.user.id] = c; });

    return users
      .map(u => ({
        userId: u.id,
        userName: u.name,
        userEmail: u.email,
        conv: convByUserId[u.id] ?? null,
      }))
      .sort((a, b) => {
        const tA = a.conv?.last_at ? new Date(a.conv.last_at).getTime() : 0;
        const tB = b.conv?.last_at ? new Date(b.conv.last_at).getTime() : 0;
        if (tB !== tA) return tB - tA;                    // terbaru dulu
        return a.userName.localeCompare(b.userName, 'id'); // tie: alphabetical
      });
  }, [users, conversations]);

  const filtered = useMemo(() =>
    mergedList.filter(item =>
      item.userName.toLowerCase().includes(search.toLowerCase())
    ), [mergedList, search]);

  // Reset ke halaman pertama setiap kali search berubah
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [search]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  const openUser = (item) => {
    setSelected(item);
    setMessages([]);
    if (!item.conv) return; // belum ada conversation
    authAxios({ method: 'get', url: `${API_URL}/api/admin/conversations/${item.conv.id}` })
      .then(res => {
        setMessages(res.data.messages ?? []);
        authAxios({ method: 'put', url: `${API_URL}/api/admin/conversations/${item.conv.id}/read` }).catch(() => {});
        fetchConversations();
      }).catch(() => {});
  };

  // Sync selected item saat conversations di-refresh (update unread badge dll)
  useEffect(() => {
    if (!selected) return;
    const conv = conversations.find(c => c.user.id === selected.userId) ?? null;
    setSelected(prev => prev ? { ...prev, conv } : prev);
  }, [conversations]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendReply = async (payload) => {
    if (!selected?.conv) return;
    setSending(true);
    try {
      const res = await (payload instanceof FormData
        ? axios.post(
            `${API_URL}/api/admin/conversations/${selected.conv.id}/messages`,
            payload,
            { headers: { ...headers, 'Content-Type': 'multipart/form-data' } }
          )
        : authAxios({
            method: 'post',
            url: `${API_URL}/api/admin/conversations/${selected.conv.id}/messages`,
            data: payload,
          }));
      setMessages(prev => [...prev, res.data]);
      setText('');
      fetchConversations();
    } catch {
      alert('Gagal mengirim.');
    } finally {
      setSending(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendReply({ type: 'text', body: text.trim() });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('type', 'image');
    fd.append('attachment', file);
    sendReply(fd);
    e.target.value = '';
  };

  return (
    <div className="flex h-full gap-0 -m-8 overflow-hidden rounded-[20px]">

      {/* ── Sidebar kiri ── */}
      <div className="w-72 flex-shrink-0 border-r border-hairline flex flex-col bg-canvas">

        {/* Header */}
        <div className="px-4 py-3 border-b border-hairline flex-shrink-0">
          <h2 className="font-semibold text-ink text-sm flex items-center gap-2">
            Semua Pengguna
            {totalUnread > 0 && (
              <span className="bg-rausch text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {totalUnread}
              </span>
            )}
          </h2>
          <p className="text-[11px] text-muted mt-0.5">{users.length} pengguna terdaftar</p>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-hairline flex-shrink-0">
          <div className="flex items-center gap-2 bg-surface-soft rounded-full px-3 py-1.5 border border-hairline">
            <Search className="w-3.5 h-3.5 text-muted flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama pengguna..."
              className="flex-1 text-xs bg-transparent focus:outline-none text-ink placeholder:text-muted"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-muted hover:text-ink text-[10px] leading-none">
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Daftar user */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <MessageCircle className="w-8 h-8 text-muted opacity-30 mb-2" />
              <p className="text-muted text-xs">Pengguna tidak ditemukan.</p>
            </div>
          ) : (
            <>
              {visible.map(item => (
                <button
                  key={item.userId}
                  onClick={() => openUser(item)}
                  className={`w-full text-left px-3 py-3 border-b border-hairline hover:bg-surface-soft transition-colors ${selected?.userId === item.userId ? 'bg-surface-soft' : ''}`}
                >
                  <div className="flex items-start gap-2.5">
                    <Avatar name={item.userName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className="font-medium text-sm text-ink truncate leading-tight">
                          {item.userName}
                        </p>
                        {item.conv?.last_at && (
                          <span className="text-[10px] text-muted flex-shrink-0 mt-0.5">
                            {formatTime(item.conv.last_at)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-1 mt-0.5">
                        <p className={`text-xs truncate ${item.conv ? 'text-muted' : 'text-muted/50 italic'}`}>
                          {item.conv ? (item.conv.last_message || 'Belum ada pesan') : 'Belum memulai percakapan'}
                        </p>
                        {item.conv?.unread_count > 0 && (
                          <span className="bg-rausch text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                            {item.conv.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {/* Tombol lihat lebih banyak */}
              {hasMore && (
                <button
                  onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                  className="w-full py-2.5 text-xs text-rausch font-medium hover:bg-surface-soft transition-colors border-b border-hairline"
                >
                  Lihat {Math.min(PAGE_SIZE, filtered.length - visibleCount)} pengguna lainnya
                </button>
              )}

              {/* Indikator total */}
              {!hasMore && filtered.length > PAGE_SIZE && (
                <p className="text-center text-[10px] text-muted py-2.5">
                  Semua {filtered.length} pengguna ditampilkan
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Panel kanan ── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-canvas">
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
            <MessageCircle className="w-12 h-12 text-muted opacity-20" />
            <p className="text-muted text-sm">Pilih pengguna untuk melihat percakapan</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-4 py-3 border-b border-hairline bg-canvas flex-shrink-0 flex items-center gap-3">
              <Avatar name={selected.userName} size="md" />
              <div>
                <p className="font-semibold text-sm text-ink leading-tight">{selected.userName}</p>
                <p className="text-xs text-muted">{selected.userEmail}</p>
              </div>
            </div>

            {/* Pesan */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {!selected.conv ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                  <MessageCircle className="w-10 h-10 text-muted opacity-20" />
                  <p className="text-sm text-muted">Pengguna ini belum memulai percakapan.</p>
                  <p className="text-xs text-muted opacity-60">Percakapan akan muncul setelah pengguna mengirim pesan pertama.</p>
                </div>
              ) : (
                <>
                  {messages.length === 0 && (
                    <p className="text-center text-xs text-muted mt-8">Belum ada pesan.</p>
                  )}
                  {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
                  <div ref={bottomRef} />
                </>
              )}
            </div>

            {/* Form kirim — hanya tampil jika ada conversation */}
            {selected.conv && (
              <form
                onSubmit={handleSend}
                className="border-t border-hairline px-3 py-2 flex items-center gap-2 bg-canvas flex-shrink-0"
              >
                <button type="button" onClick={() => fileRef.current?.click()} className="text-muted hover:text-ink transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
                <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleImage} />
                <input
                  type="text"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Tulis balasan..."
                  disabled={sending}
                  className="flex-1 text-sm bg-surface-soft rounded-full px-3 py-1.5 border border-hairline focus:outline-none focus:border-ink"
                />
                <button type="submit" disabled={sending || !text.trim()} className="text-rausch disabled:opacity-40">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
