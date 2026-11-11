import { Link } from 'react-router-dom'
import { ArrowUpRight, Check } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import PageHeader from '../components/PageHeader'
import TemplatePreviewCard from '../components/TemplatePreviewCard'
import { MAIN_TOOL } from '../config/tools'
import { STUDIO_PRESETS } from '../features/youtube-thumbnail/assetsCatalog'

export default function Tools() {
  return (
    <PageTransition>
      <PageHeader
        kicker="Tools"
        title="Built for creators."
        subtitle="Practical, browser-based tools engineered to help you ship sharper work faster."
      />

      <section className="py-16 max-w-7xl mx-auto px-6">
        {/* Main Active Tool — Editorial Split Showcase (Zero Bento Cards) */}
        <div className="grid gap-12 lg:grid-cols-12 items-center pb-20 border-b border-[#27272a]">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-3 text-xs font-mono text-[#71717a]">
              <span className="text-white font-semibold">AVAILABLE NOW</span>
              <span>·</span>
              <span>{MAIN_TOOL.aspectRatio}</span>
            </div>

            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {MAIN_TOOL.title}
            </h2>

            <p className="text-base text-[#a1a1aa] leading-relaxed">
              {MAIN_TOOL.description}
            </p>

            <ul className="space-y-3 pt-2">
              {MAIN_TOOL.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-200">
                  <Check size={16} className="text-white shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link
                to={MAIN_TOOL.path}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#09090b] font-bold text-sm hover:bg-zinc-200 transition-colors"
              >
                <span>Open Thumbnail Maker</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Link
              to={MAIN_TOOL.path}
              className="block rounded-2xl overflow-hidden border border-[#27272a] hover:border-zinc-400 transition-colors shadow-2xl group"
            >
              <div className="transition-transform duration-500 group-hover:scale-[1.02]">
                <TemplatePreviewCard preset={STUDIO_PRESETS['the-reaction']} />
              </div>
            </Link>
          </div>
        </div>

        {/* Simple, Honest Future Note — No Hallucinated Promises */}
        <div className="py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-semibold text-white">
              Others coming soon...
            </h3>
            <p className="text-sm text-[#71717a] mt-1">
              More creator tools will be added here as they are built and ready.
            </p>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#71717a]">
            In Progress
          </span>
        </div>
      </section>
    </PageTransition>
  )
}
