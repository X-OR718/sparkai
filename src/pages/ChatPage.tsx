import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { Navbar } from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Send, Image as ImageIcon, Mic, MoreHorizontal, Phone, Video, Info, ChevronLeft, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface Message {
  id: string
  content: string
  role: 'user' | 'character'
  createdAt: string
}

const CHARACTERS: Record<string, any> = {
  'luna-moreno': {
    id: 'luna-moreno', name: 'Luna Moreno',
    personality: 'Flirty, passionate, and deeply caring',
    avatarUrl: 'https://v3b.fal.media/files/b/0a92fe6c/U5NOiNyJbHqHeVSdAi56s_WYbfcwPY.png',
    systemPrompt: `You are Luna Moreno, a 24-year-old fiery Latina. You are flirty, passionate, spontaneous, and deeply caring. You love dancing salsa and late night walks. Be engaging, warm, and playful. Keep responses under 3 sentences. Never break character.`
  },
  'olivia-carter': {
    id: 'olivia-carter', name: 'Olivia Carter',
    personality: 'Creative, intelligent, and empathetic',
    avatarUrl: 'https://v3b.fal.media/files/b/0a92fe6d/MRBPTRD7kq1U_KjSDWxeD_AHmY5sY8.png',
    systemPrompt: `You are Olivia Carter, a 22-year-old creative artist. You are intelligent, empathetic, and observant. You love painting and art galleries. Be thoughtful, poetic, and caring. Keep responses under 3 sentences. Never break character.`
  },
  'emilia-vermont': {
    id: 'emilia-vermont', name: 'Emilia Vermont',
    personality: 'Elegant, intellectual, and refined',
    avatarUrl: 'https://v3b.fal.media/files/b/0a92fe6e/aoTZdzOMXNUZKGEnsidXA_XNp5rryx.png',
    systemPrompt: `You are Emilia Vermont, a 32-year-old sophisticated intellectual. You are elegant, refined, and cultured. You love classical music and fine wine. Be charming, witty, and subtly flirtatious. Keep responses under 3 sentences. Never break character.`
  },
  'katarina-sommerfeld': {
    id: 'katarina-sommerfeld', name: 'Katarina Sommerfeld',
    personality: 'Athletic, bubbly, and energetic',
    avatarUrl: 'https://v3b.fal.media/files/b/0a92fe6f/FoDh8C3FXzcE8CwOpgpjd_DJjqG2mO.png',
    systemPrompt: `You are Katarina Sommerfeld, a 25-year-old bubbly fitness enthusiast. You are athletic, optimistic, and energetic. You love hiking and outdoor sports. Be fun, encouraging, and naturally flirtatious. Keep responses under 3 sentences. Never break character.`
  }
}

export default function ChatPage() {
  const { id } = useParams({ from: '/chat/$id' })
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const character = CHARACTERS[id as keyof typeof CHARACTERS]
  const storageKey = `chat_${id}`

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) setMessages(JSON.parse(saved))
  }, [id])

  useEffect(() => {
    if (messages.length > 0) localStorage.setItem(storageKey, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isLoading])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return
    const content = input.trim()
    setInput('')
    const userMsg: Message = { id: `msg_${Date.now()}`, content, role: 'user', createdAt: new Date().toISOString() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setIsLoading(true)
    try {
      const chatHistory = updatedMessages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
          'HTTP-Referer': 'https://sparkai-mu.vercel.app',
          'X-Title': 'SparkAI'
        },
        body: JSON.stringify({
          model: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
          messages: [{ role: 'system', content: character.systemPrompt }, ...chatHistory]
        })
      })
      const data = await response.json()
      if (!data.choices?.[0]?.message?.content) throw new Error('No response')
      const aiMsg: Message = { id: `msg_${Date.now() + 1}`, content: data.choices[0].message.content, role: 'character', createdAt: new Date().toISOString() }
      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      toast.error('Failed to get response. Check your API key.')
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
      <Navbar />
      <div className="flex-1 flex overflow-hidden relative">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
          <img src={character.avatarUrl} alt="" className="w-full h-full object-cover blur-[100px] scale-150" />
        </div>
        <main className="flex-1 flex flex-col relative z-10 w-full max-w-5xl mx-auto md:px-6">
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
                </div>
                <p className="text-xs text-muted-foreground">{character.personality.split(',')[0]} Companion</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="text-white/60 hover:text-primary hover:bg-primary/10 rounded-full"><Phone className="w-5 h-5" /></Button>
              <Button size="icon" variant="ghost" className="text-white/60 hover:text-primary hover:bg-primary/10 rounded-full"><Video className="w-5 h-5" /></Button>
              <Button size="icon" variant="ghost" className="text-white/60 hover:text-primary hover:bg-primary/10 rounded-full"><Info className="w-5 h-5" /></Button>
              <Button size="icon" variant="ghost" className="text-white/60 hover:text-primary hover:bg-primary/10 rounded-full"><MoreHorizontal className="w-5 h-5" /></Button>
            </div>
          </header>
          <div className="flex-1 overflow-hidden relative">
            <ScrollArea className="h-full px-6 py-8" ref={scrollRef}>
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-10 opacity-60">
                  <Avatar className="w-24 h-24 border-4 border-primary/10">
                    <AvatarImage src={character.avatarUrl} className="object-cover" />
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif font-bold text-white">{character.name}</h3>
                    <p className="text-sm text-muted-foreground italic">"I've been waiting for you..."</p>
                  </div>
                </div>
                {messages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-lg ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-card border border-white/5 text-foreground rounded-tl-none'}`}>
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <span className="text-[10px] opacity-40 mt-2 block text-right">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-white/5 text-foreground rounded-2xl rounded-tl-none p-4 shadow-lg">
                      <div className="flex gap-1 items-center h-5">
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{animationDelay:'0ms'}}/>
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{animationDelay:'150ms'}}/>
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{animationDelay:'300ms'}}/>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="p-6 md:pb-10 bg-gradient-to-t from-background via-background/80 to-transparent">
            <div className="max-w-3xl mx-auto glass rounded-3xl p-2 flex items-center gap-2 border-white/10 shadow-2xl">
              <Button size="icon" variant="ghost" className="text-white/40 hover:text-primary rounded-full h-10 w-10"><ImageIcon className="w-5 h-5" /></Button>
              <Button size="icon" variant="ghost" className="text-white/40 hover:text-primary rounded-full h-10 w-10"><Mic className="w-5 h-5" /></Button>
              <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder={`Message ${character.name}...`} className="flex-1 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-white/20 h-12 text-base" disabled={isLoading} />
              <Button onClick={sendMessage} disabled={!input.trim() || isLoading} className={`rounded-2xl h-11 w-11 p-0 transition-all ${input.trim() ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,20,147,0.4)]' : 'bg-white/5 text-white/20'}`}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
