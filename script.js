const WELCOME_BONUS = 80000;
const POINT_VALUE = 0.022;
const ANNUAL_FEE = 695;
const MINIMUM_POINTS_FOR_SUGGESTION = 15000;


document.addEventListener('DOMContentLoaded', function() {
    const travelFrequencyGroup = document.getElementById('travelFrequency').closest('.question-group');
    console.log('travelFrequencyGroup:', travelFrequencyGroup);
    
    // Create title container
    const titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';
    
    // Move the existing label into the title container
    const existingLabel = travelFrequencyGroup.querySelector('label');
    titleContainer.appendChild(existingLabel);
    
    // Add the disclaimer text (add this part)
    const disclaimer = document.createElement('span');
    disclaimer.className = 'disclaimer';
    disclaimer.textContent = 'Count each round-trip as one trip (e.g., NYC to LA and back = one trip).';
    titleContainer.appendChild(disclaimer);
    
    // Insert the title container at the start of the question group
    travelFrequencyGroup.insertBefore(titleContainer, travelFrequencyGroup.firstChild);

    function getTravelFrequency() {
        const travelSelect = document.getElementById('travelFrequency');
        const customInput = document.getElementById('customTravelInput');
        
        if (travelSelect.value === 'custom') {
            return parseInt(customInput.value) || 0;
        }
        return parseInt(travelSelect.value) || 0;
    }

    document.getElementById('travelFrequency').addEventListener('change', function() {
        const customTravelFrequency = document.getElementById('customTravelFrequency');
        const customTravelInput = customTravelFrequency.querySelector('input');
        
        if (this.value === 'custom') {
            customTravelFrequency.classList.remove('hidden');
            customTravelInput.required = true;
            customTravelInput.focus();
        } else {
            customTravelFrequency.classList.add('hidden');
            customTravelInput.required = false;
            // Force update spending values regardless of their current state
            const flightSpend = document.getElementById('flightSpend');
            const hotelSpend = document.getElementById('hotelSpend');
            flightSpend.value = '';  // Clear current value
            hotelSpend.value = '';   // Clear current value
            updateSpendingBasedOnTravel(); // This will now always update
            updateAllExplanationTexts();
        }
    });
    
    document.getElementById('customTravelInput').addEventListener('input', function() {
        this.value = this.value.replace(/[^\d]/g, '');
        updateSpendingBasedOnTravel();
        updateAllExplanationTexts();
    });

   function updateSpendingBasedOnTravel() {
    const travelSelect = document.getElementById('travelFrequency');
    const customInput = document.getElementById('customTravelInput');
    let travelFrequency;
    
    if (travelSelect.value === 'custom') {
        travelFrequency = parseInt(customInput.value) || 0;
    } else {
        travelFrequency = parseInt(travelSelect.value) || 0;
    }

    const flightSpend = document.getElementById('flightSpend');
    const hotelSpend = document.getElementById('hotelSpend');

    // Always clear existing values to force update
    flightSpend.value = '';
    hotelSpend.value = '';

    let spendValue;
    if (travelFrequency <= 3) {
        spendValue = "375";  // Occasionally (1-3 trips/year)
    } else if (travelFrequency <= 6) {
        spendValue = "750";  // Regularly (4-6 trips/year)
    } else if (travelFrequency >= 7) {
        spendValue = "1500";  // Frequently (7+ trips/year)
    }

    // Always set the values, don't check if they're empty
    flightSpend.value = spendValue;
    hotelSpend.value = spendValue;
}
    // Add event listeners for travel frequency
    document.getElementById('travelFrequency').addEventListener('change', updateSpendingBasedOnTravel);
    document.getElementById('travelFrequency').addEventListener('blur', updateSpendingBasedOnTravel);

    // Flight spend handler
    document.getElementById('flightSpend').addEventListener('change', function() {
        const customFlightSpend = document.getElementById('customFlightSpend');
        const customFlightInput = customFlightSpend.querySelector('input');
        
        if (this.value === 'custom') {
            customFlightSpend.classList.remove('hidden');
            customFlightInput.required = true;
            customFlightInput.focus();
        } else {
            customFlightSpend.classList.add('hidden');
            customFlightInput.required = false;
        }
    });

    // Add currency formatting for flight custom input
    document.getElementById('customFlightInput').addEventListener('blur', function() {
        let value = this.value.replace(/[^\d]/g, '');
        if (value) {
            value = parseInt(value, 10);
            this.value = '$' + value.toLocaleString('en-US');
        } else {
            this.value = '$0';
        }
    });

    // Add input validation for flight custom input
    document.getElementById('customFlightInput').addEventListener('input', function() {
        this.value = this.value.replace(/[^\d]/g, '');
    });

    // Hotel spend handler
    document.getElementById('hotelSpend').addEventListener('change', function() {
        const customHotelSpend = document.getElementById('customHotelSpend');
        const customHotelInput = customHotelSpend.querySelector('input');
        
        if (this.value === 'custom') {
            customHotelSpend.classList.remove('hidden');
            customHotelInput.required = true;
            customHotelInput.focus();
        } else {
            customHotelSpend.classList.add('hidden');
            customHotelInput.required = false;
        }
    });

    // Add currency formatting for hotel custom input
    document.getElementById('customHotelInput').addEventListener('blur', function() {
        let value = this.value.replace(/[^\d]/g, '');
        if (value) {
            value = parseInt(value, 10);
            this.value = '$' + value.toLocaleString('en-US');
        } else {
            this.value = '$0';
        }
    });

    // Add input validation for hotel custom input
    document.getElementById('customHotelInput').addEventListener('input', function() {
        this.value = this.value.replace(/[^\d]/g, '');
    });

    // Other spend handler
    document.getElementById('otherSpend').addEventListener('change', function() {
        const customOtherSpend = document.getElementById('customOtherSpend');
        const customOtherInput = customOtherSpend.querySelector('input');
        
        if (this.value === 'custom') {
            customOtherSpend.classList.remove('hidden');
            customOtherInput.required = true;
            customOtherInput.focus();
        } else {
            customOtherSpend.classList.add('hidden');
            customOtherInput.required = false;
        }
    });

    // Add currency formatting for other custom input
    document.getElementById('customOtherInput').addEventListener('blur', function() {
        let value = this.value.replace(/[^\d]/g, '');
        if (value) {
            value = parseInt(value, 10);
            this.value = '$' + value.toLocaleString('en-US');
        } else {
            this.value = '$0';
        }
    });

    // Add input validation for other custom input
    document.getElementById('customOtherInput').addEventListener('input', function() {
        this.value = this.value.replace(/[^\d]/g, '');
    });
});

