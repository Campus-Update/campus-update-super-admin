import { ModalShell, Field, inputCls, selectCls, SelectWrap, CompactButtons } from './ui.jsx'
import { WarningIcon, TrashIcon, SealCheckIcon, CloseIcon, OctagonPauseLg } from './Icons.jsx'

const ROLES = ['Institution administrator', 'Faculty administrator', 'Department administrator']
const INSTITUTIONS = ['Lead City University', 'University of Ibadan', 'University of Lagos', 'Obafemi Awolowo University']

export function AdminFormModal({ mode = 'add', onClose, onSubmit }) {
  const editing = mode === 'edit'
  return (
    <ModalShell width={582}>
      <div className="flex flex-col gap-6 p-8">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold leading-6 text-[#111827]">
              {editing ? 'Edit Administrator' : 'Add school administrator'}
            </h2>
            <p className="text-sm leading-[17px] text-[#6B7280]">
              {editing ? 'Update administrator details' : 'They can publish only for the institutions you associate them with.'}
            </p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="mt-1 text-[#6B7280] hover:text-black">
            <CloseIcon />
          </button>
        </div>

        <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); onSubmit?.() }}>
          <div className="flex flex-col gap-5 sm:flex-row">
            <Field label="Full name">
              <input className={inputCls} defaultValue={editing ? 'Aisha' : ''} placeholder="e.g. Aisha" />
            </Field>
            <Field label="Last Name">
              <input className={inputCls} defaultValue={editing ? 'Bello' : ''} placeholder="e.g. Bello" />
            </Field>
          </div>
          <Field label="Email Address">
            <input className={inputCls} defaultValue={editing ? 'covenantuni@gmail.com' : ''} placeholder="Enter email address" />
          </Field>
          <div className="flex flex-col gap-5 sm:flex-row">
            <Field label="Role">
              <SelectWrap>
                <select className={selectCls} defaultValue={editing ? ROLES[0] : ''}>
                  {!editing && <option value="" disabled>Select a role</option>}
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </SelectWrap>
            </Field>
            <Field label="Institution">
              <SelectWrap>
                <select className={selectCls} defaultValue={editing ? INSTITUTIONS[0] : ''}>
                  {!editing && <option value="" disabled>Select institution</option>}
                  {INSTITUTIONS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </SelectWrap>
            </Field>
          </div>
          <Field
            label="Scope"
            required={false}
            hintTop
            hint="What this administrator is allowed to publish, and to whom."
          >
            <input className={inputCls} defaultValue={editing ? 'FOCIT' : ''} placeholder="e.g FOCIT" />
          </Field>

          <div className="mt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-lg border border-[#E5E7EB] bg-white px-7 text-sm font-medium leading-5 text-[#374151] hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 rounded-lg bg-[#4F46E5] px-6 text-sm font-semibold leading-5 text-white hover:bg-[#4338CA]"
            >
              {editing ? 'Save Changes' : 'Add administrator'}
            </button>
          </div>
        </form>
      </div>
    </ModalShell>
  )
}

function SummaryCard({ rows }) {
  return (
    <div className="flex flex-col rounded-[10px] bg-[#F9FAFB] px-4">
      {rows.map(([k, v, cls]) => (
        <div key={k} className="flex min-h-[42px] items-center justify-between border-t border-[#F3F4F6] py-2.5 first:border-t-0">
          <span className="text-[13px] leading-4 text-[#6B7280]">{k}</span>
          <span className={`text-[13px] font-semibold leading-4 ${cls || 'text-[#111827]'}`}>{v}</span>
        </div>
      ))}
    </div>
  )
}

