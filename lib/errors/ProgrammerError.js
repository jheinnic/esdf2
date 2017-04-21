/**
 * @module esdf-base/errors/ProgrammerError
 */

'use strict';

/**
 * A ProgrammerError is an error stemming from invalid usage of an internal API
 *  by a developer. For instance, trying to call an abstract method is a
 *  programmer error.
 * @extends Error
 */
class ProgrammerError extends Error {
  /**
   * Get a new ProgrammerError.
   * @param {string} message - The human-readable message to include in the error.
   */
  constructor(message) {
    // Provide a message to be set as this.message:
    super(message);
    // Set the error's name to that of the error class:
    this.name = new.target.name;
    // Add a flag that's easy to check for the developer:
    this.isProgrammerError = true;
    // Get a stack trace for debugging:
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, new.target);
    }
  }
}

module.exports = ProgrammerError;
