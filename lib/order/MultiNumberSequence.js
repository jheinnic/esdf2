/**
 * @module esdf-base/order/MultiNumberSequence
 */

'use strict';

/**
 * A MultiNumberSequence is an ordering where elements are put in sequences
 *  and each element receives a natural number (starting from 1) within
 *  its sequence. A sequence is identified by a selector (key-value),
 *  for example if apartment numbers were a MultiSequence then a selector might
 *  be { street: 'Sesame Str.', block: '2' }.
 * @implements {module:esdf-base/interfaces/Order}
 */
class MultiNumberSequence {
  /**
   * Get a new MultiSequence symbolizing a particular (n-th) element in
   *  a sequence.
   */
  constructor(selector, number) {
    if (!selector || typeof selector !== 'object') {
      throw new TypeError('selector must be a key-value object in MultiSequence');
    }
    number = Number(number);
    if (isNaN(number)) {
      throw new TypeError('number must not be NaN in MultiSequence');
    }
    this._selector = selector;
    this._number = number;
  }

  isLinear() {
    return true;
  }

  isSequential() {
    return true;
  }

  getNext() {
    return new MultiNumberSequence(this._selector, this._number + 1);
  }

  getPrevious() {
    if (this._number > 1) {
      return new MultiNumberSequence(this._selector, this._number - 1);
    } else {
      return 0;
    }
  }

  isComparable(otherOrder) {
    if (!otherOrder.getSelector || !otherOrder.getNumber) {
      return false;
    }
    const thisKeys = Object.keys(this._selector);
    const otherSelector = otherOrder.getSelector();
    const otherKeys = Object.keys(otherSelector);
    // The sequence is comparable if the selector is the same:
    return (thisKeys.length === otherKeys.length && thisKeys.every((key) => this._selector[key] === otherSelector[key]));
  }

  isBefore(otherOrder) {
    return this._number < otherOrder.getNumber();
  }

  isAfter(otherOrder) {
    return this._number > otherOrder.getNumber();
  }

  /**
   * Get the selector pointing to the sequence that this element belongs to.
   * @returns {Object.<string,*>}
   */
  getSelector() {
    return this._selector;
  }

  /**
   * Get the number of this element in its sequence.
   * @returns {number}
   */
  getNumber() {
    return this._number;
  }
}

module.exports = MultiNumberSequence;
