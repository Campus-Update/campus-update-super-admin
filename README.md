# Campus Update — Super Admin (Overview · zero-states)

The super-admin **Overview "no data" screen** from the Figma frame `696:1188` ("Zero states"), built 1:1 from design specs pulled via the Figma API and verified with a headless-browser screenshot against the Figma render.

## Structure

| File | What it is |
| --- | --- |
| `src/components/admin/OverviewPage.jsx` | Page shell: date badge, greeting, 4 stat cards (`00`), Pending Approvals + Recent Activity **empty states**, Quick Actions |
| `src/components/admin/Sidebar.jsx` | White/60 sidebar: logo, "Publishing as Osun State University" card, PUBLISHING / INSTITUTION menus, Settings + Logout |
| `src/components/admin/Topbar.jsx` | Page title bar: bell w/ orange dot, John Doe user chip |
| `src/components/admin/Icons.jsx` | Inline SVG icon set (Untitled-UI style, stroke 1.5) |
| `public/logo-admin.svg`, `public/images/avatar-john.png` | Exported Figma assets |

## Design tokens used

- Page bg `#F3F3F3`, cards `white/60` on top, radii 10–16, gaps 12–32 (all from spec).
- Brand purple `#4F46E5` → `#2C277F` gradient stat card; deep navy `#201C5C` publishing card.
- Empty states: `#100070` @ 5% circle, purple icon, `#E5E7EB` inner borders.
- Text: `#2D2D2D` / `#6E6E6E` / `#454545`; logout red `#D83030`.
- Font: Archivo (400/500/600).

## Run

```bash
npm install
npm run dev     # http://localhost:5174
npm run build
```

## Dropping into the team admin repo

Copy `src/components/admin/` + `public/logo-admin.svg` + `public/images/avatar-john.png`,
merge the Tailwind/font setup (same as the landing page repo), and import `<OverviewPage />`.
