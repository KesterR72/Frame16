import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ShieldCheck,
  Smartphone,
  Eye,
  Download,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react'
import AssetDrawer from '../features/youtube-thumbnail/AssetDrawer'
import StudioStage from '../features/youtube-thumbnail/StudioStage'
import Inspector from '../features/youtube-thumbnail/Inspector'
import { STUDIO_PRESETS } from '../features/youtube-thumbnail/assetsCatalog'
import { type StudioDocument, type CanvasLayer } from '../features/youtube-thumbnail/types'
import { exportThumbnailToFile } from '../features/youtube-thumbnail/ExportEngine'

export default function Studio() {
  const [searchParams] = useSearchParams()
  const initialTemplateKey = searchParams.get('template') || 'the-reaction'
  const initialDoc = STUDIO_PRESETS[initialTemplateKey] || STUDIO_PRESETS['the-reaction']

  const [doc, setDoc] = useState<StudioDocument>(() => structuredClone(initialDoc))
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(
    initialDoc.layers[0]?.id || null
  )

  // Viewfinder simulation modes
  const [showSafeZone, setShowSafeZone] = useState(true)
  const [mobileCheck, setMobileCheck] = useState(false)
  const [squintTest, setSquintTest] = useState(false)

  // Export status
  const [exporting, setExporting] = useState(false)
  const [exportToast, setExportToast] = useState<string | null>(null)

  // Sync if user navigates via query param
  useEffect(() => {
    const key = searchParams.get('template')
    if (key && STUDIO_PRESETS[key]) {
      const preset = structuredClone(STUDIO_PRESETS[key])
      setDoc(preset)
      setSelectedLayerId(preset.layers[0]?.id || null)
    }
  }, [searchParams])

  const selectedLayer = doc.layers.find((l) => l.id === selectedLayerId) || null

  const updateDoc = useCallback((patch: Partial<StudioDocument>) => {
    setDoc((prev) => ({ ...prev, ...patch }))
  }, [])

  const updateLayer = useCallback((id: string, patch: Partial<CanvasLayer>) => {
    setDoc((prev) => ({
      ...prev,
      layers: prev.layers.map((layer) =>
        layer.id === id ? ({ ...layer, ...patch } as CanvasLayer) : layer
      ),
    }))
  }, [])

  const deleteLayer = useCallback((id: string) => {
    setDoc((prev) => ({
      ...prev,
      layers: prev.layers.filter((l) => l.id !== id),
    }))
    setSelectedLayerId((curr) => (curr === id ? null : curr))
  }, [])

  const moveLayer = useCallback((id: string, dir: 'up' | 'down') => {
    setDoc((prev) => {
      const idx = prev.layers.findIndex((l) => l.id === id)
      if (idx === -1) return prev
      const newIdx = dir === 'up' ? idx + 1 : idx - 1
      if (newIdx < 0 || newIdx >= prev.layers.length) return prev
      const next = [...prev.layers]
      const [item] = next.splice(idx, 1)
      next.splice(newIdx, 0, item)
      return { ...prev, layers: next }
    })
  }, [])

  const handleLoadTemplate = (preset: StudioDocument) => {
    const cloned = structuredClone(preset)
    setDoc(cloned)
    setSelectedLayerId(cloned.layers[0]?.id || null)
  }

  const handleAddImageLayer = (src: string, name: string, rounded = false) => {
    const id = `img-${Date.now()}`
    const newLayer: CanvasLayer = {
      id,
      type: 'image',
      name,
      src,
      x: 50,
      y: 55,
      scale: 0.9,
      rotation: 0,
      flipX: false,
      rimColor: '#38bdf8',
      rimIntensity: 18,
      contrast: 110,
      saturation: 115,
      rounded,
    }
    setDoc((prev) => ({ ...prev, layers: [...prev.layers, newLayer] }))
    setSelectedLayerId(id)
  }

  const handleAddTextLayer = () => {
    const id = `txt-${Date.now()}`
    const newLayer: CanvasLayer = {
      id,
      type: 'text',
      name: 'New Headline',
      text: 'WATCH THIS',
      x: 35,
      y: 45,
      fontFamily: 'Montserrat',
      fontSize: 96,
      color: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 10,
      shadowColor: 'rgba(0,0,0,0.9)',
      shadowBlur: 20,
      shadowOffsetX: 4,
      shadowOffsetY: 8,
      rotation: -2,
      uppercase: true,
    }
    setDoc((prev) => ({ ...prev, layers: [...prev.layers, newLayer] }))
    setSelectedLayerId(id)
  }

  const handleAddBadgeLayer = () => {
    const id = `badge-${Date.now()}`
    const newLayer: CanvasLayer = {
      id,
      type: 'badge',
      name: 'Stat Pill',
      text: '10X BETTER',
      x: 35,
      y: 25,
      bgColor: '#22c55e',
      textColor: '#09090b',
      borderColor: '#000000',
      fontSize: 38,
      rotation: -2,
      glowIntensity: 20,
    }
    setDoc((prev) => ({ ...prev, layers: [...prev.layers, newLayer] }))
    setSelectedLayerId(id)
  }

  const handleAddDividerLayer = () => {
    const id = `div-${Date.now()}`
    const newLayer: CanvasLayer = {
      id,
      type: 'divider',
      name: 'VS Split Line',
      text: 'VS',
      x: 50,
      lineColor: '#ffffff',
      glowColor: '#ef4444',
      glowIntensity: 24,
      badgeBg: '#09090b',
      badgeText: '#ffffff',
    }
    setDoc((prev) => ({ ...prev, layers: [...prev.layers, newLayer] }))
    setSelectedLayerId(id)
  }

  const handleDropExternalFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      handleAddImageLayer(
        reader.result as string,
        file.name.replace(/\.[^/.]+$/, ''),
        false
      )
    }
    reader.readAsDataURL(file)
  }

  const handleExport = async () => {
    try {
      setExporting(true)
      const { dataUrl, fileSizeKB, format } = await exportThumbnailToFile(doc)
      const link = document.createElement('a')
      link.href = dataUrl
      const safeName = doc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      link.download = `frame16-${safeName}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setExportToast(
        `Exported 1280×720 ${format.toUpperCase()} · ${fileSizeKB} KB (Under 2MB Limit)`
      )
      setTimeout(() => setExportToast(null), 5000)
    } catch (err) {
      console.error(err)
      setExportToast('Export encountered an error. Please try again.')
      setTimeout(() => setExportToast(null), 4000)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#09090b] text-[#f4f4f5] flex flex-col">
      {/* Editor Top Bar */}
      <header className="h-16 shrink-0 bg-[#121215] border-b border-[#27272a] px-4 flex items-center justify-between gap-4 z-30">
        {/* Left: Brand Logo Home Link + Editable Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/"
            title="Back to Frame16 Home"
            aria-label="Back to Frame16 Home"
            className="group flex items-center gap-2 pr-3 border-r border-[#27272a] shrink-0 transition-opacity hover:opacity-80"
          >
            <img
              src="/frame16-logo.png"
              alt="Frame16"
              className="w-6 h-6 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="hidden sm:inline font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-sm tracking-tight text-white">
              FRAME16
            </span>
          </Link>
          <input
            type="text"
            value={doc.title}
            onChange={(e) => updateDoc({ title: e.target.value })}
            aria-label="Project title"
            className="bg-transparent text-xs sm:text-sm font-medium text-white border border-transparent hover:border-[#27272a] focus:border-zinc-500 rounded-md px-2 py-1 outline-none truncate max-w-[160px] sm:max-w-[220px]"
          />
        </div>

        {/* Center: Viewfinder Simulation Controls */}
        <div className="flex items-center gap-1.5 bg-[#09090b] p-1 rounded-xl border border-[#27272a]">
          <button
            onClick={() => setShowSafeZone((v) => !v)}
            title="Toggle YouTube 14:20 Safe-Zone Guide"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showSafeZone
                ? 'bg-white/15 text-white'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            <ShieldCheck size={14} className={showSafeZone ? 'text-red-400' : ''} />
            <span className="hidden md:inline">Safe Zone</span>
          </button>

          <button
            onClick={() => setMobileCheck((v) => !v)}
            title="Toggle 120px Mobile Feed Simulator"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              mobileCheck
                ? 'bg-white text-[#09090b] font-semibold'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            <Smartphone size={14} />
            <span className="hidden md:inline">Phone Test</span>
          </button>

          <button
            onClick={() => setSquintTest((v) => !v)}
            title="Toggle Grayscale / Squint Contrast Check"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              squintTest
                ? 'bg-white text-[#09090b] font-semibold'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            <Eye size={14} />
            <span className="hidden md:inline">Squint Check</span>
          </button>
        </div>

        {/* Right: Reset + Export */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleLoadTemplate(STUDIO_PRESETS[doc.id] || STUDIO_PRESETS['the-reaction'])}
            title="Reset current layout"
            className="p-2 rounded-lg bg-[#18181b] border border-[#27272a] hover:border-zinc-500 text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-4 py-2 rounded-lg bg-white text-[#09090b] font-bold text-xs sm:text-sm flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-60 cursor-pointer"
          >
            <Download size={15} />
            <span>{exporting ? 'Rendering...' : 'Export 1280×720'}</span>
          </button>
        </div>
      </header>

      {/* Main 3-Pane Workstation */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <AssetDrawer
          onLoadTemplate={handleLoadTemplate}
          onAddImageLayer={handleAddImageLayer}
          onAddTextLayer={handleAddTextLayer}
          onAddBadgeLayer={handleAddBadgeLayer}
          onAddDividerLayer={handleAddDividerLayer}
          onSetBackgroundImage={(src) =>
            updateDoc({ backgroundType: 'image', backgroundImage: src })
          }
          onSetBackgroundType={(type) => updateDoc({ backgroundType: type })}
        />

        <StudioStage
          doc={doc}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onUpdateLayer={updateLayer}
          onDropExternalFile={handleDropExternalFile}
          showSafeZone={showSafeZone}
          mobileCheck={mobileCheck}
          squintTest={squintTest}
        />

        <Inspector
          doc={doc}
          selectedLayer={selectedLayer}
          onSelectLayer={setSelectedLayerId}
          onUpdateDoc={updateDoc}
          onUpdateLayer={updateLayer}
          onDeleteLayer={deleteLayer}
          onMoveLayer={moveLayer}
        />

        {/* Export Success Toast */}
        {exportToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-[#18181b] border border-emerald-500/50 text-white text-xs sm:text-sm font-medium shadow-2xl flex items-center gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{exportToast}</span>
          </div>
        )}
      </div>
    </div>
  )
}
