    function PairwiseMMSTests(cfg) {
		//Tests sending two MMS messages at the same time. Will currently fail because of the way JSON requests are being formatted.
		slowTest("two simultaneous sendMms calls", function() {
			provider.sendMms({
				address  : cfg.phoneNumberPrimary,  
				fileId   : "hello.jpg", 
				message  : "test two MMS messages from client-side test #1", 
				priority : "High", 
				success  : function(response) {
					start();
					validateMmsResponse(response);
				},
				failure  : function(response) {
					start();
					ok(false, "Fail on two MMSes at once #1");
				}
			});
			provider.sendMms({
				address  : cfg.phoneNumberPrimary, 
				fileId   : "hello.jpg", 
				message  : "test two MMS messages from client-side test #2", 
				priority : "High", 
				success  : function(response) {
					start();
					validateMmsResponse(response);
				},
				failure: function(response) {
					start();
					ok(false, "Fail on two MMSes at once #2");
				}
			});
			stop(2);
		});
	}