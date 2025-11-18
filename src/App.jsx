import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState([])
  const [active, setActive] = useState(null)
  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '')

  useEffect(() => {
    // Bootstrap backend and load rooms
    const init = async () => {
      try {
        await fetch(`${baseUrl}/api/bootstrap`, { method: 'POST' })
        const res = await fetch(`${baseUrl}/api/conversations`)
        const data = await res.json()
        setConversations(data)
        setActive((prev) => prev || data[0])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [baseUrl])

  useEffect(() => {
    const load = async () => {
      if (!active) return
      const res = await fetch(`${baseUrl}/api/messages/${active.id}`)
      const data = await res.json()
      setMessages(data)
    }
    load()
  }, [active, baseUrl])

  const handleSend = async (text) => {
    if (!username) return alert('Choose a username to chat')
    const optimistic = {
      id: `local-${Date.now()}`,
      conversation_id: active.id,
      sender: username,
      text,
      _local: true,
    }
    setMessages((m) => [...m, optimistic])
    try {
      const res = await fetch(`${baseUrl}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: active.id, sender: username, text }),
      })
      if (!res.ok) throw new Error('Failed to send')
      // reload to get server timestamp/order
      const reload = await fetch(`${baseUrl}/api/messages/${active.id}`)
      setMessages(await reload.json())
    } catch (e) {
      console.error(e)
    }
  }

  const saveUsername = async () => {
    if (!username) return
    localStorage.setItem('username', username)
    await fetch(`${baseUrl}/api/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username }) })
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-gray-600">Loading chat…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      <Sidebar baseUrl={baseUrl} activeId={active?.id} setActive={setActive} conversations={conversations} />
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b bg-white flex items-center justify-between px-4">
          <div className="font-semibold">{active?.title || 'Chat'}</div>
          <div className="flex items-center gap-2">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              className="border rounded px-2 py-1 text-sm"
            />
            <button onClick={saveUsername} className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Save</button>
          </div>
        </div>
        <ChatWindow messages={messages} onSend={handleSend} />
      </div>
    </div>
  )
}

export default App
