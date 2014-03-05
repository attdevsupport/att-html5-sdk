    function negativeTLTests(cfg) {
	
	//Tests getting TL with changed acceptable accuracy
		slowTest("Get TL with acceptable accuracy set to 1", function() {
			provider.getDeviceLocation({
				address : cfg.phoneNumberPrimary,
				acceptableAccuracy: 1,
				success : function(response) {
					start();
					ok(true, "Strangely succeeding in getting TL with acceptable accuracy set to 1." +
						"\nresponse: " + JSON.stringify(response));	
				},
				failure : function(response) {
					start();
					ok(false, "Failed in getting TL with acceptable accuracy set to 1." +
						"\nresponse: " + JSON.stringify(response));	
					validateTlBadAAResponse(response);
				}
			});
			stop();
        });
	
		//Tests getting TL with improper address. Should fail and produce an error response.
		/*
		slowTest("Get TL with improper address", function() {
			provider.getDeviceLocation({
				address : cfg.phoneNumberInvalid,
				success : function(response) {
					start();
					ok(false, "Getting TL with improper address");
				},
				failure : function(response) {
					start();
					validateTlFailResponse(response);
				}
			});
			stop();
        });
		
		//Tests getting TL with landline address. Should fail and produce an error response.
		
		slowTest("Get TL with landline address", function() {
			provider.getDeviceLocation({
				address : cfg.phoneNumberLandline,
				success : function(response) {
					start();
					ok(false, "Getting TL with landline address");
				},
				failure : function(response) {
					start();
					validateTlFailResponse(response);
				}
			});
			stop();
        });
		
		//Tests getting TL with null address. Should fail and produce an error response.
		
		slowTest("Get TL with null address", function() {
			provider.getDeviceLocation({
				address : null,
				success : function(response) {
					start();
					ok(false, "Getting TL with null address");
				},
				failure : function(response) {
					start();
					validateTlFailResponse(response);
				}
			});
			stop();
		});
		*/
	}
