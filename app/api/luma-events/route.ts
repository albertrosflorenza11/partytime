import { NextResponse } from "next/server"

const LUMA_BASE = "https://public-api.luma.com/v1"

async function lumaGet(path: string, params: Record<string, string> = {}) {
  const url = new URL(LUMA_BASE + path)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), {
    headers: {
      "x-luma-api-key": process.env.LUMA_API_KEY!,
      "accept": "application/json",
    },
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`Luma ${res.status}: ${await res.text()}`)
  return res.json()
}

async function fetchAllEvents() {
  const events: any[] = []
  let cursor: string | undefined

  do {
    const params: Record<string, string> = { pagination_limit: "50" }
    if (cursor) params.pagination_cursor = cursor
    const data = await lumaGet("/calendar/list-events", params)
    for (const entry of data.entries ?? []) {
      const ev = entry.event ?? entry
      events.push({
        id: ev.api_id,
        name: ev.name,
        date: ev.start_at,
        endDate: ev.end_at,
        location: ev.geo_address_info?.full_address ?? ev.location ?? "Location TBD",
        coverImage: ev.cover_url ?? null,
        url: ev.url,
        attendeeCount: ev.guest_count ?? ev.spots_taken ?? 0,
        description: ev.description ?? "",
      })
    }
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)

  return events
}

export async function GET() {
  try {
    const events = await fetchAllEvents()
    return NextResponse.json({ events })
  } catch (err: any) {
    console.error("Luma events error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
