import { useCallback, useEffect, useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { PageCountFooter, TH, DotsMenu } from './ui.jsx'
import { contentApi } from '../../lib/api.js'
import { timeAgo, StatusCell, UrgencyPill, menuItemsFor } from '../../lib/format.jsx'

const SourcePill = ({ name }) => (
  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#E5E7EB] bg-white px-3 py-[5px] text-[13px] font-medium leading-4 text-[#4B5563]">
    <svg viewBox="0 0 12 12" className="h-3 w-3" stroke="#667085" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 1 2 2.5v3C2 8.5 3.7 10.4 6 11c2.3-.6 4-2.5 4-5.5v-3L6 1Z" />
    </svg>
    {name || 'External'}
  </span>
)

export default function ExternalEventsPage({ onNavigate }) {
  const [menu, setMenu] = useState(null)
  const [navOpen, setNavOpen] = useState(false)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    contentApi
      .list({ type: 'Event', page: 1, pageSize: 20 })
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

  const count = (s) => String(rows.filter((r) => r.status === s).length).padStart(2, '0')
  const STATS = [
    { value: String(rows.length).padStart(2, '0'), sub: 'Submitted' },
    { value: count('Published'), sub: 'Live' },
    { value: count('PendingApproval'), sub: 'Awaiting approval' },
    { value: count('Draft'), sub: 'Drafts' },
    { value: count('Rejected'), sub: 'Rejected' },
    { value: count('Archived'), sub: 'Taken down' },
  ]

  return (
    <div className="min-h-screen w-full bg-[#E9E9EA] p-3 md:p-[27px]">
      <div className="flex gap-4 md:gap-6">
        <Sidebar active="events" publishingAs="Campus Update" onNavigate={onNavigate} open={navOpen} onClose={() => setNavOpen(false)} />

        <main className="flex min-w-0 flex-1 flex-col gap-4 md:gap-6">
          <Topbar title="External events" subtitle="Submit → Review → Payment → Approval → Publish" onMenu={() => setNavOpen(true)} />

          <div className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-6">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col gap-5 rounded-2xl border border-[#DBDBDB] bg-white px-6 py-7">
                <p className="text-4xl font-medium leading-[41.6px] text-black">{s.value}</p>
                <p className="text-base leading-[17.4px] text-[#666666]">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-[10px] border border-[#DBDBDB] bg-white p-6 md:p-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold leading-[20px] text-[#111827]">
                Submit → Review → Payment → Approval → Publish.
              </h2>
              <p className="text-sm leading-[18px] text-[#6B7280]">
                Nothing reaches a student before payment clears and a Campus Update administrator gives final approval.
                Each step is a separate action, and the log shows who did which. Organisers reach us by phone or email,
                never through the app.
              </p>
            </div>

            {error && (
              <p className="rounded-lg bg-[#FEE4E2] px-4 py-3 text-sm leading-5 text-[#D92D20]">{error}</p>
            )}

            <div className="overflow-x-auto pt-2">
              <table className="w-full min-w-[1000px] table-fixed border-collapse">
                <thead>
                  <tr className="h-10">
                    <TH sort className="w-[28%]">CONTENT</TH>
                    <TH sort className="w-[14%]">URGENCY</TH>
                    <TH sort className="w-[14%]">SOURCE</TH>
                    <TH sort className="w-[14%]">STATUS</TH>
                    <TH sort className="w-[16%]">PUBLISHED</TH>
                    <TH className="w-[8%]">ACTION</TH>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#6B7280]">Loading events…</td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#6B7280]">No events found.</td>
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
