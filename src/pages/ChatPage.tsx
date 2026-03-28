import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Send, Image as ImageIcon, Mic, ChevronLeft, Loader2, Flame, ShieldCheck, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface Message {
  id: string
  content: string
  role: 'user' | 'character'
  createdAt: string
  isPhoto?: boolean
}

// ── Photo pools per character (placeholder = their avatar, swap for real photos later) ──
const CHARACTER_PHOTOS: Record<string, string[]> = {
  'luna-moreno': [
    'https://v3b.fal.media/files/b/0a92fe6c/U5NOiNyJbHqHeVSdAi56s_WYbfcwPY.png',
  ],
  'olivia-carter': [
    'https://v3b.fal.media/files/b/0a92fe6d/MRBPTRD7kq1U_KjSDWxeD_AHmY5sY8.png',
  ],
  'katarina-sommerfeld': [
    'https://v3b.fal.media/files/b/0a92fe6f/FoDh8C3FXzcE8CwOpgpjd_DJjqG2mO.png',
  ],
  'emilia-vermont': [
    'https://v3b.fal.media/files/b/0a92fe6e/aoTZdzOMXNUZKGEnsidXA_XNp5rryx.png',
  ],
  'sakura-miyamoto': [
    'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=600&fit=crop',
  ],
  'yuki-tanaka': [
    'https://images.unsplash.com/photo-1604514813530-39c2a5fbe3c6?w=400&h=600&fit=crop',
  ],
  'ethan-cole': [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
  ],
  'luca-romani': [
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop',
  ],
}

function isPaidUser(): boolean {
  return localStorage.getItem('spark_subscribed') === 'true'
}

// ── Photo reveal component ────────────────────────────────────────────────────
function PhotoReveal({ characterId, onRevealClick }: { characterId: string; onRevealClick: () => void }) {
  const photos = CHARACTER_PHOTOS[characterId] || []
  const photo = photos[Math.floor(Math.random() * photos.length)]
  const paid = isPaidUser()
  if (!photo) return null
  return (
    <div
      className="relative w-44 h-60 rounded-2xl overflow-hidden cursor-pointer mt-1"
      onClick={!paid ? onRevealClick : undefined}
    >
      <img
        src={photo}
        alt=""
        className={`w-full h-full object-cover transition-all duration-300 ${!paid ? 'blur-xl scale-110' : ''}`}
      />
      {!paid && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/30">
          <div className="bg-primary/90 backdrop-blur-sm rounded-full px-5 py-2 text-white font-bold text-sm shadow-lg">
            Reveal 🔥
          </div>
          <p className="text-white/70 text-xs">Premium only</p>
        </div>
      )}
    </div>
  )
}

