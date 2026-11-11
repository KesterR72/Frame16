import { type StudioDocument, type CanvasLayer } from './types'

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(err)
    img.src = src
  })
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export async function exportThumbnailToFile(doc: StudioDocument): Promise<{
  dataUrl: string
  fileSizeKB: number
  format: 'png' | 'jpeg'
}> {
  // Ensure web fonts are loaded before rendering to Canvas
  await document.fonts.ready

  const WIDTH = 1280
  const HEIGHT = 720
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Could not initialize 2D canvas context.')
  }

  // 1. Background Rendering with Filters
  ctx.save()
  ctx.filter = `contrast(${doc.contrast}%) saturate(${doc.saturation}%) brightness(${doc.brightness}%) blur(${doc.bgBlur}px)`

  if (doc.backgroundType === 'solid') {
    ctx.fillStyle = doc.solidColor
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
  } else if (doc.backgroundType === 'gradient') {
    const grad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
    grad.addColorStop(0, doc.gradientFrom)
    grad.addColorStop(1, doc.gradientTo)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
  } else if (doc.backgroundType === 'split') {
    ctx.fillStyle = doc.splitLeftColor
    ctx.fillRect(0, 0, WIDTH / 2, HEIGHT)
    ctx.fillStyle = doc.splitRightColor
    ctx.fillRect(WIDTH / 2, 0, WIDTH / 2, HEIGHT)
  } else if (doc.backgroundType === 'image' && doc.backgroundImage) {
    try {
      const bgImg = await loadImage(doc.backgroundImage)
      const scale = Math.max(WIDTH / bgImg.width, HEIGHT / bgImg.height)
      const drawW = bgImg.width * scale
      const drawH = bgImg.height * scale
      const drawX = (WIDTH - drawW) / 2
      const drawY = (HEIGHT - drawH) / 2
      ctx.drawImage(bgImg, drawX, drawY, drawW, drawH)
    } catch {
      ctx.fillStyle = '#09090b'
      ctx.fillRect(0, 0, WIDTH, HEIGHT)
    }
  }
  ctx.restore()

  // 2. Vignette / Edge Burn Overlay
  if (doc.vignette > 0) {
    ctx.save()
    const radius = Math.sqrt((WIDTH / 2) ** 2 + (HEIGHT / 2) ** 2)
    const grad = ctx.createRadialGradient(
      WIDTH / 2,
      HEIGHT / 2,
      radius * 0.35,
      WIDTH / 2,
      HEIGHT / 2,
      radius
    )
    const opacity = Math.min(0.95, (doc.vignette / 100) * 0.92)
    grad.addColorStop(0, 'rgba(0,0,0,0)')
    grad.addColorStop(1, `rgba(0,0,0,${opacity})`)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    ctx.restore()
  }

  // 3. Render Layers (Note: Safe-Zone Badge is NEVER rendered here)
  for (const layer of doc.layers) {
    await drawLayer(ctx, layer, WIDTH, HEIGHT)
  }

  // 4. Generate File under 2MB Limit
  const pngBlob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'))
  if (pngBlob && pngBlob.size <= 1.95 * 1024 * 1024) {
    const dataUrl = canvas.toDataURL('image/png')
    return {
      dataUrl,
      fileSizeKB: Math.round(pngBlob.size / 1024),
      format: 'png',
    }
  }

  // Fallback to ultra-sharp JPEG 0.94 if PNG exceeds 1.95MB
  const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.94)
  const jpegBlob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.94))
  return {
    dataUrl: jpegDataUrl,
    fileSizeKB: Math.round((jpegBlob?.size || 500000) / 1024),
    format: 'jpeg',
  }
}

