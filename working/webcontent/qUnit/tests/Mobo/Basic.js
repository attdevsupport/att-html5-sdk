	function basicMoboTests(cfg) {
		//Tests sending Mobo
        slowTest("Mobo to phone", function() {
			provider.sendMobo({
				address : cfg.phoneNumberPrimary, 
				message : "test Mobo message from client-side test",
				subject : "test Mobo subject from client-side test",
				group   : false,
				success : function(response) {
					start();
					validateMoboResponseWithMessage(response, "primary phone: "+cfg.phoneNumberPrimary);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo to the primary phone." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });

        // Personal email, so I can see messages arrive in my inbox.
        slowTest("Mobo to email", function() {
			provider.sendMobo({
				address : cfg.personalEmail,
				message : "test Mobo message from client-side test",
				subject : "test Mobo subject from client-side test",
				group   : false,
				success : function(response) {
					start();
					validateMoboResponseWithMessage(response, "personal email: "+cfg.personalEmail);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo to my personal email." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });

        slowTest("Mobo Football message to personal phone", function() {
			provider.sendMobo({
				address: cfg.personalCellPhone, 
				message : "Football",
				subject : null,
				group   : false,
				success : function(response) {
					start();
					validateMoboResponseWithMessage(response, "personal phone: "+cfg.personalCellPhone);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo Football message to personal phone." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });

        slowTest("Mobo SMS Football message to active short code", function() {
			provider.sendMobo({
				address : cfg.activeShortcode, 
				message : "Football",
				subject : null,
				group   : false,
				success : function(response) {
					start();
					validateMoboResponseWithMessage(response, "active shortcode: "+cfg.activeShortcode);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo Football message to active short code." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });

        slowTest("Mobo Baseball message to personal phone", function() {
			provider.sendMobo({
				address: cfg.personalCellPhone, 
				message : "Baseball",
				subject : null,
				group   : false,
				success : function(response) {
					start();
					validateMoboResponseWithMessage(response, "personal phone: "+cfg.personalCellPhone);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo Baseball message to personal phone." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });

        slowTest("Mobo SMS Baseball message to active short code", function() {
			provider.sendMobo({
				address : cfg.activeShortcode, 
				message : "Baseball",
				subject : null,
				group   : false,
				success : function(response) {
					start();
					validateMoboResponseWithMessage(response, "active shortcode: "+cfg.activeShortcode);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo Baseball message to active short code." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });

        // We seem to have problems sending messages to short codes now. (Not that I can see. JSF 8/3/12)
        slowTest("Mobo to short code", function() {
			provider.sendMobo({
				address : "76851156", 
				message : "test Mobo message from client-side test",
				subject : "test Mobo subject from client-side test",
				group   : false,
				success : function(response) {
					start();
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo to a short code." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
	}
