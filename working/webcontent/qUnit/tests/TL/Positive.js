    function positiveTLTests(cfg) { 	
	
		//Tests getting TL with changed requested accuracy
		slowTest("Get TL with changed requested accuracy", function() {
			provider.getDeviceLocation({
				address : cfg.phoneNumberPrimary,
				requestedAccuracy : 1000,
				success : function(response) {
					start();
					validateTlResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on getting TL with changed requested accuracy." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		//Tests getting TL with changed acceptable accuracy
		slowTest("Get TL with changed acceptable accuracy", function() {
			provider.getDeviceLocation({
				address : cfg.phoneNumberPrimary,
				acceptableAccuracy: 5000,
				success : function(response) {
					start();
					validateTlResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on getting TL with changed acceptable accuracy." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		//Tests getting TL with changed tolerance
		slowTest("Get TL with changed tolerance", function() {
			provider.getDeviceLocation({
				address : cfg.phoneNumberPrimary,
				tolerance : 'LowDelay',
				success : function(response) {
					start();
					validateTlResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on getting TL with changed tolerance." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
	
		//Tests getting TL with dashed address. Address is passed through normalizePhoneNumber to parse out ill characters.
		slowTest("Get TL with dashed address", function() {
			tel = Att.Provider.normalizeAddress(cfg.phoneNumberDashes);
			provider.getDeviceLocation({
				address : tel,
				success : function(response) {
					start();
					validateTlResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on getting TL with dashed address." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		//Tests getting TL with leading 1 in address.
		slowTest("Get TL with leading 1 in address", function() {
			provider.getDeviceLocation({
				address : cfg.phoneNumberLeadOne,
				success : function(response) {
					start();
					validateTlResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on getting TL with leading 1 in address." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		//Tests getting TL with parenthesis around area code. Address is passed through normalizePhoneNumber to parse out ill characters.
		slowTest("Get TL with parenthesis around area code", function() {
			tel = Att.Provider.normalizeAddress(cfg.phoneNumberParenthesis);
			provider.getDeviceLocation({
				address : tel,
				success : function(response) {
					start();
					validateTlResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on getting TL with parenthesis around area code." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
	}
		
