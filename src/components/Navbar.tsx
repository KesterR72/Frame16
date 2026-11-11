import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/tools', label: 'Tools' },
  { to: '/templates', label: 'Templates' },
  { to: '/how-to-use', label: 'How to Use' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#09090b]/85 backdrop-blur-md border-b border-[#27272a]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Clean Brand Mark & Wordmark */}
        <Link to="/" className="group flex items-center gap-3">
          <img
            src="/frame16-logo.png"
            alt="Frame16"
            className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[18px] tracking-tight text-white">
            FRAME16
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors ${
                  isActive ? 'text-white' : 'text-[#a1a1aa] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <span className="relative py-1">
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 right-0 -bottom-1 h-[2px] bg-white rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Primary CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/yt-thumbnail"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-[#09090b] font-semibold text-sm transition-all duration-300 hover:bg-zinc-200 active:scale-95"
          >
            <span>Get Started</span>
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-10 h-10 rounded-lg border border-[#27272a] bg-[#121215] flex items-center justify-center text-[#a1a1aa] hover:text-white"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-b border-[#27272a] bg-[#09090b]/95 backdrop-blur-xl px-6 py-6 space-y-4"
          >
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-base font-medium text-[#a1a1aa] hover:text-white py-2"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t border-[#27272a]">
              <Link
                to="/yt-thumbnail"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white text-[#09090b] font-semibold text-sm"
              >
                <span>Get Started</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
