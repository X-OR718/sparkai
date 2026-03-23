import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CharacterCard } from '@/components/CharacterCard'
import { Button } from '@/components/ui/button'
import { PlusCircle, Loader2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@/hooks/use-auth'
import { useQuery } from '@tanstack/react-query'
import { blink } from '@/lib/blink'

export default function MyCharactersPage() {
  const { user, isAuthenticated, login } = useAuth()

  const { data: characters, isLoading } = useQuery({
    queryKey: ['my-characters', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      return await blink.db.characters.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })
    },
    enabled: !!user?.id
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-6 max-w-md">
            <h1 className="text-4xl font-serif font-bold text-white">Your Collection</h1>
            <p className="text-muted-foreground text-lg">Sign in to view and manage your custom AI companions.</p>
            <Button onClick={() => login()} className="bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-full shadow-[0_0_20px_rgba(255,20,147,0.3)]">
              Sign in now
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 md:py-20 w-full flex flex-col gap-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight">
              My AI <span className="text-gradient">Collection</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Manage your private companions and continue your stories.
            </p>
          </div>
          <Link to="/create">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-full shadow-[0_0_20px_rgba(255,20,147,0.3)]">
              <PlusCircle className="w-5 h-5 mr-2" />
              Create new AI
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : characters && characters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {characters.map((char: any) => (
              <CharacterCard 
                key={char.id} 
                id={char.id}
                name={char.name}
                description={char.description}
                avatar_url={char.avatarUrl}
                is_live={false}
                tags={[char.ethnicity, `${char.age}y/o`]}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[3rem] bg-card/10 space-y-6">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/20">
              <PlusCircle className="w-10 h-10" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-serif font-bold text-white">No characters yet</h3>
              <p className="text-muted-foreground">Start by creating your first AI companion!</p>
            </div>
            <Link to="/create">
              <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/5">
                Get started
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
