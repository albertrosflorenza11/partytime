import { Attendee } from "./types"

const MALE_FIRST = ["James","Alex","Marcus","David","Kevin","Ryan","Jordan","Tyler","Nathan","Sam","Ethan","Lucas","Oliver","Kai","Omar","Siddharth","Yusuf","Carlos","Antoine","Kwame","Ravi","Luca","Mohammed","Felix","Arjun","Diego","Noah","Ivan","Hugo","Theo"]
const FEMALE_FIRST = ["Emma","Sophie","Priya","Amara","Elena","Zoe","Nia","Grace","Mei","Fatima","Isabel","Maya","Chloe","Layla","Yuna","Amelia","Valentina","Aisha","Camille","Rosa","Nadia","Freya","Sakura","Ingrid","Leila","Sonia","Chiara","Ayana","Daniela","Miriam"]
const LAST = ["Chen","Osei","Williams","Patel","Rodriguez","Kim","Johnson","Singh","Nakamura","Okafor","Martinez","Thompson","Wang","Petrov","Hassan","Dubois","Sharma","Lindqvist","Obi","Andersen","Moyo","Ferreira","Kowalski","Yamamoto","Müller","Gomes","Park","Liu","Hernandez","Reeves","Cohen","Clark","Lewis","Walker","Allen","Young","Scott","Hill","Green","Baker"]

const COMPANIES = [
  "Stripe","Notion","Figma","Linear","Vercel","Anthropic","OpenAI","Scale AI","Hugging Face","Mistral AI",
  "Cohere","Perplexity","Replit","Cursor","Lovable","Supabase","PlanetScale","Railway","Turso","dbt Labs",
  "Retool","Airtable","Webflow","Framer","Pitch","Loom","Miro","Coda","Raycast","Arc Browser",
  "Sequoia Capital","a16z","Y Combinator","First Round","Founders Fund","Accel","Lightspeed","Benchmark","Index Ventures","General Catalyst",
  "Character AI","Midjourney","ElevenLabs","Synthesia","Runway","Adobe","Canva","Snap","Discord","Twitch",
  "McKinsey","Deloitte","Goldman Sachs","Stanford","MIT","Berkeley",
  "Google","Meta","Apple","Microsoft","Amazon","Netflix","Uber","Airbnb","Salesforce","HubSpot",
  "Notion","Slack","Zoom","Dropbox","Box","Asana","Monday.com","ClickUp","Intercom","Zendesk",
]

const LOCATIONS = ["San Francisco, CA","New York, NY","Austin, TX","Seattle, WA","Boston, MA","Los Angeles, CA","London, UK","Berlin, Germany","Toronto, Canada","Singapore","Paris, France","Amsterdam, NL","Stockholm, SE","Bangalore, IN","Toronto, CA"]

const TIME_SLOTS = [
  ["6:15 PM","7:00 PM","8:30 PM"],
  ["6:30 PM","7:30 PM","8:45 PM"],
  ["6:45 PM","7:15 PM","9:00 PM"],
  ["7:00 PM","7:45 PM","8:15 PM"],
  ["6:15 PM","7:45 PM","9:15 PM"],
  ["6:30 PM","8:00 PM","9:30 PM"],
  ["7:00 PM","8:30 PM","9:00 PM"],
]

