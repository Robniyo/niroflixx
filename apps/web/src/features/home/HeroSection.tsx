import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, GraduationCap, Briefcase, Wrench, ArrowRight, Users, Star, BookOpen } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext';

const stats = [
  { icon: Users, label: 'Courses & Training' },
  { icon: BookOpen, label: 'Opportunities Hub' },
  { icon: Star, label: 'Professional Services' },
]

function MobileBanner() {
  const banners = [
    { icon: GraduationCap, title: 'Digital Skills Academy', desc: 'Master in-demand tech skills with expert-led training.', color: 'bg-primary-100', iconColor: 'text-primary-600' },
    { icon: Briefcase, title: 'Find Opportunities', desc: 'Scholarships, jobs & internships.', color: 'bg-accent-100', iconColor: 'text-accent-600' },
    { icon: Wrench, title: 'Professional Services', desc: 'CV writing, design & more.', color: 'bg-success-light', iconColor: 'text-success' },
  ]
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const banner = banners[current]

  return (
    <div className="lg:hidden mb-8 w-full overflow-hidden bg-white/10 backdrop-blur-sm rounded-2xl p-5 min-h-[100px] transition-all duration-500">
      <div className="flex items-center gap-3 animate-fade-in" key={current}>
        <div className={`w-12 h-12 ${banner.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <banner.icon className={`w-6 h-6 ${banner.iconColor}`} />
        </div>
        <div>
          <h4 className="text-white font-bold text-base">{banner.title}</h4>
          <p className="text-white/80 text-sm">{banner.desc}</p>
        </div>
      </div>
      <div className="flex justify-center gap-1.5 mt-3">
        {banners.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all cursor-pointer ${i === current ? 'bg-white w-6' : 'bg-white/30 w-2'}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function HeroSection() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate('/search?q=' + encodeURIComponent(searchQuery.trim()))
      setSearchOpen(false)
    }
  }

  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden w-full max-w-[100vw]">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-400 rounded-full blur-3xl" />
      </div>

      <div className="container-page relative z-10 py-24 md:py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-body-sm mb-6 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Welcome to Niroflix
            </div>
            <h1 className="text-display-xl text-white mb-6 leading-[1.05]">
              Learn, <span className="text-gradient">Grow,</span><br />Succeed.
            </h1>
            <p className="text-body-lg text-white/80 mb-8 max-w-lg leading-relaxed">
              One platform for digital skills, scholarships, jobs, professional services, and career growth. Built for the world.
            </p>

            {/* Search — Mobile */}
            <div className="lg:hidden w-full mb-4">
              {!searchOpen ? (
                <button onClick={() => setSearchOpen(true)} className="w-full flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 text-white/80 text-sm active:bg-white/30 transition-all">
                  <Search className="w-5 h-5 text-white flex-shrink-0" />
                  <span>Search courses, scholarships, jobs...</span>
                </button>
              ) : (
                <div className="bg-white rounded-xl p-3 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search..." className="flex-1 px-2 py-2 text-body border-none outline-none text-secondary-900 placeholder:text-secondary-400 min-w-0" autoFocus />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setSearchOpen(false)} className="flex-1 py-2 text-sm text-secondary-500 hover:text-secondary-700">Cancel</button>
                    <Button size="md" className="flex-1" onClick={handleSearch}>Search</Button>
                  </div>
                </div>
              )}
            </div>

            {/* Search — Desktop */}
            <div className="hidden lg:flex items-center gap-2 bg-white rounded-lg p-1.5 shadow-xl max-w-md mb-8">
              <Search className="w-5 h-5 text-secondary-400 ml-3 flex-shrink-0" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search courses, scholarships, jobs..." className="flex-1 px-2 py-2 text-body border-none outline-none text-secondary-900 placeholder:text-secondary-400" />
              <Button size="md" className="flex-shrink-0" onClick={handleSearch}>Search</Button>
            </div>

            <div className="flex flex-wrap gap-3 mb-8 md:mb-10">
              {!isAuthenticated && (
                <Link to="/register"><Button size="lg" variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />} className="shadow-lg font-semibold">Get Started Free</Button></Link>
              )}
              <Link to="/academy"><Button size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/20 hover:border-white font-semibold"><GraduationCap className="w-4 h-4" /> Explore Academy</Button></Link>
            </div>

            {/* Mobile Rotating Banner */}
            <MobileBanner />

            {/* Stats */}
            <div className="flex flex-wrap gap-6 md:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div><div className="text-body-sm text-white/60">{stat.label}</div></div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Floating Cards */}
          <div className="hidden lg:block relative">
            <div className="relative w-full h-[500px]">
              <Link to="/academy" className="absolute top-10 right-10 w-72 bg-white rounded-xl shadow-2xl p-6 animate-float hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer block">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4"><GraduationCap className="w-6 h-6 text-primary-600" /></div>
                <h4 className="font-semibold text-secondary-900 mb-2">Digital Skills Academy</h4>
                <p className="text-body-sm text-secondary-500 mb-3">Master in-demand tech skills with expert-led training.</p>
                <div className="flex items-center gap-2 text-primary-600 text-body-sm font-medium">Browse Courses <ArrowRight className="w-4 h-4" /></div>
              </div>
              <Link to="/opportunities" className="absolute bottom-20 left-5 w-64 bg-white rounded-xl shadow-xl p-5 animate-float hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer block" style={{ animationDelay: '2s' }}>
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mb-3"><Briefcase className="w-5 h-5 text-accent-600" /></div>
                <h4 className="font-semibold text-secondary-900 mb-1">Find Opportunities</h4>
                <p className="text-body-sm text-secondary-500">Scholarships, jobs & internships.</p>
              </div>
              <Link to="/services" className="absolute top-40 left-0 w-56 bg-white rounded-xl shadow-lg p-4 animate-float hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer block" style={{ animationDelay: '4s' }}>
                <div className="w-10 h-10 bg-success-light rounded-lg flex items-center justify-center mb-3"><Wrench className="w-5 h-5 text-success" /></div>
                <h4 className="font-semibold text-secondary-900 mb-1">Professional Services</h4>
                <p className="text-body-sm text-secondary-500">CV writing, design & more.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}