/**
 * @module esdf-base/testing/expect
 */

'use strict';

const TestError = require('../errors/TestError');

class DomainEventExpectationError extends TestError {
  constructor(index, event, specification) {
    super(`Event [${index}] (type: ${event.getType()}) does not meet test expectation`);
    this.data = { index, event, specification };
  }
}

class DomainEventCountError extends TestError {
  constructor(events, specifications) {
    const eventTypes = events.map((event) => event.getType());
    super(`Number of events does not match test expectations: got ${events.length} out of expected ${specifications.length}. Received types: ${eventTypes.join(', ')}`);
    this.data = { events, specifications };
  }
}

function equal(a, b) {
  if (typeof a !== typeof b) {
    return false;
  }
  switch (typeof a) {
    case 'object':
      // Equal if same object or all keys the same:
      return a === b ||
      (a && b && Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(function(key) {
        return Object.prototype.hasOwnProperty.call(b) && equal(a[key], b[key]);
      }));
    case 'function':
    case 'symbol':
      return a === b;
    case 'string':
    case 'boolean':
      // Trivial case:
      return a === b;
    case 'number':
      // Equal if simple numeric equality occurs, or if both are NaN:
      return (a === b) || (a !== a && b !== b);
    default:
      return false;
  }
}

/**
 * An EventSpecification is a definition of what a DomainEvent should look like.
 * @typedef {Object} module:esdf-base/testing/expect~EventSpecification
 * @property {string} type - Type of event to expect. Mandatory.
 * @property {(Object|function)} [payload] - The payload test. If specified as an object, does a deep comparison between it and the full payload. If function, the function is called with the payload as the sole argument and its result determines the test result.
 */
class EventSpecification {
  constructor({ type, payload }) {
    this.type = type;
    this.payload = payload || null;
    if (typeof this.payload === 'function') {
      this._payloadTest = this.payload;
    } else if (typeof this.payload === 'object' && this.payload) {
      this._payloadTest = ((payload) => equal(payload, this.payload));
    } else {
      this._payloadTest = (() => true);
    }
  }

  test(event) {
    if (event.getType() !== this.type) {
      return false;
    }
    if (!this._payloadTest(event.getPayload())) {
      return false;
    }
    return true;
  }
}

/**
 * An Expector is an observer of an event stream, which can be stopped at
 *  a given time to yield a result whether or not a given event sequence matches
 *  its defined expectation of what it should look like, event by event.
 */
class Expector {
  constructor(source, expectations) {
    this._receivedEvents = [];
    this._listener = (function receiveEvent(event) {
      this._receivedEvents.push(event);
    }).bind(this);
    this._source = source;
    this._source.addListener(this._listener);
    this._specifications = expectations.map((expectation) => new EventSpecification(expectation));
  }

  /**
   * Finish receiving events from the source and verify.
   * @throws {module:esdf-base/testing/expect~DomainEventCountError} If the event count does not match the number of specifications.
   * @throws {module:esdf-base/testing/expect~DomainEventExpectationError} If the event count matches, but some event fails a specification test.
   */
  finish() {
    this._source.removeListener(this._listener);
    // Check whether the events match the pre-defined expectations:
    const specifications = this._specifications;
    if (this._receivedEvents.length !== specifications.length) {
      throw new DomainEventCountError(this._receivedEvents, specifications);
    }
    this._receivedEvents.forEach(function(event, index) {
      if (!specifications[index].test(event)) {
        throw new DomainEventExpectationError(index, event, specifications[index]);
      }
    });
  }
}

/**
 * The "expect" testing tool allows one to check whether an EventSource emits
 *  a given sequence of Domain Events.
 * @param {module:esdf-base/interfaces/EventSource~EventSource} source - The EventSource to listen to for the events it generates.
 * @param {module:esdf-base/testing/expect~EventSpecification[]} expectations - Information about the specified events.
 * @returns {module:esdf-base/testing/expect~Expector} An object allowing one to finish the observation of a source of events and check if the gathered sequence matches the expected one.
 */
function expect(source, expectations) {
  return new Expector(source, expectations);
}

module.exports = expect;
