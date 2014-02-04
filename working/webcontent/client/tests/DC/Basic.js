	function basicDCTests(cfg) {	
		//Tests getting DC	
		slowTest("deviceCapabilities", function() {
			provider.getDeviceInfo({
				address : cfg.phoneNumberPrimary,
				success : function(response) {
					start();
					validateDcResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on getting single DC");
				}
			});
			stop();
        });
	}