// Points Calculation for Section 1
function calculatePoints() {
    try {
        let flightSpend, hotelSpend, otherSpend;

        // Handle flight spend - check if custom
        if (document.getElementById('flightSpend').value === 'custom') {
            flightSpend = parseFloat(document.getElementById('customFlightInput').value.replace(/[^0-9.-]+/g, '')) || 0;
            console.log('Custom flight spend:', flightSpend);
        } else {
            flightSpend = parseFloat(document.getElementById('flightSpend').value.replace(/[^0-9.-]+/g, '')) || 0;
            console.log('Standard flight spend:', flightSpend);
        }

        // Handle hotel spend - check if custom
        if (document.getElementById('hotelSpend').value === 'custom') {
            hotelSpend = parseFloat(document.getElementById('customHotelInput').value.replace(/[^0-9.-]+/g, '')) || 0;
            console.log('Custom hotel spend:', hotelSpend);
        } else {
            hotelSpend = parseFloat(document.getElementById('hotelSpend').value.replace(/[^0-9.-]+/g, '')) || 0;
            console.log('Standard hotel spend:', hotelSpend);
        }

        // Handle other spend - check if custom
        if (document.getElementById('otherSpend').value === 'custom') {
            otherSpend = parseFloat(document.getElementById('customOtherInput').value.replace(/[^0-9.-]+/g, '')) || 0;
            console.log('Custom other spend:', otherSpend);
        } else {
            otherSpend = parseFloat(document.getElementById('otherSpend').value.replace(/[^0-9.-]+/g, '')) || 0;
            console.log('Standard other spend:', otherSpend);
        }

        // Multiply all values by 12 for annual spend
        flightSpend *= 12;
        hotelSpend *= 12;
        otherSpend *= 12;

        console.log('Annual values:', {
            flightSpend,
            hotelSpend,
            otherSpend
        });

        console.log('Parsed values:', { flightSpend, hotelSpend, otherSpend });

        // Cap flight spend at $500,000
        const cappedFlightSpend = Math.min(flightSpend, 500000);
        const uncappedFlightSpend = Math.max(0, flightSpend - 500000);

        // Calculate points: 5x on capped flight spend, 1x on uncapped amount
        const travelPoints = (cappedFlightSpend + hotelSpend) * 5;
        const otherPoints = otherSpend + uncappedFlightSpend;
        const totalPoints = travelPoints + otherPoints;
        const totalValuation = (WELCOME_BONUS + totalPoints) * POINT_VALUE;

        // Debug logging
        console.log('Calculation values:', {
            flightSpend,
            hotelSpend,
            otherSpend,
            cappedFlightSpend,
            uncappedFlightSpend,
            travelPoints,
            otherPoints,
            totalPoints,
            totalValuation
        });

        // Verify all required elements exist
        const elements = {
            totalPointsValue: document.getElementById('totalPointsValue'),
            welcomeBonusValue: document.getElementById('welcomeBonusValue'),
            valuationValue: document.getElementById('valuationValue'),
            results: document.getElementById('results')
        };

        // Check if any elements are missing
        const missingElements = Object.entries(elements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);

        if (missingElements.length > 0) {
            throw new Error(`Missing required elements: ${missingElements.join(', ')}`);
        }

        // Update values
        elements.totalPointsValue.textContent = Math.round(totalPoints).toLocaleString() + ' points';
        elements.welcomeBonusValue.textContent = WELCOME_BONUS.toLocaleString() + ' points';
        elements.valuationValue.textContent = '$' + Math.round(totalValuation).toLocaleString();

        // Get complementary suggestions
        const suggestions = getComplementarySuggestions(totalPoints);
        
        // Update Total Points Earned suggestion
        const earnedPointsContainer = document.getElementById('totalPointsValue').parentElement.querySelector('.points-suggestion');
        if (suggestions.earnedSuggestion && totalPoints >= MINIMUM_POINTS_FOR_SUGGESTION) {
            if (earnedPointsContainer) {
                earnedPointsContainer.textContent = suggestions.earnedSuggestion;
            }
        }

        // Update Welcome Bonus suggestion
        const welcomeBonusContainer = document.querySelector('.welcome-bonus .points-suggestion');
        if (!welcomeBonusContainer) {
            console.warn('Welcome bonus container not found');
        } else {
            welcomeBonusContainer.textContent = suggestions.welcomeSuggestion;
        }

        // Show results
        elements.results.classList.remove('hidden');
        console.log('Results displayed successfully');

        return {
            totalPoints,
            totalValuation
        };

    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            stack: error.stack,
            values: {
                flightSpend: document.getElementById('flightSpend')?.value,
                hotelSpend: document.getElementById('hotelSpend')?.value,
                otherSpend: document.getElementById('otherSpend')?.value
            }
        });
        alert('There was an error calculating your points. Please try again.');
        throw error;
    }
}
    
