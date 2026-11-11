import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import PageHeader from '../components/PageHeader'
import TemplatePreviewCard from '../components/TemplatePreviewCard'
import { PRESET_TEMPLATES } from '../config/templates'
import { STUDIO_PRESETS } from '../features/youtube-thumbnail/assetsCatalog'

export default function Templates() {
  const [selectedCat, setSelectedCat] = useState<string>('all')

  const categories = [
    'all',
    'Comparison & Review',
    'Vlogs & Storytelling',
    'Education & Advice',
    'Finance & Challenges',
  ]

  const filtered =
    selectedCat === 'all'
      ? PRESET_TEMPLATES
      : PRESET_TEMPLATES.filter((t) => t.category === selectedCat)

  return (
    <PageTransition>
      <PageHeader
        kicker="Templates"
        title="Start with a proven layout."
        subtitle="Four clean, high-contrast thumbnail layouts built for real YouTube feeds. Pick one to open directly in the editor."
      />

      <section className="py-12 max-w-7xl mx-auto px-6">
        {/* Clean Category Tabs */}
        <div className="flex flex-wrap items-center gap-6 border-b border-[#27272a] pb-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`text-sm font-medium transition-colors cursor-pointer pb-1 border-b-2 ${
                selectedCat === cat
                  ? 'border-white text-white'
                  : 'border-transparent text-[#71717a] hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Layouts' : cat}
            </button>
          ))}
        </div>

        {/* Clean Editorial Template Showcase Grid */}
        <div className="grid gap-12 md:grid-cols-2">
          {filtered.map((tmpl) => (
            <div key={tmpl.id} className="group space-y-4">
              <Link
                to={`/yt-thumbnail?template=${tmpl.id}`}
                className="block rounded-xl overflow-hidden border border-[#27272a] group-hover:border-zinc-400 transition-colors"
              >
                {STUDIO_PRESETS[tmpl.id] && (
                  <div className="transition-transform duration-500 group-hover:scale-[1.03]">
                    <TemplatePreviewCard preset={STUDIO_PRESETS[tmpl.id]} />
                  </div>
                )}
              </Link>

              <div className="flex items-start justify-between gap-4 pt-1">
                <div className="space-y-1.5">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#71717a]">
                    {tmpl.category}
                  </span>
                  <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-white">
                    {tmpl.title}
                  </h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed max-w-md">
                    {tmpl.description}
                  </p>
                  <p className="text-xs text-[#71717a] pt-1">
                    Why it converts: <span className="text-zinc-300">{tmpl.ctrLogic}</span>
                  </p>
                </div>

                <Link
                  to={`/yt-thumbnail?template=${tmpl.id}`}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-[#09090b] font-semibold text-xs hover:bg-zinc-200 transition-colors"
                >
                  <span>Use Layout</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageTransition>
  )
}
