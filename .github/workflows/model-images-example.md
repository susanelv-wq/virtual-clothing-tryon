# Model Images Repository Structure

This is an example structure for your model images repository.

## Recommended Folder Structure

```
virtual-tryon-models/
├── models/
│   ├── standing-front/
│   │   ├── light-slim.jpg
│   │   ├── light-average.jpg
│   │   ├── medium-slim.jpg
│   │   ├── medium-average.jpg
│   │   └── dark-curvy.jpg
│   ├── standing-side/
│   │   └── ...
│   ├── sitting/
│   │   └── ...
│   └── walking/
│       └── ...
└── README.md
```

## URL Format

Once uploaded, your image URLs will be:
```
https://raw.githubusercontent.com/YOUR_USERNAME/virtual-tryon-models/main/models/standing-front/medium-average.jpg
```

## Quick Setup

1. Create the repository on GitHub
2. Create a `models` folder
3. Upload images organized by pose
4. Use the raw GitHub URLs in `lib/model-gallery.ts`
