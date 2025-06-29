// Supabase Configuration
const SUPABASE_URL = 'https://lrdknobiooudavkcdjmn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyZGtub2Jpb291ZGF2a2Nkam1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNTk0NjIsImV4cCI6MjA2NjczNTQ2Mn0.iRRvw1cJLBfa3tadXbsXw0PDDuODrj3wyq5jQHOe3_s';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global variables
let autocomplete;
let selectedPlace = null;
let currentStatus = 'home';
let currentStep = 1;
const totalSteps = 3;

// DOM Elements
const form = document.getElementById('holidayForm');
const progressSteps = document.querySelectorAll('.progress-step');
const formSteps = document.querySelectorAll('.form-step');
const nameInput = document.getElementById('name');
const employeeIdInput = document.getElementById('employeeId');
const locationInput = document.getElementById('location');
const statusOptions = document.querySelectorAll('.status-option');
const nextButtons = document.querySelectorAll('.btn-next');
const prevButtons = document.querySelectorAll('.btn-prev');
const submitButton = document.querySelector('.btn-submit');
const successModal = document.getElementById('successModal');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');
const loadingOverlay = document.getElementById('loadingOverlay');
const locationPreview = document.getElementById('locationPreview');
const previewLocation = document.getElementById('previewLocation');
const previewCoordinates = document.getElementById('previewCoordinates');

// Validation elements
const nameMessage = document.getElementById('nameMessage');
const employeeIdMessage = document.getElementById('employeeIdMessage');
const locationMessage = document.getElementById('locationMessage');

// Success modal elements
const successName = document.getElementById('successName');
const successEmployeeId = document.getElementById('successEmployeeId');
const successLocation = document.getElementById('successLocation');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeGoogleMaps();
    setupEventListeners();
    updateProgressIndicator();
});

// Initialize Google Maps Autocomplete
function initializeGoogleMaps() {
    if (typeof google !== 'undefined' && google.maps) {
        autocomplete = new google.maps.places.Autocomplete(locationInput, {
            types: ['geocode'],
            componentRestrictions: { country: [] } // Allow worldwide locations
        });

        autocomplete.addListener('place_changed', function() {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                selectedPlace = {
                    name: place.formatted_address,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };
                showLocationPreview(selectedPlace);
                validateLocation();
                updateButtonStates();
                console.log('Selected place:', selectedPlace);
            }
        });
    } else {
        console.error('Google Maps API not loaded');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Input validation listeners
    nameInput.addEventListener('input', function() {
        validateName();
        updateButtonStates();
    });
    nameInput.addEventListener('blur', function() {
        validateName();
        updateButtonStates();
    });
    
    employeeIdInput.addEventListener('input', function() {
        validateEmployeeId();
        updateButtonStates();
    });
    employeeIdInput.addEventListener('blur', function() {
        validateEmployeeId();
        updateButtonStates();
    });
    
    locationInput.addEventListener('input', function() {
        // Clear selectedPlace when user starts typing
        if (this.value.trim() === '') {
            selectedPlace = null;
            locationPreview.style.display = 'none';
        }
        validateLocation();
        updateButtonStates();
    });
    locationInput.addEventListener('blur', function() {
        validateLocation();
        updateButtonStates();
    });
    
    // Status option selection
    statusOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectStatusOption(this);
        });
    });
    
    // Navigation buttons
    nextButtons.forEach(btn => {
        btn.addEventListener('click', nextStep);
    });
    
    prevButtons.forEach(btn => {
        btn.addEventListener('click', prevStep);
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmission);
}

// Validation functions
function validateName() {
    const name = nameInput.value.trim();
    const namePattern = /^[A-Za-z\s]{2,50}$/;
    
    if (!name) {
        showFieldMessage(nameMessage, 'Please enter your full name', 'error');
        nameInput.classList.remove('valid', 'invalid');
        return false;
    }
    
    if (!namePattern.test(name)) {
        showFieldMessage(nameMessage, 'Please enter a valid name (2-50 characters, letters only)', 'error');
        nameInput.classList.add('invalid');
        nameInput.classList.remove('valid');
        return false;
    }
    
    showFieldMessage(nameMessage, '✓ Name looks good!', 'success');
    nameInput.classList.add('valid');
    nameInput.classList.remove('invalid');
    return true;
}

