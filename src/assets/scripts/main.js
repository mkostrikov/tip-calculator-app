const validationsTipCalculator = {
    bill: (value) => value === '' || (/^\d+(\.\d{1,2})?$/.test(value) && +value > 0),
    tip: (value) => value === '' || +value >= 1 && +value <= 100,
    people: (value) => value === '' || Number.isInteger(+value) && +value > 0,
}

document.getElementById('tip-custom').addEventListener('change', (e) => {
    passDataFromInputToRadio(e.target, document.getElementById('radio-hidden'));
});

document.getElementById('tip-calculator').addEventListener('change', function (e) {
    e.preventDefault();
    tipCalculation(this, validationsTipCalculator, checkInvalidFormFields);
});

function checkInvalidFormFields(formData, validations) {
    const dataIsValid = (key, value, validations) => {
        if (!validations[key]) return false;
        return validations[key](value);
    };

    return Object.entries(formData)
        .map(([name, value]) => {
            return !dataIsValid(name, value, validations) ? name : false;
        })
        .filter((name) => !!name);
}

function passDataFromInputToRadio(input, radio) {
    radio.checked = true;
    radio.value = input.value;
}

function tipCalculation(form, validationsTipCalculator, checkInvalidFormFields) {
    const formFields = {
        bill: form.bill,
        tip: document.getElementById('tip-group'),
        people: form.people
    };
    const formData = Object.fromEntries(new FormData(form));
    const invalidFieldsNames = checkInvalidFormFields(formData, validationsTipCalculator);
    const amountHtml = document.getElementById('tip-amount');
    const totalHtml = document.getElementById('total');
    const resetBtn = document.getElementById('reset-btn');

    const printResult = (amount, total) => {
        amountHtml.textContent = amount;
        totalHtml.textContent = total;
    };

    const resetResult = () => {
        amountHtml.textContent = '-';
        totalHtml.textContent = '-';
        toggleResetBtn(true);
        form.reset();
    };

    const toggleResetBtn = (force) => {
        resetBtn.toggleAttribute('disabled', force);
    };
    
    const  allInputErrorDisplay = (fields, invalidFieldsNames) => {
        invalidFieldsNames.forEach(name => {
            const errorField = document.getElementById(`${name}-validation`);
            if (typeof errorField !== 'undefined') {
                errorField.classList.add('validation-message--display');
            }
            fields[name].classList.add('invalid');
        });
    };
    
    const allInputErrorClear = (fields) => {
        Object.entries(fields).forEach(([name, element]) => {
            element.classList.remove('invalid');
            document.getElementById(`${name}-validation`).classList.remove('validation-message--display');
        });
    };

    if (!(amountHtml && totalHtml && resetBtn && !Object.values(formFields).some(el => typeof el === 'undefined'))) return;

    resetBtn.addEventListener('click', resetResult);

    allInputErrorClear(formFields);

    if (invalidFieldsNames.length === 0) {
        const {bill, tip, people} = formData;

        if (!(bill && tip && people)) return;

        const amount = (bill * tip / 100 / people).toFixed(2);
        const total = (bill / people + Number(amount)).toFixed(2);

        printResult(amount, total);
        toggleResetBtn(false);
    } else {
        allInputErrorDisplay(formFields, invalidFieldsNames);
    }
}