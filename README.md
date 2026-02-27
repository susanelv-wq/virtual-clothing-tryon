# Virtual Clothing Try-On Web Application

A modern web application for virtual clothing try-on using AI. Upload clothing images and see them on professional models with 360-degree rotation.

## Features

- 🎨 **Upload Clothing Images**: Drag & drop or click to upload clothing photos
- 🤖 **AI Virtual Try-On**: Generate realistic images using FASHN API
- 👗 **4 Professional Models**: Choose from Spanish, Blonde, Asian, or Korean models
- 🔄 **360° Rotation**: View generated results from all angles (front, side, back)
- 🎯 **Full Body Views**: Models show head-to-toe with sneakers
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- ⚡ **Instant Results**: Real-time generation with progress indicators

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **FASHN API** - AI image generation
- **ImgBB** - Image hosting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- FASHN API key (free at https://app.fashn.ai/api)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/susanelv-wq/virtual-clothing-tryon.git
cd virtual-clothing-tryon
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
FASHN_API_KEY=your_fashn_api_key_here
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. **Upload**: Click or drag clothing image to upload
2. **Choose Model**: Select from 4 available models
3. **Select Background**: Choose studio background style
4. **Generate**: Click "Generate Virtual Try-On" (creates all 4 angles)
5. **Rotate**: Use the 360° control to view different angles
6. **Download**: Save your favorite angle

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick deploy to Vercel:
1. Push to GitHub
2. Import project on Vercel
3. Add `FASHN_API_KEY` environment variable
4. Deploy!

## Project Structure

```
├── app/
│   ├── api/generate/     # API route for image generation
│   ├── generate/         # Generation page
│   └── page.tsx          # Home/upload page
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── customization-panel.tsx
│   ├── rotation-control.tsx
│   └── upload-zone.tsx
├── lib/
│   ├── model-gallery.ts  # Model configurations
│   └── image-storage.ts  # Image utilities
└── public/               # Static assets
```

## Models

The app includes 4 professional models with 4 angles each:
- **Spanish** - Medium skin tone
- **Blonde** - Light skin tone  
- **Asian** - Light skin tone
- **Korean** - Light skin tone

Each model has: Front (0°), Side 1 (90°), Back (180°), Side 2 (270°)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
