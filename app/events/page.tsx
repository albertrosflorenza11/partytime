"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Clock, Users, ArrowLeft, Loader2 } from "lucide-react"

interface LumaEvent {
  id: string
  name: string
  date: string
  endDate: string
  location: string
  coverImage: string | null
  url: string
  attendeeCount: number
  description: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
}

function formatTime(start: string, end: string) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" })
  return `${fmt(start)} – ${fmt(end)}`
}

export default function EventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<LumaEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/luma-events")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setEvents(data.events ?? [])
      })
      .catch(() => setError("Could not load events"))
      .finally(() => setLoading(false))
  }, [])

  const handleEventClick = (event: LumaEvent) => {
    setLoadingEventId(event.id)
    localStorage.setItem("partytime_event", JSON.stringify(event))
    router.push(`/match-mode?eventId=${event.id}`)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <button onClick={() => router.push("/home")} className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={22} />
        </button>
        <div className="w-6" />
      </div>

      <div className="px-5 pb-4">
        <h1 className="text-2xl font-bold text-white">Your Events</h1>
        <p className="text-zinc-400 text-sm mt-1">Tap an event to start networking</p>
      </div>

      {/* Status indicator */}
      <div className="mx-5 mb-5 bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-medium">Luma calendar synced</div>
          <div className="text-zinc-500 text-xs">Attendee profiles synced and ready</div>
        </div>
        <span className="text-emerald-400 text-xs font-medium">Live</span>
      </div>

      {/* Events list */}
      <div className="px-5 flex flex-col gap-4 pb-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={24} className="text-purple-400 animate-spin" />
            <span className="text-zinc-400 text-sm">Loading your events...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="border border-dashed border-zinc-800 rounded-2xl p-10 text-center">
            <div className="text-3xl mb-3">📅</div>
            <div className="text-white font-semibold mb-1">No upcoming events</div>
            <div className="text-zinc-500 text-sm">Create an event on Luma and it'll appear here</div>
          </div>
        )}

        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => handleEventClick(event)}
            className="cursor-pointer bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-colors active:scale-[0.98] transition-transform"
          >
            {/* Cover */}
            <div className="relative h-40 overflow-hidden bg-zinc-800">
              {event.coverImage ? (
                <img src={event.coverImage} alt={event.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full gradient-bg opacity-40" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4">
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Attending
                </span>
              </div>
            </div>

            <div className="p-4">
              <h2 className="text-white font-bold text-base leading-snug mb-3">{event.name}</h2>

              <div className="flex flex-col gap-1.5 mb-4">
                <div className="flex items-center gap-2 text-zinc-400 text-xs">
                  <Clock size={12} className="text-purple-400 shrink-0" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-xs">
                  <Clock size={12} className="text-pink-400 shrink-0" />
                  <span>{formatTime(event.date, event.endDate)}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-zinc-400 text-xs">
                    <MapPin size={12} className="text-purple-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={13} className="text-zinc-500" />
                  <span className="text-zinc-400 text-xs">{event.attendeeCount} attendees</span>
                </div>
                <button
                  className="flex items-center gap-1.5 gradient-bg text-white text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
                  disabled={!!loadingEventId}
                >
                  {loadingEventId === event.id ? (
                    <><Loader2 size={12} className="animate-spin" /> Loading...</>
                  ) : (
                    "Network Now →"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
