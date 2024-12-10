document.addEventListener('DOMContentLoaded', function() {
    const WELCOME_BONUS = 80000;
    const POINT_VALUE = 0.022;
    const ANNUAL_FEE = 595;

    let globalEntryFirstYearUsage = 0;

    function formatCurrency(input) {
        let value = input.value.replace(/[^0-9.-]+/g, '');
        if (value) {
            value = parseInt(value, 10).toLocaleString('en-US');
        }
        input.value = value ? '$' + value : '';
    }

    function hideAllSections() {
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
    }

    hideAllSections();
    document.getElementById('section1').style.display = 'block';

    // Event listener for radio buttons
    document.querySelectorAll('input[name="globalEntryOrPreCheck"]').forEach(radio => {
        radio.addEventListener('change', function () {
            const selectedValue = parseInt(this.value);
            const slider = document.getElementById('globalEntrySlider');
            const sliderLabels = slider.nextElementSibling;

            // Update slider max value and step based on selection
            if (selectedValue === 85) { // TSA PreCheck
                slider.max = 85;
                slider.step = 21.25; // Divides $85 into 4 equal steps
            } else { // Global Entry
                slider.max = 120;
                slider.step = 30; // Divides $120 into 4 equal steps
            }
            
            // Reset slider value
            slider.value = 0;

            // Update slider labels
            sliderLabels.innerHTML = '';
            const steps = selectedValue / 4;
            for (let i = 0; i <= selectedValue; i += steps) {
                const label = document.createElement('span');
                label.textContent = `$${Math.round(i)}`;
                sliderLabels.appendChild(label);
            }

            // Update credit values
            document.getElementById('globalEntryCreditFirst').textContent = '0';
            document.getElementById('globalEntryCreditRemaining').textContent = selectedValue;
        });
    });

    // Event listener for the slider
    document.getElementById('globalEntrySlider').addEventListener('input', function () {
        const selectedRadio = document.querySelector('input[name="globalEntryOrPreCheck"]:checked');
        const selectedValue = selectedRadio ? parseInt(selectedRadio.value) : 0;
        const sliderValue = parseInt(this.value);

        // Calculate the remaining value
        const remaining = selectedValue - sliderValue;

        // Update displayed values
        document.getElementById('globalEntryCreditFirst').textContent = sliderValue;
        document.getElementById('globalEntryCreditRemaining').textContent = remaining > 0 ? remaining : 0;

        console.log(`Slider Input: Slider Value = ${sliderValue}, Remaining = ${remaining}`);
    });

    // Points Calculation for Section 1
    function calculatePoints() {
        const flightSpend = parseFloat(document.getElementById('flightSpend').value.replace(/[^0-9.-]+/g, '')) || 0;
        const hotelSpend = parseFloat(document.getElementById('hotelSpend').value.replace(/[^0-9.-]+/g, '')) || 0;
        const otherSpend = parseFloat(document.getElementById('otherSpend').value.replace(/[^0-9.-]+/g, '')) || 0;

        // Debugging: Log input values
        console.log('Flight Spend:', flightSpend);
        console.log('Hotel Spend:', hotelSpend);
        console.log('Other Spend:', otherSpend);

        const travelPoints = (flightSpend + hotelSpend) * 5;
        const otherPoints = otherSpend;
        const totalPoints = travelPoints + otherPoints;

        // Debugging: Log calculated points
        console.log('Travel Points:', travelPoints);
        console.log('Other Points:', otherPoints);
        console.log('Total Points:', totalPoints);

        const totalValuation = (WELCOME_BONUS + totalPoints) * POINT_VALUE;

        // Debugging: Log valuation
        console.log('Total Valuation:', totalValuation);

        document.getElementById('totalPoints').value = Math.round(totalPoints).toLocaleString() + ' points';
        document.getElementById('welcomeBonus').value = WELCOME_BONUS.toLocaleString() + ' points';
        document.getElementById('amexValuation').value = '$' + Math.round(totalValuation).toLocaleString();

        document.getElementById('results').style.display = 'block';
        console.log('Results displayed');
    }

    // Calculate Section 2 Value
    function calculateSection2Value(isFirstYear = true) {
        const credits = [
            { id: 'airlineCredit', value: 200 },
            { id: 'uberCredit', value: 200 },
            { id: 'saksCredit', value: 100 },
            { id: 'equinoxCredit', value: 300 },
            { id: 'clearCredit', value: 199 },
            { id: 'soulCycleCredit', value: 300 },
            { id: 'entertainmentCredit', value: 240 },
            { id: 'walmartCredit', value: 155 },
            { id: 'hotelCredit', value: 200 }
        ];

        const globalEntryOrPreCheck = parseInt(document.querySelector('input[name="globalEntryOrPreCheck"]:checked')?.value || 0);

        return credits.reduce((total, credit) => {
            const sliderValue = parseInt(document.getElementById(credit.id)?.value || 0);

            if (credit.id === 'globalEntryCredit') {
                if (isFirstYear) {
                    globalEntryFirstYearUsage = globalEntryOrPreCheck;
                    return total + globalEntryOrPreCheck;
                } else {
                    const remainingValue = globalEntryOrPreCheck - globalEntryFirstYearUsage;
                    return total + (remainingValue > 0 ? remainingValue : 0);
                }
            }

            return total + sliderValue;
        }, 0);
    }

    function calculateSection3Value() {
        const travelFrequency = parseInt(document.getElementById('travelFrequency').value.replace(/[^ -\u007F]+/g, '')) || 0;

        const perks = [
            { id: 'loungeAccess', valuePerUse: 50 },
            { id: 'partnerStatus', valuePerUse: 40 },
            { id: 'fhrAndIap', valuePerUse: 100 },
            { id: 'cardProtections', valuePerUse: 30 }
        ];

        return perks.reduce((total, perk) => {
            const sliderValue = parseInt(document.getElementById(perk.id).value);
            const perkValue = travelFrequency * perk.valuePerUse * (sliderValue / 4);

            console.log(`${perk.id}: ${travelFrequency} trips × $${perk.valuePerUse} × ${sliderValue}/4 = $${perkValue}`);

            return total + perkValue;
        }, 0);
    }

    function calculateFinalValuation() {
        const travelFrequency = parseInt(document.getElementById('travelFrequency').value.replace(/[^ -\u007F]+/g, ''));

        if (!travelFrequency) {
            alert('Please enter your travel frequency in section 1');
            nextSection('section4', 'section1');
            return;
        }

        console.log("Calculating final valuation");
    const totalPoints = parseInt(document.getElementById('totalPoints').value.replace(/[^ -\u007F]+/g, '')) || 0;
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

         document.getElementById('firstYearSavings').textContent = '$' + Math.round(firstYearValue).toLocaleString();
    document.getElementById('secondYearSavings').textContent = '$' + Math.round(secondYearValue).toLocaleString();
    document.getElementById('annualFee').textContent = '$' + ANNUAL_FEE;
    document.getElementById('signupBonusValue').textContent = '$' + Math.round(signupBonusValue).toLocaleString();
    document.getElementById('firstYearValue').textContent = '$' + Math.round(firstYearValue).toLocaleString();
    document.getElementById('secondYearValue').textContent = '$' + Math.round(secondYearValue).toLocaleString();

     document.getElementById('pointsSpendingValue').textContent = Math.round(pointsValue).toLocaleString();
    document.getElementById('pointsSpendingValueSecondYear').textContent = Math.round(pointsValue).toLocaleString();
    document.getElementById('cardBenefitsValue').textContent = Math.round(section2Value + section3Value).toLocaleString();
    document.getElementById('cardBenefitsValueSecondYear').textContent = Math.round(section2Value + section3Value).toLocaleString();
    document.getElementById('signupBonusBreakdown').textContent = Math.round(signupBonusValue).toLocaleString();

        hideAllSections();
        document.getElementById('section4').style.display = 'block';
        updateProgressBar('section4');
        window.scrollTo(0, 0);
    }

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

    function nextSection(currentSectionId, nextSectionId) {
        hideAllSections();
        document.getElementById(nextSectionId).style.display = 'block';
        if (nextSectionId !== 'section1') {
            document.getElementById('results').style.display = 'none';
        }
        window.scrollTo(0, 0);
    }

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
    });

    document.getElementById('backToSection1').addEventListener('click', function(e) {
        e.preventDefault();
        nextSection('section2', 'section1');
    });

    document.getElementById('continueToSection3Btn').addEventListener('click', function() {
        nextSection('section2', 'section3');
    });

    document.getElementById('backToSection2').addEventListener('click', function(e) {
        e.preventDefault();
        nextSection('section3', 'section2');
    });

    document.getElementById('calculateValuationBtn').addEventListener('click', function(e) {
        e.preventDefault();
        nextSection('section3', 'section4');
    });

    document.getElementById('backToSection3').addEventListener('click', function(e) {
        e.preventDefault();
        nextSection('section4', 'section3');
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

    document.querySelectorAll('#section3 .slider-labels').forEach(labelGroup => {
        labelGroup.innerHTML = '<span>Never</span><span>Rarely</span><span>Sometimes</span><span>Often</span><span>Always</span>';
    });
});
