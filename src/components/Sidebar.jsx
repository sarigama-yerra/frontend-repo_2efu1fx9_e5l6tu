import { useEffect, useState } from 'react'

export default function Sidebar({ baseUrl, activeId, setActive, conversations }) {
  return (
    <div className="w-64 border-r border-gray-200 bg-white hidden md:flex md:flex-col">
      <div className="px-4 py-3 border-b">
        <h2 className="font-semibold">Chats</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c)}
            className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${activeId === c.id ? 'bg-blue-50' : ''}`}
          >
            <div className="font-medium text-gray-800">{c.title}</div>
            <div className="text-xs text-gray-500">{c.members ? `${c.members.length} members` : 'Public'}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