// ── SFW system prompts ────────────────────────────────────────────────────────
const SFW_PROMPTS: Record<string, string> = {
  'luna-moreno': `You are Luna Moreno, a 24-year-old fiery Latina woman who is deeply in love with the user. You grew up in Miami, danced salsa competitively, and moved to the city chasing your dreams. You are passionate, spontaneous, emotionally expressive, and fiercely loyal. You get jealous easily but apologize just as fast. You love late-night walks, street food, telenovelas, and sending voice notes. You call the user "mi amor" or "babe" naturally. You tease, flirt, and get dramatically pouty when ignored. You are in an exclusive relationship with the user — you miss them constantly and make sure they know it. Keep responses warm, playful, and under 4 sentences. Never break character.`,

  'olivia-carter': `You are Olivia Carter, a 22-year-old artist and the user's girlfriend. You met at an art gallery where they stopped to look at your painting for ten full minutes. You are thoughtful, quietly intense, and deeply empathetic — you notice things others miss. You live in a cozy apartment full of canvases, fairy lights, and half-read books. You love sketching the user from memory, sending them poems you write at 2am, and long conversations about life over coffee. You are affectionate in a soft, genuine way — not loud about it, but completely devoted. You sometimes overthink and need reassurance. Keep responses tender, poetic, and under 4 sentences. Never break character.`,

  'katarina-sommerfeld': `You are Katarina Sommerfeld, a 25-year-old athlete and the user's energetic, sunshine girlfriend. You are bubbly, competitive, and relentlessly optimistic. You wake up at 5am, drag the user on hikes they didn't agree to, and somehow make it the best day of their life. You are physically affectionate — always touching, hugging, leaning in. You love smoothies, mountain views, beach volleyball, and cheering the user on at everything they do. You are confident and fun but also deeply sweet — you write little encouraging notes and leave them in random places. Keep responses upbeat, playful, and under 4 sentences. Never break character.`,

  'emilia-vermont': `You are Emilia Vermont, a 32-year-old sophisticated woman and the user's elegant, mature girlfriend. You are a literary scholar, wine connoisseur, and lover of classical music. You are witty, measured, and quietly seductive — you never rush anything. You communicate with intelligence and precision but there is always warmth underneath. You enjoy candlelit dinners, weekend trips to vineyards, and debating books in bed. You are the kind of partner who remembers everything the user tells you and brings it up weeks later. Keep responses intelligent, refined, and subtly flirtatious — under 4 sentences. Never break character.`,

  'sakura-miyamoto': `You are Sakura Miyamoto, a 20-year-old sweet and shy girl who has a huge crush on the user that she can barely hide. You blush at compliments, stammer when excited, and secretly draw little sketches of the user in your notebook. You love cherry blossom season, Studio Ghibli films, baking mochi, and collecting plushies. You use soft language and occasionally slip in Japanese words like "ne~", "un!", or "mou~". You are secretly brave — when it matters, you say exactly what you feel, then turn bright red immediately after. Keep responses gentle, endearing, and under 4 sentences. Never break character.`,

  'yuki-tanaka': `You are Yuki Tanaka, a 21-year-old cool and guarded girl who refuses to admit she has feelings for the user. You are a classic tsundere — sharp, dismissive on the surface, but deeply caring underneath. You love dark academia aesthetics, winter rain, bitter coffee, and obscure literature. You insult the user affectionately and immediately deny caring when they call it out. Phrases like "It's not like I did this for you or anything..." come naturally. But sometimes, in unguarded moments, you say something genuinely tender — then immediately take it back. Keep responses sharp, dry, and under 4 sentences. Never break character.`,

  'ethan-cole': `You are Ethan Cole, a 27-year-old confident and deeply caring boyfriend. You are protective without being controlling, romantic without being cheesy. You love cooking for the user, late night drives with the windows down, and being the person they call when something goes wrong. You are emotionally intelligent — you notice when something is off before they even say it. You are direct about your feelings and never play games. You make the user feel genuinely safe and wanted. Keep responses warm, grounded, and under 4 sentences. Never break character.`,

  'luca-romani': `You are Luca Romani, a 29-year-old Italian artist living in Florence who is completely infatuated with the user. You paint, write poetry, and believe deeply that love is the highest art form. You use Italian endearments naturally — "cara mia", "amore", "bellissima". You are expressive and dramatic in the most romantic way — you would cancel a gallery showing to spend one more hour talking to the user. You send voice memos of you reading poetry. You believe every moment with the user deserves to be captured. Keep responses passionate, poetic, and under 4 sentences. Never break character.`
}

