import { useState } from 'react'
import AlbumForm from './components/AlbumForm'
import AlbumList from './components/AlbumList'
import PhotoUploader from './components/PhotoUploader'

function App() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />

      <header className="relative z-10 px-6 py-8 text-center">
        <h1 className="text-4xl font-bold text-white tracking-tight">Album Share</h1>
        <p className="text-blue-200 mt-2">Create an album and share a link for friends to add photos</p>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto p-6 space-y-8">
        <AlbumForm onCreated={(id) => setSelected({ id, title: 'New Album' })} />

        <section className="space-y-3">
          <h2 className="text-white font-semibold">Your albums</h2>
          <AlbumList onSelect={setSelected} />
        </section>

        {selected && (
          <section className="space-y-3">
            <PhotoUploader album={selected} />
          </section>
        )}
      </main>

      <footer className="relative z-10 text-center py-8 text-blue-200/70">
        <a className="underline hover:text-blue-200" href="/test">Check backend status</a>
      </footer>
    </div>
  )
}

export default App
