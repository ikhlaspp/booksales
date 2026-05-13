export default function ConfirmModal({ isOpen, onClose, onConfirm, isLoading, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#ffffff] rounded-[20px] shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px_0,rgba(0,0,0,0.1)_0_4px_8px_0] overflow-hidden">
        <div className="p-6">
          <h2 className="text-[18px] font-semibold text-[#222222] mb-2">{title}</h2>
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
            className="h-[48px] px-[24px] text-[16px] font-medium text-[#ffffff] bg-[#ff385c] rounded-[8px] hover:bg-[#e00b41] transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? 'Memproses...' : 'Konfirmasi'}
          </button>
        </div>
      </div>
    </div>
  );
}