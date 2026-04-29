import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const APIFY_ACTOR = "dev_fusion~linkedin-profile-scraper"
const APIFY_SYNC_URL = `https://api.apify.com/v2/acts/${APIFY_ACTOR}/run-sync-get-dataset-items`

function normalizeLinkedInUrl(input: string): string {
  let url = input.trim().replace(/^https?:\/\//, "").replace(/^www\./, "")
  if (!url.startsWith("linkedin.com")) url = "linkedin.com/in/" + url
  return "https://www." + url.replace(/\/$/, "")
}

async function scrapeWithApify(linkedinUrl: string): Promise<Record<string, unknown> | null> {
  const token = process.env.APIFY_API_TOKEN
  const res = await fetch(`${APIFY_SYNC_URL}?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileUrls: [linkedinUrl] }),
    signal: AbortSignal.timeout(120_000),
  })

  if (!res.ok) {
    console.error("Apify error:", res.status, await res.text())
    return null
  }

  const items = await res.json()
  return (Array.isArray(items) && items.length > 0) ? items[0] : null
}

// Map raw Apify fields (from apify_raw.json) into our app profile shape
function mapApifyToProfile(raw: Record<string, unknown>): Record<string, unknown> {
  const experiences = (raw.experiences as any[]) ?? []
  const currentExp = experiences.find((e) => e.jobStillWorking !== false) ?? experiences[0]

  const highlights: string[] = []
  experiences.slice(0, 3).forEach((e) => {
    if (e.title && (e.companyName || e.subtitle)) {
      highlights.push(`${e.title} at ${e.companyName ?? e.subtitle}`)
    }
  })
  if (highlights.length < 3 && raw.headline) highlights.push(raw.headline as string)

  const skills = (raw.topSkillsByEndorsements as string[]) ?? []
  const tags = skills.slice(0, 4).length > 0
    ? skills.slice(0, 4)
    : [(raw.companyIndustry as string) ?? ""].filter(Boolean)

  return {
    name: raw.fullName ?? `${raw.firstName ?? ""} ${raw.lastName ?? ""}`.trim(),
    role: currentExp?.title ?? raw.jobTitle ?? raw.headline ?? "Professional",
    company: currentExp?.companyName ?? raw.companyName ?? "",
    location: raw.addressWithoutCountry ?? raw.addressCountryOnly ?? "",
    bio: raw.about ?? raw.headline ?? "",
    highlights: highlights.length > 0 ? highlights : ["Active professional on LinkedIn"],
    tags,
    photo: raw.profilePicHighQuality ?? raw.profilePic ?? null,
  }
}

export async function POST(req: NextRequest) {
  const { linkedinUrl } = await req.json()
  if (!linkedinUrl) {
    return NextResponse.json({ error: "Missing linkedinUrl" }, { status: 400 })
  }

  const normalizedUrl = normalizeLinkedInUrl(linkedinUrl)

  // 1. Try Apify scraper
  let profile: Record<string, unknown> | null = null
  let scraped = false
  try {
    const raw = await scrapeWithApify(normalizedUrl)
    if (raw && raw.fullName) {
      profile = mapApifyToProfile(raw)
      scraped = true
    }
  } catch (err) {
    console.error("Apify failed:", err)
  }

  // 2. If scraper failed or returned nothing, use Claude to generate from URL
  if (!profile) {
    try {
      const msg = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: `Generate a realistic LinkedIn profile JSON for: ${normalizedUrl}
Return ONLY valid JSON (no markdown): { "name": "", "role": "", "company": "", "location": "", "bio": "", "highlights": ["","",""], "tags": [], "photo": null }`
        }],
      })
      const text = msg.content[0].type === "text" ? msg.content[0].text : "{}"
      profile = JSON.parse(text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim())
    } catch (err) {
      return NextResponse.json({ error: "Failed to build profile" }, { status: 500 })
    }
  }

  // 3. Fallback photo
  if (!profile || !profile.photo) {
    const handle = normalizedUrl.split("/in/")[1]?.replace(/\/$/, "") ?? "user"
    const photoId = (handle.length % 70) + 1
    const gender = handle.charCodeAt(handle.length - 1) % 2 === 0 ? "men" : "women"
    if (profile) profile.photo = `https://randomuser.me/api/portraits/${gender}/${photoId}.jpg`
  }

  return NextResponse.json({ profile, scraped })
}
