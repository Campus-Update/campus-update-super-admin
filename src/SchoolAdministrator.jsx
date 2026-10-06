import React, { useMemo, useState } from "react";

/* ---------- data (replace with your API) ---------- */
const ADMINS = [
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
const NAV = [
  {
    group: "Publishing",
    items: [
      "Overview",
      "Schools",
      "School Administrators",
      "Users",
      "Content Monitoring",
    ],
  },
  { group: "Commercial", items: ["External Events", "Announcements"] },
  { group: "Government", items: ["Audit log", "Analytics"] },
];
const ACTIVE_NAV = "School Administrators";

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
const ICONS = {
  Overview: (
    <Svg>
      <circle cx="7" cy="7" r="3.5" />
      <circle cx="17" cy="7" r="3.5" />
      <circle cx="7" cy="17" r="3.5" />
      <circle cx="17" cy="17" r="3.5" />
    </Svg>
  ),
  Schools: (
    <Svg>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M8 9h8M8 13h8M8 17h4" />
    </Svg>
  ),
  "School Administrators": (
    <Svg>
      <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" />
      <path d="M12 3v18M4 12h16" />
    </Svg>
  ),
  Users: (
    <Svg>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-4 3-6 6.5-6s6.5 2 6.5 6" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M17 14c3 0 5 1.5 5 5" />
    </Svg>
  ),
  "Content Monitoring": (
    <Svg>
      <path d="M4 7h16l-1 12H5z" />
      <circle cx="12" cy="13" r="3" />
      <path d="M6 4h12" />
    </Svg>
  ),
  "External Events": (
    <Svg>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-4 3-6 6.5-6s6.5 2 6.5 6" />
      <path d="M18 4v6M15 7h6" />
    </Svg>
  ),
  Announcements: (
    <Svg>
      <rect x="3" y="5" width="18" height="15" rx="3" />
      <path d="M8 16v-4M12 16V9M16 16v-2" />
    </Svg>
  ),
  "Audit log": (
    <Svg>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-4 3-6 6.5-6s6.5 2 6.5 6" />
      <path d="M17 14l1.5 1.5L22 12" />
    </Svg>
  ),
  Analytics: (
    <Svg>
      <rect x="3" y="5" width="18" height="15" rx="3" />
      <path d="M8 16v-4M12 16V9M16 16v-2" />
    </Svg>
  ),
  Settings: (
    <Svg>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </Svg>
  ),
  Logout: (
    <Svg>
      <path d="M10 4H6a2 2 0 00-2 2v12a2 2 0 002 2h4" />
      <path d="M14 8l4 4-4 4M18 12H9" />
    </Svg>
  ),
};

/* ---------- page ---------- */
export default function SchoolAdministratorsPage() {
  const [q, setQ] = useState("");
  const [inst, setInst] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState({ key: null, dir: 1 });
  const [page, setPage] = useState(1);
  const [per, setPer] = useState(48);

  const institutions = useMemo(
    () => [...new Set(ADMINS.map((a) => a.inst))],
    [],
  );

  const rows = useMemo(() => {
    let r = ADMINS.filter(
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
  }, [q, inst, status, sort]);

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

      <aside className="cu-side">
        <div className="cu-logo">
          <span className="cu-logo-mark" aria-hidden="true" /> Campus Update
        </div>
        <div className="cu-pub">
          <div className="cu-pub-in">
            <Svg size={20} sw={1.4}>
              <path d="M4 21V9l8-5 8 5v12M9 21v-6h6v6M3 21h18" />
            </Svg>
            <div>
              <small>Publishing as</small>
              <b>Campus Update</b>
            </div>
          </div>
        </div>
        {NAV.map((g) => (
          <div key={g.group}>
            <div className="cu-grp">{g.group}</div>
            {g.items.map((n) => (
              <button
                key={n}
                type="button"
                className={"cu-nav" + (n === ACTIVE_NAV ? " on" : "")}
                aria-current={n === ACTIVE_NAV ? "page" : undefined}
                onClick={() => {
                  const targets = {
                    Overview: "/",
                    Schools: "/schools",
                    "School Administrators": "/school-administrators",
                  };

                  if (targets[n]) {
                    window.location.href = targets[n];
                  }
                }}
              >
                {ICONS[n]} {n}
              </button>
            ))}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <button type="button" className="cu-nav">
          {ICONS.Settings} Settings
        </button>
        <button type="button" className="cu-nav cu-logout">
          {ICONS.Logout} Logout
        </button>
      </aside>

      <main className="cu-main">
        <header className="cu-top">
          <div>
            <h1>School administrators</h1>
            <p>Who can publish, and where</p>
          </div>
          <div style={{ flex: 1 }} />
          <button type="button" className="cu-bell" aria-label="Notifications">
            <Svg size={26} sw={1.4}>
              <path d="M6 17v-6a6 6 0 0112 0v6l2 2H4zM10 21h4" />
            </Svg>
            <i />
          </button>
          <div className="cu-user">
            <img className="cu-av" src="/images/avatar-john.png" alt="" />
            <div>
              <b>John Doe</b>
              <small>Faculty Administrator</small>
            </div>
            <Svg size={20} sw={1.8}>
              <path d="M6 9l6 6 6-6" />
            </Svg>
          </div>
        </header>

        <section className="cu-body">
          <div className="cu-row-end">
            <button type="button" className="cu-add">
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
