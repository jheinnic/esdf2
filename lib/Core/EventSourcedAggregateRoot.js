var Event = require('./Event');

function EventSourcedAggregateRoot(existingConstructor, eventHandlers){
	existingConstructor = existingConstructor || function NullConstructor(){};
	eventHandlers = eventHandlers || {};
	
	function EventSourcedAggregateRootConstructor(emitHandler){
		if(!(this instanceof EventSourcedAggregateRootConstructor)){
			return new EventSourcedAggregateRootConstructor(emitHandler);
		}
		this._sealed = false;
		this._emitHandler = emitHandler;
		existingConstructor();
	};
	
	EventSourcedAggregateRootConstructor.prototype = Object.create(existingConstructor.prototype);
	
	EventSourcedAggregateRootConstructor.prototype.processEvent = function processEvent(event){
		if(typeof(eventHandlers[event.type]) !== 'function'){
			throw new Error('Unhandled event type: ' + event.type);
		}
		var handler = eventHandlers[event.type];
		handler.call(this, event.payload);
		return this;
	};
	
	EventSourcedAggregateRootConstructor.prototype.emit = function emit(type, payload){
		if(this._sealed){
			//TODO: Compact the error message below.
			throw new Error('The event-sourced aggregate object has been sealed and will no longer accept events. This usually indicates an attempt to raise new events outside a repository call\'s consistency boundary - a programming error.');
		}
		var event = new Event(type, payload || {});
		this.processEvent(event);
		this._emitHandler(event);
		return this;
	};
	
	EventSourcedAggregateRootConstructor.prototype.seal = function seal(){
		this._sealed = true;
	};
	
	return EventSourcedAggregateRootConstructor;
}

module.exports = EventSourcedAggregateRoot;