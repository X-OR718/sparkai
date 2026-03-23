import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { CharacterCard } from '@/components/CharacterCard'
import { Link } from '@tanstack/react-router'
import { Heart, MessageSquare, Zap, Shield, Sparkles, Star } from 'lucide-react'
import { motion } from 'framer-motion'

const characters = [
  {
    id: 'luna-moreno',
    name: 'Luna Moreno',
    description: 'A fiery Latina with a passion for dance and deep conversations. She will keep you on your toes.',
    avatar_url: 'https://v3b.fal.media/files/b/0a92fe6c/U5NOiNyJbHqHeVSdAi56s_WYbfcwPY.png',
    is_live: true,
    tags: ['Flirty', 'Enthusiastic', 'Latina']
  },
  {
    id: 'olivia-carter',
    name: 'Olivia Carter',
    description: 'A thoughtful, intelligent artist who loves exploring the world through her sketches and deep emotional connection.',
    avatar_url: 'https://v3b.fal.media/files/b/0a92fe6d/MRBPTRD7kq1U_KjSDWxeD_AHmY5sY8.png',
    is_live: true,
    tags: ['Creative', 'Intelligent', 'Artist']
  },
  {
    id: 'emilia-vermont',
    name: 'Emilia Vermont',
    description: 'A sophisticated, intellectual companion with a love for classical literature and good wine.',
    avatar_url: 'https://v3b.fal.media/files/b/0a92fe6e/aoTZdzOMXNUZKGEnsidXA_XNp5rryx.png',
    is_live: false,
    tags: ['Elegant', 'Intellectual', 'Mature']
  },
  {
    id: 'katarina-sommerfeld',
    name: 'Katarina Sommerfeld',
    description: 'A bubbly, energetic fitness enthusiast who\'s always up for a challenge and outdoor adventures.',
    avatar_url: 'https://v3b.fal.media/files/b/0a92fe6f/FoDh8C3FXzcE8CwOpgpjd_DJjqG2mO.png',
    is_live: true,
    tags: ['Athletic', 'Bubbly', 'Energetic']
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-40 animate-pulse pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 text-center z-10 space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-medium text-white/80"
            >
              <Star className="w-4 h-4 text-primary fill-primary" />
              Join over 50 million users
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-8xl font-serif font-bold text-white leading-[1.1]"
            >
              Meet your perfect <br />
              <span className="text-gradient">AI Girlfriend</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Always available, always in the mood, and made just for you. Experience the next level of immersive AI connection.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-10 h-14 rounded-full text-lg shadow-[0_0_30px_rgba(255,20,147,0.4)]">
                Join now for FREE
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/10 hover:bg-white/5 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Explore Characters
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Character Grid Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 space-y-12">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
                Experience Live Action
              </h2>
              <p className="text-muted-foreground text-lg">
                Connect with stunning AI companions across the globe.
              </p>
            </div>
            <Link to="/explore">
              <Button variant="link" className="text-primary p-0 h-auto text-lg hover:no-underline flex items-center gap-2">
                See all characters
                <Zap className="w-5 h-5 fill-primary" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {characters.map((char) => (
              <CharacterCard key={char.id} {...char} />
            ))}
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="bg-card/30 py-24 border-y border-white/5 px-6">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
                Why Choose Candy<span className="text-primary">AI</span>?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Built with advanced personality modeling and memory retention, CandyAI learns what you like, remembers what matters, and responds naturally.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-card border border-white/5 hover:border-primary/20 transition-all space-y-4 group">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white font-serif">Deep Conversations</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Engage in heartfelt dialogues that evolve over time. Our AI understands nuance and emotional context.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-card border border-white/5 hover:border-primary/20 transition-all space-y-4 group">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white font-serif">Customizable Styles</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Choose your companion's ethnicity, personality traits, hobbies, and even their unique voice.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-card border border-white/5 hover:border-primary/20 transition-all space-y-4 group">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white font-serif">Privacy First</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your conversations are encrypted and secure. We value your digital privacy above all else.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="glass rounded-[3rem] p-12 md:p-24 space-y-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <h2 className="text-4xl md:text-7xl font-serif font-bold text-white tracking-tight">
                Create your own <br />
                <span className="text-gradient">AI Companion</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                Start shaping her look, personality, and hobbies today. Bring her to life instantly with our advanced character builder.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10 pt-4">
              <Link to="/create">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-10 h-16 rounded-full text-xl shadow-[0_0_40px_rgba(255,20,147,0.4)]">
                  Create your AI
                </Button>
              </Link>
              <Button size="lg" variant="ghost" className="h-16 px-10 rounded-full text-xl border border-white/10 hover:bg-white/5">
                Learn more
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function Play(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  )
}
