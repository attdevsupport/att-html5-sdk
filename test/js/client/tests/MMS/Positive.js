    function positiveMMSTests(cfg) { 
		//Tests sending MMS to multiple addresses in the same call
		slowTest("sendMms to multiple addresses in one call", function() {
			provider.sendMms({
				address  : cfg.phoneNumberPrimary+","+cfg.phoneNumberSecondary, 
				fileId   : "hello.jpg", 
				message  : "test MMS message from client-side test to multiple addresses in one call", 
				priority : "High", 
				success  : function(response) {
					start();
					validateMmsResponse(response);
				},
				failure  : function(response) {
					start();
					ok(false, "Fail On Sending Single MMS with multiple addresses in one call." +
						"\nresponse: " + JSON.stringify(response));
				}
			});
			stop();
		});
		
		//Tests sending MMS to multiple addresses in the same call, first good second bad
		slowTest("sendMms to multiple addresses in one call, first good second bad", function() {
			provider.sendMms({
				address  : cfg.phoneNumberPrimary+","+cfg.phoneNumberLandline, 
				fileId   : "hello.jpg", 
				message  : "test MMS message from client-side test to multiple addresses in one call first good second bad", 
				priority : "High", 
				success  : function(response) {
					start();
					validateMmsResponse(response);
				},
				failure  : function(response) {
					start();
					ok(false, "Fail On Sending Single MMS with multiple addresses in one call, first good second bad." +
						"\nresponse: " + JSON.stringify(response));
				}
			});
			stop();
		});
		
		//Tests sending MMS to multiple addresses in the same call, first bad second good
		slowTest("sendMms to multiple addresses in one call, first bad second good", function() {
			provider.sendMms({
				address  : cfg.phoneNumberLandline+","+cfg.phoneNumberPrimary, 
				fileId   : "hello.jpg", 
				message  : "test MMS message from client-side test to multiple addresses in one call first bad second good", 
				priority : "High", 
				success  : function(response) {
					start();
					validateMmsResponse(response);
				},
				failure  : function(response) {
					start();
					ok(false, "Fail On Sending Single MMS with multiple addresses in one call, first bad second good." +
						"\nresponse: " + JSON.stringify(response));
				}
			});
			stop();
		}); 	

		// Tests sending MMS with priority changed to low.	
		slowTest("Send MMS with priority changed to low.", function() {
			provider.sendMms({
				address : cfg.phoneNumberPrimary, 
				fileId   : "hello.jpg", 
				message : "test MMS message from client-side test with low priority",
				priority : "Low", 
				success : function(response) {
					start();
					validateMmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Single MMS with low priority." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		//Tests sending MMS with dashed address. Address is passed through normalizePhoneNumber to parse out ill characters.	
		slowTest("Send MMS with dashed address", function() {
			tel = Att.Provider.normalizeAddress(cfg.phoneNumberDashes);
			provider.sendMms({
				address : tel, 
				fileId   : "hello.jpg", 
				message : "test MMS message from client-side test with dashed address",
				priority : "High", 
				success : function(response) {
					start();
					validateMmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Single MMS with dashed address." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		//Tests sending MMS with leading 1 in address.
		slowTest("Send MMS with leading 1 in address", function() {
			provider.sendMms({
				address : cfg.phoneNumberLeadOne, 
				fileId   : "hello.jpg", 
				message : "test MMS message from client-side test with leading 1 in address",
				priority : "High", 
				success : function(response) {
					start();
					validateMmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Single MMS with leading 1 in address." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		//Tests sending MMS with parenthesis around area code. Address is passed through normalizePhoneNumber to parse out ill characters.
		slowTest("Send MMS with parenthesis around area code", function() {
			tel = Att.Provider.normalizeAddress(cfg.phoneNumberParenthesis);
			provider.sendMms({
				address : tel, 
				fileId   : "hello.jpg",
				message : "test MMS message from client-side test with parenthesis around area code",
				priority : "High", 
				success : function(response) {
					start();
					validateMmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Single MMS with parenthesis around area code." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
	}
