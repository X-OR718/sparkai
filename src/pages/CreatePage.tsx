import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sparkles, Heart, Wand2, ArrowRight, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { blink } from '@/lib/blink'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks/use-auth'

export default function CreatePage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, isAuthenticated, login } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    personality: '',
    ethnicity: 'Caucasian',
    age: '24',
    eyeColor: 'Brown',
    hairStyle: 'Long wavy',
    hairColor: 'Brunette',
    hobbies: '',
    voice: 'Sweet',
    avatar_url: ''
  })

  const totalSteps = 4

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Please join us first to create your companion!')
      login()
      return
    }

    setLoading(true)
    try {
      const charId = formData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substr(2, 5)
      
      // Use a placeholder if no image
      const avatarUrl = formData.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop'

      // @ts-ignore
      await blink.db.characters.create({
        id: charId,
        userId: user?.id,
        name: formData.name,
        description: formData.description,
        personality: formData.personality,
        avatarUrl: avatarUrl,
        age: parseInt(formData.age),
        ethnicity: formData.ethnicity,
        voiceId: formData.voice,
        hobbies: JSON.stringify(formData.hobbies.split(',').map(h => h.trim())),
        isPublic: false
      })

      toast.success('Your AI companion is alive!')
      navigate({ to: '/chat/$id', params: { id: charId } })
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 md:py-20 w-full flex flex-col gap-10">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto shadow-[0_0_20px_rgba(255,20,147,0.2)]"
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight">
            Create your AI <br />
            <span className="text-gradient">Companion</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Shape her look, personality, and bring her to life instantly.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="glass rounded-[2rem] p-8 md:p-12 border border-white/5 relative min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1"
              >
                <div className="space-y-4">
                  <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">1</div>
                    The Basics
                  </h2>
                  <p className="text-muted-foreground">Tell us the core identity of your new companion.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-white/80 text-base">What is her name?</Label>
                    <Input 
                      id="name"
                      placeholder="e.g. Luna" 
                      className="bg-background/50 border-white/10 h-12 rounded-xl focus-visible:ring-primary/40"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="age" className="text-white/80 text-base">How old is she?</Label>
                    <Select 
                      value={formData.age} 
                      onValueChange={(val) => setFormData({ ...formData, age: val })}
                    >
                      <SelectTrigger className="bg-background/50 border-white/10 h-12 rounded-xl focus:ring-primary/40">
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 text-white">
                        {['18', '21', '24', '28', '32', '40+'].map(age => (
                          <SelectItem key={age} value={age}>{age}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <Label htmlFor="description" className="text-white/80 text-base">One-sentence bio</Label>
                    <Input 
                      id="description"
                      placeholder="e.g. A passionate artist who loves deep conversations." 
                      className="bg-background/50 border-white/10 h-12 rounded-xl focus-visible:ring-primary/40"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1"
              >
                <div className="space-y-4">
                  <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">2</div>
                    Physical Appearance
                  </h2>
                  <p className="text-muted-foreground">Shape her look exactly the way you imagine her.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-white/80 text-base">Ethnicity</Label>
                    <Select value={formData.ethnicity} onValueChange={(val) => setFormData({ ...formData, ethnicity: val })}>
                      <SelectTrigger className="bg-background/50 border-white/10 h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 text-white">
                        {['Caucasian', 'Latina', 'Asian', 'Arab', 'African'].map(v => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-white/80 text-base">Eye Color</Label>
                    <Select value={formData.eyeColor} onValueChange={(val) => setFormData({ ...formData, eyeColor: val })}>
                      <SelectTrigger className="bg-background/50 border-white/10 h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 text-white">
                        {['Brown', 'Blue', 'Green', 'Hazel', 'Grey'].map(v => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-white/80 text-base">Hair Style</Label>
                    <Select value={formData.hairStyle} onValueChange={(val) => setFormData({ ...formData, hairStyle: val })}>
                      <SelectTrigger className="bg-background/50 border-white/10 h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 text-white">
                        {['Long wavy', 'Straight', 'Curly', 'Short bob', 'Bangs'].map(v => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-white/80 text-base">Hair Color</Label>
                    <Select value={formData.hairColor} onValueChange={(val) => setFormData({ ...formData, hairColor: val })}>
                      <SelectTrigger className="bg-background/50 border-white/10 h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 text-white">
                        {['Brunette', 'Blonde', 'Black', 'Red', 'Pink', 'Blue'].map(v => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1"
              >
                <div className="space-y-4">
                  <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">3</div>
                    Personality & Soul
                  </h2>
                  <p className="text-muted-foreground">What makes her tick? How does she respond to you?</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-white/80 text-base">Personality Traits</Label>
                    <Textarea 
                      placeholder="e.g. Bubbly, flirty, nurturing, intellectual, adventurous..." 
                      className="bg-background/50 border-white/10 rounded-2xl h-32 focus-visible:ring-primary/40 resize-none"
                      value={formData.personality}
                      onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-white/80 text-base">Hobbies (comma separated)</Label>
                    <Input 
                      placeholder="e.g. Dancing, Reading, Hiking, Gaming" 
                      className="bg-background/50 border-white/10 h-12 rounded-xl focus-visible:ring-primary/40"
                      value={formData.hobbies}
                      onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1"
              >
                <div className="space-y-4">
                  <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">4</div>
                    Voice & Final Polish
                  </h2>
                  <p className="text-muted-foreground">The final touches to make her yours.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-white/80 text-base">Voice Style</Label>
                    <Select value={formData.voice} onValueChange={(val) => setFormData({ ...formData, voice: val })}>
                      <SelectTrigger className="bg-background/50 border-white/10 h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10 text-white">
                        {['Sweet', 'Soft', 'Deep', 'Energetic', 'Bubbly', 'Sultry'].map(v => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="glass rounded-[2rem] p-6 border-white/10 space-y-4">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-primary" />
                      Character Preview
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/60">Name: <span className="text-white font-medium">{formData.name || 'Untitled'}</span></p>
                      <p className="text-white/60">Vibe: <span className="text-white font-medium">{formData.personality || 'To be defined'}</span></p>
                      <p className="text-white/60">Look: <span className="text-white font-medium">{formData.ethnicity}, {formData.hairColor} {formData.hairStyle}</span></p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 text-center space-y-2">
                  <p className="text-primary font-medium flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4 fill-current" />
                    Almost ready!
                  </p>
                  <p className="text-muted-foreground text-sm">Your companion will be created instantly and added to your private collection.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between gap-4 pt-8 mt-auto border-t border-white/5">
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              disabled={step === 1 || loading}
              className="rounded-full h-12 px-6 hover:bg-white/5"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {step < totalSteps ? (
              <Button 
                onClick={handleNext} 
                className="rounded-full h-12 px-8 bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(255,20,147,0.3)]"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                className="rounded-full h-12 px-10 bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(255,20,147,0.5)]"
              >
                {loading ? 'Bringing her to life...' : 'Bring her to life'}
                {!loading && <Sparkles className="w-4 h-4 ml-2" />}
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