const ROLE_DATA: { role: string; bioPrefix: string; tagSets: string[][] }[] = [
  {
    role: "Founder & CEO",
    bioPrefix: "Building",
    tagSets: [
      ["AI","SaaS","B2B"],["Consumer","Mobile","Startup"],["Fintech","Founder","Early Stage"],
      ["HealthTech","AI","B2C"],["EdTech","Community","PLG"],["Developer Tools","Open Source","YC Alumni"],
      ["CleanTech","Hardware","Deep Tech"],["Marketplace","Network Effects","Founder"],
    ],
  },
  {
    role: "Co-Founder & CTO",
    bioPrefix: "Building and shipping code at",
    tagSets: [
      ["Engineering","AI","Startup"],["Backend","Infrastructure","Founder"],
      ["Full Stack","Open Source","Early Stage"],["ML Engineering","AI","Co-Founder"],
    ],
  },
  {
    role: "Partner",
    bioPrefix: "Investing at",
    tagSets: [
      ["Venture Capital","Early Stage","AI"],["Angel Investing","B2B SaaS","Portfolio"],
      ["Growth Equity","Consumer","VC"],["Deep Tech","Infrastructure","Enterprise"],
      ["Seed Investing","Climate","Venture Capital"],
    ],
  },
  {
    role: "Head of Product",
    bioPrefix: "Running product at",
    tagSets: [
      ["Product Strategy","B2B SaaS","Analytics"],["Consumer UX","Mobile","Growth"],
      ["AI Product","Developer Tools","PLG"],["Enterprise Product","B2B","Strategy"],
    ],
  },
  {
    role: "Senior Product Manager",
    bioPrefix: "Shipping at",
    tagSets: [
      ["Product","Growth","B2B"],["Mobile","Consumer","Analytics"],
      ["AI","Product Strategy","Enterprise"],["PLG","SaaS","Metrics"],
    ],
  },
  {
    role: "Staff Engineer",
    bioPrefix: "Building infra at",
    tagSets: [
      ["Backend Engineering","Infrastructure","Open Source"],["ML Engineering","AI","Python"],
      ["Full Stack","React","TypeScript"],["Systems Engineering","Distributed Systems","Cloud"],
    ],
  },
  {
    role: "ML Engineer",
    bioPrefix: "Making models work at",
    tagSets: [
      ["ML Engineering","AI","Python"],["LLMs","Fine-tuning","AI"],
      ["Computer Vision","Deep Learning","Open Source"],["AI Infrastructure","ML Ops","Cloud"],
    ],
  },
  {
    role: "Senior Designer",
    bioPrefix: "Designing at",
    tagSets: [
      ["Product Design","Design Systems","B2B"],["Brand Design","Motion","Consumer"],
      ["UX Research","Figma","Enterprise"],["Design Engineering","Frontend","Craft"],
    ],
  },
  {
    role: "Growth Lead",
    bioPrefix: "Driving growth at",
    tagSets: [
      ["Growth Hacking","PLG","Analytics"],["Content Marketing","SEO","Community"],
      ["Performance Marketing","B2B","GTM"],["Social Media","Brand","Consumer"],
    ],
  },
  {
    role: "AI Research Scientist",
    bioPrefix: "Researching at",
    tagSets: [
      ["AI Research","NLP","Academia"],["ML Research","Computer Vision","Deep Learning"],
      ["AI Safety","Alignment","Ethics"],["Data Science","Statistics","Research"],
    ],
  },
  {
    role: "Enterprise Sales Lead",
    bioPrefix: "Closing deals at",
    tagSets: [
      ["Enterprise Sales","SaaS","Revenue"],["Business Development","Partnerships","GTM"],
      ["Sales Engineering","Technical Sales","B2B"],["SMB Sales","Startup","PLG"],
    ],
  },
  {
    role: "Associate",
    bioPrefix: "Sourcing deals at",
    tagSets: [
      ["Venture Capital","Early Stage","Portfolio"],["Angel Investing","Seed","VC"],
      ["Growth Equity","Consumer","Portfolio"],["Deep Tech","B2B","Investing"],
    ],
  },
  {
    role: "Student",
    bioPrefix: "Studying at",
    tagSets: [
      ["Student","CS","Hackathon"],["Entrepreneurship","Student","Building"],
      ["ML Student","AI","Research"],["UX Design","Student","Portfolio"],
    ],
  },
]

function pick<T>(arr: T[], seed: number): T {
  return arr[((seed % arr.length) + arr.length) % arr.length]
}

export function generateProfiles(count = 200): Attendee[] {
  const profiles: Attendee[] = []
  for (let i = 0; i < count; i++) {
    const isFemale = i % 3 === 1
    const photoGender = isFemale ? "women" : "men"
    const photoId = (i % 70) + 1
    const rd = ROLE_DATA[i % ROLE_DATA.length]
    const firstName = isFemale ? pick(FEMALE_FIRST, i * 7 + 3) : pick(MALE_FIRST, i * 5 + 1)
    const lastName = pick(LAST, i * 11 + 2)
    const company = pick(COMPANIES, i * 13 + 4)
    const tags = pick(rd.tagSets, i * 17 + 5)
    const location = pick(LOCATIONS, i * 19 + 6)
    const mutual = (i * 3) % 11

    profiles.push({
      id: `g${i + 200}`,
      name: `${firstName} ${lastName}`,
      role: rd.role,
      company,
      location,
      photo: `https://randomuser.me/api/portraits/${photoGender}/${photoId}.jpg`,
      linkedin: `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      bio: `${rd.bioPrefix} ${company}. Focused on ${tags[0].toLowerCase()} and always looking for the right people to learn from.`,
      highlights: [
        `${rd.role} focused on ${tags[0]}`,
        `Based in ${location}`,
        `Currently at ${company}`,
      ],
      mutualConnections: mutual,
      tags,
      availableSlots: pick(TIME_SLOTS, i * 29 + 8),
    })
  }
  return profiles
}
