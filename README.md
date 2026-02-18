# Duotone Generator

A web app for creating stylized duotone portraits. Upload a photo, automatically remove the background, and apply beautiful color effects — all in the browser.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## Features

- **Background removal** — powered by [fal.ai](https://fal.ai) BiRefNet
- **Duotone color effects** — real-time preview with 8 curated presets
- **Adjustable outline** — configurable stroke thickness around the subject
- **Custom colors** — pick any background and duotone color
- **PNG export** — download your creation with one click

## Getting Started

### Prerequisites

- Node.js (LTS)
- A [fal.ai](https://fal.ai) API key

### Install

```bash
npm install
```

### Configure

Create a `.env.local` file:

```
FAL_KEY=your_fal_ai_api_key
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Framework | Next.js 14 (App Router) |
| Language  | TypeScript              |
| Styling   | Tailwind CSS            |
| Rendering | HTML Canvas             |
| AI        | fal.ai BiRefNet         |
| Analytics | Vercel Analytics        |

## How It Works

1. Upload a portrait (PNG, JPG, or WebP, up to 10 MB)
2. The background is removed via the fal.ai API
3. Pixel luminance is extracted and cached for fast re-rendering
4. A duotone effect is applied: `output = bg + (tone - bg) * luminance`
5. Layers are composited: background, outline, duotoned subject, and watermark

## License

All rights reserved.
