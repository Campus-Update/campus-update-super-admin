import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { StatCard, PageCountFooter, TH, FilterSelect, SearchInput, DotsMenu } from './ui.jsx'
import { StatusPill } from './SchoolsPage.jsx'

const STATS = [
  { title: 'Content items', value: '07', sub: 'Across 2 institutions' },
  { title: 'Live', value: '06', sub: '4 drafts · 0 taken down' },
  { title: 'Urgent announcements', value: '01', sub: 'Live right now' },
  { title: 'Total views', value: '25,506', sub: '2 sent as push' },
]

const TABS = [
  { id: 'all', label: 'All', count: '20' },
  { id: 'news', label: 'News', count: '04' },
  { id: 'announcements', label: 'Announcements', count: '05' },
  { id: 'events', label: 'Events', count: '04' },
  { id: 'calendar', label: 'Calendar', count: '07' },
]

const CHIPS = [
  { label: 'Total:', value: '24', dot: null },
  { label: 'Live', value: '21', dot: '#109E75' },
  { label: 'Draft', value: '03', dot: '#D85A30' },
  { label: 'Taken down', value: '03', dot: '#D85A30' },
]

const ROWS = [
  { title: 'CSC 304 exam venue moved…', meta: 'Examinations Office · 1 hour ago', cat: 'announcements', type: 'Urgent', tone: 'amber', icon: 'warn', status: 'Live', sTone: 'green', sIcon: 'link', aud: 'Computer Science · 300L…' },
  { title: 'Hostel inspection this Friday', meta: 'Student Affairs · 5 hours ago', cat: 'announcements', type: 'Normal', tone: 'gray', icon: 'dot', status: 'Draft', sTone: 'gray', sIcon: 'edit', aud: 'Computer Science · 300L…' },
  { title: 'Second semester registratio…', meta: "Registrar's Office · 1 day ago", cat: 'announcements', type: 'Important', tone: 'amber', icon: 'alert', status: 'Live', sTone: 'green', sIcon: 'link', aud: 'Computer Science · 300L…' },
  { title: 'FOCIT Hackathon 2026', meta: 'FOCIT · 1 day ago', cat: 'events', type: 'Events', tone: 'plain', status: 'Live', sTone: 'green', sIcon: 'link', aud: 'Computer Science · 300L…' },
  { title: "Vice-Chancellor's address to…", meta: "Registrar's Office · 2 days ago", cat: 'news', type: 'News', tone: 'plain', status: 'Draft', sTone: 'gray', sIcon: 'edit', aud: 'Computer Science · 300L…' },
  { title: 'Examination timetable publis…', meta: 'Examinations Office · 3 days ago', cat: 'calendar', type: 'Calendar', tone: 'plain', status: 'Draft', sTone: 'gray', sIcon: 'edit', aud: 'Computer Science · 300L…' },
  { title: 'FOCIT introduces machine le…', meta: 'FOCIT Comms · 13 days ago', cat: 'news', type: 'News', tone: 'plain', status: 'Draft', sTone: 'gray', sIcon: 'edit', aud: 'Entire institution' },
  { title: 'Lagos Developer Bootcamp…', meta: 'Brightpath Training Ltd · 13 days ago', cat: 'events', type: 'News', tone: 'plain', status: 'Live', sTone: 'red', sIcon: 'link', aud: 'FOCIT' },
  { title: 'New study hub opens in Bloc…', meta: 'Campus Services · 14 days ago', cat: 'news', type: 'News', tone: 'plain', status: 'Live', sTone: 'green', sIcon: 'link', aud: 'Computer Science · 300L…' },
  { title: 'Library extends weekend op…', meta: 'University Library · 15 days ago', cat: 'news', type: 'Normal', tone: 'gray', icon: 'dot', status: 'Live', sTone: 'green', sIcon: 'link', aud: 'Computer Science · 300L…' },
]

