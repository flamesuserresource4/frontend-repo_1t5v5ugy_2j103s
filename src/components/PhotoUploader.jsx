import { useEffect, useState } from 'react'

export default function PhotoUploader({ album }) {
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [addedBy, setAddedBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    try {
      const res = await fetch(`${backend}/api/albums/${album.id}/photos`)
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { if (album?.id) load() }, [album?.id])

  const submit = async (e) => {
    e.preventDefault()
    if (!url) return
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/albums/${album.id}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          album_id: album.id,
          url,
          caption: caption || undefined,
          added_by: addedBy || undefined,
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Upload failed')
      setUrl(''); setCaption(''); setAddedBy('')
      await load()
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4 space-y-3">
        <h3 className="text-white font-semibold">Add photo to “{album.title}”</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="px-3 py-2 rounded bg-slate-900/60 text-white placeholder:text-slate-400 border border-slate-700" placeholder="Image URL (https://...)" value={url} onChange={e=>setUrl(e.target.value)} />
          <input className="px-3 py-2 rounded bg-slate-900/60 text-white placeholder:text-slate-400 border border-slate-700" placeholder="Caption (optional)" value={caption} onChange={e=>setCaption(e.target.value)} />
          <input className="px-3 py-2 rounded bg-slate-900/60 text-white placeholder:text-slate-400 border border-slate-700" placeholder="Your name (optional)" value={addedBy} onChange={e=>setAddedBy(e.target.value)} />
        </div>
        <button disabled={loading} className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded">
          {loading ? 'Adding...' : 'Add photo'}
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map(p => (
          <figure key={p.id} className="bg-slate-800/40 border border-slate-700/50 rounded-lg overflow-hidden">
            <img src={p.url} alt={p.caption || 'Photo'} className="w-full h-40 object-cover" />
            {(p.caption || p.added_by) && (
              <figcaption className="p-2 text-xs text-slate-300 flex justify-between">
                <span>{p.caption || ''}</span>
                <span className="text-slate-500">{p.added_by || ''}</span>
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  )
}
