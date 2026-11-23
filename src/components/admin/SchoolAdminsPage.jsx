import { useEffect, useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { StatCard, StatusBadge, AvatarChip, PageCountFooter, TH, FilterSelect, SearchInput, DotsMenu } from './ui.jsx'
import { AdminFormModal, SuccessModal, DeactivateModal } from './modals.jsx'
import { usersApi, adminApi, adminsApi } from '../../lib/api.js'
import { timeAgo } from '../../lib/format.jsx'
import { PlusIcon, ViewSmIcon, EditSmIcon, PowerOffIcon } from './Icons.jsx'

const ROLE_LABEL = { LeadSchoolAdmin: 'Institution administrator', NewsAdmin: 'News administrator', CalendarAdmin: 'Calendar administrator', SchoolAdmin: 'Institution administrator', InstitutionAdmin: 'Institution administrator', SuperAdmin: 'Platform administrator' }
const pad = (n) => String(n).padStart(2, '0')

export default function SchoolAdminsPage({ onNavigate }) {
  const [leadOpen, setLeadOpen] = useState(false)
  const [lf, setLf] = useState({ email: '', password: '', firstName: '', lastName: '', institutionId: '' })
  const [leadErr, setLeadErr] = useState('')
  const [leadBusy, setLeadBusy] = useState(false)
  const [leadMsg, setLeadMsg] = useState('')
  const [schoolsList, setSchoolsList] = useState([])
  const createLead = async (e) => {
    e.preventDefault(); setLeadBusy(true); setLeadErr('');
    try { await adminsApi.createLead(lf); setLeadMsg('Lead administrator created.'); setLeadOpen(false); setLf({ email: '', password: '', firstName: '', lastName: '', institutionId: '' }); load(); }
    catch (e2) { setLeadErr(e2.message); } finally { setLeadBusy(false); }
  };
  const [menu, setMenu] = useState(null)
  const [modal, setModal] = useState(null)
  const [navOpen, setNavOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')
  const [admins, setAdmins] = useState([])
  const [roleFilter, setRoleFilter] = useState('All roles')
  const [noAdminSchools, setNoAdminSchools] = useState(0)
  const load = () => {
    adminApi.users({ pageSize: 200 }).then((d) => setAdmins((d?.items || []).filter((u) => !['Student', 'Staff', 'SuperAdmin'].includes(u.role)))).catch(() => setAdmins([]))
    adminApi.schools({ pageSize: 100 }).then((d) => { const items = d?.items || []; setNoAdminSchools(items.filter((s) => (s.adminCount ?? 0) === 0).length); setSchoolsList(items); }).catch(() => {})
  }
  useEffect(() => { load() }, [])

  const active = admins.filter((a) => a.isActive).length
  const visible = roleFilter === 'All roles' ? admins : admins.filter((r) => (ROLE_LABEL[r.role] || r.role) === roleFilter)
  const stats = [
    { title: 'School administrators', value: pad(admins.length), sub: 'On the platform' },
    { title: 'Active', value: pad(active), sub: 'Can sign in and publish' },
    { title: 'Deactivated', value: pad(admins.length - active), sub: 'Cannot sign in' },
    { title: 'Schools without an admin', value: pad(noAdminSchools), sub: 'Live or onboarding' },
  ]

  const addAdmin = async (f) => {
    setBusy(true)
    setFormError('')
    try {
      await usersApi.createAdmin({ email: f.email, password: f.password, firstName: f.firstName, lastName: f.lastName, institutionId: f.institutionId })
      load()
      setModal('success')
    } catch (e) {
      setFormError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#E9E9EA] p-3 md:p-[27px]">
      <div className="flex gap-4 md:gap-6">
        <Sidebar active="admins" publishingAs="Campus Update" onNavigate={onNavigate} open={navOpen} onClose={() => setNavOpen(false)} />

        <main className="flex min-w-0 flex-1 flex-col gap-4 md:gap-6">
          <div className="flex flex-col gap-4">
            <Topbar title="School administrators" subtitle="Who can publish, and where" onMenu={() => setNavOpen(true)} />
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setModal('add')}
                className="flex h-[54px] w-full shrink-0 items-center justify-center gap-3 rounded-[10px] bg-[#4F46E5] px-7 text-base font-semibold leading-[22px] text-white hover:bg-[#4338CA] md:h-[66px] md:w-auto"
              >
                <PlusIcon className="h-5 w-5" stroke="#fff" />
                Add New Administrator
              </button>
              <button
                type="button"
                onClick={() => setLeadOpen(true)}
                className="flex h-[54px] w-full shrink-0 items-center justify-center gap-3 rounded-[10px] border border-[#4F46E5] bg-white px-7 text-base font-semibold leading-[22px] text-[#4F46E5] hover:bg-[#EEEDFD] md:h-[66px] md:w-auto"
              >
                Add Lead Admin
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
            {stats.map((s) => (
              <StatCard key={s.title} {...s} />
            ))}
          </div>

          {/* Table card */}
          <div className="flex flex-col overflow-hidden rounded-[10px] border border-[#DBDBDB] bg-white">
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] px-4 py-2">
              <span className="px-2 text-sm font-semibold leading-[15.2px] text-[#344054]">All Administrators</span>
            </div>

            {/* Filter bar */}
            <div className="flex flex-col gap-4 px-4 pt-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex w-full max-w-[640px] flex-wrap items-center gap-4">
                <SearchInput placeholder="Search by name, email or institution" />
                <FilterSelect value={roleFilter} onChange={setRoleFilter} options={['All roles', 'Institution administrator', 'Faculty administrator', 'Department administrator']} />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <FilterSelect value="All Institutions" options={['All Institutions', 'Lead City University', 'University of Ibadan', 'Obafemi Awolowo University']} />
                <FilterSelect value="All Statuses" options={['All Statuses', 'Active', 'Deactivated']} />
                <button type="button" className="text-sm font-medium leading-[15.2px] text-[#4F46E5]">
                  Clear filters
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto px-4 pt-6">
              <table className="w-full min-w-[1000px] table-fixed border-collapse">
                <thead>
                  <tr className="h-10">
                    <TH sort className="w-[24%]">ADMINISTRATOR</TH>
                    <TH className="w-[16%]">ROLE</TH>
                    <TH sort className="w-[10%]">INSTITUTIONS</TH>
                    <TH sort className="w-[24%]">SCOPE</TH>
                    <TH sort className="w-[8%]">STATUS</TH>
                    <TH sort className="w-[11%]">LAST ACTIVE</TH>
                    <TH sort className="w-[7%]">ACTION</TH>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((r, i) => (
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
                      <td className="px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">{ROLE_LABEL[r.role] || r.role}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">{r.institutionName || '—'}</td>
                      <td className="px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">Full publishing rights, institution-wide</td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <StatusBadge label={r.isActive ? 'Active' : 'Deactivated'} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">{r.lastActiveAt ? timeAgo(r.lastActiveAt) : 'Not signed in yet'}</td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <DotsMenu
                          open={menu === i}
                          onToggle={() => setMenu(menu === i ? null : i)}
                          items={[
                            { label: 'View Details', icon: <ViewSmIcon />, onClick: () => setMenu(null) },
                            { label: 'Edit School', icon: <EditSmIcon />, onClick: () => { setMenu(null); setModal('edit') } },
                            { label: 'Activate', icon: <PowerOffIcon />, onClick: () => { setMenu(null); usersApi.patch(r.id, { isActive: true }).then(load) } },
                            { label: 'Deactivate', icon: <PowerOffIcon />, onClick: () => { setMenu(null); usersApi.patch(r.id, { isActive: false }).then(load) } },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                  {visible.length === 0 && (
                    <tr className="border-t border-[#EDEDF0]">
                      <td colSpan={7} className="px-4 py-10 text-center text-sm leading-5 text-[#6B7280]">No school administrators yet. Use Add administrator to create one.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <PageCountFooter />
          </div>
        </main>
      {leadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={createLead} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="text-sm font-semibold">Provision a lead administrator</h2>
            <p className="mb-3 text-xs text-[#6B7280]">Contract §11: leads manage their institution’s news, calendars and delegated admins.</p>
            <div className="grid gap-2">
              <input className="h-10 rounded-lg border border-[#D1D5DC] px-3 text-sm" placeholder="First name" required value={lf.firstName} onChange={(e) => setLf({ ...lf, firstName: e.target.value })} />
              <input className="h-10 rounded-lg border border-[#D1D5DC] px-3 text-sm" placeholder="Last name" required value={lf.lastName} onChange={(e) => setLf({ ...lf, lastName: e.target.value })} />
              <input className="h-10 rounded-lg border border-[#D1D5DC] px-3 text-sm" type="email" placeholder="Email" required value={lf.email} onChange={(e) => setLf({ ...lf, email: e.target.value })} />
              <input className="h-10 rounded-lg border border-[#D1D5DC] px-3 text-sm" type="password" placeholder="Password (12+ chars)" required minLength={12} value={lf.password} onChange={(e) => setLf({ ...lf, password: e.target.value })} />
              <select className="h-10 rounded-lg border border-[#D1D5DC] px-3 text-sm" required value={lf.institutionId} onChange={(e) => setLf({ ...lf, institutionId: e.target.value })}>
                <option value="">Institution…</option>
                {schoolsList.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
              </select>
              {leadErr && <p className="text-xs text-red-600">{leadErr}</p>}
              <div className="flex justify-end gap-2">
                <button type="button" className="h-9 rounded-lg border border-[#D1D5DC] px-3 text-sm" onClick={() => setLeadOpen(false)}>Cancel</button>
                <button type="submit" className="h-9 rounded-lg bg-[#4F46E5] px-3 text-sm font-semibold text-white" disabled={leadBusy}>{leadBusy ? 'Creating…' : 'Create lead'}</button>
              </div>
            </div>
          </form>
        </div>
      )}
      </div>

      {modal === 'add' && <AdminFormModal mode="add" onClose={() => setModal(null)} onSubmit={addAdmin} error={formError} busy={busy} />}
      {modal === 'success' && <SuccessModal onClose={() => setModal(null)} />}
      {modal === 'edit' && <AdminFormModal mode="edit" onClose={() => setModal(null)} />}
      {modal === 'deactivate' && <DeactivateModal kind="admin" onClose={() => setModal(null)} />}
    </div>
  )
}

