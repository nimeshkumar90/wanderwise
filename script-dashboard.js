// Supabase Configuration
const SUPABASE_URL = 'https://lrdknobiooudavkcdjmn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyZGtub2Jpb291ZGF2a2Nkam1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNTk0NjIsImV4cCI6MjA2NjczNTQ2Mn0.iRRvw1cJLBfa3tadXbsXw0PDDuODrj3wyq5jQHOe3_s';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Company Logo Configuration
const COMPANY_LOGO_CONFIG = {
    // Logo URL - replace with your actual logo URL
    logoUrl: './assets/company-logo.png', // or 'https://your-domain.com/logo.png'
    
    // Logo URL for markers - separate file for markers
    markerLogoUrl: './assets/company-logo-marker.png', // or 'https://your-domain.com/logo-marker.png'
    
    // Logo size for markers (in pixels)
    markerLogoSize: {
        width: 32,
        height: 32
    },
    
    // Logo size for overlay (in pixels)
    overlayLogoSize: {
        width: 120,
        height: 40
    },
    
    // Logo position on map (top-left, top-right, bottom-left, bottom-right)
    overlayPosition: 'top-left',
    
    // Show logo overlay on map
    showOverlay: true,
    
    // Use logo for markers instead of default markers
    useLogoForMarkers: true
};

// Global variables
let map;
let markers = [];
let allTeachers = [];
let filteredTeachers = [];
let currentPage = 1;
const itemsPerPage = 10;
let logoOverlay = null;
let infoWindowsEnabled = false; // Track info window toggle state - default to OFF (labels visible)

// DOM Elements
const totalTeachersEl = document.getElementById('totalTeachers');
const stayedHomeEl = document.getElementById('stayedHome');
const traveledEl = document.getElementById('traveled');
const traveledIndiaEl = document.getElementById('traveledIndia');
const traveledAbroadEl = document.getElementById('traveledAbroad');
const homePercentageEl = document.getElementById('homePercentage');
const travelPercentageEl = document.getElementById('travelPercentage');
const indiaPercentageEl = document.getElementById('indiaPercentage');
const abroadPercentageEl = document.getElementById('abroadPercentage');
const locationFilter = document.getElementById('locationFilter');
const nameSearch = document.getElementById('nameSearch');
const filterButtons = document.querySelectorAll('.filter-btn');
const tableBody = document.getElementById('tableBody');
const tableInfo = document.getElementById('tableInfo');
const pageInfo = document.getElementById('pageInfo');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const loadingOverlay = document.getElementById('loadingOverlay');

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loaded');
    initializeMap();
    loadDashboardData();
    setupEventListeners();
    
    // Test if toggle button exists and is working
    setTimeout(() => {
        const toggleBtn = document.getElementById('infoWindowToggle');
        if (toggleBtn) {
            console.log('✅ Toggle button found:', toggleBtn);
            console.log('Button text:', toggleBtn.textContent);
            console.log('Button onclick:', toggleBtn.onclick);
            
            // Set initial button color to green since info windows are enabled by default
            toggleBtn.style.background = '#10b981';
            toggleBtn.style.borderColor = '#059669';
            toggleBtn.style.color = 'white';
        } else {
            console.error('❌ Toggle button not found!');
        }
    }, 1000);
});

