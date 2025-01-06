// Constants
const WELCOME_BONUS = 80000;
const POINT_VALUE = 0.022;
const ANNUAL_FEE = 595;
const MINIMUM_POINTS_FOR_SUGGESTION = 15000;
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

// Utility Functions
function formatNumber(number) {
    return number.toLocaleString('en-US');
}

function parseCurrencyValue(value) {
    return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
}

function validateNumericInput(input, min = 0, max = Infinity) {
    const value = parseCurrencyValue(input.value);
    if (isNaN(value) || value < min || value > max) {
        throw new Error(`Invalid value for ${input.id}: ${input.value}`);
    }
    return value;
}

// Helper Functions
function hideAllSections() {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
}

function formatCurrency(input) {
    let value = input.value.replace(/[^0-9.-]+/g, '');
    if (value) {
        value = parseInt(value, 10).toLocaleString('en-US');
    }
    input.value = value ? '$' + value : '';
}

function updateProgressBar(currentSection) {
    document.querySelectorAll('.progress-bar .step').forEach(step => {
        step.classList.remove('active', 'completed');
    });

    const steps = document.querySelectorAll('.progress-bar .step');
    const currentIndex = parseInt(currentSection.replace('section', '')) - 1;

    for(let i = 0; i < currentIndex; i++) {
        steps[i].classList.add('completed');
    }

    steps[currentIndex].classList.add('active');

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

// Component Handlers
function handleFlightSpendPresets() {
    const presetOptions = document.querySelectorAll('input[name="flightSpend"]');
    const customInput = document.querySelector('.custom-input');

    presetOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'custom') {
                customInput.disabled = false;
                customInput.focus();
            } else {
                customInput.disabled = true;
                customInput.value = '';
                document.getElementById('flightSpend').value = '$' + parseInt(this.value).toLocaleString();
                calculatePoints();
            }
        });
    });

    customInput.addEventListener('blur', function() {
        if (!this.disabled && this.value) {
            document.getElementById('flightSpend').value = '$' + parseInt(this.value).toLocaleString();
            calculatePoints();
        }
    });
}

function handleHotelSpendSlider() {
    const slider = document.querySelector('#hotelSpend');
    const monthlyValue = slider.parentElement.querySelector('.monthly-value');
    const yearlyValue = slider.parentElement.querySelector('.yearly-value');

    slider.addEventListener('input', function() {
        const value = parseInt(this.value);
        const monthly = Math.round(value / 12);
        
        monthlyValue.textContent = '$' + monthly.toLocaleString() + '/month';
        yearlyValue.textContent = '$' + value.toLocaleString() + '/year';
        
        document.getElementById('hotelSpend').value = '$' + value.toLocaleString();
        calculatePoints();
    });
}

function handleOtherSpendDropdown() {
    const dropdown = document.querySelector('#otherSpend');
    
    dropdown.addEventListener('change', function() {
        const value = parseInt(this.value);
        document.getElementById('otherSpend').value = '$' + value.toLocaleString();
        calculatePoints();
    });
}

function updateSliderLabel(sliderId) {
    const slider = document.getElementById(sliderId);
    const labels = slider.parentElement.querySelector('.slider-labels').children;
    const value = parseInt(slider.value);
    const section = slider.closest('section');
    
    Array.from(labels).forEach(label => {
        label.classList.remove('selected', 'primary-color');
    });

    if (section && section.id === 'section3') {
        const selectedIndex = value - 1;
        if (selectedIndex >= 0 && selectedIndex < labels.length) {
            labels[selectedIndex].classList.add('selected', 'primary-color');
        }
    } else {
        if (value >= 0 && value < labels.length) {
            labels[value].classList.add('selected');
        }
    }
}

