import { useEffect, useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { StatCard, StatusBadge, AvatarChip, PageCountFooter, TH, FilterSelect, SearchInput, DotsMenu } from './ui.jsx'
import { AdminFormModal, DeactivateModal, DeleteModal, InstitutionsModal, SuspendModal } from './modals.jsx'
import { ViewSmIcon, AssignIcon, OctagonPauseIcon, PowerOffIcon } from './Icons.jsx'
import { adminApi, usersApi } from '../../lib/api.js'
import { timeAgo } from '../../lib/format.jsx'

const ROLE_LABEL = {
  Student: 'Student',
  Staff: 'Staff',
  InstitutionAdmin: 'School admin',
  LeadSchoolAdmin: 'School admin',
  SchoolAdmin: 'School admin',
  NewsAdmin: 'School admin',
  CalendarAdmin: 'School admin',
  SuperAdmin: 'Platform admin',
}
const isSchoolAdmin = (user) => ROLE_LABEL[user.role] === 'School admin'
const isSuspended = (user) => user.isSuspended || user.status === 'Suspended'
const isActive = (user) => user.isActive && !isSuspended(user)
const isDeactivated = (user) => !user.isActive && !isSuspended(user)
const pad = (n) => String(n).padStart(2, '0')

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

// Real department names from GET /departments; registration counts have no endpoint yet (shown as —).
const useDepartments = () => {
  const [rows, setRows] = useState(DEPARTMENTS)
  useEffect(() => {
    adminApi.departments()
      .then((d) => { if (Array.isArray(d) && d.length) setRows(d.map((x) => ({ name: x.name, registered: '—', total: '—', rate: '—' }))) })
      .catch(() => {})
  }, [])
  return rows
}

const CHIPS = [
  { label: 'Total:', value: '24', dot: null },
  { label: 'Active', value: '21', dot: '#109E75' },
  { label: 'Deactivated', value: '03', dot: '#D85A30' },
  { label: 'Suspended', value: '03', dot: '#EAB308' },
]

export default function UsersPage({ onNavigate }) {
  const deptRows = useDepartments()
  const [menu, setMenu] = useState(null)
  const [modal, setModal] = useState(null)
  const [navOpen, setNavOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All user types')
  const [institutionFilter, setInstitutionFilter] = useState('All Institutions')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const load = () => adminApi.users({ pageSize: 200 }).then((d) => setUsers(d?.items || [])).catch(() => setUsers([]))
  useEffect(() => { load() }, [])

  const count = (f) => users.filter(f).length
  const stats = [
    { title: 'Students', value: pad(count((u) => u.role === 'Student')), sub: `Across ${new Set(users.filter((u) => u.role === 'Student').map((u) => u.institutionName)).size} institutions` },
    { title: 'Staff', value: pad(count((u) => u.role === 'Staff')), sub: 'Can sign in and publish' },
    { title: 'School administrators', value: pad(count(isSchoolAdmin)), sub: `${pad(count((u) => isSchoolAdmin(u) && u.isActive))} active` },
    { title: 'Platform administrators', value: pad(count((u) => u.role === 'SuperAdmin')), sub: 'Campus Update team' },
  ]
  const chips = [
    { label: 'Total:', value: pad(users.length), dot: null },
    { label: 'Active', value: pad(count(isActive)), dot: '#109E75' },
    { label: 'Deactivated', value: pad(count(isDeactivated)), dot: '#D85A30' },
    { label: 'Suspended', value: pad(count(isSuspended)), dot: '#EAB308' },
  ]
  const institutionOptions = ['All Institutions', ...new Set(users.map((u) => u.institutionName).filter(Boolean))]
  const visibleUsers = users.filter((u) => {
    const roleLabel = ROLE_LABEL[u.role] || u.role
    const typeMatches = typeFilter === 'All user types'
      || (typeFilter === 'Students' && u.role === 'Student')
      || (typeFilter === 'Staff' && u.role === 'Staff')
      || (typeFilter === 'School admins' && roleLabel === 'School admin')
      || (typeFilter === 'Platform admins' && roleLabel === 'Platform admin')
    const statusMatches = statusFilter === 'All Statuses'
      || (statusFilter === 'Active' && isActive(u))
      || (statusFilter === 'Deactivated' && isDeactivated(u))
      || (statusFilter === 'Suspended' && isSuspended(u))
    const haystack = `${u.firstName || ''} ${u.lastName || ''} ${u.email || ''} ${u.institutionName || ''} ${roleLabel}`.toLowerCase()
    return typeMatches
      && statusMatches
      && (institutionFilter === 'All Institutions' || u.institutionName === institutionFilter)
      && (!search.trim() || haystack.includes(search.trim().toLowerCase()))
  })
  const clearFilters = () => {
    setSearch('')
    setTypeFilter('All user types')
    setInstitutionFilter('All Institutions')
    setStatusFilter('All Statuses')
  }

  return (
    <div className="min-h-screen w-full bg-[#E9E9EA] p-3 md:p-[27px]">
      <div className="flex gap-4 md:gap-6">
        <Sidebar active="users" publishingAs="Campus Update" onNavigate={onNavigate} open={navOpen} onClose={() => setNavOpen(false)} />

        <main className="flex min-w-0 flex-1 flex-col gap-4 md:gap-6">
          <Topbar title="Users" subtitle="Search accounts and manage status" onMenu={() => setNavOpen(true)} />

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
            {stats.map((s) => (
              <StatCard key={s.title} {...s} />
            ))}
          </div>

          {/* Table card */}
          <div className="flex flex-col overflow-hidden rounded-[10px] border border-[#DBDBDB] bg-white">
            {/* Filter bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
                <FilterSelect value={typeFilter} onChange={setTypeFilter} options={['All user types', 'Students', 'Staff', 'School admins', 'Platform admins']} />
                <FilterSelect value={institutionFilter} onChange={setInstitutionFilter} options={institutionOptions} />
                <FilterSelect value={statusFilter} onChange={setStatusFilter} options={['All Statuses', 'Active', 'Suspended', 'Deactivated']} />
              </div>
              <button type="button" onClick={clearFilters} className="text-sm font-medium leading-[15.2px] text-[#4F46E5]">
                Clear filters
              </button>
            </div>

            {/* Status chips */}
            <div className="flex flex-wrap gap-3 px-4 pt-6">
              {chips.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setStatusFilter(c.label === 'Total:' ? 'All Statuses' : c.label)}
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
                  {visibleUsers.map((r, i) => (
                    <tr key={r.id || i} className="h-[58px] bg-white">
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <div className="flex items-center gap-4">
                          <AvatarChip name={`${(r.firstName || '?')[0]}${(r.lastName || '')[0] || ''}`.toUpperCase()} />
                          <div className="flex flex-col gap-1">
                            <span className="text-[15px] font-semibold leading-4 text-[#344054]">{`${r.firstName || ''} ${r.lastName || ''}`.trim() || r.email}</span>
                            <span className="text-[13px] leading-[14px] text-[#6B7280]">{r.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">{ROLE_LABEL[r.role] || r.role}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">{r.institutionName || '—'}</td>
                      <td className="px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">—</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">—</td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <StatusBadge label={isSuspended(r) ? 'Suspended' : r.isActive ? 'Active' : 'Deactivated'} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">{r.lastActiveAt ? timeAgo(r.lastActiveAt) : 'Not signed in yet'}</td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <DotsMenu
                          open={menu === i}
                          onToggle={() => setMenu(menu === i ? null : i)}
                          items={[
                            { label: 'View Details', icon: <ViewSmIcon />, onClick: () => setMenu(null) },
                            { label: 'Assign Institution', icon: <AssignIcon />, onClick: () => { setMenu(null); setModal('assign') } },
                            { label: 'Suspend account', icon: <OctagonPauseIcon />, onClick: () => { setMenu(null); setModal('suspend') } },
                            r.isActive
                              ? { label: 'Deactivate account', icon: <PowerOffIcon />, onClick: () => { setMenu(null); usersApi.patch(r.id, { isActive: false }).then(load) } }
                              : { label: 'Activate account', icon: <PowerOffIcon />, onClick: () => { setMenu(null); usersApi.patch(r.id, { isActive: true }).then(load) } },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                  {visibleUsers.length === 0 && (
                    <tr className="border-t border-[#EDEDF0]">
                      <td colSpan={8} className="px-4 py-10 text-center text-sm leading-5 text-[#6B7280]">No users match these filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <PageCountFooter left={`Showing ${visibleUsers.length ? `1-${visibleUsers.length}` : 0} of ${visibleUsers.length} results`} />
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
                {deptRows.map((d, i) => (
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