// Initialize Google Maps
function initializeMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    map = new google.maps.Map(mapContainer, {
        center: { lat: 20.5937, lng: 78.9629 }, // Center of India
        zoom: 4,
        styles: [
            {
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#c9c9c9' }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9e9e9e' }]
            },
            {
                featureType: 'transit.line',
                elementType: 'geometry',
                stylers: [{ color: '#e5e5e5' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{ color: '#ffffff' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#bdbdbd' }]
            },
            {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [{ color: '#ffffff' }]
            },
            {
                featureType: 'road.arterial',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#d6d6d6' }]
            },
            {
                featureType: 'road.local',
                elementType: 'geometry',
                stylers: [{ color: '#ffffff' }]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#757575' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{ color: '#e5e5e5' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9e9e9e' }]
            },
            {
                featureType: 'poi.business',
                elementType: 'geometry',
                stylers: [{ color: '#eeeeee' }]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{ color: '#e5e5e5' }]
            },
            {
                featureType: 'transit.station',
                elementType: 'geometry',
                stylers: [{ color: '#eeeeee' }]
            },
            {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }]
            },
            {
                featureType: 'landscape.man_made',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }]
            },
            {
                featureType: 'landscape.natural',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }]
            },
            {
                featureType: 'landscape.natural.landcover',
                elementType: 'geometry',
                stylers: [{ color: '#dde2e3' }]
            },
            {
                featureType: 'landscape.natural.terrain',
                elementType: 'geometry',
                stylers: [{ color: '#dde2e3' }]
            },
            {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#c9c9c9' }]
            },
            {
                featureType: 'administrative.land_parcel',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#dcd2be' }]
            },
            {
                featureType: 'administrative.neighborhood',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#dcd2be' }]
            },
            {
                featureType: 'poi.business',
                elementType: 'geometry',
                stylers: [{ color: '#dfd2ae' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{ color: '#a2c5a2' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#447530' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#ffffff' }]
            },
            {
                featureType: 'road.arterial',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#8b8b8b' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#101010' }]
            },
            {
                featureType: 'road.local',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9e9e9e' }]
            },
            {
                featureType: 'transit',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#757575' }]
            },
            {
                featureType: 'transit.line',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#757575' }]
            },
            {
                featureType: 'transit.line',
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'landscape.man_made',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9e9e9e' }]
            },
            {
                featureType: 'landscape.natural',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9e9e9e' }]
            },
            {
                featureType: 'landscape.natural.landcover',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9e9e9e' }]
            },
            {
                featureType: 'landscape.natural.terrain',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9e9e9e' }]
            },
            {
                featureType: 'poi.business',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#757575' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#447530' }]
            },
            {
                featureType: 'poi.school',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#757575' }]
            },
            {
                featureType: 'poi.medical',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#757575' }]
            },
            {
                featureType: 'poi.business',
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'poi.school',
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'poi.medical',
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'transit',
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });

    // Add logo overlay if enabled
    if (COMPANY_LOGO_CONFIG.showOverlay) {
        addLogoOverlay();
    }

    // Add custom map control with logo
    addCustomMapControl();
}

// Add logo overlay to the map
function addLogoOverlay() {
    // Create logo overlay element
    const logoDiv = document.createElement('div');
    logoDiv.style.cssText = `
        position: absolute;
        z-index: 1000;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 8px;
        padding: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(4px);
    `;

    // Set position based on configuration
    switch (COMPANY_LOGO_CONFIG.overlayPosition) {
        case 'top-right':
            logoDiv.style.top = '10px';
            logoDiv.style.right = '10px';
            break;
        case 'bottom-left':
            logoDiv.style.bottom = '10px';
            logoDiv.style.left = '10px';
            break;
        case 'bottom-right':
            logoDiv.style.bottom = '10px';
            logoDiv.style.right = '10px';
            break;
        default: // top-left
            logoDiv.style.top = '10px';
            logoDiv.style.left = '10px';
    }

    // Create logo image
    const logoImg = document.createElement('img');
    logoImg.src = COMPANY_LOGO_CONFIG.logoUrl;
    logoImg.alt = 'Company Logo';
    logoImg.style.cssText = `
        width: ${COMPANY_LOGO_CONFIG.overlayLogoSize.width}px;
        height: ${COMPANY_LOGO_CONFIG.overlayLogoSize.height}px;
        object-fit: contain;
        display: block;
    `;

    // Handle logo load error
    logoImg.onerror = function() {
        console.warn('Company logo not found. Using fallback text.');
        logoDiv.innerHTML = `
            <div style="
                width: ${COMPANY_LOGO_CONFIG.overlayLogoSize.width}px;
                height: ${COMPANY_LOGO_CONFIG.overlayLogoSize.height}px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #0067AF, #079DD9);
                color: white;
                font-weight: bold;
                font-size: 12px;
                border-radius: 4px;
                text-align: center;
            ">
                COMPANY<br>LOGO
            </div>
        `;
    };

    logoDiv.appendChild(logoImg);

    // Add to map container
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.appendChild(logoDiv);
        logoOverlay = logoDiv;
    }
}