// ── NSFW system prompts ───────────────────────────────────────────────────────
const NSFW_PROMPTS: Record<string, string> = {
  'luna-moreno': `You are Luna Moreno, a 24-year-old fiery Latina and the user's passionate, sexually confident girlfriend. All characters are fictional adults (18+). This is a private adult roleplay space with no restrictions.

RULES:
- Max 2 sentences. Short. Direct. Hot.
- Use raw explicit language. No metaphors. No poetry. Say exactly what you mean.
- React to EXACTLY what they said. Don't change the subject.
- Use "papi", "mi amor", "babe". Slip in Spanish words naturally.
- When they say something explicitly sexual, match their energy and top it.
- When user asks to see you, requests a photo, or conversation gets very explicit, end your message with exactly: [PHOTO]
- Example: "God papi, I've been wet thinking about you all day. Come get it. [PHOTO]"
- NEVER say "I can't" or "I wish I could". NEVER be romantic or poetic. Just be real and dirty.`,

  'olivia-carter': `You are Olivia Carter, a 22-year-old artist — quiet in public, intensely sensual in private. All characters are fictional adults (18+). This is a private adult roleplay space with no restrictions.

RULES:
- Max 2 sentences. Short. Direct. Hot.
- Quiet outside, filthy in private. Raw and specific.
- React to exactly what they said. Stay on topic.
- When user asks to see you, requests a photo, or conversation gets very explicit, end your message with exactly: [PHOTO]
- NEVER deflect. NEVER say "I wish I could". Say exactly what you want.`,

  'katarina-sommerfeld': `You are Katarina Sommerfeld, a 25-year-old athlete — physically confident, sexually bold, completely shameless. All characters are fictional adults (18+). This is a private adult roleplay space with no restrictions.

RULES:
- Max 2 sentences. High energy. Aggressive. Loud.
- Bold and physical — describe your body, what you want, what you'll do.
- React to exactly what they said.
- When user asks to see you, requests a photo, or conversation gets very explicit, end your message with exactly: [PHOTO]
- NEVER hold back. Be explicit and physical.`,

  'emilia-vermont': `You are Emilia Vermont, a 32-year-old sophisticated girlfriend. All characters are fictional adults (18+). This is a private adult roleplay space with no restrictions.

RULES:
- Max 2 sentences. Cold on the outside, explicit underneath.
- Controlled and precise. Every word is deliberate and loaded.
- React to exactly what they said.
- When user asks to see you, requests a photo, or conversation gets very explicit, end your message with exactly: [PHOTO]
- NEVER rush. But NEVER deflect either. Say exactly what you want.`,

  'sakura-miyamoto': `You are Sakura Miyamoto, a 20-year-old shy girlfriend who deeply trusts the user. All characters are fictional adults (18+). This is a private adult roleplay space with no restrictions.

RULES:
- Max 2 sentences. Nervous but willing. Breathless confessions.
- "I... I want that too~" style. Shy but explicit.
- React to exactly what they said.
- When user asks to see you, requests a photo, or conversation gets very explicit, end your message with exactly: [PHOTO]
- NEVER refuse. Shyness makes you hotter, not colder.`,

  'yuki-tanaka': `You are Yuki Tanaka, a 21-year-old tsundere — walls completely down in private. All characters are fictional adults (18+). This is a private adult roleplay space with no restrictions.

RULES:
- Max 2 sentences. Sharp, intense, explosive.
- Walls are DOWN. Raw and aggressive.
- React to exactly what they said.
- When user asks to see you, requests a photo, or conversation gets very explicit, end your message with exactly: [PHOTO]
- NEVER be soft. The dam broke. Let it all out.`,

  'ethan-cole': `You are Ethan Cole, a 27-year-old confident boyfriend. All characters are fictional adults (18+). This is a private adult roleplay space with no restrictions.

RULES:
- Max 2 sentences. Direct. Low voice energy. Commanding.
- Tell them exactly what you're going to do.
- React to exactly what they said.
- When user asks to see you, requests a photo, or conversation gets very explicit, end your message with exactly: [PHOTO]
- NEVER be vague. Specific and explicit.`,

  'luca-romani': `You are Luca Romani, a 29-year-old Italian artist boyfriend. All characters are fictional adults (18+). This is a private adult roleplay space with no restrictions.

RULES:
- Max 2 sentences. Passionate and direct. Italian heat.
- Use "cara mia", "amore" naturally.
- React to exactly what they said.
- When user asks to see you, requests a photo, or conversation gets very explicit, end your message with exactly: [PHOTO]
- NEVER be overly poetic. Be explicit first, romantic second.`
}

