	//Function that wraps all of the tests. Slows the tests for throttling purposes.
	function slowTest(name, code) {
		test(name, function() {
			slowFn(function() {
				start();
				code();
			});
			stop();
		})
	}
	
	//Function inside the slowTest function that allows manipulation of the throttling time.
	function slowFn(code) {
		setTimeout(code, 200);
	}
		
	function basicSMSTests(cfg) {
		//Tests sending SMS
        slowTest("sendSms", function() {
			provider.sendSms({
				address: cfg.phoneNumberPrimary,
				message: "test sending SMS from client side",
				success: function(response){
					start();
					validateSmsResponse(response);
				},
				failure: function(response){
					start();
					ok(false, "Fail on sending SMS message." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
        slowTest("sendSms Football to personal cell phone", function() {
			provider.sendSms({
				address: cfg.personalCellPhone,
				message: "Football",
				success: function(response){
					start();
					validateSmsResponseWithMessage(response, "personal phone: "+ cfg.personalCellPhone);
				},
				failure: function(response){
					start();
					ok(false, "Fail on sending SMS message Football to personal cell phone." +
											"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
        });
		
		/*
		 * Tests checking the status of an SMS message. Note that the tests first sends a SMS and validates the response, then gets the status of
		 * that SMS if the SMS sends successfully.
		 */
        slowTest("smsStatus", function() {
        	var messageTest = "SmsTest" + Math.random().toString();
        	provider.sendSms({
				address : cfg.phoneNumberPrimary, 
				message : messageTest, 
        		success  : function(response) {
        			start();
        			slowFn(function() {
        				provider.getSmsStatus({
							smsId   : response.Id, 
	        				success : function(response) {
	        					start();
								validateStatusResponse(response);
	        				},
	        				failure : function(response) {
	        					start();
	        					ok(false, "Fail on checking status of an SMS message." +
											"\nresponse: " + JSON.stringify(response));	
	        				}
        				});
    				}); 
					stop();
        		},
        		failure  : function(response) {
        			start();
                    ok(false, "Fail on sending SMS message for checking status." +
											"\nresponse: " + JSON.stringify(response));	
        		}
        	});
        	stop();
        });
		
		//Tests getting messages for the shortcode of the application		
		slowTest("smsGetMessages", function() {
			// alert("Working with smsGetMessages. \nThis might work with a valid RegistrationID.");
			provider.receiveSms({
				RegistrationID: 491,
				success : function(response) {
					start();
					ok(false, "Strangely succeeded on getting messages sent to shortcode of application." +
						"\nresponse: " + JSON.stringify(response));	
					validateGetSmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on getting messages sent to shortcode of application." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
		//Tests getting messages for the shortcode of the application; uses old, invalid shortcode.
		slowTest("smsGetMessages from inactive shortcode", function() {
			// alert("Working with smsGetMessages. \nThis might work with a valid RegistrationID.");
			provider.receiveSms({
				RegistrationID: cfg.inactiveShortcode, 
				success : function(response) {
					start();
					ok(false, "Succeeded in getting messages sent to an old, invalid shortcode." +
						"\nresponse: " + JSON.stringify(response));	
					validateGetSmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed to get messages sent to shortcode of application." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
		//Tests getting messages for the shortcode of the application		
		slowTest("smsGetMessages from active shortcode", function() {
			// alert("Working with smsGetMessages. \nThis might work with a valid RegistrationID.");
			provider.receiveSms({
				RegistrationID: cfg.activeShortcode, 
				success : function(response) {
					start();
					ok(true, "Succeeded in getting messages sent to the application shortcode." +
						"\nresponse: " + JSON.stringify(response));	
					validateGetSmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed to get messages sent to shortcode of application." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
	}
