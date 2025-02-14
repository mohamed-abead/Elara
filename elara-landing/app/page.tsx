import { Button } from "@/components/ui/button"
import { Wallet, BarChartIcon as ChartBar, Shield, Twitter, Linkedin, Instagram } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#f5f5f0]/80 backdrop-blur-sm border-b border-[#004d40]/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Elara Islamic Wealth Management and Halal Investment Platform Logo"
              width={32}
              height={32}
              className="w-8 h-8"
              priority
            />
            <span className="text-[#004d40] font-semibold text-xl">Elara</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-[#004d40] hover:text-[#004d40]/80 transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-[#004d40] hover:text-[#004d40]/80 transition-colors">
              About
            </Link>
            <Link href="#pricing" className="text-[#004d40] hover:text-[#004d40]/80 transition-colors">
              Pricing
            </Link>
          </nav>

          <Button className="bg-[#004d40] text-white hover:bg-[#004d40]/90">Join Waitlist</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen pt-24 md:pt-32 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold text-[#004d40] leading-tight">
              Master Your Islamic Wealth Journey with Elara
            </h1>
            <p className="text-base md:text-lg text-[#004d40]/80 max-w-2xl mx-auto">
              Your all-in-one platform for tracking wealth, budgeting smartly, and investing in halal assets. Join a waitlist of
              users and take control of your financial future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#004d40] text-white hover:bg-[#004d40]/90">
                Join the Waitlist
              </Button>
              <Button size="lg" variant="outline" className="border-[#004d40] text-[#004d40] hover:bg-[#004d40]/10">
                Learn More
              </Button>
            </div>
            <div className="pt-12 pb-24">
              <Image
                src="/images/logo.png"
                alt="Elara Logo"
                width={400}
                height={400}
                className="rounded-xl mx-auto w-full max-w-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#004d40] mb-16">
            Everything you need to grow your wealth
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-[#004d40]/10 hover:border-[#004d40]/20 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[#004d40]/10 flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6 text-[#004d40]" />
              </div>
              <h3 className="text-xl font-semibold text-[#004d40] mb-2">Smart Budgeting</h3>
              <p className="text-[#004d40]/70">
                Automatically categorize your expenses and get personalized insights to optimize your spending habits.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-[#004d40]/10 hover:border-[#004d40]/20 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[#004d40]/10 flex items-center justify-center mb-4">
                <ChartBar className="w-6 h-6 text-[#004d40]" />
              </div>
              <h3 className="text-xl font-semibold text-[#004d40] mb-2">Investment Tracking</h3>
              <p className="text-[#004d40]/70">
                Track all your investments in one place with real-time updates and comprehensive portfolio analysis.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-[#004d40]/10 hover:border-[#004d40]/20 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[#004d40]/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-[#004d40]" />
              </div>
              <h3 className="text-xl font-semibold text-[#004d40] mb-2">Secure & Private</h3>
              <p className="text-[#004d40]/70">
                Bank-level security encryption and privacy-first approach to protect your financial data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#004d40] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/logo.png"
                  alt="Elara Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 brightness-200"
                />
                <span className="font-semibold text-xl">Elara</span>
              </div>
              <p className="text-white/80 text-sm">
                Empowering you to achieve financial clarity and growth through halal wealth management.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-white/80 hover:text-white">
                  <Twitter className="w-5 h-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-white/80 hover:text-white">
                  <Linkedin className="w-5 h-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link href="#" className="text-white/80 hover:text-white">
                  <Instagram className="w-5 h-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Features</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-white/80 hover:text-white text-sm">
                    Wealth Tracking
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white text-sm">
                    Zakat Calculation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white text-sm">
                    Savings Goals
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white text-sm">
                    Investment Screener
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white text-sm">
                    Portfolio Analytics
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-white/80 hover:text-white text-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white text-sm">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white text-sm">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white text-sm">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-white/80 hover:text-white text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white text-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white text-sm">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/80 hover:text-white text-sm">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60 text-sm">
            <p>© {new Date().getFullYear()} Elara. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

