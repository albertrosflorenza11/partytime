import { Attendee } from "./types"

export type MatchMode = "similar" | "complementary" | "custom"

export interface UserMatchProfile {
  role: string
  interests: string[]
  stages: string[]
  orgType: string
  company?: string
}

function categorizeRole(role: string): string {
  const r = role.toLowerCase()
  if (r.includes("founder") || r.includes("ceo") || r.includes("co-founder")) return "founder"
  if (r.includes("investor") || r.includes("vc") || r.includes("partner") || r.includes("principal") || r.includes("associate")) return "investor"
  if (r.includes("product") || r.includes("head of product") || r.includes(" pm")) return "product"
  if (r.includes("engineer") || r.includes("developer") || r.includes("cto") || r.includes("software") || r.includes("staff eng") || r.includes("ml eng")) return "engineer"
  if (r.includes("design")) return "designer"
  if (r.includes("growth") || r.includes("marketing") || r.includes("brand") || r.includes("content")) return "growth"
  if (r.includes("sales") || r.includes("business dev") || r.includes(" bd") || r.includes("revenue")) return "sales"
  if (r.includes("research") || r.includes("scientist") || r.includes("phd") || r.includes("data sci")) return "researcher"
  if (r.includes("student") || r.includes("intern")) return "student"
  return "other"
}

// Complementary matrix: base score when user_role meets attendee_role (max 40)
const COMP: Record<string, Record<string, number>> = {
  founder:    { investor: 40, engineer: 34, researcher: 30, designer: 27, product: 25, growth: 21, sales: 19, founder: 16, student: 12, other: 8 },
  investor:   { founder: 40, researcher: 22, engineer: 20, product: 18, growth: 15, designer: 13, sales: 11, investor: 9, student: 11, other: 5 },
  product:    { engineer: 30, designer: 30, founder: 23, growth: 22, researcher: 19, sales: 15, product: 15, investor: 12, student: 10, other: 5 },
  engineer:   { founder: 34, designer: 27, product: 25, researcher: 23, growth: 17, investor: 14, engineer: 14, sales: 9, student: 16, other: 5 },
  designer:   { founder: 28, engineer: 26, product: 26, growth: 19, researcher: 14, investor: 11, designer: 11, sales: 9, student: 13, other: 5 },
  growth:     { founder: 23, product: 23, engineer: 17, sales: 21, designer: 18, investor: 13, researcher: 14, growth: 13, student: 11, other: 5 },
  researcher: { founder: 27, investor: 22, engineer: 23, product: 20, designer: 14, growth: 13, researcher: 13, sales: 9, student: 17, other: 5 },
  sales:      { founder: 21, growth: 23, engineer: 13, product: 15, designer: 11, investor: 12, researcher: 9, sales: 11, student: 9, other: 5 },
  student:    { founder: 25, investor: 20, engineer: 22, product: 18, researcher: 20, designer: 15, growth: 15, sales: 11, student: 10, other: 5 },
  other:      { founder: 13, engineer: 13, product: 12, designer: 11, growth: 11, researcher: 11, investor: 9, sales: 9, student: 9, other: 7 },
}

