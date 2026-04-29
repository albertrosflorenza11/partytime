"use client"

import { useState } from "react"
import { Attendee } from "@/lib/types"
import { X, Copy, Check, Send } from "lucide-react"

interface Props {
  attendee: Attendee
  message: string
  onClose: () => void
  onSend: (message: string) => void
}

export default function MessageModal({ attendee, message, onClose, onSend }: Props) {
  const [text, setText] = useState(message)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center modal-overlay">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-t-3xl px-5 pt-5 pb-8 modal-content">
        {/* Handle */}
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-5" />

        {/* Match header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative">
            <img src={attendee.photo} alt={attendee.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 gradient-bg rounded-full flex items-center justify-center text-xs">
              ✓
            </div>
          </div>
          <div>
            <div className="font-bold text-white">Matched with {attendee.name}!</div>
            <div className="text-zinc-400 text-sm">{attendee.role} at {attendee.company}</div>
          </div>
        </div>

        {/* AI label */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full px-2.5 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-purple-300 text-xs font-medium">AI-crafted intro message</span>
          </div>
        </div>

        {/* Message textarea */}
        <div className="relative mb-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm leading-relaxed resize-none focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Action hint */}
        <p className="text-zinc-500 text-xs mb-4 text-center">
          Edit the message or send as-is. {attendee.name} will receive it on LinkedIn.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 border border-zinc-700 text-white font-medium py-3 rounded-xl text-sm hover:bg-zinc-700 transition-colors"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={() => onSend(text)}
            className="flex-2 flex-1 flex items-center justify-center gap-2 gradient-bg text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            <Send size={16} />
            Send Message
          </button>
        </div>
      </div>
    </div>
  )
}
