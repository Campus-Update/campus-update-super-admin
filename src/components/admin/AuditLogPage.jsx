import { useCallback, useEffect, useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { PageCountFooter, TH, FilterSelect, SearchInput } from './ui.jsx'
import { api } from '../../lib/api.js'
import { timeAgo } from '../../lib/format.jsx'

const DEMO = [
  { at: '2026-10-07T14:16:00Z', who: 'Campus Update — Jeremiah A.', role: 'Platform administrator', action: 'Exported audit log', tag: 'Access', resource: '14 records', inst: 'Platform' },
  { at: '2026-10-07T08:31:00Z', who: 'Campus Update — Jeremiah A.', role: 'Platform administrator', action: 'Received advertisement for review', tag: 'Advertisement', resource: 'CSC 304 exam venue moved to Auditorium B', inst: 'Lead City University' },
  { at: '2026-10-06T20:38:00Z', who: 'Examinations Office', role: 'School administrator', action: 'Suspended user', tag: 'User', resource: 'CSC 304 exam venue moved to Auditorium B', inst: 'Lead City University' },
  { at: '2026-10-05T20:40:00Z', who: "Registrar's Office", role: 'School administrator', action: 'Added school', tag: 'School', resource: 'Registration closes 26 September · 4,820 r…', inst: 'University of Ibadan' },
  { at: '2026-09-30T21:10:00Z', who: 'Campus Update — Jeremiah A.', role: 'Platform administrator', action: 'Approved advertisement', tag: 'Advertisement', resource: 'Zainab Lawal · Lead City University', inst: 'University of Ibadan' },
  { at: '2026-09-27T21:10:00Z', who: 'Campus Update — Jeremiah A.', role: 'Platform administrator', action: 'Confirmed payment', tag: 'External event', resource: 'Dr. B. Akinola · Institution administrator · Un…', inst: 'Lead City University' },
  { at: '2026-09-23T21:10:00Z', who: 'Campus Update — Jeremiah A.', role: 'School administrator', action: 'Granted publishing rights', tag: 'Advertisement', resource: 'Guaranteed 40% monthly returns · guarant…', inst: 'Lead City University' },
  { at: '2026-09-18T21:10:00Z', who: 'Campus Update — Jeremiah A.', role: 'Platform administrator', action: 'Deactivated school', tag: 'School', resource: 'Obafemi Awolowo University · paused at th…', inst: 'Obafemi Awolowo University' },
]

const Tag = ({ t }) => (
  <span className="inline-flex items-center whitespace-nowrap rounded-full border border-[#E5E7EB] bg-white px-3 py-[5px] text-[13px] font-medium leading-4 text-[#4B5563]">
    {t}
  </span>
)

export default function AuditLogPage({ onNavigate }) {
  const [navOpen, setNavOpen] = useState(false)
  const [rows, setRows] = useState(DEMO)
  const [sample, setSample] = useState(false)
  const [q, setQ] = useState('')

  useEffect(() => {
    api('/api/v1/admin/audit')
      .then((d) => {
        const items = Array.isArray(d) ? d : d?.items || []
        if (items.length) setSample(false)
        setRows(items.length ? items : DEMO)
        if (!items.length) setSample(true)
      })
      .catch(() => {
        setRows(DEMO)
        setSample(true)
      })
  }, [])

  const shown = rows.filter((r) => `${r.action} ${r.who} ${r.resource} ${r.inst}`.toLowerCase().includes(q.toLowerCase()))

  const exportCsv = () => {
    const head = ['Date and time', 'Administrator', 'Role', 'Action', 'Affected resource', 'Institution']
    const lines = shown.map((r) => [r.at, r.who, r.role, r.action, r.resource, r.inst].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
    const blob = new Blob([[head.join(','), ...lines].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'audit-log.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="min-h-screen w-full bg-[#E9E9EA] p-3 md:p-[27px]">
      <div className="flex gap-4 md:gap-6">
        <Sidebar active="audit" publishingAs="Campus Update" onNavigate={onNavigate} open={navOpen} onClose={() => setNavOpen(false)} />

        <main className="flex min-w-0 flex-1 flex-col gap-4 md:gap-6">
          <Topbar title="Audit log" subtitle="Every admin action, permanently recorded" onMenu={() => setNavOpen(true)} />

          <div className="flex justify-end">
            <button type="button" onClick={exportCsv} className="flex h-[66px] items-center gap-3 rounded-[10px] bg-[#4F46E5] px-7 text-base font-semibold leading-[22px] text-white hover:bg-[#4338CA]">
              <svg viewBox="0 0 20 20" className="h-5 w-5" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 3v10m0 0 4-4m-4 4-4-4M3 17h14" />
              </svg>
              Export CSV
            </button>
          </div>

          <div className="flex flex-col overflow-hidden rounded-[10px] border border-[#DBDBDB] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <SearchInput placeholder="Search contents, author or audience.." value={q} onChange={(e) => setQ(e.target.value)} />
                <FilterSelect value="All administrators" options={['All administrators']} />
                <FilterSelect value="All actions" options={['All actions']} />
                <FilterSelect value="All institutions" options={['All institutions']} />
                <FilterSelect value="All times" options={['All times']} />
              </div>
              <button type="button" className="text-sm font-medium leading-[15.2px] text-[#4F46E5]" onClick={() => setQ('')}>
                Clear filters
              </button>
            </div>

            {sample && (
              <p className="mx-4 mt-4 rounded-lg bg-[#EEEDFD] px-4 py-3 text-sm leading-5 text-[#4F46E5]">
                Audit endpoint not live yet — showing sample rows.
              </p>
            )}

            <div className="flex items-center justify-between px-4 pt-6">
              <h3 className="text-base font-semibold leading-[18px] text-[#111827]">All administrative actions</h3>
              <button type="button" className="text-[13px] font-medium leading-4 text-[#4F46E5]">View all</button>
            </div>

            <div className="overflow-x-auto px-4 pt-4">
              <table className="w-full min-w-[1000px] table-fixed border-collapse">
                <thead>
                  <tr className="h-10">
                    <TH sort className="w-[17%]">DATE AND TIME</TH>
                    <TH sort className="w-[21%]">ADMINISTRATOR</TH>
                    <TH sort className="w-[22%]">ACTION</TH>
                    <TH sort className="w-[24%]">AFFECTED RESOURCE</TH>
                    <TH sort className="w-[16%]">INSTITUTION</TH>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r, i) => (
                    <tr key={i} className="border-t border-[#EDEDF0] bg-white">
                      <td className="px-4 py-4">
                        <span className="block text-[15px] font-semibold leading-5 text-[#344054]">
                          {new Date(r.at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="mt-1 block text-[13px] leading-4 text-[#9CA3AF]">{timeAgo(r.at)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="block truncate text-[15px] leading-5 text-[#344054]">{r.who}</span>
                        <span className="mt-1 block truncate text-[13px] leading-4 text-[#9CA3AF]">{r.role}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="block truncate text-[15px] leading-5 text-[#344054]">{r.action}</span>
                        <span className="mt-1.5 block"><Tag t={r.tag} /></span>
                      </td>
                      <td className="truncate px-4 py-4 text-[13px] leading-4 text-[#6B7280]">{r.resource}</td>
                      <td className="truncate px-4 py-4 text-[13px] leading-4 text-[#6B7280]">{r.inst}</td>
                    </tr>
                  ))}
                  {shown.length === 0 && (
                    <tr className="border-t border-[#EDEDF0]">
                      <td colSpan={5} className="px-4 py-10 text-center text-sm leading-5 text-[#6B7280]">No audit entries match the current filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <PageCountFooter left={`Showing ${shown.length ? `1-${shown.length}` : 0} of ${shown.length} results`} />
          </div>
        </main>
      </div>
    </div>
  )
}
