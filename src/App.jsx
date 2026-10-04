import OverviewPage from "./components/admin/OverviewPage.jsx";
import SchoolsPage from "./Schools.jsx";

export default function App() {
  return window.location.pathname === "/schools" ? (
    <SchoolsPage />
  ) : (
    <OverviewPage />
  );
}