const earnedPointSuggestions = [
    {
        min: 15000,
        max: 20000,
        suggestions: [
            { text: "That's enough for a one-way domestic flight!", category: "FLIGHTS" },
            { text: "That's enough for a luxury hotel night through Fine Hotels & Resorts!", category: "HOTELS" },
            { text: "That's enough for multiple premium dining experiences through Resy!", category: "EXPERIENCES" }
        ]
    },
    {
        min: 20001,
        max: 40000,
        suggestions: [
            { text: "That's enough for a domestic round-trip flight!", category: "FLIGHTS" },
            { text: "That's enough for two nights at a 5-star hotel!", category: "HOTELS" },
            { text: "That's enough for multiple spa treatments at luxury resorts!", category: "EXPERIENCES" }
        ]
    },
    {
        min: 40001,
        max: 60000,
        suggestions: [
            { text: "That's enough for a round-trip flight to Hawaii!", category: "FLIGHTS" },
            { text: "That's enough for three nights at a beachfront resort!", category: "HOTELS" },
            { text: "That's enough for a weekend of luxury experiences!", category: "EXPERIENCES" }
        ]
    },
    {
        min: 60001,
        max: 80000,
        suggestions: [
            { text: "That's enough for a business class one-way to Europe!", category: "FLIGHTS" },
            { text: "That's enough for four nights at a luxury hotel!", category: "HOTELS" },
            { text: "That's enough for multiple domestic weekend getaways!", category: "EXPERIENCES" }
        ]
    },
    {
        min: 80001,
        max: 120000,
        suggestions: [
            { text: "That's enough for a round-trip business class flight to Europe!", category: "FLIGHTS" },
            { text: "That's enough for a 5-night stay at a luxury resort!", category: "HOTELS" },
            { text: "That's enough for multiple romantic getaways!", category: "EXPERIENCES" }
        ]
    },
    {
        min: 120001,
        max: 200000,
        suggestions: [
            { text: "That's enough for a round-trip first class flight to Europe!", category: "FLIGHTS" },
            { text: "That's enough for a week at top hotels in multiple cities!", category: "HOTELS" },
            { text: "That's enough for multiple luxury vacations!", category: "EXPERIENCES" }
        ]
    },
    {
        min: 200001,
        max: 400000,
        suggestions: [
            { text: "That's enough for a round-trip first class flight to Asia!", category: "FLIGHTS" },
            { text: "That's enough for 10 nights at luxury hotels!", category: "HOTELS" },
            { text: "That's enough for multiple premium vacation packages!", category: "EXPERIENCES" }
        ]
    },
    {
        min: 400001,
        max: 600000,
        suggestions: [
            { text: "That's enough for two round-trip first class flights to Europe!", category: "FLIGHTS" },
            { text: "That's enough for two weeks at Fine Hotels & Resorts properties!", category: "HOTELS" },
            { text: "That's enough for several luxury vacation packages!", category: "EXPERIENCES" }
        ]
    },
    {
        min: 600001,
        max: 1000000,
        suggestions: [
            { text: "That's enough for two round-trip first class flights to Asia!", category: "FLIGHTS" },
            { text: "That's enough for a month of luxury hotel stays!", category: "HOTELS" },
            { text: "That's enough for multiple ultra-luxury vacation packages!", category: "EXPERIENCES" }
        ]
    },
    {
        min: 1000001,
        max: Infinity,
        suggestions: [
            { text: "That's enough for a family of four to fly first class to Europe!", category: "FLIGHTS" },
            { text: "That's enough for extended stays in the world's finest suites!", category: "HOTELS" },
            { text: "That's enough for a year of luxury travel experiences!", category: "EXPERIENCES" }
        ]
    }
];

const welcomeBonusSuggestions = [
    { text: "That's enough for 2 round-trip flights from the US to the Caribbean!", category: "FLIGHTS" },
    { text: "That's enough for a round-trip flight to Europe!", category: "FLIGHTS" },
    { text: "That's enough for multiple domestic round-trip flights!", category: "FLIGHTS" },
    
    { text: "That's enough for 4 nights at a luxury resort through Fine Hotels & Resorts!", category: "HOTELS" },
    { text: "That's enough for a week of 5-star hotel stays!", category: "HOTELS" },
    { text: "That's enough for multiple weekend escapes at luxury hotels!", category: "HOTELS" },
    
    { text: "That's enough for multiple luxury weekend adventures!", category: "EXPERIENCES" },
    { text: "That's enough for a year of premium dining and entertainment!", category: "EXPERIENCES" },
    { text: "That's enough for several VIP travel experiences!", category: "EXPERIENCES" }
];

function getComplementarySuggestions(points) {
    if (points < MINIMUM_POINTS_FOR_SUGGESTION) {
        return {
            earnedSuggestion: "",
            welcomeSuggestion: welcomeBonusSuggestions[
                Math.floor(Math.random() * welcomeBonusSuggestions.length)
            ].text
        };
    }

    let earnedOptions = [];
    for (let range of earnedPointSuggestions) {
        if (points >= range.min && points <= range.max) {
            earnedOptions = range.suggestions;
            break;
        }
    }
    
    const earnedSuggestion = earnedOptions[Math.floor(Math.random() * earnedOptions.length)];
    
    const availableWelcomeSuggestions = welcomeBonusSuggestions.filter(
        suggestion => suggestion.category !== earnedSuggestion.category
    );
    
    const welcomeSuggestion = availableWelcomeSuggestions[
        Math.floor(Math.random() * availableWelcomeSuggestions.length)
    ];
    
    return {
        earnedSuggestion: earnedSuggestion.text,
        welcomeSuggestion: welcomeSuggestion.text
    };
}
    
    const INTERNATIONAL_HUBS = [
    'JFK', 'LAX', 'ORD', 'MIA', 'SFO', 'EWR', 'IAD', 
    'BOS', 'SEA', 'ATL', 'DFW', 'IAH', 'DEN'
];

        const airportNames = {
        'ATL': 'Atlanta',
        'BOS': 'Boston',
        'CLT': 'Charlotte',
        'DEN': 'Denver',
        'DFW': 'Dallas/Fort Worth',
        'DTW': 'Detroit',
        'EWR': 'Newark',
        'IAD': 'Washington Dulles',
        'IAH': 'Houston',
        'JFK': 'New York JFK',
        'LAX': 'Los Angeles',
        'LGA': 'New York LaGuardia',
        'MIA': 'Miami',
        'ORD': 'Chicago',
        'PHL': 'Philadelphia',
        'PHX': 'Phoenix',
        'SEA': 'Seattle',
        'SFO': 'San Francisco'
    };

        updateProgressBar('section1');
    
document.getElementById('homeAirport').addEventListener('change', function() {
    const customHomeAirport = document.getElementById('customHomeAirport');
    const customAirportInput = customHomeAirport.querySelector('input');
    
    if (this.value === 'custom') {
        customHomeAirport.classList.remove('hidden');
        customAirportInput.required = true;
        customAirportInput.focus();
    } else {
        customHomeAirport.classList.add('hidden');
        customAirportInput.required = false;
    }
});

