	//Function that wraps all of the tests. Slows the tests for throttling purposes.
	function slowTest(name, code) {
		test(name, function() {
			slowFn(function() {
				start();
				code();
			});
			stop();
		})
	}
	
	//Function inside the slowTest function that allows manipulation of the throttling time.
	function slowFn(code) {
		setTimeout(code, 200);
	}
    
	function basicDCTests() {	
		//Tests getting DC	
		slowTest("deviceCapabilities", function() {
			AttApiClient.getDeviceInfo(
				function(response) {
					start();
					validateDcResponse(response);
				},
				function(response) {
					start();
					ok(false, "Fail on getting single DC: " + JSON.stringify(response));
				}
			);
			stop();
        });
	}