function initializeFormFields() {
    ['flightSpend', 'hotelSpend', 'otherSpend'].forEach(id => {
        const input = document.getElementById(id);
        if (!input) {
            console.error(`Input element with id ${id} not found`);
            return;
        }
        
        input.addEventListener('focus', function() {
            const value = this.value.replace(/[$,]/g, '');
            this.value = value;
        });

        input.addEventListener('blur', function() {
            let value = this.value.replace(/[^\d]/g, '');
            if (value) {
                value = parseInt(value, 10);
                this.value = '$' + value.toLocaleString('en-US');
            } else {
                this.value = '$0';
            }
            
            if (id === 'hotelSpend') {
                updateAllExplanationTexts();
            }
        });

        input.value = '$0';
    });

    document.getElementById('travelFrequency').addEventListener('blur', function() {
        let value = this.value.replace(/[^ -\u007F]+/g, '');
        if (value === '') value = '0';
        value = Math.max(0, parseInt(value));
        this.value = value;
    });
}
// Points Calculation and Suggestions
function calculatePoints() {
    try {
        const flightSpend = parseFloat(document.getElementById('flightSpend').value.replace(/[^0-9.-]+/g, '')) || 0;
        const hotelSpend = parseFloat(document.getElementById('hotelSpend').value.replace(/[^0-9.-]+/g, '')) || 0;
        const otherSpend = parseFloat(document.getElementById('otherSpend').value.replace(/[^0-9.-]+/g, '')) || 0;

        const cappedFlightSpend = Math.min(flightSpend, 500000);
        const uncappedFlightSpend = Math.max(0, flightSpend - 500000);

        const travelPoints = (cappedFlightSpend + hotelSpend) * 5;
        const otherPoints = otherSpend + uncappedFlightSpend;
        const totalPoints = travelPoints + otherPoints;
        const totalValuation = (WELCOME_BONUS + totalPoints) * POINT_VALUE;

        console.log('Calculation values:', {
            flightSpend, hotelSpend, otherSpend,
            cappedFlightSpend, uncappedFlightSpend,
            travelPoints, otherPoints, totalPoints, totalValuation
        });

        const elements = {
            totalPointsValue: document.getElementById('totalPointsValue'),
            welcomeBonusValue: document.getElementById('welcomeBonusValue'),
            valuationValue: document.getElementById('valuationValue'),
            results: document.getElementById('results')
        };

        const missingElements = Object.entries(elements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);

        if (missingElements.length > 0) {
            throw new Error(`Missing required elements: ${missingElements.join(', ')}`);
        }

        elements.totalPointsValue.textContent = Math.round(totalPoints).toLocaleString() + ' points';
        elements.welcomeBonusValue.textContent = WELCOME_BONUS.toLocaleString() + ' points';
        elements.valuationValue.textContent = '$' + Math.round(totalValuation).toLocaleString();

        const suggestions = getComplementarySuggestions(totalPoints);
        
        const earnedPointsContainer = document.getElementById('totalPointsValue')
            .parentElement.querySelector('.points-suggestion');
        if (suggestions.earnedSuggestion && totalPoints >= MINIMUM_POINTS_FOR_SUGGESTION) {
            if (earnedPointsContainer) {
                earnedPointsContainer.textContent = suggestions.earnedSuggestion;
            }
        }

        const welcomeBonusContainer = document.querySelector('.welcome-bonus .points-suggestion');
        if (!welcomeBonusContainer) {
            console.warn('Welcome bonus container not found');
        } else {
            welcomeBonusContainer.textContent = suggestions.welcomeSuggestion;
        }

        elements.results.classList.remove('hidden');
        console.log('Results displayed successfully');

        return { totalPoints, totalValuation };

    } catch (error) {
        console.error('Error in calculatePoints:', error);
        alert('There was an error calculating your points. Please try again.');
        throw error;
    }
}

