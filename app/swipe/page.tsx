"use client"

import { useState, useRef, useCallback, useEffect, Suspense, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { mockAttendees, mockEvent, generateAIMessage, currentUser as mockUser } from "@/lib/mockData"
import { Attendee } from "@/lib/types"
import { saveConnection } from "@/lib/store"
import MatchModal from "@/components/MatchModal"
import CoffeeRequestModal from "@/components/CoffeeRequestModal"
import { MatchMode, UserMatchProfile, rankAttendees } from "@/lib/matchEngine"
import { ArrowLeft, X, Heart, Coffee, Users, Link2, Loader2 } from "lucide-react"

type SwipeDir = "left" | "right" | null

const MATCH_TYPE_STYLES: Record<string, string> = {
  "similar":       "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "complementary": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "high-upside":   "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
}
const MATCH_TYPE_ICON: Record<string, string> = {
  "similar": "👥", "complementary": "🔀", "high-upside": "⚡",
}

function scoreColor(s: number) {
  if (s >= 80) return "text-emerald-400"
  if (s >= 65) return "text-yellow-400"
  if (s >= 45) return "text-orange-400"
  return "text-zinc-500"
}

function getInitialState() {
  if (typeof window === "undefined") return { attendees: mockAttendees, userProfile: null as UserMatchProfile | null, userPhoto: mockUser.photo, msgUser: { name: mockUser.name, role: mockUser.role, company: mockUser.company } }
  try {
    const stored = JSON.parse(localStorage.getItem("partytime_user") ?? "{}")
    const mode = (localStorage.getItem("partytime_match_mode") as MatchMode) || "complementary"
    const compWeight = parseFloat(localStorage.getItem("partytime_comp_weight") || "0.6")
    const profile: UserMatchProfile = {
      role: stored.role ?? "Founder / Co-founder / CEO",
      interests: stored.interests ?? [],
      stages: stored.stages ?? [],
      orgType: stored.orgType ?? "Startup",
      company: stored.company ?? "",
    }
    return {
      attendees: rankAttendees(profile, mockAttendees, mode, 1 - compWeight),
      userProfile: profile,
      userPhoto: stored.photo ?? mockUser.photo,
      msgUser: { name: stored.name ?? mockUser.name, role: stored.role ?? mockUser.role, company: stored.company ?? mockUser.company },
    }
  } catch {
    return { attendees: mockAttendees, userProfile: null as UserMatchProfile | null, userPhoto: mockUser.photo, msgUser: { name: mockUser.name, role: mockUser.role, company: mockUser.company } }
  }
}

function SwipeContent() {
  const router = useRouter()
  const params = useSearchParams()
  const eventId = params.get("eventId")

  const init = useMemo(() => getInitialState(), [])

  const [attendees, setAttendees] = useState<Attendee[]>(init.attendees)
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState("Fetching attendees...")
  const [eventName, setEventName] = useState(mockEvent.name)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeDir, setSwipeDir] = useState<SwipeDir>(null)
  const [matchCount, setMatchCount] = useState(0)

  const [showMatch, setShowMatch] = useState<Attendee | null>(null)
  const [showRequest, setShowRequest] = useState<Attendee | null>(null)
  const [pendingMatchAttendee, setPendingMatchAttendee] = useState<Attendee | null>(null)

  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)

  const { userPhoto, msgUser, userProfile } = init

  useEffect(() => {
    const storedEvent = localStorage.getItem("partytime_event")
    if (storedEvent) {
      try { setEventName(JSON.parse(storedEvent).name ?? mockEvent.name) } catch {}
    }
    if (!eventId) return

    setLoading(true)
    const stepMsgs = ["Fetching attendees from Luma...", "Enriching LinkedIn profiles...", "Building matches..."]
    let i = 0
    setLoadingMsg(stepMsgs[0])
    const interval = setInterval(() => { if (i < stepMsgs.length - 1) setLoadingMsg(stepMsgs[++i]) }, 3500)

    fetch(`/api/luma-attendees?eventId=${eventId}`)
      .then(r => r.json())
      .then(data => {
        clearInterval(interval)
        if (data.attendees?.length > 0) {
          const mode = (localStorage.getItem("partytime_match_mode") as MatchMode) || "complementary"
          const compWeight = parseFloat(localStorage.getItem("partytime_comp_weight") || "0.6")
          if (userProfile) {
            setAttendees(rankAttendees(userProfile, data.attendees, mode, 1 - compWeight))
          } else {
            setAttendees(data.attendees)
          }
        }
      })
      .catch(() => clearInterval(interval))
      .finally(() => setLoading(false))

    return () => clearInterval(interval)
  }, [eventId, userProfile])

  const attendee = attendees[currentIndex]

  const triggerSwipe = useCallback((dir: "left" | "right") => {
    if (swipeDir) return
    setSwipeDir(dir)
    setTimeout(() => {
      if (dir === "right" && attendee) {
        setPendingMatchAttendee(attendee)
        setMatchCount(c => c + 1)
      }
      setCurrentIndex(i => i + 1)
      setSwipeDir(null)
      setDragOffset({ x: 0, y: 0 })
    }, 350)
  }, [swipeDir, attendee])

  useEffect(() => {
    if (pendingMatchAttendee) {
      const t = setTimeout(() => { setShowMatch(pendingMatchAttendee); setPendingMatchAttendee(null) }, 100)
      return () => clearTimeout(t)
    }
  }, [pendingMatchAttendee])

  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = { x: e.clientX, y: e.clientY }
    isDragging.current = true
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !dragStart.current) return
    setDragOffset({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y })
  }
  const onPointerUp = () => {
    if (!isDragging.current) return
    isDragging.current = false
    const { x } = dragOffset
    if (x > 80) triggerSwipe("right")
    else if (x < -80) triggerSwipe("left")
    else setDragOffset({ x: 0, y: 0 })
    dragStart.current = null
  }

  const getCardStyle = () => {
    if (swipeDir === "left")  return { transform: "translateX(-140%) rotate(-20deg)", opacity: 0, transition: "all 0.35s ease" }
    if (swipeDir === "right") return { transform: "translateX(140%) rotate(20deg)", opacity: 0, transition: "all 0.35s ease" }
    if (dragOffset.x !== 0)  return { transform: `translateX(${dragOffset.x}px) rotate(${dragOffset.x * 0.08}deg)`, transition: "none" }
    return { transform: "translateX(0) rotate(0deg)", opacity: 1, transition: "all 0.3s ease" }
  }

  const dragHint = dragOffset.x > 40 ? "right" : dragOffset.x < -40 ? "left" : null

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 text-center gap-4">
        <div className="w-14 h-14 rounded-full border-4 border-zinc-800 border-t-purple-500 animate-spin" />
        <div className="text-white font-semibold">{loadingMsg}</div>
        <div className="text-zinc-500 text-sm">Powered by PartyTime</div>
      </div>
    )
  }

  if (currentIndex >= attendees.length) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-white mb-2">You&apos;re all caught up!</h2>
        <p className="text-zinc-400 mb-6">{attendees.length} people seen · {matchCount} matches made</p>
        <button onClick={() => router.push("/connections")} className="gradient-bg text-white font-semibold py-3.5 px-8 rounded-2xl hover:opacity-90">
          See Your Connections →
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-2 z-10">
        <button onClick={() => router.push("/events")} className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={22} />
        </button>
        <div className="text-center">
          <div className="text-white font-semibold text-sm truncate max-w-[180px]">{eventName}</div>
          <div className="text-zinc-500 text-xs">{currentIndex + 1} of {attendees.length} attendees</div>
        </div>
        <button onClick={() => router.push("/connections")} className="relative text-zinc-400 hover:text-white transition-colors">
          <Users size={22} />
          {matchCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 gradient-bg rounded-full text-white text-xs flex items-center justify-center font-bold">
              {matchCount}
            </span>
          )}
        </button>
      </div>

      {/* Swipe direction labels */}
      <div className="flex justify-between items-center px-6 py-1 h-8">
        <span className={`text-red-400 font-bold text-sm border border-red-400 rounded px-2 py-0.5 transition-opacity duration-150 ${dragHint === "left" ? "opacity-100" : "opacity-0"}`}>SKIP</span>
        <span className="opacity-0 text-sm">·</span>
        <span className={`text-emerald-400 font-bold text-sm border border-emerald-400 rounded px-2 py-0.5 transition-opacity duration-150 ${dragHint === "right" ? "opacity-100" : "opacity-0"}`}>CONNECT</span>
      </div>

      {/* Card stack */}
      <div className="flex-1 flex items-center justify-center px-5" style={{ minHeight: 0 }}>
        <div className="relative w-full max-w-sm" style={{ height: 520 }}>
          {/* Next card preview */}
          {currentIndex + 1 < attendees.length && (
            <div className="absolute inset-0 bg-zinc-900 rounded-3xl overflow-hidden scale-[0.96] translate-y-3"
              style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
              <img src={attendees[currentIndex + 1].photo} alt="" className="w-full h-56 object-cover" />
            </div>
          )}

          {attendee && (
            <div
              className="absolute inset-0 bg-zinc-900 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing"
              style={{ ...getCardStyle(), boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              {/* Photo */}
              <div className="relative h-56 overflow-hidden pointer-events-none">
                <img src={attendee.photo} alt={attendee.name} className="w-full h-full object-cover" draggable={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
                {attendee.mutualConnections > 0 && (
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-1 flex items-center gap-1">
                    <Link2 size={11} className="text-blue-400" />
                    <span className="text-white text-xs">{attendee.mutualConnections} mutual</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-white font-bold text-xl leading-tight">{attendee.name}</h3>
                  <div className="text-zinc-300 text-sm">{attendee.role}{attendee.company ? ` · ${attendee.company}` : ""}</div>
                </div>
              </div>

              {/* Match score banner */}
              {attendee.matchScore !== undefined && (
                <div className="px-4 py-2 border-b border-zinc-800/60 flex items-center gap-2 pointer-events-none">
                  <span className={`text-base font-bold tabular-nums shrink-0 ${scoreColor(attendee.matchScore)}`}>
                    {attendee.matchScore}%
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full border shrink-0 ${MATCH_TYPE_STYLES[attendee.matchType ?? "similar"]}`}>
                    {MATCH_TYPE_ICON[attendee.matchType ?? "similar"]} {attendee.matchType}
                  </span>
                  {attendee.matchReason && (
                    <span className="text-zinc-400 text-xs truncate flex-1 italic">{attendee.matchReason}</span>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-4 pointer-events-none">
                <p className="text-zinc-400 text-xs leading-relaxed mb-2.5 line-clamp-2">{attendee.bio}</p>
                <div className="flex flex-col gap-1.5 mb-2.5">
                  {attendee.highlights.slice(0, 2).map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-purple-400 text-xs mt-0.5 shrink-0">▸</span>
                      <span className="text-zinc-300 text-xs leading-relaxed line-clamp-1">{h}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {attendee.tags.map(tag => (
                    <span key={tag} className="bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Button legend */}
      <div className="flex items-center justify-center gap-8 pb-1">
        <span className="text-zinc-600 text-xs">Skip</span>
        <span className="text-zinc-600 text-xs">Coffee request</span>
        <span className="text-zinc-600 text-xs">Match</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-5 px-8 pb-10 pt-2">
        <button
          onClick={() => triggerSwipe("left")}
          className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:border-red-500/50 hover:bg-red-500/10 transition-all active:scale-90"
        >
          <X size={22} className="text-red-400" />
        </button>
        <button
          onClick={() => attendee && setShowRequest(attendee)}
          className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:border-purple-500/50 hover:bg-purple-500/10 transition-all active:scale-90"
        >
          <Coffee size={18} className="text-purple-400" />
        </button>
        <button
          onClick={() => triggerSwipe("right")}
          className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all active:scale-90"
        >
          <Heart size={22} className="text-emerald-400" />
        </button>
      </div>

      {showMatch && (
        <MatchModal
          attendee={showMatch}
          userPhoto={userPhoto}
          message={generateAIMessage(showMatch, msgUser)}
          onClose={() => setShowMatch(null)}
          onSchedule={time => {
            saveConnection({ id: `${showMatch.id}-sched-${Date.now()}`, attendee: showMatch, type: "scheduled", scheduledDate: mockEvent.date, scheduledTime: time, createdAt: new Date().toISOString() })
            saveConnection({ id: `${showMatch.id}-conn-${Date.now()}`, attendee: showMatch, type: "connected", message: generateAIMessage(showMatch, msgUser), createdAt: new Date().toISOString() })
            setShowMatch(null)
          }}
        />
      )}

      {showRequest && (
        <CoffeeRequestModal
          attendee={showRequest}
          userName={msgUser.name}
          onClose={() => setShowRequest(null)}
          onSend={() => {
            saveConnection({ id: `${showRequest.id}-req-${Date.now()}`, attendee: showRequest, type: "requested", createdAt: new Date().toISOString() })
            setShowRequest(null)
          }}
        />
      )}
    </div>
  )
}

export default function SwipePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 size={24} className="text-purple-400 animate-spin" />
      </div>
    }>
      <SwipeContent />
    </Suspense>
  )
}
