function isEmpty(value) {
    return value === undefined || value === null || value === '';
}

function validateEmail(email) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
}

function checkLength(value, length) {
    return value.length == length;
}

const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\d{10,}$/;
    return phoneNumberPattern.test(phoneNumber);
};

const validatePan = (pan) => {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    return panPattern.test(pan.toUpperCase());
};

module.exports = {
    isEmpty,
    validateEmail,
    checkLength,
    validatePhoneNumber,
    validatePan
};
