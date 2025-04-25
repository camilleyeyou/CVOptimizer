/**
 * Validates an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  // Basic email regex pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Validates a password for minimum requirements
 * @param {string} password - Password to validate
 * @returns {object} Object with isValid boolean and message string
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  return { isValid: true, message: 'Password is valid' };
};

/**
 * Validates that a field is not empty
 * @param {string} value - Value to check
 * @returns {boolean} True if value is not empty, false otherwise
 */
export const isNotEmpty = (value) => {
  return value !== null && value !== undefined && value.trim() !== '';
};

/**
 * Validates a date is not in the future
 * @param {string} dateString - ISO date string to validate
 * @returns {boolean} True if date is not in the future, false otherwise
 */
export const isNotFutureDate = (dateString) => {
  if (!dateString) return true; // Date can be empty
  
  const date = new Date(dateString);
  const today = new Date();
  
  return date <= today;
};

/**
 * Validates that the end date is after the start date
 * @param {string} startDateString - ISO date string for start date
 * @param {string} endDateString - ISO date string for end date
 * @returns {boolean} True if end date is after start date, false otherwise
 */
export const isEndDateAfterStartDate = (startDateString, endDateString) => {
  if (!endDateString) return true; // End date can be empty (current position)
  if (!startDateString) return false; // Start date should not be empty
  
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  
  return endDate >= startDate;
};