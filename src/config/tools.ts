export interface StudioTool {
  id: string
  title: string
  description: string
  path: string
  aspectRatio: string
  highlights: string[]
}

export const MAIN_TOOL: StudioTool = {
  id: 'yt-thumbnail',
  title: 'YouTube Thumbnail Maker',
  description:
    'Design 16:9 thumbnails made to win in mobile feeds. Preview how your text reads at phone scale, guard the bottom-right timestamp corner, add subject rim lighting, and export under 2MB.',
  path: '/yt-thumbnail',
  aspectRatio: '16:9 · 1280×720',
  highlights: [
    '120px phone feed simulator',
    'YouTube timestamp safe-zone guide (never exported)',
    'Grayscale squint test for visual contrast',
    'Built-in cutout faces, backdrops, and custom file drops',
    'Instant PNG/JPEG export under YouTube’s 2MB limit',
  ],
}
