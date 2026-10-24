import { useEffect, useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { adminApi, authApi, getProfile, setProfile } from '../../lib/api.js'
import { timeAgo } from '../../lib/format.jsx'

const inputCls =
  'h-12 w-full rounded-lg border border-[#D1D5DC] bg-white px-4 text-sm text-[#111827] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEEDFD]'
const disabledCls = 'h-12 w-full rounded-lg border border-[#E5E7EB] bg-[#F3F4F6] px-4 text-sm text-[#9CA3AF] outline-none'

const Toggle = ({ on, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!on)}
    aria-pressed={on}
    className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? 'bg-[#4F46E5]' : 'bg-[#D1D5DB]'}`}
  >
    <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${on ? 'left-6' : 'left-1'}`} />
  </button>
)

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <span className="text-sm font-medium leading-5 text-[#374151]">{label}</span>
    {children}
  </div>
)

function ProfileTab({ profile, onSaved }) {
  const [first, setFirst] = useState(profile?.firstName || '')
  const [last, setLast] = useState(profile?.lastName || '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const save = async () => {
    setBusy(true)
    setError('')
    try {
      const updated = await authApi.updateProfile({ firstName: first.trim(), lastName: last.trim(), matriculationOrStaffNumber: profile?.matriculationOrStaffNumber || null })
      setProfile(updated)
      onSaved()
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold leading-6 text-[#111827]">Profile Information</h2>
        <p className="mt-1 text-sm leading-[17px] text-[#6B7280]">Update your personal details and role configurations.</p>
      </div>

      <div className="flex items-center gap-5">
        <span className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#E5E7EB]">
          <img src="/images/avatar-john.png" alt="Profile" className="h-full w-full object-cover" />
          <span className="absolute bottom-0 flex h-7 w-full items-center justify-center bg-black/50">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinejoin="round"><path d="M2 5h3l1-1.5h4L11 5h3v8H2V5Zm6 5.5A2.5 2.5 0 1 0 8 5.5a2.5 2.5 0 0 0 0 5Z" /></svg>
          </span>
        </span>
        <div>
          <p className="text-[15px] font-semibold leading-5 text-[#111827]">Profile Photo</p>
          <p className="text-[13px] leading-4 text-[#9CA3AF]">PNG, JPG or GIF. Max 5MB.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="First Name"><input className={inputCls} value={first} onChange={(e) => setFirst(e.target.value)} /></Field>
        <Field label="Last Name"><input className={inputCls} value={last} onChange={(e) => setLast(e.target.value)} /></Field>
        <Field label="Phone Number"><input className={inputCls} defaultValue="+234 801 234 5678" /></Field>
        <Field label="Email Address">
          <span className="relative block">
            <input className={`${inputCls} pr-10 text-[#6B7280]`} value={profile?.email || ''} readOnly />
            <svg viewBox="0 0 16 16" className="absolute right-3 top-3.5 h-4 w-4" stroke="#9CA3AF" strokeWidth="1.3" fill="none" strokeLinejoin="round"><path d="M4 7V5.5a4 4 0 0 1 8 0V7M3 7h10v6H3V7Z" /></svg>
          </span>
        </Field>
        <Field label="Role"><input className={disabledCls} value={profile?.role === 'SuperAdmin' ? 'Platform administrator' : profile?.role || ''} readOnly /></Field>
        <Field label="Permission Level"><input className={disabledCls} value="All Institution" readOnly /></Field>
      </div>
      <Field label="Department"><input className={disabledCls} value="Administration" readOnly /></Field>

      {error && <p className="rounded-lg bg-[#FEE4E2] px-4 py-3 text-sm leading-5 text-[#D92D20]">{error}</p>}

      <div className="flex items-center justify-end gap-3 border-t border-[#F3F4F6] pt-6">
        <button type="button" className="h-11 rounded-lg border border-[#E5E7EB] bg-white px-7 text-sm font-medium leading-5 text-[#374151] hover:bg-[#F9FAFB]" onClick={() => { setFirst(profile?.firstName || ''); setLast(profile?.lastName || '') }}>
          Cancel
        </button>
        <button type="button" disabled={busy} onClick={save} className="h-11 rounded-lg bg-[#4F46E5] px-6 text-sm font-semibold leading-5 text-white hover:bg-[#4338CA] disabled:opacity-60">
          {busy ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

function PlatformTab() {
  // Live wiring: GET/PUT /admin/platform-settings (full-object PUT — contract style).
  const [f, setF] = useState(null)
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    adminApi
      .platformSettings()
      .then((s) => setF({
        platformName: s.platformName || 'Campus Update',
        supportEmail: s.supportEmail || '',
        supportPhone: s.supportPhone || '',
        listingFee: s.listingFee ?? 0,
        invoiceDays: s.invoiceDays ?? 7,
        holdEventsUntilPayment: !!s.holdEventsUntilPayment,
        maintenanceMode: !!s.maintenanceMode,
      }))
      .catch((e) => setError(`Could not load platform settings: ${e.message}`))
  }, [])
  const set = (k) => (e) => setF((c) => ({ ...c, [k]: e.target.value }))
  const save = () => {
    setBusy(true); setError(''); setSaved(false)
    adminApi
      .savePlatformSettings({
        platformName: f.platformName,
        supportEmail: f.supportEmail || null,
        supportPhone: f.supportPhone || null,
        maintenanceMode: f.maintenanceMode,
        listingFee: Number(f.listingFee) || 0,
        invoiceDays: Number(f.invoiceDays) || 7,
        holdEventsUntilPayment: !!f.holdEventsUntilPayment,
      })
      .then(() => { setSaved(true); setBusy(false) })
      .catch((e) => { setError(`Save failed: ${e.message}`); setBusy(false) })
  }
  const hold = f?.holdEventsUntilPayment ?? true
  const setHold = (v) => setF((c) => ({ ...c, holdEventsUntilPayment: v }))
  if (!f) return (
    <div className="flex flex-col gap-4">
      {error
        ? <p className="rounded-lg bg-[#FEE4E2] px-4 py-3 text-sm leading-5 text-[#D92D20]">{error}</p>
        : <p className="text-sm text-[#6B7280]">Loading platform settings…</p>}
    </div>
  )
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold leading-6 text-[#111827]">Platform details</h2>
        <p className="mt-1 text-sm leading-[17px] text-[#6B7280]">Manage your platform details</p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Institution Name"><input className={inputCls} defaultValue="LeadCity University" /></Field>
        <Field label="Industry"><input className={inputCls} defaultValue="Hospitality & Tourism" /></Field>
        <Field label="Support Email"><input className={inputCls} value={f.supportEmail} onChange={set('supportEmail')} placeholder="support@campusupdate.example" /></Field>
        <Field label="Support Phone Number"><input className={inputCls} value={f.supportPhone} onChange={set('supportPhone')} placeholder="+234 801 234 5678" /></Field>
      </div>

      <h3 className="text-base font-semibold leading-[18px] text-[#111827]">External events and payments</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Standard listing fee (N)">
          <input className={inputCls} value={f.listingFee} onChange={set('listingFee')} inputMode="numeric" />
          <span className="text-[13px] leading-4 text-[#9CA3AF]">Pre-filled when an event passes review. You can change it per event.</span>
        </Field>
        <Field label="Days to pay an invoice">
          <input className={inputCls} value={f.invoiceDays} onChange={set('invoiceDays')} inputMode="numeric" />
          <span className="text-[13px] leading-4 text-[#9CA3AF]">Unpaid requests are flagged after this.</span>
        </Field>
      </div>

      <div className="flex items-center justify-between gap-6 border-t border-[#F3F4F6] pt-6">
        <div>
          <p className="text-[15px] font-semibold leading-5 text-[#111827]">Hold events until payment is confirmed</p>
          <p className="text-[13px] leading-4 text-[#9CA3AF]">An external event cannot be approved and published while its invoice is unpaid.</p>
        </div>
        <Toggle on={hold} onChange={setHold} />
      </div>

      {error && <p className="rounded-lg bg-[#FEE4E2] px-4 py-3 text-sm leading-5 text-[#D92D20]">{error}</p>}
      {saved && <p className="rounded-lg bg-[#E6F6F0] px-4 py-3 text-sm leading-5 text-[#0F7B5F]">Platform settings saved.</p>}

      <div className="flex items-center justify-end gap-3 border-t border-[#F3F4F6] pt-6">
        <button type="button" className="h-11 rounded-lg border border-[#E5E7EB] bg-white px-7 text-sm font-medium leading-5 text-[#374151] hover:bg-[#F9FAFB]">Cancel</button>
        <button type="button" onClick={save} disabled={busy} className="h-11 rounded-lg bg-[#4F46E5] px-6 text-sm font-semibold leading-5 text-white hover:bg-[#4338CA] disabled:opacity-60">{busy ? 'Saving…' : 'Save Changes'}</button>
      </div>
    </div>
  )
}

const NOTIF_ROWS = [
  { id: 'review', title: 'External event needs review or approval', sub: 'New requests, and payments waiting for approval.', on: true },
  { id: 'ads', title: 'Advertisement submitted for review', sub: '', on: true },
  { id: 'school', title: 'School or administrator changes', sub: 'Made by anyone on the platform team.', on: true },
  { id: 'urgent', title: 'Urgent notices published by schools', sub: 'Useful for spotting misuse of urgent priority.', on: false },
  { id: 'device', title: 'Sign-in from a new device', sub: 'Email is always sent.', on: true },
]

function NotificationsTab() {
  const [rows, setRows] = useState(NOTIF_ROWS)
  const [push, setPush] = useState(true)
  const [saved, setSaved] = useState(false)
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold leading-6 text-[#111827]">Notification Preferences</h2>
        <p className="mt-1 text-sm leading-[17px] text-[#6B7280]">Configure when and where you receive notifications.</p>
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#9CA3AF]">Email notifications</p>
      <div className="flex flex-col">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-6 border-t border-[#F3F4F6] py-4 first:border-t-0">
            <div>
              <p className="text-[15px] font-semibold leading-5 text-[#111827]">{r.title}</p>
              {r.sub && <p className="text-[13px] leading-4 text-[#9CA3AF]">{r.sub}</p>}
            </div>
            <Toggle on={r.on} onChange={(v) => setRows(rows.map((x) => (x.id === r.id ? { ...x, on: v } : x)))} />
          </div>
        ))}
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-[#9CA3AF]">In-app notifications</p>
      <div className="flex items-center justify-between gap-6 border-t border-[#F3F4F6] py-4">
        <div>
          <p className="text-[15px] font-semibold leading-5 text-[#111827]">Push Notifications</p>
          <p className="text-[13px] leading-4 text-[#9CA3AF]">Show browser push notifications for urgent items</p>
        </div>
        <Toggle on={push} onChange={setPush} />
      </div>

      <Field label="Summary email">
        <select className={inputCls} defaultValue="Daily at 7am">
          {['Daily at 7am', 'Weekly on Monday', 'Off'].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <span className="text-[13px] leading-4 text-[#9CA3AF]">Platform activity and items waiting on you</span>
      </Field>

      {saved && <p className="rounded-lg bg-[#E6F6F0] px-4 py-3 text-sm leading-5 text-[#0F7B5F]">Preferences saved on this device.</p>}

      <div className="flex justify-end">
        <button type="button" onClick={() => setSaved(true)} className="h-11 rounded-lg bg-[#4F46E5] px-6 text-sm font-semibold leading-5 text-white hover:bg-[#4338CA]">Save Preferences</button>
      </div>
    </div>
  )
}

function SecurityTab() {
  const [cur, setCur] = useState('')
  const [nw, setNw] = useState('')
  const [cf, setCf] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)
  const [sessions, setSessions] = useState([])
  const loadSessions = () => authApi.sessions().then(setSessions).catch(() => setSessions([]))
  useEffect(() => { loadSessions() }, [])

  const submit = async () => {
    setMsg(null)
    if (nw.length < 8) { setMsg({ kind: 'err', text: 'New password must be at least 8 characters.' }); return }
    if (nw !== cf) { setMsg({ kind: 'err', text: 'New password and confirmation do not match.' }); return }
    setBusy(true)
    try {
      await authApi.changePassword({ currentPassword: cur, newPassword: nw })
      setMsg({ kind: 'ok', text: 'Password updated successfully.' })
      setCur(''); setNw(''); setCf('')
    } catch (e) {
      setMsg({ kind: 'err', text: e.message })
    } finally { setBusy(false) }
  }

  const fmtDate = (d) => new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold leading-6 text-[#111827]">Change Password</h2>
        <p className="mt-1 text-sm leading-[17px] text-[#6B7280]">Ensure your account is using a long, random password to stay secure.</p>
      </div>

      <Field label="Current Password">
        <span className="relative block">
          <input type="password" className={`${inputCls} pr-10`} value={cur} onChange={(e) => setCur(e.target.value)} />
          <svg viewBox="0 0 16 16" className="absolute right-3 top-3.5 h-4 w-4" stroke="#9CA3AF" strokeWidth="1.3" fill="none" strokeLinejoin="round"><path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Zm6.5 2A2 2 0 1 0 8 6a2 2 0 0 0 0 4Z" /></svg>
        </span>
      </Field>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="New Password"><input type="password" className={inputCls} placeholder="Enter new password" value={nw} onChange={(e) => setNw(e.target.value)} /></Field>
        <Field label="Confirm New Password"><input type="password" className={inputCls} placeholder="Confirm new password" value={cf} onChange={(e) => setCf(e.target.value)} /></Field>
      </div>
      <p className="text-[13px] leading-4 text-[#9CA3AF]">Must be at least 8 characters with one uppercase, one number, and one special character.</p>
      {msg && <p className={`rounded-lg px-4 py-3 text-sm leading-5 ${msg.kind === 'ok' ? 'bg-[#E6F6F0] text-[#0F7B5F]' : 'bg-[#FEE4E2] text-[#D92D20]'}`}>{msg.text}</p>}
      <div>
        <button type="button" disabled={busy} onClick={submit} className="h-11 rounded-lg bg-[#4F46E5] px-6 text-sm font-semibold leading-5 text-white hover:bg-[#4338CA] disabled:opacity-60">
          {busy ? 'Updating…' : 'Update Password'}
        </button>
      </div>

      <div className="border-t border-[#F3F4F6] pt-6">
        <h3 className="text-base font-semibold leading-[18px] text-[#111827]">Login Activity</h3>
        <p className="mt-1 text-[13px] leading-4 text-[#9CA3AF]">Recent login sessions for your account.</p>
        <div className="mt-4 flex flex-col">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-4 border-t border-[#F3F4F6] py-4 first:border-t-0">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEEDFD]">
                  <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="#4F46E5" strokeWidth="1.3" fill="none" strokeLinejoin="round"><path d="M2 3h12v8H2V3Zm4 10h4M8 11v2" /></svg>
                </span>
                <div>
                  <p className="text-[15px] font-semibold leading-5 text-[#111827]">{s.isCurrent ? 'This device' : 'Another session'}</p>
                  <p className="text-[13px] leading-4 text-[#9CA3AF]">Signed in {fmtDate(s.createdAt)} · Last active {timeAgo(s.lastActiveAt)}</p>
                </div>
              </div>
              {s.isCurrent ? (
                <span className="rounded-full bg-[#E6F6F0] px-3 py-[5px] text-[13px] font-medium leading-4 text-[#0F7B5F]">Current Session</span>
              ) : (
                <button type="button" onClick={() => authApi.revokeSession(s.id).then(loadSessions)} className="rounded-lg border border-[#F3C1C1] px-4 py-2 text-[13px] font-medium leading-4 text-[#D92D20] hover:bg-[#FEF2F2]">
                  Sign Out
                </button>
              )}
            </div>
          ))}
          {sessions.length === 0 && <p className="border-t border-[#F3F4F6] py-4 text-[13px] leading-4 text-[#9CA3AF]">No other sessions.</p>}
        </div>
        <button type="button" onClick={() => authApi.revokeOtherSessions().then(loadSessions)} className="mt-4 rounded-lg border border-[#F3C1C1] px-5 py-3 text-sm font-medium leading-5 text-[#D92D20] hover:bg-[#FEF2F2]">
          Sign Out All Other Sessions
        </button>
      </div>
    </div>
  )
}

