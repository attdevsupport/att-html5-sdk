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
		var jsonObj = {
					ClientApp: 'TestApp1'
						}
	function basicSMSTests(cfg) {
		//Tests sending SMS
        slowTest("sendSms", function() {
			AttApiClient.sendSms({
				addresses: cfg.primaryTestPhoneNumber,
				message: "test sending SMS from client side",
				xarg     : jsonObj},
				function(response){
					start();
					validateSmsResponse(response);
				},
				function(response){
					start();
					ok(false, "Fail on sending SMS message." +
						"\nresponse: " + JSON.stringify(response));	
				}
			);
			stop();
        });
		
        slowTest("sendSms Football to personal cell phone", function() {
			AttApiClient.sendSms({
				addresses: cfg.primaryTestPhoneNumber,
				message: "Football"},
				function(response){
					start();
					validateSmsResponseWithMessage(response, "personal phone: "+ cfg.primaryTestPhoneNumber);
				},
				function(response){
					start();
					ok(false, "Fail on sending SMS message Football to personal cell phone." +
											"\nresponse: " + JSON.stringify(response));	
				}
			);
			stop();
        });
		
		/*
		 * Tests checking the status of an SMS message. Note that the tests first sends a SMS and validates the response, then gets the status of
		 * that SMS if the SMS sends successfully.
		 */
        slowTest("smsStatus", function() {
        	var messageTest = "SmsTest" + Math.random().toString();
        	AttApiClient.sendSms({
				addresses : cfg.primaryTestPhoneNumber, 
				message : cfg.smsStatusMessage}, 
        		function(response) {
        			start();
        			slowFn(function() {
        				AttApiClient.smsStatus({
							id   : response["outboundSMSResponse"]["messageId"]},
	        				function(response) {
	        					start();
								validateStatusResponse(response);
	        				},
	        				function(response) {
	        					start();
	        					ok(false, "Fail on checking status of an SMS message." +
											"\nresponse: " + JSON.stringify(response));	
	        				}
        				);
    				}); 
					stop();
        		},
        		function(response) {
        			start();
                    ok(false, "Fail on sending SMS message for checking status." +
											"\nresponse: " + JSON.stringify(response));	
        		}
        	);
        	stop();
        });
		
		//Tests getting messages for the shortcode of the application		
		slowTest("smsGetMessages", function() {
			// alert("Working with smsGetMessages. \nThis might work with a valid shortcode.");
			AttApiClient.getSms({
				shortcode: '44629356'},
				function(response) {
					start();
					ok(false, "Strangely succeeded on getting messages sent to shortcode of application." +
						"\nresponse: " + JSON.stringify(response));	
					validateGetSmsResponse(response);
				},
				function(response) {
					start();
					ok(false, "Fail on getting messages sent to shortcode of application." +
						"\nresponse: " + JSON.stringify(response));	
				}
			);
			stop();
		});
		
/* 		//Tests getting messages for the shortcode of the application; uses old, invalid shortcode.
		slowTest("smsGetMessages from inactive shortcode", function() {
			// alert("Working with smsGetMessages. \nThis might work with a valid RegistrationID.");
			AttApiClient.getSms({
				RegistrationID: cfg.inactiveShortcode}, 
				function(response) {
					start();
					ok(false, "Succeeded in getting messages sent to an old, invalid shortcode." +
						"\nresponse: " + JSON.stringify(response));	
					validateGetSmsResponse(response);
				},
				function(response) {
					start();
					ok(false, "Failed to get messages sent to shortcode of application." +
						"\nresponse: " + JSON.stringify(response));	
				}
			);
			stop();
		}); */
		
/* 		//Tests getting messages for the shortcode of the application		
		slowTest("smsGetMessages from active shortcode", function() {
			// alert("Working with smsGetMessages. \nThis might work with a valid RegistrationID.");
			AttApiClient.getSms({
				RegistrationID: cfg.activeShortcode}, 
				function(response) {
					start();
					ok(true, "Succeeded in getting messages sent to the application shortcode." +
						"\nresponse: " + JSON.stringify(response));	
					validateGetSmsResponse(response);
				},
				function(response) {
					start();
					ok(false, "Failed to get messages sent to shortcode of application." +
						"\nresponse: " + JSON.stringify(response));	
				}
			);
			stop();
		}); */
	}
