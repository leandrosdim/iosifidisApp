// Utility function to ensure numeric values are correctly formatted
export const validateNumericInput = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? null : num; // Convert to null if not a valid number
  };
  