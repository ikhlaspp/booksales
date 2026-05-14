import { useState, useEffect } from 'react';
import ConfirmModal from '../ConfirmModal';

/**
 * AdminCrudForm — Reusable form wrapper for admin create/edit, rendered as a Modal.
 */
export default function AdminCrudForm({
  isOpen,
  onClose,
  title,
  subtitle,
  isEditMode = false,
  isLoading = false,
  onSubmit,
  confirmTitle,
  confirmMessage,
  submitLabel,
  children,
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Close when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isConfirmOpen) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isConfirmOpen, onClose]);

  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (onSubmit) await onSubmit();
    setIsConfirmOpen(false);
  };

  const defaultConfirmTitle = isEditMode ? 'Konfirmasi Edit' : 'Konfirmasi Tambah';
  const defaultConfirmMessage = `Apakah Anda yakin ingin ${isEditMode ? 'menyimpan perubahan' : 'menambahkan data'} ini?`;
  const defaultSubmitLabel = isLoading ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Simpan');

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div 
          className="bg-canvas w-full max-w-2xl rounded-lg shadow-xl flex flex-col overflow-hidden animate-fadeInUp"
          style={{ maxHeight: '90vh' }}
        >
          {/* Header */}
          <div className="p-6 border-b border-hairline-soft flex items-start justify-between bg-surface-soft shrink-0">
            <div>
              <h2 className="text-title-lg font-bold text-ink">{title}</h2>
              {subtitle && <p className="text-body-sm text-muted mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-muted hover:text-ink transition-colors p-2 -mr-2 -mt-2 rounded-full hover:bg-hairline"
              aria-label="Tutup"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar">
            <form id="crud-form" onSubmit={handleFormSubmit} className="space-y-6">
              {children}
            </form>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-hairline-soft bg-surface-soft flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-sm border border-ink text-ink text-button-sm font-medium hover:bg-hairline-soft transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              form="crud-form"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-sm bg-rausch text-white text-button-sm font-medium hover:bg-rausch-active disabled:opacity-50 transition-colors"
            >
              {submitLabel || defaultSubmitLabel}
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Modal (z-50) */}
      <div className="relative z-50">
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirm}
          isLoading={isLoading}
          title={confirmTitle || defaultConfirmTitle}
          message={confirmMessage || defaultConfirmMessage}
        />
      </div>
    </>
  );
}

/**
 * FormField — Consistent form field wrapper.
 */
export function FormField({ label, required, children }) {
  return (
    <div>
      <label className="block text-micro-label font-bold text-ink mb-1.5 uppercase tracking-wider">
        {label}{required && <span className="text-rausch ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

/**
 * FormInput — Consistent text input.
 */
export function FormInput({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`block w-full h-[56px] px-3 bg-canvas border border-hairline rounded-sm text-ink text-body-md focus:outline-none focus:border-2 focus:border-ink transition-colors ${className}`}
    />
  );
}

/**
 * FormTextarea — Consistent textarea.
 */
export function FormTextarea({ className = '', rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      {...props}
      className={`block w-full p-3 bg-canvas border border-hairline rounded-sm text-ink text-body-md focus:outline-none focus:border-2 focus:border-ink transition-colors resize-none ${className}`}
    />
  );
}

/**
 * FormSelect — Consistent select dropdown.
 */
export function FormSelect({ options = [], className = '', ...props }) {
  return (
    <select
      {...props}
      className={`block w-full h-[56px] px-3 bg-canvas border border-hairline rounded-sm text-ink text-body-md focus:outline-none focus:border-2 focus:border-ink transition-colors cursor-pointer ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
