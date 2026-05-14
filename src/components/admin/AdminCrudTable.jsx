import { useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteModal from '../DeleteModal';

/**
 * AdminCrudTable — Reusable list view for admin CRUD pages.
 *
 * Props:
 *  - title         : string          — Page heading
 *  - subtitle      : string          — Page description
 *  - addLink       : string          — Route for "Tambah" button (omit to hide button)
 *  - addLabel      : string          — Label for the add button (default "Tambah")
 *  - columns       : Array<{ key, label, align?, render? }>
 *  - data          : Array<object>   — Current page rows
 *  - searchValue   : string
 *  - onSearchChange: (value) => void
 *  - searchPlaceholder: string
 *  - filters       : Array<{ value, options: [{value, label}], onChange, placeholder }>  (optional)
 *  - pagination    : { currentPage, totalPages, from, to, total }
 *  - deleteMessage : (item) => string         — message for delete modal
 *  - editLink      : (item) => string         — builds edit route  (optional)
 *  - onAddClick    : () => void               — handler for "Tambah" button (use this or addLink)
 *  - onViewClick   : (item) => void           — handler for "Detail" button
 *  - onEditClick   : (item) => void           — handler for "Edit" button (use this or editLink)
 *  - actions       : (item) => ReactNode      — custom action buttons (overrides default edit/delete)
 *  - emptyLabel    : string                   — empty state title
 *  - emptySubLabel : string                   — empty state subtitle
 */
export default function AdminCrudTable({
  title,
  subtitle,
  addLink,
  addLabel = 'Tambah',
  columns = [],
  data = [],
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Cari...',
  filters = [],
  pagination = {},
  onPageChange,
  onDelete,
  deleteMessage,
  editLink,
  onAddClick,
  onViewClick,
  onEditClick,
  actions,
  emptyLabel = 'Data tidak ditemukan',
  emptySubLabel = 'Coba gunakan kata kunci pencarian yang lain.',
}) {
  const { currentPage = 1, totalPages = 0, from = 0, to = 0, total = 0 } = pagination;

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete || !onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(itemToDelete);
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      setItemToDelete(null);
    }
  };

  const colCount = columns.length + (editLink || onEditClick || onViewClick || actions || onDelete ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-display-lg font-bold text-ink">{title}</h2>
          {subtitle && <p className="text-body-sm text-muted mt-1">{subtitle}</p>}
        </div>
        {addLink ? (
          <Link
            to={addLink}
            className="inline-flex items-center h-[48px] px-6 bg-rausch text-white text-button-md font-medium rounded-sm hover:bg-rausch-active transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {addLabel}
          </Link>
        ) : onAddClick ? (
          <button
            onClick={onAddClick}
            className="inline-flex items-center h-[48px] px-6 bg-rausch text-white text-button-md font-medium rounded-sm hover:bg-rausch-active transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {addLabel}
          </button>
        ) : null}
      </div>

      {/* ── Table Card ── */}
      <div className="bg-canvas border border-hairline-soft rounded-md shadow-[0_2px_6px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">

        {/* ── Toolbar: Search + Filters ── */}
        <div className="p-4 border-b border-hairline-soft flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          {onSearchChange && (
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-[18px] w-[18px] text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full h-[48px] pl-10 pr-3 border border-hairline rounded-sm bg-canvas text-ink placeholder-muted focus:outline-none focus:border-2 focus:border-ink text-body-sm transition-colors"
                placeholder={searchPlaceholder}
              />
            </div>
          )}

          {/* Filter dropdowns */}
          {filters.map((filter, idx) => (
            <select
              key={idx}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="h-[48px] px-4 border border-hairline rounded-sm bg-canvas text-ink text-body-sm focus:outline-none focus:border-2 focus:border-ink transition-colors cursor-pointer"
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ))}
        </div>

        {/* ── Data Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-soft border-b border-hairline-soft">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-6 py-4 text-micro-label font-bold text-muted uppercase tracking-wider whitespace-nowrap ${
                      col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
                {(editLink || onEditClick || onViewClick || actions || onDelete) && (
                  <th className="px-6 py-4 text-micro-label font-bold text-muted uppercase tracking-wider text-right w-40">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-soft">
              {data.length > 0 ? (
                data.map((item, rowIdx) => (
                  <tr key={item.id ?? rowIdx} className="hover:bg-surface-soft transition-colors duration-150 group">
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-6 py-4 text-body-sm ${
                          col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''
                        }`}
                      >
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                    {(editLink || onEditClick || onViewClick || actions || onDelete) && (
                      <td className="px-6 py-4 text-right">
                        {actions ? (
                          actions(item)
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {onViewClick && (
                              <button
                                onClick={() => onViewClick(item)}
                                className="inline-flex h-10 items-center px-4 bg-canvas border border-ink text-ink hover:bg-surface-soft rounded-sm transition-colors text-body-sm font-medium"
                              >
                                Detail
                              </button>
                            )}
                            {editLink ? (
                              <Link
                                to={editLink(item)}
                                className="inline-flex h-10 items-center px-4 bg-canvas border border-ink text-ink hover:bg-surface-soft rounded-sm transition-colors text-body-sm font-medium"
                              >
                                Edit
                              </Link>
                            ) : onEditClick ? (
                              <button
                                onClick={() => onEditClick(item)}
                                className="inline-flex h-10 items-center px-4 bg-canvas border border-ink text-ink hover:bg-surface-soft rounded-sm transition-colors text-body-sm font-medium"
                              >
                                Edit
                              </button>
                            ) : null}
                            {onDelete && (
                              <button
                                onClick={() => handleDeleteClick(item)}
                                className="inline-flex h-10 items-center px-4 bg-canvas border border-hairline text-[#c13515] hover:bg-rausch-disabled hover:border-rausch-disabled hover:text-[#b32505] rounded-sm transition-colors text-body-sm font-medium"
                              >
                                Hapus
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={colCount} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-hairline mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-title-md font-medium text-ink">{emptyLabel}</p>
                      <p className="text-body-sm mt-1 text-muted">{emptySubLabel}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {totalPages > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-hairline-soft bg-canvas">
            <div className="hidden sm:block text-body-sm text-muted">
              Menampilkan{' '}
              <span className="font-semibold text-ink">{from}</span> ke{' '}
              <span className="font-semibold text-ink">{to}</span> dari{' '}
              <span className="font-semibold text-ink">{total}</span> hasil
            </div>
            <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="inline-flex h-10 items-center px-5 border border-ink text-button-sm font-medium rounded-sm text-ink bg-canvas hover:bg-surface-soft transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:border-hairline"
              >
                Sebelumnya
              </button>

              {/* Page numbers — show max 5 */}
              <div className="hidden md:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 5) return true;
                    if (p === 1 || p === totalPages) return true;
                    return Math.abs(p - currentPage) <= 1;
                  })
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === '...' ? (
                      <span key={`dots-${i}`} className="w-10 h-10 flex items-center justify-center text-muted text-body-sm">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`w-10 h-10 flex items-center justify-center rounded-sm text-body-sm font-medium transition-colors ${
                          p === currentPage
                            ? 'bg-ink text-white'
                            : 'text-ink hover:bg-surface-soft'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
              </div>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="inline-flex h-10 items-center px-5 border border-ink text-button-sm font-medium rounded-sm text-ink bg-canvas hover:bg-surface-soft transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:border-hairline"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete Modal ── */}
      {onDelete && (
        <DeleteModal
          isOpen={isDeleteOpen}
          isLoading={isDeleting}
          onClose={() => { setIsDeleteOpen(false); setItemToDelete(null); }}
          onConfirm={handleConfirmDelete}
          message={deleteMessage && itemToDelete ? deleteMessage(itemToDelete) : 'Apakah Anda yakin ingin menghapus item ini?'}
        />
      )}
    </div>
  );
}
