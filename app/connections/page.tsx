"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Connection } from "@/lib/types"
import { getConnections } from "@/lib/store"
import { ArrowLeft, Coffee, Heart, MessageCircle, Calendar } from "lucide-react"
import { mockEvent } from "@/lib/mockData"

export default function ConnectionsPage() {
  const router = useRouter()
  const [connections, setConnections] = useState<Connection[]>([])

  useEffect(() => {
    setConnections(getConnections())
  }, [])

  const connected = connections.filter((c) => c.type === "connected")
  const scheduled = connections.filter((c) => c.type === "scheduled")
  const requested = connections.filter((c) => c.type === "requested")

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button onClick={() => router.push("/swipe")} className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-white font-bold text-lg">My Connections</h1>
        <div className="w-6" />
      </div>

      {/* Event banner */}
      <div className="mx-5 mb-5 bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center gap-3">
        <div className="w-9 h-9 gradient-bg rounded-lg flex items-center justify-center text-base">🎉</div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-medium truncate">{mockEvent.name}</div>
          <div className="text-zinc-500 text-xs">{mockEvent.date}</div>
        </div>
        <span className="text-purple-400 text-sm font-semibold">{connections.length}</span>
      </div>

      {connections.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="text-5xl mb-4">👋</div>
          <div className="text-white font-bold text-lg mb-2">No connections yet</div>
          <div className="text-zinc-400 text-sm mb-6">Go back to swiping to connect with attendees</div>
          <button
            onClick={() => router.push("/swipe")}
            className="gradient-bg text-white font-semibold py-3.5 px-8 rounded-2xl hover:opacity-90 transition-opacity"
          >
            Start Swiping →
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-5 pb-8">
          {/* Coffee requests */}
          {requested.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Coffee size={14} className="text-purple-400" />
                <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Coffee Requests</span>
                <span className="bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs px-2 py-0.5 rounded-full font-medium">{requested.length}</span>
              </div>
              <div className="flex flex-col gap-3">
                {requested.map((c) => (
                  <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
                    <img src={c.attendee.photo} alt={c.attendee.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm">{c.attendee.name}</div>
                      <div className="text-zinc-400 text-xs truncate">{c.attendee.role} · {c.attendee.company}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="text-amber-400 text-xs">Request sent · Pending</span>
                      </div>
                    </div>
                    <span className="text-2xl">☕</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scheduled coffees */}
          {scheduled.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Coffee size={14} className="text-purple-400" />
                <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Scheduled Coffees</span>
                <span className="gradient-bg text-white text-xs px-2 py-0.5 rounded-full font-medium">{scheduled.length}</span>
              </div>
              <div className="flex flex-col gap-3">
                {scheduled.map((c) => (
                  <div key={c.id} className="bg-zinc-900 border border-purple-500/30 rounded-2xl p-4 flex items-center gap-3">
                    <img src={c.attendee.photo} alt={c.attendee.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm">{c.attendee.name}</div>
                      <div className="text-zinc-400 text-xs truncate">{c.attendee.role} · {c.attendee.company}</div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Calendar size={11} className="text-purple-400" />
                        <span className="text-purple-300 text-xs font-medium">{c.scheduledTime} · {c.scheduledDate}</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center text-sm shrink-0">
                      ☕
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Connections */}
          {connected.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Heart size={14} className="text-emerald-400" />
                <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Connected</span>
                <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-medium">{connected.length}</span>
              </div>
              <div className="flex flex-col gap-3">
                {connected.map((c) => (
                  <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="p-4 flex items-center gap-3">
                      <img src={c.attendee.photo} alt={c.attendee.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm">{c.attendee.name}</div>
                        <div className="text-zinc-400 text-xs truncate">{c.attendee.role} · {c.attendee.company}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-zinc-500 text-xs">Message sent</span>
                        </div>
                      </div>
                      <button className="w-8 h-8 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center hover:border-purple-500/50 transition-colors">
                        <MessageCircle size={14} className="text-zinc-400" />
                      </button>
                    </div>
                    {c.message && (
                      <div className="border-t border-zinc-800 px-4 py-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          <span className="text-zinc-500 text-xs">Your intro message</span>
                        </div>
                        <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">{c.message}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom bar */}
      <div className="px-5 pb-6 pt-2 border-t border-zinc-900">
        <button
          onClick={() => router.push("/swipe")}
          className="w-full gradient-bg text-white font-semibold py-3.5 rounded-2xl text-sm hover:opacity-90 transition-opacity"
        >
          Keep Swiping →
        </button>
      </div>
    </div>
  )
}
