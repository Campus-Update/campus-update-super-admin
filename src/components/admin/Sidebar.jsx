import {
  UniversityIcon,
  DashboardIcon,
  NewsIcon,
  NoteIcon,
  UserGroupIcon,
  AnalyticsIcon,
  SettingsIcon,
  LogoutIcon,
  SchoolsIcon,
  ShieldUserIcon,
  UsersIcon,
  EyeIcon,
  CalendarIcon,
  MegaphoneIcon,
  ListIcon,
} from './Icons.jsx'

const SECTIONS = [
  {
    label: 'PUBLISHING',
    items: [
      { id: 'overview', icon: DashboardIcon, label: 'Overview' },
      { id: 'schools', icon: SchoolsIcon, label: 'Schools' },
      { id: 'admins', icon: ShieldUserIcon, label: 'School Administrators' },
      { id: 'users', icon: UsersIcon, label: 'Users' },
      { id: 'content', icon: EyeIcon, label: 'Content Monitoring' },
    ],
  },
  {
    label: 'COMMERCIAL',
    items: [
      { id: 'events', icon: CalendarIcon, label: 'External Events' },
      { id: 'announcements', icon: MegaphoneIcon, label: 'Announcements' },
    ],
  },
  {
    label: 'GOVERNMENT',
    items: [
      { id: 'audit', icon: ListIcon, label: 'Audit log' },
      { id: 'analytics', icon: AnalyticsIcon, label: 'Analytics' },
    ],
  },
]

function NavItem({ item, active, onNavigate, onClose }) {
  return (
    <button
      type="button"
      onClick={() => {
        onNavigate?.(item.id)
        onClose?.()
      }}
      className={`flex h-12 w-full items-center gap-4 rounded-[10px] px-5 py-[10px] text-left text-base leading-6 transition-colors ${
        active
          ? 'bg-[#EEEDFD] font-semibold text-[#4F46E5]'
          : 'font-normal text-[#454545] hover:bg-[#EDEDED]'
      }`}
    >
      <item.icon className="h-6 w-6 shrink-0" stroke={active ? '#4F46E5' : '#454545'} />
      {item.label}
    </button>
  )
}

export default function Sidebar({
  active = 'overview',
  publishingAs = 'Osun State University',
  onNavigate,
  open = false,
  onClose,
}) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[321px] max-w-[85vw] shrink-0 flex-col justify-between overflow-y-auto rounded-[10px] bg-white/95 px-[26px] pb-[25px] pt-[29px] backdrop-blur transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:z-auto lg:translate-x-0 lg:bg-white/60`}
      >
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-[7px]">
          <img src="/logo-admin.svg" alt="Campus Update logo" className="h-[38px] w-8" />
          <span className="text-2xl font-semibold leading-[26px] text-black">Campus Update</span>
        </div>

        <div className="rounded-2xl border border-[#4F46E5] bg-[#201C5C] p-6">
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-[10px] border border-white bg-[#4F46E5] px-3.5 py-3 text-left"
          >
            <UniversityIcon />
            <span className="flex flex-col gap-0.5">
              <span className="text-[11px] font-medium leading-3 text-white/60">Publishing as</span>
              <span className="text-sm font-semibold leading-[15px] text-white">{publishingAs}</span>
            </span>
          </button>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.label} className="flex flex-col gap-4">
            <p className="text-xs font-medium leading-4 tracking-[0.5px] text-[#454545]">
              {section.label}
            </p>
            <nav className="flex flex-col gap-1">
              {section.items.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  active={active === item.id}
                  onNavigate={onNavigate}
                  onClose={onClose}
                />
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          className="flex h-[53px] w-full items-center gap-4 rounded-[10px] px-5 py-[10px] text-left text-base leading-6 text-[#454545] hover:bg-[#EDEDED]"
        >
          <SettingsIcon className="h-6 w-6" stroke="#454545" />
          Settings
        </button>
        <button
          type="button"
          className="flex h-[53px] w-full items-center gap-4 rounded-[10px] px-5 py-[10px] text-left text-base leading-6 text-[#D83030] hover:bg-[#FCEAEA]"
        >
          <LogoutIcon className="h-6 w-6" stroke="#D83030" />
          Logout
        </button>
      </div>
      </aside>
    </>
  )
}
