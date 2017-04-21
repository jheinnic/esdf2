/**
 * @module esdf-base/interfaces/DomainEvent
 */

'use strict';

const IsInterfaceError = require('../errors/IsInterfaceError').IsInterfaceError;

/**
 * A Domain Event is an object that represents a single past event that has
 *  occurred within the Business Domain. Being a record of the past, it does not
 *  change with time - it is not an Entity itself.
 * An example Domain Event is one that says "an invoice was issued at 10:00 for
 *  $34.99". Domain Events can typically be obtained from Event Sources.
 * In an event-sourcing system, Domain Events are the Single Source of Truth.
 * @interface
 */
class DomainEvent {
  constructor() {
    throw new IsInterfaceError();
  }

  /**
   * @returns {string} A unique ID of this event. Needs to be universally-unique so that this particular occurence can be distinguished globally.
   */
  getID() {
    throw new IsInterfaceError();
  }

  /**
   * @returns {string} Type of occurrence that this event signifies. Usually written in UpperCamelCase (similar to class names).
   */
  getType() {
    throw new IsInterfaceError();
  }

  /**
   * @returns {?Date} The date/time when the event occurred, or null if not known.
   */
  getTimestamp() {
    throw new IsInterfaceError();
  }

  /**
   * @returns {Object} Domain-specific information about the event - this is where all data resides.
   */
  getPayload() {
    throw new IsInterfaceError();
  }

  /**
   * @returns {module:esdf-order/interfaces/Order~Order} Ordering information about this event, including its position in an event sequence, if any.
   */
  getOrder() {
    throw new IsInterfaceError();
  }
}

module.exports = DomainEvent;
