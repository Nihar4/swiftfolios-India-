export function isEmpty(value) {
    return value === undefined || value === null || value === '';
}

export function checkLength(value, length) {
    return value && value.length == length;
}

export const isValidEmail = (email) => {
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailPattern.test(email);
};

export const isValidPhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\d{10,}$/;
    return phoneNumberPattern.test(phoneNumber);
};

export const isValidPan = (pan) => {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    return panPattern.test(pan.toUpperCase());
};

