import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { Heart, PlusCircle, Search, User } from 'lucide-react'

export function Navbar() {
  const { user, login, logout, isAuthenticated } = useAuth()

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/5 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,20,147,0.4)] group-hover:scale-110 transition-transform">
            <Heart className="text-white w-6 h-6 fill-current" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white font-serif">
            Candy<span className="text-primary">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/explore" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
            Girls
          </Link>
          <Link to="/explore" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
            Anime
          </Link>
          <Link to="/explore" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
            Guys
          </Link>
          <Link to="/create" className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
            <PlusCircle className="w-4 h-4" />
            Create
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex text-foreground/70 hover:text-primary">
            <Search className="w-5 h-5" />
          </Button>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/my-characters" className="hidden md:block">
                <Button variant="ghost" className="text-sm font-medium text-foreground/70 hover:text-primary">
                  My AI
                </Button>
              </Link>
              <Button onClick={() => logout()} variant="outline" className="border-primary/20 hover:bg-primary/10">
                Log out
              </Button>
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center overflow-hidden border border-white/10">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-foreground/40" />
                )}
              </div>
            </div>
          ) : (
            <Button onClick={() => login()} className="bg-primary hover:bg-primary/90 text-white px-6 shadow-[0_0_20px_rgba(255,20,147,0.3)]">
              Join now
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
