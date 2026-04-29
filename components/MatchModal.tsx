"use client"

import { useState } from "react"
import { Attendee } from "@/lib/types"
import { Copy, Check, ArrowRight } from "lucide-react"

interface Props {
  attendee: Attendee
  userPhoto: string
  message: string
  onClose: () => void
  onSchedule: (time: string) => void
}

type View = "match" | "schedule"

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
  return "text-orange-400"
}

export default function MatchModal({ attendee, userPhoto, message, onClose, onSchedule }: Props) {
  const [view, setView] = useState<View>("match")
  const [text, setText] = useState(message)
  const [copied, setCopied] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirmSchedule = () => {
    if (!selectedSlot) return
    setConfirmed(true)
    setTimeout(() => onSchedule(selectedSlot), 1200)
  }

  if (view === "schedule") {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center modal-overlay">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-t-3xl px-5 pt-5 pb-10 modal-content">
          <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-5" />

          {confirmed ? (
            <div className="flex flex-col items-center py-6">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center text-2xl mb-4">☕</div>
              <div className="text-white font-bold text-xl mb-1">Coffee booked!</div>
              <div className="text-zinc-400 text-sm text-center">
                Meeting <span className="text-white font-medium">{attendee.name}</span> at {selectedSlot}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5">
                <img src={attendee.photo} alt={attendee.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="text-white font-semibold text-sm">{attendee.name}&apos;s available slots</div>
                  <div className="text-zinc-400 text-xs">During the event · Tonight</div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-6">
                {attendee.availableSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all ${
                      selectedSlot === slot
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">☕</span>
                      <div className="text-left">
                        <div className="text-white font-semibold text-sm">{slot}</div>
                        <div className="text-zinc-500 text-xs">Available · During event</div>
                      </div>
                    </div>
                    {selectedSlot === slot && (
                      <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                        <Check size={11} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setView("match")}
                  className="flex-1 bg-zinc-800 border border-zinc-700 text-white font-medium py-3 rounded-xl text-sm hover:bg-zinc-700 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmSchedule}
                  disabled={!selectedSlot}
                  className={`flex-1 font-semibold py-3 rounded-xl text-sm transition-all ${
                    selectedSlot ? "gradient-bg text-white hover:opacity-90" : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  }`}
                >
                  Confirm ☕
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  const hasScore = attendee.matchScore !== undefined

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden modal-content max-h-[90vh] overflow-y-auto">
        <div className="px-5 pt-8 pb-6">
          {/* Match header */}
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center mb-4">
              <img src={userPhoto} alt="You" className="w-16 h-16 rounded-full object-cover border-2 border-zinc-900 ring-2 ring-purple-500" />
              <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center text-lg -mx-2 z-10 shadow-lg">🎉</div>
              <img src={attendee.photo} alt={attendee.name} className="w-16 h-16 rounded-full object-cover border-2 border-zinc-900 ring-2 ring-pink-500" />
            </div>
            <div className="text-2xl font-bold gradient-text mb-1">It&apos;s a Match!</div>
            <div className="text-zinc-400 text-sm text-center">
              You and <span className="text-white font-medium">{attendee.name}</span> both want to connect
            </div>
          </div>

          {/* Algorithm score strip */}
          {hasScore && (
            <div className="flex items-center gap-2 bg-zinc-800/60 border border-zinc-700/60 rounded-xl px-3 py-2 mb-4">
              <span className={`text-lg font-bold tabular-nums ${scoreColor(attendee.matchScore!)}`}>
                {attendee.matchScore}%
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full border ${MATCH_TYPE_STYLES[attendee.matchType ?? "similar"]}`}>
                {MATCH_TYPE_ICON[attendee.matchType ?? "similar"]} {attendee.matchType}
              </span>
              {attendee.matchReason && (
                <span className="text-zinc-400 text-xs truncate flex-1 italic">{attendee.matchReason}</span>
              )}
            </div>
          )}

          {/* AI message */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span className="text-zinc-500 text-xs">AI-crafted opener</span>
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-3 text-white text-sm leading-relaxed resize-none focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Conversation starters */}
          {attendee.conversationAngles && attendee.conversationAngles.length > 0 && (
            <div className="mb-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-3">
              <div className="text-zinc-500 text-xs font-medium mb-2 flex items-center gap-1.5">
                <span>💬</span> Conversation starters
              </div>
              <div className="flex flex-col gap-1.5">
                {attendee.conversationAngles.map((angle, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-purple-400 text-xs mt-0.5 shrink-0">{i + 1}.</span>
                    <span className="text-zinc-300 text-xs leading-relaxed">{angle}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Value exchange */}
          {attendee.valueExchange && (
            <div className="mb-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-3 py-2.5">
              <div className="text-zinc-500 text-xs font-medium mb-1 flex items-center gap-1">
                <span>🤝</span> Value exchange
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">{attendee.valueExchange}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 border border-zinc-700 text-white font-medium py-3 rounded-xl text-sm hover:bg-zinc-700 transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={() => setView("schedule")}
              className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 border border-zinc-700 text-white font-medium py-3 rounded-xl text-sm hover:border-purple-500/50 hover:bg-purple-500/10 transition-colors"
            >
              <span>☕</span> Schedule
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full gradient-bg text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            Keep swiping <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