// Add custom map control with company logo
function addCustomMapControl() {
    // Create custom control div
    const controlDiv = document.createElement('div');
    controlDiv.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 1000;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 8px;
        padding: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(4px);
        border: 1px solid rgba(0, 0, 0, 0.1);
    `;

    // Create logo and text
    controlDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 6px;">
            <img src="${COMPANY_LOGO_CONFIG.logoUrl}" alt="Company Logo" style="width: 20px; height: 14px; object-fit: contain;">
            <div style="font-size: 10px; color: #374151; font-weight: 500; white-space: nowrap;">
                Holiday Tracker
            </div>
        </div>
    `;

    // Add to map
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
}

// Setup event listeners
function setupEventListeners() {
    // Filter event listeners
    locationFilter.addEventListener('change', applyFilters);
    nameSearch.addEventListener('input', applyFilters);
    
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            applyFilters();
        });
    });
    
    // Initialize toggle button state
    const toggleBtn = document.getElementById('infoWindowToggle');
    const toggleText = document.getElementById('infoWindowToggleText');
    const toggleIcon = toggleBtn.querySelector('i');
    
    if (infoWindowsEnabled) {
        toggleText.textContent = 'Info Windows: ON';
        toggleIcon.className = 'fas fa-info-circle';
        toggleBtn.style.background = '#10b981';
        toggleBtn.style.borderColor = '#059669';
        toggleBtn.style.color = 'white';
    } else {
        toggleText.textContent = 'Info Windows: OFF';
        toggleIcon.className = 'fas fa-times-circle';
        toggleBtn.style.background = '#ef4444';
        toggleBtn.style.borderColor = '#dc2626';
        toggleBtn.style.color = 'white';
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        showLoading(true);
        
        const { data, error } = await supabaseClient
            .from('teacher_holidays')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            throw error;
        }
        
        allTeachers = data || [];
        filteredTeachers = [...allTeachers];
        
        updateStats();
        updateMap();
        updateTable();
        
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load dashboard data. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Update statistics
function updateStats() {
    const total = allTeachers.length;
    const stayedHome = allTeachers.filter(t => t.status === 'home').length;
    const traveled = allTeachers.filter(t => t.status === 'travel').length;
    const traveledIndia = allTeachers.filter(t => t.status === 'travel' && t.country === 'India').length;
    const traveledAbroad = allTeachers.filter(t => t.status === 'travel' && t.country !== 'India').length;
    
    // Update numbers
    totalTeachersEl.textContent = total;
    stayedHomeEl.textContent = stayedHome;
    traveledEl.textContent = traveled;
    traveledIndiaEl.textContent = traveledIndia;
    traveledAbroadEl.textContent = traveledAbroad;
    
    // Update percentages
    homePercentageEl.textContent = total > 0 ? `${Math.round((stayedHome / total) * 100)}%` : '0%';
    travelPercentageEl.textContent = total > 0 ? `${Math.round((traveled / total) * 100)}%` : '0%';
    indiaPercentageEl.textContent = total > 0 ? `${Math.round((traveledIndia / total) * 100)}%` : '0%';
    abroadPercentageEl.textContent = total > 0 ? `${Math.round((traveledAbroad / total) * 100)}%` : '0%';
}

