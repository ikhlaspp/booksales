# 08 — Design System (Frontend)

> Design tokens (warna, typography, spacing, radius, shadow, animation) yang dipakai di BookSales. Semua di-define di [`src/index.css`](../src/index.css) dengan Tailwind 4 `@theme` directive.

---

## 1. Filosofi Desain

Terinspirasi **Airbnb design language**:
- Bersih, ample white space
- Rausch (merah Airbnb signature) sebagai primary accent
- Typography ramah dengan Inter font
- Border radius generous (8/14/20px) untuk feel modern
- Single shadow tier untuk depth (subtle, tidak heavy)

---

## 2. Color Palette

### 2.1 Primary

| Token | Hex | Tailwind class | Pakai untuk |
|-------|-----|----------------|-------------|
| `--color-rausch` | `#ff385c` | `bg-rausch`, `text-rausch` | Primary CTA, badge active, link accent |
| `--color-rausch-active` | `#e00b41` | `bg-rausch-active` | Hover state untuk Rausch elements |
| `--color-rausch-disabled` | `#ffd1da` | `bg-rausch-disabled` | Disabled background |

### 2.2 Neutral

| Token | Hex | Pakai untuk |
|-------|-----|-------------|
| `--color-ink` | `#222222` | Primary text, headings |
| `--color-body` | `#3f3f3f` | Body text secondary |
| `--color-muted` | `#6a6a6a` | Tertiary text, captions |
| `--color-muted-soft` | `#929292` | Disabled text, hints |
| `--color-hairline` | `#dddddd` | Border default |
| `--color-hairline-soft` | `#ebebeb` | Border subtle (dividers) |
| `--color-canvas` | `#ffffff` | Background utama (cards, page) |
| `--color-surface-soft` | `#f7f7f7` | Background secondary (inputs, hovers) |
| `--color-surface-strong` | `#f2f2f2` | Background tertiary (avatars, badges) |

### 2.3 Semantic (Hardcoded, BELUM jadi token)

Beberapa warna semantic dipakai langsung di JSX (mis. untuk status badges, toast). Belum di-extract jadi token:

| Hex | Pakai untuk |
|-----|-------------|
| `#2e7d32` / `#e8f5e9` / `#c8e6c9` | Success (hijau) |
| `#1565c0` / `#e3f2fd` / `#bbdefb` | Info (biru) |
| `#856404` / `#fff3cd` / `#ffeeba` | Warning (kuning) |
| `#c13515` / `#ffeef1` / `#ffd1da` | Error (merah, beda dari Rausch) |

> **Improvement**: Extract jadi `--color-success`, `--color-info`, dll di `@theme`.

### 2.4 Status Transaksi Color Mapping

| Status | Background | Text |
|--------|-----------|------|
| `pending` | `#fff3cd` | `#856404` |
| `dibayar` | `#e8f5e9` | `#2e7d32` |
| `dikirim` | `#e3f2fd` | `#1565c0` |
| `selesai` | `#e8f5e9` | `#2e7d32` |
| `dibatalkan` | `bg-surface-strong` | `text-muted` |

Defined inline di [`pages/profile/index.jsx`](../src/pages/profile/index.jsx) baris 65–70 dan diduplikasi di `ChatWidget.jsx`.

> **Improvement**: Extract jadi helper utility:
> ```js
> // src/utils/statusColor.js
> export const getStatusColor = (status) => ({
>   pending:   'bg-yellow-100 text-yellow-800',
>   dibayar:   'bg-green-100 text-green-800',
>   dikirim:   'bg-blue-100 text-blue-800',
>   selesai:   'bg-green-100 text-green-800',
>   dibatalkan:'bg-gray-100 text-gray-800',
> }[status] ?? 'bg-gray-100 text-gray-800');
> ```

---

## 3. Typography

### 3.1 Font Family

```css
--font-sans: "Inter", -apple-system, system-ui, sans-serif;
```

