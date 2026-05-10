// localStorage-backed saved jobs. SSR-safe.
// Stores small job snapshots so /saved-jobs can render without re-fetching.

import { useEffect, useState, useCallback } from 'react'

const KEY = 'hh360_saved_jobs_v1'
const MAX_SAVED = 100

function read() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function write(list) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_SAVED)))
    window.dispatchEvent(new CustomEvent('hh360:saved-changed'))
  } catch {}
}

export function useSavedJobs() {
  const [items, setItems] = useState([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setItems(read())
    setHydrated(true)
    function onChange() { setItems(read()) }
    window.addEventListener('hh360:saved-changed', onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener('hh360:saved-changed', onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])

  const isSaved = useCallback((id) => items.some(j => j.id === id), [items])

  const toggle = useCallback((job) => {
    if (!job || !job.id) return
    const list = read()
    const idx = list.findIndex(j => j.id === job.id)
    if (idx >= 0) {
      list.splice(idx, 1)
    } else {
      list.unshift({
        id: job.id,
        slug: job.slug || null,
        title: job.title || '',
        company_name: job.company_name || '',
        location: job.location || '',
        salary_label: job.salary_label || '',
        salary_hidden: !!job.salary_hidden,
        skills: Array.isArray(job.skills) ? job.skills.slice(0, 6) : [],
        job_type: job.job_type || '',
        saved_at: new Date().toISOString(),
      })
    }
    write(list)
    setItems(list)
  }, [])

  const remove = useCallback((id) => {
    const list = read().filter(j => j.id !== id)
    write(list)
    setItems(list)
  }, [])

  const clear = useCallback(() => {
    write([])
    setItems([])
  }, [])

  return { items, hydrated, isSaved, toggle, remove, clear, count: items.length }
}
