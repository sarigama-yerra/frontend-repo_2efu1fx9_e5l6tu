import { useEffect, useRef } from 'react'

export default function ChatWindow({ messages, onSend }) {
  const inputRef = useRef(null)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const text = inputRef.current.value.trim()
      if (text) {
        onSend(text)
        inputRef.current.value = ''
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gradient-to-b from-slate-50 to-white">
        {messages.map((m) => (
          <div key={m.id} className={`max-w-[75%] rounded-lg px-3 py-2 ${m._local ? 'self-end bg-blue-600 text-white ml-auto' : 'bg-white border'}`}>
            <div className="text-xs opacity-70 mb-0.5">{m.sender}</div>
            <div className="whitespace-pre-wrap">{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="p-3 border-t bg-white">
        <textarea
          ref={inputRef}
          rows={2}
          placeholder="Type a message and press Enter..."
          onKeyDown={handleKey}
          className="w-full resize-none border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}