function validateEmployeeId() {
    const employeeId = employeeIdInput.value.trim();
    const employeeIdPattern = /^[0-9]{8}$/;
    
    if (!employeeId) {
        showFieldMessage(employeeIdMessage, 'Please enter your employee ID', 'error');
        employeeIdInput.classList.remove('valid', 'invalid');
        return false;
    }
    
    if (!employeeIdPattern.test(employeeId)) {
        showFieldMessage(employeeIdMessage, 'Employee ID must be exactly 8 digits', 'error');
        employeeIdInput.classList.add('invalid');
        employeeIdInput.classList.remove('valid');
        return false;
    }
    
    showFieldMessage(employeeIdMessage, '✓ Employee ID format is correct', 'success');
    employeeIdInput.classList.add('valid');
    employeeIdInput.classList.remove('invalid');
    return true;
}

function validateLocation() {
    if (currentStatus !== 'travel') {
        showFieldMessage(locationMessage, '', '');
        return true;
    }
    
    if (!selectedPlace) {
        showFieldMessage(locationMessage, 'Please select a location from the suggestions', 'error');
        return false;
    }
    
    showFieldMessage(locationMessage, '✓ Location selected successfully', 'success');
    return true;
}

function showFieldMessage(element, message, type) {
    element.textContent = message;
    element.className = `field-message ${type}`;
}

// Status option selection
function selectStatusOption(selectedOption) {
    statusOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    selectedOption.classList.add('selected');
    currentStatus = selectedOption.dataset.status;
    
    // Show/hide travel fields based on selection
    const travelFields = document.getElementById('travelFields');
    if (currentStatus === 'travel') {
        travelFields.style.display = 'block';
        locationInput.required = true;
    } else {
        travelFields.style.display = 'none';
        locationInput.required = false;
        selectedPlace = null;
        locationInput.value = '';
        locationPreview.style.display = 'none';
    }
    
    updateButtonStates();
}

// Show location preview
function showLocationPreview(place) {
    previewLocation.textContent = place.name;
    previewCoordinates.textContent = `${place.lat.toFixed(6)}, ${place.lng.toFixed(6)}`;
    locationPreview.style.display = 'block';
    updateButtonStates();
}

// Step navigation
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateFormDisplay();
            updateProgressIndicator();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateFormDisplay();
        updateProgressIndicator();
    }
}

function updateFormDisplay() {
    formSteps.forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    updateButtonStates();
}

