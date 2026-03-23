import { Link } from '@tanstack/react-router'
import { Heart, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-white/5 py-12 md:py-20 px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
        <div className="col-span-2 lg:col-span-2 space-y-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,20,147,0.4)] group-hover:scale-110 transition-transform">
              <Heart className="text-white w-6 h-6 fill-current" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-serif">
              Candy<span className="text-primary">AI</span>
            </span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            Experience lifelike AI companions for immersive, high-quality chats and creative expression.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a href="#" className="w-10 h-10 bg-card rounded-lg flex items-center justify-center text-foreground/60 hover:text-primary transition-all border border-white/5">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-card rounded-lg flex items-center justify-center text-foreground/60 hover:text-primary transition-all border border-white/5">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-card rounded-lg flex items-center justify-center text-foreground/60 hover:text-primary transition-all border border-white/5">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-card rounded-lg flex items-center justify-center text-foreground/60 hover:text-primary transition-all border border-white/5">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Categories</h4>
          <ul className="space-y-2">
            <li><Link to="/explore" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Girlfriends</Link></li>
            <li><Link to="/explore" className="text-sm text-muted-foreground hover:text-primary transition-colors">Anime Characters</Link></li>
            <li><Link to="/explore" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Boyfriends</Link></li>
            <li><Link to="/explore" className="text-sm text-muted-foreground hover:text-primary transition-colors">Latest AI</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Support</h4>
          <ul className="space-y-2">
            <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            <li><Link to="/community" className="text-sm text-muted-foreground hover:text-primary transition-colors">Community</Link></li>
            <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Contact</h4>
          <ul className="space-y-2">
            <li><a href="mailto:support@candy.ai" className="text-sm text-muted-foreground hover:text-primary transition-colors">support@candy.ai</a></li>
            <li className="text-sm text-muted-foreground pt-4 flex flex-col gap-2">
              <span className="font-semibold text-white/40">© 2026 CandyAI</span>
              <span>All rights reserved.</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
