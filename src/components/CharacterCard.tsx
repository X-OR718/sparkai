import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Play, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

interface CharacterCardProps {
  id: string
  name: string
  description: string
  avatar_url: string
  is_live?: boolean
  tags?: string[]
}

export function CharacterCard({ id, name, description, avatar_url, is_live, tags }: CharacterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link to="/chat/$id" params={{ id }}>
        <Card className="premium-card group h-[400px] md:h-[480px] bg-card border-white/5 cursor-pointer">
          <div className="absolute inset-0 z-0">
            <img 
              src={avatar_url} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80" />
          </div>

          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            {is_live && (
              <Badge className="bg-primary text-white border-none px-2 py-0.5 animate-pulse flex items-center gap-1 shadow-[0_0_15px_rgba(255,20,147,0.5)]">
                <Play className="w-3 h-3 fill-current" />
                LIVE ACTION
              </Badge>
            )}
            <Button size="icon" variant="ghost" className="bg-black/20 backdrop-blur-md hover:bg-black/40 text-white rounded-full">
              <Heart className="w-5 h-5 group-hover:fill-primary group-hover:text-primary transition-all" />
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-white/10 text-white border-none text-[10px] px-2 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white tracking-tight font-serif">{name}</h3>
              <p className="text-sm text-foreground/70 line-clamp-2 leading-relaxed">
                {description}
              </p>
            </div>

            <Button className="w-full bg-white/10 backdrop-blur-md hover:bg-primary text-white border-none mt-2 transition-all group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100 duration-300">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat now
            </Button>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
