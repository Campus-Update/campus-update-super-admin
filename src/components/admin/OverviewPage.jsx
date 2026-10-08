import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import {
  ChevronRight,
  ClipboardIcon,
  ActivityIcon,
  NewsIcon,
  NoteIcon,
  MegaphoneIcon,
  UserGroupIcon,
} from './Icons.jsx'

const STATS = [
  { label: 'Live institutions', value: '00', sub: '00 this month', purple: true },
  { label: 'Registered users', value: '00', sub: 'Active users' },
  { label: 'Weekly active', value: '00', sub: 'Active registration' },
  { label: 'Awaiting your review', value: '00', sub: 'Awaiting approval' },
]

const QUICK_ACTIONS = [
  { icon: NewsIcon, chip: '#EEEDFD', stroke: '#4F46E5', title: 'New Article', sub: 'Draft a standard news post' },
  { icon: NoteIcon, chip: '#EEEDFD', stroke: '#4F46E5', title: 'Schedule Event', sub: 'Add to university calendar' },
  { icon: MegaphoneIcon, chip: '#FCEAEA', stroke: '#DC2626', title: 'Manage News Announcement', sub: 'Create and manage alerts' },
  { icon: UserGroupIcon, chip: '#E6F2EF', stroke: '#047857', title: 'View Users', sub: 'Manage system users' },
]

function StatCard({ stat }) {
  return (
    <div
      className={
        stat.purple
          ? 'flex flex-col gap-[27px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#2C277F] px-7 py-[18px] text-white'
          : 'flex flex-col gap-[27px] rounded-2xl bg-white py-[18px] pl-[27px] pr-[27px] shadow-[0_0_6px_rgba(0,0,0,0.02)]'
      }
    >
      <p className={`text-lg leading-[26px] font-medium ${stat.purple ? 'text-white' : 'text-[#2D2D2D]'}`}>
        {stat.label}
      </p>
      <div className="flex flex-col gap-[15px]">
        <p className={`text-4xl font-medium leading-[44px] tracking-[-0.5px] ${stat.purple ? 'text-white' : 'text-[#2D2D2D]'}`}>
          {stat.value}
        </p>
        <p className={`text-base leading-6 ${stat.purple ? 'text-white/70' : 'text-[#666666]'}`}>
          {stat.sub}
        </p>
      </div>
    </div>
  )
}

function EmptyState({ icon: Icon, title, sub }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-[#E5E7EB] p-5 py-8">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border-[1.5px] border-[#4F46E5]/30 bg-[#100070]/5">
        <Icon />
      </span>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-base font-semibold leading-[17px] text-[#2D2D2D]">{title}</p>
        <p className="text-sm leading-5 text-[#6E6E6E]">{sub}</p>
      </div>
    </div>
  )
}

function CardHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold leading-[20px] text-[#2D2D2D]">{title}</h3>
      <a href="#" className="text-sm font-semibold leading-[15px] text-[#4F46E5]">
        {action}
      </a>
    </div>
  )
}

export default function OverviewPage() {
  const [navOpen, setNavOpen] = useState(false)
  return (
    <div className="flex min-h-screen gap-[15px] bg-[#F3F3F3] p-[5px] font-sans md:p-[15px]">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} onNavigate={() => {}} />

      <main className="flex min-w-0 flex-1 flex-col gap-3">
        <Topbar onMenu={() => setNavOpen(true)} />

        {/* Dashboard body */}
        <div className="flex flex-col gap-6 rounded-[10px] bg-white/60 p-4 md:p-8">
          {/* Date badge */}
          <div>
            <span className="inline-flex rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium leading-[19px] text-[#2D2D2D]">
              Mon, 25 Aug 2025
            </span>
          </div>

          {/* Greeting */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl leading-[22px] text-[#141B34]">Good morning, Ade.</h2>
            <p className="text-sm leading-[15px] text-[#525252]">
              Here's what is happening across Campus Update today.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-[21px] sm:grid-cols-2 xl:grid-cols-4">
            {STATS.map((s) => (
              <StatCard key={s.label} stat={s} />
            ))}
          </div>

          {/* Middle split */}
          <div className="grid gap-5 xl:grid-cols-[770fr_528fr]">
            {/* Pending approvals */}
            <section className="flex min-h-[359px] flex-col gap-4 rounded-xl bg-white p-6">
              <CardHeader title="Pending Approvals" action="View All" />
              <EmptyState
                icon={ClipboardIcon}
                title="No pending approvals"
                sub="All caught up! New approval requests will appear here."
              />
            </section>

            {/* Quick actions */}
            <section className="flex h-fit flex-col gap-2.5 rounded-lg bg-white px-5 py-[25px]">
              <h3 className="text-lg font-medium leading-[26px] text-black">Quick Actions</h3>
              {QUICK_ACTIONS.map((a) => (
                <button key={a.title} type="button" className="flex items-center justify-between">
                  <span className="flex items-center gap-[9px] text-left">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg p-2.5"
                      style={{ backgroundColor: a.chip }}
                    >
                      <a.icon className="h-6 w-6" stroke={a.stroke} />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-base font-medium leading-[26px] text-black">{a.title}</span>
                      <span className="text-sm leading-[26px] text-[#999999]">{a.sub}</span>
                    </span>
                  </span>
                  <ChevronRight />
                </button>
              ))}
            </section>
          </div>

          {/* Recent activity */}
          <section className="flex flex-col gap-4 rounded-xl bg-white p-6">
            <CardHeader title="Recent System Activity" action="View Audit Log" />
            <EmptyState
              icon={ActivityIcon}
              title="No recent activity"
              sub="System events and actions will be logged here."
            />
          </section>
        </div>
      </main>
    </div>
  )
}
