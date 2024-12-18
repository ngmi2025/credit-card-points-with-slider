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
    } catch (error) {
        console.error("Error calculating points:", error);
    }
});

document.getElementById('continueBtn').addEventListener('click', function() {
    nextSection('section1', 'section2');
    updateProgressBar('section2');  // Add this line
});

document.getElementById('backToSection1').addEventListener('click', function(e) {
    e.preventDefault();
    nextSection('section2', 'section1');
    updateProgressBar('section1');  // Add this line
});

document.getElementById('continueToSection3Btn').addEventListener('click', function() {
    nextSection('section2', 'section3');
    updateProgressBar('section3');  // Add this line
});

document.getElementById('backToSection2').addEventListener('click', function(e) {
    e.preventDefault();
    nextSection('section3', 'section2');
    updateProgressBar('section2');  // Add this line
});

const calculateValuationBtn = document.getElementById('calculateValuationBtn');
if (calculateValuationBtn) {
    calculateValuationBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log("Calculate Valuation button clicked");
        calculateFinalValuation();
        updateProgressBar('section4');  // Add this line
    });
} else {
    console.error("Calculate Valuation button not found");
}

document.getElementById('backToSection3').addEventListener('click', function(e) {
    e.preventDefault();
    nextSection('section4', 'section3');
    updateProgressBar('section3');  // Add this line
});

    ['flightSpend', 'hotelSpend', 'otherSpend'].forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('focus', function() {
            if (this.value === '$0') this.value = '';
        });
        input.addEventListener('blur', function() {
            formatCurrency(this);
            if (this.value === '') this.value = '$0';
        });
        input.value = '$0';
    });

    document.getElementById('travelFrequency').addEventListener('blur', function() {
        let value = this.value.replace(/[^ -\u007F]+/g, '');
        if (value === '') value = '0';
        value = Math.max(0, parseInt(value));
        this.value = value;
    });
        // Add this with your other initialization code
    document.querySelectorAll('.slider').forEach(slider => {
        slider.addEventListener('input', () => updateSliderLabel(slider.id));
        // Initialize labels on page load
        updateSliderLabel(slider.id);
    });

    document.querySelectorAll('#section3 .slider-labels').forEach(labelGroup => {
        labelGroup.innerHTML = '<span>Never</span><span>Rarely</span><span>Sometimes</span><span>Often</span><span>Always</span>';
    });
});
