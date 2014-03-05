    function PairwiseWAPTests(cfg) { 	
		//Tests sending two WAP messages at the same time. Will currently fail because of the way JSON requests are being formatted.
		slowTest("two simultaneous wapPush calls", function() {
        	provider.wapPush({
				address : cfg.phoneNumberPrimary,
				message : "http://www.google.com", 
				subject : "test two wapPush messages from client-side test #1", 
        		success : function(response) {
					start();
                validateWapResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on two WAPs at once #1");
				}
        	});
        	provider.wapPush({
				address : cfg.phoneNumberPrimary,
				message : "http://www.google.com", 
				subject : "test two wapPush messages from client-side test #2", 
        		success: function(response) {
					start();
                validateWapResponse(response);
				},
				failure: function(response) {
					start();
					ok(false, "Fail on two WAPs at once #2");
				}
        	});
        	stop(2);
        });
	}