document.addEventListener('DOMContentLoaded', function() {
    const WELCOME_BONUS = 80000;
    const POINT_VALUE = 0.022;
    const ANNUAL_FEE = 595;

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
        document.getElementById('amexValuation').value = '$' + Math.round(totalValuation);

        document.getElementById('results').classList.remove('hidden');
    }

    // Final Valuation Calculation
    function calculateFinalValuation() {
        const airlineCredit = parseFloat(document.getElementById('airlineCredit').value.replace(/[^\d.-]/g, '')) || 0;
        const uberCredit = parseFloat(document.getElementById('uberCredit').value.replace(/[^\d.-]/g, '')) || 0;
        const saksCredit = parseFloat(document.getElementById('saksCredit').value.replace(/[^\d.-]/g, '')) || 0;
        const equinoxCredit = parseFloat(document.getElementById('equinoxCredit').value.replace(/[^\d.-]/g, '')) || 0;
        const entertainmentCredit = parseFloat(document.getElementById('entertainmentCredit').value.replace(/[^\d.-]/g, '')) || 0;
        const clearCredit = parseFloat(document.getElementById('clearCredit').value.replace(/[^\d.-]/g, '')) || 0;
        const globalEntryCredit = parseFloat(document.getElementById('globalEntryCredit').value.replace(/[^\d.-]/g, '')) || 0;
        const soulCycleCredit = parseFloat(document.getElementById('soulCycleCredit').value.replace(/[^\d.-]/g, '')) || 0;
        const loungeAccess = parseFloat(document.getElementById('loungeAccess').value.replace(/[^\d.-]/g, '')) || 0;
        const partnerStatus = parseFloat(document.getElementById('partnerStatus').value.replace(/[^\d.-]/g, '')) || 0;

        const totalPoints = parseInt(document.getElementById('totalPoints').value.replace(/[^\d.-]/g, '')) || 0;
        const pointsValue = totalPoints * POINT_VALUE;
        const cardBenefits = airlineCredit + uberCredit + saksCredit + equinoxCredit + entertainmentCredit + clearCredit + globalEntryCredit + soulCycleCredit;
        const cardPerks = loungeAccess + partnerStatus;

        const yearlyValue = pointsValue + cardBenefits + cardPerks;
        const signupBonusValue = WELCOME_BONUS * POINT_VALUE;
        const firstYearValue = yearlyValue + signupBonusValue - ANNUAL_FEE;
        const secondYearValue = yearlyValue - ANNUAL_FEE;

        document.getElementById('yearlyValue').value = '$' + Math.round(yearlyValue);
        document.getElementById('signupBonusValue').value = '$' + Math.round(signupBonusValue);
        document.getElementById('annualFee').value = '$' + ANNUAL_FEE;
        document.getElementById('firstYearValue').value = '$' + Math.round(firstYearValue);
        document.getElementById('secondYearValue').value = '$' + Math.round(secondYearValue);

        document.getElementById('section3').classList.add('hidden');
        document.getElementById('section4').classList.remove('hidden');
        updateProgressBar('section4');
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
        document.getElementById(currentSection).classList.add('hidden');
        document.getElementById(nextSection).classList.remove('hidden');
        if (nextSection !== 'section1') {
            document.getElementById('results').classList.add('hidden');
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

    document.getElementById('calculateValuationBtn').addEventListener('click', function() {
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

    // Handle custom input for home airport
    document.getElementById('homeAirport').addEventListener('change', function() {
        const customInput = document.getElementById('customHomeAirport');
        if (this.value === 'custom') {
            customInput.classList.remove('hidden');
        } else {
            customInput.classList.add('hidden');
        }
    });

    // Format currency inputs
    const currencyInputs = document.querySelectorAll('.input-wrapper input[type="text"]:not(#travelFrequency)');
    currencyInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d]/g, '');
            if (value) {
                value = parseInt(value, 10);
                e.target.value = '$' + value.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
            }
        });
    });

    // Ensure travel frequency input only accepts numbers
    const travelFrequencyInput = document.getElementById('travelFrequency');
    travelFrequencyInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^\d]/g, '');
    });
});
