"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Users, Shuffle, SlidersHorizontal, Loader2 } from "lucide-react"

const MODES = [
  {
    id: "similar" as const,
    Icon: Users,
    label: "Find My People",
    badge: "Similar",
    desc: "Meet people who get where you're coming from — same role, same industry, same stage of the game.",
    border: "border-blue-500/50 bg-blue-500/8",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    badgeColor: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  },
  {
    id: "complementary" as const,
    Icon: Shuffle,
    label: "Find My Edge",
    badge: "Complementary",
    desc: "Match with people who have what you don't. Investor meets founder. Engineer meets designer. The magic lives in the gap.",
    border: "border-purple-500/50 bg-purple-500/8",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-400",
    badgeColor: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
    recommended: true,
  },
  {
    id: "custom" as const,
    Icon: SlidersHorizontal,
    label: "I'll Decide",
    badge: "Custom Mix",
    desc: "Set your own balance between similarity and complementarity. For when you know exactly what kind of conversation you want.",
    border: "border-pink-500/50 bg-pink-500/8",
    iconBg: "bg-pink-500/20",
    iconColor: "text-pink-400",
    badgeColor: "bg-pink-500/20 text-pink-300 border border-pink-500/30",
  },
]

function MatchModeContent() {
  const router = useRouter()
  const params = useSearchParams()
  const eventId = params.get("eventId")
  const [selected, setSelected] = useState<"similar" | "complementary" | "custom">("complementary")
  const [compWeight, setCompWeight] = useState(0.6)

  const go = () => {
    localStorage.setItem("partytime_match_mode", selected)
    localStorage.setItem("partytime_comp_weight", String(compWeight))
    router.push(eventId ? `/matches?eventId=${eventId}` : "/matches")
  }

  const hints: Record<string, string> = {
    similar: "You'll see people most like you at the top",
    complementary: "You'll see people with what you need most",
    custom: `${Math.round(compWeight * 100)}% complementary · ${Math.round((1 - compWeight) * 100)}% similar`,
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col px-5 pt-14 pb-10">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.back()} className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">How do you want to match?</h1>
          <p className="text-zinc-400 text-sm mt-0.5">Shapes who rises to the top of your feed</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelected(m.id)}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all relative ${
              selected === m.id ? m.border : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            }`}
          >
            {m.recommended && (
              <span className="absolute top-3 right-3 gradient-bg text-white text-xs px-2 py-0.5 rounded-full font-medium">
                Recommended
              </span>
            )}
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selected === m.id ? m.iconBg : "bg-zinc-800"}`}>
                <m.Icon size={18} className={selected === m.id ? m.iconColor : "text-zinc-500"} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{m.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${m.badgeColor}`}>{m.badge}</span>
              </div>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">{m.desc}</p>

            {m.id === "custom" && selected === "custom" && (
              <div className="mt-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between text-xs text-zinc-500 mb-2">
                  <span>← More Similar</span>
                  <span>More Complementary →</span>
                </div>
                <input
                  type="range" min={0} max={1} step={0.1}
                  value={compWeight}
                  onChange={e => setCompWeight(parseFloat(e.target.value))}
                  className="w-full accent-pink-500"
                />
                <div className="text-center text-xs text-zinc-400 mt-1">
                  {Math.round(compWeight * 100)}% complementary · {Math.round((1 - compWeight) * 100)}% similar
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-auto">
        <button
          onClick={go}
          className="w-full gradient-bg text-white font-semibold py-4 rounded-2xl text-base hover:opacity-90 active:scale-95 transition-all"
        >
          See My Ranked Matches →
        </button>
        <p className="text-center text-zinc-600 text-xs mt-3">{hints[selected]}</p>
      </div>
    </div>
  )
}

export default function MatchModePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 size={24} className="text-purple-400 animate-spin" />
      </div>
    }>
      <MatchModeContent />
    </Suspense>
  )
}
