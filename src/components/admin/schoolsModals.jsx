import { ModalShell, Field, inputCls, selectCls, SelectWrap } from './ui.jsx'
import { CloseIcon, SealCheckIcon } from './Icons.jsx'

const NGFlag = () => (
  <svg viewBox="0 0 21 12" className="h-3 w-5 overflow-hidden rounded-[2px]" aria-hidden="true">
    <rect width="7" height="12" fill="#008751" />
    <rect x="7" width="7" height="12" fill="#fff" />
    <rect x="14" width="7" height="12" fill="#008751" />
  </svg>
)

export function AddSchoolModal({ onClose, onSubmit }) {
  return (
    <ModalShell width={966}>
      <div className="flex flex-col gap-6 p-8">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold leading-6 text-[#111827]">Add a school</h2>
            <p className="text-sm leading-[17px] text-[#6B7280]">
              New schools start as Onboarding or Prospect and only serve content once activated.
            </p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="mt-1 text-[#6B7280] hover:text-black">
            <CloseIcon />
          </button>
        </div>

        <form className="flex flex-col gap-5" onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          const g = (k, d = '') => (fd.get(k) || '').trim() || d
          onSubmit?.({
            institutionName: g('institutionName', 'Covenant University'),
            shortName: g('shortName', 'CU'),
            type: fd.get('type') || 'Private university',
            contactEmail: g('contactEmail', 'covenantunil@gmail.com'),
            location: g('location', 'Ogun State'),
            contactPerson: g('contactPerson', 'Dr. B. Akinola'),
            phoneNumber: g('phoneNumber', '0805 xxx 2210'),
            status: fd.get('status') || 'Onboarding',
            rolloutScope: g('rolloutScope', ''),
            notes: g('notes', 'Agreement signed'),
          })
        }}>
          <Field label="Institution name">
            <input name="institutionName" className={inputCls} placeholder="e.g. Aisha" />
          </Field>

          <div className="flex flex-col gap-5 sm:flex-row">
            <Field label="Short name">
              <input name="shortName" className={inputCls} placeholder="e.g CU" />
            </Field>
            <Field label="Type">
              <SelectWrap>
                <select name="type" className={selectCls} defaultValue="Private university">
                  {['Private university', 'Federal university', 'State university', 'Polytechnic', 'College of Education', 'Others'].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </SelectWrap>
            </Field>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row">
            <Field label="Contact email">
              <input name="contactEmail" type="email" className={inputCls} placeholder="Enter email" />
            </Field>
            <Field label="Location">
              <input name="location" className={inputCls} placeholder="City, State" />
            </Field>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row">
            <Field label="Contact person" required={false}>
              <input name="contactPerson" className={inputCls} />
            </Field>
            <Field label="Phone Number" required={false}>
              <div className="flex gap-3">
                <button type="button" className="flex h-12 shrink-0 items-center gap-2 rounded-lg border border-[#D1D5DC] bg-white px-4">
                  <NGFlag />
                  <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="#6B7280" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m4 6 4 4 4-4" />
                  </svg>
                </button>
                <input name="phoneNumber" className={inputCls} placeholder="Enter phone number" />
              </div>
            </Field>
          </div>

          <Field label="Status" required={false}>
            <SelectWrap>
              <select className={selectCls} defaultValue="Onboarding">
                {['Onboarding', 'Prospect', 'Live', 'Deactivated'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </SelectWrap>
          </Field>

          <Field label="Rollout scope" required={false}>
            <input name="rolloutScope" className={inputCls} placeholder="e.g FOCIT" />
          </Field>

          <Field label="Notes" required={false}>
            <input name="notes" className={inputCls} placeholder="Internal notes" />
          </Field>

          <div className="mt-1 flex items-center justify-between border-t border-[#F3F4F6] pt-6">
            <button type="button" onClick={onClose} className="px-2 py-2 text-sm font-medium leading-5 text-[#374151] hover:text-black">
              Cancel
            </button>
            <button type="submit" className="flex h-12 items-center gap-2 rounded-lg bg-[#4F46E5] px-6 text-sm font-semibold leading-5 text-white hover:bg-[#4338CA]">
              Add school
              <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </ModalShell>
  )
}

export function SchoolSuccessModal({ onClose, school }) {
  const s = school || {}
  const rows = [
    ['Institution Name', s.institutionName || 'Convenant University'],
    ['Email', s.contactEmail || 'covenantunil@gmail.com'],
    ['Short Name', s.shortName || 'CU'],
    ['Type', s.type || 'Private University'],
    ['Location', s.location || 'Ogun State'],
    ['Status', s.status || 'Onboarding', 'text-[#109E75]'],
    ['Added on', s.addedAt ? new Date(s.addedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Aug 27, 2026 · 3:15 PM'],
  ]
  return (
    <ModalShell width={582}>
      <div className="flex flex-col gap-6 p-8">
        <div className="flex flex-col items-center gap-3 pt-2 text-center">
          <SealCheckIcon className="h-24 w-24" />
          <h2 className="text-xl font-semibold leading-6 text-[#111827]">School Added Successfully</h2>
          <p className="text-sm leading-[17px] text-[#6B7280]">
            {s.institutionName || 'Covenant University'} has been successfully added to the system.
          </p>
        </div>

        <div className="flex flex-col rounded-[10px] bg-[#F9FAFB] px-4">
          {rows.map(([k, v, cls]) => (
            <div key={k} className="flex min-h-[42px] items-center justify-between border-t border-[#F3F4F6] py-2.5 first:border-t-0">
              <span className="text-[13px] leading-4 text-[#6B7280]">{k}</span>
              <span className={`text-[13px] font-semibold leading-4 ${cls || 'text-[#111827]'}`}>{v}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button type="button" onClick={onClose} className="h-11 rounded-lg border border-[#E5E7EB] bg-white px-7 text-sm font-medium leading-5 text-[#374151] hover:bg-[#F9FAFB]">
            Close
          </button>
          <button type="button" onClick={onClose} className="h-11 rounded-lg bg-[#4F46E5] px-6 text-sm font-semibold leading-5 text-white hover:bg-[#4338CA]">
            Back to School Management
          </button>
        </div>
      </div>
    </ModalShell>
  )
}
