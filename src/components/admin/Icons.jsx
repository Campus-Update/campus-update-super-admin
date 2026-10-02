const S = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }

export const LogoMark = ({ className = 'h-[38px] w-8' }) => (
  <svg viewBox="0 0 32 38" className={className} aria-hidden="true">
    <path
      d="M20.6 13.4c-1.5-1.4-3.4-2.2-5.5-2.1-4.2.1-7.6 3.6-7.6 7.9 0 4.3 3.4 7.8 7.6 7.9 2.1.1 4-.7 5.5-2.1"
      fill="none"
      stroke="#4F46E5"
      strokeWidth="5.5"
      strokeLinecap="round"
    />
    <path d="M4 2.5h24a2 2 0 0 1 0 4H4a2 2 0 0 1 0-4Z" fill="#4F46E5" />
  </svg>
)

export const UniversityIcon = ({ className = 'h-[18px] w-[18px]' }) => (
  <svg viewBox="0 0 18 18" className={className} stroke="#A5B4FC" strokeWidth="1.125" {...S} aria-hidden="true">
    <path d="M1.5 16h15M2.5 12.5h12M5 9.5V6.8L8.5 3l3.5 3.8v2.7M8 5.5h1.5M9 7.5v.5" />
  </svg>
)

export const DashboardIcon = ({ className = 'h-6 w-6', stroke = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" className={className} stroke={stroke} strokeWidth="1.5" {...S} aria-hidden="true">
    <circle cx="8.5" cy="8.5" r="4" />
    <circle cx="15.5" cy="8.5" r="4" />
    <circle cx="15.5" cy="15.5" r="4" />
    <circle cx="8.5" cy="15.5" r="4" />
  </svg>
)

export const NewsIcon = ({ className = 'h-6 w-6', stroke = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" className={className} stroke={stroke} strokeWidth="1.5" {...S} aria-hidden="true">
    <path d="M19.5 8.5v10a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1M19.5 8.5h-2a1 1 0 0 0-1 1v7.5a1.5 1.5 0 0 0 3 0v-7Z" />
    <path d="M8 8.5h5.5M8 12.5h5.5M8 16.5h3.5" />
  </svg>
)

export const NoteIcon = ({ className = 'h-6 w-6', stroke = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" className={className} stroke={stroke} strokeWidth="1.5" {...S} aria-hidden="true">
    <path d="M10 4.5h9a1.5 1.5 0 0 1 1.5 1.5v12A1.5 1.5 0 0 1 19 19.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5h1" />
    <path d="M8 3.5h4v3H8zM9.5 10.5h4M9.5 14h4" />
  </svg>
)

export const UserGroupIcon = ({ className = 'h-6 w-6', stroke = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" className={className} stroke={stroke} strokeWidth="1.5" {...S} aria-hidden="true">
    <circle cx="9.5" cy="7.5" r="2.5" />
    <circle cx="15.5" cy="7.5" r="2.5" />
    <path d="M4.5 15.5c.7-2 2.7-3.2 5-3.2 1.5 0 2.9.5 3.9 1.4M13.5 17.5c.5-2.1 2.1-3.5 4-3.5 1.4 0 2.7.8 3.5 2M6.5 17.5c.6-1.3 1.7-2.1 3-2.1s2.4.8 3 2.1" />
  </svg>
)

export const AnalyticsIcon = ({ className = 'h-6 w-6', stroke = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" className={className} stroke={stroke} strokeWidth="1.5" {...S} aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.5 14.5v-3M12 14.5V9.5M15.5 14.5v-2" />
  </svg>
)

export const SettingsIcon = ({ className = 'h-6 w-6', stroke = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" className={className} stroke={stroke} strokeWidth="1.5" {...S} aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19 12a7 7 0 0 0-.14-1.4l2.1-1.63-2-3.47-2.48 1a7 7 0 0 0-2.42-1.4L13.7 2.5h-3.4l-.36 2.6a7 7 0 0 0-2.42 1.4l-2.48-1-2 3.47 2.1 1.63a7 7 0 0 0 0 2.8l-2.1 1.63 2 3.47 2.48-1a7 7 0 0 0 2.42 1.4l.36 2.6h3.4l.36-2.6a7 7 0 0 0 2.42-1.4l2.48 1 2-3.47-2.1-1.63c.1-.46.14-.93.14-1.4Z" />
  </svg>
)

export const LogoutIcon = ({ className = 'h-6 w-6', stroke = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" className={className} stroke={stroke} strokeWidth="1.5" {...S} aria-hidden="true">
    <path d="M13 4.5H6A1.5 1.5 0 0 0 4.5 6v12A1.5 1.5 0 0 0 6 19.5h7M10 12h10.5M17 8.5l3.5 3.5-3.5 3.5" />
  </svg>
)

export const BellIcon = ({ className = 'h-7 w-7', stroke = '#454545' }) => (
  <svg viewBox="0 0 29 29" className={className} stroke={stroke} strokeWidth="1.84" {...S} aria-hidden="true">
    <path d="M22.5 19.5H6.5c2-2 2.6-4.7 2.6-7.6a5.4 5.4 0 0 1 10.8 0c0 2.9.6 5.6 2.6 7.6ZM11.5 23a3 3 0 0 0 6 0" />
  </svg>
)

export const ChevronDown = ({ className = 'h-7 w-7', stroke = '#525252' }) => (
  <svg viewBox="0 0 27 27" className={className} stroke={stroke} strokeWidth="1.7" {...S} aria-hidden="true">
    <path d="M7 10.5l6.5 6 6.5-6" />
  </svg>
)

export const ChevronRight = ({ className = 'h-6 w-6', stroke = '#555555' }) => (
  <svg viewBox="0 0 24 24" className={className} stroke={stroke} strokeWidth="1.5" {...S} aria-hidden="true">
    <path d="M9.5 6l6 6-6 6" />
  </svg>
)

export const ClipboardIcon = ({ className = 'h-7 w-7', stroke = '#4F46E5' }) => (
  <svg viewBox="0 0 28 28" className={className} stroke={stroke} strokeWidth="2" {...S} aria-hidden="true">
    <rect x="5.5" y="4.5" width="17" height="20" rx="2.5" />
    <path d="M10 4.5V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v.5" />
  </svg>
)

export const ActivityIcon = ({ className = 'h-7 w-7', stroke = '#4F46E5' }) => (
  <svg viewBox="0 0 28 28" className={className} stroke={stroke} strokeWidth="2" {...S} aria-hidden="true">
    <path d="M2.5 14h6l3.5-8 4 16 3.5-8h6" />
  </svg>
)

export const CalendarIcon = ({ className = 'h-6 w-6', stroke = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" className={className} stroke={stroke} strokeWidth="1.5" {...S} aria-hidden="true">
    <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
    <path d="M3.5 10.5h17M8 3.5v4M16 3.5v4" />
  </svg>
)

export const MegaphoneIcon = ({ className = 'h-6 w-6', stroke = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" className={className} stroke={stroke} strokeWidth="1.5" {...S} aria-hidden="true">
    <path d="M3.5 10v4a1 1 0 0 0 1 1H7l4.5 4a1 1 0 0 0 1.5-.87V5.87A1 1 0 0 0 11.5 5L7 9H4.5a1 1 0 0 0-1 1ZM17 9.5a4 4 0 0 1 0 5M19.5 7.5a7 7 0 0 1 0 9" />
  </svg>
)
