// validation.test.js - Unit tests for validation utility functions

const {
  validateEmail,
  validatePassword,
  sanitizeInput,
  validateUsername,
} = require('../../src/utils/validation');

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.co.uk',
        'user+tag@example.com',
      ];
      
      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should return false for invalid email addresses', () => {
      const invalidEmails = [
        'invalid',
        '@example.com',
        'user@',
        'user @example.com',
        '',
        null,
        undefined,
      ];
      
      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid passwords', () => {
      const validPasswords = [
        'Password123!',
        'SecureP@ss1',
        'MyP@ssw0rd',
      ];
      
      validPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(true);
      });
    });

    it('should return false for weak passwords', () => {
      const weakPasswords = [
        'short',
        'alllowercase',
        'ALLUPPERCASE',
        '12345678',
        'NoNumbers!',
        'nonumbers',
      ];
      
      weakPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(false);
      });
    });

    it('should require minimum length', () => {
      expect(validatePassword('Pass1!')).toBe(false);
      expect(validatePassword('Password1!')).toBe(true);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      const dirty = '<script>alert("xss")</script>Hello';
      const clean = sanitizeInput(dirty);
      expect(clean).not.toContain('<script>');
      expect(clean).toContain('Hello');
    });

    it('should trim whitespace', () => {
      const input = '  Hello World  ';
      const clean = sanitizeInput(input);
      expect(clean).toBe('Hello World');
    });

    it('should handle null and undefined', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });
  });

  describe('validateUsername', () => {
    it('should accept valid usernames', () => {
      const validUsernames = [
        'user123',
        'john_doe',
        'alice-smith',
      ];
      
      validUsernames.forEach(username => {
        expect(validateUsername(username)).toBe(true);
      });
    });

    it('should reject invalid usernames', () => {
      const invalidUsernames = [
        'ab',  // too short
        'user@name',  // invalid character
        'user name',  // space
        'a'.repeat(31),  // too long
      ];
      
      invalidUsernames.forEach(username => {
        expect(validateUsername(username)).toBe(false);
      });
    });
  });
});