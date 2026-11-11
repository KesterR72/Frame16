export type FontFamily = 'Montserrat' | 'Anton' | 'Bebas Neue' | 'Plus Jakarta Sans' | 'Inter'

export interface TextLayer {
  id: string
  type: 'text'
  name: string
  text: string
  x: number // 0 to 100 (%)
  y: number // 0 to 100 (%)
  fontFamily: FontFamily
  fontSize: number // px relative to 1280x720
  color: string
  strokeColor: string
  strokeWidth: number
  shadowColor: string
  shadowBlur: number
  shadowOffsetX: number
  shadowOffsetY: number
  rotation: number // degrees (-15 to 15)
  uppercase: boolean
}

export interface ImageLayer {
  id: string
  type: 'image'
  name: string
  src: string
  x: number // 0 to 100 (%)
  y: number // 0 to 100 (%)
  scale: number // 0.2 to 2.5
  rotation: number // -45 to 45
  flipX: boolean
  rimColor: string
  rimIntensity: number // 0 to 60
  contrast: number // 50 to 160
  saturation: number // 50 to 180
  rounded: boolean
}

export interface BadgeLayer {
  id: string
  type: 'badge'
  name: string
  text: string
  x: number // 0 to 100 (%)
  y: number // 0 to 100 (%)
  bgColor: string
  textColor: string
  borderColor: string
  fontSize: number // relative to 1280x720
  rotation: number
  glowIntensity: number
}

export interface DividerLayer {
  id: string
  type: 'divider'
  name: string
  text: string
  x: number // 50 (%)
  lineColor: string
  glowColor: string
  glowIntensity: number
  badgeBg: string
  badgeText: string
}

export type CanvasLayer = TextLayer | ImageLayer | BadgeLayer | DividerLayer

export interface StudioDocument {
  id: string
  title: string
  backgroundType: 'image' | 'split' | 'gradient' | 'solid'
  backgroundImage: string
  splitLeftColor: string
  splitRightColor: string
  gradientFrom: string
  gradientTo: string
  solidColor: string
  vignette: number // 0 to 100
  contrast: number // 50 to 180
  saturation: number // 0 to 200
  brightness: number // 50 to 150
  bgBlur: number // 0 to 20
  layers: CanvasLayer[]
}