export function SuccessModal({ onClose }) {
  const rows = [
    ['Name', 'Aisha Bello'],
    ['Email', 'covenantuni@gmail.com'],
    ['Role', 'Institution Administrator'],
    ['Institution', 'Leadcity University'],
    ['Status', 'Active', 'text-[#109E75]'],
    ['Added on', 'Aug 27, 2026 · 3:15 PM'],
  ]
  return (
    <ModalShell width={582}>
      <div className="flex flex-col gap-6 p-8">
        <div className="flex flex-col items-center gap-3 pt-2 text-center">
          <SealCheckIcon className="h-24 w-24" />
          <h2 className="text-xl font-semibold leading-6 text-[#111827]">Administator Added Successfully</h2>
          <p className="text-sm leading-[17px] text-[#6B7280]">
            Aisha Bello has been successfully added to the system. An invitation email with login credentials has been
            sent.
          </p>
        </div>

        <SummaryCard rows={rows} />

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-[#E5E7EB] bg-white px-7 text-sm font-medium leading-5 text-[#374151] hover:bg-[#F9FAFB]"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg bg-[#4F46E5] px-6 text-sm font-semibold leading-5 text-white hover:bg-[#4338CA]"
          >
            Back to School Administrator
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

const COMMON = ['covenantuni@gmail.com', 'Leadcity University', 'FOCIT · news, events, announcements', 'Active', 'Aug 27, 2026 · 3:15 PM']

const ADMIN_ROWS = [
  ['Name', 'Aisha Bello'],
  ['Email', COMMON[0]],
  ['Role', 'Institution Administrator'],
  ['Institution', COMMON[1]],
  ['Scope', COMMON[2]],
  ['Status', COMMON[3], 'text-[#109E75]'],
  ['Added on', COMMON[4]],
]

const USER_ROWS = [
  ['Name', 'Aisha Bello'],
  ['Email', COMMON[0]],
  ['Type', 'Student'],
  ['Level', '300L'],
  ['Institution', COMMON[1]],
  ['Scope', COMMON[2]],
  ['Status', COMMON[3], 'text-[#109E75]'],
  ['Added on', COMMON[4]],
]

export function DeactivateModal({ kind = 'admin', onClose }) {
  const user = kind === 'user'
  return (
    <ModalShell width={582}>
      <div className="flex flex-col gap-6 p-8">
        <div className="flex flex-col items-center gap-4 pt-2 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FEF0C7]">
            <WarningIcon className="h-8 w-8" stroke="#DC6803" />
          </span>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold leading-6 text-[#111827]">
              {user ? 'Deactivate Account?' : 'Deactivate School?'}
            </h2>
            <p className="text-sm leading-[17px] text-[#6B7280]">
              Are you sure you want to deactivate <span className="font-semibold text-[#111827]">Aisha Bellow</span>? They
              will lose access to the platform immediately but their data will be preserved.
            </p>
          </div>
        </div>

        <SummaryCard rows={user ? USER_ROWS : ADMIN_ROWS} />

        <Field label="Reason for Deactivation">
          <textarea
            rows={4}
            placeholder="Enter reason for deactivation..."
            className="w-full resize-none rounded-lg border border-[#D1D5DC] bg-white p-4 text-sm leading-[20px] text-black placeholder:text-[#9CA3AF] outline-none focus:border-[#4F46E5]"
          />
        </Field>

        <CompactButtons
          secondaryLabel="Cancel"
          primaryLabel="Deactivate Administrator"
          primaryCls="bg-[#D85A30] hover:bg-[#C2410C]"
          onSecondary={onClose}
          onPrimary={onClose}
        />
      </div>
    </ModalShell>
  )
}

export function SuspendModal({ onClose }) {
  return (
    <ModalShell width={582}>
      <div className="flex flex-col gap-6 p-8">
        <div className="flex flex-col items-center gap-4 pt-2 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FEF0C7]">
            <OctagonPauseLg className="h-8 w-8" stroke="#DC6803" />
          </span>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold leading-6 text-[#111827]">Suspend Account</h2>
            <p className="text-sm leading-[17px] text-[#6B7280]">
              This action cannot be undone, This account will be suspended, including their activity history
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-[#FEF3F2] px-4 py-2.5">
          <WarningIcon className="h-4 w-4" stroke="#B42318" />
          <span className="text-[13px] leading-4 text-[#B42318]">Warning:</span>
        </div>

        <Field label="Type SUSPEND to confirm">
          <input className={inputCls} placeholder="SUSPEND" />
        </Field>

        <CompactButtons
          secondaryLabel="Cancel"
          primaryLabel="Suspend Administrator"
          primaryCls="bg-[#D85A30] hover:bg-[#C2410C]"
          onSecondary={onClose}
          onPrimary={onClose}
        />
      </div>
    </ModalShell>
  )
}

export function DeleteModal({ onClose }) {
  return (
    <ModalShell width={582}>
      <div className="flex flex-col gap-6 p-8">
        <div className="flex flex-col items-center gap-4 pt-2 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-[20px] bg-[#FEE4E2]">
            <TrashIcon className="h-8 w-8" stroke="#D92D20" />
          </span>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold leading-6 text-[#111827]">Delete School?</h2>
            <p className="text-sm leading-[17px] text-[#6B7280]">
              This action <span className="text-[#D92D20]">cannot be undone</span>. All data associated with Covenant
              University will be permanently removed, including their activity history
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-[#FEF3F2] px-4 py-2.5">
          <WarningIcon className="h-4 w-4" stroke="#B42318" />
          <span className="text-[13px] leading-4 text-[#B42318]">Warning:</span>
        </div>

        <Field label="Type DELETE to confirm">
          <input className={inputCls} placeholder="DELETE" />
        </Field>

        <CompactButtons
          secondaryLabel="Cancel"
          primaryLabel="Delete Administrator"
          primaryCls="bg-[#D92D20] hover:bg-[#B42318]"
          onSecondary={onClose}
          onPrimary={onClose}
        />
      </div>
    </ModalShell>
  )
}

export function InstitutionsModal({ name = 'Dr. B. Akinola', onClose }) {
  return (
    <ModalShell width={582}>
      <div className="flex flex-col gap-6 p-8">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold leading-6 text-[#111827]">Institutions for {name}</h2>
            <p className="text-sm leading-[17px] text-[#6B7280]">
              Choose every institution this administrator may publish for. They cannot reach any others.
            </p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="mt-1 text-[#6B7280] hover:text-black">
            <CloseIcon />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {INSTITUTIONS.map((inst) => (
            <label
              key={inst}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#E5E7EB] px-4 py-3.5 text-sm leading-5 text-[#344054] hover:border-[#4F46E5]"
            >
              <input type="radio" name="institution" className="h-4 w-4 accent-[#4F46E5]" />
              {inst}
            </label>
          ))}
        </div>

        <CompactButtons secondaryLabel="Cancel" primaryLabel="Save association" onSecondary={onClose} onPrimary={onClose} />
      </div>
    </ModalShell>
  )
}