const earnedPointSuggestions = [
    {
        min: 15000,
        max: 20000,
        suggestions: [
            { text: "That's enough for a one-way flight to any major US city!", category: "FLIGHTS" },
            { text: "That's enough for a luxury hotel night through Fine Hotels & Resorts!", category: "HOTELS" },
            { text: "That's enough for multiple premium dining experiences through Resy!", category: "EXPERIENCES" }
        ]
    },
    {
        min: 20001,
        max: 40000,
        suggestions: [
            { text: "That's enough for a round-trip flight anywhere in the continental US!", category: "FLIGHTS" },
            { text: "That's enough for two nights at a 5-star hotel in Miami or LA!", category: "HOTELS" },
            { text: "That's enough for multiple spa treatments at luxury resorts!", category: "EXPERIENCES" }
        ]
    },
    {
        min: 40001,
        max: 60000,
        suggestions: [
            { text: "That's enough for a round-trip flight to Hawaii!", category: "FLIGHTS" },
            { text: "That's enough for three nights at a beachfront resort in Mexico!", category: "HOTELS" },
            { text: "That's enough for a weekend of luxury experiences including dining and spa!", category: "EXPERIENCES" }
        ]
    },
    {
        min: 60001,
        max: 80000,
        suggestions: [
            { text: "That's enough for a round-trip flight to Europe!", category: "FLIGHTS" },
            { text: "That's enough for a 4-night luxury hotel stay in Paris or London!", category: "HOTELS" },
            { text: "That's enough for multiple domestic weekend getaways!", category: "EXPERIENCES" }
        ]
    },
    {
        min: 80001,
        max: 120000,
        suggestions: [
            { text: "That's enough for a business class flight to Europe!", category: "FLIGHTS" },
            { text: "That's enough for a 5-night stay at a luxury resort in Bora Bora!", category: "HOTELS" },
            { text: "That's enough for multiple romantic getaways with luxury perks!", category: "EXPERIENCES" }
        ]
    },
    {
        min: 120001,
        max: 160000,
        suggestions: [
            { text: "That's enough for a first class flight to Asia!", category: "FLIGHTS" },
            { text: "That's enough for a week at top hotels in multiple European cities!", category: "HOTELS" },
            { text: "That's enough for multiple luxury vacations with VIP experiences!", category: "EXPERIENCES" }
        ]
    },
    {
        min: 160001,
        max: 200000,
        suggestions: [
            { text: "That's enough for two business class tickets to anywhere in the world!", category: "FLIGHTS" },
            { text: "That's enough for 10 nights at luxury hotels across multiple destinations!", category: "HOTELS" },
            { text: "That's enough for a year of premium travel experiences!", category: "EXPERIENCES" }
        ]
    },
    {
        min: 200001,
        max: Infinity,
        suggestions: [
            { text: "That's enough for multiple first class international flights!", category: "FLIGHTS" },
            { text: "That's enough for two weeks at the world's most exclusive resorts!", category: "HOTELS" },
            { text: "That's enough for unlimited luxury travel possibilities!", category: "EXPERIENCES" }
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

// Benefits and Perks Calculations
function calculateSection2Value(isFirstYear = true) {
    const regularCredits = [
        { id: 'airlineCredit', value: 200, steps: 5 },
        { id: 'uberCredit', value: 200, steps: 5 },
        { id: 'saksCredit', value: 100, steps: 5 },
        { id: 'equinoxCredit', value: 300, steps: 5 },
        { id: 'clearCredit', value: 199, steps: 5 },
        { id: 'entertainmentCredit', value: 240, steps: 5 },
        { id: 'walmartCredit', value: 155, steps: 5 },
        { id: 'hotelCredit', value: 200, steps: 5 }
    ];

    const firstYearCredits = [
        { id: 'soulCycleCredit', value: 300, steps: 5 }
    ];

    let total = regularCredits.reduce((sum, credit) => {
        const sliderValue = parseInt(document.getElementById(credit.id)?.value || 0);
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

    if (isFirstYear) {
        const globalEntryValue = parseInt(document.getElementById('globalEntryCredit').value) || 0;
        total += globalEntryValue;

        firstYearCredits.forEach(credit => {
            const sliderValue = parseInt(document.getElementById(credit.id)?.value || 0);
            const percentage = sliderValue / 4;
            total += credit.value * percentage;
        });
    }

    return Math.round(total);
}

function calculateSection3Value() {
    const travelFrequency = parseInt(document.getElementById('travelFrequency').value.replace(/[^ -\u007F]+/g, '')) || 0;

    const perks = [
        { id: 'loungeAccess', valuePerUse: 50, steps: 5 },
        { id: 'partnerStatus', valuePerUse: 40, steps: 5 },
        { id: 'fhrAndIap', valuePerUse: 100, steps: 5 }
    ];

    let total = perks.reduce((sum, perk) => {
        const sliderValue = parseInt(document.getElementById(perk.id).value);
        const percentages = {
            1: 0,    // Never
            2: 0.25, // Rarely
            3: 0.50, // Sometimes
            4: 0.75, // Often
            5: 1.00  // Always
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

function calculateGlobalEntryCredit(homeAirport, tripsPerYear) {
    try {
        const airport = homeAirport.toUpperCase();
        
        console.log('Calculating Global Entry credit:', {
            homeAirport,
            airport,
            tripsPerYear
        });
        
        if (homeAirport === 'custom') {
            return tripsPerYear >= 3 ? 85 : 0;
        }
        
        if (INTERNATIONAL_HUBS.includes(airport)) {
            if (tripsPerYear >= 3) {
                return 120; // Global Entry
            }
        }
        
        if (tripsPerYear >= 3) {
            return 85; // TSA PreCheck
        }
        
        return 0;
    } catch (error) {
        console.error('Error in calculateGlobalEntryCredit:', error);
        return 0;
    }
}

// Pre-selection Functions
function preSelectBenefitsValues() {
    try {
        console.log('Starting preSelectBenefitsValues');
        const travelFrequency = parseInt(document.getElementById('travelFrequency').value) || 0;
        const homeAirport = document.getElementById('homeAirport').value;

        // Airline Credit (0-4 scale)
        const airlineValue = travelFrequency >= 4 ? 4 : 
                           travelFrequency >= 2 ? 3 : 
                           travelFrequency >= 1 ? 2 : 1;
        
        // Uber Credit (0-4 scale)
        const uberValue = travelFrequency >= 6 ? 4 : 
                         travelFrequency >= 3 ? 3 : 
                         travelFrequency >= 1 ? 2 : 1;
        
        // CLEAR Credit (0-4 scale)
        const clearValue = INTERNATIONAL_HUBS.includes(homeAirport) && travelFrequency >= 4 ? 4 :
                         INTERNATIONAL_HUBS.includes(homeAirport) && travelFrequency >= 2 ? 3 :
                         travelFrequency >= 4 ? 2 : 1;

        // Global Entry/TSA PreCheck
        const globalEntryValue = calculateGlobalEntryCredit(homeAirport, travelFrequency);

        // Set the values
        document.getElementById('airlineCredit').value = Math.min(airlineValue, 4);
        document.getElementById('uberCredit').value = Math.min(uberValue, 4);
        document.getElementById('clearCredit').value = Math.min(clearValue, 4);
        document.getElementById('globalEntryCredit').value = globalEntryValue;

        // Update slider labels
        ['airlineCredit', 'uberCredit', 'clearCredit'].forEach(id => {
            updateSliderLabel(id);
        });

        console.log('Benefits pre-selected:', {
            airlineValue,
            uberValue,
            clearValue,
            globalEntryValue
        });

    } catch (error) {
        console.error('Error in preSelectBenefitsValues:', error);
    }
}

function preSelectPerkValues() {
    try {
        console.log('Starting preSelectPerkValues');
        const travelFrequency = parseInt(document.getElementById('travelFrequency').value) || 0;
        const hotelSpend = parseFloat(document.getElementById('hotelSpend').value.replace(/[^0-9.-]+/g, '')) || 0;
        const homeAirport = document.getElementById('homeAirport').value;

        // Lounge Access (1-5 scale)
        let loungeValue = 1; // Never
        if (INTERNATIONAL_HUBS.includes(homeAirport) && travelFrequency > 6) {
            loungeValue = 5; // Always
        } else if (INTERNATIONAL_HUBS.includes(homeAirport) && travelFrequency >= 3) {
            loungeValue = 4; // Often
        } else if (travelFrequency > 6) {
            loungeValue = 3; // Sometimes
        } else if (travelFrequency >= 3) {
            loungeValue = 2; // Rarely
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

        // If it's a custom airport, use more conservative values
        if (homeAirport === 'custom') {
            loungeValue = Math.min(loungeValue, 3);
            statusValue = Math.min(statusValue, 3);
            fhrValue = Math.min(fhrValue, 3);
        }

        // Set the values
        document.getElementById('loungeAccess').value = loungeValue;
        document.getElementById('partnerStatus').value = statusValue;
        document.getElementById('fhrAndIap').value = fhrValue;

        // Update slider labels
        ['loungeAccess', 'partnerStatus', 'fhrAndIap'].forEach(id => {
            updateSliderLabel(id);
        });

        console.log('Perks pre-selected:', {
            loungeValue,
            statusValue,
            fhrValue
        });

        // Update explanation text
        updatePerksExplanationText();

    } catch (error) {
        console.error('Error in preSelectPerkValues:', error);
    }
}

// Additional Error Handling
function handleCalculationError(error, section) {
    console.error(`Error in ${section}:`, error);
    alert(`There was an error calculating your ${section.toLowerCase()}. Please try again or contact support if the problem persists.`);
}

function validateInputs() {
    const requiredInputs = {
        travelFrequency: document.getElementById('travelFrequency'),
        homeAirport: document.getElementById('homeAirport'),
        hotelSpend: document.getElementById('hotelSpend')
    };

    for (const [name, input] of Object.entries(requiredInputs)) {
        if (!input || !input.value) {
            throw new Error(`Missing required input: ${name}`);
        }
    }
}

// Add this to your existing updateProgressBar function
function updateProgressBarWithError(currentSection, error) {
    updateProgressBar(currentSection);
    console.error(`Error in section ${currentSection}:`, error);
    // You might want to add visual feedback here
}

function calculateFinalValuation() {
    console.log("Starting final valuation calculation");
    
    const travelFrequency = parseInt(document.getElementById('travelFrequency').value.replace(/[^\d.-]/g, ''));
    console.log("Travel Frequency:", travelFrequency);
    
    if (!travelFrequency) {
        alert('Please enter your travel frequency in section 1');
        nextSection('section4', 'section1');
        return;
    }

    const totalPointsElement = document.getElementById('totalPointsValue');
    if (!totalPointsElement) {
        console.error("Could not find totalPointsValue element");
        return;
    }
    
    const totalPoints = parseInt(totalPointsElement.textContent.replace(/[^\d.-]/g, '')) || 0;
    const pointsValue = totalPoints * POINT_VALUE;
    const section2Value = calculateSection2Value();
    const section3Value = calculateSection3Value();

    console.log({
        pointsValue,
        section2Value,
        section3Value
    });

    const yearlyValue = pointsValue + section2Value + section3Value;
    const signupBonusValue = WELCOME_BONUS * POINT_VALUE;
    const firstYearValue = yearlyValue + signupBonusValue - ANNUAL_FEE;
    const secondYearValue = yearlyValue - ANNUAL_FEE;

    updateValuationDisplay(firstYearValue, secondYearValue, pointsValue, section2Value, section3Value, signupBonusValue);
}
// Explanation Text Updates
function updateExplanationText() {
    try {
        const travelFrequency = parseInt(document.getElementById('travelFrequency')?.value) || 0;
        const hotelSpend = parseFloat(document.getElementById('hotelSpend')?.value?.replace(/[$,]/g, '')) || 0;
        const homeAirport = document.getElementById('homeAirport')?.value || 'none';
        const customAirportInput = document.querySelector('#customHomeAirport input');
        
        let airportDisplay;
        if (homeAirport === 'custom' && customAirportInput?.value) {
            airportDisplay = customAirportInput.value.toUpperCase();
        } else if (homeAirport !== 'none') {
            airportDisplay = `${airportNames[homeAirport] || homeAirport} (${homeAirport})`;
        } else {
            airportDisplay = 'none';
        }

        const explanationText = document.querySelector('.pre-selection-notice p');
        if (!explanationText) return;

        const formattedHotelSpend = hotelSpend ? `$${hotelSpend.toLocaleString()}` : '$0';
        const travelPattern = `Based on your travel patterns (${travelFrequency} trip${travelFrequency !== 1 ? 's' : ''} per year${hotelSpend > 0 ? `, ${formattedHotelSpend} hotel spend` : ''})`;

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

function updatePerksExplanationText() {
    try {
        const perksNotice = document.querySelector('.perks-selection-notice p');
        if (!perksNotice) return;

        const homeAirport = document.getElementById('homeAirport').value;
        const travelFrequency = parseInt(document.getElementById('travelFrequency').value) || 0;
        const hotelSpend = parseFloat(document.getElementById('hotelSpend').value.replace(/[$,]/g, '')) || 0;
        const customAirportInput = document.querySelector('#customHomeAirport input');

        const airportAmenities = {
            centurionLounges: ['ATL', 'DEN', 'DFW', 'IAH', 'JFK', 'LAX', 'LGA', 'MIA', 'PHL', 'PHX', 'SEA', 'SFO'],
            clearLanes: ['ATL', 'BOS', 'DEN', 'DFW', 'IAH', 'JFK', 'LAX', 'LGA', 'MIA', 'ORD', 'PHX', 'SEA', 'SFO'],
            escapeLounges: ['BOS', 'CLT', 'MSP', 'OAK', 'PHL', 'PHX', 'RNO', 'SAC']
        };

        const formattedHotelSpend = hotelSpend ? `$${hotelSpend.toLocaleString()}` : '$0';
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

            amenitiesText = formatAmenitiesList(availableAmenities);
        }

        perksNotice.innerHTML = generatePerksText(homeAirport, travelFrequency, formattedHotelSpend, amenitiesText, customAirportInput);

    } catch (error) {
        console.error('Error in updatePerksExplanationText:', error);
    }
}

function formatAmenitiesList(amenities) {
    if (amenities.length === 1) {
        return `you'll have access to ${amenities[0]}`;
    } else if (amenities.length === 2) {
        return `you'll have access to both ${amenities[0]} and ${amenities[1]}`;
    } else {
        const lastAmenity = amenities.pop();
        return `you'll have access to ${amenities.join(", ")} and ${lastAmenity}`;
    }
}

function generatePerksText(homeAirport, travelFrequency, formattedHotelSpend, amenitiesText, customAirportInput) {
    const travelPattern = `travel frequency (${travelFrequency} trip${travelFrequency !== 1 ? 's' : ''} per year) and hotel spend (${formattedHotelSpend})`;

    if (!homeAirport || homeAirport === 'none') {
        return `${amenitiesText} Based on your ${travelPattern}, we've pre-selected suggested values for each perk. <strong>Please adjust these based on your local airport's lounge availability and how often you expect to use each benefit.</strong>`;
    } else if (homeAirport === 'custom') {
        return `For travelers using ${customAirportInput?.value || 'your airport'}, we're unable to provide specific lounge information. We recommend checking the <a href="https://global.americanexpress.com/lounge-access/the-platinum-card?locale=en-CA" target="_blank">American Express Global Lounge Collection</a> for available lounges at your airport. Based on your ${travelPattern}, we've pre-selected conservative values for each perk. <strong>Please adjust these based on the actual lounge availability and how often you expect to use each benefit.</strong>`;
    } else {
        return `With ${airportNames[homeAirport] || homeAirport} (${homeAirport}) as your home airport, ${amenitiesText}. Combined with your ${travelPattern}, we've pre-selected values for each perk based on typical usage patterns. <strong>These suggestions are based on typical usage patterns for similar travelers, but you should adjust them based on how often you're likely to take advantage of them.</strong>`;
    }
}

function refreshExplanationText() {
    console.log('refreshExplanationText called');
    const notice = document.querySelector('.pre-selection-notice');
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

// Main Initialization and Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    handleFlightSpendPresets();
    handleHotelSpendSlider();
    handleOtherSpendDropdown();
    
    // Set initial state
    hideAllSections();
    document.getElementById('section1').classList.remove('hidden');
    updateProgressBar('section1');
    
    // Initialize form fields
    initializeFormFields();
    
    // Initialize sliders
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('input', () => updateSliderLabel(slider.id));
    });

    // Home Airport Event Listeners
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

    // Custom Airport Input Validation
    const customAirportInput = document.querySelector('#customHomeAirport input');
    if (customAirportInput) {
        customAirportInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^A-Za-z\s]/g, '');
            updateAllExplanationTexts();
        });
    }

    // Section Navigation Event Listeners
    document.getElementById('calculatePointsBtn').addEventListener('click', function(e) {
        e.preventDefault();
        
        const travelFrequency = document.getElementById('travelFrequency').value;
        if (!travelFrequency || travelFrequency === '0') {
            document.getElementById('travelFrequency').classList.add('error');
            alert('Please enter how many times you travel per year');
            return;
        }

        document.getElementById('travelFrequency').classList.remove('error');
        
        try {
            calculatePoints();
            const resultsSection = document.getElementById('results');
            if (resultsSection) {
                resultsSection.classList.remove('hidden');
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                updateProgressBar('section1');
            }
        } catch (error) {
            console.error("Error calculating points:", error);
            alert('There was an error calculating your points. Please try again.');
        }
    });

    // Continue Button
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            const travelFrequency = document.getElementById('travelFrequency').value;
            if (!travelFrequency || travelFrequency === '0') {
                document.getElementById('travelFrequency').classList.add('error');
                alert('Please enter how many times you travel per year');
                return;
            }
            calculatePoints();
            nextSection('section1', 'section2');
            updateProgressBar('section2');
            preSelectBenefitsValues();
        });
    }

    // Back Buttons
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

    document.getElementById('backToSection3').addEventListener('click', function(e) {
        e.preventDefault();
        nextSection('section4', 'section3');
        updateProgressBar('section3');
    });

    // Continue to Section 3 Button
    document.getElementById('continueToSection3Btn').addEventListener('click', function() {
        console.log('Continue to Section 3 clicked');
        nextSection('section2', 'section3');
        updateProgressBar('section3');
        setTimeout(() => {
            preSelectPerkValues();
            console.log('Perks pre-selected');
        }, 100);
    });

    // Calculate Valuation Button
    const calculateValuationBtn = document.getElementById('calculateValuationBtn');
    if (calculateValuationBtn) {
        calculateValuationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Calculate Valuation button clicked");
            calculateFinalValuation();
            updateProgressBar('section4');
        });
    }

    // Update explanation texts when relevant fields change
    ['travelFrequency', 'homeAirport'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateAllExplanationTexts);
    });

    document.getElementById('hotelSpend').addEventListener('blur', updateAllExplanationTexts);

    // Initialize travel frequency group
    const travelFrequencyGroup = document.getElementById('travelFrequency').closest('.question-group');
    const titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';
    const existingLabel = travelFrequencyGroup.querySelector('label');
    titleContainer.appendChild(existingLabel);
    const disclaimer = document.createElement('span');
    disclaimer.className = 'disclaimer';
    disclaimer.innerHTML = 'Count each round-trip as one trip (e.g., NYC to LA and back = one trip).';
    titleContainer.appendChild(disclaimer);
    travelFrequencyGroup.insertBefore(titleContainer, travelFrequencyGroup.firstChild);
});

