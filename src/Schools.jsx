import React, { useMemo, useState } from "react";
import Sidebar from "./components/admin/Sidebar.jsx";
import Topbar from "./components/admin/Topbar.jsx";

/* ---------- data (replace with your API) ---------- */
const lead = {
  name: "Lead City University",
  place: "Ibadan, Oyo · Pilot · FOCIT",
  status: "Live",
  students: 5240,
  staff: 5240,
  admins: 5,
  content: 41,
  initials: "LU",
};
export const SCHOOLS = [
  ...Array.from({ length: 21 }, (_, i) => ({ ...lead, id: i + 1 })),
  {
    id: 22,
    initials: "UI",
    name: "University of Ibadan",
    place: "Ibadan, Oyo · Agreement signed",
    status: "Paused",
    admins: 5,
    content: 2,
  },
  {
    id: 23,
    initials: "UL",
    name: "University of Lagos",
    place: "Akoka, Lagos · First meeting held",
    status: "Onboarding",
    admins: 7,
    content: 4,
  },
  {
    id: 24,
    initials: "OU",
    name: "Obafemi Awolowo University",
    place: "Ile-Ife, Osun · Paused at school's request",
    status: "Prospect",
    admins: 4,
    content: 25,
  },
];

const SUMMARY = [
  ["Institutions", "04", "On the platform"],
  ["Live", "01", "Serving content to students"],
  ["Onboarding / prospect", "02", "1 onboarding · 1 prospect"],
  ["Deactivated", "03", "Content hidden"],
];
const CHIPS = [
  { key: "All", label: "Total:", n: "24" },
  { key: "Live", label: "Live", n: "21", dot: "#16a34a" },
  { key: "Onboarding", label: "Onboarding", n: "03", dot: "#d97706" },
  { key: "Prospect", label: "Prospect", n: "03", dot: "#d97706" },
  { key: "Deactivated", label: "Deactivated", n: "03", dot: "#d97706" },
];
const fmt = (n) => (n == null ? "--" : n.toLocaleString("en-US"));

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
export default function SchoolsPage() {
  const [schools, setSchools] = useState(() => {
    const savedIds = JSON.parse(
      window.sessionStorage.getItem("campus-update-school-ids") || "[]",
    );
    const deletedIds = JSON.parse(
      window.sessionStorage.getItem("campus-update-deleted-school-ids") || "[]",
    );
    const savedSchools = savedIds
      .map((id) => {
        const school = window.sessionStorage.getItem(
          `campus-update-school-${id}`,
        );
        return school ? JSON.parse(school) : null;
      })
      .filter(Boolean);
    const savedById = new Map(savedSchools.map((school) => [school.id, school]));
    return [
      ...savedSchools.filter((school) => !SCHOOLS.some((seed) => seed.id === school.id)),
      ...SCHOOLS.map((school) => savedById.get(school.id) || school),
    ].filter((school) => !deletedIds.includes(school.id));
  });
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState({ key: null, dir: 1 });
  const [page, setPage] = useState(1);
  const [per, setPer] = useState(10);
  const [isAddSchoolOpen, setIsAddSchoolOpen] = useState(false);
  const [addedSchool, setAddedSchool] = useState(null);

  const rows = useMemo(() => {
    let r = schools.filter(
      (s) =>
        (status === "All" || s.status === status) &&
        `${s.name} ${s.place} ${s.status}`
          .toLowerCase()
          .includes(q.toLowerCase()),
    );
    if (sort.key)
      r = [...r].sort((a, b) => {
        const x = a[sort.key] ?? -1,
          y = b[sort.key] ?? -1;
        return (x > y ? 1 : x < y ? -1 : 0) * sort.dir;
      });
    return r;
  }, [q, schools, status, sort]);

  const pages = Math.max(1, Math.ceil(rows.length / per));
  const cur = Math.min(page, pages);
  const shown = rows.slice((cur - 1) * per, cur * per);
  const clear = () => {
    setQ("");
    setStatus("All");
    setSort({ key: null, dir: 1 });
    setPage(1);
  };
  const sortBy = (key) =>
    setSort((s) => ({ key, dir: s.key === key ? -s.dir : 1 }));
  const closeAddSchool = () => {
    setIsAddSchoolOpen(false);
    setAddedSchool(null);
  };
  const addSchool = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("institutionName").trim();
    const shortName = formData.get("shortName").trim();
    const location = formData.get("location").trim();
    const schoolStatus = formData.get("status");

    const newSchool = {
        id: Math.max(0, ...schools.map((school) => school.id)) + 1,
        name,
        initials: shortName.toUpperCase(),
        place: `${location} · ${schoolStatus}`,
        status: schoolStatus,
        students: null,
        staff: null,
        admins: 0,
        content: 0,
        type: formData.get("type"),
        contactEmail: formData.get("contactEmail").trim(),
        shortName,
        location,
        contactPerson: formData.get("contactPerson").trim(),
        phoneCountryCode: formData.get("phoneCountryCode"),
        phoneNumber: formData.get("phoneNumber").trim(),
        rolloutScope: formData.get("rolloutScope").trim(),
        notes: formData.get("notes").trim(),
        addedAt: new Date(),
      };

    window.sessionStorage.setItem(
      `campus-update-school-${newSchool.id}`,
      JSON.stringify(newSchool),
    );
    const savedIds = JSON.parse(
      window.sessionStorage.getItem("campus-update-school-ids") || "[]",
    );
    window.sessionStorage.setItem(
      "campus-update-school-ids",
      JSON.stringify([...new Set([...savedIds, newSchool.id])]),
    );
    setSchools((currentSchools) => [newSchool, ...currentSchools]);
    setQ("");
    setStatus("All");
    setPage(1);
    setAddedSchool(newSchool);
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

      <Sidebar activeItem="Schools" />

      <main className="cu-main">
        <Topbar
          title="Schools"
          subtitle="Add, edit and activate institutions"
        />

        <section className="cu-body">
          <div className="cu-row-end">
            <button
              type="button"
              className="cu-add"
              onClick={() => {
                setAddedSchool(null);
                setIsAddSchoolOpen(true);
              }}
            >
              <Svg size={26} sw={1.4}>
                <circle cx="12" cy="12" r="9.5" />
                <path d="M12 8v8M8 12h8" />
              </Svg>{" "}
              Add New School
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
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, email, role..."
                aria-label="Search schools"
              />
            </label>
            <label className="cu-sel">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                aria-label="Filter by status"
              >
                <option value="All">All Statuses</option>
                {["Live", "Paused", "Onboarding", "Prospect"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
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
                    <Th label="INSTITUTION" k="name" />
                    <Th label="STATUS" k="status" />
                    <Th label="STUDENTS" k="students" />
                    <Th label="STAFFS" k="staff" />
                    <Th label="ADMINS" k="admins" />
                    <Th label="LIVE CONTENTS" k="content" />
                    <th scope="col" className="r">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((s) => (
                    <tr key={s.id} className={s.status === "Live" ? "" : "alt"}>
                      <td>
                        <div className="cu-inst">
                          <span className="cu-ini">{s.initials}</span>
                          <div>
                            <button
                              type="button"
                              className="cu-school-link"
                              onClick={() => {
                                window.location.href = `/schools/${s.id}`;
                              }}
                            >
                              {s.name}
                            </button>
                            <small>{s.place}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="cu-pill">
                          <i />
                          {s.status}
                        </span>
                      </td>
                      <td>{fmt(s.students)}</td>
                      <td>{fmt(s.staff)}</td>
                      <td>{s.admins}</td>
                      <td className="mut">{s.content}</td>
                      <td className="r">
                        <button
                          type="button"
                          className="cu-more"
                          aria-label={`Actions for ${s.name}`}
                        >
                          •••
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!shown.length && (
                    <tr>
                      <td colSpan={7} className="cu-empty">
                        No schools match these filters. Clear filters to see all
                        institutions.
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
      {isAddSchoolOpen && (
        <div
          className="cu-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeAddSchool();
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              closeAddSchool();
            }
          }}
        >
          <section
            className={`cu-modal${addedSchool ? " cu-modal-success" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={addedSchool ? "cu-success-title" : "cu-add-school-title"}
          >
            {addedSchool ? (
              <div className="cu-success-content">
                <div className="cu-success-icon" aria-hidden="true">
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
                <h2 id="cu-success-title">School Added Successfully</h2>
                <p className="cu-success-message">
                  {addedSchool.name} has been successfully added to the system.
                </p>
                <dl className="cu-success-details">
                  <div>
                    <dt>Institution Name</dt>
                    <dd>{addedSchool.name}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{addedSchool.contactEmail}</dd>
                  </div>
                  <div>
                    <dt>Short Name</dt>
                    <dd>{addedSchool.shortName}</dd>
                  </div>
                  <div>
                    <dt>Type</dt>
                    <dd>{addedSchool.type}</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>{addedSchool.location}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd className="cu-success-status">{addedSchool.status}</dd>
                  </div>
                  <div>
                    <dt>Added on</dt>
                    <dd>
                      {addedSchool.addedAt.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </dd>
                  </div>
                </dl>
                <footer className="cu-success-footer">
                  <button
                    type="button"
                    className="cu-success-close"
                    onClick={closeAddSchool}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="cu-success-back"
                    onClick={closeAddSchool}
                  >
                    Back to School Management
                  </button>
                </footer>
              </div>
            ) : (
            <>
              <header className="cu-modal-header">
                <div>
                  <h2 id="cu-add-school-title">Add a school</h2>
                  <p>
                    New schools start as Onboarding or Prospect and only serve
                    content once activated.
                  </p>
                </div>
                <button
                  type="button"
                  className="cu-modal-close"
                  onClick={closeAddSchool}
                  aria-label="Close add school form"
                >
                  <Svg size={18} sw={1.5}>
                    <path d="m6 6 12 12M18 6 6 18" />
                  </Svg>
                </button>
              </header>
              <form className="cu-modal-form" onSubmit={addSchool}>
              <label className="cu-field cu-field-full">
                <span>
                  Institution name <i>*</i>
                </span>
                <input
                  name="institutionName"
                  placeholder="e.g. Aisha"
                  autoFocus
                  required
                />
              </label>
              <label className="cu-field">
                <span>
                  Short name <i>*</i>
                </span>
                <input name="shortName" placeholder="e.g CU" required />
              </label>
              <label className="cu-field">
                <span>
                  Type <i>*</i>
                </span>
                <select name="type" required defaultValue="Private university">
                  <option>Private university</option>
                  <option>Public university</option>
                  <option>Polytechnic</option>
                  <option>College of education</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="cu-field">
                <span>
                  Contact email <i>*</i>
                </span>
                <input
                  name="contactEmail"
                  type="email"
                  placeholder="Enter email"
                  required
                />
              </label>
              <label className="cu-field">
                <span>
                  Location <i>*</i>
                </span>
                <input
                  name="location"
                  placeholder="City, State"
                  required
                />
              </label>
              <label className="cu-field">
                <span>Contact person</span>
                <input name="contactPerson" />
              </label>
              <label className="cu-field">
                <span>Phone number</span>
                <div className="cu-phone">
                  <select
                    name="phoneCountryCode"
                    aria-label="Phone country code"
                    defaultValue="+234"
                  >
                    <option value="+234">🇳🇬 +234</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+233">🇬🇭 +233</option>
                  </select>
                  <input
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter phone number"
                  />
                </div>
              </label>
              <label className="cu-field cu-field-full">
                <span>Status</span>
                <select name="status" defaultValue="Onboarding">
                  <option>Onboarding</option>
                  <option>Prospect</option>
                </select>
              </label>
              <label className="cu-field cu-field-full">
                <span>Rollout scope</span>
                <input name="rolloutScope" placeholder="e.g FOCIT" />
              </label>
              <label className="cu-field cu-field-full">
                <span>Notes</span>
                <input name="notes" placeholder="Internal notes" />
              </label>
              <footer className="cu-modal-footer">
                <button
                  type="button"
                  className="cu-modal-cancel"
                  onClick={closeAddSchool}
                >
                  Cancel
                </button>
                <button type="submit" className="cu-modal-submit">
                  Add school
                  <Svg size={16}>
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </Svg>
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

/* ---------- styles (scoped with the cu- prefix; move to your CSS/Tailwind setup as needed) ---------- */
const CSS = `
.cu-app{--bg:#f4f4f5;--panel:#fff;--soft:#fafafa;--text:#18181b;--muted:#71717a;--line:#e4e4e7;--brand:#4f46e5;--brand-soft:#e0e7ff;--navy:#1e1b4b;--green:#15803d;--green-bg:#dcfce7;
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
.cu-av{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#a8a29e,#44403c);flex:none}
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
.cu-app table{width:100%;border-collapse:collapse;min-width:820px}
.cu-app th{font-size:12px;font-weight:600;color:var(--muted);text-align:left;padding:16px 20px;background:var(--soft);border-bottom:1px solid var(--line);white-space:nowrap}
.cu-app th button{border:0;background:none;padding:0;font-size:12px;font-weight:600;color:var(--muted)}
.cu-sort{margin-left:6px;opacity:.6}
.cu-app td{padding:16px 20px;border-bottom:1px solid var(--line)}
.cu-app tr.alt td{background:var(--soft)}
.cu-app .r{text-align:right}
.cu-inst{display:flex;align-items:center;gap:12px}
.cu-ini{width:44px;height:44px;border-radius:50%;background:var(--brand-soft);color:var(--navy);font-weight:600;font-size:14px;display:grid;place-items:center;flex:none}
.cu-inst b{display:block;font-weight:600}
.cu-school-link{display:block;padding:0;border:0;background:none;color:inherit;text-align:left;font-weight:600}
.cu-school-link:hover{color:var(--brand)}
.cu-inst small{color:var(--muted);font-size:14px}
.cu-pill{display:inline-flex;align-items:center;gap:6px;padding:3px 12px;border-radius:20px;background:var(--green-bg);color:var(--green);font-size:15px}
.cu-pill i{width:7px;height:7px;border-radius:50%;background:currentColor}
.mut{color:var(--muted)}
.cu-more{border:0;background:none;font-size:20px;letter-spacing:1px;color:#52525b}
.cu-foot{display:flex;align-items:center;gap:16px;padding:16px 20px;color:var(--muted);flex-wrap:wrap}
.cu-foot .cu-sel{color:var(--text)}
.cu-pg{margin-left:auto;display:flex;gap:8px}
.cu-pg button{width:40px;height:40px;border-radius:8px;border:1px solid var(--line);background:var(--panel)}
.cu-pg button.on{background:var(--brand);border-color:var(--brand);color:#fff}
.cu-pg button:disabled{opacity:.4;cursor:default}
.cu-empty{text-align:center;padding:40px!important;color:var(--muted)}
.cu-modal-backdrop{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:20px;background:rgba(24,24,27,.24);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
.cu-modal{width:min(535px,100%);max-height:calc(100vh - 40px);overflow-y:auto;background:#fff;border-radius:12px;padding:18px;box-shadow:0 16px 48px rgba(24,24,27,.18);color:#27272a}
.cu-modal-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:12px}
.cu-modal-header h2{margin:0 0 5px;font-size:14px;font-weight:600;line-height:1.4}
.cu-modal-header p{margin:0;color:#52525b;font-size:9px;line-height:1.5}
.cu-modal-close{display:grid;place-items:center;width:24px;height:24px;flex:none;padding:0;border:0;background:transparent;color:#52525b}
.cu-modal-form{display:grid;grid-template-columns:1fr 1fr;column-gap:10px;row-gap:8px}
.cu-field{display:flex;min-width:0;flex-direction:column;gap:4px}
.cu-field-full{grid-column:1/-1}
.cu-field>span{font-size:9px;line-height:1.3;color:#27272a}
.cu-field>span i{color:#ef4444;font-style:normal}
.cu-field input,.cu-field select{width:100%;height:35px;min-width:0;border:1px solid #d4d4d8;border-radius:7px;background:#fff;padding:0 14px;font-size:9px;color:#27272a}
.cu-field input::placeholder{color:#52525b;opacity:1}
.cu-field select{padding-right:8px;color:#52525b}
.cu-phone{display:grid;grid-template-columns:68px minmax(0,1fr);gap:8px;min-width:0}
.cu-phone select{padding:0 6px}
.cu-phone input{padding:0 14px}
.cu-modal-footer{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;margin-top:4px;padding:12px 0 0;border-top:1px solid #f4f4f5}
.cu-modal-cancel{padding:0 14px;height:34px;border:0;background:transparent;font-size:9px}
.cu-modal-submit{display:flex;align-items:center;justify-content:center;gap:8px;height:35px;padding:0 16px;border:0;border-radius:6px;background:#4f46e5;color:#fff!important;font-size:9px}
.cu-modal-success{width:min(262px,100%);padding:18px 18px 17px}
.cu-success-content{text-align:center}
.cu-success-icon{width:64px;height:64px;margin:0 auto 10px}
.cu-success-icon svg{display:block;width:100%;height:100%}
.cu-success-content h2{margin:0;font-size:12px;font-weight:600;line-height:1.4}
.cu-success-message{margin:4px 0 12px;color:#71717a;font-size:7px;line-height:1.5}
.cu-success-details{margin:0;padding:4px 9px;border:1px solid #e4e4e7;border-radius:8px;background:#fafafa;text-align:left}
.cu-success-details div{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:20px;border-bottom:1px solid #e4e4e7}
.cu-success-details div:last-child{border-bottom:0}
.cu-success-details dt,.cu-success-details dd{margin:0;font-size:7px;line-height:1.35}
.cu-success-details dt{color:#71717a;white-space:nowrap}
.cu-success-details dd{color:#18181b;font-weight:600;text-align:right;overflow-wrap:anywhere}
.cu-success-details .cu-success-status{color:#16a34a}
.cu-success-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:10px}
.cu-success-footer button{height:28px;border-radius:6px;font-size:7px}
.cu-success-close{padding:0 14px;border:1px solid #e4e4e7;background:#fff}
.cu-success-back{padding:0 12px;border:0;background:#4f46e5;color:#fff!important}
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
.cu-app{grid-template-columns:180px minmax(0,1fr);gap:12px;padding:3px;font-size:9px}
.cu-side{padding:14px;top:3px;height:calc(100vh - 6px);border-radius:6px}
.cu-logo{gap:4px;font-size:14px;margin-bottom:10px}
.cu-logo svg{width:24px;height:24px}
.cu-pub{padding:8px;border-radius:9px;margin-bottom:10px}
.cu-pub-in{gap:6px;padding:6px;border-radius:6px}
.cu-pub-in small{font-size:7px}
.cu-pub-in b{font-size:8px}
.cu-grp{font-size:7px;margin:12px 0 4px}
.cu-nav{gap:8px;padding:6px;border-radius:6px;font-size:9px}
.cu-nav svg{width:13px;height:13px}
.cu-main{gap:8px}
.cu-top{border-radius:6px;padding:8px 14px;gap:10px;min-height:56px}
.cu-top h1{font-size:14px}
.cu-top p{font-size:9px}
.cu-bell{width:32px;height:32px}
.cu-bell svg{width:18px;height:18px}
.cu-user{gap:7px;padding:4px 10px 4px 4px}
.cu-av{width:24px;height:24px;object-fit:cover}
.cu-user b{font-size:9px}
.cu-user small{font-size:7px}
.cu-user svg{width:14px;height:14px}
.cu-body{padding:16px 24px;border-radius:6px}
.cu-add{gap:6px;padding:0 18px;height:35px;font-size:10px}
.cu-add svg{width:14px;height:14px}
.cu-stats{grid-template-columns:repeat(4,1fr);gap:10px;margin:8px 0 16px}
.cu-stat{padding:11px 15px;border-radius:9px}
.cu-stat h3{margin-bottom:10px;font-size:10px}
.cu-stat strong{font-size:20px;margin-bottom:8px}
.cu-stat span{font-size:9px}
.cu-bar{gap:7px}
.cu-search{gap:5px;padding:0 8px;height:25px;width:min(180px,100%)}
.cu-search svg{width:13px;height:13px}
.cu-search input{font-size:8px}
.cu-sel{height:25px;padding:0 5px;border-radius:5px}
.cu-sel select{font-size:8px;padding:0 2px}
.cu-clear{font-size:8px}
.cu-chips{gap:5px;margin:15px 0 11px}
.cu-chip{gap:5px;padding:0 8px;height:25px;border-radius:5px;font-size:8px}
.cu-chip i{width:5px;height:5px}
.cu-table-wrap{border-radius:6px}
.cu-app table{min-width:650px}
.cu-app th{font-size:6px;padding:6px 8px}
.cu-app th button{font-size:6px}
.cu-app td{padding:7px 8px;font-size:8px}
.cu-sort{margin-left:3px}
.cu-inst{gap:7px}
.cu-ini{width:20px;height:20px;font-size:7px}
.cu-inst b{font-size:8px}
.cu-inst small{font-size:7px}
.cu-pill{gap:4px;padding:2px 7px;font-size:7px}
.cu-pill i{width:4px;height:4px}
.cu-more{font-size:12px}
.cu-foot{gap:8px;padding:7px 8px;font-size:7px}
.cu-foot .cu-sel{height:20px}
.cu-pg{gap:4px}
.cu-pg button{width:17px;height:17px;border-radius:4px;font-size:8px}
@media(max-width:860px){
 .cu-app{grid-template-columns:1fr}
 .cu-side{position:static;height:auto}
 .cu-user div,.cu-user svg{display:none}
 .cu-body{padding:12px}
 .cu-stats{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:520px){
 .cu-modal-backdrop{padding:10px}
 .cu-modal{max-height:calc(100vh - 20px);padding:16px}
 .cu-modal-form{grid-template-columns:1fr}
 .cu-field-full{grid-column:auto}
 .cu-phone{grid-template-columns:90px minmax(0,1fr)}
}
`;