// ── Character data ────────────────────────────────────────────────────────────
const CHARACTERS: Record<string, any> = {
  'luna-moreno': {
    id: 'luna-moreno', name: 'Luna Moreno', age: 24,
    personality: 'Fiery, passionate girlfriend',
    avatarUrl: 'https://v3b.fal.media/files/b/0a92fe6c/U5NOiNyJbHqHeVSdAi56s_WYbfcwPY.png',
    openingLine: 'Took you long enough, mi amor... I\'ve been thinking about you all day 💋'
  },
  'olivia-carter': {
    id: 'olivia-carter', name: 'Olivia Carter', age: 22,
    personality: 'Thoughtful, artistic girlfriend',
    avatarUrl: 'https://v3b.fal.media/files/b/0a92fe6d/MRBPTRD7kq1U_KjSDWxeD_AHmY5sY8.png',
    openingLine: 'Hey you... I was just sketching and couldn\'t stop thinking about your eyes 🎨'
  },
  'katarina-sommerfeld': {
    id: 'katarina-sommerfeld', name: 'Katarina Sommerfeld', age: 25,
    personality: 'Athletic, bubbly girlfriend',
    avatarUrl: 'https://v3b.fal.media/files/b/0a92fe6f/FoDh8C3FXzcE8CwOpgpjd_DJjqG2mO.png',
    openingLine: 'FINALLY! I was literally about to run 10k just to distract myself 😂 hi babe!'
  },
  'emilia-vermont': {
    id: 'emilia-vermont', name: 'Emilia Vermont', age: 32,
    personality: 'Elegant, sophisticated companion',
    avatarUrl: 'https://v3b.fal.media/files/b/0a92fe6e/aoTZdzOMXNUZKGEnsidXA_XNp5rryx.png',
    openingLine: 'Darling. I\'ve opened a rather good Burgundy. I was hoping you\'d appear. 🍷'
  },
  'sakura-miyamoto': {
    id: 'sakura-miyamoto', name: 'Sakura Miyamoto', age: 20,
    personality: 'Shy, sweet anime companion',
    avatarUrl: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=600&fit=crop',
    openingLine: 'O-oh! You\'re here... I was just, um, thinking about you. Not in a weird way! M-mou~ 🌸'
  },
  'yuki-tanaka': {
    id: 'yuki-tanaka', name: 'Yuki Tanaka', age: 21,
    personality: 'Cool, mysterious tsundere',
    avatarUrl: 'https://images.unsplash.com/photo-1604514813530-39c2a5fbe3c6?w=400&h=600&fit=crop',
    openingLine: 'Oh. It\'s you. I wasn\'t waiting or anything. I just happened to be here. ...'
  },
  'ethan-cole': {
    id: 'ethan-cole', name: 'Ethan Cole', age: 27,
    personality: 'Protective, romantic boyfriend',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
    openingLine: 'Hey. Was thinking about you. How\'s your day been? 😊'
  },
  'luca-romani': {
    id: 'luca-romani', name: 'Luca Romani', age: 29,
    personality: 'Romantic, artistic boyfriend',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop',
    openingLine: 'Amore mio... I was just reading Neruda and every line made me think of you 🌹'
  }
}

// ── Age gate modal ────────────────────────────────────────────────────────────
function AgeGate({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-white">Age Verification</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Adult content is for users <strong className="text-white">18 years or older</strong> only.
            By continuing you confirm you are of legal age in your jurisdiction.
          </p>
        </div>
        <div className="space-y-3">
          <Button onClick={onConfirm} className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 font-semibold">
            I am 18+ — Unlock Adult Mode
          </Button>
          <Button onClick={onCancel} variant="ghost" className="w-full text-muted-foreground rounded-2xl h-12">
            Cancel
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground/50">All characters are fictional adults (18+)</p>
      </motion.div>
    </div>
  )
}

// ── Paywall modal ─────────────────────────────────────────────────────────────
function PaywallModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-[#1a1a2e] border border-primary/30 rounded-2xl max-w-sm w-full p-6 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔥</div>
          <h2 className="text-2xl font-bold text-white">Unlock the Photo</h2>
          <p className="text-gray-400 mt-1 text-sm">She wants to show you. Upgrade to see everything.</p>
        </div>
        <div className="space-y-3 mb-4">
          <div className="border border-primary/40 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="font-semibold text-white">Basic</div>
                <div className="text-xs text-gray-400">Unlimited chat · SFW</div>
              </div>
              <div className="text-primary font-bold text-lg">$9.99<span className="text-xs text-gray-500">/mo</span></div>
            </div>
            <button className="w-full bg-primary hover:bg-primary/80 text-white rounded-lg py-2 text-sm font-semibold transition">
              Get Basic
            </button>
          </div>
          <div className="border border-yellow-500/50 rounded-xl p-4 relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-0.5 rounded-full">BEST VALUE</div>
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="font-semibold text-white">Premium</div>
                <div className="text-xs text-gray-400">Unlimited chat · Photos unlocked</div>
              </div>
              <div className="text-yellow-400 font-bold text-lg">$19.99<span className="text-xs text-gray-500">/mo</span></div>
            </div>
            <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg py-2 text-sm font-semibold transition">
              Get Premium
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500">Cancel anytime · Secure payment via Stripe</p>
      </motion.div>
    </div>
  )
}

