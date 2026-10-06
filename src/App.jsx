import OverviewPage from "./components/admin/OverviewPage.jsx";
import SchoolsPage from "./Schools.jsx";
import SchoolAdministratorsPage from "./SchoolAdministrator.jsx";

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (path === "/schools") return <SchoolsPage />;
  if (path === "/school-administrators") return <SchoolAdministratorsPage />;

  return <OverviewPage />;
}
