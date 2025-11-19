import { useState } from 'react'

export default function AlbumForm({ onCreated }) {
  const [title, setTitle] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/albums`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          owner_name: ownerName || undefined,
          cover_url: coverUrl || undefined,
          slug: slug || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to create album')
      }
      setTitle(''); setOwnerName(''); setCoverUrl(''); setSlug('')
      onCreated && onCreated(data.id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4 space-y-3">
      <h3 className="text-white font-semibold">Create a new album</h3>
      {error && <p className="text-red-300 text-sm">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="px-3 py-2 rounded bg-slate-900/60 text-white placeholder:text-slate-400 border border-slate-700" placeholder="Album title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="px-3 py-2 rounded bg-slate-900/60 text-white placeholder:text-slate-400 border border-slate-700" placeholder="Your name (optional)" value={ownerName} onChange={e=>setOwnerName(e.target.value)} />
        <input className="px-3 py-2 rounded bg-slate-900/60 text-white placeholder:text-slate-400 border border-slate-700" placeholder="Cover image URL (optional)" value={coverUrl} onChange={e=>setCoverUrl(e.target.value)} />
        <input className="px-3 py-2 rounded bg-slate-900/60 text-white placeholder:text-slate-400 border border-slate-700" placeholder="Custom slug, e.g. summer-24 (optional)" value={slug} onChange={e=>setSlug(e.target.value)} />
      </div>
      <button disabled={loading} className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded">
        {loading ? 'Creating...' : 'Create album'}
      </button>
    </form>
  )
}
