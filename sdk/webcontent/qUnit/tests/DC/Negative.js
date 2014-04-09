    function negativeDCTests(cfg) {
		//Tests getting DC with improper address. Should fail and produce an error response.
		slowTest("Get DC with improper address", function() {
			provider.getDeviceInfo({
				address : cfg.phoneNumberInvalid,
				success : function(response) {
					start();
					ok(false, "Getting DC with improper address");
				},
				failure : function(response) {
					start();
					validateDcFailResponse(response);
				}
			});
			stop();
        });
		
		//Tests getting DC with landline address. Should fail and produce an error response.
		slowTest("Get DC with landline address", function() {
			provider.getDeviceInfo({
				address : cfg.phoneNumberLandline,
				success : function(response) {
					start();
					ok(false, "Getting DC with landline address");
					validateDcFailResponse(response);
				},
				failure : function(response) {
					start();
					validateDcFailResponse(response);
				}
			});
			stop();
        });
		
		//Tests getting DC with null address. Should fail and produce an error response.
		slowTest("Get DC with null address", function() {
			provider.getDeviceInfo({
				address : null,
				success : function(response) {
					start();
					ok(false, "Getting DC with null address");
				},
				failure : function(response) {
					start();
					validateDcFailResponse(response);
				}
			});
			stop();
        });		
	}