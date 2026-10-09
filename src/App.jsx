import { useEffect, useState } from 'react'
import OverviewPage from './components/admin/OverviewPage.jsx'
import UsersPage from './components/admin/UsersPage.jsx'
import SchoolsPage from './components/admin/SchoolsPage.jsx'
import SchoolDetailPage from './components/admin/SchoolDetailPage.jsx'
import SchoolAdminsPage from './components/admin/SchoolAdminsPage.jsx'
import ContentMonitoringPage from './components/admin/ContentMonitoringPage.jsx'
import ExternalEventsPage from './components/admin/ExternalEventsPage.jsx'
import AdvertisementsPage from './components/admin/AdvertisementsPage.jsx'

const PAGES = ['users', 'schools', 'admins', 'content', 'events', 'ads']

const fromHash = () => {
  const h = window.location.hash.replace(/^#\/?/, '')
  const m = h.match(/^schools\/(\d+)$/)
  if (m) return { page: 'school-detail', id: Number(m[1]) }
  return { page: PAGES.includes(h) ? h : 'overview' }
}

export default function App() {
  const [route, setRoute] = useState(fromHash)

  useEffect(() => {
    const onHash = () => setRoute(fromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

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
  return <OverviewPage />
}
