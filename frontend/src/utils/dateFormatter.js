/**
 * Formats a date string to MM/YYYY format
 * @param {string} dateString - ISO date string (e.g., '2021-05-01')
 * @returns {string} Formatted date string (e.g., 'May 2021')
 */
export const formatMonthYear = (dateString) => {
    if (!dateString) return 'Present';
  
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
    }).format(date);
  };
  
  /**
   * Formats a date string to full date format
   * @param {string} dateString - ISO date string (e.g., '2021-05-01')
   * @returns {string} Formatted date string (e.g., 'May 1, 2021')
   */
  export const formatFullDate = (dateString) => {
    if (!dateString) return '';
  
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  /**
   * Converts a date object to ISO date string (YYYY-MM-DD)
   * @param {Date} date - Date object
   * @returns {string} ISO date string (e.g., '2021-05-01')
   */
  export const toISODateString = (date) => {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };
  
  /**
   * Calculates the duration between two dates in years and months
   * @param {string} startDate - ISO date string (e.g., '2019-05-01')
   * @param {string} endDate - ISO date string (e.g., '2021-06-15'), or null for present
   * @returns {string} Duration string (e.g., '2 years, 1 month')
   */
  export const calculateDuration = (startDate, endDate) => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    
    let totalMonths = years * 12 + months;
    if (end.getDate() < start.getDate()) {
      totalMonths--;
    }
    
    const durationYears = Math.floor(totalMonths / 12);
    const durationMonths = totalMonths % 12;
    
    let result = '';
    
    if (durationYears > 0) {
      result += `${durationYears} year${durationYears > 1 ? 's' : ''}`;
    }
    
    if (durationMonths > 0) {
      if (result) {
        result += ', ';
      }
      result += `${durationMonths} month${durationMonths > 1 ? 's' : ''}`;
    }
    
    if (!result) {
      result = 'Less than a month';
    }
    
    return result;
  };