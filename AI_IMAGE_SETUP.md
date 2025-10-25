# Image Generation Setup

## Overview
FoodToday uses **FREE** food images from the Foodish API - no payment required! Optionally supports AI-generated images with OpenAI DALL-E.

## Default Setup (FREE - No Configuration Needed!)

FoodToday automatically uses the **free Foodish API** which provides:
- ✅ Real food photography
- ✅ Beautiful dish images
- ✅ Completely free
- ✅ No API key needed
- ✅ No setup required

## Optional: AI Image Generation

If you want AI-generated images (optional, costs money):

### 1. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to API Keys section
4. Click "Create new secret key"
5. Copy the key

### 2. Add API Key to Environment
Create a `.env` file in the project root:

```bash
VITE_OPENAI_API_KEY=sk-your-api-key-here
```

### 3. Restart Dev Server
```bash
npm run dev
```

## How It Works

### Default Mode (FREE - Current Setting)
- Uses **Foodish API** for real food images
- Tries to match dish category (pizza, pasta, soup, etc.)
- Falls back to random food images if no match
- Completely free
- No API key needed
- Fast loading

### With API Key (AI Mode - Optional)
- Generates unique AI images for each dish
- Images are relevant to the dish name
- Uses OpenAI DALL-E (costs ~$0.02 per image)
- Takes 2-3 seconds to generate

## Cost Estimation
- DALL-E 2: ~$0.02 per image
- For 1000 recipes: ~$20
- For 10,000 recipes: ~$200

## Features

### Image Generation
- Automatically generates images based on dish name
- Professional food photography style
- Falls back to placeholder if AI fails
- Caching can be added to reduce API calls

### Loading States
- Shows "Generating image..." while loading
- Gracefully handles errors
- Hides image if generation fails

## Troubleshooting

### Images not showing?
1. Check browser console for errors
2. Verify API key is set correctly
3. Check OpenAI account has credits
4. Verify network connection

### Too slow?
- Add image caching
- Pre-generate images for popular dishes
- Use smaller image sizes (currently 512x512)

### Too expensive?
- Use fallback mode (remove API key)
- Cache generated images
- Generate only for popular recipes

## Testing

Test without API key (fallback mode):
```bash
# Remove or comment out the API key in .env
# VITE_OPENAI_API_KEY=
npm run dev
```

Test with API key:
```bash
# Add your API key
VITE_OPENAI_API_KEY=sk-your-key-here
npm run dev
```

## Future Enhancements
- [ ] Image caching to reduce API calls
- [ ] Pre-generate images for popular dishes
- [ ] User-generated images
- [ ] Multiple image options per dish
- [ ] Different AI models (DALL-E 3, Stable Diffusion)
