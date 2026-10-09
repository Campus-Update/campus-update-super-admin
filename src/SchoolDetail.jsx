import { useMemo, useState } from "react";
import { ADMINS } from "./SchoolAdministrator.jsx";
import { SCHOOLS } from "./Schools.jsx";
import Sidebar from "./components/admin/Sidebar.jsx";
import Topbar from "./components/admin/Topbar.jsx";

const formatCount = (value) =>
  value == null ? "00" : String(value).padStart(2, "0");

const getInstitutionCode = (school) => {
  const name = school.name.toLowerCase();
  if (name.includes("lead city")) return "LCU";
  if (name.includes("university of ibadan")) return "UI";
  if (name.includes("obafemi")) return "OAU";
  return (school.shortName || school.initials).toUpperCase();
};

export default function SchoolDetailPage({ schoolId }) {
  const [school, setSchool] = useState(() => {
    const deletedIds = JSON.parse(
      window.sessionStorage.getItem("campus-update-deleted-school-ids") || "[]",
    );
    if (deletedIds.includes(schoolId)) return null;
    const storedSchool = window.sessionStorage.getItem(
      `campus-update-school-${schoolId}`,
    );
    if (storedSchool) return JSON.parse(storedSchool);
    return SCHOOLS.find((item) => item.id === schoolId);
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [confirmationMode, setConfirmationMode] = useState(null);
  const [deactivationReason, setDeactivationReason] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const saveSchool = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const location = formData.get("location").trim();
    const status = formData.get("status");
    const updatedSchool = {
      ...school,
      name: formData.get("institutionName").trim(),
      shortName: formData.get("shortName").trim(),
      initials: formData.get("shortName").trim().toUpperCase(),
      type: formData.get("type"),
      contactEmail: formData.get("contactEmail").trim(),
      location,
      contactPerson: formData.get("contactPerson").trim(),
      phoneCountryCode: formData.get("phoneCountryCode"),
      phoneNumber: formData.get("phoneNumber").trim(),
      status,
      place: `${location} · ${status}`,
    };

    persistSchool(updatedSchool);
    setIsEditOpen(false);
  };

  const persistSchool = (updatedSchool) => {
    window.sessionStorage.setItem(
      `campus-update-school-${schoolId}`,
      JSON.stringify(updatedSchool),
    );
    const savedIds = JSON.parse(
      window.sessionStorage.getItem("campus-update-school-ids") || "[]",
    );
    window.sessionStorage.setItem(
      "campus-update-school-ids",
      JSON.stringify([...new Set([...savedIds, schoolId])]),
    );
    setSchool(updatedSchool);
  };

  const deactivateSchool = (event) => {
    event.preventDefault();
    const updatedSchool = {
      ...school,
      previousStatus: school.status,
      status: "Deactivated",
      place: `${location} · Deactivated`,
      deactivationReason: deactivationReason.trim(),
    };
    persistSchool(updatedSchool);
    setConfirmationMode(null);
    setDeactivationReason("");
  };

  const deleteSchool = (event) => {
    event.preventDefault();
    if (deleteConfirmation !== "DELETE") return;
    const deletedIds = JSON.parse(
      window.sessionStorage.getItem("campus-update-deleted-school-ids") || "[]",
    );
    window.sessionStorage.setItem(
      "campus-update-deleted-school-ids",
      JSON.stringify([...new Set([...deletedIds, schoolId])]),
    );
    window.location.href = "/schools";
  };

  const closeConfirmation = () => {
    setConfirmationMode(null);
    setDeactivationReason("");
    setDeleteConfirmation("");
  };

  const schoolAdmins = useMemo(() => {
    if (!school) return [];
    const institutionCode = getInstitutionCode(school);
    return ADMINS.filter((admin) => admin.inst === institutionCode);
  }, [school]);

  if (!school) {
    return (
      <div className="cu-app sd-app">
        <style>{CSS}</style>
        <Sidebar activeItem="Schools" />
        <main className="cu-main">
          <Topbar title="School not found" subtitle="This school is unavailable" />
          <a className="sd-back-link" href="/schools">
            Back to Schools
          </a>
        </main>
      </div>
    );
  }

  const location =
    school.location || school.place.split("·")[0].trim() || "—";
  const addedDate = school.addedAt
    ? new Date(school.addedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "20 Sep 2026";
  const addedDateTime = school.addedAt
    ? new Date(school.addedAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : `${addedDate}, 17:20`;
  const info = [
    ["Name", school.name],
    ["Short name", school.shortName || school.initials],
    ["Type", school.type || "—"],
    ["Location", location],
    ["Contact", school.contactPerson || "—"],
    ["Email", school.contactEmail || "—"],
    [
      "Phone",
      school.phoneNumber
        ? `${school.phoneCountryCode || ""} ${school.phoneNumber}`.trim()
        : "—",
    ],
    ["Rollout scope", school.rolloutScope || "—"],
    ["Notes", school.notes || "—"],
    ["On platform since", addedDate],
  ];
  const auditRows = [
    ...schoolAdmins.slice(0, 1).map((admin) => ({
      action: "Added administrator",
      details: `${admin.name} · ${admin.role} · ${school.name}`,
    })),
    ...(school.deactivationReason
      ? [
          {
            action: "Deactivated school",
            details: school.deactivationReason,
          },
        ]
      : []),
    {
      action: "Added school",
      details: `${school.name} · ${school.previousStatus || school.status}`,
    },
  ];

  return (
    <div className="cu-app sd-app">
      <style>{CSS}</style>
      <Sidebar activeItem="Schools" />
      <main className="cu-main sd-main">
        <Topbar
          title="Schools"
          subtitle="Add, edit and activate institutions"
        />

        <nav className="sd-breadcrumb" aria-label="Breadcrumb">
          <a href="/schools">School</a>
          <span aria-hidden="true">›</span>
          <span>{school.name}</span>
        </nav>

        <section className="sd-heading-card">
          <div className="sd-school-title">
            <h2>{school.name}</h2>
            <span className={`sd-status sd-status-${school.status.toLowerCase()}`}>
              <i />
              {school.status}
            </span>
          </div>
          <div className="sd-actions">
            <button type="button" onClick={() => setIsEditOpen(true)}>
              <span aria-hidden="true">✎</span> Edit School
            </button>
            <button
              type="button"
              onClick={() => setConfirmationMode("deactivate")}
            >
              <span aria-hidden="true">⊖</span> Deactivate
            </button>
            <button
              type="button"
              className="sd-delete"
              onClick={() => setConfirmationMode("delete")}
            >
              <span aria-hidden="true">⊗</span> Delete
            </button>
          </div>
        </section>

        <section className="sd-stats" aria-label="School statistics">
          {[
            ["Students", school.students],
            ["Staff", school.staff],
            ["Administrators", schoolAdmins.length || school.admins || 0],
            ["Weekly active", 0],
            ["Content items", school.content],
          ].map(([label, value]) => (
            <article className="sd-stat" key={label}>
              <h3>{label}</h3>
              <strong>{formatCount(value)}</strong>
              <span>
                {label === "Weekly active"
                  ? "0% of registered"
                  : label === "Administrators"
                    ? "Serving content to students"
                    : label === "Content items"
                      ? "Content hidden"
                      : "On the platform"}
              </span>
            </article>
          ))}
        </section>

        <div className="sd-detail-grid">
          <section
            className="sd-card sd-information"
            id="institution-information"
          >
            <h3>
              <span aria-hidden="true">♧</span> Institution Information
            </h3>
            <dl>
              {info.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="sd-card sd-admins" id="school-administrators">
            <header className="sd-card-heading">
              <h3>
                <span aria-hidden="true">♧</span> Administrators
              </h3>
              <a href="/school-administrators">Manage</a>
            </header>
            <div className="sd-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roles</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {schoolAdmins.length ? (
                    schoolAdmins.slice(0, 3).map((admin) => (
                      <tr key={admin.id}>
                        <td>
                          <div className="sd-admin-person">
                            <span>{admin.initials}</span>
                            <div>
                              <b>{admin.name}</b>
                              <small>{admin.email}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="sd-role">{admin.role}</span>
                        </td>
                        <td>
                          <span className="sd-active">{admin.status}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="sd-empty">
                        No administrators assigned yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="sd-mini-pagination">
              <span>
                Showing {schoolAdmins.length ? 1 : 0}-{schoolAdmins.length} of{" "}
                {schoolAdmins.length} results
              </span>
              <select aria-label="Administrators per page" defaultValue="48">
                <option value="48">48 per page</option>
              </select>
              <div>
                <button type="button" aria-label="Previous administrators" disabled>
                  ‹
                </button>
                <button type="button" className="sd-page-current">
                  1
                </button>
                <button type="button" aria-label="Next administrators" disabled>
                  ›
                </button>
              </div>
            </div>
          </section>
        </div>

        <section className="sd-card sd-content" id="school-content">
          <header className="sd-card-heading">
            <h3>Content</h3>
            <a href="#school-content">Monitor all</a>
          </header>
          <div className="sd-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Content</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th className="sd-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="sd-content-empty">
                    Nothing published yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="sd-card sd-audit" id="school-audit">
          <header className="sd-card-heading">
            <h3>Audit history for this school</h3>
            <a href="#school-audit">Full log</a>
          </header>
          <div className="sd-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date &amp; time</th>
                  <th>Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {auditRows.map((row, index) => (
                  <tr key={`${row.action}-${index}`}>
                    <td>{addedDateTime}</td>
                    <td>{row.action}</td>
                    <td>{row.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      {isEditOpen && (
        <div
          className="sd-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsEditOpen(false);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsEditOpen(false);
          }}
        >
          <section
            className="sd-edit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sd-edit-school-title"
          >
            <header className="sd-edit-header">
              <div>
                <h2 id="sd-edit-school-title">Edit School</h2>
                <p>Update school details</p>
              </div>
              <button
                type="button"
                className="sd-edit-close"
                onClick={() => setIsEditOpen(false)}
                aria-label="Close edit school form"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </header>
            <form className="sd-edit-form" onSubmit={saveSchool}>
              <label className="sd-edit-field sd-edit-full">
                <span>
                  Institution name <i>*</i>
                </span>
                <input
                  name="institutionName"
                  placeholder="e.g. Aisha"
                  defaultValue={school.name}
                  required
                  autoFocus
                />
              </label>
              <label className="sd-edit-field">
                <span>
                  Short name <i>*</i>
                </span>
                <input
                  name="shortName"
                  placeholder="e.g CU"
                  defaultValue={school.shortName || school.initials}
                  required
                />
              </label>
              <label className="sd-edit-field">
                <span>
                  Type <i>*</i>
                </span>
                <select
                  name="type"
                  defaultValue={school.type || "Private university"}
                  required
                >
                  <option>Private university</option>
                  <option>Public university</option>
                  <option>Polytechnic</option>
                  <option>College of education</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="sd-edit-field">
                <span>
                  Contact email <i>*</i>
                </span>
                <input
                  name="contactEmail"
                  type="email"
                  placeholder="Enter email"
                  defaultValue={school.contactEmail || ""}
                  required
                />
              </label>
              <label className="sd-edit-field">
                <span>
                  Location <i>*</i>
                </span>
                <input
                  name="location"
                  placeholder="City, State"
                  defaultValue={location}
                  required
                />
              </label>
              <label className="sd-edit-field sd-edit-contact">
                <span>Contact person</span>
                <input
                  name="contactPerson"
                  defaultValue={school.contactPerson || ""}
                />
              </label>
              <label className="sd-edit-field sd-edit-phone-label">
                <span>Phone Number</span>
                <div className="sd-edit-phone">
                  <select
                    name="phoneCountryCode"
                    aria-label="Phone country code"
                    defaultValue={school.phoneCountryCode || "+234"}
                  >
                    <option value="+234">🇳🇬</option>
                    <option value="+1">🇺🇸</option>
                    <option value="+44">🇬🇧</option>
                    <option value="+233">🇬🇭</option>
                  </select>
                  <input
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter phone number"
                    defaultValue={school.phoneNumber || ""}
                  />
                </div>
              </label>
              <label className="sd-edit-field sd-edit-full">
                <span>Status</span>
                <select name="status" defaultValue={school.status}>
                  <option>Onboarding</option>
                  <option>Prospect</option>
                  <option>Live</option>
                  <option>Paused</option>
                  <option>Deactivated</option>
                </select>
              </label>
              <footer className="sd-edit-footer">
                <button
                  type="button"
                  className="sd-edit-cancel"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sd-edit-save">
                  Save Changes
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
      {confirmationMode && (
        <div
          className="sd-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeConfirmation();
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") closeConfirmation();
          }}
        >
          <section
            className={`sd-confirm-modal sd-confirm-${confirmationMode}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sd-confirm-title"
          >
            {confirmationMode === "deactivate" ? (
              <form onSubmit={deactivateSchool}>
                <div className="sd-confirm-symbol sd-deactivate-symbol">
                  <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <path
                      d="M40 2c5 0 8 6 13 7s11-2 15 2 1 10 4 15 8 7 8 14-5 10-8 15 0 11-4 15-10 1-15 4-8 8-13 8-8-6-13-8-11 2-15-2-1-10-4-15S0 50 0 40s5-10 8-15 0-11 4-15 10-1 15-4 8-4 13-4Z"
                      fill="#FFFAE9"
                    />
                    <path
                      d="m28 50 10-18a4 4 0 0 1 7 0l10 18a4 4 0 0 1-3.5 6h-20a4 4 0 0 1-3.5-6Z"
                      stroke="#E4572E"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M40 39v7m0 4h.01"
                      stroke="#E4572E"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h2 id="sd-confirm-title">Deactivate School?</h2>
                <p className="sd-confirm-description">
                  Are you sure you want to deactivate <b>{school.name}</b>? They
                  will lose access to the platform immediately but their data
                  will be preserved.
                </p>
                <dl className="sd-confirm-details">
                  {[
                    ["Institution Name", school.name],
                    ["Email", school.contactEmail || "—"],
                    ["Short Name", school.shortName || school.initials],
                    ["Type", school.type || "—"],
                    ["Location", location],
                    ["Status", school.status],
                    ["Added on", addedDateTime],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd className={label === "Status" ? "sd-current-status" : ""}>
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <label className="sd-confirm-reason">
                  <span>
                    Reason for Deactivation <i>*</i>
                  </span>
                  <textarea
                    value={deactivationReason}
                    onChange={(event) => setDeactivationReason(event.target.value)}
                    placeholder="Enter reason for deactivation..."
                    required
                  />
                </label>
                <footer className="sd-confirm-footer">
                  <button
                    type="button"
                    className="sd-confirm-cancel"
                    onClick={closeConfirmation}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="sd-deactivate-submit">
                    Deactivate School
                  </button>
                </footer>
              </form>
            ) : (
              <form onSubmit={deleteSchool}>
                <div className="sd-confirm-symbol sd-delete-symbol">
                  <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
                    <path
                      d="M40 2c5 0 8 6 13 7s11-2 15 2 1 10 4 15 8 7 8 14-5 10-8 15 0 11-4 15-10 1-15 4-8 8-13 8-8-6-13-8-11 2-15-2-1-10-4-15S0 50 0 40s5-10 8-15 0-11 4-15 10-1 15-4 8-4 13-4Z"
                      fill="#FFF0F0"
                    />
                    <path
                      d="M28 34h24l-2 24H30l-2-24Zm-4-4h32m-22 0v-5a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v5m-11 9v12m7-12v12"
                      stroke="#EF4444"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 id="sd-confirm-title">Delete School?</h2>
                <p className="sd-confirm-description">
                  This action <b className="sd-cannot-undo">cannot be undone.</b>{" "}
                  All data associated with <b>{school.name}</b> will be
                  permanently removed, including their activity history.
                </p>
                <div className="sd-delete-warning">
                  <b aria-hidden="true">⚠</b>
                  <span>Warning:</span>
                </div>
                <label className="sd-confirm-reason sd-delete-confirmation">
                  <span>
                    Type DELETE to confirm <i>*</i>
                  </span>
                  <input
                    value={deleteConfirmation}
                    onChange={(event) => setDeleteConfirmation(event.target.value)}
                    placeholder="DELETE"
                    required
                  />
                </label>
                <footer className="sd-confirm-footer">
                  <button
                    type="button"
                    className="sd-confirm-cancel"
                    onClick={closeConfirmation}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="sd-delete-submit"
                    disabled={deleteConfirmation !== "DELETE"}
                  >
                    Delete School
                  </button>
                </footer>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

const CSS = `
.sd-app{--bg:#f4f4f5;--panel:#fff;--soft:#fafafa;--text:#18181b;--muted:#71717a;--line:#e4e4e7;--brand:#4f46e5;--green:#059669;display:grid;grid-template-columns:180px minmax(0,1fr);gap:12px;padding:3px;min-height:100vh;background:var(--bg);color:var(--text);font-family:Inter,system-ui,sans-serif;font-size:9px;box-sizing:border-box}
.sd-app *{box-sizing:border-box}
.sd-app button,.sd-app input,.sd-app select{font:inherit;color:inherit}
.sd-app button{cursor:pointer}
.sd-app :focus-visible{outline:2px solid var(--brand);outline-offset:2px}
.sd-app .cu-main{display:flex;flex-direction:column;gap:8px;min-width:0}
.sd-app .cu-side{background:#fff;border-radius:6px;padding:14px;display:flex;flex-direction:column;position:sticky;top:3px;height:calc(100vh - 6px);overflow:auto}
.sd-app .cu-side .cu-logo{display:flex;align-items:center;gap:4px;font-size:14px;font-weight:600;margin:0 0 10px}
.sd-app .cu-side .cu-logo-mark{width:24px;height:24px;background-color:#4f46e5}
.sd-app .cu-side .cu-nav{display:flex;align-items:center;width:100%;text-align:left;background:transparent;border:0}
.sd-app .cu-side .cu-nav:hover{background:#fafafa}
.sd-app .cu-side .cu-nav.on{background:#e0e7ff;color:#4f46e5}
.sd-app .cu-side .cu-pub{padding:8px;border-radius:9px;margin-bottom:10px}
.sd-app .cu-side .cu-pub-in{display:flex;align-items:center;gap:6px;padding:6px;border-radius:6px}
.sd-app .cu-side .cu-pub-in div{min-width:0}
.sd-app .cu-side .cu-pub-in small{font-size:7px}
.sd-app .cu-side .cu-pub-in b{font-size:8px}
.sd-app .cu-side .cu-grp{font-size:7px;margin:12px 0 4px}
.sd-app .cu-side .cu-nav{gap:8px;padding:6px;border-radius:6px;font-size:9px}
.sd-app .cu-side .cu-nav svg{width:13px;height:13px}
.sd-main{gap:8px;min-width:0}
.sd-main .cu-top{display:flex;align-items:center;min-height:56px;padding:8px 14px;border-radius:6px;background:#fff;gap:10px}
.sd-main .cu-top h1{font-size:14px}
.sd-main .cu-top p{font-size:9px}
.sd-main .cu-bell{width:32px;height:32px}
.sd-main .cu-bell svg{width:18px;height:18px}
.sd-main .cu-user{display:flex;align-items:center;gap:7px;padding:4px 10px 4px 4px}
.sd-main .cu-av{width:24px;height:24px;border-radius:50%;object-fit:cover}
.sd-main .cu-user b{font-size:9px}
.sd-main .cu-user small{font-size:7px}
.sd-main .cu-user svg{width:14px;height:14px}
.sd-breadcrumb{display:flex;align-items:center;gap:8px;min-height:22px;padding:0 24px;color:#52525b}
.sd-breadcrumb a,.sd-card-heading a{color:#4f46e5;text-decoration:none}
.sd-heading-card{min-height:47px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 14px 8px 12px;border:1px solid #e4e4e7;border-radius:8px;background:#fff}
.sd-school-title{display:flex;align-items:center;gap:10px;min-width:0}
.sd-school-title h2{margin:0;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sd-status{display:inline-flex;align-items:center;gap:4px;padding:3px 7px;border-radius:20px;background:#ecfdf5;color:#059669;font-size:8px;white-space:nowrap}
.sd-status i{width:5px;height:5px;border-radius:50%;background:currentColor}
.sd-status-prospect,.sd-status-paused{background:#fef3c7;color:#b45309}
.sd-actions{display:flex;align-items:center;gap:8px;flex:none}
.sd-actions button{display:flex;align-items:center;gap:5px;height:28px;padding:0 10px;border:1px solid #e4e4e7;border-radius:5px;background:#fff;font-size:8px;white-space:nowrap}
.sd-actions .sd-delete{border-color:#fee2e2;background:#fff1f2;color:#dc2626}
.sd-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}
.sd-stat{min-width:0;min-height:97px;padding:12px 15px;border-radius:10px;background:#fff}
.sd-stat h3{margin:0 0 16px;font-size:10px;font-weight:500}
.sd-stat strong{display:block;margin-bottom:8px;font-size:20px;font-weight:400;line-height:1}
.sd-stat span{color:#71717a;font-size:8px}
.sd-detail-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px;align-items:start}
.sd-card{min-width:0;padding:12px 14px;border-radius:8px;background:#fff}
.sd-card h3{margin:0;color:#18181b;font-size:9px;font-weight:600}
.sd-card-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px}
.sd-card-heading a{font-size:8px;font-weight:500}
.sd-card-heading h3 span,.sd-information h3 span{margin-right:5px;color:#4f46e5}
.sd-information h3{padding-bottom:9px;border-bottom:1px solid #f1f1f3;color:#312e81}
.sd-information dl{margin:7px 0 0}
.sd-information dl div{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:17px}
.sd-information dt{color:#71717a}
.sd-information dd{margin:0;color:#27272a;text-align:right}
.sd-table-scroll{overflow-x:auto}
.sd-card table{width:100%;border-collapse:collapse}
.sd-card th{padding:6px 7px;border-bottom:1px solid #e4e4e7;background:#fafafa;color:#71717a;text-align:left;text-transform:uppercase;font-size:6px;font-weight:500;white-space:nowrap}
.sd-card td{padding:7px;border-bottom:1px solid #f1f1f3;font-size:7px;vertical-align:middle}
.sd-admin-person{display:flex;align-items:center;gap:6px;min-width:120px}
.sd-admin-person>span{display:grid;width:20px;height:20px;flex:none;place-items:center;border-radius:50%;background:#e0e7ff;color:#4f46e5;font-size:7px}
.sd-admin-person b,.sd-admin-person small{display:block;white-space:nowrap}
.sd-admin-person b{font-size:7px;font-weight:600}
.sd-admin-person small{margin-top:2px;color:#71717a;font-size:6px}
.sd-role,.sd-active{display:inline-block;border-radius:12px;background:#ecfdf5;padding:3px 6px;color:#059669;font-size:6px;white-space:nowrap}
.sd-active{padding:3px 7px}
.sd-empty{text-align:center;color:#71717a}
.sd-mini-pagination{display:flex;align-items:center;justify-content:space-between;gap:5px;padding-top:7px;color:#71717a;font-size:6px}
.sd-mini-pagination select{height:22px;border:1px solid #e4e4e7;border-radius:4px;background:#fff;font-size:6px}
.sd-mini-pagination>div{display:flex;gap:3px}
.sd-mini-pagination button{width:18px;height:18px;border:1px solid #e4e4e7;border-radius:4px;background:#fff;font-size:7px}
.sd-mini-pagination button:disabled{opacity:.45}
.sd-mini-pagination .sd-page-current{border-color:#4f46e5;background:#4f46e5;color:#fff}
.sd-content-empty{text-align:center;height:50px}
.sd-right{text-align:right!important}
.sd-audit tbody tr:nth-child(odd){background:#fafafa}
.sd-back-link{display:inline-block;padding:12px 24px;color:#4f46e5}
.sd-modal-backdrop{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:20px;background:rgba(24,24,27,.24);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
.sd-edit-modal{width:min(916px,100%);max-height:calc(100vh - 40px);overflow-y:auto;padding:32px;border-radius:16px;background:#fff;color:#27272a;box-shadow:0 18px 50px rgba(24,24,27,.2)}
.sd-edit-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px}
.sd-edit-header h2{margin:0 0 6px;font-size:23px;font-weight:600;line-height:1.3}
.sd-edit-header p{margin:0;color:#71717a;font-size:14px}
.sd-edit-close{display:grid;width:28px;height:28px;place-items:center;padding:0;border:0;background:transparent;color:#52525b}
.sd-edit-close svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round}
.sd-edit-form{display:grid;grid-template-columns:1fr 1fr;column-gap:16px;row-gap:14px}
.sd-edit-full{grid-column:1/-1}
.sd-edit-field{display:flex;min-width:0;flex-direction:column;gap:7px}
.sd-edit-field>span{color:#3f3f46;font-size:13px;font-weight:500}
.sd-edit-field>span i{color:#ef4444;font-style:normal}
.sd-edit-field input,.sd-edit-field select{width:100%;height:60px;min-width:0;padding:0 24px;border:1px solid #d4d4d8;border-radius:10px;background:#fff;color:#52525b;font-size:14px}
.sd-edit-field input::placeholder{color:#71717a;opacity:1}
.sd-edit-field select{padding-right:14px}
.sd-edit-contact{grid-column:1;grid-row:4}
.sd-edit-phone-label{grid-column:2;grid-row:4}
.sd-edit-phone{display:grid;grid-template-columns:118px minmax(0,1fr);gap:12px;min-width:0}
.sd-edit-phone select{padding:0 18px;font-size:20px}
.sd-edit-footer{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;margin-top:4px;padding-top:22px;border-top:1px solid #f1f1f3}
.sd-edit-footer button{height:58px;border-radius:9px;padding:0 26px;font-size:14px;font-weight:500}
.sd-edit-cancel{border:0;background:#fff;color:#52525b}
.sd-edit-save{border:0;background:#4f46e5;color:#fff}
.sd-confirm-modal{width:min(726px,100%);max-height:calc(100vh - 40px);overflow-y:auto;padding:30px 42px 24px;border-radius:16px;background:#fff;color:#27272a;box-shadow:0 18px 50px rgba(24,24,27,.2)}
.sd-confirm-modal form{display:flex;flex-direction:column}
.sd-confirm-symbol{width:190px;height:190px;margin:0 auto 30px}
.sd-confirm-symbol svg{display:block;width:100%;height:100%}
.sd-confirm-modal h2{margin:0;text-align:center;font-size:31px;font-weight:700;line-height:1.25}
.sd-confirm-description{margin:14px 0 28px;color:#666;font-size:19px;line-height:1.55;text-align:center}
.sd-confirm-description b{color:#333;font-weight:700}
.sd-confirm-details{margin:0 0 32px;padding:10px 22px;border:1px solid #e5e7eb;border-radius:15px;background:#f9fafb}
.sd-confirm-details div{display:flex;align-items:center;justify-content:space-between;gap:14px;min-height:58px;border-bottom:1px solid #e5e7eb}
.sd-confirm-details div:last-child{border-bottom:0}
.sd-confirm-details dt,.sd-confirm-details dd{margin:0;font-size:17px;line-height:1.4}
.sd-confirm-details dt{color:#858585;white-space:nowrap}
.sd-confirm-details dd{color:#17203b;font-weight:600;text-align:right;overflow-wrap:anywhere}
.sd-confirm-details .sd-current-status{color:#16a34a}
.sd-confirm-reason{display:flex;flex-direction:column;gap:10px;margin-bottom:30px}
.sd-confirm-reason>span{font-size:17px;font-weight:500}
.sd-confirm-reason>span i{color:#e4572e;font-style:normal}
.sd-confirm-reason textarea{width:100%;height:126px;resize:vertical;padding:18px 22px;border:1px solid #c9c9c9;border-radius:13px;background:#fff;font-size:18px}
.sd-confirm-reason textarea::placeholder,.sd-confirm-reason input::placeholder{color:#777;opacity:1}
.sd-confirm-footer{display:flex;align-items:center;justify-content:space-between;gap:14px;padding-top:30px;border-top:1px solid #e5e7eb}
.sd-confirm-footer button{height:70px;padding:0 38px;border-radius:13px;font-size:19px;font-weight:600}
.sd-confirm-cancel{min-width:154px;border:1px solid #e5e7eb;background:#fff;color:#525252}
.sd-deactivate-submit{border:0;background:#e4572e;color:#fff}
.sd-confirm-delete .sd-confirm-symbol{margin-bottom:30px}
.sd-delete-warning{display:flex;align-items:center;gap:16px;min-height:70px;margin-bottom:32px;padding:0 22px;border:1px solid #ffd7d7;border-radius:13px;background:#fff2f2;color:#ef4444;font-size:17px}
.sd-delete-warning b{font-size:24px}
.sd-cannot-undo{color:#ef4444!important}
.sd-delete-confirmation{margin-bottom:32px}
.sd-delete-confirmation input{width:100%;height:76px;padding:0 32px;border:1px solid #c9c9c9;border-radius:13px;background:#fff;font-size:20px}
.sd-delete-submit{border:0;background:#ef4444;color:#fff}
.sd-delete-submit:disabled{cursor:not-allowed;opacity:.5}
@media(max-width:1000px){.sd-app{grid-template-columns:160px minmax(0,1fr)}.sd-stats{gap:7px}.sd-stat{padding:10px}}
@media(max-width:760px){.sd-app{grid-template-columns:1fr}.sd-side{position:static;height:auto}.sd-detail-grid{grid-template-columns:1fr}.sd-main .cu-user div,.sd-main .cu-user svg{display:none}.sd-main .cu-user{padding:4px}.sd-breadcrumb{padding:0 4px}.sd-heading-card{align-items:flex-start;flex-direction:column}.sd-actions{flex-wrap:wrap}.sd-stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:420px){.sd-stats{grid-template-columns:1fr}.sd-school-title h2{white-space:normal}}
@media(max-width:600px){.sd-modal-backdrop{padding:10px}.sd-edit-modal{max-height:calc(100vh - 20px);padding:20px}.sd-edit-form{grid-template-columns:1fr}.sd-edit-full,.sd-edit-contact,.sd-edit-phone-label,.sd-edit-footer{grid-column:1;grid-row:auto}.sd-edit-field input,.sd-edit-field select{height:48px}.sd-edit-phone{grid-template-columns:88px minmax(0,1fr)}.sd-edit-footer button{height:46px;padding:0 18px}}
@media(max-width:600px){.sd-confirm-modal{max-height:calc(100vh - 20px);padding:22px 18px 18px}.sd-confirm-symbol{width:116px;height:116px;margin-bottom:18px}.sd-confirm-modal h2{font-size:23px}.sd-confirm-description{margin:10px 0 18px;font-size:14px}.sd-confirm-details{margin-bottom:20px;padding:6px 12px}.sd-confirm-details div{min-height:43px}.sd-confirm-details dt,.sd-confirm-details dd{font-size:12px}.sd-confirm-reason{margin-bottom:18px}.sd-confirm-reason>span{font-size:13px}.sd-confirm-reason textarea{height:96px;padding:13px;font-size:14px}.sd-confirm-footer{padding-top:18px}.sd-confirm-footer button{height:48px;padding:0 16px;font-size:13px}.sd-confirm-cancel{min-width:90px}.sd-delete-warning{min-height:50px;margin-bottom:20px;padding:0 14px;font-size:13px}.sd-delete-confirmation input{height:56px;padding:0 18px;font-size:16px}}
`;
