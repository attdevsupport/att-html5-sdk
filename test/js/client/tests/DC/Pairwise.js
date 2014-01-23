    function PairwiseDCTests(cfg) {	
		//Tests getting two DCs at the same time. Will currently fail because of the way JSON requests are being formatted.
		slowTest("two simultaneous DC calls", function() {
        	provider.getPhoneCapabilities({
				address : cfg.phoneNumberPrimary,
        		success : function(response) {
					start();
					validateDcResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on two DCs at once #1");
				}
        	});
        	provider.getPhoneCapabilities({
				address : cfg.phoneNumberPrimary,
        		success : function(response) {
					start();
					validateDcResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on two DCs at once #2");
				}
        	});
        	stop(2);
        });
	}