function updateProgressIndicator() {
    progressSteps.forEach((step, index) => {
        const stepNumber = index + 1;
        
        if (stepNumber < currentStep) {
            step.classList.remove('active');
            step.classList.add('completed');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
    
    // Update progress fill
    const progressFills = document.querySelectorAll('.progress-fill');
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    
    progressFills.forEach(fill => {
        fill.style.width = `${progressPercentage}%`;
    });
}

function validateCurrentStep() {
    let isValid = false;
    
    switch (currentStep) {
        case 1:
            isValid = validateName() && validateEmployeeId();
            break;
        case 2:
            isValid = currentStatus === 'home' || currentStatus === 'travel';
            break;
        case 3:
            if (currentStatus === 'travel') {
                isValid = validateLocation();
            } else {
                isValid = true;
            }
            break;
    }
    
    return isValid;
}

function updateButtonStates() {
    const isValid = validateCurrentStep();
    
    // Update button states - find buttons within the current active step
    const activeStep = document.querySelector('.form-step.active');
    const currentNextButton = activeStep.querySelector('.btn-next');
    const currentSubmitButton = activeStep.querySelector('.btn-submit');
    
    if (currentNextButton) {
        currentNextButton.disabled = !isValid;
    }
    
    if (currentSubmitButton) {
        currentSubmitButton.disabled = !isValid;
    }
}

// Handle form submission
async function handleFormSubmission(e) {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
        showError('Please complete all required fields correctly.');
        return;
    }
    
    const formData = new FormData(form);
    const name = formData.get('name').trim();
    const employeeId = formData.get('employeeId').trim();
    
    try {
        showLoading(true);
        
        // Check if employee ID already exists
        const { data: existingEntry, error: checkError } = await supabaseClient
            .from('teacher_holidays')
            .select('employee_id')
            .eq('employee_id', employeeId)
            .single();
        
        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }
        
        if (existingEntry) {
            showError('You have already submitted your holiday location.');
            return;
        }
        
        // Get country if traveling
        let country = null;
        if (currentStatus === 'travel' && selectedPlace) {
            console.log('Getting country for travel location:', selectedPlace);
            country = await getCountryFromCoordinates(selectedPlace.lat, selectedPlace.lng);
            console.log('Retrieved country:', country);
        }
        
        // Prepare data for insertion
        const holidayData = {
            name: name,
            employee_id: employeeId,
            status: currentStatus,
            location_name: currentStatus === 'travel' ? selectedPlace.name : null,
            latitude: currentStatus === 'travel' ? selectedPlace.lat : null,
            longitude: currentStatus === 'travel' ? selectedPlace.lng : null,
            country: country
        };
        
        console.log('Data to be inserted:', holidayData);
        
        // Insert data into Supabase
        const { data, error } = await supabaseClient
            .from('teacher_holidays')
            .insert([holidayData]);
        
        if (error) {
            throw error;
        }
        
        // Show success message with details including country
        showSuccessWithDetails(name, employeeId, currentStatus === 'travel' ? selectedPlace.name : 'Stayed at Home', country);
        
    } catch (error) {
        console.error('Submission error:', error);
        showError('An error occurred while submitting your data. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Get country from coordinates using reverse geocoding
async function getCountryFromCoordinates(lat, lng) {
    try {
        console.log('Fetching country for coordinates:', lat, lng);
        
        // Try using a free geocoding service as fallback
        const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Geocoding API response:', data);
        
        if (data.countryName) {
            console.log('Found country:', data.countryName);
            return data.countryName;
        } else {
            console.log('No country found in response');
            return null;
        }
        
    } catch (error) {
        console.error('Error getting country:', error);
        
        // Fallback: Try to extract country from location name if available
        if (selectedPlace && selectedPlace.name) {
            const locationName = selectedPlace.name.toLowerCase();
            
            // Common country patterns in location names
            const countryPatterns = {
                'united states': 'United States',
                'usa': 'United States',
                'us': 'United States',
                'united kingdom': 'United Kingdom',
                'uk': 'United Kingdom',
                'france': 'France',
                'germany': 'Germany',
                'italy': 'Italy',
                'spain': 'Spain',
                'japan': 'Japan',
                'china': 'China',
                'india': 'India',
                'australia': 'Australia',
                'canada': 'Canada',
                'brazil': 'Brazil',
                'mexico': 'Mexico',
                'russia': 'Russia',
                'south korea': 'South Korea',
                'singapore': 'Singapore',
                'thailand': 'Thailand',
                'malaysia': 'Malaysia',
                'indonesia': 'Indonesia',
                'philippines': 'Philippines',
                'vietnam': 'Vietnam',
                'turkey': 'Turkey',
                'egypt': 'Egypt',
                'south africa': 'South Africa',
                'nigeria': 'Nigeria',
                'kenya': 'Kenya',
                'morocco': 'Morocco',
                'tunisia': 'Tunisia',
                'algeria': 'Algeria',
                'ethiopia': 'Ethiopia',
                'uganda': 'Uganda',
                'tanzania': 'Tanzania',
                'ghana': 'Ghana',
                'ivory coast': 'Ivory Coast',
                'senegal': 'Senegal',
                'mali': 'Mali',
                'burkina faso': 'Burkina Faso',
                'niger': 'Niger',
                'chad': 'Chad',
                'sudan': 'Sudan',
                'somalia': 'Somalia',
                'djibouti': 'Djibouti',
                'eritrea': 'Eritrea',
                'libya': 'Libya',
                'mauritania': 'Mauritania',
                'western sahara': 'Western Sahara',
                'angola': 'Angola',
                'congo': 'Congo',
                'democratic republic of the congo': 'Democratic Republic of the Congo',
                'central african republic': 'Central African Republic',
                'cameroon': 'Cameroon',
                'gabon': 'Gabon',
                'equatorial guinea': 'Equatorial Guinea',
                'sao tome and principe': 'Sao Tome and Principe',
                'namibia': 'Namibia',
                'botswana': 'Botswana',
                'zimbabwe': 'Zimbabwe',
                'zambia': 'Zambia',
                'malawi': 'Malawi',
                'mozambique': 'Mozambique',
                'madagascar': 'Madagascar',
                'comoros': 'Comoros',
                'seychelles': 'Seychelles',
                'mauritius': 'Mauritius',
                'reunion': 'Reunion',
                'mayotte': 'Mayotte',
                'lesotho': 'Lesotho',
                'eswatini': 'Eswatini'
            };
            
            for (const [pattern, country] of Object.entries(countryPatterns)) {
                if (locationName.includes(pattern)) {
                    console.log('Found country from location name pattern:', country);
                    return country;
                }
            }
        }
        
        return null;
    }
}

// Show loading overlay
function showLoading(show) {
    loadingOverlay.style.display = show ? 'block' : 'none';
}

// Show success modal with details
function showSuccessWithDetails(name, employeeId, location, country) {
    successName.textContent = name;
    successEmployeeId.textContent = employeeId;
    successLocation.textContent = location;
    
    // Show country if available
    const successCountryItem = document.getElementById('successCountryItem');
    const successCountry = document.getElementById('successCountry');
    
    if (country) {
        successCountry.textContent = country;
        successCountryItem.style.display = 'flex';
    } else {
        successCountryItem.style.display = 'none';
    }
    
    successModal.style.display = 'block';
    
    // Reset form after showing success modal
    setTimeout(() => {
        resetForm();
    }, 100);
}

// Reset form to initial state
function resetForm() {
    // Reset form inputs
    nameInput.value = '';
    employeeIdInput.value = '';
    locationInput.value = '';
    
    // Reset validation states
    nameInput.classList.remove('valid', 'invalid');
    employeeIdInput.classList.remove('valid', 'invalid');
    locationInput.classList.remove('valid', 'invalid');
    
    // Clear validation messages
    showFieldMessage(nameMessage, '', '');
    showFieldMessage(employeeIdMessage, '', '');
    showFieldMessage(locationMessage, '', '');
    
    // Reset status selection
    statusOptions.forEach(option => {
        option.classList.remove('selected');
    });
    currentStatus = 'home';
    
    // Hide travel fields
    const travelFields = document.getElementById('travelFields');
    if (travelFields) {
        travelFields.style.display = 'none';
    }
    
    // Hide location preview
    if (locationPreview) {
        locationPreview.style.display = 'none';
    }
    
    // Reset selected place
    selectedPlace = null;
    
    // Reset success modal country display
    const successCountryItem = document.getElementById('successCountryItem');
    if (successCountryItem) {
        successCountryItem.style.display = 'none';
    }
    
    // Reset to step 1
    currentStep = 1;
    updateFormDisplay();
    updateProgressIndicator();
    updateButtonStates();
}

// Show success modal
function showSuccess() {
    successModal.style.display = 'block';
}

// Show error modal
function showError(message) {
    errorMessage.textContent = message;
    errorModal.style.display = 'block';
}

// Close modal
function closeModal() {
    successModal.style.display = 'none';
    errorModal.style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === successModal) {
        successModal.style.display = 'none';
    }
    if (event.target === errorModal) {
        errorModal.style.display = 'none';
    }
});

// Prevent form submission on Enter key in location input
locationInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});

// Auto-format employee ID input (numbers only)
employeeIdInput.addEventListener('input', function(e) {
    // Remove any non-numeric characters
    this.value = this.value.replace(/[^0-9]/g, '');
    
    // Limit to 8 digits
    if (this.value.length > 8) {
        this.value = this.value.slice(0, 8);
    }
});

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
    
    if (e.key === 'Enter' && e.ctrlKey) {
        const activeStep = document.querySelector('.form-step.active');
        const submitBtn = activeStep.querySelector('.btn-submit');
        const nextBtn = activeStep.querySelector('.btn-next');
        
        if (submitBtn && !submitBtn.disabled) {
            submitBtn.click();
        } else if (nextBtn && !nextBtn.disabled) {
            nextBtn.click();
        }
    }
}); 