	function basicDCTests(cfg) {	
		//Tests getting DC	
		slowTest("deviceCapabilities", function() {
			AttApiClient.getDeviceInfo(
				function(response) {
					start();
					validateDcResponse(response);
				},
				function(response) {
					start();
					ok(false, "Fail on getting single DC");
				}
			);
			stop();
        });
	}