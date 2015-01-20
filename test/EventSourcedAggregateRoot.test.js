var EventSourcedAggregateRoot = require('../lib/Core/EventSourcedAggregateRoot');
var assert = require('assert');

describe('EventSourcedAggregateRoot', function(){
	describe('.generated constructor', function(){
		var Sale = EventSourcedAggregateRoot(function Sale(){
			this._sold = false;
		}, {
			Sold: function(){
				this._sold = true;
			}
		});
		
		Sale.prototype.sell = function sell(){
			this.emit('Sold');
		};
		
		it('should fire the event emission handler', function(){
			var saleInstance = new Sale(function emitHandler(event){
				assert.equal(event.type, 'Sold');
				emitHandlerFired = true;
			});
			var emitHandlerFired = false;
			saleInstance.sell();
			
			assert(emitHandlerFired);
		});
	});
});