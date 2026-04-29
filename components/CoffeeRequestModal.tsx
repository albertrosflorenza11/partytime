"use client"

import { useState } from "react"
import { Attendee } from "@/lib/types"
import { Check } from "lucide-react"

interface Props {
  attendee: Attendee
  userName: string
  onClose: () => void
  onSend: () => void
}

export default function CoffeeRequestModal({ attendee, userName, onClose, onSend }: Props) {
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    setSent(true)
    setTimeout(onSend, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center modal-overlay">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-t-3xl px-5 pt-5 pb-10 modal-content">
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-5" />

        {sent ? (
          <div className="flex flex-col items-center py-6">
            <div className="w-14 h-14 gradient-bg rounded-full flex items-center justify-center text-2xl mb-4">☕</div>
            <div className="text-white font-bold text-lg mb-1">Request sent!</div>
            <div className="text-zinc-400 text-sm text-center">
              {attendee.name} will see your coffee request at the event
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <img src={attendee.photo} alt={attendee.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <div className="text-white font-bold">Coffee request</div>
                <div className="text-zinc-400 text-sm">to {attendee.name} · {attendee.role} at {attendee.company}</div>
              </div>
            </div>

            {/* Info badge */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mb-5 flex gap-2.5">
              <span className="text-lg shrink-0">💡</span>
              <p className="text-zinc-400 text-xs leading-relaxed">
                This sends a direct coffee request — no match needed. {attendee.name} can accept and you'll both get notified with a time slot.
              </p>
            </div>

            {/* Message preview */}
            <div className="bg-zinc-800 rounded-xl px-4 py-3.5 mb-5">
              <div className="text-zinc-500 text-xs mb-1">Your request message</div>
              <p className="text-white text-sm leading-relaxed">
                "Hey {attendee.name}, I'd love to grab a quick coffee with you during the event! I think we'd have a lot to talk about. — {userName}"
              </p>
            </div>

            {/* Available slots preview */}
            <div className="mb-5">
              <div className="text-zinc-500 text-xs mb-2">{attendee.name}'s available slots</div>
              <div className="flex gap-2 flex-wrap">
                {attendee.availableSlots.map((slot) => (
                  <span key={slot} className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded-full">
                    ☕ {slot}
                  </span>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-zinc-800 border border-zinc-700 text-white font-medium py-3 rounded-xl text-sm hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="flex-1 gradient-bg text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                ☕ Send Request
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
