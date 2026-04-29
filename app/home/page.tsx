"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { currentUser } from "@/lib/mockData"

interface UserProfile {
  name: string
  role: string
  company: string
  photo: string
  bio?: string
  orgType?: string
  interests?: string[]
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("partytime_user")
    if (!stored) {
      router.replace("/")
      return
    }
    setUser(JSON.parse(stored))
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-700 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-600 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
        {/* Logo */}
        <div className="mb-3 flex items-center gap-2">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-xl">
            🎉
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">PartyTime</span>
        </div>

        <div className="mb-10 flex items-center gap-1.5 text-zinc-500 text-sm">
          <span>Powered by</span>
          <span className="text-white font-semibold">lu.ma</span>
        </div>

        <h1 className="text-4xl font-bold text-center leading-tight mb-4">
          Network before
          <br />
          <span className="gradient-text">you arrive.</span>
        </h1>

        <p className="text-zinc-400 text-center text-base leading-relaxed mb-10">
          Connect with attendees at your Luma events before the doors open. Swipe, match, and schedule coffee.
        </p>

        {/* User card — populated from scraped LinkedIn data */}
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-8 flex items-center gap-3">
          <img
            src={user.photo}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white">{user.name}</div>
            <div className="text-zinc-400 text-sm truncate">
              {user.role}{user.company ? ` · ${user.company}` : ""}
            </div>
            {user.bio && <div className="text-zinc-500 text-xs truncate mt-0.5">{user.bio}</div>}
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>

        <button
          onClick={() => router.push("/events")}
          className="w-full gradient-bg text-white font-semibold py-4 rounded-2xl text-base hover:opacity-90 active:scale-95 transition-all"
        >
          See My Events →
        </button>

        <p className="mt-4 text-zinc-600 text-xs text-center">
          Synced with your Luma account · Ready to network
        </p>
      </div>
    </div>
  )
}
