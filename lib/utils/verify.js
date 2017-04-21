/**
 * @module esdf-base/utils/verify
 */

'use strict';

const ValidationError = require('../errors/ValidationError');

/**
 * Ensure the value passes a validation test, or throw a ValidationError if not.
 * @param {string} name - A name for the value being tested. Usually, the name under which it is passed to some function, or property name.
 * @param {*} value - The value to validate.
 * @param {function} test - The test to use for validation. Iff it returns true, the value is considered valid. An error is thrown otherwise.
 * @throws {module:esdf-base/errors/ValidationError~ValidationError}
 */
function verify(name, value, test) {
  if (!test(value)) {
    throw new ValidationError(name, value, test);
  }
}

verify.UUID = function() {
  const test = function(value) {
    const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    return pattern.test(value);
  };
  test.testName = 'UUID';
  return test;
};

module.exports = verify;
