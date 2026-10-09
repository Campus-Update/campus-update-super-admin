import React, { useMemo, useState } from "react";
import Sidebar from "./components/admin/Sidebar.jsx";
import Topbar from "./components/admin/Topbar.jsx";

/* ---------- data (replace with your API) ---------- */
export const ADMINS = [
  {
    id: 1,
    initials: "LU",
    name: "Dr. O. Eboreime",
    email: "o.eboreime@leadcity.example",
    role: "Faculty administrator",
    inst: "LCU",
    scope: "FOCIT · news, events, announcements",
    status: "Active",
    last: "59 min ago",
  },
  {
    id: 2,
    initials: "UI",
    name: "M. Athar",
    email: "m.athar@leadcity.example",
    role: "Department administrator",
    inst: "LCU",
    scope: "Computer Science · announcements only",
    status: "Active",
    last: "1 hour ago",
  },
  {
    id: 3,
    initials: "UL",
    name: "Registrar’s Office",
    email: "registrar@leadcity.example",
    role: "Institution administrator",
    inst: "UI",
    scope: "Full publishing rights, institution-wide",
    status: "Active",
    last: "2 hours ago",
  },
  {
    id: 4,
    initials: "OU",
    name: "Examinations Office",
    email: "exams@leadcity.example",
    role: "Department administrator",
    inst: "UI",
    scope: "FOCIT · announcements and calendar",
    status: "Active",
    last: "1 hour ago",
  },
  {
    id: 5,
    initials: "OU",
    name: "Dr. B. Akinola",
    email: "b.akinola@ui.example",
    role: "Institution administrator",
    inst: "OAU",
    scope: "Full publishing rights, institution-wide",
    status: "Active",
    last: "Not signed in yet",
  },
  {
    id: 6,
    initials: "OU",
    name: "Prof. K. Adeyemi",
    email: "k.adeyemi@oau.example",
    role: "Institution administrator",
    inst: "OAU",
    scope: "Full publishing rights, institution-wide",
    status: "Active",
    last: "12 days ago",
  },
  {
    id: 7,
    initials: "OU",
    name: "T. Ojo",
    email: "t.ojo@oau.example",
    role: "Institution administrator",
    inst: "OAU",
    scope: "Technology · news and announcements",
    status: "Active",
    last: "25 Mar",
  },
  ...[8, 9, 10].map((id) => ({
    id,
    initials: "OU",
    name: "T. Ojo",
    email: "t.ojo@oau.example",
    role: "Faculty administrator",
    inst: "4",
    scope: "Technology · news and announcements",
    status: "Active",
    last: "25 Mar",
  })),
];