// Similarity matrix: base score when same/adjacent roles meet (max 40)
const SIM: Record<string, Record<string, number>> = {
  founder:    { founder: 40, product: 23, growth: 19, sales: 17, designer: 15, engineer: 13, researcher: 11, investor: 8, student: 13, other: 5 },
  investor:   { investor: 40, founder: 15, researcher: 16, product: 12, engineer: 9, growth: 9, designer: 7, sales: 7, student: 8, other: 4 },
  product:    { product: 40, founder: 23, designer: 30, growth: 23, engineer: 21, researcher: 20, sales: 15, investor: 9, student: 13, other: 5 },
  engineer:   { engineer: 40, product: 21, researcher: 24, founder: 13, designer: 17, growth: 11, sales: 7, investor: 7, student: 20, other: 5 },
  designer:   { designer: 40, product: 30, engineer: 18, founder: 15, growth: 20, researcher: 13, sales: 9, investor: 7, student: 13, other: 5 },
  growth:     { growth: 40, founder: 19, product: 23, sales: 22, designer: 19, engineer: 11, researcher: 13, investor: 9, student: 11, other: 5 },
  researcher: { researcher: 40, engineer: 24, product: 20, founder: 12, designer: 14, investor: 14, growth: 11, sales: 7, student: 21, other: 5 },
  sales:      { sales: 40, growth: 23, founder: 17, product: 15, designer: 11, engineer: 9, researcher: 7, investor: 7, student: 9, other: 5 },
  student:    { student: 40, engineer: 24, researcher: 23, founder: 20, product: 18, designer: 15, growth: 13, sales: 9, investor: 11, other: 5 },
  other:      { other: 35, sales: 11, growth: 11, founder: 9, engineer: 9, product: 9, designer: 7, researcher: 7, investor: 5, student: 9 },
}

function computeTagOverlap(userInterests: string[], attendeeTags: string[]): number {
  if (userInterests.length === 0) return 0
  let count = 0
  const userTerms = userInterests.map(i => i.toLowerCase().split(/[\s/,()]/)[0].slice(0, 5))
  const attendeeTerms = attendeeTags.map(t => t.toLowerCase().split(/[\s/,()]/)[0].slice(0, 5))
  for (const ut of userTerms) {
    if (ut.length >= 2 && attendeeTerms.some(at => at.startsWith(ut) || ut.startsWith(at))) count++
  }
  return Math.min(count, 4)
}

function generateReason(userCat: string, attendeeCat: string, attendee: Attendee, overlap: number): string {
  const seed = attendee.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const pairs: Record<string, string[]> = {
    "founder-investor": [
      `Partner at ${attendee.company} — actively looking to back founders at your stage`,
      `${attendee.name} invests in early-stage teams — you're exactly what they source`,
      `Investor whose thesis aligns with your market`,
    ],
    "founder-engineer": [
      `Senior engineer at ${attendee.company} — the technical depth you want access to`,
      `${attendee.name} has built systems at scale — useful problem-solving perspective`,
      `Technical talent from ${attendee.company} — rare skills you'd want as an advisor`,
    ],
    "founder-product": [
      `Product lead at ${attendee.company} — can pressure-test your roadmap thinking`,
      `${attendee.name} has shipped at scale — gold perspective for your current stage`,
    ],
    "founder-designer": [
      `${attendee.name} shapes product experience at ${attendee.company}`,
      `Design lead who works with founders — strong creative resource`,
    ],
    "founder-growth": [
      `Growth expert who's driven breakout traction — what you need post-PMF`,
      `${attendee.name} built growth loops at ${attendee.company} — learn from the playbook`,
    ],
    "founder-researcher": [
      `Researcher at ${attendee.company} — deep domain knowledge, rare access`,
      `${attendee.name}'s research could validate or challenge your core thesis`,
    ],
    "founder-founder": [
      `Fellow founder figuring out the same things — peer support that actually helps`,
      `Both building in adjacent spaces — trade notes, avoid each other's mistakes`,
      `${attendee.name} is navigating early stage right now — instant shared context`,
    ],
    "investor-founder": [
      `Founder executing in a market you'd want exposure to`,
      `${attendee.name} is building — worth tracking as a potential deal`,
    ],
    "investor-investor": [
      `Potential co-investor — deal flow sharing and syndicate potential`,
    ],
    "product-engineer": [
      `Engineer at ${attendee.company} — the person who can make your ideas real`,
    ],
    "product-designer": [
      `Designer who will sharpen your product thinking — strong creative partner`,
    ],
    "engineer-founder": [
      `Founder with domain insight to give your technical work direction`,
    ],
    "designer-founder": [
      `Founder who can give your design work real business context`,
    ],
    "student-founder": [
      `Founder who was where you are — direct access to the path forward`,
      `${attendee.name} figured out the zero-to-one phase — learn the shortcuts`,
    ],
    "student-investor": [
      `${attendee.name} invests in emerging talent — right time to meet`,
    ],
    "student-engineer": [
      `Senior engineer at ${attendee.company} — mentorship and technical guidance`,
    ],
  }
  const key = `${userCat}-${attendeeCat}`
  const options = pairs[key] ?? [
    overlap > 1
      ? `Shared focus on ${attendee.tags[0]} — strong common ground`
      : `${attendee.role} at ${attendee.company} — different lens, valuable conversation`,
  ]
  return options[seed % options.length]
}

