import OverviewPage from "./components/admin/OverviewPage.jsx";
import SchoolsPage from "./Schools.jsx";
import SchoolAdministratorsPage from "./SchoolAdministrator.jsx";
import SchoolDetailPage from "./SchoolDetail.jsx";

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const schoolMatch = path.match(/^\/schools\/(\d+)$/);

  if (schoolMatch) return <SchoolDetailPage schoolId={Number(schoolMatch[1])} />;
  if (path === "/schools") return <SchoolsPage />;
  if (path === "/school-administrators") return <SchoolAdministratorsPage />;

  return <OverviewPage />;
}