// Add validation for the custom airport input
const customAirportInput = document.querySelector('#customHomeAirport input');
if (customAirportInput) {
    customAirportInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-z\s]/g, ''); // Only letters and spaces
            updateAllExplanationTexts();
    });
}
    
    function updateSliderLabel(sliderId) {
    const slider = document.getElementById(sliderId);
    const labels = slider.parentElement.querySelector('.slider-labels').children;
    const value = parseInt(slider.value);
    const section = slider.closest('section');
    
    // Remove classes from all labels
    Array.from(labels).forEach(label => {
        label.classList.remove('selected', 'primary-color');
    });

    if (section && section.id === 'section3') {
        // For section 3, adjust the index to match the 1-5 value range
        const selectedIndex = value - 1;  // Convert 1-5 to 0-4 for label index
        if (selectedIndex >= 0 && selectedIndex < labels.length) {
            labels[selectedIndex].classList.add('selected', 'primary-color');
        }
    } else {
        // Section 2 stays the same (0-4 range)
        if (value >= 0 && value < labels.length) {
            labels[value].classList.add('selected');
        }
    }
}
    function formatCurrency(input) {
        let value = input.value.replace(/[^0-9.-]+/g, '');
        if (value) {
            value = parseInt(value, 10).toLocaleString('en-US');
        }
        input.value = value ? '$' + value : '';
    }

    function hideAllSections() {
        document.querySelectorAll('.section').forEach(section => {
    section.classList.add('hidden');
});
    }

hideAllSections();
document.getElementById('section1').classList.remove('hidden');

// Update the mapping in preSelectPerkValues
function preSelectPerkValues() {
    try {
        console.log('Starting preSelectPerkValues');
        const travelFrequency = parseInt(document.getElementById('travelFrequency').value) || 0;
        const hotelSpend = parseFloat(document.getElementById('hotelSpend').value.replace(/[^0-9.-]+/g, '')) || 0;
        const homeAirport = document.getElementById('homeAirport').value;

        // Centurion Lounge airports
        const centurionAirports = ['ATL', 'DEN', 'DFW', 'IAH', 'JFK', 'LAX', 'LGA', 'MIA', 'PHL', 'PHX', 'SEA', 'SFO'];
        const otherLoungeAirports = ['BOS', 'CLT', 'DTW', 'EWR', 'IAD', 'ORD'];

        // Map the values to the new scale (1=Never, 2=Rarely, 3=Sometimes, 4=Often, 5=Always)
        let loungeValue = 1; // Default to Never
        if (travelFrequency >= 13) {
            loungeValue = 5; // Always (Very frequent)
        } else if (travelFrequency >= 7) {
            loungeValue = 4; // Often (Frequent)
        } else if (travelFrequency >= 4) {
            loungeValue = 3; // Sometimes (Regular)
        } else if (travelFrequency >= 1) {
            loungeValue = 2; // Rarely (Occasional)
        }

        // Partner Elite Status
        let statusValue = 1; // Never
        if (hotelSpend > 5000) {
            statusValue = 5; // Always
        } else if (hotelSpend > 3500) {
            statusValue = 4; // Often
        } else if (hotelSpend >= 2000) {
            statusValue = 3; // Sometimes
        } else if (hotelSpend >= 1000) {
            statusValue = 2; // Rarely
        }

        // FHR Access
        let fhrValue = 1; // Never
        if (hotelSpend > 7500) {
            fhrValue = 5; // Always
        } else if (hotelSpend > 5000) {
            fhrValue = 4; // Often
        } else if (hotelSpend >= 3000) {
            fhrValue = 3; // Sometimes
        } else if (hotelSpend >= 1500) {
            fhrValue = 2; // Rarely
        }

        // Card Protections
        let protectionValue = 1; // Never
        if (travelFrequency > 8) {
            protectionValue = 5; // Always
        } else if (travelFrequency > 6) {
            protectionValue = 4; // Often
        } else if (travelFrequency >= 4) {
            protectionValue = 3; // Sometimes
        } else if (travelFrequency >= 2) {
            protectionValue = 2; // Rarely
        }

        // If it's a custom airport, use more conservative values
        if (homeAirport === 'custom') {
            loungeValue = Math.min(loungeValue, 3); // Cap at "Sometimes"
            statusValue = Math.min(statusValue, 3); // Cap at "Sometimes"
            fhrValue = Math.min(fhrValue, 3); // Cap at "Sometimes"
            protectionValue = Math.min(protectionValue, 3); // Cap at "Sometimes"
        }

        // Debug logging
        console.log('Pre-selection values:', {
            travelFrequency,
            hotelSpend,
            homeAirport,
            loungeValue,
            statusValue,
            fhrValue,
            protectionValue
        });

        // Set the values
        document.getElementById('loungeAccess').value = loungeValue;
        document.getElementById('partnerStatus').value = statusValue;
        document.getElementById('fhrAndIap').value = fhrValue;
        document.getElementById('cardProtections').value = protectionValue;

        // Update the slider labels
        ['loungeAccess', 'partnerStatus', 'fhrAndIap', 'cardProtections'].forEach(id => {
            updateSliderLabel(id);
        });

        updatePerksExplanationText();

    } catch (error) {
        console.error("Error in preSelectPerkValues:", error);
    }
}

function getTravelFrequency() {
    const travelSelect = document.getElementById('travelFrequency');
    const customInput = document.getElementById('customTravelInput');
    
    if (travelSelect.value === 'custom') {
        return parseInt(customInput.value) || 0;
    }
    return parseInt(travelSelect.value) || 0;
}

