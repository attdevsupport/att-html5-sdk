    function pairwiseSMSTests(cfg) {    
		//Tests sending two SMS messages at the same time. Will currently fail because of the way JSON requests are being formatted.
        slowTest("two simultaneous sendSms calls", function() {
			provider.sendSms({
				address : cfg.phoneNumberPrimary, 
				message : "test two SMS messages from client-side test #1", 
				success : function(response) {
					start();
					validateSmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on two SMSes at once #1");
				}
			});
			provider.sendSms({
				address : cfg.phoneNumberSecondary, 
				message : "test two SMS messages from client-side test #2", 
				success : function(response) {
					start();
					validateSmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on two SMSes at once #2");
				}
			});
			stop(2);
        });
	}