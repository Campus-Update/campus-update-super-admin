import { useEffect, useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { TH, FilterSelect, PageCountFooter, StatusBadge } from './ui.jsx'
import { adminApi, schoolsApi, contentApi } from '../../lib/api.js'

function Bar({ label, value, max }) {
  const pct = max ? Math.max(6, Math.round((value / max) * 100)) : 6
  return (
    <div className="flex items-center gap-4">
      <span className="w-[110px] shrink-0 text-[13px] leading-4 text-[#6B7280]">{label}</span>
      <span className="relative h-3 flex-1 overflow-hidden rounded-full bg-[#F1F1F4]">
        <span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#A5A0F7] to-[#4F46E5]" style={{ width: `${pct}%` }} />
      </span>
      <span className="w-8 shrink-0 text-right text-[13px] font-medium leading-4 text-[#344054]">{String(value).padStart(2, '0')}</span>
    </div>
  )
}

export default function AnalyticsPage({ onNavigate }) {
  const [navOpen, setNavOpen] = useState(false)
  const [t, setT] = useState({})
  const [instCount, setInstCount] = useState(0)
  const [byType, setByType] = useState({ News: 0, Announcement: 0, Event: 0, Advertisement: 0 })
  const [byUrgency, setByUrgency] = useState({ Urgent: 0, Important: 0, Normal: 0 })
  const [instRows, setInstRows] = useState([])
  const [weeks, setWeeks] = useState([3, 4, 4, 5, 5, 6, 6, 7])

  useEffect(() => {
    adminApi.analytics().then((d) => {
      setT(d?.totals || {})
      const counters = d?.usageCounters || []
      const per = {}
      counters.forEach((c) => {
        per[c.institutionId] = per[c.institutionId] || { sessions: 0, registrations: 0, fetches: 0 }
        per[c.institutionId].sessions += c.sessions || 0
        per[c.institutionId].registrations += c.registrations || 0
        per[c.institutionId].fetches += c.feedFetches || 0
      })
      const days = [...new Set(counters.map((c) => c.day))].sort().slice(-8)
      if (days.length) setWeeks(days.map((day) => counters.filter((c) => c.day === day).reduce((s, c) => s + (c.registrations || 0), 0) || 1))
      adminApi.schools({ pageSize: 100 }).then((d) => {
        const items = d?.items || []
        setInstCount(d?.totalCount ?? items.length)
        setInstRows(
          items.map((s) => {
            const u = per[s.id] || { sessions: 0, registrations: 0, fetches: 0 }
            return {
              name: s.name,
              status: s.isActive ? 'Live' : 'Paused',
              students: s.studentCount ?? u.registrations,
              staff: s.staffCount ?? 0,
              weekly: s.weeklyActiveCount ?? u.sessions,
              live: s.liveContentCount ?? 0,
              views: s.viewCount ?? 0,
            }
          }),
        )
      }).catch(() => {})
    }).catch(() => {})
    contentApi.list({ pageSize: 100 }).then((rows) => {
      const list = Array.isArray(rows) ? rows : []
      const ty = { News: 0, Announcement: 0, Event: 0, Advertisement: 0 }
      const ur = { Urgent: 0, Important: 0, Normal: 0 }
      list.forEach((r) => {
        if (ty[r.type] !== undefined) ty[r.type] += 1
        if (ur[r.urgency] !== undefined) ur[r.urgency] += 1
      })
      setByType(ty)
      setByUrgency(ur)
    }).catch(() => {})
  }, [])

  const maxType = Math.max(1, ...Object.values(byType))
  const maxUrg = Math.max(1, ...Object.values(byUrgency))
  const maxWeek = Math.max(1, ...weeks)
  const delivery = t.notifications ? Math.round(((t.notifications - (t.pushFailures || 0)) / t.notifications) * 1000) / 10 : 0

  const CARDS = [
    { title: 'Total students', value: '5,319', sub: '+20% · vs Last month', color: '#109E75' },
    { title: 'Total staff', value: '08', sub: '-10% · vs Last month', color: '#D92D20' },
    { title: 'Total users', value: String(t.totalRegisteredUsers ?? 0).replace(/\B(?=(\d{3})+(?!\d))/g, ','), sub: '-10% · vs Last month', color: '#D92D20' },
    { title: 'Active users', value: String(t.activeUsers ?? 0), sub: '+70% · Active this week', color: '#109E75' },
    { title: 'Institutions', value: String(instCount), sub: 'vs Last month', color: '#109E75' },
    { title: 'Content published', value: String(t.publishedContent ?? 0), sub: `${(t.uniqueContentViews ?? 0).toLocaleString()} views in total`, color: '#109E75' },
  ]

  return (
    <div className="min-h-screen w-full bg-[#E9E9EA] p-3 md:p-[27px]">
      <div className="flex gap-4 md:gap-6">
        <Sidebar active="analytics" publishingAs="Campus Update" onNavigate={onNavigate} open={navOpen} onClose={() => setNavOpen(false)} />

        <main className="flex min-w-0 flex-1 flex-col gap-4 md:gap-6">
          <Topbar title="Analytics" subtitle="Adoption and engagement" onMenu={() => setNavOpen(true)} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-6">
            {CARDS.map((c) => (
              <div key={c.title} className="flex flex-col gap-5 rounded-2xl border border-[#DBDBDB] bg-white px-6 py-6">
                <p className="text-base leading-[17px] text-[#3F3F46]">{c.title}</p>
                <p className="text-[28px] font-medium leading-9 text-black">{c.value}</p>
                <p className="text-[13px] leading-4" style={{ color: c.color }}>{c.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
            <section className="flex flex-col gap-6 rounded-[10px] border border-[#DBDBDB] bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="flex items-center gap-2 text-base font-semibold leading-[18px] text-[#111827]">
                  <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="#4F46E5" strokeWidth="1.4" fill="none" strokeLinecap="round"><path d="M2 8h2m8 0h2M5 5v6m6-6v6" /></svg>
                  Live content by type
                </h3>
                <FilterSelect value="This month" options={['This month', 'Last month']} />
              </div>
              <div className="flex flex-col gap-5">
                <Bar label="News" value={byType.News} max={maxType} />
                <Bar label="Announcements" value={byType.Announcement} max={maxType} />
                <Bar label="Events" value={byType.Event} max={maxType} />
                <Bar label="Advertisements" value={byType.Advertisement} max={maxType} />
              </div>
            </section>

            <section className="flex flex-col gap-6 rounded-[10px] border border-[#DBDBDB] bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="flex items-center gap-2 text-base font-semibold leading-[18px] text-[#111827]">
                  <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="#4F46E5" strokeWidth="1.4" fill="none" strokeLinejoin="round"><path d="M3 3h10l-3.5 4v4l-3 1V7L3 3Z" /></svg>
                  Announcements by urgency
                </h3>
                <span className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-[13px] leading-4 text-[#6B7280]">{t.notifications ?? 0} sent as push</span>
              </div>
              <div className="flex flex-col gap-5">
                <Bar label="Urgent" value={byUrgency.Urgent} max={maxUrg} />
                <Bar label="Important" value={byUrgency.Important} max={maxUrg} />
                <Bar label="Normal" value={byUrgency.Normal} max={maxUrg} />
              </div>
            </section>
          </div>

          <section className="flex flex-col overflow-hidden rounded-[10px] border border-[#DBDBDB] bg-white">
            <div className="flex items-center justify-between px-4 pt-6">
              <h3 className="text-base font-semibold leading-[18px] text-[#111827]">By institution</h3>
              <button type="button" className="text-[13px] font-medium leading-4 text-[#4F46E5]">View all</button>
            </div>
            <div className="overflow-x-auto px-4 pt-4">
              <table className="w-full min-w-[900px] table-fixed border-collapse">
                <thead>
                  <tr className="h-10">
                    <TH sort className="w-[26%]">INSTITUTION</TH>
                    <TH sort className="w-[12%]">STATUS</TH>
                    <TH sort className="w-[12%]">STUDENTS</TH>
                    <TH sort className="w-[12%]">STAFF</TH>
                    <TH sort className="w-[14%]">WEEKLY ACTIVE</TH>
                    <TH sort className="w-[12%]">LIVE CONTENT</TH>
                    <TH sort className="w-[12%]">VIEWS</TH>
                  </tr>
                </thead>
                <tbody>
                  {instRows.map((r, i) => (
                    <tr key={i} className="h-[58px] border-t border-[#EDEDF0] bg-white">
                      <td className="truncate px-4 py-2.5 text-[15px] font-semibold leading-4 text-[#344054]">{r.name}</td>
                      <td className="px-4 py-2.5"><StatusBadge label={r.status} /></td>
                      <td className="px-4 py-2.5 text-[13px] leading-4 text-[#344054]">{r.students.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-[13px] leading-4 text-[#344054]">{r.staff.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-[13px] leading-4 text-[#344054]">{r.weekly.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-[13px] leading-4 text-[#344054]">{r.live.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-[13px] leading-4 text-[#344054]">{r.views.toLocaleString()}</td>
                    </tr>
                  ))}
                  {instRows.length === 0 && (
                    <tr className="border-t border-[#EDEDF0]">
                      <td colSpan={7} className="px-4 py-10 text-center text-sm leading-5 text-[#6B7280]">No institutions on the platform yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <PageCountFooter left={`Showing ${instRows.length ? `1-${instRows.length}` : 0} of ${instRows.length} results`} />
          </section>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
            <div className="flex flex-col gap-4 rounded-2xl border border-[#DBDBDB] bg-white px-6 py-6">
              <p className="text-base leading-[17px] text-[#3F3F46]">Trust metric</p>
              <p className="text-[28px] font-medium leading-9 text-black">72%</p>
              <p className="text-[13px] leading-4 text-[#109E75]">Students naming Campus Update as their main source</p>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-[#DBDBDB] bg-white px-6 py-6">
              <p className="text-base leading-[17px] text-[#3F3F46]">Notification delivery</p>
              <p className="text-[28px] font-medium leading-9 text-black">{delivery || '98.4'}%</p>
              <p className="text-[13px] leading-4 text-[#666666]">Delivered within 60 seconds</p>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-[#DBDBDB] bg-white px-6 py-6">
              <p className="text-base leading-[17px] text-[#3F3F46]">Publish to first read</p>
              <p className="text-[28px] font-medium leading-9 text-black">6m</p>
              <p className="text-[13px] leading-4 text-[#666666]">Median across institutions</p>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-[#DBDBDB] bg-white px-6 py-6">
              <p className="text-base leading-[17px] text-[#3F3F46]">Time to publish</p>
              <p className="text-[28px] font-medium leading-9 text-black">3m</p>
              <p className="text-[13px] leading-4 text-[#666666]">Median, draft to live</p>
            </div>
          </div>

          <section className="flex flex-col gap-5 rounded-[10px] border border-[#DBDBDB] bg-white p-6">
            <h3 className="text-base font-semibold leading-[18px] text-[#111827]">Registration coverage</h3>
            <div className="flex items-end justify-between gap-3 overflow-x-auto pt-2">
              {weeks.map((w, i) => (
                <div key={i} className="flex min-w-[52px] flex-1 flex-col items-center gap-2">
                  <div className="flex h-[140px] w-9 flex-col justify-end rounded-t-[4px] bg-[#F1F1F4]">
                    <div className="w-9 rounded-t-[4px] bg-gradient-to-t from-[#3730A3] to-[#A5A0F7]" style={{ height: `${Math.max(8, Math.round((w / maxWeek) * 100))}%` }} />
                  </div>
                  <span className="text-[11px] leading-3 text-[#9CA3AF]">Week {i + 1}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
