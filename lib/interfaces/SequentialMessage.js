/**
 * @module esdf-base/interfaces/Message
 */

'use strict';

const IsInterfaceError = require('../errors/IsInterfaceError');

/**
 * A Message is a piece of information that can be transmitted, received and
 *  passed around in a software system. This interface declares methods
 *  that enable a caller to find out about the message's semantics.
 * @property {string} type - Type of occurrence which this event signifies. Usually written in UpperCamelCase (similar to class names).
 * @property {Date} timestamp - The date/time when the event occurred.
 * @property {Object} payload - Domain-specific information about the event - this is where all data resides.
 */
class Message {
  // Constructor - not included in the interface.
  constructor() {
    throw new IsInterfaceError();
  }

  /**
   * Get the Order which this message follows. This allows the caller to
   *  establish whether the message is a part of a bigger sequence, whether and
   *  how it is possible to sort/compare the precedence of several such
   *  messages, and whether or not one should attempt to reason about the
   *  completeness of a set of such messages based on their order data.
   * One example of a well-ordered message is a TCP network packet, where the
   *  packet carries a sequential number that is incremented by 1. This allows
   *  one to catch missing packets (requesting a retransmission) and reorder
   *  messages so that they appear sequentially, as sent, to recipients.
   * @returns {module:esdf-base/interfaces/Order}
   */
  getOrder() {

  }
}

module.exports = Message;