Loaded dari Google Fonts di [`src/index.css`](../src/index.css) baris 2:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
```

Inter Variable Font (`opsz` & `wght` axes) untuk smooth scaling.

### 3.2 Type Scale (Custom Utility Classes)

| Class | Size | Line height | Use for |
|-------|------|-------------|---------|
| `text-display-xl` | 28px | 1.43 | Hero headings, big titles |
| `text-display-lg` | 22px | 1.18 | Page headings |
| `text-display-md` | 21px | 1.43 | Section headings |
| `text-display-sm` | 20px | 1.20 | Card titles |
| `text-title-md` | 16px | 1.25 | Subheadings, prominent text |
| `text-title-sm` | 16px | 1.25 | Same as title-md (alias) |
| `text-body-md` | 16px | 1.50 | Body text default |
| `text-body-sm` | 14px | 1.43 | Body text small |
| `text-caption` | 14px | 1.29 | Captions, helper text |
| `text-caption-sm` | 13px | 1.23 | Smaller caption |
| `text-badge` | 11px | 1.18 | Badge labels |
| `text-micro-label` | 12px | 1.33 | Form labels |
| `text-button-md` | 16px | 1.25 | Button text default |
| `text-button-sm` | 14px | 1.29 | Button text small |

Defined di [`src/index.css`](../src/index.css) baris 84–141.

### 3.3 Pakai bersama Tailwind native

Bisa combine dengan Tailwind utilities:

```jsx
<h1 className="text-display-xl font-bold text-ink tracking-tight">Heading</h1>
<p className="text-body-md text-muted leading-relaxed">Body...</p>
```

### 3.4 Weight Conventions

| Weight | Pakai untuk |
|--------|-------------|
| `font-normal` (400) | Body text |
| `font-medium` (500) | Subtle emphasis, button secondary |
| `font-semibold` (600) | Section headings, active states |
| `font-bold` (700) | Strong headings, prices, CTAs |

---

## 4. Spacing & Sizing

Pakai Tailwind default scale (4px base):
- `1` = 4px
- `2` = 8px
- `3` = 12px
- `4` = 16px
- `6` = 24px
- `8` = 32px
- `10` = 40px
- `12` = 48px
- `16` = 64px

### Common patterns

| Pakai untuk | Class |
|-------------|-------|
| Vertical section gap | `space-y-6` atau `space-y-8` |
| Card inner padding | `p-6` (24px) |
| Page outer padding | `px-6 md:px-12` |
| Tight inline gap | `gap-2` (8px) |
| Comfortable inline gap | `gap-4` (16px) |

---

## 5. Border Radius

```css
--radius-sm: 8px;
--radius-md: 14px;
--radius-lg: 20px;
--radius-xl: 32px;
```

### Use cases

| Radius | Tailwind | Pakai untuk |
|--------|----------|-------------|
| `8px` | `rounded-sm` (custom override) atau `rounded-md` Tailwind native | Form inputs, small buttons |
| `14px` | `rounded-[14px]` | Cards, modals |
| `20px` | `rounded-[20px]` | Large containers, layout cards |
| `32px` | `rounded-[32px]` | Hero sections |
| `9999px` | `rounded-full` | Pills, badges, icon buttons |

### Catatan
- Tailwind v4 token `--radius-sm`/`-md`/`-lg` map ke utility otomatis (`rounded-sm`, dst). Tapi banyak codebase pakai arbitrary value (`rounded-[14px]`) untuk explicit. OK.

---

## 6. Shadows

### 6.1 Definisi token

```css
--shadow-card: rgba(0,0,0,0.02) 0 0 0 1px,
               rgba(0,0,0,0.04) 0 2px 6px,
               rgba(0,0,0,0.1) 0 4px 8px;
```

Triple-layer shadow ala Airbnb — subtle, bekerja baik di light bg.

### 6.2 Pakai

```jsx
<div style={{ boxShadow: 'var(--shadow-card)' }}>...</div>

// Atau Tailwind native:
<div className="shadow-md">...</div>
<div className="shadow-[0_2px_6px_rgba(0,0,0,0.04)]">...</div>
```

### 6.3 Common patterns

- Card di catalog (hover): `hover:shadow-md`
- Modal: `shadow-[0_8px_30px_rgba(0,0,0,0.12)]`
- Sticky element: `shadow-sm`
- Toast: `shadow-[0_4px_20px_rgba(0,0,0,0.12)]`

---

## 7. Backdrop Blur (Glassmorphism)

Dipakai di Navbar sticky:

```jsx
<header className="sticky top-0 bg-canvas/80 backdrop-blur-lg border-b border-hairline">
```

Effect: konten di belakang ter-blur, navbar tetap readable. Modern look.

---

## 8. Animations

### 8.1 Built-in (di `index.css`)

#### Shimmer (skeleton loading)
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-shimmer {
  background: linear-gradient(90deg,
    var(--color-surface-soft) 25%,
    var(--color-surface-strong) 50%,
    var(--color-surface-soft) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

Pakai:
```jsx
<div className="aspect-[3/4] animate-shimmer rounded-md"></div>
```

#### Fade In Up
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}
```

