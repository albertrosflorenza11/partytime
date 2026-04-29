"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Check, ArrowLeft } from "lucide-react"

// ─── Data ────────────────────────────────────────────────────────────────────

const AVATAR_SEEDS = ["Felix", "Zara", "Milo", "Luna", "Kai", "Nova", "Rex", "Aya"]
const AVATAR_STYLES = ["fun-emoji", "fun-emoji", "bottts", "bottts", "avataaars", "avataaars", "lorelei", "lorelei"]
const avatarUrl = (i: number, name: string) =>
  `https://api.dicebear.com/9.x/${AVATAR_STYLES[i]}/svg?seed=${name || AVATAR_SEEDS[i]}&backgroundColor=7c3aed,ec4899,0ea5e9,10b981`

const ROLES = ["Founder / Co-founder / CEO", "Investor / VC", "Product Manager", "Engineer / Developer", "Designer", "Sales / BD", "Marketing", "Operations", "Student", "Other"]
const INDUSTRIES = ["Artificial Intelligence", "SaaS", "Fintech / Finance", "HealthTech", "EdTech", "E-commerce", "DeepTech", "Blockchain / Crypto", "CleanTech", "Dev Tools / Cloud Ops", "Consumer Goods", "Media", "Consulting", "Real Estate", "Social Media", "Productivity", "Recruitment", "Food / Beverage", "Hardware / IoT", "Biotech", "Other"]
const DEPARTMENTS = ["Leadership / Executive", "Product Development", "Engineering / Technology", "Sales", "Marketing", "Design", "Operations", "Business Development", "Investing / VC", "Finance / Accounting", "Customer Success", "Research & Development", "Legal", "Human Resources", "Strategy", "Other"]
const ORG_TYPES = ["Startup", "Corporate / Enterprise", "Venture Capital / PE", "Consulting / Agency", "Non-profit", "Academic / Research", "Government", "I'm an investor"]
const STAGES = ["Bootstrapped", "Pre-seed / < $500k", "Seed to Series A", "Series B and beyond", "Does not apply"]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
        active
          ? "gradient-bg text-white border-transparent"
          : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500"
      }`}
    >
      {active && <Check size={10} />}
      {label}
    </button>
  )
}

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors pr-10"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(1)

  // Step 1
  const [selectedAvatar, setSelectedAvatar] = useState(0)
  const [customPhoto, setCustomPhoto] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [intro, setIntro] = useState("")

  // Step 2
  const [role, setRole] = useState("")
  const [industry, setIndustry] = useState("")
  const [orgType, setOrgType] = useState("")

  // Step 3
  const [interests, setInterests] = useState<string[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [stages, setStages] = useState<string[]>([])

  const toggleTag = (list: string[], setList: (v: string[]) => void, tag: string) => {
    setList(list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag])
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setCustomPhoto(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const finalPhoto = customPhoto ?? avatarUrl(selectedAvatar, name)

  const handleFinish = () => {
    const profile = {
      name: name.trim() || "You",
      role,
      company: industry,
      photo: finalPhoto,
      bio: intro,
      tags: [...interests.slice(0, 2), ...departments.slice(0, 1)],
      interests,
      departments,
      stages,
      orgType,
    }
    localStorage.setItem("partytime_user", JSON.stringify(profile))
    router.push("/home")
  }

  const bgOrbs = (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-700 rounded-full opacity-10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-600 rounded-full opacity-10 blur-3xl" />
    </div>
  )

  const header = (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => setStep((s) => Math.max(1, s - 1))}
        className={`text-zinc-400 hover:text-white transition-colors ${step === 1 ? "invisible" : ""}`}
      >
        <ArrowLeft size={20} />
      </button>
      <div className="flex gap-1.5">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1 rounded-full transition-all duration-300 ${s === step ? "w-8 gradient-bg" : s < step ? "w-4 bg-purple-500" : "w-4 bg-zinc-700"}`} />
        ))}
      </div>
      <div className="text-zinc-600 text-xs">{step}/3</div>
    </div>
  )

  // ── Step 1: Avatar + Name + Intro ──────────────────────────────────────────
  if (step === 1) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 relative">
      {bgOrbs}
      <div className="relative z-10 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-sm">🎉</div>
          <span className="text-white font-bold text-lg">PartyTime</span>
          <span className="text-zinc-500 text-xs ml-1">· Powered by lu.ma</span>
        </div>

        {header}

        <h2 className="text-2xl font-bold text-white mb-1">Your profile</h2>
        <p className="text-zinc-400 text-sm mb-6">Pick an avatar or upload a photo</p>

        {/* Avatar grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {AVATAR_SEEDS.map((seed, i) => (
            <button
              key={i}
              onClick={() => { setSelectedAvatar(i); setCustomPhoto(null) }}
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                !customPhoto && selectedAvatar === i ? "border-purple-500 scale-105" : "border-zinc-800 hover:border-zinc-600"
              }`}
            >
              <img src={avatarUrl(i, name)} alt={seed} className="w-full h-full" />
              {!customPhoto && selectedAvatar === i && (
                <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                  <Check size={16} className="text-white drop-shadow" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Upload photo */}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        <button
          onClick={() => fileRef.current?.click()}
          className={`w-full flex items-center justify-center gap-2 border rounded-xl py-2.5 text-sm mb-6 transition-all ${
            customPhoto ? "border-purple-500 text-purple-400 bg-purple-500/10" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
          }`}
        >
          {customPhoto ? (
            <><img src={customPhoto} className="w-5 h-5 rounded-full object-cover" alt="" /> Photo uploaded ✓</>
          ) : (
            "📷  Upload your own photo"
          )}
        </button>

        {/* Name */}
        <div className="mb-3">
          <label className="text-zinc-400 text-xs font-medium block mb-1.5 ml-1">Your name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Albert Ros"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Intro */}
        <div className="mb-6">
          <label className="text-zinc-400 text-xs font-medium block mb-1.5 ml-1">
            Your one-liner <span className="text-zinc-600">({intro.length}/120)</span>
          </label>
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value.slice(0, 120))}
            placeholder="24yo founder building in SF. Obsessed with AI and community."
            rows={2}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 transition-colors resize-none"
          />
        </div>

        <button
          onClick={() => name.trim() && setStep(2)}
          disabled={!name.trim()}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-all ${name.trim() ? "gradient-bg text-white hover:opacity-90" : "bg-zinc-800 text-zinc-600 cursor-not-allowed"}`}
        >
          Continue →
        </button>
      </div>
    </div>
  )

  // ── Step 2: Role + Industry + Org type ────────────────────────────────────
  if (step === 2) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 relative">
      {bgOrbs}
      <div className="relative z-10 w-full max-w-sm">
        {header}

        <h2 className="text-2xl font-bold text-white mb-1">What you do</h2>
        <p className="text-zinc-400 text-sm mb-6">Help people know who they're meeting</p>

        <div className="flex flex-col gap-4 mb-8">
          <div>
            <label className="text-zinc-400 text-xs font-medium block mb-1.5 ml-1">Your primary function</label>
            <Select value={role} onChange={setRole} options={ROLES} placeholder="Select your role..." />
          </div>
          <div>
            <label className="text-zinc-400 text-xs font-medium block mb-1.5 ml-1">Your industry</label>
            <Select value={industry} onChange={setIndustry} options={INDUSTRIES} placeholder="Select your industry..." />
          </div>
          <div>
            <label className="text-zinc-400 text-xs font-medium block mb-1.5 ml-1">Organization type</label>
            <Select value={orgType} onChange={setOrgType} options={ORG_TYPES} placeholder="Select type..." />
          </div>
        </div>

        <button
          onClick={() => role && industry && setStep(3)}
          disabled={!role || !industry}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-all ${role && industry ? "gradient-bg text-white hover:opacity-90" : "bg-zinc-800 text-zinc-600 cursor-not-allowed"}`}
        >
          Continue →
        </button>
      </div>
    </div>
  )

  // ── Step 3: Interests ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col px-6 pt-14 pb-44 relative overflow-y-auto">
      {bgOrbs}
      <div className="relative z-10 w-full max-w-sm mx-auto">
        {header}

        <h2 className="text-2xl font-bold text-white mb-1">Your interests</h2>
        <p className="text-zinc-400 text-sm mb-6">We use these to match you with the right people</p>

        {/* Industries */}
        <div className="mb-6">
          <div className="text-zinc-300 text-sm font-semibold mb-3">Industries</div>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((t) => <Toggle key={t} label={t} active={interests.includes(t)} onClick={() => toggleTag(interests, setInterests, t)} />)}
          </div>
        </div>

        {/* Departments */}
        <div className="mb-6">
          <div className="text-zinc-300 text-sm font-semibold mb-3">Department / Areas</div>
          <div className="flex flex-wrap gap-2">
            {DEPARTMENTS.map((t) => <Toggle key={t} label={t} active={departments.includes(t)} onClick={() => toggleTag(departments, setDepartments, t)} />)}
          </div>
        </div>

        {/* Investment stage */}
        <div className="mb-8">
          <div className="text-zinc-300 text-sm font-semibold mb-3">Investment Stage</div>
          <div className="flex flex-wrap gap-2">
            {STAGES.map((t) => <Toggle key={t} label={t} active={stages.includes(t)} onClick={() => toggleTag(stages, setStages, t)} />)}
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent">
        <div className="max-w-sm mx-auto">
          <button
            onClick={handleFinish}
            className="w-full gradient-bg text-white font-semibold py-4 rounded-2xl text-base hover:opacity-90 transition-opacity"
          >
            Let&apos;s go 🎉
          </button>
        </div>
      </div>
    </div>
  )
}
