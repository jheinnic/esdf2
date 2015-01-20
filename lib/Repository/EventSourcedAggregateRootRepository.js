var when = require('when');
var Commit = require('../Core/Commit').Commit;
var RetryStrategy = require('../Operations/RetryStrategy');
var Trace = require('../Util/Trace');

function AggregateRootEnvelope(instance, aggregateID){
	this.instance = instance;
	this.sequenceID = aggregateID;
	this.sequenceSlot = 1;
	this.operationValue = undefined;
	this.events = [];
}

AggregateRootEnvelope.prototype.copy = function copy(){
	var envelope = new AggregateRootEnvelope(this.instance, this.sequenceID);
	envelope.sequenceSlot = this.sequenceSlot;
	envelope.operationValue = this.operationValue;
	envelope.events = this.events.slice();
	return envelope;
};

function EventSourcedAggregateRootRepository(eventStore, options){
	this._eventStore = eventStore;
	this._options = options || {};
}

EventSourcedAggregateRootRepository.prototype.do = function do_(aggregateRootConstructor, aggregateRootID, operation, options){
	
	//TODO: Turn this whole procedure into a user-configurable promise/functional pipeline.
	
	var eventStore = this._eventStore;
	var options = options || {};
	var retryStrategy = options.retryStrategy || this._options.retryStrategy || RetryStrategy.NoRetryStrategy();
	
	// Note: the different stages throughout this function use conditional assignment to handle both the case of immutable objects (where every setter returns the modified target) and the case when functions return undefined.
	//  If the functions do return truthy values which are not compatible with the Event Sourced Aggregate contract, however, an erorr occurs.
	function load(){
		var instance = new aggregateRootConstructor();
		var envelope = new AggregateRootEnvelope(instance, aggregateRootID);
		delete instance;
		
		return when.try(eventStore.streamSequenceCommits.bind(eventStore), envelope.sequenceID, envelope.sequenceSlot, function processCommit(commit){
			//TODO: Rework this to be a true promise stream (pipeline).
			commit.events.forEach(function passEvent(event){
				envelope.instance = envelope.instance.processEvent(event) || envelope.instance;
			});
			++envelope.sequenceSlot;
		}).yield(envelope);
	}
	
	function process(envelope){
		return when.try(operation, envelope.instance).then(function(result){
			// Although we provide support for immutable objects by default, we also need to make sure functions work as expected with mutable object implementations which return nothing / garbage values.
			if(result && typeof(result.getAggregateID) === 'function'){
				envelope.instance = result;
			}
			else{
				envelope.operationValue = result;
			}
			return envelope;
		});
	}
	
	function optionalSeal(envelope){
		// Optionally apply safety guards to the aggregate, so that programmer mistakes are easily detected. This requires the target to implement an extra function.
		// Also, this safety measure does not work with immutable objects - if working with immutable aggregates, the programmer is expected to always yield the aggregate's final state from the function/returned promise, anyway.
		if(typeof(envelope.instance.seal) === 'function'){
			envelope.instance.seal();
		}
		return envelope;
	}
	
	function save(envelope){
		var events = envelope.events;
		// Guard clause: in case of no changes whatsoever, exit early without saving a Commit.
		if(events.length === 0){
			return envelope;
		}
		var commit = new Commit(envelope.sequenceID, envelope.sequenceSlot, events);
		return when.try(eventStore.saveCommit.bind(eventStore), commit).yield(envelope);
	}
	
	function singlePass(){
		return when.try(load)
			.then(process)
			.then(optionalSeal)
			.then(save);
	}
	
	function tryDoing(){
		return singlePass().catch(function handleOperationError(underlyingError){
			// Let our retry strategy carry out the operation again if possible:
			var retryPromise = retryStrategy(underlyingError, tryDoing);
			// Then, if the strategy has rejected as well (meaning a non-recoverable error according to its logic), report failure to the caller.
			//TODO: Split up determining whether to retry from retrying. If the strategy refuses to retry at all, return the original error.
			//TODO: Change the retry strategies' code contract so that they do not generate own errors on retries.
			return retryPromise;
		});
	}
	
	//TODO: Make sure that critical errors bubble up without the strategy no-retry error wrapping them.
	return tryDoing().then(function yieldOperationValue(envelope){
		return envelope.operationValue;
	});
};

module.exports.EventSourcedAggregateRootRepository = EventSourcedAggregateRootRepository;