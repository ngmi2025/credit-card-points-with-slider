document.addEventListener('DOMContentLoaded', function() {
    const WELCOME_BONUS = 80000;
    const POINT_VALUE = 0.022;
    const ANNUAL_FEE = 595;

        updateProgressBar('section1');

        // Add the new function here
    function updateSliderLabel(sliderId) {
        const slider = document.getElementById(sliderId);
        const labels = slider.parentElement.querySelector('.slider-labels').children;
        const value = parseInt(slider.value);
        const maxValue = parseInt(slider.max);
        const selectedIndex = Math.round((value / maxValue) * (labels.length - 1));

        // Remove bold from all labels
        Array.from(labels).forEach(label => {
            label.classList.remove('selected');
        });

        // Add bold to selected label
        labels[selectedIndex].classList.add('selected');
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

function preSelectPerkValues() {
    try {
        // Get values from Section 1
        const travelFrequency = parseInt(document.getElementById('travelFrequency').value) || 0;
        const hotelSpend = parseFloat(document.getElementById('hotelSpend').value.replace(/[^0-9.-]+/g, '')) || 0;
        const homeAirport = document.getElementById('homeAirport').value;

        // Centurion Lounge airports
        const centurionAirports = ['ATL', 'DEN', 'DFW', 'IAH', 'JFK', 'LAX', 'LGA', 'MIA', 'PHL', 'PHX', 'SEA', 'SFO'];
        const otherLoungeAirports = ['BOS', 'CLT', 'DTW', 'EWR', 'IAD', 'ORD'];

        // 1. Lounge Access Logic
        let loungeValue = 1; // Default to lowest
        if (centurionAirports.includes(homeAirport) && travelFrequency > 6) {
            loungeValue = 4; // High
        } else if ((centurionAirports.includes(homeAirport) && travelFrequency >= 3) || 
                   (otherLoungeAirports.includes(homeAirport) && travelFrequency > 6)) {
            loungeValue = 2; // Medium
        }

        // 2. Partner Elite Status
        let statusValue = 1;
        if (hotelSpend > 5000) {
            statusValue = 4;
        } else if (hotelSpend >= 2000) {
            statusValue = 2;
        }

        // 3. FHR Access
        let fhrValue = 1;
        if (hotelSpend > 7500) {
            fhrValue = 4;
        } else if (hotelSpend >= 3000) {
            fhrValue = 2;
        }

        // 4. Card Protections
        let protectionValue = 1;
        if (travelFrequency > 8) {
            protectionValue = 4;
        } else if (travelFrequency >= 4) {
            protectionValue = 2;
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

    } catch (error) {
        console.error("Error in preSelectPerkValues:", error);
        // Set default values as fallback
        ['loungeAccess', 'partnerStatus', 'fhrAndIap', 'cardProtections'].forEach(id => {
            document.getElementById(id).value = 1;
            updateSliderLabel(id);
        });
    }
}

// Modify your continue button event listener
document.getElementById('continueToSection3Btn').addEventListener('click', function() {
    nextSection('section2', 'section3');
    updateProgressBar('section3');
    preSelectPerkValues(); 
});

function preSelectBenefitsValues() {
    try {
        // Get values from Section 1
        const travelFrequency = parseInt(document.getElementById('travelFrequency').value) || 0;
        const hotelSpend = parseFloat(document.getElementById('hotelSpend').value.replace(/[^0-9.-]+/g, '')) || 0;
        const homeAirport = document.getElementById('homeAirport').value;

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
            saksCredit: luxuryMarketAirports.includes(homeAirport) ? 4 :
                       (majorUrbanAirports.includes(homeAirport) ? 2 : 1),

            // 4. Equinox Credit
            equinoxCredit: nycAirports.includes(homeAirport) ? 4 :
                          (equinoxMarkets.includes(homeAirport) ? 2 : 1),

            // 5. CLEAR Credit
            clearCredit: (clearAirports.includes(homeAirport) && travelFrequency > 6) ? 4 :
                        (clearAirports.includes(homeAirport) && travelFrequency >= 3) ? 2 : 1,

            // 6. Global Entry/TSA PreCheck
globalEntryCredit: travelFrequency > 6 ? 4 : (travelFrequency >= 3 ? 2 : 1),
            
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

        // Debug logging
        console.log('Pre-selection values for benefits:', {
            travelFrequency,
            hotelSpend,
            homeAirport,
            creditValues
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
            'clearCredit', 'globalEntryCredit', 'entertainmentCredit',
            'walmartCredit', 'hotelCredit', 'soulCycleCredit'
        ];
        creditIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = 1;
                updateSliderLabel(id);
            }
        });
    }
}
function updateExplanationText() {
    try {
        const travelFrequency = parseInt(document.getElementById('travelFrequency').value) || 0;
        const hotelSpend = parseFloat(document.getElementById('hotelSpend').value.replace(/[^0-9.-]+/g, '')) || 0;
        const homeAirport = document.getElementById('homeAirport').value || 'selected airport';

        const explanationText = document.querySelector('.pre-selection-notice p');
        if (!explanationText) {
            console.error('Explanation text element not found');
            return;
        }

        // Format hotel spend with commas
        const formattedHotelSpend = hotelSpend.toLocaleString();

        // Create explanation text with conditional parts
        let text = `Based on your travel patterns (${travelFrequency} trip${travelFrequency !== 1 ? 's' : ''} per year`;
        
        // Only include hotel spend if it's greater than 0
        if (hotelSpend > 0) {
            text += `, $${formattedHotelSpend} hotel spend`;
        }
        
        text += `) and home airport of ${homeAirport}, we've pre-selected suggested values for how much of each credit you might use yearly. These suggestions reflect typical usage patterns for similar travelers, but you can adjust any value to better match your expected usage.`;

        explanationText.textContent = text;

    } catch (error) {
        console.error('Error updating explanation text:', error);
        // Fallback to simpler message if there's an error
        const explanationText = document.querySelector('.pre-selection-notice p');
        if (explanationText) {
explanationText.textContent = "We've pre-selected suggested values based on your travel patterns. Please adjust these values to match your expected usage.";        }
    }
}
    
    // Points Calculation for Section 1
function calculatePoints() {
    const flightSpend = parseFloat(document.getElementById('flightSpend').value.replace(/[^0-9.-]+/g, '')) || 0;
    const hotelSpend = parseFloat(document.getElementById('hotelSpend').value.replace(/[^0-9.-]+/g, '')) || 0;
    const otherSpend = parseFloat(document.getElementById('otherSpend').value.replace(/[^0-9.-]+/g, '')) || 0;

    // Cap flight spend at $500,000
    const cappedFlightSpend = Math.min(flightSpend, 500000);
    const uncappedFlightSpend = Math.max(0, flightSpend - 500000); // Amount over $500k

    console.log('Flight Spend (Original):', flightSpend);
    console.log('Flight Spend (Capped):', cappedFlightSpend);
    console.log('Flight Spend (Uncapped):', uncappedFlightSpend);
    console.log('Hotel Spend:', hotelSpend);
    console.log('Other Spend:', otherSpend);

    // Calculate points: 5x on capped flight spend, 1x on uncapped amount
    const travelPoints = (cappedFlightSpend + hotelSpend) * 5;
    const otherPoints = otherSpend + uncappedFlightSpend;
    const totalPoints = travelPoints + otherPoints;

    console.log('Travel Points:', travelPoints);
    console.log('Other Points:', otherPoints);
    console.log('Total Points:', totalPoints);

    const totalValuation = (WELCOME_BONUS + totalPoints) * POINT_VALUE;

    // Update values using IDs
    document.getElementById('totalPointsValue').textContent = Math.round(totalPoints).toLocaleString() + ' points';
    document.getElementById('welcomeBonusValue').textContent = WELCOME_BONUS.toLocaleString() + ' points';
    document.getElementById('valuationValue').textContent = '$' + Math.round(totalValuation).toLocaleString();

    document.getElementById('results').classList.remove('hidden');
    console.log('Results displayed');
}
    // Calculate Section 2 Value
function calculateSection2Value(isFirstYear = true) {
    const credits = [
        { id: 'airlineCredit', value: 200, steps: 5 },
        { id: 'uberCredit', value: 200, steps: 5 },
        { id: 'saksCredit', value: 100, steps: 5 },
        { id: 'equinoxCredit', value: 300, steps: 5 },
        { id: 'clearCredit', value: 199, steps: 5 },
        { id: 'soulCycleCredit', value: 300, steps: 5 },
        { id: 'entertainmentCredit', value: 240, steps: 5 },
        { id: 'walmartCredit', value: 155, steps: 5 },
        { id: 'hotelCredit', value: 200, steps: 5 }
    ];

    let total = credits.reduce((sum, credit) => {
        const sliderValue = parseInt(document.getElementById(credit.id)?.value || 0);
        const creditValue = (credit.value / 4) * sliderValue; // Still divide by 4 as we want 0,25%,50%,75%,100%
        return sum + creditValue;
    }, 0);

    // Add Global Entry/TSA PreCheck value
    const globalEntryValue = parseInt(document.getElementById('globalEntryCredit').value) || 0;
    if (isFirstYear) {
        total += globalEntryValue;
    }

    return total;
}

    function calculateSection3Value() {
        const travelFrequency = parseInt(document.getElementById('travelFrequency').value.replace(/[^ -\u007F]+/g, '')) || 0;

        const perks = [
            { id: 'loungeAccess', valuePerUse: 50 },
            { id: 'partnerStatus', valuePerUse: 40 },
            { id: 'fhrAndIap', valuePerUse: 100 },
        ];

        return perks.reduce((total, perk) => {
            const sliderValue = parseInt(document.getElementById(perk.id).value);
            const perkValue = travelFrequency * perk.valuePerUse * (sliderValue / 4);

            console.log(`${perk.id}: ${travelFrequency} trips × $${perk.valuePerUse} × ${sliderValue}/4 = $${perkValue}`);

            return total + perkValue;
        }, 0);
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
    const travelFrequency = document.getElementById('travelFrequency').value;

    if (!travelFrequency || travelFrequency === '0') {
        e.preventDefault();
        document.getElementById('travelFrequency').classList.add('error');
        alert('Please enter how many times you travel per year');
        return;
    }

    document.getElementById('travelFrequency').classList.remove('error');
    try {
        calculatePoints();
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
                updateProgressBar('section1'); 

    } catch (error) {
        console.error("Error calculating points:", error);
    }
});

const continueBtn = document.getElementById('continueBtn');
if (!continueBtn) {
    console.error('Continue button not found');
} else {
    continueBtn.addEventListener('click', function() {
        console.log('Continue button clicked'); // Debug log
        const travelFrequency = document.getElementById('travelFrequency').value;

        if (!travelFrequency || travelFrequency === '0') {
            document.getElementById('travelFrequency').classList.add('error');
            alert('Please enter how many times you travel per year');
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

document.getElementById('continueToSection3Btn').addEventListener('click', function() {
    nextSection('section2', 'section3');
    updateProgressBar('section3');  
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
        calculateFinalValuation();
        updateProgressBar('section4'); 
    });
} else {
    console.error("Calculate Valuation button not found");
}

document.getElementById('backToSection3').addEventListener('click', function(e) {
    e.preventDefault();
    nextSection('section4', 'section3');
    updateProgressBar('section3');  
});

['flightSpend', 'hotelSpend', 'otherSpend'].forEach(id => {
    const input = document.getElementById(id);
    if (!input) {
        console.error(`Input element with id ${id} not found`);
        return;
    }
    
    // On focus (when clicking into the input)
    input.addEventListener('focus', function() {
        const value = this.value.replace(/[$,]/g, ''); // Remove $ and commas
        this.value = value;
    });

    // On blur (when clicking away from the input)
    input.addEventListener('blur', function() {
        let value = this.value.replace(/[^\d]/g, ''); // Remove non-digits
        if (value) {
            value = parseInt(value, 10);
            this.value = '$' + value.toLocaleString('en-US');
        } else {
            this.value = '$0';
        }
    });

    // Set initial value
    input.value = '$0';
});

    document.getElementById('travelFrequency').addEventListener('blur', function() {
        let value = this.value.replace(/[^ -\u007F]+/g, '');
        if (value === '') value = '0';
        value = Math.max(0, parseInt(value));
        this.value = value;
    });
       
    document.querySelectorAll('.slider').forEach(slider => {
        slider.addEventListener('input', () => updateSliderLabel(slider.id));
        // Initialize labels on page load
        updateSliderLabel(slider.id);
    });

    document.querySelectorAll('#section3 .slider-labels').forEach(labelGroup => {
        labelGroup.innerHTML = '<span>Never</span><span>Rarely</span><span>Sometimes</span><span>Often</span><span>Always</span>';
    });
});
function refreshExplanationText() {
    const notice = document.querySelector('.pre-selection-notice');
    if (notice) {
        updateExplanationText();
        // Add highlight effect
        notice.classList.add('updated');
        // Remove highlight after animation
        setTimeout(() => {
            notice.classList.remove('updated');
        }, 1000);
    }
}

// Add to relevant event listeners
document.getElementById('travelFrequency').addEventListener('change', refreshExplanationText);
document.getElementById('hotelSpend').addEventListener('change', refreshExplanationText);
document.getElementById('homeAirport').addEventListener('change', refreshExplanationText);
