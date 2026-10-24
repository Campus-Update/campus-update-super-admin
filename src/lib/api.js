export const API_BASE = ''

const AUTH_KEY = 'cu_auth'
const PROFILE_KEY = 'cu_profile'

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY))
  } catch {
    return null
  }
}
export function setAuth(a) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(a))
}
export function clearAuth() {
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(PROFILE_KEY)
}
export function getProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY))
  } catch {
    return null
  }
}
export function setProfile(p) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p))
}

let refreshPromise = null
function refresh() {
  const a = getAuth()
  if (!a?.refreshToken) return Promise.resolve(null)
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: a.refreshToken }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setAuth(d)
        return d
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

export async function api(path, { method = 'GET', body, form, auth = true } = {}) {
  const doFetch = (token) => {
    const headers = {}
    if (token) headers.Authorization = `Bearer ${token}`
    if (!form && body) headers['Content-Type'] = 'application/json'
    return fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: form ? form : body ? JSON.stringify(body) : undefined,
    })
  }

  let res = await doFetch(auth ? getAuth()?.accessToken : null)

  if (res.status === 401 && auth && getAuth()) {
    const d = await refresh()
    if (d) res = await doFetch(d.accessToken)
  }

  if (res.status === 401 && auth) {
    clearAuth()
    window.location.hash = '/'
    window.location.reload()
  }

  if (res.status === 204) return null
  const ct = res.headers.get('content-type') || ''
  const data = ct.includes('json') ? await res.json().catch(() => null) : await res.text()
  if (!res.ok) {
    const message =
      (data && (data.title || data.detail)) ||
      (data && data.errors && Object.values(data.errors).flat().join(', ')) ||
      `Request failed (${res.status})`
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

const qsApi = (base, params = {}) => {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, v)
  })
  const s = q.toString()
  return api(`${base}${s ? `?${s}` : ''}`)
}

export const authApi = {
  login: (email, password) => api('/api/v1/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  profile: () => api('/api/v1/auth/profile'),
  updateProfile: (b) => api('/api/v1/auth/profile', { method: 'PUT', body: b }),
  changePassword: (b) => api('/api/v1/auth/change-password', { method: 'POST', body: b }),
  sessions: () => api('/api/v1/auth/sessions'),
  revokeSession: (id) => api(`/api/v1/auth/sessions/${id}`, { method: 'DELETE' }),
  revokeOtherSessions: () => api('/api/v1/auth/sessions/others', { method: 'DELETE' }),
}

export const schoolsApi = {
  list: () => api('/api/v1/schools', { auth: false }),
  create: (b) => api('/api/v1/admin/schools', { method: 'POST', body: b }),
}

export const usersApi = {
  createAdmin: (b) => api('/api/v1/admin/users', { method: 'POST', body: b }),
  patch: (id, b) => api(`/api/v1/admin/users/${id}`, { method: 'PATCH', body: b }),
}

export const adminApi = {
  pending: (params = {}) => {
    const q = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') q.set(k, v)
    })
    const s = q.toString()
    return api(`/api/v1/admin/content/pending${s ? `?${s}` : ''}`)
  },
  analytics: () => api('/api/v1/admin/analytics'),
  platformSettings: () => api('/api/v1/admin/platform-settings'),
  savePlatformSettings: (b) => api('/api/v1/admin/platform-settings', { method: 'PUT', body: b }),
  departments: () => api('/api/v1/departments'),
  audit: (params) => qsApi('/api/v1/admin/audit', params),
  schools: (params) => qsApi('/api/v1/admin/schools', params),
  users: (params) => qsApi('/api/v1/admin/users', params),
}

export const contentApi = {
  list: (params = {}) => {
    const q = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') q.set(k, v)
    })
    const s = q.toString()
    return api(`/api/v1/content${s ? `?${s}` : ''}`)
  },
  get: (id) => api(`/api/v1/content/${id}`),
  setStatus: (id, status) => api(`/api/v1/content/${id}/status`, { method: 'PATCH', body: { status } }),
  remove: (id) => api(`/api/v1/content/${id}`, { method: 'DELETE' }),
}
