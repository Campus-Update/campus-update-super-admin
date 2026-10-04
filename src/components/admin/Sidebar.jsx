import {
  UniversityIcon,
  DashboardIcon,
  NewsIcon,
  NoteIcon,
  UserGroupIcon,
  AnalyticsIcon,
  SettingsIcon,
  LogoutIcon,
} from "./Icons.jsx";

function NavItem({
  icon: Icon,
  label,
  active = false,
  danger = false,
  href = "#",
}) {
  return (
    <a
      href={href}
      className={`flex h-12 items-center gap-4 rounded-[10px] px-5 py-[10px] text-base leading-6 transition-colors ${
        active
          ? "bg-[#EEEDFD] font-semibold text-[#4F46E5]"
          : danger
            ? "font-normal text-[#D83030] hover:bg-[#FCEAEA]"
            : "font-normal text-[#454545] hover:bg-[#F3F3F3]"
      }`}
    >
      <Icon
        className="h-6 w-6 shrink-0"
        stroke={active ? "#4F46E5" : danger ? "#D83030" : "#454545"}
      />
      {label}
    </a>
  );
}

function MenuLabel({ children }) {
  return (
    <p className="text-xs font-medium leading-4 tracking-[0.5px] text-[#454545]">
      {children}
    </p>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex w-[321px] shrink-0 flex-col justify-between rounded-[10px] bg-white/60 px-[26px] pb-[25px] pt-[29px]">
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div className="flex items-center gap-[7px]">
          <span
            aria-hidden="true"
            className="h-[38px] w-8 shrink-0 bg-[#4F46E5]"
            style={{
              maskImage: "url('/images/Group%201.svg')",
              maskPosition: "center",
              maskRepeat: "no-repeat",
              maskSize: "contain",
            }}
          />
          <span className="text-2xl font-semibold leading-[26px] text-black">
            Campus Update
          </span>
        </div>

        {/* Publishing-as card */}
        <div className="rounded-2xl border border-[#4F46E5] bg-[#201C5C] p-6">
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-[10px] border border-white bg-[#4F46E5] px-3.5 py-3 text-left"
          >
            <UniversityIcon />
            <span className="flex flex-col gap-0.5">
              <span className="text-[11px] font-medium leading-3 text-white/60">
                Publishing as
              </span>
              <span className="text-sm font-semibold leading-[15px] text-white">
                Osun State University
              </span>
            </span>
          </button>
        </div>

        {/* Publishing menu */}
        <div className="flex flex-col gap-4">
          <MenuLabel>PUBLISHING</MenuLabel>
          <nav className="flex flex-col gap-1">
            <NavItem icon={DashboardIcon} label="Overview" active />
            <NavItem icon={NewsIcon} label="Schools" href="/schools" />
            <NavItem icon={NoteIcon} label="Users" />
          </nav>
        </div>

        {/* Institution menu */}
        <div className="flex flex-col gap-4">
          <MenuLabel>INSTITUTION</MenuLabel>
          <nav className="flex flex-col gap-1">
            <NavItem icon={UserGroupIcon} label="User Management" />
            <NavItem icon={AnalyticsIcon} label="Statistics" />
          </nav>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col gap-1.5">
        <NavItem icon={SettingsIcon} label="Settings" />
        <NavItem icon={LogoutIcon} label="Logout" danger />
      </div>
    </aside>
  );
}
