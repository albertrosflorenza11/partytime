export interface Attendee {
  id: string
  name: string
  role: string
  company: string
  location: string
  photo: string
  linkedin: string
  bio: string
  highlights: string[]
  mutualConnections: number
  tags: string[]
  availableSlots: string[]
  // Set after running the match engine
  matchScore?: number
  matchType?: "similar" | "complementary" | "high-upside"
  matchReason?: string
  conversationAngles?: string[]
  valueExchange?: string
}

export interface LumaEvent {
  id: string
  name: string
  date: string
  time: string
  location: string
  attendeeCount: number
  coverImage: string
  description: string
}

export interface Connection {
  id: string
  attendee: Attendee
  type: "connected" | "scheduled" | "requested"
  message?: string
  scheduledDate?: string
  scheduledTime?: string
  createdAt: string
}
