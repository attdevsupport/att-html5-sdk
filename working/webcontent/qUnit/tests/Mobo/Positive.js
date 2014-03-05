//No positive mobo test cases outside basic at this time
	function positiveMoboTests(cfg) {
		//Tests sending Mobo with dashed address
        slowTest("Mobo with dashed address", function() {
			tel = Att.Provider.normalizeAddress(cfg.phoneNumberDashes);
			provider.sendMobo({
				address : tel, 
				message : "test Mobo message from client-side test",
				subject : "test Mobo subject from client-side test",
				success : function(response) {
					start();
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo with dashed address." + 
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		//Tests sending Mobo with leading one in address
        slowTest("Mobo with leading one", function() {
			provider.sendMobo({
				address : cfg.phoneNumberLeadOne, 
				message : "test Mobo message from client-side test",
				subject : "test Mobo subject from client-side test",
				success : function(response) {
					start();
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo with leading one." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		//Tests sending Mobo with parenthesized address
        slowTest("Mobo with parenthesized address", function() {
			tel = Att.Provider.normalizeAddress(cfg.phoneNumberParenthesis);
			provider.sendMobo({
				address : tel, 
				message : "test Mobo message from client-side test",
				subject : "test Mobo subject from client-side test",
				success : function(response) {
					start();
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo with parenthesized address." + 
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		//Tests sending Mobo with two addresses in one method call
        slowTest("Mobo with multiple addresses", function() {
			provider.sendMobo({
				address : cfg.phoneNumberPrimary+","+cfg.phoneNumberSecondary, 
				message : "test Mobo message from client-side test",
				subject : "test Mobo subject from client-side test",
				success : function(response) {
					start();
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo with multiple addresses in one method." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		//Tests sending Mobo to multiple addresses with email		
        slowTest("Mobo to multiple addresses with email", function() {
			provider.sendMobo({
                address : cfg.phoneNumberPrimary+","+cfg.personalEmail,
				message : "test Mobo message from client-side test to multiple addresses with email",
				subject : "test Mobo subject from client-side test to multiple addresses with email",
				group   : false,
				success : function(response) {
					start();
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo to multiple addresses with an email." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		//Tests sending Mobo to multiple addresses with group enabled
        slowTest("Mobo to multiple addresses with group enabled", function() {
			provider.sendMobo({
				address : cfg.phoneNumberPrimary+","+cfg.phoneNumberSecondary, 
				message : "test Mobo message from client-side test to multiple addresses with group enabled",
				subject : "test Mobo subject from client-side test to multiple addresses with group enabled",
				group   : true,
				success : function(response) {
					start();
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo to multiple addresses with group enabled." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		//Tests sending Mobo with an attachment
        slowTest("Mobo with an attachment", function() {
			provider.sendMobo({
				address : cfg.phoneNumberPrimary, 
				message : "test Mobo message from client-side test with attachment",
				subject : "test Mobo subject from client-side test with attachment",
				group   : false,
				files   : ['hello.jpg'],
				success : function(response) {
					start();
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo with attachment." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		//Tests sending Mobo with null subject
        slowTest("Mobo with null subject", function() {
			provider.sendMobo({
				address : cfg.phoneNumberPrimary, 
				message : "test Mobo message from client-side test with null subject",
				subject : null,
				group   : false,
				success : function(response) {
					start();
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo with null subject." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		//Tests sending Mobo with an attachment but no message
        slowTest("Mobo with attachment but no message", function() {
			provider.sendMobo({
				address : cfg.phoneNumberPrimary, 
				message : null,
				subject : "test Mobo subject from client-side test with attachment but no message",
				group   : false,
				files   : ['hello.jpg'],
				success : function(response) {
					start();
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo with attachment but no message." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		//Tests sending Mobo with an attachment but no message or subject
        slowTest("Mobo with attachment but no message or subject", function() {
			provider.sendMobo({
				address : cfg.phoneNumberPrimary, 
				message : null,
				subject : null,
				group   : false,
				files   : ['hello.jpg'],
				success : function(response) {
					start();
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo with attachment but no message or subject." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
	}
