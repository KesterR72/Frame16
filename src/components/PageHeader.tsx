import { motion } from 'framer-motion'

interface PageHeaderProps {
  kicker?: string
  title: string
  subtitle: string
}

export default function PageHeader({ kicker, title, subtitle }: PageHeaderProps) {
  return (
    <div className="pt-32 pb-12 md:pt-40 md:pb-16 border-b border-[#27272a]/70">
      <div className="max-w-7xl mx-auto px-6">
        {kicker && (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="block font-mono text-xs uppercase tracking-[0.2em] text-[#71717a] mb-4"
          >
            {kicker}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-4xl leading-[1.08]"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 text-base sm:text-lg text-[#a1a1aa] max-w-2xl leading-relaxed"
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  )
}
