import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { PageCountFooter, TH } from './ui.jsx'
import { StatusPill, SCHOOLS } from './SchoolsPage.jsx'
import { EditSmIcon, PowerOffIcon, TrashIcon } from './Icons.jsx'

const read = (k, d) => {
  try { return JSON.parse(window.sessionStorage.getItem(k)) ?? d } catch { return d }
}

const STATS = [
  { title: 'Students', value: '00', sub: 'On the platform' },
  { title: 'Staff', value: '00', sub: 'On the platform' },
  { title: 'Administrators', value: '01', sub: 'Serving content to students' },
  { title: 'Weekly active', value: '00', sub: '0% of registered' },
  { title: 'Content items', value: '03', sub: 'Content hidden' },
]

const INFO = (s) => [
  ['Name', s.name],
  ['Short name', s.initials],
  ['Type', s.type || 'Private University'],
  ['Location', s.location || 'All Departments'],
  ['Contact', s.contactPerson || 'Dr. B. Akinola'],
  ['Email', s.contactEmail || 'akinola@ui.example'],
  ['Phone', s.phoneNumber || '0805 xxx 2210'],
  ['Rollout scope', s.rolloutScope || '—'],
  ['Notes', s.notes || 'Agreement signed'],
  ['On platform since', '20 Sep 2026'],
]

const AUDIT = [
  ['20 Sep 2026, 17:20', 'Added administrator', 'Dr. B. Akinola · Institution administrator · Covenant University'],
  ['20 Sep 2026, 17:00', 'Added school', 'Covenant University · Onboarding'],
]

