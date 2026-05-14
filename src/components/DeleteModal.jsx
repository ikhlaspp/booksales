export default function DeleteModal({ isOpen, onClose, onConfirm, isLoading, message, confirmButtonClass = "bg-[#ff385c] hover:bg-[#e00b41]" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#ffffff] rounded-[20px] shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px_0,rgba(0,0,0,0.1)_0_4px_8px_0] overflow-hidden">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#ffd1da] flex items-center justify-center mb-4 text-[#c13515]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h2 className="text-[18px] font-semibold text-[#222222] mb-2">Konfirmasi Hapus</h2>
          <p className="text-[16px] text-[#6a6a6a] leading-relaxed">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#ebebeb] bg-[#ffffff]">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-[48px] px-[24px] text-[16px] font-medium text-[#222222] rounded-[8px] hover:bg-[#f7f7f7] transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`h-[48px] px-[24px] text-[16px] font-medium text-[#ffffff] ${confirmButtonClass} rounded-[8px] transition-colors disabled:opacity-50 flex items-center justify-center`}
          >
            {isLoading ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}