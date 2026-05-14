import { useEffect } from 'react';

const formatRupiah = (amount) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount ?? 0);

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(d);
};

export default function TransactionDetailModal({ isOpen, onClose, transaction }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div 
        className="bg-canvas w-full max-w-2xl rounded-lg shadow-xl flex flex-col overflow-hidden animate-fadeInUp"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-hairline-soft flex items-start justify-between bg-surface-soft shrink-0">
          <div>
            <h2 className="text-title-lg font-bold text-ink">Detail Transaksi</h2>
            <p className="text-body-sm text-muted mt-1">No Pesanan: <span className="font-semibold text-ink">{transaction.order_number}</span></p>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-ink transition-colors p-2 -mr-2 -mt-2 rounded-full hover:bg-hairline"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-micro-label font-bold text-muted uppercase tracking-wider mb-1">Informasi Pesanan</p>
              <div className="space-y-2 text-body-sm">
                <div className="flex flex-col">
                  <span className="text-muted">Tanggal Dibuat</span>
                  <span className="font-medium text-ink">{formatDate(transaction.created_at)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted">Status Pesanan</span>
                  <span className="font-medium text-ink uppercase">{transaction.status}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted">Tipe Pembayaran</span>
                  <span className="font-medium text-ink">{transaction.payment_type ? transaction.payment_type.replace('_', ' ').toUpperCase() : '-'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted">Midtrans Snap Token</span>
                  <span className="font-mono text-xs text-ink truncate bg-surface-soft p-1 mt-1 rounded-sm">{transaction.snap_token || '-'}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-micro-label font-bold text-muted uppercase tracking-wider mb-1">Informasi Pelanggan</p>
              <div className="space-y-2 text-body-sm">
                <div className="flex flex-col">
                  <span className="text-muted">Nama Pelanggan</span>
                  <span className="font-medium text-ink">{transaction.customer?.name || '-'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted">Email Pelanggan</span>
                  <span className="font-medium text-ink">{transaction.customer?.email || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-hairline-soft pt-6">
            <p className="text-micro-label font-bold text-muted uppercase tracking-wider mb-3">Detail Pembelian Buku</p>
            <div className="flex items-start gap-4 p-4 bg-surface-soft rounded-md">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-ink truncate">{transaction.book?.title || 'Buku Dihapus'}</p>
                {transaction.book && (
                  <p className="text-body-sm text-muted mt-1 truncate">
                    {transaction.book.author?.name} • {transaction.book.genre?.name}
                  </p>
                )}
              </div>
              <div className="text-right whitespace-nowrap">
                <p className="font-bold text-ink">{formatRupiah(transaction.total_amount)}</p>
                <p className="text-caption-sm text-muted">1 Item</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 p-4 bg-canvas border border-ink rounded-md">
              <span className="font-bold text-ink">Total Akhir</span>
              <span className="text-title-md font-bold text-rausch">{formatRupiah(transaction.total_amount)}</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-hairline-soft bg-surface-soft flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-sm bg-ink text-white text-button-sm font-medium hover:opacity-90 transition-opacity"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