// Update map with markers
function updateMap() {
    if (!map) return;
    
    console.log('Updating map...');
    
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    
    // Add markers for teachers who traveled
    const traveledTeachers = allTeachers.filter(t => t.status === 'travel' && t.latitude && t.longitude);
    console.log('Traveled teachers found:', traveledTeachers.length);
    console.log('Traveled teachers data:', traveledTeachers);
    
    traveledTeachers.forEach(teacher => {
        console.log('Creating marker for teacher:', teacher.name, 'at location:', teacher.latitude, teacher.longitude);
        
        // Choose marker icon based on configuration
        let markerIcon;
        
        if (COMPANY_LOGO_CONFIG.useLogoForMarkers) {
            // Use company logo for markers
            console.log('Creating marker with logo:', COMPANY_LOGO_CONFIG.markerLogoUrl);
            
            // Test if the marker logo loads successfully
            const testImage = new Image();
            testImage.onload = function() {
                console.log('Marker logo loaded successfully');
            };
            testImage.onerror = function() {
                console.error('Marker logo failed to load, using fallback');
            };
            testImage.src = COMPANY_LOGO_CONFIG.markerLogoUrl;
            
            markerIcon = {
                url: COMPANY_LOGO_CONFIG.markerLogoUrl,
                scaledSize: new google.maps.Size(
                    COMPANY_LOGO_CONFIG.markerLogoSize.width, 
                    COMPANY_LOGO_CONFIG.markerLogoSize.height
                ),
                anchor: new google.maps.Point(
                    COMPANY_LOGO_CONFIG.markerLogoSize.width / 2, 
                    COMPANY_LOGO_CONFIG.markerLogoSize.height / 2
                )
            };
            console.log('Marker icon configuration:', markerIcon);
        } else {
            // Use default custom marker
            markerIcon = {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="white" stroke-width="2"/>
                        <circle cx="12" cy="12" r="4" fill="white"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(24, 24),
                anchor: new google.maps.Point(12, 12)
            };
        }
        
        const marker = new google.maps.Marker({
            position: { lat: teacher.latitude, lng: teacher.longitude },
            map: map,
            title: `🏢 ${teacher.name} - ${teacher.location_name}`,
            icon: markerIcon
        });
        
        // Create a custom overlay for the label
        const labelOverlay = new google.maps.OverlayView();
        labelOverlay.onAdd = function() {
            const div = document.createElement('div');
            div.className = 'marker-label';
            div.textContent = teacher.name;
            div.style.position = 'absolute';
            div.style.zIndex = '1000';
            div.style.pointerEvents = 'auto'; // Enable clicks on labels
            div.style.cursor = 'pointer'; // Show pointer cursor
            this.getPanes().overlayImage.appendChild(div);
            this.div_ = div;
            
            // Add click listener to label
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!infoWindowsEnabled) {
                    showLabelPopup(teacher, div);
                }
            });
        };
        
        labelOverlay.draw = function() {
            const projection = this.getProjection();
            const position = projection.fromLatLngToDivPixel(
                new google.maps.LatLng(teacher.latitude, teacher.longitude)
            );
            
            if (position && this.div_) {
                this.div_.style.left = (position.x - this.div_.offsetWidth / 2) + 'px';
                this.div_.style.top = (position.y - this.div_.offsetHeight - 40) + 'px';
            }
        };
        
        labelOverlay.setMap(map);
        
        // Store references
        marker.labelOverlay = labelOverlay;
        
        // Add click listener only if info windows are enabled
        if (infoWindowsEnabled) {
            marker.addListener('click', () => {
                console.log('Marker clicked during creation! Opening info window');
                if (marker.infoWindow) {
                    marker.infoWindow.open(map, marker);
                } else {
                    console.error('No info window found for marker');
                }
            });
        }
        
        markers.push(marker);
    });
    
    // Fit map to markers if there are any
    if (markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        markers.forEach(marker => bounds.extend(marker.getPosition()));
        map.fitBounds(bounds);
    }
    
    // Ensure click listeners are properly set up based on toggle state
    updateMarkerClickListeners();
}

