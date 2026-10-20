import { useCallback, useEffect, useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { StatCard, PageCountFooter, TH, FilterSelect, SearchInput, DotsMenu } from './ui.jsx'
import { contentApi, adminApi } from '../../lib/api.js'
import { timeAgo, StatusCell, UrgencyPill, menuItemsFor } from '../../lib/format.jsx'

const TABS = [
  { id: 'all', label: 'All', type: '' },
  { id: 'news', label: 'News', type: 'News' },
  { id: 'announcements', label: 'Announcements', type: 'Announcement' },
  { id: 'events', label: 'Events', type: 'Event' },
]

const SourcePill = ({ name }) => (
  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#E5E7EB] bg-white px-3 py-[5px] text-[13px] font-medium leading-4 text-[#4B5563]">
    <svg viewBox="0 0 12 12" className="h-3 w-3" stroke="#667085" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 1 2 2.5v3C2 8.5 3.7 10.4 6 11c2.3-.6 4-2.5 4-5.5v-3L6 1Z" />
    </svg>
    {name || 'Official'}
  </span>
)

export default function ContentMonitoringPage({ onNavigate }) {
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [menu, setMenu] = useState(null)
  const [navOpen, setNavOpen] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    const type = TABS.find((t) => t.id === tab)?.type || ''
    Promise.all([
      contentApi.list({ type, search: q.trim(), page: 1, pageSize: 20 }),
      adminApi.pending({ page: 1, pageSize: 20 }).catch(() => ({ items: [] })),
    ])
      .then(([pub, pend]) => {
        const published = Array.isArray(pub) ? pub : []
        let pending = (pend?.items || []).map((r) => ({ ...r, status: r.status || 'PendingApproval' }))
        if (type) pending = pending.filter((r) => r.type === type)
        if (q.trim()) {
          const needle = q.trim().toLowerCase()
          pending = pending.filter((r) => `${r.title} ${r.body} ${r.sourceName}`.toLowerCase().includes(needle))
        }
        setRows([...pending, ...published])
      })
      .catch((e) => {
        setRows([])
        setError(e.message)
      })
      .finally(() => setLoading(false))
  }, [tab, q])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  useEffect(() => {
    const reload = () => load()
    window.addEventListener('cu-content-changed', reload)
    return () => window.removeEventListener('cu-content-changed', reload)
  }, [load])

  const live = rows.filter((r) => r.status === 'Published').length
  const drafts = rows.filter((r) => r.status === 'Draft').length
  const down = rows.filter((r) => r.status === 'Archived').length

  const STATS = [
    { title: 'Content items', value: String(rows.length).padStart(2, '0'), sub: 'Loaded from API' },
    { title: 'Live', value: String(live).padStart(2, '0'), sub: `${drafts} drafts · ${down} taken down` },
    { title: 'Pending approval', value: String(rows.filter((r) => r.status === 'PendingApproval').length).padStart(2, '0'), sub: 'Awaiting super admin' },
    { title: 'Rejected', value: String(rows.filter((r) => r.status === 'Rejected').length).padStart(2, '0'), sub: 'Never published' },
  ]

  return (
    <div className="min-h-screen w-full bg-[#E9E9EA] p-3 md:p-[27px]">
      <div className="flex gap-4 md:gap-6">
        <Sidebar active="content" publishingAs="Campus Update" onNavigate={onNavigate} open={navOpen} onClose={() => setNavOpen(false)} />

        <main className="flex min-w-0 flex-1 flex-col gap-4 md:gap-6">
          <Topbar title="Content monitoring" subtitle="Everything schools publish" onMenu={() => setNavOpen(true)} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
            {STATS.map((s) => (
              <StatCard key={s.title} {...s} />
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex h-10 items-center gap-2 rounded-lg px-4 text-sm leading-[15.2px] ${
                  tab === t.id ? 'bg-[#4F46E5] font-medium text-white' : 'border border-[#E5E7EB] bg-white text-[#344054]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col overflow-hidden rounded-[10px] border border-[#DBDBDB] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <SearchInput placeholder="Search contents, author or audience.." value={q} onChange={(e) => setQ(e.target.value)} />
                <FilterSelect value="All Institutions" options={['All Institutions']} />
                <FilterSelect value="All Statuses" options={['All Statuses']} />
              </div>
              <button type="button" className="text-sm font-medium leading-[15.2px] text-[#4F46E5]" onClick={() => { setQ(''); setTab('all') }}>
                Clear filters
              </button>
            </div>

            {error && (
              <p className="mx-4 mt-4 rounded-lg bg-[#FEE4E2] px-4 py-3 text-sm leading-5 text-[#D92D20]">{error}</p>
            )}

            <div className="overflow-x-auto px-4 pt-6">
              <table className="w-full min-w-[1000px] table-fixed border-collapse">
                <thead>
                  <tr className="h-10">
                    <TH sort className="w-[26%]">CONTENT</TH>
                    <TH sort className="w-[12%]">TYPE</TH>
                    <TH sort className="w-[14%]">SOURCE</TH>
                    <TH sort className="w-[16%]">AUDIENCE</TH>
                    <TH sort className="w-[12%]">STATUS</TH>
                    <TH sort className="w-[12%]">PUBLISHED</TH>
                    <TH className="w-[8%]">ACTION</TH>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#6B7280]">Loading content…</td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#6B7280]">No content found.</td>
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
                        <td className="px-4 py-2.5"><UrgencyPill urgency={r.urgency} type={r.type} /></td>
                        <td className="px-4 py-2.5"><SourcePill name={r.sourceName} /></td>
                        <td className="truncate px-4 py-2.5 text-[13px] leading-[14px] text-[#6B7280]">{r.sourceType}</td>
                        <td className="px-4 py-2.5"><StatusCell status={r.status} /></td>
                        <td className="whitespace-nowrap px-4 py-2.5 text-[13px] leading-[14px] text-[#6B7280]">{timeAgo(r.publishedAt) || '—'}</td>
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
