import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Send, Paperclip } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
          <img src={msg.attachment_url} alt="lampiran" className="max-w-[160px] rounded-[10px] cursor-pointer border border-hairline"
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

export default function AdminContacts() {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const authAxios = useCallback((cfg) => axios({ ...cfg, headers }), [token]);

  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  const fetchConversations = useCallback(() => {
    authAxios({ method: 'get', url: `${API_URL}/api/admin/conversations` })
      .then(res => {
        setConversations(res.data);
        setTotalUnread(res.data.reduce((s, c) => s + c.unread_count, 0));
      }).catch(() => {});
  }, []);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  const openConversation = (conv) => {
    setSelected(conv);
    authAxios({ method: 'get', url: `${API_URL}/api/admin/conversations/${conv.id}` })
      .then(res => {
        setMessages(res.data.messages);
        authAxios({ method: 'put', url: `${API_URL}/api/admin/conversations/${conv.id}/read` }).catch(() => {});
        fetchConversations();
      }).catch(() => {});
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendReply = async (payload) => {
    if (!selected) return;
    setSending(true);
    try {
      const res = await (payload instanceof FormData
        ? axios.post(`${API_URL}/api/admin/conversations/${selected.id}/messages`, payload, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } })
        : authAxios({ method: 'post', url: `${API_URL}/api/admin/conversations/${selected.id}/messages`, data: payload }));
      setMessages(prev => [...prev, res.data]);
      setText('');
      fetchConversations();
    } catch { alert('Gagal mengirim.'); }
    finally { setSending(false); }
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
  };

  return (
    <div className="flex h-full gap-0 -m-8 overflow-hidden rounded-[20px]">
      {/* Conversation list */}
      <div className="w-72 flex-shrink-0 border-r border-hairline overflow-y-auto bg-canvas">
        <div className="p-4 border-b border-hairline">
          <h2 className="font-semibold text-ink text-sm flex items-center gap-2">
            Pesan Masuk
            {totalUnread > 0 && (
              <span className="bg-rausch text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{totalUnread}</span>
            )}
          </h2>
        </div>
        {conversations.length === 0 && (
          <p className="text-center text-muted text-xs mt-8 px-4">Belum ada percakapan.</p>
        )}
        {conversations.map(conv => (
          <button key={conv.id} onClick={() => openConversation(conv)}
            className={`w-full text-left px-4 py-3 border-b border-hairline hover:bg-surface-soft transition-colors ${selected?.id === conv.id ? 'bg-surface-soft' : ''}`}>
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-sm text-ink truncate">{conv.user.name}</p>
              {conv.unread_count > 0 && (
                <span className="bg-rausch text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">{conv.unread_count}</span>
              )}
            </div>
            <p className="text-xs text-muted truncate mt-0.5">{conv.last_message || 'Belum ada pesan'}</p>
          </button>
        ))}
      </div>

      {/* Message thread */}
      <div className="flex-1 flex flex-col overflow-hidden bg-canvas">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted text-sm">Pilih percakapan untuk memulai</p>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-hairline bg-canvas flex-shrink-0">
              <p className="font-semibold text-sm text-ink">{selected.user.name}</p>
              <p className="text-xs text-muted">{selected.user.email}</p>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={handleSend} className="border-t border-hairline px-3 py-2 flex items-center gap-2 bg-canvas flex-shrink-0">
              <button type="button" onClick={() => fileRef.current?.click()} className="text-muted hover:text-ink transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleImage} />
              <input type="text" value={text} onChange={e => setText(e.target.value)}
                placeholder="Tulis balasan..." disabled={sending}
                className="flex-1 text-sm bg-surface-soft rounded-full px-3 py-1.5 border border-hairline focus:outline-none focus:border-ink" />
              <button type="submit" disabled={sending || !text.trim()} className="text-rausch disabled:opacity-40">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