async function drawLayer(
  ctx: CanvasRenderingContext2D,
  layer: CanvasLayer,
  W: number,
  H: number
) {
  if (layer.type === 'divider') {
    const cx = (layer.x / 100) * W
    ctx.save()
    ctx.strokeStyle = layer.lineColor
    ctx.lineWidth = 6
    ctx.shadowColor = layer.glowColor
    ctx.shadowBlur = layer.glowIntensity
    ctx.beginPath()
    ctx.moveTo(cx, 0)
    ctx.lineTo(cx, H)
    ctx.stroke()

    // Center VS circle
    ctx.fillStyle = layer.badgeBg
    ctx.beginPath()
    ctx.arc(cx, H / 2, 46, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = layer.glowColor
    ctx.lineWidth = 5
    ctx.stroke()

    ctx.shadowBlur = 0
    ctx.fillStyle = layer.badgeText
    ctx.font = `900 34px "Anton", sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(layer.text, cx, H / 2 + 2)
    ctx.restore()
    return
  }

  if (layer.type === 'image') {
    try {
      const img = await loadImage(layer.src)
      const cx = (layer.x / 100) * W
      const cy = (layer.y / 100) * H

      // Fit base image nicely around ~480px height at scale 1
      const baseHeight = 480
      const ratio = img.width / img.height
      const drawH = baseHeight * layer.scale
      const drawW = drawH * ratio

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate((layer.rotation * Math.PI) / 180)
      if (layer.flipX) ctx.scale(-1, 1)

      ctx.filter = `contrast(${layer.contrast}%) saturate(${layer.saturation}%)`

      // Rim Light Glow Pass
      if (layer.rimIntensity > 0) {
        ctx.shadowColor = layer.rimColor
        ctx.shadowBlur = layer.rimIntensity * 1.4
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
      }

      if (layer.rounded) {
        drawRoundedRect(ctx, -drawW / 2, -drawH / 2, drawW, drawH, 24)
        ctx.clip()
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
      ctx.restore()
    } catch {
      // Skip broken image gracefully
    }
    return
  }

  if (layer.type === 'badge') {
    const cx = (layer.x / 100) * W
    const cy = (layer.y / 100) * H

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate((layer.rotation * Math.PI) / 180)

    ctx.font = `900 ${layer.fontSize}px "Montserrat", sans-serif`
    const metrics = ctx.measureText(layer.text)
    const padX = layer.fontSize * 0.75
    const padY = layer.fontSize * 0.45
    const boxW = metrics.width + padX * 2
    const boxH = layer.fontSize + padY * 2

    if (layer.glowIntensity > 0) {
      ctx.shadowColor = layer.bgColor
      ctx.shadowBlur = layer.glowIntensity
    }

    drawRoundedRect(ctx, -boxW / 2, -boxH / 2, boxW, boxH, boxH / 2)
    ctx.fillStyle = layer.bgColor
    ctx.fill()

    ctx.shadowBlur = 0
    ctx.lineWidth = 5
    ctx.strokeStyle = layer.borderColor
    ctx.stroke()

    ctx.fillStyle = layer.textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(layer.text, 0, 2)
    ctx.restore()
    return
  }

  if (layer.type === 'text') {
    const cx = (layer.x / 100) * W
    const cy = (layer.y / 100) * H
    const content = layer.uppercase ? layer.text.toUpperCase() : layer.text
    const lines = content.split('\n')

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate((layer.rotation * Math.PI) / 180)

    const fontStack = `"${layer.fontFamily}", "Montserrat", sans-serif`
    ctx.font = `900 ${layer.fontSize}px ${fontStack}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.lineJoin = 'round'

    const lineHeight = layer.fontSize * 1.08
    const totalH = lines.length * lineHeight
    const startY = -totalH / 2 + lineHeight / 2

    lines.forEach((line, idx) => {
      const ly = startY + idx * lineHeight

      // Drop Shadow pass
      ctx.save()
      ctx.shadowColor = layer.shadowColor
      ctx.shadowBlur = layer.shadowBlur
      ctx.shadowOffsetX = layer.shadowOffsetX
      ctx.shadowOffsetY = layer.shadowOffsetY

      if (layer.strokeWidth > 0) {
        ctx.strokeStyle = layer.strokeColor
        ctx.lineWidth = layer.strokeWidth * 2
        ctx.strokeText(line, 0, ly)
      }
      ctx.fillStyle = layer.color
      ctx.fillText(line, 0, ly)
      ctx.restore()

      // Clean top crisp pass without shadow blur muddying the edges
      if (layer.strokeWidth > 0) {
        ctx.strokeStyle = layer.strokeColor
        ctx.lineWidth = layer.strokeWidth * 2
        ctx.strokeText(line, 0, ly)
      }
      ctx.fillStyle = layer.color
      ctx.fillText(line, 0, ly)
    })

    ctx.restore()
  }
}
