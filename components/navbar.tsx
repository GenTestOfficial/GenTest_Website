"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, LayoutDashboard } from "lucide-react"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isSignedIn } = useUser()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/product", label: "Product" },
    { href: "/try", label: "Try GenTest" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md shadow-md"
    >
      <nav className="container flex h-20 items-center justify-between">
        <Link 
          href="/"
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-500 to-teal-400 bg-clip-text text-transparent hover:from-violet-600 hover:to-teal-500 transition-all duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          GenTest
        </Link>

        <ul className="hidden md:flex items-center space-x-10">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link 
                href={href}
                className="relative text-base font-medium transition-colors hover:text-foreground/80 py-2"
              >
                {label}
                {pathname === href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-[24px] left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-teal-400"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center space-x-6">
          {isSignedIn ? (
            <>
              <Link href="/try/editor">
                <Button 
                  className="bg-gradient-to-r from-violet-500 to-teal-400 hover:from-violet-600 hover:to-teal-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-base px-6 py-6"
                >
                  Use GenTest
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="outline" className="hidden md:block">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button 
                  className="bg-gradient-to-r from-violet-500 to-teal-400 hover:from-violet-600 hover:to-teal-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-base px-6 py-6"
                >
                  Get Started
                </Button>
              </SignUpButton>
            </>
          )}

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-3 hover:bg-muted rounded-md transition-colors"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-white/10"
          >
            <ul className="container py-4 space-y-4">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link 
                    href={href}
                    className={`relative text-lg font-medium transition-colors hover:text-foreground/80 py-2 ${pathname === href ? 'text-violet-400' : 'text-foreground/70'}`}
                    onClick={toggleMobileMenu}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {isSignedIn ? (
                <>
                  <li>
                    <Link href="/try/editor" onClick={toggleMobileMenu}>
                      <Button 
                        className="bg-gradient-to-r from-violet-500 to-teal-400 hover:from-violet-600 hover:to-teal-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-lg px-8 py-4 w-full"
                      >
                        Use GenTest
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" onClick={toggleMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start text-sm font-medium hover:text-purple-500 transition-colors">
                        Dashboard
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <UserButton afterSignOutUrl="/" />
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <SignInButton mode="modal">
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </SignInButton>
                  </li>
                  <li>
                    <SignUpButton mode="modal">
                      <Button 
                        className="bg-gradient-to-r from-violet-500 to-teal-400 hover:from-violet-600 hover:to-teal-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-lg px-8 py-4 w-full"
                      >
                        Get Started
                      </Button>
                    </SignUpButton>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