const TABS = ['Profile', 'Platform', 'Notifications', 'Security']

export default function SettingsPage({ onNavigate }) {
  const [navOpen, setNavOpen] = useState(false)
  const [tab, setTab] = useState('Profile')
  const [profile, setProf] = useState(getProfile())

  useEffect(() => {
    authApi.profile().then((p) => {
      setProfile(p)
      setProf(p)
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen w-full bg-[#E9E9EA] p-3 md:p-[27px]">
      <div className="flex gap-4 md:gap-6">
        <Sidebar active="settings" publishingAs="Campus Update" onNavigate={onNavigate} open={navOpen} onClose={() => setNavOpen(false)} />

        <main className="flex min-w-0 flex-1 flex-col gap-4 md:gap-6">
          <Topbar title="Settings" subtitle="Manage your account and platform preferences." onMenu={() => setNavOpen(true)} />

          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-[224px_1fr]">
            <nav className="flex flex-row gap-2 lg:flex-col lg:gap-3">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`h-12 flex-1 rounded-[10px] px-5 text-left text-sm font-medium leading-5 lg:flex-none ${
                    tab === t ? 'bg-[#4F46E5] text-white' : 'text-[#374151] hover:bg-[#E4E4E7]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </nav>

            <section className="rounded-[10px] border border-[#DBDBDB] bg-white p-6 md:p-8">
              {tab === 'Profile' && <ProfileTab profile={profile} onSaved={() => setProf(getProfile())} />}
              {tab === 'Platform' && <PlatformTab />}
              {tab === 'Notifications' && <NotificationsTab />}
              {tab === 'Security' && <SecurityTab />}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
