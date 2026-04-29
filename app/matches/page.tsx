"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { MatchMode, UserMatchProfile, rankAttendees } from "@/lib/matchEngine"
import { mockAttendees } from "@/lib/mockData"
import { generateProfiles } from "@/lib/generateProfiles"
import { Attendee } from "@/lib/types"

const MODE_LABELS = { similar: "Similar", complementary: "Complementary", custom: "Custom" }

const MATCH_TYPE_STYLES: Record<string, string> = {
  "similar":       "bg-blue-500/15 text-blue-300 border-blue-500/30",
  "complementary": "bg-purple-500/15 text-purple-300 border-purple-500/30",
  "high-upside":   "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
}

const MATCH_TYPE_ICON: Record<string, string> = {
  "similar":       "👥",
  "complementary": "🔀",
  "high-upside":   "⚡",
}

function scoreBarWidth(score: number) { return `${score}%` }
function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-400"
  if (score >= 65) return "text-yellow-400"
  if (score >= 45) return "text-orange-400"
  return "text-zinc-500"
}
function barColor(score: number) {
  if (score >= 80) return "bg-emerald-500"
  if (score >= 65) return "bg-yellow-500"
  if (score >= 45) return "bg-orange-400"
  return "bg-zinc-600"
}

function MatchesContent() {
  const router = useRouter()
  const params = useSearchParams()
  const eventId = params.get("eventId")

  const [mode, setMode] = useState<MatchMode>("complementary")
  const [compWeight, setCompWeight] = useState(0.6)
  const [user, setUser] = useState<UserMatchProfile | null>(null)
  const [showCount, setShowCount] = useState(40)

  const eventName = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("partytime_event") || "{}").name ?? "AI Builders Happy Hour" } catch { return "AI Builders Happy Hour" }
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem("partytime_user")
    if (!stored) { router.replace("/"); return }
    const p = JSON.parse(stored)
    setUser({
      role: p.role ?? "Founder / Co-founder / CEO",
      interests: p.interests ?? [],
      stages: p.stages ?? [],
      orgType: p.orgType ?? "Startup",
      company: p.company ?? "",
    })
    const savedMode = localStorage.getItem("partytime_match_mode") as MatchMode
    if (savedMode && ["similar","complementary","custom"].includes(savedMode)) setMode(savedMode)
    const savedComp = parseFloat(localStorage.getItem("partytime_comp_weight") || "0.6")
    if (!isNaN(savedComp)) setCompWeight(savedComp)
  }, [router])

  const allProfiles = useMemo(() => [...mockAttendees, ...generateProfiles(200)], [])

  const ranked = useMemo<Attendee[]>(() => {
    if (!user) return []
    return rankAttendees(user, allProfiles, mode, 1 - compWeight)
  }, [user, allProfiles, mode, compWeight])

  const strong = ranked.filter(a => (a.matchScore ?? 0) >= 80).length
  const good   = ranked.filter(a => (a.matchScore ?? 0) >= 60 && (a.matchScore ?? 0) < 80).length
  const low    = ranked.filter(a => (a.matchScore ?? 0) < 60).length

  const changeMode = (m: MatchMode) => {
    setMode(m)
    localStorage.setItem("partytime_match_mode", m)
    setShowCount(40)
  }

  const startSwiping = () => {
    localStorage.setItem("partytime_match_mode", mode)
    const url = eventId ? `/swipe?eventId=${eventId}` : "/swipe"
    router.push(url)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col pb-32">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-zinc-950 border-b border-zinc-800/60 px-5 pt-14 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => router.back()} className="text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </button>
          <div className="text-center">
            <div className="text-white font-semibold text-sm">{ranked.length} people ranked</div>
            <div className="text-zinc-500 text-xs truncate max-w-[200px]">{eventName}</div>
          </div>
          <button onClick={startSwiping} className="text-purple-400 text-sm font-semibold flex items-center gap-1">
            Swipe <ArrowRight size={16} />
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-2">
          {(["similar","complementary","custom"] as MatchMode[]).map(m => (
            <button
              key={m}
              onClick={() => changeMode(m)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                mode === m ? "gradient-bg text-white border-transparent" : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600"
              }`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        {mode === "custom" && (
          <div className="mt-3 px-1">
            <div className="flex justify-between text-xs text-zinc-500 mb-1">
              <span>← Similar</span>
              <span>Complementary →</span>
            </div>
            <input
              type="range" min={0} max={1} step={0.1}
              value={compWeight}
              onChange={e => { const v = parseFloat(e.target.value); setCompWeight(v); localStorage.setItem("partytime_comp_weight", String(v)) }}
              className="w-full accent-pink-500"
            />
          </div>
        )}
      </div>

      {/* Stats strip */}
      <div className="px-5 py-2.5 flex items-center gap-4 text-xs border-b border-zinc-800/40">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-zinc-400"><span className="text-white font-semibold">{strong}</span> strong matches</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
          <span className="text-zinc-400"><span className="text-white font-semibold">{good}</span> good</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-zinc-600 shrink-0" />
          <span className="text-zinc-400"><span className="text-white font-semibold">{low}</span> low match</span>
        </div>
      </div>

      {!user && (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={24} className="text-purple-400 animate-spin" />
        </div>
      )}

      {/* Ranked list */}
      <div className="px-4 pt-3 flex flex-col gap-2">
        {ranked.slice(0, showCount).map((attendee, idx) => (
          <div key={attendee.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex items-center gap-3 hover:border-zinc-700 transition-colors">
            {/* Rank number */}
            <div className="w-6 text-center text-zinc-600 text-xs font-bold shrink-0">#{idx + 1}</div>

            {/* Photo */}
            <img src={attendee.photo} alt={attendee.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-zinc-700" />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-white text-sm font-semibold truncate">{attendee.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full border shrink-0 ${MATCH_TYPE_STYLES[attendee.matchType ?? "similar"]}`}>
                  {MATCH_TYPE_ICON[attendee.matchType ?? "similar"]} {attendee.matchType}
                </span>
              </div>
              <div className="text-zinc-500 text-xs truncate">{attendee.role} · {attendee.company}</div>
              {attendee.matchReason && (
                <div className="text-zinc-400 text-xs truncate mt-0.5 italic">"{attendee.matchReason}"</div>
              )}
            </div>

            {/* Score */}
            <div className="flex flex-col items-end shrink-0 gap-1 ml-1">
              <span className={`text-sm font-bold tabular-nums ${scoreColor(attendee.matchScore ?? 0)}`}>
                {attendee.matchScore}%
              </span>
              <div className="w-14 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor(attendee.matchScore ?? 0)}`}
                  style={{ width: scoreBarWidth(attendee.matchScore ?? 0) }}
                />
              </div>
            </div>
          </div>
        ))}

        {showCount < ranked.length && (
          <button
            onClick={() => setShowCount(c => c + 40)}
            className="w-full py-3 text-zinc-500 text-sm border border-zinc-800 rounded-xl hover:border-zinc-600 hover:text-zinc-400 transition-all"
          >
            Load more — {ranked.length - showCount} remaining
          </button>
        )}
      </div>

      {/* CTA footer */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent">
        <button
          onClick={startSwiping}
          className="w-full gradient-bg text-white font-semibold py-4 rounded-2xl text-base hover:opacity-90 active:scale-95 transition-all"
        >
          Start Swiping Your Top Matches →
        </button>
        <p className="text-center text-zinc-600 text-xs mt-2">
          Showing top ranked first · Mode: {MODE_LABELS[mode]}
        </p>
      </div>
    </div>
  )
}

export default function MatchesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 size={24} className="text-purple-400 animate-spin" />
      </div>
    }>
      <MatchesContent />
    </Suspense>
  )
}