function generateConversationAngles(userCat: string, attendeeCat: string, attendee: Attendee, userInterests: string[]): string[] {
  const angles: string[] = []
  const roleAngles: Record<string, string> = {
    "founder-investor": `What's the thesis at ${attendee.company} right now — what problem are you most excited to back?`,
    "founder-engineer": `What's the hardest technical challenge you've worked on in the last year?`,
    "founder-product": `How do you decide what NOT to build when you have 10 good ideas?`,
    "founder-founder": `What's the biggest mistake you made early on that you'd undo if you could?`,
    "founder-designer": `How do you push back on founders who want to ship ugly things fast?`,
    "founder-growth": `What's one growth channel that's actually working right now that people underrate?`,
    "founder-researcher": `How do you think about the gap between research and what actually ships in production?`,
    "investor-founder": `What's the real insight behind why you started this — the "secret" you see that others miss?`,
    "product-engineer": `How do you communicate tradeoffs when a feature is technically expensive but users need it?`,
    "product-designer": `What's the most underrated part of your design process that most teams skip?`,
    "engineer-founder": `What would you build if you had 3 months and no constraints?`,
    "designer-founder": `How do you think about design at very early stage — when does it actually matter?`,
    "student-founder": `What's the real story of how you got your first 100 users?`,
    "student-investor": `What types of companies do you wish more founders were building right now?`,
    "student-engineer": `What's the fastest way to go from writing tutorials to shipping things that matter?`,
    "growth-founder": `How did you balance growth experimentation vs. product focus at early stage?`,
  }
  const key = `${userCat}-${attendeeCat}`
  angles.push(roleAngles[key] ?? `What are you most focused on right now — what's the current bottleneck?`)

  if (attendee.highlights.length > 0) {
    const h = attendee.highlights[0].split("—")[0].trim().toLowerCase()
    angles.push(`I saw that you ${h} — what was the key unlock that made that happen?`)
  }

  const sharedTags = attendee.tags.filter(t =>
    userInterests.some(i =>
      i.toLowerCase().split(/[\s/]/)[0].slice(0, 4) === t.toLowerCase().split(/[\s/]/)[0].slice(0, 4)
    )
  )
  if (sharedTags.length > 0) {
    angles.push(`You're also into ${sharedTags[0]} — what's your honest take on where it goes in the next 12 months?`)
  } else {
    angles.push(`What's been the most surprising thing about working at ${attendee.company}?`)
  }

  return angles.slice(0, 3)
}

