/**
 * @module esdf-base/interfaces/Order
 */

'use strict';

const IsInterfaceError = require('../errors/IsInterfaceError').IsInterfaceError;

/**
 * An Order conveys a relation to other elements of a set. This allows a user to
 *  establish whether a message is a part of a bigger sequence, whether and
 *  how it is possible to sort/compare the precedence of several such
 *  messages, and whether or not one should attempt to reason about the
 *  completeness of a set of such messages based on their order data.
 * One example of a well-ordered message is a TCP network packet, where the
 *  packet carries a sequential number that is incremented by 1. This allows
 *  one to catch missing packets (requesting a retransmission) and reorder
 *  messages so that they appear sequentially, as sent, to recipients.
 * Elements other than messages may be ordered, as well.
 * @interface
 */
class Order {
  constructor() {
    throw new IsInterfaceError();
  }

  /**
   * Inquire about the linearity of the set which the ordering applies to.
   * @returns {boolean} True iff the ordering of this element is linear among other elements. If true, implies that any other element will be greater or lesser than this one.
   */
  isLinear() {
    throw new IsInterfaceError();
  }

  /**
   * Check if the set from which the element comes is sequential.
   * A sequential set is one that is linear and also with a predictable number
   *  of elements between any two members. An example of a sequential set is
   *  the sequence of natural numbers, since for a set [ 1, 2, 3, 4 ], if we
   *  remove "3", it can clearly be stated that one element is missing and that
   *  it should be greater than 2 and lesser than 4.
   * Sequential sets afford the developer the possibility of re-ordering
   *  messages transmitted in any order over a network, because they allow one
   *  to check when all messages (elements) have been received and to sort them.
   * On the other hand, if an arbitrary subset of a message stream is selected,
   *  reliable ordering becomes impossible, because absent elements of a set
   *  do not necessarily imply having to wait for more - they may be filtered
   *  out, too.
   * @returns {boolean} True iff the set which the element comes from is sequential.
   */
  isSequential() {
    throw new IsInterfaceError();
  }

  /**
   * Get the ordering information of the previous (immediate predecessor)
   *  element. For instance, if elements are indexed by integers from 1 to n,
   *  then for each x in 2..n it should return x - 1 and for x = 1 it should
   *  return null (no previous element may exist).
   * This is only applicable to sequential orderings.
   * @returns {Order}
   */
  getPrevious() {
    throw new IsInterfaceError();
  }

  /**
   * Get the ordering information of the next (direct successor) element. For
   *  instance, if elements are indexed by integers from 1 to n, then for each
   *  x in 1..n-1 it should return x + 1 and for x = n it should return null
   *  (no next element may exist).
   * This is only applicable to sequential orderings.
   * @returns {Order}
   */
  getNext() {
    throw new IsInterfaceError();
  }

  /**
   * Check whether this ordering information can be compared with another order
   *  object. Note that being comparable (same category of thing) does not imply
   *  being lesser or greater - that requires a linear order.
   * @returns {boolean} True iff the ordering info (e.g. number) is meaningfully comparable to the other ordering info.
   */
  isComparable(otherOrder) {
    throw new IsInterfaceError();
  }

  /**
   * @returns {boolean} True iff the element described by this ordering information is considered to be before (lesser than) another.
   */
  isBefore(otherOrder) {
    throw new IsInterfaceError();
  }

  /**
   * @returns {boolean} True iff the element described by this ordering information is considered to be after (greater than) another.
   */
  isAfter(otherOrder) {
    throw new IsInterfaceError();
  }
}

module.exports = Order;
