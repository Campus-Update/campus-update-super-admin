import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { StatCard, StatusBadge, AvatarChip, PageCountFooter, TH, FilterSelect, SearchInput, DotsMenu } from './ui.jsx'
import { AdminFormModal, DeactivateModal, DeleteModal, InstitutionsModal, SuspendModal } from './modals.jsx'
import { ViewSmIcon, AssignIcon, OctagonPauseIcon, PowerOffIcon } from './Icons.jsx'

const STATS = [
  { title: 'Students', value: '07', sub: 'Across 2 institutions' },
  { title: 'Staff', value: '06', sub: 'Can sign in and publish' },
  { title: 'School administrators', value: '01', sub: '6 active' },
  { title: 'Platform administrators', value: '03', sub: 'Campus Update team' },
]

const ROWS = [
  { code: 'LU', name: 'Dr. O. Eboreime', email: 'o.eboreime@leadcity.example', type: 'Student', inst: 'Lead City University', fac: 'FOCIT · Computer Science', level: '300L', last: '59 min ago' },
  { code: 'UI', name: 'M. Athar', email: 'm.athar@leadcity.example', type: 'Staff', inst: 'Obafemi Awolowo University', fac: 'FOCIT · Information Technology', level: '300L', last: '1 hour ago' },
  { code: 'UL', name: "Registrar's Office", email: 'registrar@leadcity.example', type: 'School admin', inst: 'Lead City University', fac: 'Full publishing rights, institution-wide', level: '—', last: '2 hours ago' },
  { code: 'OU', name: 'Examinations Office', email: 'exams@leadcity.example', type: 'Platform admin', inst: 'Campus Update', fac: 'Campus Update team', level: '—', last: '1 hour ago' },
  { code: 'OU', name: 'Dr. B. Akinola', email: 'b.akinola@ui.example', type: 'Student', inst: 'Lead City University', fac: 'Full publishing rights, institution-wide', level: '300L', last: 'Not signed in yet' },
  { code: 'OU', name: 'Prof. K. Adeyemi', email: 'k.adeyemi@oau.example', type: 'Student', inst: 'Lead City University', fac: 'Full publishing rights, institution-wide', level: '300L', last: '12 days ago' },
  { code: 'OU', name: 'T. Ojo', email: 't.ojo@oau.example', type: 'Staff', inst: 'Lead City University', fac: 'Technology · Electrical Engineering', level: '300L', last: '8 hours ago' },
  { code: 'OU', name: 'T. Ojo', email: 't.ojo@oau.example', type: 'Staff', inst: 'Lead City University', fac: 'Sciences · Chemistry', level: '300L', last: '8 hours ago' },
  { code: 'OU', name: 'T. Ojo', email: 't.ojo@oau.example', type: 'School admin', inst: 'Lead City University', fac: 'Full publishing rights, institution-wide', level: '—', last: '8 hours ago' },
  { code: 'OU', name: 'T. Ojo', email: 't.ojo@oau.example', type: 'School admin', inst: 'Lead City University', fac: 'Full publishing rights, institution-wide', level: '—', last: '8 hours ago' },
]

const DEPARTMENTS = [
  { name: 'Computer Science', registered: '612', total: '851', rate: '94%' },
  { name: 'Information Technology', registered: '388', total: '354', rate: '89%' },
  { name: 'Software Engineering', registered: '198', total: '226', rate: '88%' },
  { name: 'Cyber Security', registered: '88', total: '144', rate: '61%' },
]

const CHIPS = [
  { label: 'Total:', value: '24', dot: null },
  { label: 'Active', value: '21', dot: '#109E75' },
  { label: 'Deactivated', value: '03', dot: '#D85A30' },
  { label: 'Suspended', value: '03', dot: '#EAB308' },
]