function preSelectBenefitsValues() {
    try {
        // Get values from Section 1
        const travelFrequency = parseInt(document.getElementById('travelFrequency').value) || 0;
        const hotelSpend = parseFloat(document.getElementById('hotelSpend').value.replace(/[^0-9.-]+/g, '')) || 0;
        const homeAirport = document.getElementById('homeAirport').value;

     const globalEntryValue = calculateGlobalEntryCredit(homeAirport, travelFrequency);
const globalEntrySelect = document.getElementById('globalEntryCredit');
if (globalEntrySelect) {
    globalEntrySelect.value = globalEntryValue.toString();
}

        // Define airport categories
        const majorUrbanAirports = ['JFK', 'LGA', 'EWR', 'LAX', 'SFO', 'ORD', 'MIA', 'BOS'];
        const midTierAirports = ['DEN', 'DFW', 'IAH', 'SEA', 'PHX', 'DTW', 'PHL'];
        const luxuryMarketAirports = ['JFK', 'LGA', 'EWR', 'LAX', 'SFO', 'MIA'];
        const nycAirports = ['JFK', 'LGA', 'EWR'];
        const equinoxMarkets = ['BOS', 'MIA', 'SFO', 'LAX'];
        const clearAirports = ['ATL', 'BOS', 'DEN', 'DFW', 'IAH', 'JFK', 'LAX', 'LGA', 'MIA', 'ORD', 'PHX', 'SEA', 'SFO'];
        const urbanAirports = ['JFK', 'LGA', 'EWR', 'LAX', 'SFO', 'BOS', 'MIA'];

        // Set values for each credit
        const creditValues = {
            // 1. Airline Fee Credit
            airlineCredit: travelFrequency > 6 ? 4 : (travelFrequency >= 3 ? 2 : 1),

            // 2. Uber Cash
            uberCredit: majorUrbanAirports.includes(homeAirport) ? 4 : 
                       (midTierAirports.includes(homeAirport) ? 2 : 1),

            // 3. Saks Credit
              saksCredit: (() => {
        const otherSpend = parseFloat(document.getElementById('otherSpend').value.replace(/[^0-9.-]+/g, '')) || 0;
        
        if (otherSpend > 5000 || luxuryMarketAirports.includes(homeAirport)) {
            return 4;  // High likelihood of using full credit
        } else if (otherSpend > 2000 || majorUrbanAirports.includes(homeAirport)) {
            return 2;  // Medium likelihood
        }
        return 1;  // Lower likelihood but still possible due to online shopping
    })(),
    
            // 4. Equinox Credit
            equinoxCredit: nycAirports.includes(homeAirport) ? 4 :
                          (equinoxMarkets.includes(homeAirport) ? 2 : 1),

            // 5. CLEAR Credit
            clearCredit: (clearAirports.includes(homeAirport) && travelFrequency > 6) ? 4 :
                        (clearAirports.includes(homeAirport) && travelFrequency >= 3) ? 2 : 1,
            
            // 7. Entertainment Credit
            entertainmentCredit: 2, // Default to medium

            // 8. Walmart+ Credit
            walmartCredit: !urbanAirports.includes(homeAirport) ? 4 :
                          (midTierAirports.includes(homeAirport) ? 2 : 1),

            // 9. Hotel Credit
            hotelCredit: hotelSpend > 5000 ? 4 :
                        (hotelSpend >= 2000 ? 2 : 1),

            // 10. SoulCycle Credit
            soulCycleCredit: urbanAirports.includes(homeAirport) ? 4 :
                            (midTierAirports.includes(homeAirport) ? 2 : 1)
        };

           if (homeAirport === 'custom') {
            // Cap all values at 2 ("Rarely") for custom airports
            Object.keys(creditValues).forEach(key => {
                creditValues[key] = Math.min(creditValues[key], 2);
            });
            
            // Special handling for specific credits that should be even more conservative
            creditValues.equinoxCredit = 1;  // Set to "Never" for custom airports
            creditValues.soulCycleCredit = 1; // Set to "Never" for custom airports
            creditValues.clearCredit = 1;     // Set to "Never" for custom airports
            
            // Set Global Entry to TSA PreCheck value for custom airports
            if (globalEntrySelect && travelFrequency >= 3) {
                globalEntrySelect.value = "85";
            }
        }

        // Debug logging
        console.log('Pre-selection values for benefits:', {
            travelFrequency,
            hotelSpend,
            homeAirport,
            creditValues,
            globalEntryValue: globalEntrySelect?.value
        });

        // Set the values and update labels
        Object.entries(creditValues).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = value;
                updateSliderLabel(id);
            }
        });
        
        updateExplanationText();
        
    } catch (error) {
        console.error("Error in preSelectBenefitsValues:", error);
        // Set default values as fallback
        const creditIds = [
            'airlineCredit', 'uberCredit', 'saksCredit', 'equinoxCredit',
            'clearCredit', 'entertainmentCredit', 'walmartCredit', 
            'hotelCredit', 'soulCycleCredit'
        ];
        creditIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = 1;
                updateSliderLabel(id);
            }
        });
        // Set default for Global Entry dropdown
        const globalEntrySelect = document.getElementById('globalEntryCredit');
        if (globalEntrySelect) {
            globalEntrySelect.value = "0";
        }
    }
}

function updateExplanationText() {
    try {
        const travelFrequencyElement = document.getElementById('travelFrequency');
        const travelFrequency = parseInt(travelFrequencyElement?.value) || 0;

        const hotelSpendElement = document.getElementById('hotelSpend');
        const hotelSpend = parseFloat(hotelSpendElement?.value?.replace(/[$,]/g, '')) || 0;

        const homeAirportElement = document.getElementById('homeAirport');
        const homeAirport = homeAirportElement?.value || 'none';
        const customAirportInput = document.querySelector('#customHomeAirport input');
        
        // Get full airport name or use code if not found
        let airportDisplay;
        if (homeAirport === 'custom' && customAirportInput?.value) {
            airportDisplay = customAirportInput.value.toUpperCase();
        } else if (homeAirport !== 'none') {
            airportDisplay = `${airportNames[homeAirport] || homeAirport} (${homeAirport})`;
        } else {
            airportDisplay = 'none';
        }

        const explanationText = document.querySelector('.pre-selection-notice p');
        if (!explanationText) {
            console.error('Explanation text element not found');
            return;
        }

        // Format hotel spend
        const formattedHotelSpend = hotelSpend ? `$${hotelSpend.toLocaleString()}` : '$0';

        // Build base travel pattern text
        const travelPattern = `Based on your travel patterns (${travelFrequency} trip${travelFrequency !== 1 ? 's' : ''} per year${hotelSpend > 0 ? `, ${formattedHotelSpend} hotel spend` : ''})`;

        // Build the text based on airport selection status
        let text;
        if (!homeAirport || homeAirport === 'none') {
            text = `${travelPattern}, we've pre-selected suggested values for how much of each credit you might use yearly. <strong>These suggestions reflect typical usage patterns, but you should adjust them to match your expected usage.</strong>`;
        } else if (homeAirport === 'custom') {
            text = `${travelPattern} and home airport of ${customAirportInput?.value || 'not specified'}, we've pre-selected conservative values for each credit. <strong>Since this is a custom airport location, we've taken a more conservative approach - please adjust these values based on your expected usage and local availability of these benefits.</strong>`;
        } else {
            text = `${travelPattern} and home airport of ${airportDisplay}, we've pre-selected suggested values for how much of each credit you might use yearly. <strong>These suggestions reflect typical usage patterns for similar travelers, but you should adjust them to match your expected usage.</strong>`;
        }

        explanationText.innerHTML = text;

    } catch (error) {
        console.error('Error in updateExplanationText:', error);
    }
}
    function refreshExplanationText() {
    console.log('refreshExplanationText called');
    const notice = document.querySelector('.pre-selection-notice');
    console.log('notice element:', notice);
    if (notice) {
        updateExplanationText();
        notice.classList.add('updated');
        setTimeout(() => {
            notice.classList.remove('updated');
        }, 1000);
    }
}
        function updateAllExplanationTexts() {
    console.log('Updating all explanation texts');
    refreshExplanationText();
    updatePerksExplanationText();
}

    // Calculate Section 2 Value