Pakai untuk:
- Toast notification
- Modal enter
- Card grid (dengan staggered `animation-delay`)

#### Spin
Pakai Tailwind native: `animate-spin` (untuk loading spinner).

### 8.2 Common Transition Classes

```jsx
<button className="transition-colors duration-200 hover:bg-surface-soft">...</button>
<div className="transition-transform duration-500 group-hover:scale-105">...</div>
<div className="transition-shadow hover:shadow-md">...</div>
```

---

## 9. Icons

### 9.1 Library: Lucide React

```jsx
import { ShoppingCart, Search, X, Menu } from 'lucide-react';

<Search className="w-5 h-5 text-muted" />
```

### 9.2 Size Convention

| Class | Pixel | Pakai untuk |
|-------|-------|-------------|
| `w-3 h-3` | 12px | Inline kecil (next to text) |
| `w-4 h-4` | 16px | Standard inline |
| `w-5 h-5` | 20px | Button icons, nav links |
| `w-6 h-6` | 24px | Standalone icons |
| `w-8 h-8` | 32px | Empty states, banners |
| `w-12 h-12` | 48px | Hero icons, big illustrations |

### 9.3 Aturan

- **JANGAN** pakai library icon lain (FontAwesome, React Icons, Heroicons, dll)
- **JANGAN** inline SVG dari sketch/Figma kecuali untuk logo/illustration custom (mis. favicon)
- Tampilan favicon `/favicon.svg` di Navbar logo

---

## 10. Form Inputs

### 10.1 Pattern Standar

```jsx
<input
  type="text"
  className="w-full h-[48px] px-4 border border-hairline rounded-sm bg-canvas text-ink placeholder-muted focus:outline-none focus:border-2 focus:border-ink text-body-sm transition-colors"
  placeholder="..."
/>
```

Konvensi:
- Height 48px (`h-[48px]`)
- Border default `border-hairline`
- Focus state `border-2 border-ink` (BUKAN Rausch — Rausch untuk CTA)
- Placeholder `placeholder-muted`
- Background `bg-canvas` atau `bg-surface-soft` (depending on context)

### 10.2 Floating Label Pattern (di Login form)

```jsx
<div className="relative h-[56px] rounded-[8px] border border-[#dddddd] focus-within:border-2 focus-within:border-[#222222]">
  <label className="absolute left-3 top-2 text-[12px] font-medium text-[#6a6a6a]">Email</label>
  <input className="absolute bottom-0 left-0 w-full bg-transparent px-3 pb-2 pt-6 outline-none" />
</div>
```

Style ala Airbnb — label tetap visible saat input filled. Saat ini hanya dipakai di Login.

### 10.3 Select Dropdown

```jsx
<select className="h-[48px] px-4 border border-hairline rounded-sm bg-canvas text-ink text-body-sm focus:outline-none focus:border-2 focus:border-ink cursor-pointer">
  <option value="">Pilih...</option>
</select>
```

### 10.4 Textarea

```jsx
<textarea
  rows="3"
  className="w-full px-4 py-3 bg-surface-soft border border-hairline rounded-md focus:outline-none focus:border-ink text-body-md"
/>
```

---

## 11. Buttons

### 11.1 Primary CTA (Rausch)

```jsx
<button className="px-6 py-3 bg-rausch text-white rounded-full font-bold text-button-md hover:bg-rausch-active transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
  Bayar Sekarang
</button>
```

Konvensi:
- `bg-rausch` + `text-white`
- `rounded-full` atau `rounded-sm` (depending on context — pill vs square)
- `font-bold` text
- Hover state ke `bg-rausch-active`
- Disabled: `opacity-50` + `cursor-not-allowed`

### 11.2 Secondary (Ink)

```jsx
<button className="px-6 py-3 bg-ink text-white rounded-full font-bold hover:opacity-90">
  Save Address
</button>
```

### 11.3 Outline / Ghost

```jsx
<button className="px-4 py-1.5 border border-hairline rounded-full text-body-sm font-semibold text-ink hover:bg-surface-soft transition-colors">
  Edit Profil
</button>
```

### 11.4 Icon Button

```jsx
<button className="p-2 text-ink hover:bg-surface-soft rounded-full transition-colors">
  <Search className="w-5 h-5" />
</button>
```

### 11.5 Destructive

