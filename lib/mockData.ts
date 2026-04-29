import { Attendee, LumaEvent } from "./types"

export const mockEvent: LumaEvent = {
  id: "evt-partytime-2025",
  name: "AI Builders Happy Hour SF",
  date: "Thursday, May 1, 2025",
  time: "6:00 PM – 9:00 PM PDT",
  location: "The Interval at Long Now, Fort Mason, SF",
  attendeeCount: 47,
  coverImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop",
  description: "An evening for builders, founders, and AI enthusiasts to connect.",
}

export const mockAttendees: Attendee[] = [
  {
    id: "1",
    name: "Natalie Sandberg",
    role: "Partner",
    company: "Andreessen Horowitz (a16z)",
    location: "San Francisco, CA",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    linkedin: "https://linkedin.com/in/nataliesandberg",
    bio: "Partner at a16z focused on early-stage AI and developer tools. Previously founded two startups — one exit, one failure. I back people who ship obsessively.",
    highlights: [
      "Led $12M seed round in Cursor, now at $400M ARR",
      "Ex-founder: sold DevGraph to Atlassian in 2021",
      "Host of 'Builders Podcast' — 2M downloads, top 10 tech"
    ],
    mutualConnections: 4,
    tags: ["Venture Capital", "AI", "Developer Tools"],
    availableSlots: ["6:30 PM", "7:15 PM", "8:45 PM"],
  },
  {
    id: "2",
    name: "Ryo Tanaka",
    role: "Co-founder & CTO",
    company: "Draftbit",
    location: "San Francisco, CA",
    photo: "https://randomuser.me/api/portraits/men/28.jpg",
    linkedin: "https://linkedin.com/in/ryotanaka",
    bio: "Building no-code mobile app tools. Ex-Meta infra engineer. Passionate about making software creation accessible to everyone — not just people who can code.",
    highlights: [
      "Scaled Draftbit to 80k users without any paid marketing",
      "Ex-Meta — built infra serving 3B users daily",
      "YC S20 alumni, $8M raised, currently profitable"
    ],
    mutualConnections: 6,
    tags: ["No-Code", "Mobile", "YC Alumni"],
    availableSlots: ["6:15 PM", "7:45 PM", "8:30 PM"],
  },
  {
    id: "3",
    name: "Amara Osei",
    role: "AI Research Lead",
    company: "Anthropic",
    location: "San Francisco, CA",
    photo: "https://randomuser.me/api/portraits/women/61.jpg",
    linkedin: "https://linkedin.com/in/amaraosei",
    bio: "Researching AI alignment and interpretability at Anthropic. PhD from MIT. Working on making AI systems that humans can actually understand and trust.",
    highlights: [
      "Lead author on Constitutional AI paper — 3,000+ citations",
      "PhD MIT CSAIL, dropout at 80% to join Anthropic founding team",
      "TEDx speaker: 'Why AI safety is the most important problem of our time'"
    ],
    mutualConnections: 2,
    tags: ["AI Safety", "Research", "Alignment"],
    availableSlots: ["7:00 PM", "8:00 PM", "9:00 PM"],
  },
  {
    id: "4",
    name: "Diego Morales",
    role: "Founder & CEO",
    company: "Cleo Finance",
    location: "San Francisco, CA",
    photo: "https://randomuser.me/api/portraits/men/52.jpg",
    linkedin: "https://linkedin.com/in/diegomorales",
    bio: "Building AI-powered financial planning for Gen Z. Came from nothing, building for people who feel left out of the financial system. Raised in Medellín, building in SF.",
    highlights: [
      "Grew Cleo to 50k users in 8 months, zero paid acquisition",
      "Featured in Forbes 30 Under 30 — Finance 2024",
      "Raised $3.2M from Sequoia scouts and Latine founders fund"
    ],
    mutualConnections: 8,
    tags: ["Fintech", "Gen Z", "Founder"],
    availableSlots: ["6:45 PM", "7:30 PM", "8:15 PM"],
  },
  {
    id: "5",
    name: "Priya Mehta",
    role: "Head of Product",
    company: "Vercel",
    location: "San Francisco, CA",
    photo: "https://randomuser.me/api/portraits/women/29.jpg",
    linkedin: "https://linkedin.com/in/priyamehta",
    bio: "Running product at Vercel. Obsessed with developer experience and the intersection of AI + deployment. Before this, shipped 3 products that flopped — now shipping ones that don't.",
    highlights: [
      "Led v0 — Vercel's AI UI generator, 500k users in 6 weeks post-launch",
      "Formerly: PM at Stripe, launched Stripe Apps marketplace",
      "Angel investor in 11 early-stage dev tools startups"
    ],
    mutualConnections: 5,
    tags: ["Product", "Developer Tools", "AI"],
    availableSlots: ["6:30 PM", "7:00 PM", "9:15 PM"],
  },
  {
    id: "6",
    name: "Liam O'Brien",
    role: "Design Engineer",
    company: "Linear",
    location: "San Francisco, CA",
    photo: "https://randomuser.me/api/portraits/men/36.jpg",
    linkedin: "https://linkedin.com/in/liamobrienux",
    bio: "Design engineer at Linear — I live at the boundary of code and pixels. Building tools that feel fast, opinionated, and beautiful. Tweeting about craft daily.",
    highlights: [
      "Designed Linear's keyboard-first interaction model — copied by 40+ products",
      "Creator of 'Craft' newsletter, 90k subscribers in 18 months",
      "Previously designed at Figma and Notion simultaneously (yes, really)"
    ],
    mutualConnections: 3,
    tags: ["Design Engineering", "UX", "B2B SaaS"],
    availableSlots: ["7:15 PM", "8:00 PM", "8:45 PM"],
  },
  {
    id: "7",
    name: "Zoe Blackwell",
    role: "Founder",
    company: "Mosaic AI",
    location: "San Francisco, CA",
    photo: "https://randomuser.me/api/portraits/women/18.jpg",
    linkedin: "https://linkedin.com/in/zoeblackwell",
    bio: "Building AI agents that replace entire back-office operations. Dropped out of Stanford CS to start Mosaic. We're making enterprise ops actually fun.",
    highlights: [
      "Launched Mosaic at 22 — $1.8M ARR in first year without enterprise sales team",
      "Stanford CS dropout, turned down Google offer",
      "Winner of Pioneer Tournament 2024 — $50k grant"
    ],
    mutualConnections: 7,
    tags: ["AI Agents", "Enterprise", "Founder"],
    availableSlots: ["6:15 PM", "7:45 PM", "9:00 PM"],
  },
  {
    id: "8",
    name: "Marcus Webb",
    role: "Staff Engineer",
    company: "OpenAI",
    location: "San Francisco, CA",
    photo: "https://randomuser.me/api/portraits/men/41.jpg",
    linkedin: "https://linkedin.com/in/marcuswebb",
    bio: "Building the systems behind ChatGPT's infrastructure. Previously at AWS and Cloudflare. I care deeply about distributed systems that actually work at scale.",
    highlights: [
      "Architected ChatGPT's real-time streaming infrastructure — handles 100M+ daily requests",
      "Open source: created 'Flare' — 12k GitHub stars, used by Cloudflare internally",
      "Ex-AWS principal engineer — led S3 reliability org"
    ],
    mutualConnections: 1,
    tags: ["Infrastructure", "AI Systems", "Open Source"],
    availableSlots: ["7:00 PM", "7:45 PM", "8:30 PM"],
  },
  {
    id: "9",
    name: "Isabelle Fontaine",
    role: "Founder & CEO",
    company: "Bloom",
    location: "San Francisco, CA",
    photo: "https://randomuser.me/api/portraits/women/55.jpg",
    linkedin: "https://linkedin.com/in/isabellefontaine",
    bio: "Building Bloom — an AI mental health companion for college students. French, SF-based, deeply passionate about accessible mental health. 0 to 15k users in 3 months.",
    highlights: [
      "Bloom reached 15k active users in 90 days with $0 in paid ads",
      "Raised $2.1M from Sequoia Arc and female founder fund",
      "Former clinical psychologist turned founder — the only kind that matters for this"
    ],
    mutualConnections: 5,
    tags: ["HealthTech", "Mental Health", "AI"],
    availableSlots: ["6:30 PM", "7:30 PM", "8:45 PM"],
  },
  {
    id: "10",
    name: "Kwame Asante",
    role: "Growth Lead",
    company: "Notion",
    location: "San Francisco, CA",
    photo: "https://randomuser.me/api/portraits/men/63.jpg",
    linkedin: "https://linkedin.com/in/kwameasante",
    bio: "Growth at Notion. Previously grew two startups from zero to acquisition. Obsessed with product-led growth, community loops, and anything that compounds over time.",
    highlights: [
      "Led Notion's creator program to 200k+ members in 12 months",
      "Grew Loom from 50k to 500k users as first growth hire",
      "Writes 'Compound' newsletter — 70k subscribers, #1 growth newsletter on Substack"
    ],
    mutualConnections: 9,
    tags: ["Growth", "PLG", "Community"],
    availableSlots: ["6:15 PM", "7:00 PM", "8:15 PM"],
  },
  {
    id: "11",
    name: "Sofia Reyes",
    role: "AI Product Lead",
    company: "Figma",
    location: "San Francisco, CA",
    photo: "https://randomuser.me/api/portraits/women/72.jpg",
    linkedin: "https://linkedin.com/in/sofiareyes",
    bio: "Running AI product at Figma. Thinking about how generative AI will reshape the entire creative workflow. Prev Canva, Google Brain. I love where design meets intelligence.",
    highlights: [
      "Led Figma AI launch — 1M designers used it in first week",
      "Ex-Google Brain, co-authored 2 papers on generative UI",
      "Board advisor to 4 AI design startups"
    ],
    mutualConnections: 3,
    tags: ["AI", "Design", "Product"],
    availableSlots: ["7:00 PM", "7:45 PM", "9:30 PM"],
  },
]

export const generateAIMessage = (attendee: Attendee, userProfile: { name: string; role: string; company: string }): string => {
  const templates = [
    `Hey ${attendee.name}! I just matched with you on PartyTime — love what you're building at ${attendee.company}. I'm ${userProfile.name}, working on ${userProfile.company}. Would love to connect at the event!`,
    `${attendee.name}! Matched with you on PartyTime. Your background in ${attendee.tags[0]} is exactly what I've been wanting to talk about. I'm ${userProfile.name} — see you tonight?`,
    `Hey ${attendee.name}, we matched! I'm ${userProfile.name} — ${userProfile.role} at ${userProfile.company}. Your work on ${attendee.highlights[0].split("—")[0].trim().toLowerCase()} is super interesting. Let's find each other at the event!`,
  ]
  return templates[Math.floor(Math.random() * templates.length)]
}

export const currentUser = {
  name: "Albert Ros",
  role: "Founder",
  company: "The Builders",
  photo: "https://randomuser.me/api/portraits/men/75.jpg",
}