// Helper function to update valuation display
function updateValuationDisplay(firstYearValue, secondYearValue, pointsValue, section2Value, section3Value, signupBonusValue) {
    function updateValueWithClass(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = '$' + Math.round(value).toLocaleString();
            element.classList.remove('positive', 'negative');
            element.classList.add(value >= 0 ? 'positive' : 'negative');
        }
    }

    updateValueWithClass('firstYearSavings', firstYearValue);
    updateValueWithClass('secondYearSavings', secondYearValue);
    updateValueWithClass('firstYearValue', firstYearValue);
    updateValueWithClass('secondYearValue', secondYearValue);

    document.getElementById('annualFee').textContent = '$' + ANNUAL_FEE.toLocaleString();
    document.getElementById('signupBonusValue').textContent = '$' + Math.round(signupBonusValue).toLocaleString();
    document.getElementById('pointsSpendingValue').textContent = Math.round(pointsValue).toLocaleString();
    document.getElementById('pointsSpendingValueSecondYear').textContent = Math.round(pointsValue).toLocaleString();
    document.getElementById('cardBenefitsValue').textContent = Math.round(section2Value).toLocaleString();
    document.getElementById('cardBenefitsValueSecondYear').textContent = Math.round(section2Value).toLocaleString();
    document.getElementById('travelPerksValue').textContent = Math.round(section3Value).toLocaleString();
    document.getElementById('travelPerksValueSecondYear').textContent = Math.round(section3Value).toLocaleString();
    document.getElementById('signupBonusBreakdown').textContent = Math.round(signupBonusValue).toLocaleString();

    hideAllSections();
    document.getElementById('section4').classList.remove('hidden');
    updateProgressBar('section4');
    window.scrollTo(0, 0);
}
function showError(message) {
    // Remove any existing error modal
    const existingModal = document.querySelector('.error-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'error-modal';

    // Add message
    const messageP = document.createElement('p');
    messageP.textContent = message;
    modal.appendChild(messageP);

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.onclick = () => {
        overlay.remove();
        modal.remove();
    };
    modal.appendChild(closeButton);

    // Add to document
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

// Update the error handling in your existing code
function handleCalculationError(error, section) {
    console.error(`Error in ${section}:`, error);
    showError(`There was an error calculating your ${section.toLowerCase()}. Please try again.`);
}
