/**
 * @module esdf-base/interfaces/EventSource
 */

'use strict';

const IsInterfaceError = require('../errors/IsInterfaceError');
const EventEmitter = require('events');

/**
 * An EventSource is a producer of Domain Events. It notifies outside observers
 *  of new occurrences by allowing them to register callbacks that will be
 *  called whenever such an event is produced.
 * @interface
 */
class EventSource extends EventEmitter {
  // Constructor - not part of the interface.
  constructor() {
    throw new IsInterfaceError();
  }

  /**
   * Add a callback to be called when any Domain Event is sourced.
   * @param {function(module:esdf-base/interfaces/DomainEvent)} listener - A listener function that accepts a single argument (the event). Must not throw.
   */
  addListener(listener) {
    throw new IsInterfaceError();
  }

  /**
   * Remove a given listener function. This prevents it from being fired
   *  when an event is sourced.
   */
  removeListener(listener) {
    throw new IsInterfaceError();
  }
}

module.exports = EventSource;
