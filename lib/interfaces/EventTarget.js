/**
 * @module esdf-base/interfaces/EventTarget
 */

'use strict';

const IsInterfaceError = require('../errors/IsInterfaceError');
const EventEmitter = require('events');

/**
 * An EventTarget is an object that Domain Events may be applied on to obtain
 *  a certain effect. An example is an in-memory model of a real-world entity
 *  that is updated according to events to reflect its state.
 * @interface
 */
class EventTarget {
  // Constructor - not part of the interface.
  constructor() {
    throw new IsInterfaceError();
  }

  /**
   * Apply a Domain Event on the target.
   * @param {module:esdf-base/interfaces/DomainEvent~DomainEvent} event - The event to apply.
   * @returns {(undefined|Promise)} Nothing in case of synchronous operation, or a Promise if the application requires asynchronicity. The meaning of the Promise's resolution value is specific to the target and this interface makes no assumptions about it.
   */
  applyEvent(event) {
    throw new IsInterfaceError();
  }
}

module.exports = EventTarget;
