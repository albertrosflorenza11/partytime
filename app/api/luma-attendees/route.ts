import { NextRequest, NextResponse } from "next/server"

const LUMA_BASE = "https://public-api.luma.com/v1"
const APIFY_ACTOR = "dev_fusion~linkedin-profile-scraper"
const APIFY_SYNC_URL = `https://api.apify.com/v2/acts/${APIFY_ACTOR}/run-sync-get-dataset-items`

const LINKEDIN_RE = /(?:linkedin\.com)?\/in\/([A-Za-z0-9\-_%\.]+)/i

async function lumaGet(path: string, params: Record<string, string> = {}) {
  const url = new URL(LUMA_BASE + path)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), {
    headers: { "x-luma-api-key": process.env.LUMA_API_KEY!, "accept": "application/json" },
  })
  if (!res.ok) throw new Error(`Luma ${res.status}: ${await res.text()}`)
  return res.json()
}

function extractLinkedInUrl(guest: Record<string, any>): string | null {
  // Check registration answers first
  for (const a of guest.registration_answers ?? []) {
    for (const v of Object.values(a)) {
      if (typeof v === "string") {
        const m = LINKEDIN_RE.exec(v)
        if (m) return `https://www.linkedin.com/in/${m[1].replace(/\/$/, "")}`
      }
    }
  }
  // Fallback: search entire guest JSON
  const m = LINKEDIN_RE.exec(JSON.stringify(guest))
  return m ? `https://www.linkedin.com/in/${m[1].replace(/\/$/, "")}` : null
}

async function fetchGuests(eventId: string) {
  const guests: any[] = []
  let cursor: string | undefined
  do {
    const params: Record<string, string> = { event_api_id: eventId, pagination_limit: "50" }
    if (cursor) params.pagination_cursor = cursor
    const data = await lumaGet("/event/get-guests", params)
    for (const entry of data.entries ?? []) {
      guests.push(entry.guest ?? entry)
    }
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return guests
}

async function enrichWithApify(urls: string[]): Promise<Record<string, any>> {
  if (!urls.length) return {}
  const token = process.env.APIFY_API_TOKEN
  const res = await fetch(`${APIFY_SYNC_URL}?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileUrls: urls }),
    signal: AbortSignal.timeout(120_000),
  })
  if (!res.ok) return {}
  const items: any[] = await res.json()
  const byUrl: Record<string, any> = {}
  for (const item of items) {
    const key = (item.linkedinUrl ?? item.linkedinPublicUrl ?? "").toLowerCase().replace(/\/$/, "")
    if (key) byUrl[key] = item
  }
  return byUrl
}

function buildAttendee(guest: Record<string, any>, li: Record<string, any> | null, linkedinUrl: string | null) {
  const experiences: any[] = li?.experiences ?? []
  const currentExp = experiences.find((e) => e.jobStillWorking !== false) ?? experiences[0]

  const highlights: string[] = []
  experiences.slice(0, 3).forEach((e) => {
    if (e.title && e.companyName) highlights.push(`${e.title} at ${e.companyName}`)
  })
  if (highlights.length === 0 && li?.headline) highlights.push(li.headline)
  if (highlights.length === 0) highlights.push("Attending this event")

  const skills: string[] = li?.topSkillsByEndorsements ?? []
  const tags = skills.slice(0, 3).length > 0 ? skills.slice(0, 3) : ["Networking"]

  const name = li?.fullName ?? guest.user_name ?? guest.name ?? "Attendee"
  const role = currentExp?.title ?? li?.jobTitle ?? li?.headline?.split(" at ")?.[0] ?? "Professional"
  const company = currentExp?.companyName ?? li?.companyName ?? ""
  const photo = li?.profilePicHighQuality ?? li?.profilePic ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff&size=200`

  return {
    id: guest.api_id ?? guest.id ?? String(Math.random()),
    name,
    role,
    company,
    location: li?.addressWithoutCountry ?? guest.city ?? "San Francisco, CA",
    photo,
    linkedin: linkedinUrl ?? "",
    bio: li?.about ?? li?.headline ?? `${name} is attending this event.`,
    highlights: highlights.slice(0, 3),
    mutualConnections: Math.floor(Math.random() * 8),
    tags,
  }
}

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get("eventId")
  if (!eventId) return NextResponse.json({ error: "Missing eventId" }, { status: 400 })

  try {
    const guests = await fetchGuests(eventId)

    // Extract LinkedIn URLs
    const urlsByGuest: Record<string, string | null> = {}
    const uniqueUrls: string[] = []
    for (const g of guests) {
      const url = extractLinkedInUrl(g)
      urlsByGuest[g.api_id ?? g.id] = url
      if (url && !uniqueUrls.includes(url)) uniqueUrls.push(url)
    }

    // Enrich with Apify if we have LinkedIn URLs
    const liByUrl = uniqueUrls.length > 0 ? await enrichWithApify(uniqueUrls) : {}

    // Build attendee profiles
    const attendees = guests
      .filter((g) => g.approval_status !== "declined")
      .map((g) => {
        const gid = g.api_id ?? g.id
        const liUrl = urlsByGuest[gid]
        const liKey = liUrl?.toLowerCase().replace(/\/$/, "")
        const li = liKey ? liByUrl[liKey] ?? null : null
        return buildAttendee(g, li, liUrl)
      })
      .filter((a) => a.name !== "Attendee" || guests.length === 1)

    return NextResponse.json({ attendees, total: guests.length })
  } catch (err: any) {
    console.error("luma-attendees error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
