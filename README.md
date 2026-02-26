# Virtual Try-On Web Application

A modern, AI-powered virtual try-on web application built with Next.js 15, React, and Fal AI. Upload clothing images and generate realistic virtual try-on photos with customizable model options.

## Features

- 🎨 **Upload Clothing Photos** - Drag-and-drop or click to upload clothing/product images
- 🤖 **AI Virtual Try-On** - Generate realistic images showing clothing on professional models
- ⚙️ **Model Customization** - Customize pose, skin tone, body type, and background
- ⚡ **Instant Results** - Real-time generation with loading indicators
- 💾 **Save & Download** - Download generated images as high-quality files
- 📜 **History** - Session-based image history

## Tech Stack

- **Framework**: Next.js 15 with React
- **UI**: Tailwind CSS + shadcn/ui components
- **AI Image Generation**: FASHN API (Free Tier Available)
- **File Storage**: ImgBB (Free) or Cloudinary (Free Tier)
- **Image Processing**: Sharp
- **State Management**: React hooks

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- FASHN API key ([Get FREE key here](https://app.fashn.ai/api))
- Optional: ImgBB API key for higher upload limits ([Free](https://api.imgbb.com/))
- Optional: Cloudinary account for storage ([Free tier](https://cloudinary.com/users/register/free))

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

3. Add your API keys to `.env.local`:

```env
# Required: FASHN API Key (FREE)
FASHN_API_KEY=your_fashn_api_key_here

# Optional: For higher image upload limits
IMGBB_API_KEY=your_imgbb_key_here

# Optional: Cloudinary for storage (free tier: 10GB)
CLOUDINARY_URL=cloudinary://your_key:your_secret@your_cloud_name
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### FASHN API Integration (FREE TIER)

The application uses FASHN API for virtual try-on generation with a **free tier**:

1. Sign up at [FASHN Developer Dashboard](https://app.fashn.ai/api)
2. Get your free API key
3. Add it to your `.env.local` file as `FASHN_API_KEY`

**Important Notes**:

- FASHN API requires both a clothing image AND a model/human image
- You'll need to create a gallery of professional model images with different poses, skin tones, and body types
- Update `lib/model-gallery.ts` with your actual model image URLs
- Model images can be stored on any free CDN (ImgBB, Cloudinary free tier, or even GitHub)
- The model selection matches the user's customization choices (pose, skin tone, body type)

### Free Storage Options

**ImgBB** (Recommended - Completely Free):
- No signup required for basic usage
- Get free API key at [api.imgbb.com](https://api.imgbb.com/) for higher limits
- Unlimited uploads with free tier

**Cloudinary** (Free Tier):
- 10GB storage, 25GB bandwidth/month
- Sign up at [cloudinary.com](https://cloudinary.com/users/register/free)
- Set `CLOUDINARY_URL` in `.env.local`

**Example Model Gallery Structure**:
```
models/
  ├── standing-front-light-slim.jpg
  ├── standing-front-medium-average.jpg
  ├── standing-side-dark-curvy.jpg
  └── ...
```

You can also use Fal AI's `image-apps-v2/virtual-try-on` model which may have different requirements.

### Vercel Blob Storage

For production deployments, configure Vercel Blob Storage:

1. Create a Blob store in your Vercel dashboard
2. Get your read/write token
3. Add it to your environment variables

## Project Structure

```
├── app/
│   ├── api/
│   │   └── generate/        # API route for image generation
│   ├── generate/            # Generation dashboard page
│   ├── history/             # History page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home/upload page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── upload-zone.tsx      # File upload component
│   └── customization-panel.tsx # Customization options
├── lib/
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

## Usage

1. **Upload**: Go to the home page and upload a clothing image
2. **Customize**: Adjust model pose, skin tone, body type, and background
3. **Generate**: Click "Generate Virtual Try-On" to create the image
4. **Download**: Save your generated image in high quality
5. **History**: View your previous generations in the history page

## Development

### Adding New Features

- Customization options can be added in `components/customization-panel.tsx`
- API logic is in `app/api/generate/route.ts`
- UI components follow shadcn/ui patterns

### Styling

The app uses Tailwind CSS with custom design tokens. Modify `tailwind.config.ts` and `app/globals.css` for theme changes.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The app is optimized for Vercel's serverless functions and edge network.

## License

MIT

## Notes

- The Fal AI integration is a placeholder and needs to be configured with actual API endpoints
- Image generation may take 10-30 seconds depending on the model
- Session storage is used for history (cleared on browser close)
- For production, consider implementing proper database storage for history
