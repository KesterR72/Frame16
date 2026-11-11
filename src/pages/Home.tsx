import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Layers } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import TemplatePreviewCard from '../components/TemplatePreviewCard'
import { PRESET_TEMPLATES } from '../config/templates'
import { STUDIO_PRESETS } from '../features/youtube-thumbnail/assetsCatalog'

export default function Home() {
  const [sliderPos, setSliderPos] = useState(50)
  const [rimDemoOn, setRimDemoOn] = useState(true)

  return (
    <PageTransition>
      {/* Hero Section — Clean, zero eyebrow status pill */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[360px] bg-white/[0.025] blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.05]"
          >
            Design thumbnails that actually get clicked.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-6 text-lg sm:text-xl text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed"
          >
            Most thumbnails fail for two simple reasons: the text is unreadable on a phone, or important details get hidden behind YouTube's timestamp badge. Frame16 checks both before you export.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/yt-thumbnail"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-[#09090b] font-bold text-base transition-all duration-300 hover:bg-zinc-200 hover:shadow-[0_0_28px_rgba(255,255,255,0.2)] active:scale-95"
            >
              <span>Open Thumbnail Maker</span>
              <ArrowUpRight size={18} />
            </Link>
            <Link
              to="/templates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-transparent border border-[#27272a] text-white font-medium text-base hover:bg-white/[0.04] hover:border-zinc-500 transition-colors"
            >
              <span>Browse Templates</span>
              <Layers size={18} className="text-[#a1a1aa]" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Interactive Before / After Split Comparison Slider */}
      <section className="py-16 border-y border-[#27272a]/70 bg-[#0c0c0e]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl sm:text-3xl font-bold text-white tracking-tight">
                See the contrast difference.
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-[#a1a1aa]">
                Drag across the frame to compare an unedited photo against a packaged thumbnail.
              </p>
            </div>
            <span className="font-mono text-xs text-[#71717a] uppercase tracking-wider">
              1280 × 720 · Interactive Check
            </span>
          </div>

          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#27272a] shadow-2xl select-none">
            {/* AFTER */}
            <div className="absolute inset-0 bg-[#09090b]">
              <img
                src="/assets/backgrounds/deep-blue-mesh.jpg"
                alt="Packaged background"
                className="w-full h-full object-cover filter contrast-125 saturate-125"
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
              <img
                src="/assets/expressions/cutout-shocked-woman.png"
                alt="Subject cutout"
                className="absolute right-[6%] bottom-0 h-[88%] object-contain filter drop-shadow-[0_0_32px_rgba(56,189,248,0.85)]"
              />
              <div className="absolute left-[8%] top-[24%] space-y-2">
                <span className="block font-['Montserrat',sans-serif] font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tighter drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] -rotate-2">
                  I WAS
                </span>
                <span className="block font-['Montserrat',sans-serif] font-black text-4xl sm:text-6xl md:text-7xl text-red-500 tracking-tighter drop-shadow-[0_8px_25px_rgba(239,68,68,0.7)] -rotate-2">
                  WRONG.
                </span>
              </div>
              <span className="absolute right-5 top-5 font-mono text-[11px] uppercase tracking-widest text-white/80 bg-black/60 px-2.5 py-1 rounded">
                After
              </span>
            </div>

            {/* BEFORE */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden bg-zinc-900 border-r-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="absolute inset-0 w-[100vw] max-w-6xl aspect-[16/9]">
                <img
                  src="/assets/expressions/shocked-woman.jpg"
                  alt="Raw photo"
                  className="w-full h-full object-cover filter grayscale contrast-75 brightness-90"
                />
                <div className="absolute inset-0 bg-black/35 flex flex-col justify-center items-center p-8 text-center">
                  <span className="text-lg sm:text-xl font-mono text-zinc-300">
                    Raw Unpackaged Photo
                  </span>
                </div>
                <span className="absolute left-5 top-5 font-mono text-[11px] uppercase tracking-widest text-zinc-300 bg-black/60 px-2.5 py-1 rounded">
                  Before
                </span>
              </div>
            </div>

            {/* Handle */}
            <div
              className="absolute top-0 bottom-0 -ml-4 w-8 flex items-center justify-center cursor-ew-resize pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-[#09090b] text-xs font-bold">
                ↔
              </div>
            </div>

            <input
              type="range"
              min="5"
              max="95"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              aria-label="Before and after comparison slider"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>
        </div>
      </section>

      {/* Editorial Feature Breakdown — Zero Bento Cards */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#71717a]">
            How it works
          </span>
          <h2 className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Built around how people actually browse YouTube.
          </h2>
        </div>

        <div className="divide-y divide-[#27272a] border-t border-[#27272a]">
          {/* Row 01: Mobile Feed Check */}
          <div className="py-12 md:py-16 grid gap-10 md:grid-cols-12 items-center">
            <div className="md:col-span-6 space-y-4">
              <span className="font-mono text-sm text-[#71717a]">01</span>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl sm:text-3xl font-bold text-white">
                Test readability at actual phone size.
              </h3>
              <p className="text-base text-[#a1a1aa] leading-relaxed max-w-lg">
                Over 75% of YouTube views happen on mobile screens where your image is shrunk to roughly 120 pixels wide. Flip one switch inside the editor to see your thumbnail inside a real phone feed before exporting.
              </p>
            </div>
            <div className="md:col-span-6 flex justify-center md:justify-end">
              <div className="w-full max-w-md p-5 rounded-xl bg-[#121215] border border-[#27272a]">
                <div className="flex gap-3.5 items-start">
                  <div className="w-[120px] h-[67.5px] rounded-md overflow-hidden relative shrink-0 border border-zinc-700">
                    <TemplatePreviewCard preset={STUDIO_PRESETS['the-metric-flex']} />
                    <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/85 text-[8px] font-mono text-white font-bold">
                      14:20
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-white leading-snug">
                      How I Rebuilt Everything in 30 Days
                    </p>
                    <p className="text-[11px] text-[#71717a]">
                      Creator Name · 84K views · 1d ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 02: Timestamp Safe-Zone */}
          <div className="py-12 md:py-16 grid gap-10 md:grid-cols-12 items-center">
            <div className="md:col-span-6 md:order-2 space-y-4">
              <span className="font-mono text-sm text-[#71717a]">02</span>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl sm:text-3xl font-bold text-white">
                Keep vital details clear of YouTube's clock.
              </h3>
              <p className="text-base text-[#a1a1aa] leading-relaxed max-w-lg">
                YouTube permanently drops the video duration badge in the bottom-right corner. Toggle our viewfinder safe zone while arranging layers so nothing important gets blocked and rest easy knowing the badge never renders on your export.
              </p>
            </div>
            <div className="md:col-span-6 md:order-1 flex justify-center md:justify-start">
              <div className="w-full max-w-md aspect-[16/9] rounded-xl bg-[#121215] border border-[#27272a] relative overflow-hidden p-4 flex items-end justify-end">
                <div className="absolute inset-4 border border-dashed border-zinc-700 rounded-lg pointer-events-none" />
                <div className="relative z-10 flex flex-col items-end gap-2">
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider">
                    Blocked by YouTube UI
                  </span>
                  <div className="px-3 py-1 rounded bg-black border border-red-500/60 text-sm font-mono font-bold text-white">
                    14:20
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 03: Interactive Rim Glow Preview */}
          <div className="py-12 md:py-16 grid gap-10 md:grid-cols-12 items-center">
            <div className="md:col-span-6 space-y-4">
              <span className="font-mono text-sm text-[#71717a]">03</span>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl sm:text-3xl font-bold text-white">
                Instant subject separation without Photoshop.
              </h3>
              <p className="text-base text-[#a1a1aa] leading-relaxed max-w-lg">
                Dial in contrast, darken the outer edges with a subtle vignette, and cast a crisp rim glow behind any cutout portrait or uploaded photo so your subject pops off the screen.
              </p>
              <button
                onClick={() => setRimDemoOn((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#27272a] bg-[#121215] hover:border-zinc-400 text-xs font-mono text-white transition-colors cursor-pointer"
              >
                <span>Rim Light: {rimDemoOn ? 'ON' : 'OFF'}</span>
                <span className="text-[#71717a]">(Click to toggle)</span>
              </button>
            </div>
            <div className="md:col-span-6 flex justify-center md:justify-end">
              <div className="w-full max-w-md aspect-[16/9] rounded-xl bg-[#09090b] border border-[#27272a] relative overflow-hidden flex items-end justify-center pt-4">
                <img
                  src="/assets/expressions/cutout-surprised-man.png"
                  alt="Rim glow demonstration"
                  className="h-[92%] w-auto object-contain transition-all duration-300"
                  style={{
                    filter: rimDemoOn
                      ? 'contrast(115%) saturate(115%) drop-shadow(0 0 28px rgba(56,189,248,0.85))'
                      : 'contrast(95%) saturate(95%)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Starter Templates Strip */}
      <section className="py-20 border-t border-[#27272a]/70 bg-[#0c0c0e]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#71717a]">
                Ready to customize
              </span>
              <h2 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-white tracking-tight">
                Start from a proven layout.
              </h2>
            </div>
            <Link
              to="/templates"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-zinc-300 transition-colors"
            >
              <span>See all templates</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PRESET_TEMPLATES.map((tmpl) => (
              <Link
                key={tmpl.id}
                to={`/yt-thumbnail?template=${tmpl.id}`}
                className="group block space-y-3"
              >
                <div className="rounded-xl overflow-hidden border border-[#27272a] group-hover:border-zinc-400 transition-colors">
                  {STUDIO_PRESETS[tmpl.id] && (
                    <div className="transition-transform duration-500 group-hover:scale-105">
                      <TemplatePreviewCard preset={STUDIO_PRESETS[tmpl.id]} />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between px-0.5">
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:underline">
                      {tmpl.title}
                    </h4>
                    <span className="text-xs text-[#71717a]">{tmpl.category}</span>
                  </div>
                  <ArrowUpRight size={15} className="text-[#71717a] group-hover:text-white transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Open Editorial Closing CTA */}
      <section className="py-28 border-t border-[#27272a]/70">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Zero accounts. Zero watermarks.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#a1a1aa] max-w-xl mx-auto">
            Everything runs locally in your browser. Drop your photos, check mobile readability, and export in seconds.
          </p>
          <div className="mt-9 flex justify-center">
            <Link
              to="/yt-thumbnail"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#09090b] font-bold text-base hover:bg-zinc-200 transition-all active:scale-95"
            >
              <span>Get Started</span>
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}