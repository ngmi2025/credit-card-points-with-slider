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
    function calculateSection2Value() {
        const credits = [
            { id: 'airlineCredit', value: 200 },
            { id: 'uberCredit', value: 200 },
            { id: 'saksCredit', value: 100 },
            { id: 'equinoxCredit', value: 300 },
            { id: 'clearCredit', value: 189 },
            { id: 'globalEntryCredit', value: 100 },
            { id: 'soulCycleCredit', value: 300 }
        ];

        return credits.reduce((total, credit) => {
            const sliderValue = parseInt(document.getElementById(credit.id).value);
            return total + sliderValue;
        }, 0);
    }

    // Calculate Section 3 using slider values
    function calculateSection3Value() {
        const travelFrequency = parseInt(document.getElementById('travelFrequency').value) || 0;
        const perks = ['loungeAccess', 'partnerStatus', 'fhrAndIap', 'cardProtections'];
        
        return perks.reduce((total, perkId) => {
            const sliderValue = parseInt(document.getElementById(perkId).value);
            return total + travelFrequency * 40 * (sliderValue / 4);
        }, 0);
    }

    // Final Valuation Calculation
    function calculateFinalValuation() {
        console.log("Calculating final valuation");
        const totalPoints = parseInt(document.getElementById('totalPoints').value.replace(/[^\d.-]/g, '')) || 0;
        const pointsValue = totalPoints * POINT_VALUE;
        const section2Value = calculateSection2Value();
        const section3Value = calculateSection3Value();

        const yearlyValue = pointsValue + section2Value + section3Value;
        const signupBonusValue = WELCOME_BONUS * POINT_VALUE;
        const firstYearValue = yearlyValue + signupBonusValue - ANNUAL_FEE;
const secondYearValue = yearlyValue - ANNUAL_FEE;
    const firstYearSavings = document.getElementById('firstYearSavings');
    const secondYearSavings = document.getElementById('secondYearSavings');
    
    firstYearSavings.textContent = '$' + Math.round(firstYearValue).toLocaleString();
    secondYearSavings.textContent = '$' + Math.round(secondYearValue).toLocaleString();
    
    firstYearSavings.style.color = firstYearValue >= 0 ? '#3EB564' : '#d32f2f';
    secondYearSavings.style.color = secondYearValue >= 0 ? '#3EB564' : '#d32f2f';
        document.getElementById('annualFee').textContent = '$' + ANNUAL_FEE;
        document.getElementById('signupBonusValue').textContent = '$' + Math.round(signupBonusValue);
        document.getElementById('secondYearValue').textContent = '$' + Math.round(secondYearValue);

        hideAllSections();
        document.getElementById('section4').style.display = 'block';
        updateProgressBar('section4');
        window.scrollTo(0, 0);
        console.log("Final valuation calculated and displayed");
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
    document.getElementById('calculatePointsBtn').addEventListener('click', function() {
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
    
    // Update the labels for Credit Card Perks sliders
    document.querySelectorAll('#section3 .slider-labels').forEach(labelGroup => {
        labelGroup.innerHTML = '<span>Never</span><span>Sometimes</span><span>Always</span>';
    });
});