function calculateSection2Value(isFirstYear = true) {
    // Define all credits with their annual values
    const regularCredits = [
        { id: 'airlineCredit', value: 200, steps: 5 },      // Annual
        { id: 'uberCredit', value: 200, steps: 5 },         // Monthly ($15 + $20 Dec)
        { id: 'saksCredit', value: 100, steps: 5 },         // Semi-annual ($50 × 2)
        { id: 'equinoxCredit', value: 300, steps: 5 },      // Annual
        { id: 'clearCredit', value: 199, steps: 5 },        // Annual
        { id: 'entertainmentCredit', value: 240, steps: 5 }, // Monthly ($20)
        { id: 'walmartCredit', value: 155, steps: 5 },      // Monthly ($12.95)
        { id: 'hotelCredit', value: 200, steps: 5 }         // Annual
    ];

    // First year only credits
    const firstYearCredits = [
        { id: 'soulCycleCredit', value: 300, steps: 5 }     // One-time
    ];

    // Calculate regular credits
    let total = regularCredits.reduce((sum, credit) => {
        const sliderValue = parseInt(document.getElementById(credit.id)?.value || 0);
        // Convert slider value (0-4) to percentage (0, 0.25, 0.50, 0.75, 1.0)
        const percentage = sliderValue / 4;
        const creditValue = credit.value * percentage;
        
        console.log(`${credit.id}:`, {
            value: credit.value,
            sliderValue,
            percentage,
            creditValue
        });
        
        return sum + creditValue;
    }, 0);

    // Add first year only credits
    if (isFirstYear) {
        // Add Global Entry/TSA PreCheck
        const globalEntryValue = parseInt(document.getElementById('globalEntryCredit').value) || 0;
        total += globalEntryValue;

        // Add other first-year-only credits
        firstYearCredits.forEach(credit => {
            const sliderValue = parseInt(document.getElementById(credit.id)?.value || 0);
            const percentage = sliderValue / 4;
            total += credit.value * percentage;
        });
    }

    return Math.round(total);
}

function calculateGlobalEntryCredit(homeAirport, tripsPerYear) {
    try {
        const airport = homeAirport.toUpperCase();
        
        // Log the inputs for debugging
        console.log('Calculating Global Entry credit:', {
            homeAirport,
            airport,
            tripsPerYear
        });
        
        // For custom airports, default to TSA PreCheck if frequent enough
        if (homeAirport === 'custom') {
            return tripsPerYear >= 3 ? 85 : 0;
        }
        
        // For international hubs
        if (INTERNATIONAL_HUBS.includes(airport)) {
            if (tripsPerYear >= 3) {
                return 120; // Global Entry
            }
        }
        
        // For all other airports
        if (tripsPerYear >= 6) {
            return 85; // TSA PreCheck
        } else if (tripsPerYear >= 3) {
            return 85; // TSA PreCheck
        }
        
        return 0; // Not enough travel frequency
    } catch (error) {
        console.error('Error in calculateGlobalEntryCredit:', error);
        return 0; // Default to no credit if there's an error
    }
}

