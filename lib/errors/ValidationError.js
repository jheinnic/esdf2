/**
 * @module esdf-base/errors/ValidationError
 */

'use strict';

/**
 * A ValidationError is an error generated when some value does not meet
 *  specified validation constraints.
 * @extends Error
 */
class ValidationError extends Error {
  /**
   * Get a new ValidationError.
   * @param {string} name - A label for the value that failed validation. This is usually the name of the parameter, or object property, that is invalid.
   * @param {*} value - The
   */
  constructor(name, value, test) {
    const testName = (typeof test === 'function' && test.testName) ? test.testName : 'unnamed';
    const type = typeof value;
    super(`Value for "${name}" (type: ${type}) fails validation test: ${testName}`);
    // Set the error's name to that of the error class:
    this.name = new.target.name;
    // Add a flag that's easy to check for the developer:
    this.isValidationError = true;
    // Get a stack trace for debugging:
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, new.target);
    }
    this.data = { name, value, type, testName };
  }
}

module.exports = ValidationError;
