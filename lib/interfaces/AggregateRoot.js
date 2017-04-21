/**
 * @module esdf-base/interfaces/AggregateRoot
 */

'use strict';

const IsInterfaceError = require('../errors/IsInterfaceError').IsInterfaceError;

/**
 * An Aggregate Root is the top level Entity to which one can refer by a global,
 *  unique ID. In Domain-Driven Design, an Aggregate Root is a consistency
 *  boundary, meaning that an operation on the AR will either succeed or fail
 *  atomically, but this atomicity does not work across multiple ARs.
 * @interface
 */
class AggregateRoot {
  constructor() {
    throw new IsInterfaceError();
  }

  /**
   * Establish a global identity for this Aggregate Root by assigning it an ID.
   * An Aggregate Root's identity must not change over time.
   *
   * @param {*} ID - The ID to set. Its format depends on the agreed-upon ID format in the system.
   * @returns {module:esdf-base/interfaces/AggregateRoot~AggregateRoot} A reference to the aggregate root with the set ID. Usually, this will be the same object the method was called on. In systems with immutable aggregate roots, a new instance may be returned, however.
   */
  setID(ID) {
    throw new IsInterfaceError();
  }

  /**
   * Get the global, unique ID of this Aggregate Root.
   * @returns {*} An ID of this Aggregate Root, or null if this aggregate has no ID. Aggregate roots with no ID represent non-existent entities.
   */
  getID() {
    throw new IsInterfaceError();
  }
}

module.exports = DomainEvent;
