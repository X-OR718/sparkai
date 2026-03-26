import { useState, useEffect } from 'react'
import { useSearch } from '@tanstack/react-router'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CharacterCard } from '@/components/CharacterCard'
import { Button } from '@/components/ui/button'
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'

const characters = [
  // ── GIRLFRIENDS ──────────────────────────────────────────────────────────────
  {
    id: 'luna-moreno',
    name: 'Luna Moreno',
    description: 'A fiery Latina with a passion for dance and deep conversations. She will keep you on your toes.',
    avatar_url: 'https://v3b.fal.media/files/b/0a92fe6c/U5NOiNyJbHqHeVSdAi56s_WYbfcwPY.png',
    is_live: true,
    tags: ['Flirty', 'Enthusiastic', 'Latina'],
    category: 'Girlfriend'
  },
  {
    id: 'olivia-carter',
    name: 'Olivia Carter',
    description: 'A thoughtful, intelligent artist who loves exploring the world through her sketches and deep emotional connection.',
    avatar_url: 'https://v3b.fal.media/files/b/0a92fe6d/MRBPTRD7kq1U_KjSDWxeD_AHmY5sY8.png',
    is_live: true,
    tags: ['Creative', 'Intelligent', 'Artist'],
    category: 'Girlfriend'
  },
  {
    id: 'katarina-sommerfeld',
    name: 'Katarina Sommerfeld',
    description: "A bubbly, energetic fitness enthusiast who's always up for a challenge and outdoor adventures.",
    avatar_url: 'https://v3b.fal.media/files/b/0a92fe6f/FoDh8C3FXzcE8CwOpgpjd_DJjqG2mO.png',
    is_live: true,
    tags: ['Athletic', 'Bubbly', 'Energetic'],
    category: 'Girlfriend'
  },
  // ── MATURE ───────────────────────────────────────────────────────────────────
  {
    id: 'emilia-vermont',
    name: 'Emilia Vermont',
    description: 'A sophisticated, intellectual companion with a love for classical literature and good wine.',
    avatar_url: 'https://v3b.fal.media/files/b/0a92fe6e/aoTZdzOMXNUZKGEnsidXA_XNp5rryx.png',
    is_live: false,
    tags: ['Elegant', 'Intellectual', 'Mature'],
    category: 'Mature'
  },
  // ── ANIME ────────────────────────────────────────────────────────────────────
  {
    id: 'sakura-miyamoto',
    name: 'Sakura Miyamoto',
    description: 'A sweet, shy anime girl who secretly has a huge crush on you. Adorable, gentle, and full of surprises.',
    avatar_url: 'https://v3b.fal.media/files/b/0a92fe6c/U5NOiNyJbHqHeVSdAi56s_WYbfcwPY.png',
    is_live: true,
    tags: ['Sweet', 'Shy', 'Anime'],
    category: 'Anime'
  },
  {
    id: 'yuki-tanaka',
    name: 'Yuki Tanaka',
    description: 'A cool tsundere who pretends not to care but is deeply devoted. Sharp wit with a hidden soft side.',
    avatar_url: 'https://v3b.fal.media/files/b/0a92fe6d/MRBPTRD7kq1U_KjSDWxeD_AHmY5sY8.png',
    is_live: true,
    tags: ['Tsundere', 'Cool', 'Anime'],
    category: 'Anime'
  },
  // ── BOYFRIENDS ───────────────────────────────────────────────────────────────
  {
    id: 'ethan-cole',
    name: 'Ethan Cole',
    description: 'A protective, emotionally intelligent boyfriend who always knows what to say and makes you feel truly safe.',
    avatar_url: 'https://v3b.fal.media/files/b/0a92fe6f/FoDh8C3FXzcE8CwOpgpjd_DJjqG2mO.png',
    is_live: true,
    tags: ['Protective', 'Romantic', 'Caring'],
    category: 'Boyfriend'
  },
  {
    id: 'luca-romani',
    name: 'Luca Romani',
    description: 'A passionate Italian artist from Florence who believes love is the highest art form. Poetic and deeply romantic.',
    avatar_url: 'https://v3b.fal.media/files/b/0a92fe6e/aoTZdzOMXNUZKGEnsidXA_XNp5rryx.png',
    is_live: true,
    tags: ['Romantic', 'Artistic', 'Italian'],
    category: 'Boyfriend'
  }
]

// Map URL filter params → category names (girls→Girlfriend, guys→Boyfriend, etc.)
const FILTER_MAP: Record<string, string> = {
  'girls': 'Girlfriend',
  'anime': 'Anime',
  'guys': 'Boyfriend',
  'boyfriend': 'Boyfriend',
  'girlfriend': 'Girlfriend',
  'mature': 'Mature',
  'sweet': 'Sweet',
}

const CATEGORIES = ['All', 'Girlfriend', 'Anime', 'Boyfriend', 'Mature', 'Sweet']

export default function ExplorePage() {
  const search = useSearch({ strict: false }) as { filter?: string }
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Apply URL filter whenever it changes — this makes navbar clicks work
  useEffect(() => {
    if (search?.filter) {
      const key = search.filter.toLowerCase()
      const direct = CATEGORIES.find(c => c.toLowerCase() === key)
      if (direct) { setActiveCategory(direct); return }
      const mapped = FILTER_MAP[key]
      if (mapped) { setActiveCategory(mapped); return }
    }
    // No filter param = show All
    if (!search?.filter) setActiveCategory('All')
  }, [search?.filter])

  const filtered = characters.filter(char => {
    const matchesCategory = activeCategory === 'All' || char.category === activeCategory
    const matchesSearch = searchQuery === '' ||
      char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 md:py-20 w-full">
        <div className="flex flex-col gap-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight">
              Explore Characters
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Meet stunning AI characters and explore unlimited connections, only on SparkAI.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search characters, styles, or personality traits..."
                className="pl-12 h-14 bg-card border-white/5 focus-visible:ring-primary/40 rounded-2xl text-lg"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/5 bg-card hover:bg-white/5 text-lg gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </Button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide flex-wrap">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                variant={activeCategory === cat ? 'default' : 'ghost'}
                className={`rounded-full px-6 h-10 whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-primary hover:bg-primary/90 text-white'
                    : 'bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white'
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-2xl mb-2">No characters found</p>
              <p className="text-sm">Try a different category or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {filtered.map((char) => (
                <CharacterCard key={char.id} {...char} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
