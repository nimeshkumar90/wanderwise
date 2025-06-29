# 🌍 WanderWise

A modern web application for tracking where teachers spent their June summer break. Built with HTML, CSS, JavaScript, Google Maps API, and Supabase.

## 📋 Features

### Form Page (`form.html`)
- ✅ Clean, responsive form for teacher submissions
- ✅ Google Maps Autocomplete for location selection
- ✅ Toggle between "Stayed at Home" and "Traveled"
- ✅ Employee ID validation (prevents duplicate submissions)
- ✅ Real-time form validation
- ✅ Success/Error modals
- ✅ Reset form functionality

### Dashboard Page (`dashboard.html`)
- ✅ Google Maps integration with custom markers
- ✅ Real-time statistics (Home/Travel/India/Abroad counts)
- ✅ Advanced filtering (Location type, Name search)
- ✅ Interactive teacher list
- ✅ CSV export functionality
- ✅ Responsive design for all devices

## 🚀 Quick Setup

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Create a new table called `teacher_holidays` with the following schema:

```sql
CREATE TABLE teacher_holidays (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('home', 'travel')),
    location_name TEXT,
    latitude FLOAT8,
    longitude FLOAT8,
    country TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Get your Supabase URL and anon key from the project settings

### 2. Database Migration for Multiple Entries

**Important**: To support multiple entries per employee ID (up to 4), you need to run a database migration.

1. **Go to your Supabase Dashboard**
2. **Open the SQL Editor**
3. **Run the migration script**:
   ```sql
   -- Migration: Remove UNIQUE constraint from employee_id
   ALTER TABLE teacher_holidays DROP CONSTRAINT IF EXISTS teacher_holidays_employee_id_key;
   ```
4. **Verify the migration** by running:
   ```sql
   \d teacher_holidays
   ```
   You should see that the `employee_id` column no longer has a `UNIQUE` constraint.

### 3. Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create API credentials (API Key)
5. Restrict the API key to your domain for security

### 4. Configuration

Update the following files with your API keys:

#### In `script-form.js`:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

#### In `script-dashboard.js`:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

#### In both HTML files:
Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual Google Maps API key in the script tag:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places"></script>
```

### 5. Deployment

1. Upload all files to your web server
2. Ensure HTTPS is enabled (required for Google Maps API)
3. Update API key restrictions to include your domain

## 🎨 Design Features

### Color Palette
- **Green Blue**: #0067AF (Primary brand color)
- **Celestial Blue**: #079DD9 (Secondary actions)
- **Cambridge Blue**: #86BCA1 (Success states)
- **Citrine**: #C3C529 (Warning/Highlight)
- **Straw**: #E0DE76 (Accent color)

### Company Logo Integration
The application supports custom company logos on the map:

- **Map Overlay**: Logo displayed as a watermark on the map
- **Custom Markers**: Logo used as map markers for teacher locations
- **Fallback Text**: Text placeholder when logo image is not available

**Setup**: See `LOGO_SETUP.md` for detailed instructions on adding your company logo.

### UI Components
- Modern gradient headers
- Card-based layouts with shadows
- Responsive design for mobile/tablet
- Smooth animations and transitions
- Google Fonts (Poppins) integration

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔧 Technical Details

### Frontend Technologies
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Modern JavaScript features
- **Google Maps API**: Maps, Places, and Geocoding
- **Supabase Client**: Real-time database operations

### Key Features
- **Form Validation**: Client-side validation with duplicate checking
- **Location Services**: Google Places Autocomplete with reverse geocoding
- **Data Export**: CSV export functionality
- **Real-time Updates**: Live statistics and filtering
- **Error Handling**: Comprehensive error handling and user feedback

## 📊 Data Structure

### Teacher Holiday Entry
```javascript
{
    name: "Teacher Name",
    employee_id: "EMP001",
    status: "home" | "travel",
    location_name: "Location Name (if traveled)",
    latitude: 12.3456,
    longitude: 78.9012,
    country: "Country Name (if traveled)"
}
```

## 🔒 Security Considerations

1. **API Key Restrictions**: Restrict Google Maps API key to your domain
2. **Supabase RLS**: Enable Row Level Security in Supabase
3. **Input Validation**: All user inputs are validated
4. **HTTPS**: Always use HTTPS in production

## 🚀 Performance Optimizations

- Lazy loading of map markers
- Efficient data filtering
- Optimized CSS with modern properties
- Minimal JavaScript bundle size

## 🐛 Troubleshooting

### Common Issues

1. **Maps not loading**: Check Google Maps API key and billing
2. **Supabase connection errors**: Verify URL and anon key
3. **Form submission fails**: Check browser console for errors
4. **Location not found**: Ensure Places API is enabled

### Debug Mode

Add this to your browser console for debugging:
```javascript
localStorage.setItem('debug', 'true');
```

## 📈 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Photo uploads for travel locations
- [ ] Social sharing features
- [ ] Offline support
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

## 🚀 Quick Start

1. **Clone or download** this project to your local machine
2. **Set up Supabase** (see Supabase Setup section below)
3. **Start the local server**:
   ```bash
   python3 -m http.server 8001
   ```
4. **Open your browser** and navigate to:
   - Form: `http://localhost:8001/form.html`
   - Dashboard: `http://localhost:8001/dashboard.html`

## 🔧 API Configuration

### Google Maps API
The application uses Google Maps for location autocomplete and mapping. The current implementation includes:

- **Autocomplete**: Uses Google Maps Places API for location suggestions
- **Country Detection**: Uses a free geocoding service (BigDataCloud) to automatically detect countries from coordinates
- **Fallback**: Includes pattern matching for common country names in location data

**Note**: The hardcoded Google Maps API key in the code may not be authorized for all APIs. For production use, you should:

1. Create your own Google Cloud Project
2. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Create an API key with appropriate restrictions
4. Replace the API key in the code

### Current Implementation
The application currently uses:
- **BigDataCloud Geocoding API**: Free service for country detection (no API key required)
- **Google Maps Places API**: For location autocomplete (requires valid API key)
- **Fallback Pattern Matching**: Extracts country names from location text when geocoding fails

## 🚀 Quick Setup

---

**Built with ❤️ for educational institutions** 