const SUMMARY = [
  ["School administrators", "07", "+118 this week"],
  ["Active", "06", "Can sign in and publish"],
  ["Deactivated", "01", "Cannot sign in"],
  ["Schools without an admin", "03", "Live or onboarding"],
];
const CHIPS = [
  { key: "All", label: "Total:", n: "24" },
  { key: "Active", label: "Active", n: "21", dot: "#16a34a" },
  { key: "Deactivated", label: "Deactivated", n: "03", dot: "#d97706" },
];
/* ---------- icons ---------- */
const Svg = ({ children, size = 22, sw = 1.6 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);
/* ---------- page ---------- */
export default function SchoolAdministratorsPage() {
  const [admins, setAdmins] = useState(ADMINS);
  const [q, setQ] = useState("");
  const [inst, setInst] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState({ key: null, dir: 1 });
  const [page, setPage] = useState(1);
  const [per, setPer] = useState(48);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [addedAdmin, setAddedAdmin] = useState(null);

  const institutions = useMemo(
    () => [...new Set(ADMINS.map((a) => a.inst))],
    [],
  );

  const rows = useMemo(() => {
    let r = admins.filter(
      (a) =>
        (status === "All" || a.status === status) &&
        (inst === "All" || a.inst === inst) &&
        `${a.name} ${a.email} ${a.role} ${a.scope}`
          .toLowerCase()
          .includes(q.toLowerCase()),
    );
    if (sort.key)
      r = [...r].sort(
        (a, b) =>
          (a[sort.key] > b[sort.key] ? 1 : a[sort.key] < b[sort.key] ? -1 : 0) *
          sort.dir,
      );
    return r;
  }, [admins, q, inst, status, sort]);

  const pages = Math.max(1, Math.ceil(rows.length / per));
  const cur = Math.min(page, pages);
  const shown = rows.slice((cur - 1) * per, cur * per);
  const reset = (fn) => (e) => {
    fn(e.target.value);
    setPage(1);
  };
  const clear = () => {
    setQ("");
    setInst("All");
    setStatus("All");
    setSort({ key: null, dir: 1 });
    setPage(1);
  };
  const sortBy = (key) =>
    setSort((s) => ({ key, dir: s.key === key ? -s.dir : 1 }));
  const closeAddAdmin = () => {
    setIsAddAdminOpen(false);
    setAddedAdmin(null);
  };
  const addAdministrator = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("firstName").trim();
    const lastName = formData.get("lastName").trim();
    const name = `${firstName} ${lastName}`;
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    const newAdmin = {
      id: Math.max(0, ...admins.map((admin) => admin.id)) + 1,
      initials,
      name,
      email: formData.get("email").trim(),
      role: formData.get("role"),
      inst: formData.get("institution"),
      scope: formData.get("scope").trim(),
      status: "Active",
      last: "Not signed in yet",
      addedAt: new Date(),
    };

    setAdmins((currentAdmins) => [newAdmin, ...currentAdmins]);
    setQ("");
    setInst("All");
    setStatus("All");
    setPage(1);
    setAddedAdmin(newAdmin);
  };
  const Th = ({ label, k }) => (
    <th scope="col">
      <button type="button" onClick={() => sortBy(k)}>
        {label}
        <span className="cu-sort">⇅</span>
      </button>
    </th>
  );

  return (
    <div className="cu-app">
      <style>{CSS}</style>

      <Sidebar activeItem="School Administrators" />

      <main className="cu-main">
        <Topbar
          title="School administrators"
          subtitle="Who can publish, and where"
        />

        <section className="cu-body">
          <div className="cu-row-end">
            <button
              type="button"
              className="cu-add"
              onClick={() => {
                setAddedAdmin(null);
                setIsAddAdminOpen(true);
              }}
            >
              <Svg size={26} sw={1.4}>
                <circle cx="12" cy="12" r="9.5" />
                <path d="M12 8v8M8 12h8" />
              </Svg>{" "}
              Add New Administrator
            </button>
          </div>

          <div className="cu-stats">
            {SUMMARY.map(([t, n, s]) => (
              <div className="cu-stat" key={t}>
                <h3>{t}</h3>
                <strong>{n}</strong>
                <span>{s}</span>
              </div>
            ))}
          </div>

          <div className="cu-bar">
            <label className="cu-search">
              <Svg size={20}>
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </Svg>
              <input
                value={q}
                onChange={reset(setQ)}
                placeholder="Search administrator..."
                aria-label="Search administrators"
              />
            </label>
            <label className="cu-sel">
              <select
                value={inst}
                onChange={reset(setInst)}
                aria-label="Filter by institution"
              >
                <option value="All">All Institutions</option>
                {institutions.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </label>
            <label className="cu-sel">
              <select
                value={status}
                onChange={reset(setStatus)}
                aria-label="Filter by status"
              >
                <option value="All">All Statuses</option>
                <option>Active</option>
                <option>Deactivated</option>
              </select>
            </label>
            <button type="button" className="cu-clear" onClick={clear}>
              Clear filters
            </button>
          </div>

          <div className="cu-chips">
            {CHIPS.map((c) => (
              <button
                key={c.key}
                type="button"
                className={"cu-chip" + (status === c.key ? " on" : "")}
                onClick={() => {
                  setStatus(c.key);
                  setPage(1);
                }}
              >
                {c.dot && <i style={{ background: c.dot }} />}
                {c.label} <b>{c.n}</b>
              </button>
            ))}
          </div>

          <div className="cu-table-wrap">
            <div className="cu-scroll">
              <table>
                <thead>
                  <tr>
                    <Th label="ADMINISTRATOR" k="name" />
                    <Th label="ROLE" k="role" />
                    <Th label="INSTITUTIONS" k="inst" />
                    <Th label="SCOPE" k="scope" />
                    <Th label="STATUS" k="status" />
                    <Th label="LAST ACTIVE" k="last" />
                    <th scope="col" className="r">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <div className="cu-inst">
                          <span className="cu-ini">{a.initials}</span>
                          <div>
                            <b>{a.name}</b>
                            <small>{a.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{a.role}</td>
                      <td>{a.inst}</td>
                      <td className="mut">{a.scope}</td>
                      <td>
                        <span
                          className={
                            "cu-pill" + (a.status === "Active" ? "" : " w")
                          }
                        >
                          <i />
                          {a.status}
                        </span>
                      </td>
                      <td className="mut2">{a.last}</td>
                      <td className="r">
                        <button
                          type="button"
                          className="cu-more"
                          aria-label={`Actions for ${a.name}`}
                        >
                          •••
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!shown.length && (
                    <tr>
                      <td colSpan={7} className="cu-empty">
                        No administrators match these filters. Clear filters to
                        see everyone.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="cu-foot">
              <span>
                Showing {rows.length ? (cur - 1) * per + 1 : 0}-
                {Math.min(cur * per, rows.length)} of {rows.length} results
              </span>
              <label className="cu-sel sm">
                <select
                  value={per}
                  onChange={(e) => {
                    setPer(+e.target.value);
                    setPage(1);
                  }}
                  aria-label="Rows per page"
                >
                  {[10, 24, 48].map((n) => (
                    <option key={n} value={n}>
                      {n} per page
                    </option>
                  ))}
                </select>
              </label>
              <div className="cu-pg">
                <button
                  type="button"
                  disabled={cur === 1}
                  onClick={() => setPage(cur - 1)}
                  aria-label="Previous page"
                >
                  ‹
                </button>
                {Array.from({ length: pages }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={cur === i + 1 ? "on" : ""}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={cur === pages}
                  onClick={() => setPage(cur + 1)}
                  aria-label="Next page"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      {isAddAdminOpen && (
        <div
          className="cu-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeAddAdmin();
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") closeAddAdmin();
          }}
        >
          <section
            className={`cu-admin-modal${addedAdmin ? " cu-admin-success" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={
              addedAdmin ? "cu-admin-success-title" : "cu-add-admin-title"
            }
          >
            {addedAdmin ? (
              <div className="cu-admin-success-content">
                <div className="cu-admin-success-icon" aria-hidden="true">
                  <svg viewBox="0 0 80 80" fill="none">
                    <path
                      d="M40 2c5 0 8 6 13 7s11-2 15 2 1 10 4 15 8 7 8 14-5 10-8 15 0 11-4 15-10 1-15 4-8 8-13 8-8-6-13-8-11 2-15-2-1-10-4-15S0 50 0 40s5-10 8-15 0-11 4-15 10-1 15-4 8-4 13-4Z"
                      fill="#CCFFC8"
                    />
                    <path
                      d="m23 41 10 10 24-26"
                      stroke="#059669"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 id="cu-admin-success-title">
                  Administrator Added Successfully
                </h2>
                <p className="cu-admin-success-message">
                  {addedAdmin.name} has been successfully added to the system.
                  An invitation email with login credentials will be sent when
                  email delivery is configured.
                </p>
                <dl className="cu-admin-success-details">
                  <div>
                    <dt>Name</dt>
                    <dd>{addedAdmin.name}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{addedAdmin.email}</dd>
                  </div>
                  <div>
                    <dt>Role</dt>
                    <dd>{addedAdmin.role}</dd>
                  </div>
                  <div>
                    <dt>Institution</dt>
                    <dd>
                      {{
                        LCU: "Leadcity University",
                        UI: "University of Ibadan",
                        OAU: "Obafemi Awolowo University",
                      }[addedAdmin.inst] ?? addedAdmin.inst}
                    </dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd className="cu-admin-success-status">
                      {addedAdmin.status}
                    </dd>
                  </div>
                  <div>
                    <dt>Added on</dt>
                    <dd>
                      {addedAdmin.addedAt.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </dd>
                  </div>
                </dl>
                <footer className="cu-admin-success-footer">
                  <button
                    type="button"
                    className="cu-admin-success-close"
                    onClick={closeAddAdmin}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="cu-admin-success-back"
                    onClick={closeAddAdmin}
                  >
                    Back to School Administrator
                  </button>
                </footer>
              </div>
            ) : (
            <>
            <header className="cu-admin-modal-header">
              <div>
                <h2 id="cu-add-admin-title">Add school administrator</h2>
                <p>
                  They can publish only for the institutions you associate them
                  with.
                </p>
              </div>
              <button
                type="button"
                className="cu-modal-close"
                onClick={closeAddAdmin}
                aria-label="Close add administrator form"
              >
                <Svg size={17} sw={1.5}>
                  <path d="m6 6 12 12M18 6 6 18" />
                </Svg>
              </button>
            </header>
            <form className="cu-admin-form" onSubmit={addAdministrator}>
              <label className="cu-admin-field">
                <span>
                  Full name <i>*</i>
                </span>
                <input
                  name="firstName"
                  placeholder="e.g. Aisha"
                  autoFocus
                  required
                />
              </label>
              <label className="cu-admin-field">
                <span>
                  Last Name <i>*</i>
                </span>
                <input name="lastName" placeholder="e.g. Bello" required />
              </label>
              <label className="cu-admin-field cu-admin-field-full">
                <span>
                  Email Address <i>*</i>
                </span>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  required
                />
              </label>
              <label className="cu-admin-field">
                <span>
                  Role <i>*</i>
                </span>
                <select name="role" defaultValue="" required>
                  <option value="" disabled>
                    Select a role
                  </option>
                  {[...new Set(ADMINS.map((admin) => admin.role))].map(
                    (role) => (
                      <option key={role}>{role}</option>
                    ),
                  )}
                </select>
              </label>
              <label className="cu-admin-field">
                <span>
                  Institution <i>*</i>
                </span>
                <select name="institution" defaultValue="" required>
                  <option value="" disabled>
                    Select institution
                  </option>
                  {institutions.map((institution) => (
                    <option key={institution}>{institution}</option>
                  ))}
                </select>
              </label>
              <label className="cu-admin-field cu-admin-field-full">
                <span>Scope</span>
                <small>What this administrator is allowed to publish, and to whom.</small>
                <input name="scope" placeholder="e.g FOCIT" />
              </label>
              <footer className="cu-admin-modal-footer">
                <button
                  type="button"
                  className="cu-admin-cancel"
                  onClick={closeAddAdmin}
                >
                  Cancel
                </button>
                <button type="submit" className="cu-admin-submit">
                  Add administrator
                </button>
              </footer>
            </form>
            </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

/* ---------- styles (same shell as SchoolsPage; extract into a shared layout when you wire up routing) ---------- */
const CSS = `
.cu-app{--bg:#f4f4f5;--panel:#fff;--soft:#fafafa;--text:#18181b;--muted:#71717a;--line:#e4e4e7;--brand:#4f46e5;--brand-soft:#e0e7ff;--navy:#1e1b4b;--green:#15803d;--green-bg:#dcfce7;--amber:#b45309;--amber-bg:#fef3c7;
 display:grid;grid-template-columns:272px 1fr;gap:16px;padding:12px;min-height:100vh;background:var(--bg);color:var(--text);font-family:Inter,system-ui,sans-serif;font-size:15px;box-sizing:border-box}
.cu-app *{box-sizing:border-box}
.cu-app button,.cu-app input,.cu-app select{font:inherit;color:inherit}
.cu-app button{cursor:pointer}
.cu-app :focus-visible{outline:2px solid var(--brand);outline-offset:2px}
.cu-side{background:var(--panel);border-radius:16px;padding:24px;display:flex;flex-direction:column;position:sticky;top:12px;height:calc(100vh - 24px);overflow:auto}
.cu-logo{display:flex;align-items:center;gap:8px;font-weight:600;font-size:23px;margin:0 0 22px;letter-spacing:-.01em}
.cu-logo-mark{width:24px;height:28px;flex:none;background:var(--brand);mask:url('/images/Group%201.svg') center/contain no-repeat}
.cu-pub{background:var(--navy);border:1px solid #3730a3;border-radius:16px;padding:20px;margin-bottom:24px}
.cu-pub-in{display:flex;align-items:center;gap:10px;background:#4f46e5;border:1px solid #6366f1;border-radius:10px;padding:10px 14px;color:#fff}
.cu-pub-in small{display:block;font-size:11px;opacity:.8}
.cu-pub-in b{font-weight:600;font-size:14px}
.cu-grp{font-size:12px;color:var(--muted);letter-spacing:.03em;text-transform:uppercase;margin:20px 0 8px}
.cu-nav{display:flex;align-items:center;gap:14px;width:100%;padding:12px;border:0;background:none;border-radius:10px;text-align:left;font-size:15px}
.cu-nav:hover{background:var(--soft)}
.cu-nav.on{background:var(--brand-soft);color:var(--brand);font-weight:500}
.cu-nav svg{flex:none}
.cu-logout{color:#dc2626}
.cu-main{display:flex;flex-direction:column;gap:12px;min-width:0}
.cu-top{background:var(--panel);border-radius:16px;padding:18px 28px;display:flex;align-items:center;gap:16px}
.cu-top h1{margin:0;font-size:25px;font-weight:500}
.cu-top p{margin:2px 0 0;color:var(--muted)}
.cu-bell{position:relative;width:48px;height:48px;border-radius:50%;border:0;background:var(--soft);display:grid;place-items:center}
.cu-bell i{position:absolute;top:10px;right:11px;width:9px;height:9px;border-radius:50%;background:#ea580c}
.cu-user{display:flex;align-items:center;gap:12px;border:1px solid var(--line);border-radius:40px;padding:8px 18px 8px 8px}
.cu-av{width:24px;height:24px;border-radius:50%;object-fit:cover;flex:none}
.cu-user b{display:block;font-weight:600}
.cu-user small{color:var(--muted)}
.cu-body{background:var(--panel);border-radius:16px;padding:28px 32px;flex:1;min-width:0}
.cu-row-end{display:flex;justify-content:flex-end}
.cu-add{display:flex;align-items:center;gap:10px;background:var(--brand);color:#fff!important;border:0;border-radius:8px;padding:0 28px;height:56px;font-size:18px}
.cu-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin:28px 0}
.cu-stat{background:var(--soft);border-radius:16px;padding:24px 28px}
.cu-stat h3{margin:0 0 20px;font-weight:500;font-size:17px}
.cu-stat strong{display:block;font-size:40px;font-weight:400;margin-bottom:18px}
.cu-stat span{color:var(--muted)}
.cu-bar{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.cu-search{display:flex;align-items:center;gap:10px;border:1px solid var(--line);border-radius:8px;padding:0 14px;height:48px;width:min(400px,100%);color:var(--muted)}
.cu-search input{border:0;outline:0;background:none;flex:1;min-width:0;color:var(--text)}
.cu-sel{display:inline-flex;align-items:center;border:1px solid var(--line);border-radius:8px;height:48px;padding:0 10px}
.cu-sel.sm{height:40px}
.cu-sel select{border:0;background:none;outline:0;padding:0 4px}
.cu-clear{margin-left:auto;border:0;background:none;color:var(--navy);font-weight:600}
.cu-chips{display:flex;gap:14px;flex-wrap:wrap;margin:24px 0}
.cu-chip{display:flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:8px;padding:0 18px;height:54px;background:var(--panel)}
.cu-chip.on{border-color:var(--brand)}
.cu-chip i{width:8px;height:8px;border-radius:50%}
.cu-chip b{font-weight:600}
.cu-table-wrap{border:1px solid var(--line);border-radius:12px;overflow:hidden}
.cu-scroll{overflow-x:auto}
.cu-app table{width:100%;border-collapse:collapse;min-width:980px}
.cu-app th{font-size:12px;font-weight:600;color:var(--muted);text-align:left;padding:16px 20px;background:var(--soft);border-bottom:1px solid var(--line);white-space:nowrap}
.cu-app th button{border:0;background:none;padding:0;font-size:12px;font-weight:600;color:var(--muted)}
.cu-sort{margin-left:6px;opacity:.6}
.cu-app td{padding:16px 20px;border-bottom:1px solid var(--line)}
.cu-app .r{text-align:right}
.cu-inst{display:flex;align-items:center;gap:12px}
.cu-ini{width:44px;height:44px;border-radius:50%;background:var(--brand-soft);color:var(--navy);font-weight:600;font-size:14px;display:grid;place-items:center;flex:none}
.cu-inst b{display:block;font-weight:600}
.cu-inst small{color:var(--muted);font-size:14px}
.cu-pill{display:inline-flex;align-items:center;gap:6px;padding:3px 12px;border-radius:20px;background:var(--green-bg);color:var(--green);font-size:15px}
.cu-pill.w{background:var(--amber-bg);color:var(--amber)}
.cu-pill i{width:7px;height:7px;border-radius:50%;background:currentColor}
.mut{color:var(--muted)}
.mut2{color:#3f3f46}
.cu-more{border:0;background:none;font-size:20px;letter-spacing:1px;color:#52525b}
.cu-foot{display:flex;align-items:center;gap:16px;padding:16px 20px;color:var(--muted);flex-wrap:wrap}
.cu-foot .cu-sel{color:var(--text)}
.cu-pg{margin-left:auto;display:flex;gap:8px}
.cu-pg button{width:40px;height:40px;border-radius:8px;border:1px solid var(--line);background:var(--panel)}
.cu-pg button.on{background:var(--brand);border-color:var(--brand);color:#fff}
.cu-pg button:disabled{opacity:.4;cursor:default}
.cu-empty{text-align:center;padding:40px!important;color:var(--muted)}
.cu-modal-backdrop{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:16px;background:rgba(24,24,27,.24);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
.cu-admin-modal{width:min(360px,100%);max-height:calc(100vh - 32px);overflow-y:auto;border-radius:10px;background:#fff;padding:16px;color:#27272a;box-shadow:0 16px 48px rgba(24,24,27,.18)}
.cu-admin-modal-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
.cu-admin-modal-header h2{margin:0 0 4px;font-size:13px;font-weight:600;line-height:1.4}
.cu-admin-modal-header p{margin:0;color:#52525b;font-size:8px;line-height:1.5}
.cu-admin-modal-header .cu-modal-close{display:grid;place-items:center;width:22px;height:22px;flex:none;padding:0;border:0;background:transparent;color:#52525b}
.cu-admin-form{display:grid;grid-template-columns:1fr 1fr;column-gap:9px;row-gap:8px}
.cu-admin-field{display:flex;min-width:0;flex-direction:column;gap:4px}
.cu-admin-field-full{grid-column:1/-1}
.cu-admin-field>span{font-size:8px;line-height:1.3;color:#27272a}
.cu-admin-field>span i{color:#ef4444;font-style:normal}
.cu-admin-field>small{margin-top:-2px;color:#71717a;font-size:7px;line-height:1.3}
.cu-admin-field input,.cu-admin-field select{width:100%;height:33px;min-width:0;border:1px solid #d4d4d8;border-radius:6px;background:#fff;padding:0 12px;font-size:8px;color:#27272a}
.cu-admin-field input::placeholder{color:#52525b;opacity:1}
.cu-admin-field select{padding-right:7px;color:#52525b}
.cu-admin-modal-footer{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;margin-top:2px;padding-top:11px;border-top:1px solid #f4f4f5}
.cu-admin-modal-footer button{height:32px;border-radius:6px;font-size:8px}
.cu-admin-cancel{padding:0 14px;border:0;background:transparent}
.cu-admin-submit{padding:0 15px;border:0;background:#4f46e5;color:#fff!important}
.cu-admin-success{width:min(306px,100%);padding:18px 20px 17px}
.cu-admin-success-content{text-align:center}
.cu-admin-success-icon{width:76px;height:76px;margin:0 auto 10px}
.cu-admin-success-icon svg{display:block;width:100%;height:100%}
.cu-admin-success-content h2{margin:0;font-size:12px;font-weight:600;line-height:1.4}
.cu-admin-success-message{margin:5px 0 12px;color:#71717a;font-size:7px;line-height:1.5}
.cu-admin-success-details{margin:0;padding:5px 9px;border:1px solid #e4e4e7;border-radius:8px;background:#fafafa;text-align:left}
.cu-admin-success-details div{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:21px;border-bottom:1px solid #e4e4e7}
.cu-admin-success-details div:last-child{border-bottom:0}
.cu-admin-success-details dt,.cu-admin-success-details dd{margin:0;font-size:7px;line-height:1.35}
.cu-admin-success-details dt{color:#71717a;white-space:nowrap}
.cu-admin-success-details dd{color:#18181b;font-weight:600;text-align:right;overflow-wrap:anywhere}
.cu-admin-success-details .cu-admin-success-status{color:#16a34a}
.cu-admin-success-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:11px;padding-top:10px;border-top:1px solid #f4f4f5}
.cu-admin-success-footer button{height:28px;border-radius:6px;font-size:7px}
.cu-admin-success-close{padding:0 14px;border:1px solid #e4e4e7;background:#fff}
.cu-admin-success-back{padding:0 12px;border:0;background:#4f46e5;color:#fff!important}
@media(max-width:420px){.cu-admin-modal{padding:14px}.cu-admin-form{column-gap:7px}}
@media(max-width:1100px){.cu-stats{grid-template-columns:repeat(2,1fr)}}
@media(max-width:860px){
 .cu-app{grid-template-columns:1fr}
 .cu-side{position:static;height:auto}
 .cu-user div,.cu-user svg{display:none}
 .cu-user{padding:6px}
 .cu-top{padding:14px 18px}
 .cu-body{padding:18px}
 .cu-stats{grid-template-columns:1fr}
 .cu-add{height:48px;font-size:16px}
}
`;
