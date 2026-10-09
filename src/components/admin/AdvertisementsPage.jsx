import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { StatCard, PageCountFooter, TH, DotsMenu } from './ui.jsx'
import { PlusIcon } from './Icons.jsx'

const STATS = [
  { title: 'In review', value: '00', sub: 'Awaiting Approval' },
  { title: 'Live', value: '00', sub: 'Not visible to anyone yet' },
  { title: 'Deactivated', value: '00', sub: 'No longer displayed' },
  { title: 'Rejected', value: '00', sub: 'Never published' },
]

const TABS = [
  { label: 'All', count: '11', active: true },
  { label: 'In review', count: '05' },
  { label: 'Live', count: '03' },
  { label: 'Deactivated', count: '02' },
  { label: 'Rejected', count: '01' },
]

const ROWS = [
  { title: 'Data analysis certificate stud.', meta: 'LCU · submitted 14 days ago', cat: 'Training', adv: 'Brightpath Training', runs: '2026-10-01 → 2026-11-15', status: 'In review', imp: '—' },
  { title: 'Guaranteed 40% monthly ret.', meta: 'LCU · submitted 14 days ago', cat: 'Sponsored content', adv: 'Zenith Wealth Circle', runs: '2026-10-01 → 2026-11-15', status: 'Rejected', imp: '—' },
  { title: 'Graduate trainee programme', meta: 'LCU · submitted 14 days ago', cat: 'Job', adv: 'Meridian Bank', runs: '2026-09-05 → 2026-09-30', status: 'Live', imp: '—' },
  { title: 'Federal Government scholar.', meta: 'LCU · submitted 14 days ago', cat: 'Scholarship', adv: 'Public notice', runs: '2026-10-01 → 2026-11-15', status: 'Live', imp: '12,190' },
  { title: 'Federal Government scholar.', meta: 'LCU · submitted 14 days ago', cat: 'Scholarship', adv: 'Public notice', runs: '2026-10-01 → 2026-11-15', status: 'Live', imp: '12,190' },
  { title: 'Summer internship — fintech', meta: 'LCU · submitted 14 days ago', cat: 'Internship', adv: 'PayLoop Technolo…', runs: '2026-10-01 → 2026-11-15', status: 'Deactivated', imp: '18,400' },
]

function AdStatus({ s }) {
  const map = {
    'In review': ['text-[#4F46E5] bg-[#EEEDFD]', 'M6 1.5v2M6 10.5v-2M3.5 1.5h5l-2 4.5 2 4.5h-5l2-4.5-2-4.5'],
    Rejected: ['text-[#D92D20] bg-[#FEE4E2]', 'M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1Zm-2 3 4 4M8 4 4 8'],
    Live: ['text-[#109E75] bg-[rgba(16,158,117,0.1)]', 'M4.5 7.5 7.5 4.5M3 6l-1 1a2.1 2.1 0 0 0 3 3l1-1M9 6l1-1a2.1 2.1 0 0 0-3-3L6 3'],
    Deactivated: ['text-[#B54708] bg-[#FEF0C7]', 'M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1ZM2.5 9.5l7-7'],
  }
  const [cls, d] = map[s]
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

          <div className="flex flex-wrap gap-3">
            {TABS.map((t) => (
              <button
                key={t.label}
                type="button"
                className={`flex h-10 items-center gap-2 rounded-lg px-4 text-sm leading-[15.2px] ${
                  t.active ? 'bg-[#4F46E5] font-medium text-white' : 'border border-[#E5E7EB] bg-white text-[#344054]'
                }`}
              >
                {t.label}
                <span className="font-semibold">{t.count}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col overflow-hidden rounded-[10px] border border-[#DBDBDB] bg-white">
            <div className="overflow-x-auto px-4 pt-6">
              <table className="w-full min-w-[960px] table-fixed border-collapse">
                <thead>
                  <tr className="h-10">
                    <TH sort className="w-[24%]">PLACEMENT</TH>
                    <TH sort className="w-[14%]">CATEGORY</TH>
                    <TH sort className="w-[14%]">ADVERTISER</TH>
                    <TH sort className="w-[20%]">RUNS</TH>
                    <TH sort className="w-[12%]">STATUS</TH>
                    <TH sort className="w-[10%]">IMPRESSIONS</TH>
                    <TH className="w-[6%]">ACTION</TH>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r, i) => (
                    <tr key={i} className={`h-[58px] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-col gap-1">
                          <span className="truncate text-[15px] font-semibold leading-4 text-[#344054]">{r.title}</span>
                          <span className="truncate text-[13px] leading-[14px] text-[#6B7280]">{r.meta}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center whitespace-nowrap rounded-full border border-[#E5E7EB] bg-white px-3 py-[5px] text-[13px] font-medium leading-4 text-[#4B5563]">
                          {r.cat}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[13px] leading-[14px] text-[#6B7280]">{r.adv}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[13px] leading-[14px] text-[#6B7280]">{r.runs}</td>
                      <td className="px-4 py-2.5"><AdStatus s={r.status} /></td>
                      <td className="px-4 py-2.5 text-[13px] leading-[14px] text-[#6B7280]">{r.imp}</td>
                      <td className="px-4 py-2.5">
                        <DotsMenu open={menu === i} onToggle={() => setMenu(menu === i ? null : i)} items={[{ label: 'View Details', onClick: () => setMenu(null) }, { label: 'Deactivate', onClick: () => setMenu(null) }]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <PageCountFooter left="Showing 1-05 of 24 results" />
          </div>

          <div className="flex flex-col gap-5 rounded-[10px] border border-[#DBDBDB] bg-white p-6">
            <h3 className="text-base font-semibold leading-[17px] text-[#4F46E5]">Displayed to students right now</h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col gap-3 rounded-lg border border-[#E5E7EB] bg-white p-5">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[rgba(16,158,117,0.1)] px-3 py-[5px] text-[13px] font-medium leading-4 text-[#109E75]">
                    <svg viewBox="0 0 12 12" className="h-3 w-3" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4.5 7.5 7.5 4.5M3 6l-1 1a2.1 2.1 0 0 0 3 3l1-1M9 6l1-1a2.1 2.1 0 0 0-3-3L6 3" />
                    </svg>
                    Sponsored
                  </span>
                  <p className="text-[15px] font-semibold leading-[18px] text-[#111827]">
                    Federal Government scholarship — 2028 applications
                  </p>
                  <p className="text-[13px] leading-[17px] text-[#6B7280]">
                    Applications are open for the 2026 federal scholarship. Undergraduates and postgraduates may apply
                    through the official portal.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
