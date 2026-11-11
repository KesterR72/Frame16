import { Link } from 'react-router-dom'
import { ArrowUpRight, Check } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import PageHeader from '../components/PageHeader'

const steps = [
  {
    num: '01',
    title: 'Stick to three elements',
    desc: 'The biggest mistake creators make is crowding the image with six icons, arrows, and multiple sentences. The cleanest thumbnails use just three things: one expressive face or subject, one clean backdrop, and a 3-to-4 word hook.',
    note: 'Keep text bold and punchy using fonts like Montserrat Black or Anton.',
  },
  {
    num: '02',
    title: 'Add separation and depth',
    desc: 'Flat photos disappear into flat backgrounds. Darken the outer edges with the Vignette slider to guide eyes toward the center, then add a glowing Rim Light around your subject to make them pop off the screen.',
    note: 'Cyan, red, or warm amber rim light works best on dark backgrounds.',
  },
  {
    num: '03',
    title: 'Run the phone & safe-zone checks',
    desc: 'Turn on the Safe-Zone guide to see where YouTube stamps its 14:20 duration clock in the bottom-right corner. Then switch on Phone Test to shrink your canvas down to 120 pixels and verify your headline is readable in half a second.',
    note: 'If you have to squint in Phone Test, scale your text up by 20%.',
  },
  {
    num: '04',
    title: 'Export under YouTube’s 2MB ceiling',
    desc: 'Hit Export 1280×720 to save your finished thumbnail directly to your computer. Safe-zone guides and dashed lines are stripped out automatically, and the file stays neatly below YouTube’s 2MB size limit.',
    note: 'Runs locally in your browser—your images are never uploaded to a server.',
  },
]

const checklist = [
  'Headline is 4 words or fewer and easy to scan',
  'Bottom-right corner is completely clear of text and faces',
  'Subject stands out cleanly against the background',
  'Checked at 120px width using the Phone Test toggle',
  'Passed the Squint Check (strong dark vs light contrast)',
  'File size stays under YouTube’s 2MB limit',
]

const faqs = [
  {
    q: 'Does the 14:20 timestamp badge appear in the exported image?',
    a: 'Never. The timestamp badge is strictly an editor viewfinder guide so you know what YouTube covers up. It is automatically excluded on export.',
  },
  {
    q: 'Can I upload my own photos, screenshots, or logos?',
    a: 'Yes. Drop any image file onto the canvas or click Upload inside the left drawer to bring in your own face cutouts, product shots, or channel logos.',
  },
  {
    q: 'Why shrink the preview down to 120 pixels?',
    a: 'More than three-quarters of YouTube traffic happens on mobile apps where thumbnails appear roughly 120px wide. Testing at that scale catches tiny fonts before you publish.',
  },
  {
    q: 'Do I need an account or subscription?',
    a: 'No accounts, no logins, no watermarks.',
  },
]

export default function HowToUse() {
  return (
    <PageTransition>
      <PageHeader
        kicker="Guide"
        title="Four steps to better thumbnails."
        subtitle="A straightforward workflow for packaging your videos without overcomplicating the design."
      />

      {/* Editorial 4-Step Rows — Zero Bento Cards */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        <div className="divide-y divide-[#27272a] border-b border-[#27272a]">
          {steps.map((step) => (
            <div key={step.num} className="py-12 grid gap-6 md:grid-cols-12 items-start">
              <div className="md:col-span-5 flex items-baseline gap-5">
                <span className="font-mono text-sm text-[#71717a]">{step.num}</span>
                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-white">
                  {step.title}
                </h2>
              </div>
              <div className="md:col-span-7 space-y-3">
                <p className="text-base text-[#a1a1aa] leading-relaxed">{step.desc}</p>
                <p className="text-xs font-mono text-[#71717a]">Tip: {step.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pre-Publish Checklist — Clean Two-Column List */}
      <section className="py-16 max-w-7xl mx-auto px-6 border-b border-[#27272a]">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#71717a]">
              Checklist
            </span>
            <h3 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-white">
              Before you export
            </h3>
          </div>
          <div className="md:col-span-7 grid gap-4 sm:grid-cols-2">
            {checklist.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-zinc-200">
                <Check size={16} className="text-white shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clean Minimal FAQ Rows */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl sm:text-3xl font-bold text-white tracking-tight mb-10">
          Common questions
        </h2>
        <div className="divide-y divide-[#27272a] border-y border-[#27272a]">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-6 space-y-2">
              <h4 className="text-base font-semibold text-white">{faq.q}</h4>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/yt-thumbnail"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#09090b] font-bold text-sm hover:bg-zinc-200 transition-colors"
          >
            <span>Open Thumbnail Maker</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </PageTransition>
  )
}
