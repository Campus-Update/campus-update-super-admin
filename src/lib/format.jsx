export function timeAgo(iso) {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const mins = Math.max(1, Math.round((Date.now() - then) / 60000))
  if (mins < 60) return `${mins} min ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const STATUS_UI = {
  Published: { label: 'Live', cls: 'text-[#109E75] bg-[rgba(16,158,117,0.1)]', icon: 'link' },
  Draft: { label: 'Draft', cls: 'text-[#667085] bg-white border border-[#E5E7EB]', icon: 'edit' },
  PendingApproval: { label: 'Pending', cls: 'text-[#B54708] bg-[#FEF0C7]', icon: 'edit' },
  Rejected: { label: 'Rejected', cls: 'text-[#D92D20] bg-[#FEE4E2]', icon: 'edit' },
  Archived: { label: 'Taken down', cls: 'text-[#D92D20] bg-[#FEE4E2]', icon: 'edit' },
}

export function StatusCell({ status }) {
  const s = STATUS_UI[status] || STATUS_UI.Draft
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-[5px] text-[13px] font-medium leading-4 ${s.cls}`}>
      <svg viewBox="0 0 12 12" className="h-3 w-3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {s.icon === 'link' ? <path d="M4.5 7.5 7.5 4.5M3 6l-1 1a2.1 2.1 0 0 0 3 3l1-1M9 6l1-1a2.1 2.1 0 0 0-3-3L6 3" /> : <path d="M8.5 3.5h-2M8.5 3.5v2M8.5 3.5 5 7M3.5 5.5h2v3h-2z" />}
      </svg>
      {s.label}
    </span>
  )
}

export function UrgencyPill({ urgency, type }) {
  if (urgency === 'Urgent')
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#FEF0C7] px-3 py-[5px] text-[13px] font-medium leading-4 text-[#B54708]">
        <svg viewBox="0 0 12 12" className="h-3 w-3" stroke="#DC6803" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M6 1.5 11 10.5H1L6 1.5ZM6 5v2.5M6 9.5v.5" /></svg>
        Urgent
      </span>
    )
  if (urgency === 'Important')
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#FEF0C7] px-3 py-[5px] text-[13px] font-medium leading-4 text-[#B54708]">
        <svg viewBox="0 0 12 12" className="h-3 w-3" stroke="#DC6803" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1Zm0 2.5V7M6 8.7v.3" /></svg>
        Important
      </span>
    )
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full border border-[#E5E7EB] bg-white px-3 py-[5px] text-[13px] font-medium leading-4 text-[#4B5563]">
      {type || 'Normal'}
    </span>
  )
}

export function menuItemsFor(item, onDone, onError) {
  const items = [{ label: 'View Details', onClick: onDone }]
  if (item.status === 'PendingApproval') {
    items.push({ label: 'Approve', onClick: () => onAct(item, 'Published', onDone, onError) })
    items.push({ label: 'Reject', danger: true, onClick: () => onAct(item, 'Rejected', onDone, onError) })
  }
  if (item.status === 'Published') {
    items.push({ label: 'Take down', danger: true, onClick: () => onRemove(item, onDone, onError) })
  }
  return items
}

import { contentApi } from './api.js'

async function onAct(item, status, onDone, onError) {
  onDone()
  try {
    await contentApi.setStatus(item.id, status)
    window.dispatchEvent(new CustomEvent('cu-content-changed'))
  } catch (e) {
    onError(e.message)
  }
}

async function onRemove(item, onDone, onError) {
  onDone()
  try {
    await contentApi.remove(item.id)
    window.dispatchEvent(new CustomEvent('cu-content-changed'))
  } catch (e) {
    onError(e.message)
  }
}
