/**
 * @module esdf-base/errors/IsInterfaceError
 */

'use strict';

const ProgrammerError = require('./ProgrammerError');

/**
 * IsInterfaceError - the class can not be instantiated or the method called
 *  because it is part of an interface and not an actual implementation.
 * @extends Error
 */
class IsInterfaceError extends Error {
  /**
   * Get a new IsInterfaceError.
   */
  constructor() {
    super('This is an interface and may not be used as implementation');
  }
}

module.exports = IsInterfaceError;
