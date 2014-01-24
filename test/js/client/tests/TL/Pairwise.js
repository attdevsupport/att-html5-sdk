    function PairwiseTLTests(cfg) {	
		//Tests getting two TLs at the same time. Will currently fail because of the way JSON requests are being formatted.
		slowTest("two simultaneous TL calls", function() {
        	provider.getDeviceLocation({
				address : cfg.phoneNumberPrimary,
        		success : function(response) {
					start();
					validateTlResponse(response);
				},
				failure: function(response) {
					start();
					ok(false, "Fail on two TLs at once #1");
				}
        	});
        	provider.getDeviceLocation({
				address : cfg.phoneNumberPrimary,
        		success : function(response) {
					start();
					validateTlResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on two TLs at once #2");
				}
        	});
        	stop(2);
        });
	}