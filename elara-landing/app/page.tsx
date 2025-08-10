'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Shield, CreditCard, Eye, DollarSign, CheckCircle, Mail } from "lucide-react"

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const securityRef = useRef<HTMLDivElement>(null)
  const waitlistRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in')
          
          // Special animation for vault door
          if (entry.target.classList.contains('vault-container')) {
            const vaultDoor = entry.target.querySelector('.vault-door')
            if (vaultDoor) {
              setTimeout(() => {
                vaultDoor.classList.add('animate-vault-open')
              }, 500)
            }
          }
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll('.scroll-animate')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
  
    try {
      const FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLScWvLu6qzWk_Gecgjoju2_dQ6QU_J9pFW3WFrUYMPsps7fLNA/formResponse';
      const ENTRY_ID = 'entry.182849506'; 
  
      const formData = new FormData();
      formData.append(ENTRY_ID, email);
  
      await fetch(FORM_ACTION, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });
  
      setIsSubmitted(true);
      setEmail('');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-semibold text-xl">Elara</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection(featuresRef)}
              className="text-gray-600 hover:text-black transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection(howItWorksRef)}
              className="text-gray-600 hover:text-black transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection(securityRef)}
              className="text-gray-600 hover:text-black transition-colors"
            >
              Security
            </button>
          </nav>

          <Button 
            onClick={() => scrollToSection(waitlistRef)}
            className="btn-gold"
          >
            Join Waitlist
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen pt-24 md:pt-32 flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-white"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              A Modern Account,{' '}
              <span className="text-[#C5A572]">Backed by Gold.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up">
              Spend in your currency while your wealth is anchored to the stability of gold. 
              Transparent, secure, and designed for the modern world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Button 
                size="lg" 
                onClick={() => scrollToSection(waitlistRef)}
                className="btn-gold text-lg px-8 py-4"
              >
                Join the Waitlist
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => scrollToSection(featuresRef)}
                className="btn-outline-gold text-lg px-8 py-4"
              >
                Learn More
              </Button>
            </div>
            
            {/* Hero Visual */}
            <div className="pt-16 pb-24 animate-fade-in">
              <div className="relative max-w-md mx-auto">
                {/* Card Image */}
                <div className="relative animate-scale-in" style={{ animation: 'scaleIn 1.2s ease-out forwards' }}>
                  <Image 
                    src="/images/elara_card.png" 
                    alt="Elara Premium Card" 
                    width={400}
                    height={250}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Highlights */}
      <section ref={featuresRef} className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need for modern banking
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for stability, designed for growth, secured by gold.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: DollarSign,
                title: "Spend in local currency, anchored to gold",
                description: "Use your account for everyday purchases (e.g. USD, EGP, GBP, etc.) while your wealth maintains its gold backing."
              },
              {
                icon: Eye,
                title: "Instant account visibility",
                description: "Real-time tracking of your gold holdings and account balance with complete transparency."
              },
              {
                icon: CreditCard,
                title: "Transparent pricing",
                description: "No hidden fees. Clear, upfront costs with no surprises."
              },
              {
                icon: Shield,
                title: "Secure & compliant",
                description: "Bank-level security with full regulatory compliance and insurance protection."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howItWorksRef} className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, transparent, and secure. Here&apos;s how your gold-backed account works.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Join the waitlist",
                  description: "Sign up to be among the first to experience gold-backed banking."
                },
                {
                  step: "02", 
                  title: "Get your account",
                  description: "Receive your account details and start funding it with your local currency."
                },
                {
                  step: "03",
                  title: "Spend and grow",
                  description: "Use your account for daily transactions while your wealth grows with gold."
                }
              ].map((step, index) => (
                <div key={index} className="text-center" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto mb-6">
                      <span className="text-white font-bold text-lg">{step.step}</span>
                    </div>
                    {index < 2 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 transform translate-x-4"></div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security & Transparency */}
      <section ref={securityRef} className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="scroll-animate">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Security & Transparency
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Your gold is stored in secure, insured vaults with regular audits and complete transparency. 
                  We believe you should know exactly where your wealth is and how it is protected.
                </p>
                
                <div className="space-y-4">
                  {[
                    "Physical gold stored in insured vaults",
                    "Regular third-party audits",
                    "Real-time transparency dashboard",
                    "Bank-level security encryption"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#C5A572] flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="scroll-animate vault-container">
                {/* Animated Gold Vault */}
                <div className="relative max-w-sm mx-auto">
                  <div className="vault-door p-8 shadow-2xl">
                    <div className="vault-glow"></div>
                    <div className="relative z-10">
                      <div className="text-center mb-6">
                        <h3 className="text-white text-xl font-semibold mb-2">Secure Vault</h3>
                        <p className="text-gray-400 text-sm">Your gold is protected here</p>
                      </div>
                      
                      {/* Vault wheel */}
                      <div className="flex justify-center mb-6">
                        <div className="vault-wheel animate-vault-wheel">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1 h-8 bg-yellow-400 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Vault door details */}
                      <div className="space-y-3">
                        <div className="h-1 bg-gray-600 rounded-full"></div>
                        <div className="h-1 bg-gray-600 rounded-full w-3/4 mx-auto"></div>
                        <div className="h-1 bg-gray-600 rounded-full w-1/2 mx-auto"></div>
                      </div>
                      
                      {/* Security indicators */}
                      <div className="flex justify-between items-center mt-6 text-xs text-gray-400">
                        <span>🔒 Encrypted</span>
                        <span>📊 Audited</span>
                        <span>🛡️ Insured</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating gold particles */}
                  <div className="absolute -top-4 -right-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-1/2 -right-6 w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email Waitlist */}
      <section ref={waitlistRef} className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Be among the first
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of people who are ready for a new kind of banking. 
                Get early access and exclusive updates.
              </p>
            </div>
            
            {!isSubmitted ? (
              <form onSubmit={handleEmailSubmit}>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <div className="flex-1">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A572] focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2 text-left">{error}</p>}
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="btn-gold px-8 py-3 whitespace-nowrap"
                  >
                    {isLoading ? 'Joining...' : 'Join Waitlist'}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  We will only use your email for launch updates. No spam, ever.
                </p>
              </form>
            ) : (
              <div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">You are on the list!</h3>
                  <p className="text-green-700">
                    Thank you for joining. We will notify you as soon as we launch.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="font-semibold text-xl">Elara</span>
              </div>
              <p className="text-gray-400 text-sm">
                Modern banking anchored to the stability of gold.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => scrollToSection(featuresRef)}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection(howItWorksRef)}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection(securityRef)}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    Security
                  </button>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Elara. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

