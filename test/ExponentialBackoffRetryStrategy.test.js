var ExponentialBackoffRetryStrategy = require('../lib/Strategies/Retry/ExponentialBackoffRetryStrategy');
var assert = require('assert');
var when = require('when');

function range(from, to, value){
	if(!value){
		value = null;
	}
	var elements = new Array(to - from + 1);
	for(var i = from; i < to; i += 1){
		elements[i] = value;
	}
	return elements;
}

describe('ExponentialBackoffRetryStrategy', function(){
	it('should immediately indicate finish if the maximum retry count has been set to 0', function(){
		var retry = ExponentialBackoffRetryStrategy({
			maximumRetries: 0
		});
		assert.throws(retry.bind(undefined, function(){}));
	});
	it('should decide that it is fine to retry when the maximum has not yet been reached', function(){
		var retry = ExponentialBackoffRetryStrategy({
			maximumRetries: 10
		});
		retry(function(){});
	});
	it('should respect the maximum delay setting', function(){
		// Note: this test case is timing-dependent. If execution is really sluggish today, it might fail.
		var retry = ExponentialBackoffRetryStrategy({
			initialDelay: 3,
			maximumDelay: 20
		});
		var delayPromises = range(1, 10).map(function(){
			return when.promise(function(resolve, reject){
				retry(function(){
					resolve();
				});
			});
		});
		
		return when.all(delayPromises).timeout(100);
	});
	it('should decide that retries should cease after a sufficient amount of tries', function(){
		var retry = ExponentialBackoffRetryStrategy({
			maximumRetries: 3
		});
		for(var i = 0; i < 3; i += 1){
			retry();
		}
		assert.throws(function(){
			retry(function(){});
		});
	});
});