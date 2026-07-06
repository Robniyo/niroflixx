import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, GraduationCap, Briefcase, Wrench, ArrowRight, Users, Star, BookOpen } from 'lucide-react'
import Button from '@/components/ui/Button'

const stats = [
  { icon: Users, label: 'Courses & Training' },
  { icon: BookOpen, label: 'Opportunities Hub' },
  { icon: Star, label: 'Professional Services' },
]

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate('/search?q=' + encodeURIComponent(searchQuery.trim()))
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
              One platform for digital skills, scholarships, jobs, professional services, and career growth. Built for Africa's future.
            </p>
            <div className="flex items-center gap-2 bg-white rounded-lg p-1.5 shadow-xl max-w-full sm:max-w-full sm:max-w-md mb-8">
              <Search className="w-5 h-5 text-secondary-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search courses, scholarships, jobs..."
                className="flex-1 px-2 py-2 text-body border-none outline-none text-secondary-900 placeholder:text-secondary-400"
              />
              <Button size="md" className="flex-shrink-0" onClick={handleSearch}>Search</Button>
            </div>
            <div className="flex flex-wrap gap-3 mb-8 md:mb-10">
              <Link to="/register"><Button size="lg" variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />} className="shadow-lg font-semibold">Get Started Free</Button></Link>
              <Link to="/academy"><Button size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/20 hover:border-white font-semibold"><GraduationCap className="w-4 h-4" /> Explore Academy</Button></Link>
            </div>

              {/* Mobile Cards — matching desktop style exactly */}
                  <div className="lg:hidden grid grid-cols-2 gap-2 mb-6 w-full">
                    <div className="bg-white rounded-xl shadow-lg p-4 animate-float col-span-2">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-secondary-900 text-sm">Digital Skills Academy</h4>
                          <p className="text-secondary-500 text-xs mt-0.5">Master in-demand tech skills with expert-led training.</p>
                          <p className="text-primary-600 text-xs font-medium mt-2 flex items-center gap-1">Browse Courses</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-4 animate-float" style={{ animationDelay: '0.5s' }}>
                      <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mb-3">
                        <Briefcase className="w-5 h-5 text-accent-600" />
                      </div>
                      <h4 className="font-semibold text-secondary-900 text-sm">Find Opportunities</h4>
                      <p className="text-secondary-500 text-xs mt-0.5">Scholarships, jobs & internships.</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-4 animate-float" style={{ animationDelay: '1s' }}>
                      <div className="w-10 h-10 bg-success-light rounded-lg flex items-center justify-center mb-3">
                        <Wrench className="w-5 h-5 text-success" />
                      </div>
                      <h4 className="font-semibold text-secondary-900 text-sm">Professional Services</h4>
                      <p className="text-secondary-500 text-xs mt-0.5">CV writing, design & more.</p>
                    </div>
                  </div>

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
              <div className="absolute top-10 right-10 w-72 bg-white rounded-xl shadow-2xl p-6 animate-float">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4"><GraduationCap className="w-6 h-6 text-primary-600" /></div>
                <h4 className="font-semibold text-secondary-900 mb-2">Digital Skills Academy</h4>
                <p className="text-body-sm text-secondary-500 mb-3">Master in-demand tech skills with expert-led training.</p>
                <div className="flex items-center gap-2 text-primary-600 text-body-sm font-medium">Browse Courses <ArrowRight className="w-4 h-4" /></div>
              </div>
              <div className="absolute bottom-20 left-5 w-64 bg-white rounded-xl shadow-xl p-5 animate-float" style={{ animationDelay: '2s' }}>
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mb-3"><Briefcase className="w-5 h-5 text-accent-600" /></div>
                <h4 className="font-semibold text-secondary-900 mb-1">Find Opportunities</h4>
                <p className="text-body-sm text-secondary-500">Scholarships, jobs & internships.</p>
              </div>
              <div className="absolute top-40 left-0 w-56 bg-white rounded-xl shadow-lg p-4 animate-float" style={{ animationDelay: '4s' }}>
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