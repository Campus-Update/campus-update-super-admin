import { useCallback, useEffect, useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { StatCard, PageCountFooter, TH, DotsMenu } from './ui.jsx'
import { PlusIcon } from './Icons.jsx'
import { contentApi } from '../../lib/api.js'
import { timeAgo, menuItemsFor } from '../../lib/format.jsx'

const AD_LABEL = {
  PendingApproval: 'In review',
  Draft: 'In review',
  Published: 'Live',
  Archived: 'Deactivated',
  Rejected: 'Rejected',
}

function AdStatus({ s }) {
  const map = {
    'In review': ['text-[#4F46E5] bg-[#EEEDFD]', 'M6 1.5v2M6 10.5v-2M3.5 1.5h5l-2 4.5 2 4.5h-5l2-4.5-2-4.5'],
    Rejected: ['text-[#D92D20] bg-[#FEE4E2]', 'M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1Zm-2 3 4 4M8 4 4 8'],
    Live: ['text-[#109E75] bg-[rgba(16,158,117,0.1)]', 'M4.5 7.5 7.5 4.5M3 6l-1 1a2.1 2.1 0 0 0 3 3l1-1M9 6l1-1a2.1 2.1 0 0 0-3-3L6 3'],
    Deactivated: ['text-[#B54708] bg-[#FEF0C7]', 'M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1ZM2.5 9.5l7-7'],
  }
  const [cls, d] = map[s] || map['In review']
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-[5px] text-[13px] font-medium leading-4 ${cls}`}>
      <svg viewBox="0 0 12 12" className="h-3 w-3" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
      </svg>
      {s}
    </span>
  )
}

export default function AdvertisementsPage({ onNavigate }) {
  const [menu, setMenu] = useState(null)
  const [navOpen, setNavOpen] = useState(false)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    contentApi
      .list({ type: 'Advertisement', page: 1, pageSize: 20 })
      .then((d) => setRows(Array.isArray(d) ? d : []))
      .catch((e) => {
        setRows([])
        setError(e.message)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
    window.addEventListener('cu-content-changed', load)
    return () => window.removeEventListener('cu-content-changed', load)
  }, [load])

  const count = (labels) => String(rows.filter((r) => labels.includes(AD_LABEL[r.status])).length).padStart(2, '0')
  const STATS = [
    { title: 'In review', value: count(['In review']), sub: 'Awaiting Approval' },
    { title: 'Live', value: count(['Live']), sub: 'Visible to students' },
    { title: 'Deactivated', value: count(['Deactivated']), sub: 'No longer displayed' },
    { title: 'Rejected', value: count(['Rejected']), sub: 'Never published' },
  ]

  return (
    <div className="min-h-screen w-full bg-[#E9E9EA] p-3 md:p-[27px]">
      <div className="flex gap-4 md:gap-6">
        <Sidebar active="ads" publishingAs="Campus Update" onNavigate={onNavigate} open={navOpen} onClose={() => setNavOpen(false)} />

        <main className="flex min-w-0 flex-1 flex-col gap-4 md:gap-6">
          <Topbar title="Advertisements" subtitle="Reviewed before anything goes live" onMenu={() => setNavOpen(true)} />

          <div className="flex justify-end">
            <button type="button" className="flex h-[54px] items-center gap-3 rounded-[10px] bg-[#4F46E5] px-7 text-base font-semibold leading-[22px] text-white hover:bg-[#4338CA]">
              <PlusIcon className="h-5 w-5" stroke="#fff" />
              Submit advertisement
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
            {STATS.map((s) => (
              <StatCard key={s.title} {...s} />
            ))}
          </div>

          <div className="flex flex-col overflow-hidden rounded-[10px] border border-[#DBDBDB] bg-white">
            {error && (
              <p className="mx-4 mt-4 rounded-lg bg-[#FEE4E2] px-4 py-3 text-sm leading-5 text-[#D92D20]">{error}</p>
            )}
            <div className="overflow-x-auto px-4 pt-6">
              <table className="w-full min-w-[960px] table-fixed border-collapse">
                <thead>
                  <tr className="h-10">
                    <TH sort className="w-[30%]">PLACEMENT</TH>
                    <TH sort className="w-[16%]">ADVERTISER</TH>
                    <TH sort className="w-[16%]">SUBMITTED</TH>
                    <TH sort className="w-[14%]">STATUS</TH>
                    <TH sort className="w-[14%]">IMPRESSIONS</TH>
                    <TH className="w-[10%]">ACTION</TH>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#6B7280]">Loading advertisements…</td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#6B7280]">No advertisements found.</td>
                    </tr>
                  ) : (
                    rows.map((r, i) => (
                      <tr key={r.id} className={`h-[58px] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-col gap-1">
                            <span className="truncate text-[15px] font-semibold leading-4 text-[#344054]">{r.title}</span>
                            <span className="truncate text-[13px] leading-[14px] text-[#6B7280]">{r.body}</span>
                          </div>
                        </td>
                        <td className="truncate px-4 py-2.5 text-[13px] leading-[14px] text-[#6B7280]">{r.sourceName || '—'}</td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-[13px] leading-[14px] text-[#6B7280]">{timeAgo(r.publishedAt) || '—'}</td>
                        <td className="px-4 py-2.5"><AdStatus s={AD_LABEL[r.status] || 'In review'} /></td>
                        <td className="px-4 py-2.5 text-[13px] leading-[14px] text-[#6B7280]">—</td>
                        <td className="px-4 py-2.5">
                          <DotsMenu
                            open={menu === i}
                            onToggle={() => setMenu(menu === i ? null : i)}
                            items={menuItemsFor(r, () => setMenu(null), (m) => setError(m))}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <PageCountFooter left={`Showing ${rows.length} results`} />
          </div>
        </main>
      </div>
    </div>
  )
}
