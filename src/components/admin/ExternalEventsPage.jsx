import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { StatCard, PageCountFooter, TH, DotsMenu } from './ui.jsx'
import { StatusPill } from './SchoolsPage.jsx'

const STATS = [
  { title: '', value: '07', sub: 'Submitted' },
  { title: '', value: '07', sub: 'Across 2 institutions' },
  { title: '', value: '07', sub: 'Across 2 institutions' },
  { title: '', value: '06', sub: '4 drafts · 0 taken down' },
  { title: '', value: '01', sub: 'Live right now' },
  { title: '', value: '25,506', sub: '2 sent as push' },
]

const ROW = { title: 'CSC 304 exam venue moved…', meta: 'Examinations Office · 1 hour ago' }

const SourcePill = () => (
  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#E5E7EB] bg-white px-3 py-[5px] text-[13px] font-medium leading-4 text-[#4B5563]">
    <svg viewBox="0 0 12 12" className="h-3 w-3" stroke="#667085" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 1 2 2.5v3C2 8.5 3.7 10.4 6 11c2.3-.6 4-2.5 4-5.5v-3L6 1Z" />
    </svg>
    Official
  </span>
)

export default function ExternalEventsPage({ onNavigate }) {
  const [menu, setMenu] = useState(null)
  const [navOpen, setNavOpen] = useState(false)

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

            <div className="overflow-x-auto pt-2">
              <table className="w-full min-w-[1000px] table-fixed border-collapse">
                <thead>
                  <tr className="h-10">
                    <TH sort className="w-[22%]">CONTENT</TH>
                    <TH sort className="w-[15%]">TYPE</TH>
                    <TH sort className="w-[10%]">SOURCE</TH>
                    <TH sort className="w-[15%]">INSTITUTION</TH>
                    <TH sort className="w-[14%]">AUDIENCE</TH>
                    <TH sort className="w-[10%]">STATUS</TH>
                    <TH sort className="w-[10%]">REACH · OPENED</TH>
                    <TH className="w-[4%]">ACTION</TH>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className={`h-[58px] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-col gap-1">
                          <span className="truncate text-[15px] font-semibold leading-4 text-[#344054]">{ROW.title}</span>
                          <span className="truncate text-[13px] leading-[14px] text-[#6B7280]">{ROW.meta}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">Faculty administrator</td>
                      <td className="px-4 py-2.5"><SourcePill /></td>
                      <td className="px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">Lead City University</td>
                      <td className="px-4 py-2.5 text-[13px] leading-[14px] text-[#6B7280]">Computer Science · 300L…</td>
                      <td className="px-4 py-2.5"><StatusPill label="Active" /></td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[13px] leading-[14px] text-[#6B7280]">147 · 93%</td>
                      <td className="px-4 py-2.5">
                        <DotsMenu open={menu === i} onToggle={() => setMenu(menu === i ? null : i)} items={[{ label: 'View Details', onClick: () => setMenu(null) }, { label: 'View log', onClick: () => setMenu(null) }]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <PageCountFooter />
          </div>
        </main>
      </div>
    </div>
  )
}
