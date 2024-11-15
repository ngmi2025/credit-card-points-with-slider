document.addEventListener('DOMContentLoaded', function() {
    const WELCOME_BONUS = 80000;
    const POINT_VALUE = 0.022;
    const ANNUAL_FEE = 595;

    function formatCurrency(input) {
    // Remove existing formatting
    let value = input.value.replace(/[^\d]/g, '');
    
    // Format the number
    if (value) {
        value = parseInt(value, 10).toLocaleString('en-US');
    }
    
    // Add the dollar sign
    input.value = value ? '$' + value : '';
}

    function hideAllSections() {
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
    }

    hideAllSections();
    document.getElementById('section1').style.display = 'block';

    // Points Calculation for Section 1
function calculatePoints() {
    const flightSpend = parseFloat(document.getElementById('flightSpend').value.replace(/[^\d.-]/g, '')) || 0;
    const hotelSpend = parseFloat(document.getElementById('hotelSpend').value.replace(/[^\d.-]/g, '')) || 0;
    const otherSpend = parseFloat(document.getElementById('otherSpend').value.replace(/[^\d.-]/g, '')) || 0;

    const travelPoints = (flightSpend + hotelSpend) * 5;
    const otherPoints = otherSpend;
    const totalPoints = travelPoints + otherPoints;

    const totalValuation = (WELCOME_BONUS + totalPoints) * POINT_VALUE;

    document.getElementById('totalPoints').value = Math.round(totalPoints).toLocaleString() + ' points';
    document.getElementById('welcomeBonus').value = WELCOME_BONUS.toLocaleString() + ' points';
    document.getElementById('amexValuation').value = '$' + Math.round(totalValuation).toLocaleString();

    document.getElementById('results').style.display = 'block';
}

    // Calculate Section 2 using slider values
function calculateSection2Value(isFirstYear = true) {
    const credits = [
        { id: 'airlineCredit', value: 200 },
        { id: 'uberCredit', value: 200 },
        { id: 'saksCredit', value: 100 },
        { id: 'equinoxCredit', value: 300 },
        { id: 'clearCredit', value: 189 },
        { id: 'globalEntryCredit', value: 100, isGlobalEntry: true },
        { id: 'soulCycleCredit', value: 300 },
        { id: 'entertainmentCredit', value: 240 },
        { id: 'walmartCredit', value: 155 },
        { id: 'hotelCredit', value: 200 }
    ];

    return credits.reduce((total, credit) => {
        const sliderValue = parseInt(document.getElementById(credit.id).value);
        
        // Special handling for Global Entry
        if (credit.isGlobalEntry) {
            if (isFirstYear) {
                // Store the first year usage for later calculation
                window.globalEntryFirstYearUsage = sliderValue;
                return total + sliderValue;
            } else {
                // Calculate remaining value for subsequent years
                const remainingValue = 100 - window.globalEntryFirstYearUsage;
                return total + (remainingValue > 0 ? remainingValue : 0);
            }
        }
        
        return total + sliderValue;
    }, 0);
}

function calculateSection3Value() {
    const travelFrequency = parseInt(document.getElementById('travelFrequency').value.replace(/[^\d.-]/g, '')) || 0;
    
    const perks = [
        { id: 'loungeAccess', valuePerUse: 50 },     // Lounge access worth $50 per visit
        { id: 'partnerStatus', valuePerUse: 40 },    // Status benefits worth $40 per trip
        { id: 'fhrAndIap', valuePerUse: 100 },       // FHR benefits worth $100 per stay
        { id: 'cardProtections', valuePerUse: 30 }    // Protections worth $30 per trip
    ];
    
    return perks.reduce((total, perk) => {
        const sliderValue = parseInt(document.getElementById(perk.id).value);
        const perkValue = travelFrequency * perk.valuePerUse * (sliderValue / 4);
        
        console.log(`${perk.id}: ${travelFrequency} trips × $${perk.valuePerUse} × ${sliderValue}/4 = $${perkValue}`);
        
        return total + perkValue;
    }, 0);
}

function calculateFinalValuation() {
     const travelFrequency = parseInt(document.getElementById('travelFrequency').value.replace(/[^\d.-]/g, ''));
    
    if (!travelFrequency) {
        alert('Please enter your travel frequency in section 1');
        nextSection('section4', 'section1');
        return;
    }
    
    console.log("Calculating final valuation");
    const totalPoints = parseInt(document.getElementById('totalPoints').value.replace(/[^\d.-]/g, '')) || 0;
    const pointsValue = totalPoints * POINT_VALUE;
    const section2Value = calculateSection2Value();
    const section3Value = calculateSection3Value();

    // Add debugging logs
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
            travelFrequency: parseInt(document.getElementById('travelFrequency').value) || 0,
            loungeValue: parseInt(document.getElementById('loungeAccess').value),
            statusValue: parseInt(document.getElementById('partnerStatus').value),
            fhrValue: parseInt(document.getElementById('fhrAndIap').value),
            protectionsValue: parseInt(document.getElementById('cardProtections').value)
        }
    });

    const yearlyValue = pointsValue + section2Value + section3Value;
    const signupBonusValue = WELCOME_BONUS * POINT_VALUE;
    const firstYearValue = yearlyValue + signupBonusValue - ANNUAL_FEE;
    const secondYearValue = yearlyValue - ANNUAL_FEE;

    // Add value debugging logs
    console.log({
        yearlyValue,
        signupBonusValue,
        firstYearValue,
        secondYearValue
    });

    const firstYearSavings = document.getElementById('firstYearSavings');
    const secondYearSavings = document.getElementById('secondYearSavings');
    
    firstYearSavings.textContent = '$' + Math.round(firstYearValue).toLocaleString();
    secondYearSavings.textContent = '$' + Math.round(secondYearValue).toLocaleString();
    
    firstYearSavings.style.color = firstYearValue >= 0 ? '#3EB564' : '#d32f2f';
    secondYearSavings.style.color = secondYearValue >= 0 ? '#3EB564' : '#d32f2f';
    
    document.getElementById('annualFee').textContent = '$' + ANNUAL_FEE;
    document.getElementById('signupBonusValue').textContent = '$' + Math.round(signupBonusValue);
    document.getElementById('secondYearValue').textContent = '$' + Math.round(secondYearValue);
    
    // Add these new lines for the breakdown
    document.getElementById('cardBenefitsValue').textContent = Math.round(section2Value + section3Value).toLocaleString();
    document.getElementById('signupBonusBreakdown').textContent = Math.round(signupBonusValue).toLocaleString();
    document.getElementById('firstYearValue').textContent = '$' + Math.round(firstYearValue).toLocaleString();

    hideAllSections();
    document.getElementById('section4').style.display = 'block';
    updateProgressBar('section4');
    window.scrollTo(0, 0);
}

    // Progress Bar Update
    function updateProgressBar(currentSection) {
        const progress = document.getElementById('progress');
        const steps = document.querySelectorAll('.step');
        
        steps.forEach(step => step.classList.remove('active'));
        
        switch(currentSection) {
            case 'section1':
                progress.style.width = '25%';
                steps[0].classList.add('active');
                break;
            case 'section2':
                progress.style.width = '50%';
                steps[1].classList.add('active');
                break;
            case 'section3':
                progress.style.width = '75%';
                steps[2].classList.add('active');
                break;
            case 'section4':
                progress.style.width = '100%';
                steps[3].classList.add('active');
                break;
        }
    }

    // Section Navigation
    function nextSection(currentSection, nextSection) {
        hideAllSections();
        document.getElementById(nextSection).style.display = 'block';
        if (nextSection !== 'section1') {
            document.getElementById('results').style.display = 'none';
        }
        updateProgressBar(nextSection);
        window.scrollTo(0, 0);
    }

    // Event Listeners
   document.getElementById('calculatePointsBtn').addEventListener('click', function(e) {
    // Check if travel frequency has a value
    const travelFrequency = document.getElementById('travelFrequency').value;
    
    if (!travelFrequency || travelFrequency === '0') {
        // Prevent calculation
        e.preventDefault();
        
        // Add error class to the input
        document.getElementById('travelFrequency').classList.add('error');
        
        // You can either show an alert
        alert('Please enter how many times you travel per year');
        
        return;
    }
    
    // Remove error class if it exists
    document.getElementById('travelFrequency').classList.remove('error');
    
    // Continue with calculation
    calculatePoints();
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
});
    document.getElementById('continueBtn').addEventListener('click', function() {
        nextSection('section1', 'section2');
    });

    document.getElementById('continueToSection3Btn').addEventListener('click', function() {
        nextSection('section2', 'section3');
    });

    document.getElementById('calculateValuationBtn').addEventListener('click', function(e) {
        e.preventDefault();
        console.log("Calculate Valuation button clicked");
        calculateFinalValuation();
    });

    document.getElementById('backToSection1').addEventListener('click', function(e) {
        e.preventDefault();
        nextSection('section2', 'section1');
    });

    document.getElementById('backToSection2').addEventListener('click', function(e) {
        e.preventDefault();
        nextSection('section3', 'section2');
    });

    document.getElementById('backToSection3').addEventListener('click', function(e) {
        e.preventDefault();
        nextSection('section4', 'section3');
    });

// Format currency inputs
['flightSpend', 'hotelSpend', 'otherSpend'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('focus', function() {
        if (this.value === '$0') this.value = '';
    });
    input.addEventListener('blur', function() {
        formatCurrency(this);
        if (this.value === '') this.value = '$0';
    });
    // Initialize with $0
    input.value = '$0';
});
    document.getElementById('travelFrequency').addEventListener('blur', function() {
    let value = this.value.replace(/[^\d]/g, '');
    if (value === '') value = '0';
    // Ensure value is not negative
    value = Math.max(0, parseInt(value));
    this.value = value;
});
 // Add the new Global Entry slider event listener here
document.getElementById('globalEntryCredit').addEventListener('input', function() {
    const value = parseInt(this.value);
    const remaining = 100 - value;
    document.getElementById('globalEntryCreditFirst').textContent = value;
    document.getElementById('globalEntryCreditRemaining').textContent = remaining > 0 ? remaining : 0;
});   
    // Update the labels for Credit Card Perks sliders
    document.querySelectorAll('#section3 .slider-labels').forEach(labelGroup => {
    labelGroup.innerHTML = '<span>Never</span><span>Rarely</span><span>Sometimes</span><span>Often</span><span>Always</span>';
    });
});