function updatePerksExplanationText() {
    try {
        const perksNotice = document.querySelector('.perks-selection-notice p');
        if (!perksNotice) return;

        const homeAirport = document.getElementById('homeAirport').value;
        const travelFrequency = getTravelFrequency();        const hotelSpend = parseFloat(document.getElementById('hotelSpend').value.replace(/[$,]/g, '')) || 0;
        const customAirportInput = document.querySelector('#customHomeAirport input');

        // Define airport amenities
        const airportAmenities = {
            centurionLounges: ['ATL', 'DEN', 'DFW', 'IAH', 'JFK', 'LAX', 'LGA', 'MIA', 'PHL', 'PHX', 'SEA', 'SFO'],
            clearLanes: ['ATL', 'BOS', 'DEN', 'DFW', 'IAH', 'JFK', 'LAX', 'LGA', 'MIA', 'ORD', 'PHX', 'SEA', 'SFO'],
            escapeLounges: ['BOS', 'CLT', 'MSP', 'OAK', 'PHL', 'PHX', 'RNO', 'SAC']
        };

        // Format hotel spend
        const formattedHotelSpend = hotelSpend ? `$${hotelSpend.toLocaleString()}` : '$0';

        // Build available amenities text
        let amenitiesText = '';
        if (homeAirport === 'custom') {
            amenitiesText = "We're unable to confirm specific lounge availability at your selected airport. Please check the American Express Global Lounge Collection for available lounges.";
        } else if (!homeAirport || homeAirport === 'none') {
            amenitiesText = "Without a selected home airport, we can't provide specific lounge availability information.";
        } else {
            const availableAmenities = [];
            
            if (airportAmenities.centurionLounges.includes(homeAirport)) {
                availableAmenities.push("Centurion Lounge");
            }
            if (airportAmenities.clearLanes.includes(homeAirport)) {
                availableAmenities.push("CLEAR security lanes");
            }
            if (airportAmenities.escapeLounges.includes(homeAirport)) {
                availableAmenities.push("Escape Lounge");
            }
            availableAmenities.push("Priority Pass lounges");

            if (availableAmenities.length === 1) {
                amenitiesText = `you'll have access to ${availableAmenities[0]}`;
            } else if (availableAmenities.length === 2) {
                amenitiesText = `you'll have access to both ${availableAmenities[0]} and ${availableAmenities[1]}`;
            } else {
                const lastAmenity = availableAmenities.pop();
                amenitiesText = `you'll have access to ${availableAmenities.join(", ")} and ${lastAmenity}`;
            }
        }

        // Build the complete text based on airport selection status
        let text;
        if (!homeAirport || homeAirport === 'none') {
            text = `${amenitiesText} Based on your travel frequency (${travelFrequency} trip${travelFrequency !== 1 ? 's' : ''} per year) and hotel spend (${formattedHotelSpend}), we've pre-selected suggested values for each perk. <strong>Please adjust these based on your local airport's lounge availability and how often you expect to use each benefit.</strong>`;
        } else if (homeAirport === 'custom') {
            text = `For travelers using ${customAirportInput?.value || 'your airport'}, we're unable to provide specific lounge information. We recommend checking the <a href="https://global.americanexpress.com/lounge-access/the-platinum-card?locale=en-CA" target="_blank">American Express Global Lounge Collection</a> for available lounges at your airport. Based on your travel frequency (${travelFrequency} trip${travelFrequency !== 1 ? 's' : ''} per year) and hotel spend (${formattedHotelSpend}), we've pre-selected conservative values for each perk. <strong>Please adjust these based on the actual lounge availability and how often you expect to use each benefit.</strong>`;
        } else {
            text = `With ${airportNames[homeAirport] || homeAirport} (${homeAirport}) as your home airport, ${amenitiesText}. Combined with your travel frequency (${travelFrequency} trip${travelFrequency !== 1 ? 's' : ''} per year) and hotel spend (${formattedHotelSpend}), we've pre-selected values for each perk based on typical usage patterns. <strong>These suggestions are based on typical usage patterns for similar travelers, but you should adjust them based on how often you're likely to take advantage of them.</strong>`;
        }

        perksNotice.innerHTML = text;

    } catch (error) {
        console.error('Error in updatePerksExplanationText:', error);
    }
}

// Add this single event listener for section 3 transition
document.getElementById('continueToSection3Btn').addEventListener('click', function() {
    console.log('Continue to Section 3 clicked');
    nextSection('section2', 'section3');
    updateProgressBar('section3');
    setTimeout(() => {
        preSelectPerkValues();
        console.log('Perks pre-selected');
    }, 100);
});

// Update the input listeners to use updateAllExplanationTexts
['travelFrequency', 'homeAirport'].forEach(id => {
    document.getElementById(id).addEventListener('change', updateAllExplanationTexts);
});

document.getElementById('hotelSpend').addEventListener('blur', updateAllExplanationTexts);
    
function calculateSection3Value() {
    const travelFrequency = parseInt(document.getElementById('travelFrequency').value.replace(/[^ -\u007F]+/g, '')) || 0;

    const perks = [
        { id: 'loungeAccess', valuePerUse: 50, steps: 5 },
        { id: 'partnerStatus', valuePerUse: 40, steps: 5 },
        { id: 'fhrAndIap', valuePerUse: 100, steps: 5 }
    ];

    let total = perks.reduce((sum, perk) => {
        const sliderValue = parseInt(document.getElementById(perk.id).value);
        
        // Convert slider values 1-5 to percentages
        const percentages = {
            1: 0,    // Never = 0%
            2: 0.25, // Rarely = 25%
            3: 0.50, // Sometimes = 50%
            4: 0.75, // Often = 75%
            5: 1.00  // Always = 100%
        };
        
        const percentage = percentages[sliderValue] || 0;
        const perkValue = travelFrequency * perk.valuePerUse * percentage;
        
        console.log(`${perk.id}:`, {
            travelFrequency,
            valuePerUse: perk.valuePerUse,
            sliderValue,
            percentage,
            perkValue
        });
        
        return sum + perkValue;
    }, 0);

    return Math.round(total);
}