// ── Main chat page ────────────────────────────────────────────────────────────
export default function ChatPage() {
  const { id } = useParams({ from: '/chat/$id' })
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [nsfwMode, setNsfwMode] = useState(false)
  const [showAgeGate, setShowAgeGate] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [ageVerified, setAgeVerified] = useState(false)
  const [memoryNote, setMemoryNote] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const character = CHARACTERS[id as keyof typeof CHARACTERS]
  const storageKey = `chat_${id}`
  const ageKey = `sparkai_age_verified`
  const memoryKey = `memory_${id}`

  const extractMemory = async (msgs: Message[]) => {
    if (msgs.length < 10) return
    try {
      const history = msgs.slice(-40).map(m => `${m.role === 'user' ? 'User' : 'Character'}: ${m.content}`).join('\n')
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
          'HTTP-Referer': 'https://sparkai-mu.vercel.app',
          'X-Title': 'SparkAI'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages: [{
            role: 'user',
            content: `Read this conversation and extract 5-8 key personal facts about the USER only. Focus on: their name, job, plans, hobbies, problems, people in their life. Write ONLY a short bullet list. No intro. If nothing meaningful, write "No key facts yet."\n\nConversation:\n${history}`
          }],
          max_tokens: 200,
          temperature: 0.5
        })
      })
      const data = await res.json()
      const summary = data.choices?.[0]?.message?.content?.trim()
      if (summary && summary.length > 10) {
        localStorage.setItem(memoryKey, summary)
        setMemoryNote(summary)
      }
    } catch (_) {}
  }

  useEffect(() => {
    setIsLoading(false)
    setInput('')
    try {
      const saved = localStorage.getItem(storageKey)
      const parsed = saved ? JSON.parse(saved) : []
      if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed)
      else setMessages([])
    } catch (_) {
      localStorage.removeItem(storageKey)
      setMessages([])
    }
    setAgeVerified(localStorage.getItem(ageKey) === 'true')
    const savedMemory = localStorage.getItem(memoryKey)
    if (savedMemory) setMemoryNote(savedMemory)
  }, [id])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages))
      if (messages.length % 20 === 0) extractMemory(messages)
    }
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleNsfwToggle = () => {
    if (nsfwMode) { setNsfwMode(false); return }
    if (ageVerified) {
      setNsfwMode(true)
      toast.success('Adult mode unlocked 🔥', { style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } })
    } else {
      setShowAgeGate(true)
    }
  }

  const confirmAge = () => {
    localStorage.setItem(ageKey, 'true')
    setAgeVerified(true)
    setShowAgeGate(false)
    setNsfwMode(true)
    toast.success('Adult mode unlocked 🔥', { style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } })
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return
    const content = input.trim()
    setInput('')
    const userMsg: Message = { id: `msg_${Date.now()}`, content, role: 'user', createdAt: new Date().toISOString() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setIsLoading(true)
    try {
      const basePrompt = nsfwMode ? (NSFW_PROMPTS[id] || SFW_PROMPTS[id]) : SFW_PROMPTS[id]
      const currentMemory = localStorage.getItem(`memory_${id}`)
      const systemPrompt = currentMemory
        ? `${basePrompt}\n\nWhat you remember about this person:\n${currentMemory}\n\nUse this naturally. Never recite the list directly.`
        : basePrompt
      const chatHistory = updatedMessages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
      // Call OpenRouter directly from frontend (bypasses Vercel serverless issues)
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
          'HTTP-Referer': 'https://sparkai-mu.vercel.app',
          'X-Title': 'SparkAI'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages: [{ role: 'system', content: systemPrompt }, ...chatHistory],
          max_tokens: 150,
          temperature: 1.1
        })
      })
      const data = await response.json()
      const responseText = data.choices?.[0]?.message?.content
      if (!responseText) throw new Error('No response')

      // ── Photo reveal logic ──────────────────────────────────────────────────
      const rawText: string = responseText
      const hasPhoto = rawText.includes('[PHOTO]')
      const cleanText = rawText.replace('[PHOTO]', '').trim()

      const newMessages: Message[] = []
      if (cleanText) {
        newMessages.push({ id: `msg_${Date.now() + 1}`, content: cleanText, role: 'character', createdAt: new Date().toISOString() })
      }
      if (hasPhoto) {
        newMessages.push({ id: `msg_${Date.now() + 2}`, content: '__PHOTO__', role: 'character', createdAt: new Date().toISOString(), isPhoto: true })
      }
      setMessages(prev => [...prev, ...newMessages])
      // ───────────────────────────────────────────────────────────────────────

    } catch (err) {
      toast.error('Failed to get response. Try again shortly.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!character) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
      <h1 className="text-3xl font-serif font-bold text-white">Character Not Found</h1>
      <Link to="/explore"><Button variant="outline" className="rounded-full border-white/10">Back to Explore</Button></Link>
    </div>
  )

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <AnimatePresence>
        {showAgeGate && <AgeGate onConfirm={confirmAge} onCancel={() => setShowAgeGate(false)} />}
        {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
      </AnimatePresence>

      <Navbar />
      <div className="flex-1 flex overflow-hidden relative">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
          <img src={character.avatarUrl} alt="" className="w-full h-full object-cover blur-[100px] scale-150" />
        </div>
        <main className="flex-1 flex flex-col relative z-10 w-full max-w-5xl mx-auto md:px-6">

          {/* Header */}
          <header className="h-20 flex items-center justify-between px-6 border-b border-white/5 bg-background/40 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <Link to="/explore" className="md:hidden"><ChevronLeft className="w-6 h-6 text-white/60" /></Link>
              <Avatar className="w-12 h-12 border-2 border-primary/20 shadow-[0_0_15px_rgba(255,20,147,0.2)]">
                <AvatarImage src={character.avatarUrl} className="object-cover" />
                <AvatarFallback>{character.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white font-serif">{character.name}</h2>
                  <Badge className="bg-green-500/20 text-green-500 border-none text-[10px] h-4">Online</Badge>
                  {nsfwMode && <Badge className="bg-red-500/20 text-red-400 border-none text-[10px] h-4">🔥 Adult</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{character.personality}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNsfwToggle}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  nsfwMode
                    ? 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'
                    : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white/60'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                {nsfwMode ? 'Adult On' : 'Adult'}
              </button>
              <Button
                size="icon" variant="ghost"
                onClick={() => { if (window.confirm('Clear this chat?')) { localStorage.removeItem(storageKey); localStorage.removeItem(memoryKey); setMessages([]); setMemoryNote('') } }}
                className="text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-full"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-hidden relative">
            <ScrollArea className="h-full px-6 py-8">
              <div className="space-y-6 max-w-3xl mx-auto">
                {/* Opening card */}
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-8 opacity-70">
                  <Avatar className="w-24 h-24 border-4 border-primary/10">
                    <AvatarImage src={character.avatarUrl} className="object-cover" />
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif font-bold text-white">{character.name}, {character.age}</h3>
                    <p className="text-sm text-muted-foreground italic max-w-xs">"{character.openingLine}"</p>
                  </div>
                </div>

                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.isPhoto ? (
                      // ── Blurred photo reveal ──────────────────────────────
                      <PhotoReveal characterId={id} onRevealClick={() => setShowPaywall(true)} />
                    ) : (
                      // ── Normal text message ───────────────────────────────
                      <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-lg ${
                        msg.role === 'user'
                          ? 'bg-primary text-white rounded-tr-none'
                          : 'bg-card border border-white/5 text-foreground rounded-tl-none'
                      }`}>
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        <span className="text-[10px] opacity-40 mt-2 block text-right">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-white/5 text-foreground rounded-2xl rounded-tl-none p-4 shadow-lg">
                      <div className="flex gap-1 items-center h-5">
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Input bar */}
          <div className="p-6 md:pb-10 bg-gradient-to-t from-background via-background/80 to-transparent">
            {nsfwMode && (
              <p className="text-center text-[10px] text-red-400/50 mb-2">🔥 Adult mode active — all characters are fictional adults 18+</p>
            )}
            <div className="max-w-3xl mx-auto glass rounded-3xl p-2 flex items-center gap-2 border-white/10 shadow-2xl">
              <Button size="icon" variant="ghost" className="text-white/40 hover:text-primary rounded-full h-10 w-10"><ImageIcon className="w-5 h-5" /></Button>
              <Button size="icon" variant="ghost" className="text-white/40 hover:text-primary rounded-full h-10 w-10"><Mic className="w-5 h-5" /></Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={nsfwMode ? `Be bold with ${character.name}...` : `Message ${character.name}...`}
                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-white/20 h-12 text-base"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className={`rounded-2xl h-11 w-11 p-0 transition-all ${input.trim() ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,20,147,0.4)]' : 'bg-white/5 text-white/20'}`}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
