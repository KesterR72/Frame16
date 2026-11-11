import { useState } from 'react'
import {
  Trash2,
  FlipHorizontal,
  ArrowUp,
  ArrowDown,
  Sliders,
  Layers as LayersIcon,
  SunMedium,
  RotateCcw,
} from 'lucide-react'
import { type StudioDocument, type CanvasLayer, type FontFamily } from './types'

interface InspectorProps {
  doc: StudioDocument
  selectedLayer: CanvasLayer | null
  onSelectLayer: (id: string | null) => void
  onUpdateDoc: (patch: Partial<StudioDocument>) => void
  onUpdateLayer: (id: string, patch: Partial<CanvasLayer>) => void
  onDeleteLayer: (id: string) => void
  onMoveLayer: (id: string, dir: 'up' | 'down') => void
}

function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  onReset,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (val: number) => void
  onReset?: () => void
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#a1a1aa] font-medium">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[11px] text-white">
            {value}
            {unit}
          </span>
          {onReset && (
            <button
              onClick={onReset}
              title="Reset"
              className="text-[#71717a] hover:text-white cursor-pointer"
            >
              <RotateCcw size={10} />
            </button>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-[#27272a] rounded-lg appearance-none cursor-pointer accent-white"
      />
    </div>
  )
}

function ColorSwatchRow({
  label,
  value,
  swatches,
  onChange,
}: {
  label: string
  value: string
  swatches: string[]
  onChange: (color: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#a1a1aa] font-medium">{label}</span>
        <span className="font-mono text-[11px] text-[#71717a] uppercase">{value}</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded-md bg-transparent border border-[#27272a] cursor-pointer shrink-0"
        />
        <div className="flex items-center gap-1.5 flex-wrap">
          {swatches.map((sw) => (
            <button
              key={sw}
              onClick={() => onChange(sw)}
              className={`w-5 h-5 rounded-full border cursor-pointer transition-transform ${
                value.toLowerCase() === sw.toLowerCase()
                  ? 'border-white scale-110'
                  : 'border-[#27272a] hover:scale-105'
              }`}
              style={{ backgroundColor: sw }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const FONT_OPTIONS: FontFamily[] = ['Montserrat', 'Anton', 'Bebas Neue', 'Plus Jakarta Sans', 'Inter']
const RIM_SWATCHES = ['#38bdf8', '#ef4444', '#22c55e', '#facc15', '#a855f7', '#ffffff']
const TEXT_SWATCHES = ['#ffffff', '#facc15', '#ef4444', '#38bdf8', '#4ade80', '#09090b']

export default function Inspector({
  doc,
  selectedLayer,
  onSelectLayer,
  onUpdateDoc,
  onUpdateLayer,
  onDeleteLayer,
  onMoveLayer,
}: InspectorProps) {
  const [tab, setTab] = useState<'properties' | 'lighting' | 'layers'>('properties')

  const activeMode = selectedLayer ? tab : tab === 'layers' ? 'layers' : 'lighting'

  return (
    <aside className="w-full lg:w-[320px] xl:w-[340px] shrink-0 bg-[#121215] border-t lg:border-t-0 lg:border-l border-[#27272a] flex flex-col h-auto lg:h-full overflow-hidden">
      {/* Top Tabs */}
      <div className="grid grid-cols-3 border-b border-[#27272a] bg-[#09090b]/40">
        <button
          onClick={() => setTab('properties')}
          className={`py-3 flex items-center justify-center gap-1.5 text-xs font-medium cursor-pointer border-b-2 ${
            activeMode === 'properties'
              ? 'border-white text-white bg-white/[0.04]'
              : 'border-transparent text-[#71717a] hover:text-[#a1a1aa]'
          }`}
        >
          <Sliders size={13} />
          <span>Edit</span>
        </button>
        <button
          onClick={() => setTab('lighting')}
          className={`py-3 flex items-center justify-center gap-1.5 text-xs font-medium cursor-pointer border-b-2 ${
            activeMode === 'lighting'
              ? 'border-white text-white bg-white/[0.04]'
              : 'border-transparent text-[#71717a] hover:text-[#a1a1aa]'
          }`}
        >
          <SunMedium size={13} />
          <span>Lighting</span>
        </button>
        <button
          onClick={() => setTab('layers')}
          className={`py-3 flex items-center justify-center gap-1.5 text-xs font-medium cursor-pointer border-b-2 ${
            activeMode === 'layers'
              ? 'border-white text-white bg-white/[0.04]'
              : 'border-transparent text-[#71717a] hover:text-[#a1a1aa]'
          }`}
        >
          <LayersIcon size={13} />
          <span>Layers ({doc.layers.length})</span>
        </button>
      </div>

      {/* Scrollable Inspector Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activeMode === 'layers' && (
          <div className="space-y-2.5">
            <div className="text-xs font-mono uppercase tracking-wider text-[#71717a] mb-2">
              Canvas Stack (Top to Bottom)
            </div>
            {[...doc.layers].reverse().map((layer) => {
              const selected = selectedLayer?.id === layer.id
              return (
                <div
                  key={layer.id}
                  onClick={() => {
                    onSelectLayer(layer.id)
                    setTab('properties')
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    selected
                      ? 'bg-white/10 border-white text-white'
                      : 'bg-[#18181b] border-[#27272a] text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-mono uppercase text-[#71717a] block">
                      {layer.type}
                    </span>
                    <span className="text-xs font-semibold truncate block">
                      {layer.type === 'text' || layer.type === 'badge'
                        ? layer.text
                        : layer.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onMoveLayer(layer.id, 'up')}
                      title="Bring Forward"
                      className="p-1.5 rounded hover:bg-white/10 cursor-pointer"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() => onMoveLayer(layer.id, 'down')}
                      title="Send Backward"
                      className="p-1.5 rounded hover:bg-white/10 cursor-pointer"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => onDeleteLayer(layer.id)}
                      title="Remove Layer"
                      className="p-1.5 rounded hover:bg-red-500/20 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
            {doc.layers.length === 0 && (
              <p className="text-xs text-[#71717a] text-center py-6">
                No layers yet. Add a face, title, or badge from the left panel.
              </p>
            )}
          </div>
        )}

        {activeMode === 'lighting' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-white mb-4">
                Atmospheric Lighting & Depth
              </h4>
              <div className="space-y-4">
                <RangeField
                  label="Edge Burn / Vignette"
                  value={doc.vignette}
                  min={0}
                  max={100}
                  unit="%"
                  onChange={(v) => onUpdateDoc({ vignette: v })}
                  onReset={() => onUpdateDoc({ vignette: 45 })}
                />
                <RangeField
                  label="Contrast Punch"
                  value={doc.contrast}
                  min={60}
                  max={180}
                  unit="%"
                  onChange={(v) => onUpdateDoc({ contrast: v })}
                  onReset={() => onUpdateDoc({ contrast: 120 })}
                />
                <RangeField
                  label="Saturation Boost"
                  value={doc.saturation}
                  min={0}
                  max={200}
                  unit="%"
                  onChange={(v) => onUpdateDoc({ saturation: v })}
                  onReset={() => onUpdateDoc({ saturation: 125 })}
                />
                <RangeField
                  label="Brightness"
                  value={doc.brightness}
                  min={50}
                  max={150}
                  unit="%"
                  onChange={(v) => onUpdateDoc({ brightness: v })}
                  onReset={() => onUpdateDoc({ brightness: 100 })}
                />
                <RangeField
                  label="Background Depth Blur"
                  value={doc.bgBlur}
                  min={0}
                  max={20}
                  unit="px"
                  onChange={(v) => onUpdateDoc({ bgBlur: v })}
                  onReset={() => onUpdateDoc({ bgBlur: 0 })}
                />
              </div>
            </div>

            {/* Dynamic Background Color Controls based on mode */}
            {doc.backgroundType === 'split' && (
              <div className="pt-4 border-t border-[#27272a] space-y-4">
                <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-white">
                  Split Colors
                </h4>
                <ColorSwatchRow
                  label="Left Side"
                  value={doc.splitLeftColor}
                  swatches={['#0f172a', '#1e3a8a', '#064e3b', '#18181b']}
                  onChange={(c) => onUpdateDoc({ splitLeftColor: c })}
                />
                <ColorSwatchRow
                  label="Right Side"
                  value={doc.splitRightColor}
                  swatches={['#7f1d1d', '#991b1b', '#7c2d12', '#581c87']}
                  onChange={(c) => onUpdateDoc({ splitRightColor: c })}
                />
              </div>
            )}

            {doc.backgroundType === 'gradient' && (
              <div className="pt-4 border-t border-[#27272a] space-y-4">
                <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-white">
                  Gradient Colors
                </h4>
                <ColorSwatchRow
                  label="From Color"
                  value={doc.gradientFrom}
                  swatches={['#1e1b4b', '#450a0a', '#064e3b', '#1e293b']}
                  onChange={(c) => onUpdateDoc({ gradientFrom: c })}
                />
                <ColorSwatchRow
                  label="To Color"
                  value={doc.gradientTo}
                  swatches={['#09090b', '#000000', '#18181b', '#020617']}
                  onChange={(c) => onUpdateDoc({ gradientTo: c })}
                />
              </div>
            )}

            {doc.backgroundType === 'solid' && (
              <div className="pt-4 border-t border-[#27272a]">
                <ColorSwatchRow
                  label="Solid Backdrop"
                  value={doc.solidColor}
                  swatches={['#09090b', '#0f172a', '#18181b', '#450a0a']}
                  onChange={(c) => onUpdateDoc({ solidColor: c })}
                />
              </div>
            )}
          </div>
        )}

        {activeMode === 'properties' && selectedLayer && (
          <div className="space-y-5">
            {/* Layer Header + Delete */}
            <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] block">
                  Selected {selectedLayer.type}
                </span>
                <h4 className="text-sm font-bold text-white truncate max-w-[190px]">
                  {selectedLayer.type === 'text' || selectedLayer.type === 'badge'
                    ? selectedLayer.text
                    : selectedLayer.name}
                </h4>
              </div>
              <button
                onClick={() => onDeleteLayer(selectedLayer.id)}
                className="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>

            {/* TEXT LAYER CONTROLS */}
            {selectedLayer.type === 'text' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs text-[#a1a1aa] font-medium block">
                    Headline Copy
                  </label>
                  <textarea
                    rows={2}
                    value={selectedLayer.text}
                    onChange={(e) => onUpdateLayer(selectedLayer.id, { text: e.target.value })}
                    className="w-full rounded-xl bg-[#18181b] border border-[#27272a] focus:border-white px-3 py-2 text-sm text-white outline-none resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#a1a1aa] font-medium block">
                    Font Style
                  </label>
                  <select
                    value={selectedLayer.fontFamily}
                    onChange={(e) =>
                      onUpdateLayer(selectedLayer.id, { fontFamily: e.target.value as FontFamily })
                    }
                    className="w-full rounded-xl bg-[#18181b] border border-[#27272a] px-3 py-2 text-xs text-white outline-none cursor-pointer"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <RangeField
                  label="Text Size"
                  value={selectedLayer.fontSize}
                  min={32}
                  max={190}
                  unit="px"
                  onChange={(v) => onUpdateLayer(selectedLayer.id, { fontSize: v })}
                />

                <RangeField
                  label="Tilt Angle"
                  value={selectedLayer.rotation}
                  min={-15}
                  max={15}
                  unit="°"
                  onChange={(v) => onUpdateLayer(selectedLayer.id, { rotation: v })}
                  onReset={() => onUpdateLayer(selectedLayer.id, { rotation: 0 })}
                />

                <ColorSwatchRow
                  label="Text Fill"
                  value={selectedLayer.color}
                  swatches={TEXT_SWATCHES}
                  onChange={(c) => onUpdateLayer(selectedLayer.id, { color: c })}
                />

                <ColorSwatchRow
                  label="Outline Color"
                  value={selectedLayer.strokeColor}
                  swatches={['#000000', '#ffffff', '#ef4444', '#0f172a']}
                  onChange={(c) => onUpdateLayer(selectedLayer.id, { strokeColor: c })}
                />

                <RangeField
                  label="Outline Thickness"
                  value={selectedLayer.strokeWidth}
                  min={0}
                  max={24}
                  unit="px"
                  onChange={(v) => onUpdateLayer(selectedLayer.id, { strokeWidth: v })}
                />

                <RangeField
                  label="Drop Shadow Blur"
                  value={selectedLayer.shadowBlur}
                  min={0}
                  max={45}
                  unit="px"
                  onChange={(v) => onUpdateLayer(selectedLayer.id, { shadowBlur: v })}
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-[#a1a1aa]">All Caps</span>
                  <button
                    onClick={() =>
                      onUpdateLayer(selectedLayer.id, { uppercase: !selectedLayer.uppercase })
                    }
                    className={`px-3 py-1 rounded-lg text-xs font-mono cursor-pointer ${
                      selectedLayer.uppercase
                        ? 'bg-white text-[#09090b] font-bold'
                        : 'bg-[#18181b] border border-[#27272a] text-[#a1a1aa]'
                    }`}
                  >
                    {selectedLayer.uppercase ? 'ON' : 'OFF'}
                  </button>
                </div>
              </>
            )}

            {/* IMAGE / CUTOUT CONTROLS */}
            {selectedLayer.type === 'image' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      onUpdateLayer(selectedLayer.id, { flipX: !selectedLayer.flipX })
                    }
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedLayer.flipX
                        ? 'bg-white text-[#09090b] border-white'
                        : 'bg-[#18181b] text-white border-[#27272a] hover:border-zinc-500'
                    }`}
                  >
                    <FlipHorizontal size={14} />
                    <span>Flip Left/Right</span>
                  </button>
                  <button
                    onClick={() =>
                      onUpdateLayer(selectedLayer.id, { rounded: !selectedLayer.rounded })
                    }
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedLayer.rounded
                        ? 'bg-white text-[#09090b] border-white'
                        : 'bg-[#18181b] text-white border-[#27272a] hover:border-zinc-500'
                    }`}
                  >
                    <span>Rounded Card</span>
                  </button>
                </div>

                <RangeField
                  label="Scale Size"
                  value={Math.round(selectedLayer.scale * 100)}
                  min={25}
                  max={240}
                  unit="%"
                  onChange={(v) => onUpdateLayer(selectedLayer.id, { scale: v / 100 })}
                  onReset={() => onUpdateLayer(selectedLayer.id, { scale: 1 })}
                />

                <RangeField
                  label="Tilt Angle"
                  value={selectedLayer.rotation}
                  min={-45}
                  max={45}
                  unit="°"
                  onChange={(v) => onUpdateLayer(selectedLayer.id, { rotation: v })}
                  onReset={() => onUpdateLayer(selectedLayer.id, { rotation: 0 })}
                />

                <div className="pt-3 border-t border-[#27272a] space-y-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-white block">
                    Subject Rim Light Glow
                  </span>
                  <ColorSwatchRow
                    label="Rim Light Color"
                    value={selectedLayer.rimColor}
                    swatches={RIM_SWATCHES}
                    onChange={(c) => onUpdateLayer(selectedLayer.id, { rimColor: c })}
                  />
                  <RangeField
                    label="Glow Intensity"
                    value={selectedLayer.rimIntensity}
                    min={0}
                    max={60}
                    unit="px"
                    onChange={(v) => onUpdateLayer(selectedLayer.id, { rimIntensity: v })}
                  />
                </div>

                <div className="pt-3 border-t border-[#27272a] space-y-4">
                  <RangeField
                    label="Subject Contrast"
                    value={selectedLayer.contrast}
                    min={60}
                    max={160}
                    unit="%"
                    onChange={(v) => onUpdateLayer(selectedLayer.id, { contrast: v })}
                  />
                  <RangeField
                    label="Subject Saturation"
                    value={selectedLayer.saturation}
                    min={50}
                    max={180}
                    unit="%"
                    onChange={(v) => onUpdateLayer(selectedLayer.id, { saturation: v })}
                  />
                </div>
              </>
            )}

            {/* BADGE PILL CONTROLS */}
            {selectedLayer.type === 'badge' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs text-[#a1a1aa] font-medium block">
                    Pill Text
                  </label>
                  <input
                    type="text"
                    value={selectedLayer.text}
                    onChange={(e) => onUpdateLayer(selectedLayer.id, { text: e.target.value })}
                    className="w-full rounded-xl bg-[#18181b] border border-[#27272a] focus:border-white px-3 py-2 text-sm text-white outline-none"
                  />
                </div>

                <RangeField
                  label="Pill Size"
                  value={selectedLayer.fontSize}
                  min={20}
                  max={110}
                  unit="px"
                  onChange={(v) => onUpdateLayer(selectedLayer.id, { fontSize: v })}
                />

                <RangeField
                  label="Tilt Angle"
                  value={selectedLayer.rotation}
                  min={-15}
                  max={15}
                  unit="°"
                  onChange={(v) => onUpdateLayer(selectedLayer.id, { rotation: v })}
                  onReset={() => onUpdateLayer(selectedLayer.id, { rotation: 0 })}
                />

                <ColorSwatchRow
                  label="Pill Background"
                  value={selectedLayer.bgColor}
                  swatches={['#22c55e', '#eab308', '#ef4444', '#ffffff', '#38bdf8']}
                  onChange={(c) => onUpdateLayer(selectedLayer.id, { bgColor: c })}
                />

                <ColorSwatchRow
                  label="Text Color"
                  value={selectedLayer.textColor}
                  swatches={['#09090b', '#ffffff']}
                  onChange={(c) => onUpdateLayer(selectedLayer.id, { textColor: c })}
                />

                <RangeField
                  label="Outer Glow"
                  value={selectedLayer.glowIntensity}
                  min={0}
                  max={50}
                  unit="px"
                  onChange={(v) => onUpdateLayer(selectedLayer.id, { glowIntensity: v })}
                />
              </>
            )}

            {/* VS DIVIDER CONTROLS */}
            {selectedLayer.type === 'divider' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs text-[#a1a1aa] font-medium block">
                    Center Badge Label
                  </label>
                  <input
                    type="text"
                    value={selectedLayer.text}
                    onChange={(e) => onUpdateLayer(selectedLayer.id, { text: e.target.value })}
                    className="w-full rounded-xl bg-[#18181b] border border-[#27272a] focus:border-white px-3 py-2 text-sm text-white outline-none"
                  />
                </div>

                <ColorSwatchRow
                  label="Neon Glow Color"
                  value={selectedLayer.glowColor}
                  swatches={RIM_SWATCHES}
                  onChange={(c) => onUpdateLayer(selectedLayer.id, { glowColor: c })}
                />

                <RangeField
                  label="Glow Strength"
                  value={selectedLayer.glowIntensity}
                  min={0}
                  max={50}
                  unit="px"
                  onChange={(v) => onUpdateLayer(selectedLayer.id, { glowIntensity: v })}
                />
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
