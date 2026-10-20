import { useEffect, useState } from 'react'
import OverviewPage from './components/admin/OverviewPage.jsx'
import UsersPage from './components/admin/UsersPage.jsx'
import SchoolsPage from './components/admin/SchoolsPage.jsx'
import SchoolDetailPage from './components/admin/SchoolDetailPage.jsx'
import SchoolAdminsPage from './components/admin/SchoolAdminsPage.jsx'
import ContentMonitoringPage from './components/admin/ContentMonitoringPage.jsx'
import ExternalEventsPage from './components/admin/ExternalEventsPage.jsx'
import AdvertisementsPage from './components/admin/AdvertisementsPage.jsx'
import LoginPage from './components/admin/LoginPage.jsx'
import AuditLogPage from './components/admin/AuditLogPage.jsx'
import AnalyticsPage from './components/admin/AnalyticsPage.jsx'
import SettingsPage from './components/admin/SettingsPage.jsx'
import { getAuth } from './lib/api.js'

const PAGES = ['users', 'schools', 'admins', 'content', 'events', 'ads', 'audit', 'analytics', 'settings']

const fromHash = () => {
  const h = window.location.hash.replace(/^#\/?/, '')
  const m = h.match(/^schools\/(\d+)$/)
  if (m) return { page: 'school-detail', id: Number(m[1]) }
  return { page: PAGES.includes(h) ? h : 'overview' }
}

export default function App() {
  const [route, setRoute] = useState(fromHash)
  const [authed, setAuthed] = useState(() => !!getAuth())

  useEffect(() => {
    const onHash = () => setRoute(fromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (!authed) return <LoginPage onLoggedIn={() => setAuthed(true)} />

  const navigate = (id) => {
    if (PAGES.includes(id) || id === 'overview') window.location.hash = `/${id}`
  }

  if (route.page === 'school-detail') return <SchoolDetailPage schoolId={route.id} onNavigate={navigate} />
  if (route.page === 'users') return <UsersPage onNavigate={navigate} />
  if (route.page === 'schools') return <SchoolsPage onNavigate={navigate} />
  if (route.page === 'admins') return <SchoolAdminsPage onNavigate={navigate} />
  if (route.page === 'content') return <ContentMonitoringPage onNavigate={navigate} />
  if (route.page === 'events') return <ExternalEventsPage onNavigate={navigate} />
  if (route.page === 'ads') return <AdvertisementsPage onNavigate={navigate} />
  if (route.page === 'audit') return <AuditLogPage onNavigate={navigate} />
  if (route.page === 'analytics') return <AnalyticsPage onNavigate={navigate} />
  if (route.page === 'settings') return <SettingsPage onNavigate={navigate} />
  return <OverviewPage onNavigate={navigate} />
}
