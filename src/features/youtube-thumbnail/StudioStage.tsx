import { useRef, useState, useEffect, type DragEvent } from 'react'
import { type StudioDocument, type CanvasLayer } from './types'

interface StudioStageProps {
  doc: StudioDocument
  selectedLayerId: string | null
  onSelectLayer: (id: string | null) => void
  onUpdateLayer: (id: string, patch: Partial<CanvasLayer>) => void
  onDropExternalFile: (file: File) => void
  showSafeZone: boolean
  mobileCheck: boolean
  squintTest: boolean
}

export default function StudioStage({
  doc,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onDropExternalFile,
  showSafeZone,
  mobileCheck,
  squintTest,
}: StudioStageProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    if (!draggingId) return

    const onPointerMove = (e: PointerEvent) => {
      if (!stageRef.current) return
      const rect = stageRef.current.getBoundingClientRect()
      const xPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
      const yPct = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
      onUpdateLayer(draggingId, { x: Math.round(xPct * 10) / 10, y: Math.round(yPct * 10) / 10 })
    }

    const onPointerUp = () => setDraggingId(null)

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [draggingId, onUpdateLayer])

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      onDropExternalFile(file)
    }
  }

  // Scaled preview wrapper for 1280x720 coordinate system
  // We render inside a virtual 1280x720 box scaled down cleanly via CSS transform or container sizing,
  // OR compute relative font sizes using responsive container width (`cqw` or scale factor)!
  // Using a crisp ResizeObserver scale factor on a native 1280x720 internal canvas gives 100% pixel-exact WYSIWYG parity with PNG export!
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.6)

  useEffect(() => {
    const updateScale = () => {
      if (!wrapperRef.current) return
      const w = wrapperRef.current.clientWidth
      if (w > 0) setScale(w / 1280)
    }
    updateScale()
    const obs = new ResizeObserver(updateScale)
    if (wrapperRef.current) obs.observe(wrapperRef.current)
    return () => obs.disconnect()
  }, [mobileCheck])

  const renderCanvasContent = (isMiniPreview = false) => (
    <div
      ref={isMiniPreview ? undefined : stageRef}
      onClick={(e) => {
        if (!isMiniPreview && e.target === e.currentTarget) onSelectLayer(null)
      }}
      onDragOver={(e) => {
        if (!isMiniPreview) {
          e.preventDefault()
          setDragOver(true)
        }
      }}
      onDragLeave={() => !isMiniPreview && setDragOver(false)}
      onDrop={isMiniPreview ? undefined : handleDrop}
      className="relative overflow-hidden select-none bg-[#09090b]"
      style={{
        width: 1280,
        height: 720,
        transform: `scale(${isMiniPreview ? 120 / 1280 : scale})`,
        transformOrigin: 'top left',
        filter: squintTest ? 'grayscale(100%)' : 'none',
      }}
    >
      {/* Background Layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          filter: `contrast(${doc.contrast}%) saturate(${doc.saturation}%) brightness(${doc.brightness}%) blur(${doc.bgBlur}px)`,
        }}
      >
        {doc.backgroundType === 'solid' && (
          <div className="w-full h-full" style={{ backgroundColor: doc.solidColor }} />
        )}
        {doc.backgroundType === 'gradient' && (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${doc.gradientFrom}, ${doc.gradientTo})`,
            }}
          />
        )}
        {doc.backgroundType === 'split' && (
          <div className="w-full h-full flex">
            <div className="w-1/2 h-full" style={{ backgroundColor: doc.splitLeftColor }} />
            <div className="w-1/2 h-full" style={{ backgroundColor: doc.splitRightColor }} />
          </div>
        )}
        {doc.backgroundType === 'image' && doc.backgroundImage && (
          <img
            src={doc.backgroundImage}
            alt="Canvas background"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Edge Burn / Vignette */}
      {doc.vignette > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,${Math.min(0.95, (doc.vignette / 100) * 0.92)}) 100%)`,
          }}
        />
      )}

      {/* Draggable Canvas Layers */}
      {doc.layers.map((layer) => {
        const isSelected = !isMiniPreview && selectedLayerId === layer.id

        if (layer.type === 'divider') {
          return (
            <div
              key={layer.id}
              onPointerDown={(e) => {
                if (isMiniPreview) return
                e.stopPropagation()
                onSelectLayer(layer.id)
                setDraggingId(layer.id)
              }}
              style={{
                left: `${layer.x}%`,
                top: 0,
                bottom: 0,
                transform: 'translateX(-50%)',
              }}
              className={`absolute flex items-center justify-center cursor-ew-resize group ${
                isSelected ? 'ring-2 ring-white/80' : ''
              }`}
            >
              <div
                className="w-[6px] h-full"
                style={{
                  backgroundColor: layer.lineColor,
                  boxShadow: `0 0 ${layer.glowIntensity}px ${layer.glowColor}`,
                }}
              />
              <div
                className="absolute w-[92px] h-[92px] rounded-full flex items-center justify-center font-['Anton',sans-serif] font-black text-[34px]"
                style={{
                  backgroundColor: layer.badgeBg,
                  color: layer.badgeText,
                  border: `5px solid ${layer.glowColor}`,
                  boxShadow: `0 0 ${layer.glowIntensity}px ${layer.glowColor}`,
                }}
              >
                {layer.text}
              </div>
            </div>
          )
        }

        if (layer.type === 'image') {
          return (
            <div
              key={layer.id}
              onPointerDown={(e) => {
                if (isMiniPreview) return
                e.stopPropagation()
                onSelectLayer(layer.id)
                setDraggingId(layer.id)
              }}
              style={{
                left: `${layer.x}%`,
                top: `${layer.y}%`,
                transform: `translate(-50%, -50%) rotate(${layer.rotation}deg) scale(${layer.scale}) scaleX(${layer.flipX ? -1 : 1})`,
                height: 480,
              }}
              className={`absolute w-max max-w-none cursor-move flex items-center justify-center ${
                isSelected ? 'outline-2 outline-dashed outline-white/90 outline-offset-4' : 'hover:outline hover:outline-white/40'
              }`}
            >
              <img
                src={layer.src}
                alt={layer.name}
                draggable={false}
                className={`h-full w-auto max-w-none object-contain pointer-events-none ${layer.rounded ? 'rounded-3xl' : ''}`}
                style={{
                  filter: `contrast(${layer.contrast}%) saturate(${layer.saturation}%) ${
                    layer.rimIntensity > 0
                      ? `drop-shadow(0 0 ${layer.rimIntensity}px ${layer.rimColor})`
                      : ''
                  }`,
                }}
              />
            </div>
          )
        }

        if (layer.type === 'badge') {
          return (
            <div
              key={layer.id}
              onPointerDown={(e) => {
                if (isMiniPreview) return
                e.stopPropagation()
                onSelectLayer(layer.id)
                setDraggingId(layer.id)
              }}
              style={{
                left: `${layer.x}%`,
                top: `${layer.y}%`,
                transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                backgroundColor: layer.bgColor,
                color: layer.textColor,
                border: `5px solid ${layer.borderColor}`,
                fontSize: `${layer.fontSize}px`,
                padding: `${layer.fontSize * 0.35}px ${layer.fontSize * 0.7}px`,
                boxShadow: layer.glowIntensity > 0 ? `0 0 ${layer.glowIntensity}px ${layer.bgColor}` : 'none',
              }}
              className={`absolute rounded-full font-['Montserrat',sans-serif] font-black whitespace-nowrap cursor-move leading-none ${
                isSelected ? 'ring-4 ring-white ring-offset-4 ring-offset-transparent' : ''
              }`}
            >
              {layer.text}
            </div>
          )
        }

        // Text Layer
        const display = layer.uppercase ? layer.text.toUpperCase() : layer.text
        return (
          <div
            key={layer.id}
            onPointerDown={(e) => {
              if (isMiniPreview) return
              e.stopPropagation()
              onSelectLayer(layer.id)
              setDraggingId(layer.id)
            }}
            style={{
              left: `${layer.x}%`,
              top: `${layer.y}%`,
              transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
              fontFamily: `"${layer.fontFamily}", "Montserrat", sans-serif`,
              fontSize: `${layer.fontSize}px`,
              fontWeight: 900,
              lineHeight: 1.08,
              color: layer.color,
              WebkitTextStroke: layer.strokeWidth > 0 ? `${layer.strokeWidth * 2}px ${layer.strokeColor}` : undefined,
              paintOrder: 'stroke fill',
              textShadow: `${layer.shadowOffsetX}px ${layer.shadowOffsetY}px ${layer.shadowBlur}px ${layer.shadowColor}`,
            }}
            className={`absolute text-center whitespace-pre cursor-move ${
              isSelected ? 'outline-2 outline-dashed outline-white/90 outline-offset-8 rounded-lg' : 'hover:outline hover:outline-white/30'
            }`}
          >
            {display}
          </div>
        )
      })}

      {/* Safe-Zone Guide Overlay (STRICTLY EXCLUDED FROM EXPORT) */}
      {showSafeZone && (
        <div className="absolute inset-0 pointer-events-none z-40">
          {/* Outer Safe Margin Frame */}
          <div className="absolute inset-8 border-2 border-dashed border-white/25 rounded-lg" />
          {/* YouTube Bottom-Right Danger Zone */}
          <div className="absolute bottom-6 right-6 w-[180px] h-[72px] border-2 border-dashed border-red-500/80 bg-red-500/10 rounded-lg flex items-center justify-center">
            <span className="text-[14px] font-mono font-bold text-red-300 uppercase tracking-wider -translate-y-8">
              YouTube Badge Zone
            </span>
          </div>
          {/* Official Style Timestamp Badge */}
          <div className="absolute bottom-8 right-8 px-3 py-1 rounded-md bg-black/85 text-white font-mono text-[26px] font-bold tracking-tight shadow-lg">
            14:20
          </div>
        </div>
      )}

      {/* Drag Drop Highlight */}
      {dragOver && !isMiniPreview && (
        <div className="absolute inset-0 bg-white/15 backdrop-blur-xs border-4 border-dashed border-white z-50 flex items-center justify-center">
          <div className="px-8 py-4 rounded-2xl bg-[#09090b]/90 text-white font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold shadow-2xl">
            Drop image to add to canvas
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-[#09090b]">
      {/* Subtle Ambient Dot Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'radial-gradient(#27272a 1.25px, transparent 1.25px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 lg:p-8 overflow-auto">
        {mobileCheck ? (
        /* 120px Mobile Feed Scale Check Simulator */
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-4 px-3 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-xs font-mono text-[#a1a1aa]">
            Smartphone Feed Simulator · Actual 120px Thumbnail Width
          </div>
          <div className="w-[340px] rounded-3xl bg-[#0f0f0f] border-4 border-[#27272a] p-4 shadow-2xl">
            {/* Fake YouTube Mobile Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-3.5 rounded bg-red-600 flex items-center justify-center text-[8px] text-white font-bold">
                  ▶
                </div>
                <span className="text-xs font-bold text-white tracking-tight">YouTube</span>
              </div>
              <div className="w-4 h-4 rounded-full bg-zinc-800" />
            </div>

            {/* Miniature Horizontal Feed Item (120px wide thumbnail!) */}
            <div className="flex gap-3 items-start mb-4 p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div
                className="relative shrink-0 overflow-hidden rounded-lg bg-black border border-zinc-800"
                style={{ width: 120, height: 67.5 }}
              >
                {renderCanvasContent(true)}
                <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/85 text-[8px] font-mono text-white font-bold">
                  14:20
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white leading-snug line-clamp-2">
                  Why I Changed Everything About My Channel Setup
                </p>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Your Channel · 142K views · 2h ago
                </p>
              </div>
            </div>

            {/* Dummy Surrounding Videos for Real Feed Comparison */}
            <div className="space-y-3 opacity-40 pointer-events-none">
              <div className="flex gap-3 items-start">
                <div className="w-[120px] h-[67.5px] rounded-lg bg-zinc-800 shrink-0" />
                <div className="flex-1 space-y-1.5 pt-1">
                  <div className="h-2.5 bg-zinc-800 rounded w-full" />
                  <div className="h-2.5 bg-zinc-800 rounded w-3/4" />
                  <div className="h-2 bg-zinc-800/60 rounded w-1/2 mt-2" />
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-[120px] h-[67.5px] rounded-lg bg-zinc-800 shrink-0" />
                <div className="flex-1 space-y-1.5 pt-1">
                  <div className="h-2.5 bg-zinc-800 rounded w-5/6" />
                  <div className="h-2 bg-zinc-800/60 rounded w-2/3 mt-2" />
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-[#a1a1aa] max-w-xs text-center">
            Can you read your text instantly without leaning closer to your screen? If not, increase font size in the Inspector.
          </p>
        </div>
      ) : (
        /* Main Desktop 16:9 Studio Stage */
        <div className="relative z-10 w-full max-w-[920px] flex flex-col">
          {/* Top Canvas Coordinate Bar */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[#71717a] mb-2.5 px-1">
            <div className="flex items-center gap-3">
              <span className="text-zinc-300 font-semibold">16:9 · 1280×720</span>
              <span>Zoom: {Math.round(scale * 100)}%</span>
              {squintTest && (
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200">
                  SQUINT TEST ON (GRAYSCALE)
                </span>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-2">
              {showSafeZone && (
                <span className="text-red-400">
                  Guide Only (14:20 badge excluded from export)
                </span>
              )}
            </div>
          </div>

          {/* 16:9 Responsive Stage Box */}
          <div
            ref={wrapperRef}
            className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-[#27272a] shadow-[0_24px_80px_rgba(0,0,0,0.85)] bg-[#09090b] relative"
          >
            {renderCanvasContent(false)}
          </div>
        </div>
      )}
      </div>

      {/* Bottom Workspace Footer */}
      <footer className="relative z-10 shrink-0 border-t border-[#27272a]/70 bg-[#121215]/75 px-4 py-2.5 text-center text-[11px] text-[#71717a] tracking-wide">
        Frame16 is actively evolving. Expect regular updates and improvements.
      </footer>
    </div>
  )
}
