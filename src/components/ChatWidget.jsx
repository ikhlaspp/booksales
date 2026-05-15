import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Paperclip, Link2, ChevronDown } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function TransactionCard({ transaction }) {
  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    dibayar: 'bg-blue-100 text-blue-800',
    dikirim: 'bg-purple-100 text-purple-800',
    selesai: 'bg-green-100 text-green-800',
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

function MessageBubble({ msg }) {
  const isUser = msg.sender_type === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {msg.type === 'text' && (
          <div className={`px-3 py-2 rounded-[14px] text-sm leading-relaxed ${isUser ? 'bg-rausch text-white rounded-br-[4px]' : 'bg-surface-soft text-ink rounded-bl-[4px]'}`}>
            {msg.body}
          </div>
        )}
        {msg.type === 'image' && msg.attachment_url && (
          <img
            src={msg.attachment_url} alt="lampiran"
            className="max-w-[180px] rounded-[10px] cursor-pointer object-cover border border-hairline"
            onClick={() => window.open(msg.attachment_url, '_blank')}
          />
        )}
        {msg.type === 'transaction' && msg.transaction && (
          <TransactionCard transaction={msg.transaction} />
        )}
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

export default function ChatWidget() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role');
  if (!token || role !== 'user') return null;

  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [notification, setNotification] = useState(null);
  const [userTransactions, setUserTransactions] = useState([]);
  const [showTxPicker, setShowTxPicker] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const headers = { Authorization: `Bearer ${token}` };

  const authAxios = useCallback((config) => axios({ ...config, headers }), [token]);

  useEffect(() => {
    authAxios({ method: 'get', url: `${API_URL}/api/conversations` }).then(res => {
      setConversationId(res.data.conversation_id);
      setMessages(res.data.messages);
      const ids = res.data.messages.map(m => m.id);
      if (ids.length) setLastId(Math.max(...ids));
      const unread = res.data.messages.filter(m => m.sender_type === 'admin' && !m.is_read).length;
      setUnreadCount(unread);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    authAxios({ method: 'get', url: `${API_URL}/api/user/transactions` })
      .then(res => setUserTransactions(res.data.data || res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      authAxios({ method: 'get', url: `${API_URL}/api/conversations/messages?after=${lastId}` })
        .then(res => {
          const newMsgs = res.data.messages;
          if (!newMsgs.length) return;
          setMessages(prev => [...prev, ...newMsgs]);
          const maxId = Math.max(...newMsgs.map(m => m.id));
          setLastId(maxId);
          const newAdminMsgs = newMsgs.filter(m => m.sender_type === 'admin');
          if (newAdminMsgs.length > 0) {
            setUnreadCount(c => c + newAdminMsgs.length);
            if (!open) {
              setNotification(newAdminMsgs[newAdminMsgs.length - 1].body?.slice(0, 50) ?? 'Pesan baru');
              setTimeout(() => setNotification(null), 6000);
            }
          }
        }).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [lastId, open]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
      setNotification(null);
      if (conversationId) {
        authAxios({ method: 'put', url: `${API_URL}/api/conversations/read` }).catch(() => {});
      }
    }
  }, [open, messages.length]);

  const sendMessage = async (payload) => {
    setSending(true);
    try {
      const res = await (payload instanceof FormData
        ? axios.post(`${API_URL}/api/conversations/messages`, payload, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } })
        : authAxios({ method: 'post', url: `${API_URL}/api/conversations/messages`, data: payload }));
      setMessages(prev => [...prev, res.data]);
      setLastId(res.data.id);
      setText('');
    } catch (e) {
      alert('Gagal mengirim pesan. Coba lagi.');
    } finally {
      setSending(false);
    }
  };

  const handleSendText = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage({ type: 'text', body: text.trim() });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('type', 'image');
    fd.append('attachment', file);
    sendMessage(fd);
  };

  const handleTransaction = (tx) => {
    setShowTxPicker(false);
    sendMessage({ type: 'transaction', transaction_id: tx.id });
  };

  return (
    <>
      {/* Notification toast */}
      {notification && !open && (
        <div
          onClick={() => { setOpen(true); setNotification(null); }}
          className="fixed bottom-24 right-6 z-50 bg-ink text-white rounded-[14px] px-4 py-3 shadow-lg cursor-pointer max-w-[260px] text-sm animate-fade-in"
        >
          <p className="font-semibold text-xs mb-0.5">Pesan baru dari Admin</p>
          <p className="text-white/80 text-xs truncate">{notification}...</p>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-rausch text-white rounded-full shadow-lg flex items-center justify-center hover:bg-rausch-active transition-colors"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-ink text-white rounded-full text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] h-[480px] bg-canvas border border-hairline rounded-[20px] shadow-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-hairline bg-canvas flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-ink">Chat dengan Admin</p>
              <p className="text-xs text-muted">BookSales Support</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted hover:text-ink transition-colors">
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <p className="text-center text-muted text-xs mt-8">Mulai percakapan dengan admin.</p>
            )}
            {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
            <div ref={bottomRef} />
          </div>

          {/* Transaction picker */}
          {showTxPicker && (
            <div className="border-t border-hairline px-3 py-2 bg-surface-soft max-h-32 overflow-y-auto">
              <p className="text-xs font-semibold text-muted mb-2">Pilih Transaksi</p>
              {userTransactions.length === 0 && <p className="text-xs text-muted">Belum ada transaksi.</p>}
              {userTransactions.map(tx => (
                <button key={tx.id} onClick={() => handleTransaction(tx)}
                  className="w-full text-left text-xs p-2 hover:bg-surface-strong rounded mb-1 border border-hairline">
                  #{tx.order_number} — {tx.status}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <form onSubmit={handleSendText} className="border-t border-hairline px-3 py-2 flex items-center gap-2 bg-canvas">
            <button type="button" onClick={() => fileRef.current?.click()} className="text-muted hover:text-ink transition-colors flex-shrink-0">
              <Paperclip className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => setShowTxPicker(v => !v)} className="text-muted hover:text-ink transition-colors flex-shrink-0">
              <Link2 className="w-4 h-4" />
            </button>
            <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleImage} />
            <input
              type="text" value={text} onChange={e => setText(e.target.value)}
              placeholder="Ketik pesan..." disabled={sending}
              className="flex-1 text-sm bg-surface-soft rounded-full px-3 py-1.5 border border-hairline focus:outline-none focus:border-ink"
            />
            <button type="submit" disabled={sending || !text.trim()} className="text-rausch disabled:opacity-40 flex-shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
