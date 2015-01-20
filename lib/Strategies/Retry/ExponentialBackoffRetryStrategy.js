function ExponentialBackoffRetryStrategy(options){
	var initialDelay = typeof(options.initialDelay) === 'number' ? options.initialDelay : 16;
	var factor = typeof(options.factor) === 'number' ? options.factor : 2;
	// Assume a default of two minutes for the re-processing delay:
	var maximumDelay = typeof(options.maximumDelay) === 'number' ? options.maximumDelay : (1000*60*2);
	var maximumRetries = typeof(options.maximumRetries) === 'number' ? options.maximumRetries : Infinity;
	// Also allow a random factor to change the increase rate:
	var randomFactor = options.randomFactor || 0;
	
	var retriesSoFar = 0;
	var currentDelay = initialDelay;
	
	function shouldRetry() {
		return (retriesSoFar < maximumRetries);
	};
	
	function retry(operation) {
		if(!shouldRetry()){
			throw new Error('Retry limit reached');
		}
		// First, schedule the operation to be carried out at our set point in time:
		setTimeout(operation, currentDelay);
		// Next, increase the delay by multiplying it by the set factor:
		currentDelay = currentDelay * factor;
		// If a non-zero random factor has been chosen, apply it. In fact, the "if" could be skipped if the factor is zero, but we can optimize away the Math.random() in that case.
		if(randomFactor){
			currentDelay = currentDelay * (1 + Math.random() * randomFactor);
		}
		// If the maximum has been reached, bring the value down to the maximum:
		if(currentDelay > maximumDelay){
			currentDelay = maximumDelay;
		}
		// Don't forget to increase the used retry counter:
		retriesSoFar += 1;
	}
	
	return retry;
}

module.exports = ExponentialBackoffRetryStrategy;