function generateValueExchange(userCat: string, attendeeCat: string, attendee: Attendee): string {
  const exchanges: Record<string, string> = {
    "founder-investor":   `You get: potential capital and warm intros to their network. They get: early deal flow from a real builder.`,
    "founder-engineer":   `You get: technical depth and honest problem-solving. They get: exposure to messy real-world problems worth solving.`,
    "founder-product":    `You get: product frameworks and thinking. They get: a raw, unfiltered founder perspective.`,
    "founder-designer":   `You get: design taste and creative critique. They get: context on what founders actually need from design.`,
    "founder-founder":    `Both: war stories, peer accountability, and the kind of support only founders give each other.`,
    "founder-growth":     `You get: growth playbooks that actually compound. They get: a case study in their wheelhouse.`,
    "founder-researcher": `You get: deep domain validation or challenge. They get: real-world application context for their research.`,
    "investor-founder":   `You get: insight into a live market. They get: a possible check and access to your network.`,
    "product-engineer":   `You get: feasibility reality checks. They get: user empathy that makes their work meaningful.`,
    "product-designer":   `Both: tighter product-design loop — fewer misalignments, better outcomes.`,
    "engineer-founder":   `You get: market insight and direction. They get: technical partnership and operator thinking.`,
    "designer-engineer":  `Both: the design + implementation loop gets 10x faster.`,
    "student-founder":    `You get: real founder experience and mentorship. They get: energy, fresh thinking, possible hire in 2 years.`,
    "student-investor":   `You get: career guidance and network access. They get: early access to emerging talent.`,
    "growth-founder":     `You get: operational credibility. They get: someone who's seen growth from inside a real product.`,
  }
  const key = `${userCat}-${attendeeCat}`
  return exchanges[key] ?? `Both: a new perspective from a different corner of the ecosystem — more valuable than it sounds.`
}

export function scoreAttendee(
  user: UserMatchProfile,
  attendee: Attendee,
  mode: MatchMode,
  simWeight = 0.5,
  compWeight = 0.5,
): { score: number; matchType: "similar" | "complementary" | "high-upside"; reason: string; conversationAngles: string[]; valueExchange: string } {
  const userCat = categorizeRole(user.role)
  const attendeeCat = categorizeRole(attendee.role)

  const compBase = COMP[userCat]?.[attendeeCat] ?? 7
  const simBase = SIM[userCat]?.[attendeeCat] ?? 7

  const overlap = computeTagOverlap(user.interests, attendee.tags)
  const overlapBonus = overlap * 8
  const crossBonus = mode === "complementary" && overlap === 0 ? 8 : 0
  const mutualBonus = Math.min(attendee.mutualConnections * 2, 10)

  let raw: number
  if (mode === "similar") {
    raw = simBase + overlapBonus + mutualBonus
  } else if (mode === "complementary") {
    const adjOverlap = overlap <= 1 ? overlapBonus + crossBonus : overlapBonus * 0.55
    raw = compBase + adjOverlap + mutualBonus
  } else {
    const simTotal = simBase + overlapBonus + mutualBonus
    const compTotal = compBase + (overlap <= 1 ? overlapBonus + 4 : overlapBonus * 0.6) + mutualBonus
    raw = simTotal * simWeight + compTotal * compWeight
  }

  // Deterministic "noise" from id so scores feel real but never change on re-render
  const idHash = attendee.id.split("").reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1), 0)
  const noise = ((idHash * 3 + 11) % 13) - 6  // -6 to +6

  const score = Math.min(Math.max(Math.round(raw + noise), 11), 97)

  let matchType: "similar" | "complementary" | "high-upside"
  if (compBase >= 34 && mode !== "similar") {
    matchType = "high-upside"
  } else if (simBase >= 28 && mode !== "complementary") {
    matchType = "similar"
  } else {
    matchType = "complementary"
  }

  return {
    score,
    matchType,
    reason: generateReason(userCat, attendeeCat, attendee, overlap),
    conversationAngles: generateConversationAngles(userCat, attendeeCat, attendee, user.interests),
    valueExchange: generateValueExchange(userCat, attendeeCat, attendee),
  }
}

export function rankAttendees(user: UserMatchProfile, attendees: Attendee[], mode: MatchMode, simWeight = 0.5): Attendee[] {
  return attendees
    .map(a => {
      const r = scoreAttendee(user, a, mode, simWeight, 1 - simWeight)
      return { ...a, matchScore: r.score, matchType: r.matchType, matchReason: r.reason, conversationAngles: r.conversationAngles, valueExchange: r.valueExchange }
    })
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
}
