export const luhnCheck = (val: string): boolean => {
  let checksum = 0;
  let j = 1;

  for (let i = val.length - 1; i >= 0; i--) {
    let calc = 0;
    calc = Number(val.charAt(i)) * j;

    if (calc > 9) {
      checksum = checksum + 1;
      calc = calc - 10;
    }

    checksum = checksum + calc;

    if (j === 1) {
      j = 2;
    } else {
      j = 1;
    }
  }

  return (checksum % 10) === 0;
};

export const validateExpiry = (expiry: string): string | null => {
  // Expected format MM/YY
  if (!expiry || expiry.length !== 5 || !expiry.includes('/')) {
    return "Enter a valid month (01—12).";
  }

  const [monthStr, yearStr] = expiry.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
    return "Enter a valid month (01—12).";
  }

  // Check if expired
  // Assume 20xx
  const currentYear = new Date().getFullYear() % 100; // e.g. 25
  const currentMonth = new Date().getMonth() + 1; // 1-12

  if (year < currentYear) {
    return "This card is expired.";
  }

  if (year === currentYear && month <= currentMonth) {
     return "This card is expired.";
  }

  return null; // Valid
};

export const validateCVV = (cvv: string, cardType: string | null): string | null => {
    // Basic check for now as per requirements: "CVV must be 3 digits"
    // If we support Amex later, we can check cardType === 'amex'
    if (!cvv || (cvv.length !== 3 && cvv.length !== 4)) {
        return "CVV must be 3 digits."; // Keeping message generic for now as requested
    }

    // Strict 3 digits for Visa/Master/Rupay if strictly required, but usually 3.
    // The requirement says "CVV must be 3 digits", so I will enforce 3.
    if (cvv.length !== 3) {
        return "CVV must be 3 digits.";
    }

    return null;
};
