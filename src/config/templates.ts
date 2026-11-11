export interface ThumbnailLayer {
  id: string
  type: 'text' | 'image' | 'badge' | 'divider'
  content: string
  x: number
  y: number
  scale?: number
  rotation?: number
  color?: string
  strokeColor?: string
  strokeWidth?: number
  shadowColor?: string
  shadowBlur?: number
  shadowOffsetX?: number
  shadowOffsetY?: number
  fontFamily?: string
  fontSize?: number
  fontWeight?: string
  glowColor?: string
  glowIntensity?: number
  flipX?: boolean
}

export interface ThumbnailConfig {
  id: string
  title: string
  category: string
  description: string
  ctrLogic: string
  backgroundType: 'image' | 'gradient' | 'split'
  backgroundImage?: string
  gradientFrom?: string
  gradientTo?: string
  splitLeftColor?: string
  splitRightColor?: string
  vignette: number
  saturation: number
  contrast: number
  brightness: number
  layers: ThumbnailLayer[]
}

export const PRESET_TEMPLATES: ThumbnailConfig[] = [
  {
    id: 'the-showdown',
    title: 'The Showdown (A vs B)',
    category: 'Comparison & Review',
    description: 'Split screen with a glowing center divider. Built for "iPhone vs Samsung", "Before vs After", or "Cheap vs Expensive".',
    ctrLogic: 'Visual conflict triggers immediate curiosity—viewers want to see which side wins.',
    backgroundType: 'split',
    splitLeftColor: '#0f172a',
    splitRightColor: '#7f1d1d',
    vignette: 45,
    saturation: 130,
    contrast: 125,
    brightness: 105,
    layers: [],
  },
  {
    id: 'the-reaction',
    title: 'The Shock & Reveal',
    category: 'Vlogs & Storytelling',
    description: 'Expressive subject cutout paired with a neon rim light and a bold 3-word hook on the left.',
    ctrLogic: 'Eyes lock onto expressive human faces first. Rim lighting separates the subject cleanly from dark backgrounds.',
    backgroundType: 'image',
    backgroundImage: '/assets/backgrounds/deep-blue-mesh.jpg',
    vignette: 55,
    saturation: 125,
    contrast: 120,
    brightness: 95,
    layers: [],
  },
  {
    id: 'the-warning',
    title: 'The Warning / Big Mistake',
    category: 'Education & Advice',
    description: 'Dark crimson smoke backdrop paired with a hazard badge, bold warning lettering, and an expressive subject cutout.',
    ctrLogic: 'Urgent warning hooks ("Biggest mistake") consistently get higher click-through rates by playing on loss aversion.',
    backgroundType: 'image',
    backgroundImage: '/assets/backgrounds/red-smoke.jpg',
    vignette: 45,
    saturation: 125,
    contrast: 120,
    brightness: 96,
    layers: [],
  },
  {
    id: 'the-metric-flex',
    title: 'The Milestone Flex',
    category: 'Finance & Challenges',
    description: 'Deep emerald wash with giant milestone figures, upward growth chart accent, and a bright timeframe pill.',
    ctrLogic: 'Concrete numbers give viewers an immediate reason to click without guessing what the video is about.',
    backgroundType: 'image',
    backgroundImage: '/assets/backgrounds/emerald-mesh.jpg',
    vignette: 45,
    saturation: 120,
    contrast: 120,
    brightness: 92,
    layers: [],
  },
]