export default function SchoolDetailPage({ schoolId, onNavigate }) {
  const [navOpen, setNavOpen] = useState(false)
  const saved = read(`campus-update-school-${schoolId}`, null)
  const school = saved || SCHOOLS.find((s) => s.id === Number(schoolId)) || { name: 'Covenant University', initials: 'CU', status: 'Onboarding' }

  const btn = 'flex h-11 items-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-5 text-sm font-semibold leading-5 text-[#374151] hover:bg-[#F9FAFB]'

  return (
    <div className="min-h-screen w-full bg-[#E9E9EA] p-3 md:p-[27px]">
      <div className="flex gap-4 md:gap-6">
        <Sidebar active="schools" publishingAs="Campus Update" onNavigate={onNavigate} open={navOpen} onClose={() => setNavOpen(false)} />

        <main className="flex min-w-0 flex-1 flex-col gap-4 md:gap-6">
          <Topbar title="Schools" subtitle="Add, edit and activate institutions" onMenu={() => setNavOpen(true)} />

          <nav className="flex items-center gap-2 text-sm leading-[15px] text-[#6B7280]">
            <button type="button" onClick={() => { window.location.hash = '/schools' }} className="hover:text-black">School</button>
            <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="m6 4 4 4-4 4" /></svg>
            <span className="font-medium text-[#4F46E5]">{school.name}</span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-[#DBDBDB] bg-white px-6 py-5">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold leading-[26px] text-[#111827]">{school.name}</h2>
              <StatusPill label={school.status || 'Onboarding'} />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className={btn}><EditSmIcon className="h-4 w-4" stroke="#374151" /> Edit User</button>
              <button type="button" className={btn}><PowerOffIcon className="h-4 w-4" stroke="#374151" /> Deactivate</button>
              <button type="button" className="flex h-11 items-center gap-2 rounded-[10px] bg-[#FEE4E2] px-5 text-sm font-semibold leading-5 text-[#D92D20] hover:bg-[#FED2D0]">
                <TrashIcon className="h-4 w-4" stroke="#D92D20" /> Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-5">
            {STATS.map((s) => (
              <div key={s.title} className="flex flex-col gap-5 rounded-2xl border border-[#DBDBDB] bg-white px-6 py-6 md:px-7 md:py-7">
                <p className="text-lg font-medium leading-[19.6px] text-black">{s.title}</p>
                <div className="flex flex-col gap-3">
                  <p className="text-4xl font-medium leading-[41.6px] text-black">{s.value}</p>
                  <p className="text-base leading-[17.4px] text-[#666666]">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:gap-6 xl:grid-cols-[7fr_5fr]">
            <section className="flex flex-col gap-4 rounded-[10px] border border-[#DBDBDB] bg-white p-6">
              <h3 className="flex items-center gap-2 text-base font-semibold leading-[17px] text-[#100070]">
                <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="#4F46E5" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="5" r="2" /><path d="M2 12c.6-2.4 1.9-3.6 3.5-3.6S8.4 9.6 9 12M10.5 4.5a2 2 0 0 1 0 4M12 8.6c1 .5 1.7 1.6 2 3.4" /></svg>
                Institution Information
              </h3>
              <div className="flex flex-col">
                {INFO(school).map(([k, v]) => (
                  <div key={k} className="flex min-h-[38px] items-center justify-between gap-6 border-t border-[#F3F4F6] py-2 first:border-t-0">
                    <span className="text-sm leading-[15px] text-[#6B7280]">{k}</span>
                    <span className="text-right text-sm font-medium leading-[15px] text-[#111827]">{v}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4 rounded-[10px] border border-[#DBDBDB] bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-base font-semibold leading-[17px] text-[#100070]">
                  <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="#4F46E5" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="5" r="2" /><path d="M2 12c.6-2.4 1.9-3.6 3.5-3.6S8.4 9.6 9 12M10.5 4.5a2 2 0 0 1 0 4M12 8.6c1 .5 1.7 1.6 2 3.4" /></svg>
                  Administrators
                </h3>
                <button type="button" className="text-sm font-semibold leading-[15px] text-[#4F46E5]" onClick={() => onNavigate?.('admins')}>Manage</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] table-fixed border-collapse">
                  <thead>
                    <tr className="h-10">
                      <TH sort className="w-[40%]">NAME</TH>
                      <TH sort className="w-[40%]">ROLES</TH>
                      <TH sort className="w-[20%]">STATUS</TH>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="h-[58px] bg-white">
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[18px] bg-[#E5E0FF] text-sm font-semibold text-[#100070]">LU</span>
                          <div className="flex flex-col gap-1">
                            <span className="text-[15px] font-semibold leading-4 text-[#344054]">Dr. B. Akinola</span>
                            <span className="text-[13px] leading-[14px] text-[#6B7280]">b.akinola@ui.example</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5"><StatusPill label="Institution administrator" /></td>
                      <td className="px-4 py-2.5"><StatusPill label="Active" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <PageCountFooter />
            </section>
          </div>

          <section className="flex flex-col gap-4 rounded-[10px] border border-[#DBDBDB] bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold leading-[20px] text-[#111827]">Content</h3>
              <button type="button" className="text-sm font-semibold leading-[15px] text-[#4F46E5]" onClick={() => onNavigate?.('content')}>Monitor all</button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
              <table className="w-full min-w-[640px] table-fixed border-collapse">
                <thead>
                  <tr className="h-10">
                    <TH sort className="w-[40%]">CONTENT</TH>
                    <TH sort className="w-[15%]">TYPE</TH>
                    <TH sort className="w-[15%]">STATUS</TH>
                    <TH sort className="w-[20%]">PUBLISHED</TH>
                    <TH className="w-[10%]">ACTION</TH>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-base text-[#344054]">Nothing published yet.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-[10px] border border-[#DBDBDB] bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold leading-[17px] text-[#100070]">Audit history for this school</h3>
              <button type="button" className="text-sm font-semibold leading-[15px] text-[#4F46E5]">Full log</button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-[#E5E7EB]">
              <table className="w-full min-w-[640px] table-fixed border-collapse">
                <thead>
                  <tr className="h-10">
                    <TH className="w-[25%]">DATE & TIME</TH>
                    <TH className="w-[25%]">ACTION</TH>
                    <TH className="w-[50%]">DETAILS</TH>
                  </tr>
                </thead>
                <tbody>
                  {AUDIT.map((r, i) => (
                    <tr key={i} className={`h-[50px] ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                      <td className="px-4 py-2.5 text-[13px] leading-[14px] text-[#6B7280]">{r[0]}</td>
                      <td className="px-4 py-2.5 text-[13px] font-semibold leading-[14px] text-[#344054]">{r[1]}</td>
                      <td className="px-4 py-2.5 text-[13px] leading-[14px] text-[#6B7280]">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