export default function UsersPage({ onNavigate }) {
  const [menu, setMenu] = useState(null)
  const [modal, setModal] = useState(null)
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="min-h-screen w-full bg-[#E9E9EA] p-3 md:p-[27px]">
      <div className="flex gap-4 md:gap-6">
        <Sidebar active="users" publishingAs="Campus Update" onNavigate={onNavigate} open={navOpen} onClose={() => setNavOpen(false)} />

        <main className="flex min-w-0 flex-1 flex-col gap-4 md:gap-6">
          <Topbar title="Users" subtitle="Search accounts and manage status" onMenu={() => setNavOpen(true)} />

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
            {STATS.map((s) => (
              <StatCard key={s.title} {...s} />
            ))}
          </div>

          {/* Table card */}
          <div className="flex flex-col overflow-hidden rounded-[10px] border border-[#DBDBDB] bg-white">
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] px-4 py-2">
              <span className="px-2 text-sm font-semibold leading-[15.2px] text-[#344054]">All Accounts</span>
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <SearchInput />
                <FilterSelect value="All user types" options={['All user types', 'Students', 'Staff', 'School admins', 'Platform admins']} />
                <FilterSelect value="All Institutions" options={['All Institutions', 'Private University', 'Federal University', 'State University', 'Polytechnic', 'College of Education', 'Others']} />
                <FilterSelect value="All Statuses" options={['All Statuses', 'Active', 'Suspended', 'Deactivated']} />
              </div>
              <button type="button" className="text-sm font-medium leading-[15.2px] text-[#4F46E5]">
                Clear filters
              </button>
            </div>

            {/* Status chips */}
            <div className="flex flex-wrap gap-3 px-4 pt-6">
              {CHIPS.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  className="flex h-11 items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-5 text-sm leading-[15.2px] text-[#344054]"
                >
                  {c.dot && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.dot }} />}
                  <span className="font-normal">{c.label}</span>
                  <span className="font-semibold">{c.value}</span>
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto px-4 pt-6">
              <table className="w-full min-w-[960px] table-fixed border-collapse">
                <thead>
                  <tr className="h-10">
                    <TH sort className="w-[22%]">USER</TH>
                    <TH className="w-[10%]">TYPE</TH>
                    <TH sort className="w-[16%]">INSTITUTIONS</TH>
                    <TH sort className="w-[20%]">FACULTY - DEPARTMENT</TH>
                    <TH sort className="w-[7%]">LEVEL</TH>
                    <TH sort className="w-[9%]">STATUS</TH>
                    <TH sort className="w-[10%]">LAST ACTIVE</TH>
                    <TH sort className="w-[6%]">ACTION</TH>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r, i) => (
                    <tr key={i} className={`h-[58px] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <div className="flex items-center gap-4">
                          <AvatarChip name={r.code} />
                          <div className="flex flex-col gap-1">
                            <span className="text-[15px] font-semibold leading-4 text-[#344054]">{r.name}</span>
                            <span className="text-[13px] leading-[14px] text-[#6B7280]">{r.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">{r.type}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">{r.inst}</td>
                      <td className="px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">{r.fac}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">{r.level}</td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <StatusBadge />
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">{r.last}</td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <DotsMenu
                          open={menu === i}
                          onToggle={() => setMenu(menu === i ? null : i)}
                          items={[
                            { label: 'View Details', icon: <ViewSmIcon />, onClick: () => setMenu(null) },
                            { label: 'Assign Institution', icon: <AssignIcon />, onClick: () => { setMenu(null); setModal('assign') } },
                            { label: 'Suspend account', icon: <OctagonPauseIcon />, onClick: () => { setMenu(null); setModal('suspend') } },
                            { label: 'Deactivate account', icon: <PowerOffIcon />, onClick: () => { setMenu(null); setModal('deactivate') } },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <PageCountFooter />
          </div>

          {/* Registration by department */}
          <div className="flex flex-col gap-8 rounded-[10px] border border-[#DBDBDB] bg-white px-4 py-6">
            <div className="flex h-6 items-center justify-between px-2">
              <h3 className="text-lg font-medium leading-[19.6px] text-black">Registration by department</h3>
              <button type="button" className="text-sm font-medium leading-[15.2px] text-[#4F46E5]">
                Lead City University · FOCIT
              </button>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] table-fixed border-collapse">
              <thead>
                <tr className="h-10">
                  <TH sort>DEPARTMENT</TH>
                  <TH sort>REGISTERED</TH>
                  <TH sort>ESTIMATED ROLL</TH>
                  <TH sort>COVERAGE</TH>
                </tr>
              </thead>
              <tbody>
                {DEPARTMENTS.map((d, i) => (
                  <tr key={d.name} className={`h-[58px] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                    <td className="px-4 py-2.5 text-sm font-medium leading-[15.2px] text-[#344054]">{d.name}</td>
                    <td className="px-4 py-2.5 text-sm leading-[15.2px] text-[#6B7280]">{d.registered}</td>
                    <td className="px-4 py-2.5 text-sm leading-[15.2px] text-[#6B7280]">{d.total}</td>
                    <td className="px-4 py-2.5 text-sm leading-[15.2px] text-[#6B7280]">{d.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </main>
      </div>

      {modal === 'assign' && <InstitutionsModal onClose={() => setModal(null)} />}
      {modal === 'suspend' && <SuspendModal onClose={() => setModal(null)} />}
      {modal === 'deactivate' && <DeactivateModal kind="user" onClose={() => setModal(null)} />}
    </div>
  )
}