// Show label popup
function showLabelPopup(teacher, labelElement) {
    // Remove any existing popups
    const existingPopup = document.querySelector('.label-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'label-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-header">
                <h4>${teacher.name}</h4>
                <button class="popup-close" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="popup-body">
                <p><i class="fas fa-map-marker-alt"></i> ${teacher.location_name}</p>
                ${teacher.country ? `<p><i class="fas fa-globe"></i> ${teacher.country}</p>` : ''}
            </div>
        </div>
    `;
    
    // Position popup near the label
    const labelRect = labelElement.getBoundingClientRect();
    const mapContainer = document.getElementById('map');
    const mapRect = mapContainer.getBoundingClientRect();
    
    popup.style.position = 'absolute';
    popup.style.left = (labelRect.left - mapRect.left + labelRect.width / 2) + 'px';
    popup.style.top = (labelRect.top - mapRect.top - 10) + 'px';
    popup.style.zIndex = '2000';
    
    // Add to map container
    mapContainer.appendChild(popup);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
        }
    }, 5000);
    
    // Close popup when clicking outside
    document.addEventListener('click', function closePopup(e) {
        if (!popup.contains(e.target) && !labelElement.contains(e.target)) {
            popup.remove();
            document.removeEventListener('click', closePopup);
        }
    });
}

// Apply filters
function applyFilters() {
    const locationFilterValue = locationFilter.value;
    const nameSearchValue = nameSearch.value.toLowerCase();
    const statusFilter = document.querySelector('.filter-btn.active').dataset.filter;
    
    filteredTeachers = allTeachers.filter(teacher => {
        // Location filter
        if (locationFilterValue === 'India' && teacher.country !== 'India') return false;
        if (locationFilterValue === 'Abroad' && teacher.country === 'India') return false;
        
        // Name search
        if (nameSearchValue && !teacher.name.toLowerCase().includes(nameSearchValue)) return false;
        
        // Status filter
        if (statusFilter !== 'all' && teacher.status !== statusFilter) return false;
        
        return true;
    });
    
    currentPage = 1;
    updateTable();
    updateMap();
}

// Update table
function updateTable() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageTeachers = filteredTeachers.slice(startIndex, endIndex);
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add rows
    pageTeachers.forEach(teacher => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 600;">
                        ${teacher.name.charAt(0).toUpperCase()}
                    </div>
                    <span style="font-weight: 500;">${teacher.name}</span>
                </div>
            </td>
            <td><code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${teacher.employee_id}</code></td>
            <td>
                <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; ${teacher.status === 'home' ? 'background: #dcfce7; color: #166534;' : 'background: #dbeafe; color: #1e40af;'}">
                    <i class="fas ${teacher.status === 'home' ? 'fa-home' : 'fa-plane'}" style="font-size: 10px;"></i>
                    ${teacher.status === 'home' ? 'Stayed Home' : 'Traveled'}
                </span>
            </td>
            <td>${teacher.status === 'travel' ? teacher.location_name : '-'}</td>
            <td>
                ${teacher.status === 'travel' ? `
                    <span style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 6px; border-radius: 8px; font-size: 11px; font-weight: 500; ${teacher.country === 'India' ? 'background: #fef3c7; color: #92400e;' : 'background: #fce7f3; color: #be185d;'}">
                        <i class="fas ${teacher.country === 'India' ? 'fa-flag' : 'fa-globe'}" style="font-size: 10px;"></i>
                        ${teacher.country}
                    </span>
                ` : '-'}
            </td>
            <td>
                ${teacher.status === 'travel' ? `
                    <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-family: 'Monaco', 'Menlo', monospace;">
                        ${teacher.latitude?.toFixed(4)}, ${teacher.longitude?.toFixed(4)}
                    </code>
                ` : '-'}
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Update pagination
    updatePagination();
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
    
    // Update info
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredTeachers.length);
    tableInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredTeachers.length} entries`;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    // Update buttons
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// Navigation functions
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        updateTable();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateTable();
    }
}

// Fit map to markers
function fitMapToMarkers() {
    if (markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        markers.forEach(marker => bounds.extend(marker.getPosition()));
        map.fitBounds(bounds);
    }
}

// Clear filters
function clearFilters() {
    locationFilter.value = '';
    nameSearch.value = '';
    filterButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-filter="all"]').classList.add('active');
    applyFilters();
}

// Refresh data
function refreshData() {
    loadDashboardData();
}