const S = ({ d, stroke = 'currentColor' }) => (
  <svg viewBox="0 0 12 12" className="h-3 w-3" stroke={stroke} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

function TypePill({ row }) {
  if (row.tone === 'plain')
    return <span className="inline-flex items-center whitespace-nowrap rounded-full border border-[#E5E7EB] bg-white px-3 py-[5px] text-[13px] font-medium leading-4 text-[#4B5563]">{row.type}</span>
  if (row.tone === 'amber')
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#FEF0C7] px-3 py-[5px] text-[13px] font-medium leading-4 text-[#B54708]">
        {row.icon === 'warn' ? <S d="M6 1.5 11 10.5H1L6 1.5ZM6 5v2.5M6 9.5v.5" stroke="#DC6803" /> : <S d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1Zm0 2.5V7M6 8.7v.3" stroke="#DC6803" />}
        {row.type}
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#E5E7EB] bg-white px-3 py-[5px] text-[13px] font-medium leading-4 text-[#4B5563]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#667085]" />
      {row.type}
    </span>
  )
}

const SourcePill = () => (
  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#E5E7EB] bg-white px-3 py-[5px] text-[13px] font-medium leading-4 text-[#4B5563]">
    <S d="M6 1 2 2.5v3C2 8.5 3.7 10.4 6 11c2.3-.6 4-2.5 4-5.5v-3L6 1Z" stroke="#667085" />
    Official School
  </span>
)

function StatusCell({ row }) {
  const tones = { green: 'text-[#109E75] bg-[rgba(16,158,117,0.1)]', red: 'text-[#D92D20] bg-[#FEE4E2]', gray: 'text-[#667085] bg-white border border-[#E5E7EB]' }
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-[5px] text-[13px] font-medium leading-4 ${tones[row.sTone]}`}>
      {row.sIcon === 'link' ? <S d="M4.5 7.5 7.5 4.5M3 6l-1 1a2.1 2.1 0 0 0 3 3l1-1M9 6l1-1a2.1 2.1 0 0 0-3-3L6 3" /> : <S d="M8.5 3.5h-2M8.5 3.5v2M8.5 3.5 5 7M3.5 5.5h2v3h-2z" />}
      {row.status}
    </span>
  )
}

export default function ContentMonitoringPage({ onNavigate }) {
  const [tab, setTab] = useState('all')
  const [menu, setMenu] = useState(null)
  const [navOpen, setNavOpen] = useState(false)

  const rows = tab === 'all' ? ROWS : ROWS.filter((r) => r.cat === tab)

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
                <span className="font-semibold">{t.count}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col overflow-hidden rounded-[10px] border border-[#DBDBDB] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <SearchInput placeholder="Search contents, author or audience.." />
                <FilterSelect value="All Institutions" options={['All Institutions', 'Lead City University', 'University of Ibadan']} />
                <FilterSelect value="All Statuses" options={['All Statuses', 'Live', 'Draft', 'Taken down']} />
              </div>
              <button type="button" className="text-sm font-medium leading-[15.2px] text-[#4F46E5]">Clear filters</button>
            </div>

            <div className="flex flex-wrap gap-3 px-4 pt-6">
              {CHIPS.map((c) => (
                <button key={c.label} type="button" className="flex h-11 items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-5 text-sm leading-[15.2px] text-[#344054]">
                  {c.dot && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.dot }} />}
                  <span className="font-normal">{c.label}</span>
                  <span className="font-semibold">{c.value}</span>
                </button>
              ))}
            </div>

            <div className="overflow-x-auto px-4 pt-6">
              <table className="w-full min-w-[1000px] table-fixed border-collapse">
                <thead>
                  <tr className="h-10">
                    <TH sort className="w-[22%]">CONTENT</TH>
                    <TH sort className="w-[11%]">TYPE</TH>
                    <TH sort className="w-[13%]">SOURCE</TH>
                    <TH sort className="w-[15%]">INSTITUTION</TH>
                    <TH sort className="w-[15%]">AUDIENCE</TH>
                    <TH sort className="w-[10%]">STATUS</TH>
                    <TH sort className="w-[10%]">REACH · OPENED</TH>
                    <TH className="w-[4%]">ACTION</TH>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className={`h-[58px] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-col gap-1">
                          <span className="truncate text-[15px] font-semibold leading-4 text-[#344054]">{r.title}</span>
                          <span className="truncate text-[13px] leading-[14px] text-[#6B7280]">{r.meta}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5"><TypePill row={r} /></td>
                      <td className="px-4 py-2.5"><SourcePill /></td>
                      <td className="px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">Lead City University</td>
                      <td className="px-4 py-2.5 text-[13px] leading-[14px] text-[#6B7280]">{r.aud}</td>
                      <td className="px-4 py-2.5"><StatusCell row={r} /></td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[13px] leading-[14px] text-[#6B7280]">147 · 93%</td>
                      <td className="px-4 py-2.5">
                        <DotsMenu open={menu === i} onToggle={() => setMenu(menu === i ? null : i)} items={[{ label: 'View Details', onClick: () => setMenu(null) }, { label: 'Take down', danger: true, onClick: () => setMenu(null) }]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <PageCountFooter left={tab === 'all' ? 'Showing 1–10 of 24 results' : `Showing 1-0${rows.length} of 24 results`} />
          </div>
        </main>
      </div>
    </div>
  )
}
