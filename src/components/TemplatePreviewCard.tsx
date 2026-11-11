import { useRef, useState, useEffect } from 'react'
import { type StudioDocument } from '../features/youtube-thumbnail/types'

export default function TemplatePreviewCard({ preset }: { preset: StudioDocument }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.35)

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      if (w > 0) setScale(w / 1280)
    }
    update()
    const obs = new ResizeObserver(update)
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/9] w-full bg-[#09090b] overflow-hidden select-none"
    >
      <div
        className="relative overflow-hidden bg-[#09090b]"
        style={{
          width: 1280,
          height: 720,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{
            filter: `contrast(${preset.contrast}%) saturate(${preset.saturation}%) brightness(${preset.brightness}%) blur(${preset.bgBlur}px)`,
          }}
        >
          {preset.backgroundType === 'split' ? (
            <div className="w-full h-full flex">
              <div className="w-1/2 h-full" style={{ backgroundColor: preset.splitLeftColor }} />
              <div className="w-1/2 h-full" style={{ backgroundColor: preset.splitRightColor }} />
            </div>
          ) : preset.backgroundType === 'gradient' ? (
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(135deg, ${preset.gradientFrom}, ${preset.gradientTo})`,
              }}
            />
          ) : preset.backgroundType === 'solid' ? (
            <div className="w-full h-full" style={{ backgroundColor: preset.solidColor }} />
          ) : (
            <img
              src={preset.backgroundImage}
              alt={preset.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Vignette */}
        {preset.vignette > 0 && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,${Math.min(0.95, (preset.vignette / 100) * 0.92)}) 100%)`,
            }}
          />
        )}

        {/* Exact Scaled 1280x720 Layers */}
        {preset.layers.map((layer) => {
          if (layer.type === 'divider') {
            return (
              <div
                key={layer.id}
                style={{ left: `${layer.x}%` }}
                className="absolute inset-y-0 -translate-x-1/2 flex items-center justify-center"
              >
                <div
                  className="w-[6px] h-full"
                  style={{
                    backgroundColor: layer.lineColor,
                    boxShadow: `0 0 ${layer.glowIntensity}px ${layer.glowColor}`,
                  }}
                />
                <div
                  className="absolute w-[92px] h-[92px] rounded-full flex items-center justify-center font-['Anton',sans-serif] text-[34px] font-black"
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
                style={{
                  left: `${layer.x}%`,
                  top: `${layer.y}%`,
                  transform: `translate(-50%, -50%) rotate(${layer.rotation}deg) scale(${layer.scale}) scaleX(${layer.flipX ? -1 : 1})`,
                  height: 480,
                }}
                className="absolute w-max max-w-none flex items-center justify-center pointer-events-none"
              >
                <img
                  src={layer.src}
                  alt={layer.name}
                  className={`h-full w-auto max-w-none object-contain ${layer.rounded ? 'rounded-3xl' : ''}`}
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
                className="absolute rounded-full font-['Montserrat',sans-serif] font-black whitespace-nowrap leading-none"
              >
                {layer.text}
              </div>
            )
          }

          const display = layer.uppercase ? layer.text.toUpperCase() : layer.text
          return (
            <div
              key={layer.id}
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
              className="absolute text-center whitespace-pre leading-none"
            >
              {display}
            </div>
          )
        })}
      </div>
    </div>
  )
}