function calculateFinalValuation() {
    console.log("Starting final valuation calculation");
    
    const travelFrequency = parseInt(document.getElementById('travelFrequency').value.replace(/[^\d.-]/g, ''));
    console.log("Travel Frequency:", travelFrequency);
    
    if (!travelFrequency) {
        alert('Please select how often you travel');
        nextSection('section4', 'section1');
        return;
    }

    // Get points value with error checking
    const totalPointsElement = document.getElementById('totalPointsValue');
    if (!totalPointsElement) {
        console.error("Could not find totalPointsValue element");
        return;
    }
    
    const totalPoints = parseInt(totalPointsElement.textContent.replace(/[^\d.-]/g, '')) || 0;
    console.log("Total Points:", totalPoints);
    
    const pointsValue = totalPoints * POINT_VALUE;
    const section2Value = calculateSection2Value();
    const section3Value = calculateSection3Value();

    console.log({
        pointsValue,
        section2Value,
        section3Value
    });

    // Debug logging
    console.log({
        points: {
            totalPoints,
            pointsValue
        },
        credits: {
            section2Value
        },
        perks: {
            section3Value,
            travelFrequency,
            loungeValue: parseInt(document.getElementById('loungeAccess').value),
            statusValue: parseInt(document.getElementById('partnerStatus').value),
            fhrValue: parseInt(document.getElementById('fhrAndIap').value),
        }
    });

    const yearlyValue = pointsValue + section2Value + section3Value;
    const signupBonusValue = WELCOME_BONUS * POINT_VALUE;
    const firstYearValue = yearlyValue + signupBonusValue - ANNUAL_FEE;
    const secondYearValue = yearlyValue - ANNUAL_FEE;

    console.log({
        yearlyValue,
        signupBonusValue,
        firstYearValue,
        secondYearValue
    });

    // Helper function to update values with proper classes
    function updateValueWithClass(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = '$' + Math.round(value).toLocaleString();
            element.classList.remove('positive', 'negative');
            element.classList.add(value >= 0 ? 'positive' : 'negative');
        }
    }

    // Update values with color classes
    updateValueWithClass('firstYearSavings', firstYearValue);
    updateValueWithClass('secondYearSavings', secondYearValue);
    updateValueWithClass('firstYearValue', firstYearValue);
    updateValueWithClass('secondYearValue', secondYearValue);

    // Update other values that don't need color coding
    document.getElementById('annualFee').textContent = '$' + ANNUAL_FEE.toLocaleString();
    document.getElementById('signupBonusValue').textContent = '$' + Math.round(signupBonusValue).toLocaleString();
    document.getElementById('pointsSpendingValue').textContent = Math.round(pointsValue).toLocaleString();
    document.getElementById('pointsSpendingValueSecondYear').textContent = Math.round(pointsValue).toLocaleString();
    document.getElementById('cardBenefitsValue').textContent = Math.round(section2Value).toLocaleString();
    document.getElementById('cardBenefitsValueSecondYear').textContent = Math.round(section2Value).toLocaleString();
    document.getElementById('travelPerksValue').textContent = Math.round(section3Value).toLocaleString();
    document.getElementById('travelPerksValueSecondYear').textContent = Math.round(section3Value).toLocaleString();
    document.getElementById('signupBonusBreakdown').textContent = Math.round(signupBonusValue).toLocaleString();
    
    // Show section 4
    hideAllSections();
    document.getElementById('section4').classList.remove('hidden');
    updateProgressBar('section4');
    window.scrollTo(0, 0);
    
    // Trigger confetti if both first year and second year values are positive
    if (firstYearValue > 0 && secondYearValue > 0) {
        // Add a small delay to ensure the section is visible before showing confetti
        setTimeout(() => {
            showConfetti();
        }, 1000);
    }
}
     function updateProgressBar(currentSection) {
    // Remove all active and completed classes
    document.querySelectorAll('.progress-bar .step').forEach(step => {
        step.classList.remove('active', 'completed');
    });

    const steps = document.querySelectorAll('.progress-bar .step');
    const currentIndex = parseInt(currentSection.replace('section', '')) - 1;

    // Mark previous steps as completed
    for(let i = 0; i < currentIndex; i++) {
        steps[i].classList.add('completed');
    }

    // Mark current step as active
    steps[currentIndex].classList.add('active');

    // Remove any classes from future steps
    for(let i = currentIndex + 1; i < steps.length; i++) {
        steps[i].classList.remove('completed', 'active');
    }
}

    function nextSection(currentSectionId, nextSectionId) {
        hideAllSections();
document.getElementById(nextSectionId).classList.remove('hidden');
if (nextSectionId !== 'section1') {
    document.getElementById('results').classList.add('hidden');
}
        window.scrollTo(0, 0);
    }

// Find these existing event listeners and update them:
document.getElementById('calculatePointsBtn').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent any default form submission
    
    const travelFrequency = document.getElementById('travelFrequency').value;

    // Validate travel frequency
    if (!travelFrequency || travelFrequency === '0') {
        document.getElementById('travelFrequency').classList.add('error');
        alert('Please enter how many times you travel per year');
        return;
    }

    document.getElementById('travelFrequency').classList.remove('error');
    
    try {
        calculatePoints(); // Calculate the points
        
        // Make sure the results section exists and is visible
        const resultsSection = document.getElementById('results');
        if (resultsSection) {
            resultsSection.classList.remove('hidden');
            
            // Scroll to results section
            resultsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update progress bar
            updateProgressBar('section1');
        } else {
            console.error('Results section not found');
        }
    } catch (error) {
        console.error("Error calculating points:", error);
        alert('There was an error calculating your points. Please try again.');
    }
});

const continueBtn = document.getElementById('continueBtn');
if (!continueBtn) {
    console.error('Continue button not found');
} else {
    continueBtn.addEventListener('click', function() {
        const travelFrequency = getTravelFrequency();
    
        if (!travelFrequency) {
            document.getElementById('travelFrequency').classList.add('error');
            alert('Please select how often you travel');
            return;
        }

        calculatePoints(); // Calculate points before moving to next section
        nextSection('section1', 'section2');
        updateProgressBar('section2'); 
        preSelectBenefitsValues();
    });
}
document.getElementById('backToSection1').addEventListener('click', function(e) {
    e.preventDefault();
    nextSection('section2', 'section1');
    updateProgressBar('section1');  
});

document.getElementById('backToSection2').addEventListener('click', function(e) {
    e.preventDefault();
    nextSection('section3', 'section2');
    updateProgressBar('section2'); 
});

const calculateValuationBtn = document.getElementById('calculateValuationBtn');
if (calculateValuationBtn) {
    calculateValuationBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log("Calculate Valuation button clicked");
        
        try {
            calculateFinalValuation();
            // Add this line to explicitly transition from section3 to section4
            nextSection('section3', 'section4');
            updateProgressBar('section4');
        } catch (error) {
            console.error("Error in calculate valuation:", error);
            // Still try to show section 4 even if there's an error
            nextSection('section3', 'section4');
            updateProgressBar('section4');
        }
    });
} else {
    console.error("Calculate Valuation button not found");
}
document.getElementById('backToSection3').addEventListener('click', function(e) {
    e.preventDefault();
    nextSection('section4', 'section3');
    updateProgressBar('section3');
});

document.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.addEventListener('input', () => updateSliderLabel(slider.id));
});
// Add this function to create confetti effect
function showConfetti() {
    // First check if confetti is available
    if (typeof confetti !== 'function') {
        console.error('Confetti library not loaded');
        return;
    }
    
    // Reset any existing confetti
    confetti.reset();
    
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { 
        startVelocity: 30, 
        spread: 360, 
        ticks: 60, 
        zIndex: 999999,
        disableForReducedMotion: true
    };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Use requestAnimationFrame to ensure the DOM is ready
    requestAnimationFrame(() => {
        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 30 * (timeLeft / duration);
            
            // Mobile-friendly origins with lower y-value
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: 0.1 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: 0.1 }
            });
        }, 250);
    });
}
