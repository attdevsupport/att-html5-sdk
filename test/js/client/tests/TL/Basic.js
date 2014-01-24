	function basicTLTests(cfg) {
		//Tests getting TL
		slowTest("terminalLocation", function() {
			provider.getDeviceLocation({
				address : cfg.phoneNumberPrimary,
				success : function(response) {
					start();
					validateTlResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on getting single TL." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
	}
