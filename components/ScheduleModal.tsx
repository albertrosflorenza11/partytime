"use client"

import { useState } from "react"
import { Attendee } from "@/lib/types"
import { X, Coffee, Check } from "lucide-react"

interface Props {
  attendee: Attendee
  onClose: () => void
  onSchedule: (date: string, time: string) => void
}

const EVENT_DATE = "Thursday, May 1, 2025"

const TIME_SLOTS = [
  { label: "6:15 PM", sub: "Right at arrival" },
  { label: "6:45 PM", sub: "After introductions" },
  { label: "7:30 PM", sub: "Mid-event" },
  { label: "8:00 PM", sub: "Late evening" },
  { label: "8:30 PM", sub: "Before it wraps up" },
]

export default function ScheduleModal({ attendee, onClose, onSchedule }: Props) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [scheduled, setScheduled] = useState(false)

  const handleSchedule = () => {
    if (!selectedSlot) return
    setScheduled(true)
    setTimeout(() => {
      onSchedule(EVENT_DATE, selectedSlot)
    }, 1200)
  }

  if (scheduled) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center modal-overlay">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-t-3xl px-5 pt-5 pb-8 modal-content flex flex-col items-center">
          <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-6" />
          <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mb-4">
            <Check size={28} className="text-white" />
          </div>
          <div className="text-xl font-bold text-white mb-2">Coffee Scheduled!</div>
          <div className="text-zinc-400 text-sm text-center">
            You&apos;re meeting <span className="text-white font-medium">{attendee.name}</span> at {selectedSlot} during the event.
          </div>
          <div className="mt-4 bg-zinc-800 rounded-xl px-4 py-3 text-center w-full">
            <div className="text-zinc-400 text-xs">📍 {EVENT_DATE}</div>
            <div className="text-white font-semibold mt-1">☕ {selectedSlot} — The Interval at Fort Mason</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center modal-overlay">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-t-3xl px-5 pt-5 pb-8 modal-content">
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-5" />

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center">
            <Coffee size={18} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-white">Schedule a coffee</div>
            <div className="text-zinc-400 text-sm">with {attendee.name} during the event</div>
          </div>
        </div>

        {/* Event badge */}
        <div className="mb-5 mt-3 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="text-lg">📅</span>
          <div>
            <div className="text-white text-sm font-medium">AI Builders Happy Hour SF</div>
            <div className="text-zinc-400 text-xs">{EVENT_DATE} · Fort Mason, SF</div>
          </div>
        </div>

        {/* Time slots */}
        <div className="mb-5">
          <div className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-3">Pick a time</div>
          <div className="flex flex-col gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot.label}
                onClick={() => setSelectedSlot(slot.label)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                  selectedSlot === slot.label
                    ? "border-purple-500 bg-purple-500/10 text-white"
                    : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600"
                }`}
              >
                <div>
                  <div className="font-semibold text-sm">{slot.label}</div>
                  <div className="text-zinc-500 text-xs">{slot.sub}</div>
                </div>
                {selectedSlot === slot.label && (
                  <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSchedule}
          disabled={!selectedSlot}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
            selectedSlot
              ? "gradient-bg text-white hover:opacity-90"
              : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          }`}
        >
          {selectedSlot ? `Schedule for ${selectedSlot} ☕` : "Select a time slot"}
        </button>
      </div>
    </div>
  )
}
