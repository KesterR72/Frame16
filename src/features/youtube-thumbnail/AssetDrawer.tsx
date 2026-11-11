import { useState, useRef, type ChangeEvent } from 'react'
import { LayoutTemplate, Smile, Image as ImageIcon, Type, Upload, Plus } from 'lucide-react'
import {
  EXPRESSION_ASSETS,
  BACKGROUND_ASSETS,
  STICKER_ASSETS,
  STUDIO_PRESETS,
} from './assetsCatalog'
import { type StudioDocument } from './types'

interface AssetDrawerProps {
  onLoadTemplate: (preset: StudioDocument) => void
  onAddImageLayer: (src: string, name: string, rounded?: boolean) => void
  onAddTextLayer: () => void
  onAddBadgeLayer: () => void
  onAddDividerLayer: () => void
  onSetBackgroundImage: (src: string) => void
  onSetBackgroundType: (type: StudioDocument['backgroundType']) => void
}

type TabKey = 'templates' | 'faces' | 'backgrounds' | 'elements'

export default function AssetDrawer({
  onLoadTemplate,
  onAddImageLayer,
  onAddTextLayer,
  onAddBadgeLayer,
  onAddDividerLayer,
  onSetBackgroundImage,
  onSetBackgroundType,
}: AssetDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('faces')
  const faceUploadRef = useRef<HTMLInputElement>(null)
  const bgUploadRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (
    e: ChangeEvent<HTMLInputElement>,
    mode: 'layer' | 'background'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      if (mode === 'layer') {
        onAddImageLayer(dataUrl, file.name.replace(/\.[^/.]+$/, ''), false)
      } else {
        onSetBackgroundImage(dataUrl)
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const tabs: { key: TabKey; label: string; icon: typeof LayoutTemplate }[] = [
    { key: 'templates', label: 'Templates', icon: LayoutTemplate },
    { key: 'faces', label: 'Faces', icon: Smile },
    { key: 'backgrounds', label: 'Backdrop', icon: ImageIcon },
    { key: 'elements', label: 'Text & +', icon: Type },
  ]

  return (
    <aside className="w-full lg:w-[300px] xl:w-[320px] shrink-0 bg-[#121215] border-b lg:border-b-0 lg:border-r border-[#27272a] flex flex-col h-auto lg:h-full overflow-hidden">
      {/* Top Vertical-or-Horizontal Tab Rail */}
      <div className="grid grid-cols-4 border-b border-[#27272a] bg-[#09090b]/40">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors cursor-pointer border-b-2 ${
                active
                  ? 'border-white text-white bg-white/[0.04]'
                  : 'border-transparent text-[#71717a] hover:text-[#a1a1aa]'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 max-h-[300px] lg:max-h-none">
        {activeTab === 'templates' && (
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-[#71717a]">
              Starter Layouts
            </div>
            {Object.values(STUDIO_PRESETS).map((preset) => (
              <button
                key={preset.id}
                onClick={() => onLoadTemplate(preset)}
                className="w-full text-left rounded-xl bg-[#18181b] border border-[#27272a] hover:border-zinc-400 transition-all overflow-hidden group cursor-pointer"
              >
                <div className="aspect-[16/9] bg-black relative overflow-hidden">
                  {preset.backgroundType === 'split' ? (
                    <div className="w-full h-full flex">
                      <div className="w-1/2 h-full" style={{ backgroundColor: preset.splitLeftColor }} />
                      <div className="w-1/2 h-full" style={{ backgroundColor: preset.splitRightColor }} />
                    </div>
                  ) : (
                    <img
                      src={preset.backgroundImage}
                      alt={preset.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2.5 text-xs font-bold text-white">
                    {preset.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'faces' && (
          <div className="space-y-4">
            {/* Custom Upload Button */}
            <input
              ref={faceUploadRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'layer')}
            />
            <button
              onClick={() => faceUploadRef.current?.click()}
              className="w-full py-2.5 px-3 rounded-xl bg-white text-[#09090b] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <Upload size={14} />
              <span>Upload Your Photo / Logo</span>
            </button>

            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#71717a] mb-2.5">
                Stock Expression Cutouts
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {EXPRESSION_ASSETS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onAddImageLayer(item.src, item.label)}
                    className="group rounded-xl bg-[#18181b] border border-[#27272a] hover:border-white/70 p-2 transition-all flex flex-col items-center cursor-pointer"
                  >
                    <div className="w-full aspect-square rounded-lg bg-[#09090b] overflow-hidden flex items-end justify-center pt-2">
                      <img
                        src={item.src}
                        alt={item.label}
                        className="h-full w-auto object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="mt-1.5 text-[11px] font-medium text-zinc-300 group-hover:text-white">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'backgrounds' && (
          <div className="space-y-4">
            {/* Custom Background Upload */}
            <input
              ref={bgUploadRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'background')}
            />
            <button
              onClick={() => bgUploadRef.current?.click()}
              className="w-full py-2.5 px-3 rounded-xl bg-white text-[#09090b] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <Upload size={14} />
              <span>Upload Custom Background</span>
            </button>

            {/* Quick Mode Selectors */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#71717a] mb-2">
                Canvas Style
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => onSetBackgroundType('split')}
                  className="py-2 rounded-lg bg-[#18181b] border border-[#27272a] hover:border-white text-[11px] font-medium text-zinc-200 cursor-pointer"
                >
                  Split A/B
                </button>
                <button
                  onClick={() => onSetBackgroundType('gradient')}
                  className="py-2 rounded-lg bg-[#18181b] border border-[#27272a] hover:border-white text-[11px] font-medium text-zinc-200 cursor-pointer"
                >
                  Gradient
                </button>
                <button
                  onClick={() => onSetBackgroundType('solid')}
                  className="py-2 rounded-lg bg-[#18181b] border border-[#27272a] hover:border-white text-[11px] font-medium text-zinc-200 cursor-pointer"
                >
                  Solid Dark
                </button>
              </div>
            </div>

            {/* Real Unsplash Studio Backgrounds */}
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#71717a] mb-2.5">
                Backgrounds
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {BACKGROUND_ASSETS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => onSetBackgroundImage(bg.src)}
                    className="group rounded-xl bg-[#18181b] border border-[#27272a] hover:border-white/70 overflow-hidden transition-all text-left cursor-pointer"
                  >
                    <div className="aspect-[16/9] bg-black overflow-hidden">
                      <img
                        src={bg.src}
                        alt={bg.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="px-2 py-1.5 text-[11px] font-medium text-zinc-300 truncate">
                      {bg.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'elements' && (
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-[#71717a]">
                Add Typography & Shapes
              </div>
              <button
                onClick={onAddTextLayer}
                className="w-full py-2.5 px-3 rounded-xl bg-white text-[#09090b] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Big Headline Text</span>
              </button>
              <button
                onClick={onAddBadgeLayer}
                className="w-full py-2.5 px-3 rounded-xl bg-[#18181b] border border-[#27272a] hover:border-zinc-400 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Stat / Highlight Pill</span>
              </button>
              <button
                onClick={onAddDividerLayer}
                className="w-full py-2.5 px-3 rounded-xl bg-[#18181b] border border-[#27272a] hover:border-zinc-400 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Add VS Split Divider</span>
              </button>
            </div>

            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#71717a] mb-2.5">
                Arrows & Creator Accents
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {STICKER_ASSETS.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => onAddImageLayer(st.src, st.label)}
                    className="group rounded-xl bg-[#18181b] border border-[#27272a] hover:border-white/70 p-3 transition-all flex flex-col items-center cursor-pointer"
                  >
                    <div className="w-full h-14 flex items-center justify-center">
                      <img
                        src={st.src}
                        alt={st.label}
                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <span className="mt-2 text-[11px] font-medium text-zinc-300">
                      {st.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
