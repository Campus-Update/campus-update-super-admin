import { useMemo, useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { StatCard, AvatarChip, TH, FilterSelect, SearchInput, DotsMenu } from './ui.jsx'
import { AddSchoolModal, SchoolSuccessModal } from './schoolsModals.jsx'
import { PlusIcon } from './Icons.jsx'

const STATS = [
  { title: 'Institutions', value: '04', sub: 'On the platform' },
  { title: 'Live', value: '01', sub: 'Serving content to students' },
  { title: 'Onboarding / prospect', value: '02', sub: '1 onboarding · 1 prospect' },
  { title: 'Deactivated', value: '03', sub: 'Content hidden' },
]

const CHIPS = [
  { key: 'All', label: 'Total:', value: '24', dot: null },
  { key: 'Live', label: 'Live', value: '21', dot: '#109E75' },
  { key: 'Onboarding', label: 'Onboarding', value: '03', dot: '#D85A30' },
  { key: 'Prospect', label: 'Prospect', value: '03', dot: '#D85A30' },
  { key: 'Deactivated', label: 'Deactivated', value: '03', dot: '#D85A30' },
]

const LCU = { name: 'Lead City University', loc: 'Ibadan, Oyo · Pilot · FOCIT', status: 'Live', students: 5240, staff: 5240, admins: 5, content: 41, initials: 'LU' }
export const SCHOOLS = [
  ...Array.from({ length: 7 }, (_, i) => ({ ...LCU, id: i + 1 })),
  { id: 8, initials: 'UI', name: 'University of Ibadan', loc: 'Ibadan, Oyo · Agreement signed', status: 'Paused', students: null, staff: null, admins: 5, content: 2 },
  { id: 9, initials: 'UL', name: 'University of Lagos', loc: 'Akoka, Lagos · First meeting held', status: 'Onboarding', students: null, staff: null, admins: 7, content: 4 },
  { id: 10, initials: 'OU', name: 'Obafemi Awolowo University', loc: "Ile-Ife, Osun · Paused at school's request", status: 'Prospect', students: null, staff: null, admins: 4, content: 25 },
  ...Array.from({ length: 14 }, (_, i) => ({ ...LCU, id: i + 11 })),
]

const fmt = (n) => (n == null ? '--' : n.toLocaleString('en-US'))

const read = (k, d) => {
  try { return JSON.parse(window.sessionStorage.getItem(k)) ?? d } catch { return d }
}

export function StatusPill({ label, tone = 'green' }) {
  const tones = {
    green: 'text-[#109E75] bg-[rgba(16,158,117,0.1)]',
    red: 'text-[#D92D20] bg-[#FEE4E2]',
    amber: 'text-[#B54708] bg-[#FEF0C7]',
    purple: 'text-[#4F46E5] bg-[#EEEDFD]',
    gray: 'text-[#667085] bg-white border border-[#E5E7EB]',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-[5px] text-sm font-medium leading-[15.2px] ${tones[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}

export default function SchoolsPage({ onNavigate }) {
  const [schools, setSchools] = useState(() => {
    const saved = read('campus-update-school-ids', []).map((id) => read(`campus-update-school-${id}`, null)).filter(Boolean)
    const deleted = read('campus-update-deleted-school-ids', [])
    const byId = new Map(saved.map((s) => [s.id, s]))
    return [...saved.filter((s) => !SCHOOLS.some((x) => x.id === s.id)), ...SCHOOLS.map((s) => byId.get(s.id) || s)].filter((s) => !deleted.includes(s.id))
  })
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All')
  const [sort, setSort] = useState({ key: null, dir: 1 })
  const [page, setPage] = useState(1)
  const [per, setPer] = useState(10)
  const [menu, setMenu] = useState(null)
  const [modal, setModal] = useState(null)
  const [added, setAdded] = useState(null)
  const [navOpen, setNavOpen] = useState(false)

  const rows = useMemo(() => {
    let r = schools.filter((s) => (status === 'All' || status === 'Deactivated' ? s.status === status || (status === 'All' && true) : s.status === status) && (status === 'All' || s.status === status) && `${s.name} ${s.loc} ${s.status}`.toLowerCase().includes(q.toLowerCase()))
    if (sort.key) r = [...r].sort((a, b) => ((a[sort.key] ?? -1) > (b[sort.key] ?? -1) ? 1 : -1) * sort.dir)
    return r
  }, [q, schools, status, sort])

  const pages = Math.max(1, Math.ceil(rows.length / per))
  const cur = Math.min(page, pages)
  const shown = rows.slice((cur - 1) * per, cur * per)
  const sortBy = (key) => setSort((s) => ({ key, dir: s.key === key ? -s.dir : 1 }))

  const addSchool = (f) => {
    const school = {
      id: Math.max(0, ...schools.map((s) => s.id)) + 1,
      name: f.institutionName, initials: (f.shortName || 'CU').toUpperCase(),
      loc: `${f.location} · ${f.status}`, status: f.status,
      students: null, staff: null, admins: 0, content: 0, ...f,
      addedAt: new Date().toISOString(),
    }
    window.sessionStorage.setItem(`campus-update-school-${school.id}`, JSON.stringify(school))
    window.sessionStorage.setItem('campus-update-school-ids', JSON.stringify([...new Set([...read('campus-update-school-ids', []), school.id])]))
    setSchools((c) => [school, ...c])
    setAdded(school)
    setModal('success')
  }

  return (
    <div className="min-h-screen w-full bg-[#E9E9EA] p-3 md:p-[27px]">
      <div className="flex gap-4 md:gap-6">
        <Sidebar active="schools" publishingAs="Campus Update" onNavigate={onNavigate} open={navOpen} onClose={() => setNavOpen(false)} />

        <main className="flex min-w-0 flex-1 flex-col gap-4 md:gap-6">
          <Topbar title="Schools" subtitle="Add, edit and activate institutions" onMenu={() => setNavOpen(true)} />

          <div className="flex justify-end">
            <button type="button" onClick={() => setModal('add')} className="flex h-[54px] items-center gap-3 rounded-[10px] bg-[#4F46E5] px-7 text-base font-semibold leading-[22px] text-white hover:bg-[#4338CA]">
              <PlusIcon className="h-5 w-5" stroke="#fff" />
              Add New School
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
            {STATS.map((s) => <StatCard key={s.title} {...s} />)}
          </div>

          <div className="flex flex-col overflow-hidden rounded-[10px] border border-[#DBDBDB] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <SearchInput placeholder="Search by name, email, role..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} />
                <FilterSelect value={status === 'All' ? 'All Statuses' : status} options={['All Statuses', 'Live', 'Paused', 'Onboarding', 'Prospect', 'Deactivated']} />
              </div>
              <button type="button" className="text-sm font-medium leading-[15.2px] text-[#4F46E5]" onClick={() => { setQ(''); setStatus('All'); setSort({ key: null, dir: 1 }); setPage(1) }}>
                Clear filters
              </button>
            </div>

            <div className="flex flex-wrap gap-3 px-4 pt-6">
              {CHIPS.map((c) => (
                <button key={c.key} type="button" onClick={() => { setStatus(c.key === 'All' ? 'All' : c.key); setPage(1) }}
                  className={`flex h-11 items-center gap-2 rounded-lg border px-5 text-sm leading-[15.2px] text-[#344054] ${status === c.key || (c.key === 'All' && status === 'All') ? 'border-[#4F46E5]' : 'border-[#E5E7EB] bg-white'}`}>
                  {c.dot && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.dot }} />}
                  <span className="font-normal">{c.label}</span>
                  <span className="font-semibold">{c.value}</span>
                </button>
              ))}
            </div>

            <div className="overflow-x-auto px-4 pt-6">
              <table className="w-full min-w-[900px] table-fixed border-collapse">
                <thead>
                  <tr className="h-10">
                    <TH className="w-[30%]" onSort={() => sortBy('name')}>INSTITUTION</TH>
                    <TH className="w-[12%]" onSort={() => sortBy('status')}>STATUS</TH>
                    <TH className="w-[12%]" onSort={() => sortBy('students')}>STUDENTS</TH>
                    <TH className="w-[12%]" onSort={() => sortBy('staff')}>STAFFS</TH>
                    <TH className="w-[10%]" onSort={() => sortBy('admins')}>ADMINS</TH>
                    <TH className="w-[16%]" onSort={() => sortBy('content')}>LIVE CONTENTS</TH>
                    <TH className="w-[8%]">ACTION</TH>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((s, i) => (
                    <tr key={s.id} className={`h-[58px] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <div className="flex items-center gap-4">
                          <AvatarChip name={s.initials} />
                          <div className="flex flex-col gap-1">
                            <button type="button" className="text-left text-[15px] font-semibold leading-4 text-[#344054] hover:text-[#4F46E5]" onClick={() => { window.location.hash = `/schools/${s.id}` }}>
                              {s.name}
                            </button>
                            <span className="text-[13px] leading-[14px] text-[#6B7280]">{s.loc}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5"><StatusPill label={s.status} /></td>
                      <td className="px-4 py-2.5 text-sm leading-[15.2px] text-[#344054]">{fmt(s.students)}</td>
                      <td className="px-4 py-2.5 text-sm leading-[15.2px] text-[#344054]">{fmt(s.staff)}</td>
                      <td className="px-4 py-2.5 text-sm leading-[15.2px] text-[#344054]">{s.admins}</td>
                      <td className="px-4 py-2.5 text-sm leading-[15.2px] text-[#6B7280]">{s.content}</td>
                      <td className="px-4 py-2.5">
                        <DotsMenu open={menu === s.id} onToggle={() => setMenu(menu === s.id ? null : s.id)} items={[
                          { label: 'View Details', onClick: () => { setMenu(null); window.location.hash = `/schools/${s.id}` } },
                          { label: 'Edit School', onClick: () => setMenu(null) },
                          { label: 'Deactivate', onClick: () => setMenu(null) },
                        ]} />
                      </td>
                    </tr>
                  ))}
                  {!shown.length && (
                    <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-[#6B7280]">No schools match these filters. Clear filters to see all institutions.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex min-h-[86px] w-full flex-wrap items-center justify-between gap-4 border-t border-[#E5E7EB] bg-white px-4 py-4">
              <p className="text-[13px] leading-[17px] text-[#6B7280]">Showing {rows.length ? (cur - 1) * per + 1 : 0}-{Math.min(cur * per, rows.length)} of {rows.length} results</p>
              <div className="flex items-center gap-12">
                <div className="relative">
                  <select className="h-10 cursor-pointer appearance-none rounded-lg border border-[#E5E7EB] bg-white px-4 pr-9 text-[13px] leading-[17px] text-[#6B7280] outline-none" value={per} onChange={(e) => { setPer(+e.target.value); setPage(1) }} aria-label="Rows per page">
                    {[10, 24, 48].map((n) => <option key={n} value={n}>{n} per page</option>)}
                  </select>
                  <svg viewBox="0 0 16 16" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" stroke="#6B7280" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="m4 6 4 4 4-4" /></svg>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" aria-label="Previous page" disabled={cur === 1} onClick={() => setPage(cur - 1)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-40">
                    <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="m10 4-4 4 4 4" /></svg>
                  </button>
                  {Array.from({ length: pages }).slice(0, 3).map((_, i) => (
                    <button key={i} type="button" onClick={() => setPage(i + 1)} className={`flex h-8 w-8 items-center justify-center rounded-lg text-[13px] leading-[17px] ${cur === i + 1 ? 'bg-[#4F46E5] font-medium text-white' : 'text-[#4B5563]'}`}>{i + 1}</button>
                  ))}
                  <button type="button" aria-label="Next page" disabled={cur === pages} onClick={() => setPage(cur + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-40">
                    <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="m6 4 4 4-4 4" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {modal === 'add' && <AddSchoolModal onClose={() => setModal(null)} onSubmit={addSchool} />}
      {modal === 'success' && <SchoolSuccessModal school={added} onClose={() => setModal(null)} />}
    </div>
  )
}
