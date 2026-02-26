# Troubleshooting Guide

## Image Not Showing After Generation

If you see "Generated virtual try-on" text but no image appears, try these steps:

### 1. Check Browser Console
- Open Developer Tools (F12 or Cmd+Option+I)
- Look for errors in the Console tab
- Check for CORS errors, image load errors, or API errors

### 2. Check Network Tab
- Open Developer Tools → Network tab
- Click "Generate Virtual Try-On"
- Look for the `/api/generate` request
- Check if it returns 200 OK
- Check the response - it should have `imageUrl` field

### 3. Verify Demo Mode Works
The app should work in demo mode (without API keys):
- Upload an image
- Click "Generate Virtual Try-On"
- You should see your uploaded image as the result
- This confirms the UI is working

### 4. Common Issues

#### Issue: "Failed to download image"
**Solution**: 
- The image might be a data URL (base64)
- Try right-clicking the image and "Save Image As"
- Or check if the image URL is valid in the console

#### Issue: Image shows but is broken
**Solution**:
- Check browser console for image load errors
- The image URL might be invalid
- Try refreshing the page

#### Issue: Nothing happens when clicking Generate
**Solution**:
- Check browser console for JavaScript errors
- Make sure you're connected to the internet
- Check if the API route is accessible

### 5. Enable Debug Mode

The app includes debug logging. Check the browser console for:
- "Starting generation..."
- "Calling API..."
- "API response status: 200"
- "Setting generated image: ..."

### 6. Test API Directly

You can test the API endpoint directly:

```bash
# Using curl (replace with your actual image file)
curl -X POST http://localhost:3000/api/generate \
  -F "image=@/path/to/image.jpg" \
  -F "pose=standing-front" \
  -F "skinTone=medium" \
  -F "bodyType=average" \
  -F "background=studio-white"
```

### 7. Check Server Logs

If running `npm run dev`, check the terminal for:
- "API: Received generation request"
- "API: Processing image file..."
- "API: Generated image URL: ..."

### 8. Verify Environment Variables

Make sure `.env.local` exists (optional for demo mode):
```env
FASHN_API_KEY=your_key_here
IMGBB_API_KEY=your_key_here
```

### 9. Clear Browser Cache

Sometimes cached data causes issues:
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Clear browser cache
- Try incognito/private mode

### 10. Check Image Format

Supported formats:
- PNG
- JPG/JPEG
- WEBP
- Max size: 10MB

## Still Not Working?

1. **Check the browser console** - Most errors will be logged there
2. **Check server terminal** - API errors are logged there
3. **Try demo mode first** - Remove API keys and test with just the uploaded image
4. **Verify file upload works** - Make sure you can upload images on the home page

## Expected Behavior

### Demo Mode (No API Keys)
1. Upload image → Works ✅
2. Click Generate → Shows uploaded image as result ✅
3. Download → Works ✅

### With API Keys
1. Upload image → Works ✅
2. Click Generate → Calls API → Shows generated image ✅
3. Download → Works ✅

If demo mode doesn't work, there's a UI issue. If demo works but API doesn't, check API configuration.