```jsx
<button className="inline-flex h-10 items-center px-4 bg-canvas border border-hairline text-[#c13515] hover:bg-rausch-disabled rounded-sm text-body-sm font-medium">
  Hapus
</button>
```

Pakai `#c13515` (darker red, beda dari Rausch) untuk warning.

---

## 12. Cards

### 12.1 Standard Card

```jsx
<div className="bg-canvas border border-hairline rounded-[14px] p-6 shadow-sm hover:shadow-md transition-shadow">
  ...
</div>
```

### 12.2 Soft Card (di-bg dengan surface)

```jsx
<div className="bg-surface-soft rounded-[20px] border border-hairline p-8">
  ...
</div>
```

Pakai untuk profile sections, settings panel.

### 12.3 Empty State Card (dashed border)

```jsx
<div className="bg-surface-soft rounded-[20px] border border-hairline border-dashed py-20 px-8 text-center">
  <Icon className="w-12 h-12 text-muted mx-auto mb-4" />
  <h3 className="text-title-md font-bold mb-2">Belum ada data</h3>
  <p className="text-body-sm text-muted">Deskripsi singkat...</p>
</div>
```

---

## 13. Modals & Overlays

### 13.1 Backdrop

```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in-up">
  <div className="bg-canvas rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden max-w-md w-full">
    ...
  </div>
</div>
```

Konvensi:
- Z-index 50
- Backdrop: `bg-ink/40` (opacity 40%) + `backdrop-blur-sm`
- Modal radius 20px
- Heavy shadow untuk depth

### 13.2 Modal Header

```jsx
<div className="flex items-center justify-between p-6 border-b border-hairline">
  <h3 className="text-title-md font-bold text-ink">Title</h3>
  <button onClick={onClose} className="text-muted hover:text-ink">
    <X className="w-5 h-5" />
  </button>
</div>
```

### 13.3 Toast Notification

Position: `fixed top-24 right-6 z-[9999]`.

Variants (background + border):
- Success: `bg-[#e8f5e9] border-[#c8e6c9]`
- Error: `bg-[#ffeef1] border-[#ffd1da]`
- Warning: `bg-[#fff3cd] border-[#ffeeba]`
- Info: `bg-[#e3f2fd] border-[#bbdefb]`

Auto-dismiss setelah 8 detik (di-set di useEffect).

---

## 14. Layout

### 14.1 Container Width

```jsx
<div className="max-w-7xl mx-auto px-6 md:px-12">  // 1280px max, padding responsive
  ...
</div>
```

Variants:
- `max-w-md` (28rem / 448px) — Forms, small content
- `max-w-2xl` (42rem / 672px) — Article-like
- `max-w-4xl` (56rem / 896px) — Mid content
- `max-w-7xl` (80rem / 1280px) — Main app width (default)

### 14.2 Flex vs Grid

- **Flex** untuk inline layouts (navbar, button rows, simple lists)
- **Grid** untuk catalog grid, dashboard stat cards

```jsx
// Grid responsive (catalog book cards)
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
  ...
</div>
```

### 14.3 Responsive Breakpoints (Tailwind defaults)

| Prefix | Min width | Pakai untuk |
|--------|-----------|-------------|
| `sm:` | 640px | Tablet portrait |
| `md:` | 768px | Tablet landscape, small laptop |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Wide desktop |

---

## 15. Decision: Tidak Pakai CSS Variables Inline Kecuali Perlu

Sebagian besar bisa pakai Tailwind utility class (`bg-rausch`, `text-ink`). Inline `style={{ color: 'var(--color-rausch)' }}` dipakai HANYA kalau:

- Dinamis (dari prop atau state)
- Tidak ada utility class equivalent
- Dynamic computed value (mis. `style={{ animationDelay: '${i * 40}ms' }}`)

---

## 16. Future Improvements

| Improvement | Benefit |
|-------------|---------|
| Extract semantic colors (success, error, warning, info) ke tokens | Konsistensi & easier dark mode in future |
| Buat StatusBadge component reusable | DRY untuk status transaksi |
| Document layout patterns (cards, sections) | Easier onboarding |
| Storybook untuk component preview | Visual regression testing |
| Dark mode | Sudah pakai CSS variables — tinggal switch palette |

---

## Berikutnya

- Mau tahu Midtrans flow? → [09-MIDTRANS-SNAP-FLOW.md](09-MIDTRANS-SNAP-FLOW.md)
- Mau tahu chat widget? → [10-CHAT-WIDGET.md](10-CHAT-WIDGET.md)
