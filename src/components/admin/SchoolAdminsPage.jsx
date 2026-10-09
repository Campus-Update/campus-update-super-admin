import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { StatCard, StatusBadge, AvatarChip, PageCountFooter, TH, FilterSelect, SearchInput, DotsMenu } from './ui.jsx'
import { AdminFormModal, SuccessModal, DeactivateModal } from './modals.jsx'
import { PlusIcon, ViewSmIcon, EditSmIcon, PowerOffIcon } from './Icons.jsx'

const STATS = [
  { title: 'School administrators', value: '07', sub: '+118 this week' },
  { title: 'Active', value: '06', sub: 'Can sign in and publish' },
  { title: 'Deactivated', value: '01', sub: 'Cannot sign in' },
  { title: 'Schools without an admin', value: '03', sub: 'Live or onboarding' },
]

const ROWS = [
  { code: 'LU', name: 'Dr. O. Eboreime', email: 'o.eboreime@leadcity.example', role: 'Faculty administrator', inst: 'LCU', scope: 'FOCIT · news, events, announcements', last: '59 min ago' },
  { code: 'UI', name: 'M. Athar', email: 'm.athar@leadcity.example', role: 'Department administrator', inst: 'LCU', scope: 'Computer Science · announcements only', last: '1 hour ago' },
  { code: 'UL', name: "Registrar's Office", email: 'registrar@leadcity.example', role: 'Institution administrator', inst: 'UI', scope: 'Full publishing rights, institution-wide', last: '2 hours ago' },
  { code: 'OU', name: 'Examinations Office', email: 'exams@leadcity.example', role: 'Department administrator', inst: 'UI', scope: 'FOCIT · announcements and calendar', last: '1 hour ago' },
  { code: 'OU', name: 'Dr. B. Akinola', email: 'b.akinola@ui.example', role: 'Institution administrator', inst: 'OAU', scope: 'Full publishing rights, institution-wide', last: 'Not signed in yet' },
  { code: 'OU', name: 'Prof. K. Adeyemi', email: 'k.adeyemi@oau.example', role: 'Institution administrator', inst: 'OAU', scope: 'Full publishing rights, institution-wide', last: '12 days ago' },
  { code: 'OU', name: 'T. Ojo', email: 't.ojo@oau.example', role: 'Institution administrator', inst: 'OAU', scope: 'Technology · news and announcements', last: '8 hours ago' },
  { code: 'OU', name: 'T. Ojo', email: 't.ojo@oau.example', role: 'Faculty administrator', inst: 'OAU', scope: 'Technology · news and announcements', last: '8 hours ago' },
  { code: 'OU', name: 'T. Ojo', email: 't.ojo@oau.example', role: 'Institution administrator', inst: 'OAU', scope: 'Full publishing rights, institution-wide', last: '8 hours ago' },
  { code: 'OU', name: 'T. Ojo', email: 't.ojo@oau.example', role: 'Institution administrator', inst: 'OAU', scope: 'Full publishing rights, institution-wide', last: '8 hours ago' },
]

export default function SchoolAdminsPage({ onNavigate }) {
  const [menu, setMenu] = useState(null)
  const [modal, setModal] = useState(null)

  return (
    <div className="min-h-screen w-full bg-[#E9E9EA] p-[27px]">
      <div className="flex gap-6">
        <Sidebar active="admins" publishingAs="Campus Update" onNavigate={onNavigate} />

        <main className="flex flex-1 flex-col gap-6">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <Topbar title="School administrators" subtitle="Who can publish, and where" />
            </div>
            <button
              type="button"
              onClick={() => setModal('add')}
              className="flex h-[66px] shrink-0 items-center gap-3 rounded-[10px] bg-[#4F46E5] px-7 text-base font-semibold leading-[22px] text-white hover:bg-[#4338CA]"
            >
              <PlusIcon className="h-5 w-5" stroke="#fff" />
              Add New Administrator
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            {STATS.map((s) => (
              <StatCard key={s.title} {...s} />
            ))}
          </div>

          {/* Table card */}
          <div className="flex flex-col overflow-hidden rounded-[10px] border border-[#DBDBDB] bg-white">
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] px-4 py-2">
              <span className="px-2 text-sm font-semibold leading-[15.2px] text-[#344054]">All Administrators</span>
            </div>

            {/* Filter bar */}
            <div className="flex items-center justify-between gap-4 px-4 pt-6">
              <div className="flex w-full max-w-[640px] items-center gap-4">
                <SearchInput placeholder="Search by name, email or institution" />
                <FilterSelect value="All roles" options={['All roles', 'Institution administrator', 'Faculty administrator', 'Department administrator']} />
              </div>
              <div className="flex items-center gap-4">
                <FilterSelect value="All Institutions" options={['All Institutions', 'Lead City University', 'University of Ibadan', 'Obafemi Awolowo University']} />
                <FilterSelect value="All Statuses" options={['All Statuses', 'Active', 'Deactivated']} />
                <button type="button" className="text-sm font-medium leading-[15.2px] text-[#4F46E5]">
                  Clear filters
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="px-4 pt-6">
              <table className="w-full table-fixed border-collapse">
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
                      <td className="px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">{r.role}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">{r.inst}</td>
                      <td className="px-4 py-2.5 text-[13px] leading-[14px] text-[#344054]">{r.scope}</td>
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
                            { label: 'Edit School', icon: <EditSmIcon />, onClick: () => { setMenu(null); setModal('edit') } },
                            { label: 'Activate', icon: <PowerOffIcon />, onClick: () => setMenu(null) },
                            { label: 'Deactivate', icon: <PowerOffIcon />, onClick: () => { setMenu(null); setModal('deactivate') } },
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
        </main>
      </div>

      {modal === 'add' && <AdminFormModal mode="add" onClose={() => setModal(null)} onSubmit={() => setModal('success')} />}
      {modal === 'success' && <SuccessModal onClose={() => setModal(null)} />}
      {modal === 'edit' && <AdminFormModal mode="edit" onClose={() => setModal(null)} />}
      {modal === 'deactivate' && <DeactivateModal kind="admin" onClose={() => setModal(null)} />}
    </div>
  )
}
