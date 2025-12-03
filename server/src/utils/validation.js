// validation.js - Validation utility functions

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  
  // At least 8 characters, one uppercase, one lowercase, one number
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return minLength && hasUpperCase && hasLowerCase && hasNumber;
};

const sanitizeInput = (input) => {
  if (input === null || input === undefined) return '';
  
  return String(input)
    .replace(/<[^>]*>/g, '')  // Remove HTML tags
    .trim();
};

const validateUsername = (username) => {
  if (!username || typeof username !== 'string') return false;
  
  // 3-30 characters, alphanumeric, underscore, and hyphen only
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username);
};

module.exports = {
  validateEmail,
  validatePassword,
  sanitizeInput,
  validateUsername,
};