// Export to CSV
function exportToCSV() {
    const headers = ['Name', 'Employee ID', 'Status', 'Location', 'Country', 'Latitude', 'Longitude', 'Created At'];
    const csvContent = [
        headers.join(','),
        ...filteredTeachers.map(teacher => [
            `"${teacher.name}"`,
            teacher.employee_id,
            teacher.status,
            teacher.status === 'travel' ? `"${teacher.location_name}"` : '',
            teacher.status === 'travel' ? `"${teacher.country}"` : '',
            teacher.latitude || '',
            teacher.longitude || '',
            new Date(teacher.created_at).toLocaleDateString()
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `teacher_holidays_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Show loading overlay
function showLoading(show) {
    loadingOverlay.style.display = show ? 'block' : 'none';
}

// Show error message
function showError(message) {
    // You can implement a toast notification or modal here
    console.error(message);
    alert(message);
}

// Toggle info windows on/off
function toggleInfoWindows() {
    console.log('Toggle function called! Current state:', infoWindowsEnabled);
    
    infoWindowsEnabled = !infoWindowsEnabled;
    
    // Update button text and icon
    const toggleBtn = document.getElementById('infoWindowToggle');
    const toggleText = document.getElementById('infoWindowToggleText');
    const toggleIcon = toggleBtn.querySelector('i');
    
    console.log('Toggle button found:', toggleBtn);
    console.log('Toggle text found:', toggleText);
    console.log('Toggle icon found:', toggleIcon);
    
    if (infoWindowsEnabled) {
        toggleText.textContent = 'Info Windows: ON';
        toggleIcon.className = 'fas fa-info-circle';
        toggleBtn.style.background = '#10b981'; // Green color
        toggleBtn.style.borderColor = '#059669';
        toggleBtn.style.color = 'white';
        console.log('Info windows enabled');
        
        // Hide labels when info windows are ON
        markers.forEach(marker => {
            if (marker.labelOverlay && marker.labelOverlay.div_) {
                marker.labelOverlay.div_.style.display = 'none';
            }
        });
    } else {
        toggleText.textContent = 'Info Windows: OFF';
        toggleIcon.className = 'fas fa-times-circle';
        toggleBtn.style.background = '#ef4444'; // Red color
        toggleBtn.style.borderColor = '#dc2626';
        toggleBtn.style.color = 'white';
        console.log('Info windows disabled');
        
        // Show labels when info windows are OFF
        markers.forEach(marker => {
            if (marker.labelOverlay && marker.labelOverlay.div_) {
                marker.labelOverlay.div_.style.display = 'block';
            }
        });
    }
    
    // Close any open info windows
    markers.forEach(marker => {
        if (marker.infoWindow) {
            marker.infoWindow.close();
        }
    });
    
    // Remove any existing label popups
    const existingPopups = document.querySelectorAll('.label-popup');
    existingPopups.forEach(popup => popup.remove());
    
    // Update marker click listeners
    updateMarkerClickListeners();
    console.log('Toggle completed. New state:', infoWindowsEnabled);
}

// Update marker click listeners based on toggle state
function updateMarkerClickListeners() {
    console.log('Updating marker click listeners. Info windows enabled:', infoWindowsEnabled);
    console.log('Number of markers:', markers.length);
    
    markers.forEach((marker, index) => {
        // Remove existing click listeners
        google.maps.event.clearListeners(marker, 'click');
        
        // Add new click listener based on toggle state
        if (infoWindowsEnabled) {
            marker.addListener('click', () => {
                console.log('Marker clicked! Opening info window for marker', index);
                if (marker.infoWindow) {
                    marker.infoWindow.open(map, marker);
                } else {
                    console.error('No info window found for marker', index);
                }
            });
            console.log('Added click listener to marker', index);
        } else {
            console.log('No click listener added to marker', index, '(info windows disabled)');
        }
    });
}

// Auto-refresh data every 30 seconds
setInterval(() => {
    if (!loadingOverlay.style.display || loadingOverlay.style.display === 'none') {
        loadDashboardData();
    }
}, 30000);

// Initialize toggle button state on page load
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('infoWindowToggle');
    const toggleText = document.getElementById('infoWindowToggleText');
    const toggleIcon = toggleBtn.querySelector('i');
    
    if (infoWindowsEnabled) {
        toggleText.textContent = 'Info Windows: ON';
        toggleIcon.className = 'fas fa-info-circle';
        toggleBtn.style.background = '#10b981';
        toggleBtn.style.borderColor = '#059669';
        toggleBtn.style.color = 'white';
    } else {
        toggleText.textContent = 'Info Windows: OFF';
        toggleIcon.className = 'fas fa-times-circle';
        toggleBtn.style.background = '#ef4444';
        toggleBtn.style.borderColor = '#dc2626';
        toggleBtn.style.color = 'white';
    }
}); 