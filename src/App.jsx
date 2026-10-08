import { useEffect, useState } from 'react'
import OverviewPage from './components/admin/OverviewPage.jsx'
import UsersPage from './components/admin/UsersPage.jsx'

const fromHash = () => (window.location.hash.replace(/^#\/?/, '') === 'users' ? 'users' : 'overview')

export default function App() {
  const [page, setPage] = useState(fromHash)

  useEffect(() => {
    const onHash = () => setPage(fromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (id) => {
    if (id === 'users' || id === 'overview') window.location.hash = `/${id}`
  }

  if (page === 'users') return <UsersPage onNavigate={navigate} />
  return <OverviewPage />
}
