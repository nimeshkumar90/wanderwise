// Configuration Template for Teacher Holiday Tracker
// Copy this file to config.js and update with your actual API keys

const CONFIG = {
    // Supabase Configuration
    SUPABASE_URL: 'YOUR_SUPABASE_URL_HERE',
    SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY_HERE',
    
    // Google Maps API Configuration
    GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY_HERE',
    
    // Application Settings
    APP_NAME: 'WanderWise',
    DEFAULT_MAP_CENTER: { lat: 20.5937, lng: 78.9629 }, // Center of India
    DEFAULT_MAP_ZOOM: 4,
    
    // India boundaries for location filtering
    INDIA_BOUNDS: {
        north: 37.6,
        south: 6.8,
        east: 97.4,
        west: 68.1
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} 