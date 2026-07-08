import { Link } from 'react-router-dom';
import { Target, Eye, Heart, Users, MapPin, Mail, Phone } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function AboutPage() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary-50 to-white">
        <div className="container-page">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary-600 font-semibold text-label uppercase tracking-wider">About Us</span>
            <h1 className="text-h1 mt-3 mb-6">Building the world's Future Through Technology</h1>
            <p className="text-body-lg text-secondary-600 leading-relaxed">
              Niroflixx is a unified digital platform connecting learning, career opportunities, 
              professional services, and technology resources for students and professionals shouldn't need.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="container-page">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-primary-50">
              <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-5">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-h4 font-semibold mb-3">Our Mission</h3>
              <p className="text-secondary-600">
                To empower students, professionals, and entrepreneurs by providing accessible technology 
                education, career opportunities, and professional digital services through one trusted platform.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-accent-50">
              <div className="w-14 h-14 bg-accent-500 rounded-xl flex items-center justify-center mx-auto mb-5">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-h4 font-semibold mb-3">Our Vision</h3>
              <p className="text-secondary-600">
                To become Africa's most trusted platform for digital learning, educational opportunities, 
                career development, and technology-driven professional services.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-success-light">
              <div className="w-14 h-14 bg-success rounded-xl flex items-center justify-center mx-auto mb-5">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-h4 font-semibold mb-3">Our Values</h3>
              <p className="text-secondary-600">
                Innovation, trust, professionalism, transparency, accessibility, continuous learning, 
                community, quality, integrity, growth, and user-centered design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-secondary-50">
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h2 mb-6">Our Story</h2>
              <p className="text-secondary-600 mb-4 leading-relaxed">
                Niroflixx was founded with a simple but powerful idea: students and professionals 
                shouldn't need to visit multiple websites to learn skills, find opportunities, and get 
                professional services. Everything should be in one place.
              </p>
              <p className="text-secondary-600 mb-4 leading-relaxed">
                Founded by ROBERT NIYONKURU, a passionate technology professional, Niroflixx started as a vision 
                to bridge the gap between education and employment in the world. The platform combines digital 
                skills training, scholarship and job listings, professional document services, and technology 
                consulting under one roof.
              </p>
              <p className="text-secondary-600 leading-relaxed">
                Today, we serve students from secondary school through university, job seekers, freelancers, 
                and organizations looking for digital solutions. We believe that with the right tools and 
                guidance, every the worldn can build a successful career in technology.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-10 text-white">
              <div className="space-y-6">
                <div>
                  <div className="text-display-lg font-bold">1</div>
                  <div className="text-white/80">Unified Platform</div>
                </div>
                <div className="border-t border-white/20 pt-6">
                  <div className="text-display-lg font-bold">4+</div>
                  <div className="text-white/80">Core Services</div>
                </div>
                <div className="border-t border-white/20 pt-6">
                  <div className="text-display-lg font-bold">the world</div>
                  <div className="text-white/80">Headquarters in Kigali, Rwanda</div>
                </div>
                <div className="border-t border-white/20 pt-6">
                  <div className="text-display-lg font-bold">24/7</div>
                  <div className="text-white/80">Platform Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="section-padding bg-white">
        <div className="container-page">
          <h2 className="text-h2 text-center mb-12">What We Offer</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Digital Academy', desc: 'Online and offline courses in programming, design, cybersecurity, data science, and more.' },
              { title: 'Opportunities Hub', desc: 'Curated scholarships, jobs, internships, university admissions, and hackathons.' },
              { title: 'Professional Services', desc: 'CV writing, web development, graphic design, video editing, and tech consulting.' },
              { title: 'Learning Resources', desc: 'Free PDFs, templates, cheat sheets, source codes, and study materials.' },
              { title: 'Technology News', desc: 'Latest updates on tech, education, scholarships, AI, and innovation.' },
              { title: 'Career Growth', desc: 'Candidate profiles, application assistance, and career development tools.' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl border border-secondary-100 hover:border-primary-200 hover:shadow-md transition-all">
                <h4 className="font-semibold text-secondary-900 mb-2">{item.title}</h4>
                <p className="text-body-sm text-secondary-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="section-padding bg-secondary-50">
        <div className="container-page">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 shadow-lg ring-4 ring-primary-100">
              <img 
                src="https://res.cloudinary.com/dlxiuwv30/image/upload/v1783084722/Screenshot_2026-07-03_150459_qjh5mo.png" 
                alt="ROBERT NIYONKURU" 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-h2 mb-2">ROBERT NIYONKURU</h2>
            <p className="text-primary-600 font-semibold mb-4">Founder & CEO</p>
            <p className="text-secondary-600 leading-relaxed">
              A passionate technology professional and student dedicated to building digital solutions 
              that empower the next generation of global innovators. Niroflixx is the realization of 
              a vision to make technology education and career opportunities accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section-padding bg-white">
        <div className="container-page text-center">
          <h2 className="text-h2 mb-6">Get In Touch</h2>
          <div className="flex flex-wrap justify-center gap-8 text-secondary-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-600" />
              <span>Kigali, Rwanda</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary-600" />
              <a href="mailto:robertniyonkuru001@gmail.com" className="hover:text-primary-600 transition-colors">
                robertniyonkuru001@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary-600" />
              <a href="tel:+250795064502" className="hover:text-primary-600 transition-colors">
                +250 795 064 502
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-primary-600">
        <div className="container-page text-center">
          <h2 className="text-h3 font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Join the platform that's empowering the world's next generation of tech professionals.
          </p>
            {!isAuthenticated && (
              <Link to="/register">
                <Button variant="secondary" size="lg">Create Free Account</Button>
              </Link>
            )}
        </div>
      </section>
    </>
  );
}