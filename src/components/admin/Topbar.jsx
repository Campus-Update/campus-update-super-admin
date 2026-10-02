import { BellIcon, ChevronDown } from './Icons.jsx'

export default function Topbar() {
  return (
    <header className="flex items-center justify-between rounded-[10px] bg-white/60 px-[50px] py-3">
      <div className="flex flex-col gap-2.5">
        <h1 className="text-2xl font-medium leading-[26px] tracking-[-0.5px] text-[#2D2D2D]">
          Overview
        </h1>
        <p className="text-base leading-[17px] text-[#6E6E6E]">
          Manage operations, users, and system configuration.
        </p>
      </div>

      <div className="flex items-center gap-[31px]">
        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-[54px] w-[54px] items-center justify-center rounded-full bg-white"
        >
          <BellIcon />
          <span className="absolute right-[9px] top-[8px] h-3 w-3 rounded-full bg-[#D85A30]" />
        </button>

        {/* User chip */}
        <button
          type="button"
          className="flex items-center gap-3 rounded-full border border-[#E5E7EB] bg-white py-[13px] pl-[26px] pr-4"
        >
          <img
            src="/images/avatar-john.png"
            alt="John Doe"
            className="h-[42px] w-[42px] rounded-full object-cover"
          />
          <span className="flex flex-col gap-1 text-left">
            <span className="text-base font-semibold leading-[17px] text-[#2D2D2D]">John Doe</span>
            <span className="text-[13px] leading-[14px] text-[#6B7280]">Faculty Administrator</span>
          </span>
          <ChevronDown className="ml-[46px] h-[27px] w-[27px]" />
        </button>
      </div>
    </header>
  )
}
