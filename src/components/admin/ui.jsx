// Shared UI parts for the Users + School Administrators screens.

export function StatCard({ title, value, sub, subColor = '#666666' }) {
  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl border border-[#DBDBDB] bg-white px-6 py-6 md:px-8 md:py-7">
      <p className="text-lg font-medium leading-[19.6px] text-black">{title}</p>
      <div className="flex flex-col gap-3">
        <p className="text-4xl font-medium leading-[41.6px] text-black">{value}</p>
        <p className="text-base leading-[17.4px]" style={{ color: subColor }}>
          {sub}
        </p>
      </div>
    </div>
  )
}

export function StatusBadge({ label = 'Active' }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-[5px] text-sm font-medium leading-[15.2px] text-[#109E75]"
      style={{ backgroundColor: 'rgba(16,158,117,0.1)' }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#109E75]" />
      {label}
    </span>
  )
}

export function AvatarChip({ name = 'T O' }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[18px] bg-[#E5E0FF] text-sm font-semibold leading-[15.2px] text-[#100070]">
      {name}
    </span>
  )
}

export function PageCountFooter({ left = 'Showing 1–10 of 24 results', right = '48 per page', active = 1 }) {
  const arrow = 'flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F3F4F6]'
  return (
    <div className="flex min-h-[86px] w-full flex-wrap items-center justify-between gap-4 border-t border-[#E5E7EB] bg-white px-4 py-4">
      <p className="text-[13px] leading-[17px] text-[#6B7280]">{left}</p>
      <div className="flex items-center gap-12">
        <button type="button" className="flex items-center gap-1.5 text-[13px] leading-[17px] text-[#6B7280]">
          {right}
          <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="#6B7280" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="m4 6 4 4 4-4" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Previous page" className={arrow}>
            <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="m10 4-4 4 4 4" />
            </svg>
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`Page ${n}`}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-[13px] leading-[17px] ${
                active === n ? 'bg-[#4F46E5] font-medium text-white' : 'font-normal text-[#4B5563]'
              }`}
            >
              {n}
            </button>
          ))}
          <button type="button" aria-label="Next page" className={arrow}>
            <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 4 4 4-4 4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export const TH = ({ children, sort = false, className = '' }) => (
  <th className={`h-10 whitespace-nowrap bg-[#F9FAFB] px-4 py-3 text-left text-[11px] font-semibold uppercase leading-3 tracking-[0.5px] text-[#6B7280] ${sort ? 'cursor-pointer select-none' : ''} ${className}`}>
    <span className="inline-flex items-center gap-1">
      {children}
      {sort && (
        <svg viewBox="0 0 12 12" className="h-3 w-3" stroke="#9CA3AF" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2.5v7M3.5 5 6 2.5 8.5 5M3.5 7 6 9.5 8.5 7" />
        </svg>
      )}
    </span>
  </th>
)

export function FilterSelect({ value, options }) {
  return (
    <div className="relative shrink-0">
      <select
        className="h-[42px] w-[180px] cursor-pointer appearance-none rounded-lg bg-[#F3F4F6] px-4 pr-9 text-[13px] font-medium leading-[17px] text-[#4B5563] outline-none"
        value={value}
        onChange={() => {}}
        aria-label={value}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <svg viewBox="0 0 16 16" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" stroke="#6B7280" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="m4 6 4 4 4-4" />
      </svg>
    </div>
  )
}

export function SearchInput({ placeholder = 'Search by name, email or department', value = '', onChange, width = 320 }) {
  return (
    <label className="relative flex shrink-0 items-center" style={{ width }}>
      <span className="absolute left-4 flex h-4 w-4 items-center justify-center">
        <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="#6B7280" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7" cy="7" r="4.5" />
          <path d="m10.5 10.5 3 3" />
        </svg>
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-[42px] w-full rounded-lg bg-[#F3F4F6] pl-11 pr-4 text-sm leading-[17px] text-black placeholder:text-[#9CA3AF] outline-none"
      />
    </label>
  )
}

export function DotsMenu({ items, open, onToggle }) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Row actions"
        onClick={onToggle}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold tracking-[2px] text-[#6B7280] hover:bg-[#F3F4F6]"
      >
        ···
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-30 w-[220px] overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white py-1 shadow-[0px_10px_25px_rgba(16,24,40,0.12)]">
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              onClick={it.onClick}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm leading-[18px] hover:bg-[#F9FAFB] ${it.danger ? 'text-[#D83030]' : 'text-[#344054]'}`}
            >
              {it.icon && <span className="shrink-0">{it.icon}</span>}
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function Field({ label, hint, hintTop = false, required = true, children }) {
  return (
    <label className="flex w-full flex-col gap-2">
      <span className="text-[13px] font-medium leading-4 text-[#374151]">
        {label} {required && <span className="text-[#D85A30]">*</span>}
      </span>
      {hint && hintTop && <span className="-mt-1 text-xs leading-4 text-[#6B7280]">{hint}</span>}
      {children}
      {hint && !hintTop && <span className="-mt-1 text-xs leading-4 text-[#6B7280]">{hint}</span>}
    </label>
  )
}

export const inputCls =
  'h-12 w-full rounded-lg border border-[#D1D5DC] bg-white px-4 text-sm leading-5 text-black placeholder:text-[#9CA3AF] outline-none focus:border-[#4F46E5]'

export const selectCls =
  'h-12 w-full cursor-pointer appearance-none rounded-lg border border-[#D1D5DC] bg-white px-4 pr-10 text-sm leading-5 text-black outline-none focus:border-[#4F46E5]'

export function SelectWrap({ children }) {
  return (
    <div className="relative">
      {children}
      <svg viewBox="0 0 16 16" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" stroke="#6B7280" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="m4 6 4 4 4-4" />
      </svg>
    </div>
  )
}

export function ModalShell({ children, width = 582 }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 md:p-6">
      <div
        className="max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-white shadow-[0px_20px_24px_rgba(16,24,40,0.05)]"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export function CompactButtons({ secondaryLabel = 'Cancel', primaryLabel, primaryCls, onSecondary, onPrimary }) {
  return (
    <div className="flex w-full items-center justify-between">
      <button
        type="button"
        onClick={onSecondary}
        className="h-11 rounded-lg border border-[#E5E7EB] bg-white px-7 text-sm font-medium leading-5 text-[#374151] hover:bg-[#F9FAFB]"
      >
        {secondaryLabel}
      </button>
      <button
        type="button"
        onClick={onPrimary}
        className={`h-11 rounded-lg px-6 text-sm font-semibold leading-5 text-white ${primaryCls || 'bg-[#4F46E5] hover:bg-[#4338CA]'}`}
      >
        {primaryLabel}
      </button>
    </div>
  )
}
