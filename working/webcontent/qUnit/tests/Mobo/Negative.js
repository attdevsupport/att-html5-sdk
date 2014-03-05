//No negative Mobo test cases outside basic at this time
	function negativeMoboTests(cfg) {
		//Tests sending Mobo with landline address
        slowTest("Mobo to landline", function() {
			provider.sendMobo({
				address : cfg.phoneNumberLandline, 
				message : "test Mobo message from client-side test",
				subject : "test Mobo subject from client-side test",
				group   : false,
				success : function(response) {
					start();
					ok(true, "It should fail, sending Mobo to a landline address. " +
						"We should not get an Id back." +
						"\nresponse: " + JSON.stringify(response));	
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "It failed, Sending Mobo to a landline address." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
        // 12 destination addresses, to trigger policy errors or service exceptions with SMS, MMS, and MOBO.
        slowTest("Mobo to 12 destination addresses", function() {
			provider.sendMobo({
				address : cfg.destination12SansShort,
				message : "test Mobo message from client-side test",
				subject : "test Mobo subject from client-side test",
				group   : false,
				success : function(response) {
					start();
					ok(true, "It should fail, sending Mobo to 12 destination addresses. " +
						"We should not get an Id back." +
						"\nresponse: " + JSON.stringify(response));	
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo to more than 12 addresses." +
						"\nresponse: " + JSON.stringify(response));	
					validateMoboPolicyFailure(response);
				}
			});
			stop();
        });

        // Duplicate destination email, to trigger policy errors or service exceptions with SMS, MMS, and MOBO.
        slowTest("Mobo to duplicate email addresses", function() {
			provider.sendMobo({
				address : cfg.duplicateEmail,
				message : "test Mobo message from client-side test",
				subject : "test Mobo subject from client-side test",
				group   : false,
				success : function(response) {
					start();
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo to duplicate email addresses." +
						"\nresponse: " + JSON.stringify(response));	
					validateMoboDuplicatePolicyFailure(response);
				}
			});
			stop();
        });

        // Duplicate destination phone, to trigger policy errors or service exceptions with SMS, MMS, and MOBO.
        slowTest("Mobo to duplicate phone numbers", function() {
			provider.sendMobo({
				address : cfg.duplicatePhone,
				message : "test Mobo message from client-side test",
				subject : "test Mobo subject from client-side test",
				group   : false,
				success : function(response) {
					start();
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo to duplicate phone numbers." +
						"\nresponse: " + JSON.stringify(response));	
					validateMoboDuplicatePolicyFailure(response);
				}
			});
			stop();
        });

		//Tests sending Mobo with invalid address
        slowTest("Mobo to invalid address", function() {
			provider.sendMobo({
				address : cfg.phoneNumberInvalid, 
				message : "test Mobo message from client-side test",
				subject : "test Mobo subject from client-side test",
				group   : false,
				success : function(response) {
					start();
					ok(true, "Sending Mobo with invalid address." +
						"\nresponse: " + JSON.stringify(response));	
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					// ok(false, "It failed, Sending Mobo with invalid address." +
					// 	"\nresponse: " + JSON.stringify(response));	
					validateMoboInvalidAddressFailure(response);
				}
			});
			stop();
        });
		
		//Tests sending Mobo with null address
        slowTest("Mobo to null address", function() {
			provider.sendMobo({
				address : null, 
				message : "test Mobo message from client-side test",
				subject : "test Mobo subject from client-side test",
				group   : false,
				success : function(response) {
					start();
					ok(true, "Sending Mobo with no address." +
						"\nresponse: " + JSON.stringify(response));	
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "It failed, Sending Mobo with no address." +
						"\nresponse: " + JSON.stringify(response));	
					validateMoboInvalidAddressFailure(response);
					// validateMoboNoAddressResponse(response);
				}
			});
			stop();
        });
		
		//Tests sending Mobo with null message and no attachment
        slowTest("Mobo with no message or attachment", function() {
			provider.sendMobo({
				address : cfg.phoneNumberPrimary, 
				message : null,
				subject : "test Mobo subject from client-side test",
				group   : false,
				success : function(response) {
					start();
					ok(true, "Sending Mobo with no message and no attachment." +
						"\nresponse: " + JSON.stringify(response));	
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "It failed, Sending Mobo with no message and no attachment." +
						"\nresponse: " + JSON.stringify(response));	
					validateMoboFailureWhenInvalidMessageSent(response);
				}
			});
			stop();
        });
		
		//Tests sending Mobo with group enabled but one address
        slowTest("Mobo group enabled with one address", function() {
			provider.sendMobo({
				address : cfg.phoneNumberPrimary, 
				message : "test Mobo message from client-side test",
				subject : "test Mobo subject from client-side test",
				group   : true,
				success : function(response) {
					start();
					ok(false, "Sending Mobo with an invalid message." +
						"\nresponse: " + JSON.stringify(response));	
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "It failed, Sending Mobo group enabled with one address." +
						"\nresponse: " + JSON.stringify(response));	
					validateMoboFailureWhenInvalidMessageSent(response);
				}
			});
			stop();
        });
	}
