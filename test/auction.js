'use strict';

const assert = require('assert');
const expect = require('..').testing.expect;
const EventSourcedAggregateRoot = require('..').reference.EventSourcedAggregateRoot;

class Auction extends EventSourcedAggregateRoot {
  constructor() {
    super({
      AuctionOpened: function({ sellerID }) {
        this._sellerID = sellerID;
        this._opened = true;
      },
      AuctionOfferPlaced: function({ offer }) {
        this._highestOffer = offer;
      }
    });
    this._sellerID = null;
    this._opened = false;
    this._highestOffer = null;
  }

  open(sellerID) {
    // Guard clause: do not re-open auctions.
    if (this._opened) {
      return;
    }

    this._emit('AuctionOpened', { sellerID });
  }

  placeOffer(offer) {
    // Make sure the offer is for the highest amount:
    if (this._highestOffer && this._highestOffer.amount > offer.amount) {
      throw new Error('Another offer is higher');
    }
    // Deduplicate the offer placement:
    if (this._highestOffer && this._highestOffer.amount === offer.amount && this._highestOffer.buyerID === offer.buyerID) {
      return;
    }

    this._emit('AuctionOfferPlaced', { offer });
  }

  getHighestOffer() {
    return this._highestOffer;
  }
}

describe('EventSourcedAggregateRoot', function() {
  it('should emit Domain Events as state update', function() {
    const auction = new Auction();
    auction.setID('322fa13d-d1c4-5f36-bb68-9c9d1bbc1c91');
    const eventTest = expect(auction, [
      { type: 'AuctionOpened' },
      { type: 'AuctionOfferPlaced' }
    ]);
    auction.open('seller1');
    auction.placeOffer({ buyer: 'buyer1', amount: 30 });
    eventTest.finish();
    assert.equal(auction.getHighestOffer().buyer, 'buyer1');
  });
});
