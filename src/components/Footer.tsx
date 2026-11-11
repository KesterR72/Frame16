import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#27272a] bg-[#09090b] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Row: Brand & Horizontal Nav */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[#27272a]/70">
          <div className="flex items-center gap-3">
            <img
              src="/frame16-logo.png"
              alt="Frame16"
              className="w-7 h-7 object-contain"
            />
            <span className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-base tracking-tight text-white">
              FRAME16
            </span>
          </div>

          <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            <Link to="/" className="text-[#a1a1aa] hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/tools" className="text-[#a1a1aa] hover:text-white transition-colors">
              Tools
            </Link>
            <Link to="/templates" className="text-[#a1a1aa] hover:text-white transition-colors">
              Templates
            </Link>
            <Link to="/how-to-use" className="text-[#a1a1aa] hover:text-white transition-colors">
              How to Use
            </Link>
            <Link to="/yt-thumbnail" className="text-white font-medium hover:underline">
              Thumbnail Maker
            </Link>
          </nav>
        </div>

        {/* Bottom Row: Copyright & Powered by Rubec */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs font-mono text-[#71717a]">
            © {new Date().getFullYear()} Frame16. All rights reserved.
          </p>

          <a
            href="https://rubec.pages.dev"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs text-[#a1a1aa] hover:text-white transition-colors group"
          >
            <img
              src="/robin-gold.svg"
              alt="Rubec"
              className="w-4 h-4 object-contain transition-transform group-hover:scale-110"
            />
            <span>
              Powered by <span className="text-[#D4AF37] font-semibold">Rubec</span>
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}
