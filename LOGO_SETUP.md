# 🏢 Company Logo Setup Guide

This guide explains how to add your company logo to the WanderWise map.

## 📋 Overview

The application supports three ways to display your company logo:

1. **Map Overlay**: Logo displayed as a watermark on the map
2. **Custom Markers**: Logo used as map markers for teacher locations
3. **Fallback Text**: Text placeholder when logo image is not available

## 🖼️ Image Requirements

### Recommended Image Specifications

| Use Case | Width | Height | Format | File Size |
|----------|-------|--------|--------|-----------|
| **Map Overlay** | 120px | 40px | PNG/JPG/SVG | < 50KB |
| **Map Markers** | 32px | 32px | PNG/JPG/SVG | < 20KB |
| **High Resolution** | 240px | 80px | PNG/JPG/SVG | < 100KB |

### Image Format Guidelines

- **PNG**: Best for logos with transparency
- **JPG**: Good for photographic logos
- **SVG**: Best for scalable logos (recommended)

### Design Tips

- Use transparent background for better integration
- Ensure logo is readable at small sizes
- Keep file sizes small for faster loading
- Test visibility against map backgrounds

## 🚀 Quick Setup

### Step 1: Prepare Your Logo

1. **Resize your logo** to the recommended dimensions
2. **Save in PNG format** with transparent background
3. **Optimize file size** using tools like TinyPNG or ImageOptim

### Step 2: Add Logo to Project

1. **Place your logo** in the `assets/` folder
2. **Name it** `company-logo.png` (or update the configuration)
3. **Ensure the file path** is correct in the configuration

### Step 3: Configure Logo Settings

Edit the `COMPANY_LOGO_CONFIG` in `script-dashboard.js`:

```javascript
const COMPANY_LOGO_CONFIG = {
    // Update this path to your logo file
    logoUrl: './assets/your-company-logo.png',
    
    // Logo size for markers (32x32 recommended)
    markerLogoSize: {
        width: 32,
        height: 32
    },
    
    // Logo size for overlay (120x40 recommended)
    overlayLogoSize: {
        width: 120,
        height: 40
    },
    
    // Logo position: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
    overlayPosition: 'top-left',
    
    // Show logo overlay on map
    showOverlay: true,
    
    // Use logo for markers instead of default markers
    useLogoForMarkers: false
};
```

## ⚙️ Configuration Options

### Logo Overlay Settings

```javascript
// Show/hide logo overlay
showOverlay: true, // or false

// Logo position on map
overlayPosition: 'top-left', // 'top-right', 'bottom-left', 'bottom-right'

// Logo size for overlay
overlayLogoSize: {
    width: 120,  // pixels
    height: 40   // pixels
}
```

### Custom Marker Settings

```javascript
// Use logo as map markers
useLogoForMarkers: true, // or false

// Logo size for markers
markerLogoSize: {
    width: 32,   // pixels
    height: 32   // pixels
}
```

## 📁 File Structure

```
teachers-travel-data/
├── assets/
│   ├── company-logo.png          # Your company logo
│   ├── company-logo-small.png    # Small version for markers
│   └── company-logo-large.png    # Large version for overlay
├── script-dashboard.js           # Logo configuration
├── dashboard.html               # Map display
└── LOGO_SETUP.md               # This guide
```

## 🎨 Customization Examples

### Example 1: Simple Logo Overlay

```javascript
const COMPANY_LOGO_CONFIG = {
    logoUrl: './assets/company-logo.png',
    overlayLogoSize: { width: 120, height: 40 },
    overlayPosition: 'top-left',
    showOverlay: true,
    useLogoForMarkers: false
};
```

### Example 2: Logo as Markers

```javascript
const COMPANY_LOGO_CONFIG = {
    logoUrl: './assets/company-logo-small.png',
    markerLogoSize: { width: 32, height: 32 },
    overlayPosition: 'top-left',
    showOverlay: false,
    useLogoForMarkers: true
};
```

### Example 3: Both Overlay and Markers

```javascript
const COMPANY_LOGO_CONFIG = {
    logoUrl: './assets/company-logo.png',
    markerLogoSize: { width: 32, height: 32 },
    overlayLogoSize: { width: 120, height: 40 },
    overlayPosition: 'top-right',
    showOverlay: true,
    useLogoForMarkers: true
};
```

## 🔧 Advanced Customization

### Custom Logo Styling

You can modify the logo overlay styling in the `addLogoOverlay()` function:

```javascript
// Custom background and styling
logoDiv.style.cssText = `
    position: absolute;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.95);  // More opaque
    border-radius: 12px;                     // Rounder corners
    padding: 12px;                           // More padding
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);  // Stronger shadow
    backdrop-filter: blur(8px);              // More blur
`;
```

## 🐛 Troubleshooting

### Logo Not Displaying

1. **Check file path**: Ensure logo file exists in the correct location
2. **Check file format**: Use PNG, JPG, or SVG format
3. **Check browser console**: Look for 404 errors
4. **Check file permissions**: Ensure web server can access the file

### Logo Too Large/Small

1. **Adjust size settings** in `COMPANY_LOGO_CONFIG`
2. **Resize your logo file** to match the configuration
3. **Test different sizes** to find the optimal dimensions

### Logo Not Centered on Markers

1. **Check anchor point** settings
2. **Ensure logo is square** for marker use
3. **Test with different anchor values**

### Performance Issues

1. **Optimize image file size** (use TinyPNG or similar)
2. **Use appropriate image format** (PNG for transparency, JPG for photos)
3. **Consider using SVG** for scalable logos

## 📱 Responsive Design

The logo overlay automatically adapts to different screen sizes. For mobile optimization:

```javascript
// Mobile-specific logo sizes
const isMobile = window.innerWidth < 768;
const mobileLogoSize = {
    width: isMobile ? 80 : 120,
    height: isMobile ? 27 : 40
};
```

## 🎯 Best Practices

1. **Use transparent backgrounds** for better integration
2. **Keep file sizes small** for faster loading
3. **Test on different devices** and screen sizes
4. **Ensure logo is readable** at small sizes
5. **Use consistent branding** across all logo uses
6. **Backup with fallback text** for reliability

## 📞 Support

If you need help with logo setup:

1. Check the browser console for errors
2. Verify file paths and permissions
3. Test with different image formats
4. Ensure logo meets size requirements

---

**Note**: The application includes a fallback text logo that displays if the image fails to load, ensuring your branding is always visible. 