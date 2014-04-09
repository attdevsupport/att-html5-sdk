    function positiveSMSTests(cfg) {
		//Tests sending SMS to multiple addresses in the same call
		slowTest("sendSms to multiple addresses in one call", function() {
			provider.sendSms({
				address  : cfg.phoneNumberPrimary+","+cfg.phoneNumberSecondary, 
				message  : "test SMS message from client-side test to multiple addresses in one call", 
				success  : function(response) {
					start();
					validateSmsResponse(response);
				},
				failure  : function(response) {
					start();
					ok(false, "Fail On Sending Single SMS with multiple addresses in one call." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
		
		//Tests sending SMS to multiple addresses in the same call, first good second bad
		slowTest("sendSms to multiple addresses in one call, first good second bad", function() {
			provider.sendSms({
				address  : cfg.phoneNumberPrimary+","+cfg.phoneNumberLandline,
				message  : "test SMS message from client-side test to multiple addresses in one call first good second bad", 
				success  : function(response) {
					start();
					validateSmsResponse(response);
				},
				failure  : function(response) {
					start();
					ok(false, "Fail On Sending Single SMS with multiple addresses in one call, first good second bad." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
		//Tests sending SMS to multiple addresses in the same call, first bad second good
		slowTest("sendSms to multiple addresses in one call, first bad second good", function() {
			provider.sendSms({
				address  : cfg.phoneNumberLandline+","+cfg.phoneNumberPrimary, 
				message  : "test SMS message from client-side test to multiple addresses in one call first bad second good", 
				success  : function(response) {
					start();
					validateSmsResponse(response);
				},
				failure  : function(response) {
					start();
					ok(false, "Fail On Sending Single SMS with multiple addresses in one call, first bad second good." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});

		//Tests sending SMS with dashed address. Address is passed through normalizePhoneNumber to parse out ill characters.
		slowTest("Send SMS with dashed address", function() {
			tel = Att.Provider.normalizeAddress(cfg.phoneNumberDashes);
			provider.sendSms({
				address : tel, 
				message : "test SMS message from client-side test dashed address",
				success : function(response) {
					validateSmsResponse(response);
					start();
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Single SMS with dashed address." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		//Tests sending SMS with leading 1 in address.
		slowTest("Send SMS with leading 1 in address", function() {
			provider.sendSms({
				address : cfg.phoneNumberLeadOne, 
				message : "test SMS message from client-side test leading 1",
				success : function(response) {
					validateSmsResponse(response);
					start();
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Single SMS with leading 1 in address." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		//Tests sending SMS with parenthesis around area code. Address is passed through normalizePhoneNumber to parse out ill characters.
		slowTest("Send SMS with parenthesis around area code", function() {
			tel = Att.Provider.normalizeAddress(cfg.phoneNumberParenthesis);
			provider.sendSms({
				address : tel, 
				message : "test SMS message from client-side test parenthesis around area code",
				success : function(response) {
					validateSmsResponse(response);
					start();
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Single SMS with parenthesis around area code." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
	}
