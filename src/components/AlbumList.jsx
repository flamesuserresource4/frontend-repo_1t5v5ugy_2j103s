import { useEffect, useState } from 'react'

export default function AlbumList({ onSelect }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/albums`)
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <p className="text-blue-200">Loading albums...</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map(alb => (
        <button key={alb.id} onClick={() => onSelect && onSelect(alb)} className="text-left group bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 rounded-xl p-4 transition">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-slate-900 overflow-hidden border border-slate-700 flex items-center justify-center">
              {alb.cover_url ? (
                <img src={alb.cover_url} alt={alb.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-400 text-xs">No cover</div>
              )}
            </div>
            <div>
              <div className="text-white font-medium">{alb.title}</div>
              <div className="text-slate-400 text-sm">{alb.owner_name || 'Unknown'} • {new Date(alb.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
