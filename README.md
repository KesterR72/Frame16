# Frame16

High-CTR YouTube Thumbnail Studio & Feed Packaging Suite. Powered by [Rubec](https://rubec.pages.dev).

## Features
- **True 1280×720 Canvas:** Drag-and-drop layers with real-time scaling, rotation, and flip controls.
- **YouTube Safe-Zone Overlay:** In-editor `14:20` corner guide to prevent timestamp occlusions (never exported).
- **120px Mobile Feed Simulator:** Shrink your preview into an actual YouTube phone feed mockup to test instant legibility.
- **Grayscale Squint Check:** Monochrome toggle to verify contrast hierarchy.
- **Atmospheric Lighting & Rim Glow:** Vignette edge burn, contrast/saturation boost, and neon subject rim glow.
- **1-Click Export:** Pure client-side rendering under YouTube's 2MB upload ceiling.

## Local Development
```bash
npm install
npm run dev
```

## Production Build (Cloudflare Pages)
```bash
npm run build
```
Output directory: `dist`

---
Copyright (c) 2026 Rubec. All rights reserved.
