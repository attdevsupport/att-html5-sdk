    function negativeSMSTests(cfg) { 
		//Tests sending SMS with improper address. Should fail and produce an error response.
		slowTest("Send SMS with improper address", function() {
			provider.sendSms({
				address : cfg.phoneNumberInvalid, 
				message : "test SMS message from client-side test improper address",
				success : function(response) {
					start();
					ok(true, "Strangely succeeded in Sending SMS with improper address." +
						"\nresponse: " + JSON.stringify(response));	
					validateSmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in sending SMS with improper address." +
						"\nresponse: " + JSON.stringify(response));	
					validateSmsFailBadNumberResponse(response);
				}
			});
			stop();
        });
		
		//Tests sending SMS with landline address. Should fail and produce an error response.
		slowTest("Send SMS with landline address", function() {
			provider.sendSms({
				address : cfg.phoneNumberLandline, 
				message : "test SMS message from client-side test landline address",
				success : function(response) {
					start();
					ok(true, "Strangely succeeded in Sending SMS with landline address." +
						"\nresponse: " + JSON.stringify(response));	
					validateSmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in sending SMS with landline address." +
						"\nresponse: " + JSON.stringify(response));	
					validateSmsFailLandlineResponse(response);
				}
			});
			stop();
        });

		// Tests sending SMS to the active shortcode. Should fail and produce an error response.
		slowTest("sendSms Baseball to the active shortcode", function() {
			provider.sendSms({
				address : cfg.activeShortcode,
				message: "Baseball",
				success: function(response){
					start();
					ok(true, "Strangely succeeded in sending SMS message Baseball to a shortcode." +
						"\nresponse: " + JSON.stringify(response));	
					validateSmsResponseWithMessage(response, "active shortcode: "+cfg.activeShortcode);
				},
				failure: function(response){
					start();
					ok(false, "Fail on sending SMS message Baseball to shortcode." +
						"\nresponse: " + JSON.stringify(response));	
					validateSmsServiceException(response);
				}
			});
			stop();
        });
		
		// 12 destination addresses, to trigger a service exception with SMS and MMS.
		slowTest("SMS to 12 destination addresses", function() {
			provider.sendSms({
				address : cfg.destination12SansShort,
				fileId : "hello.jpg",
				message : "test Mobo message from client-side test",
				priority : "High", 
				success : function(response) {
					start();
					ok(true, "Strangely succeeded in Sending Mobo to more than 12 addresses." +
						"\nresponse: " + JSON.stringify(response));	
					validateSmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in sending Mobo to more than 12 addresses." +
						"\nresponse: " + JSON.stringify(response));	
					validateSmsServiceException(response);
				}
			});
			stop();
        });
		
		// Duplicate destination email, to trigger policy errors or service exceptions with SMS, MMS, and MOBO.
		slowTest("Sms to duplicate email addresses", function() {
			provider.sendSms({
				address : cfg.duplicateEmail,
				message : "test Sms message from client-side test",
				subject : "test Sms subject from client-side test",
				group   : false,
				success : function(response) {
					start();
					ok(true, "Strangely succeeded in Sending Sms to duplicate email addresses." +
						"\nresponse: " + JSON.stringify(response));	
					validateSmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in sending Sms to duplicate email addresses." +
						"\nresponse: " + JSON.stringify(response));	
					validateSmsDuplicatePolicyFailure(response);
				}
			});
			stop();
        });
		
		// Duplicate destination phone, to trigger policy errors or service exceptions with SMS, MMS, and MOBO.
		slowTest("Sms to duplicate phone numbers", function() {
			provider.sendSms({
				address : cfg.duplicatePhone,
				message : "test Sms message from client-side test",
				subject : "test Sms subject from client-side test",
				group   : false,
				success : function(response) {
					start();
					ok(true, "Strangely succeeded in Sending Sms to duplicate phone numbers." +
						"\nresponse: " + JSON.stringify(response));	
					validateSmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in sending Sms to duplicate phone numbers." +
						"\nresponse: " + JSON.stringify(response));	
					validateSmsDuplicatePolicyFailure(response);
				}
			});
			stop();
        });
		
		//Tests sending SMS with null address. Should fail and produce an error response.
		slowTest("Send SMS with null address", function() {
			provider.sendSms({
				address : null, 
				message : "test SMS message from client-side test null address",
				success : function(response) {
					start();
					ok(true, "Strangely succeeded in sending SMS with null address." +
						"\nresponse: " + JSON.stringify(response));	
					validateSmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in sending SMS with null address." +
						"\nresponse: " + JSON.stringify(response));	
					validateSmsFailBadNumberResponse(response);
				}
			});
			stop();
        });
		
		//Tests sending SMS with null message. Should fail and produce an error response.
		slowTest("Send SMS with null message", function() {
			provider.sendSms({
				address : cfg.phoneNumberPrimary, 
				message : null,
				success : function(response) {
					start();
					ok(true, "Strangely succeeded in sending SMS with null message." +
						"\nresponse: " + JSON.stringify(response));	
					validateSmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in sending SMS with null message." +
						"\nresponse: " + JSON.stringify(response));	
					validateSmsFailNoMessageResponse(response);
				}
			});
			stop();
        });
		
		//Tests requesting SMS status with invalid smsId. Should fail and produce an error response. 
		slowTest("Request smsStatus with invalid smsId", function() {
			provider.getSmsStatus({
				smsId : "thisIsNotAValidsmsId",
				success : function(response) {
	        		start();
					ok(true, "Succeeded strangely in retrieving smsStatus with invalid smsId." +
						"\nresponse: " + JSON.stringify(response));	
					validateSmsFailBadIDResponse(response);
	        	},
	        	failure : function(response) {
	        		start();
					ok(false, "Failed in retrieving smsStatus with invalid smsId." +
						"\nresponse: " + JSON.stringify(response));	
					validateSmsFailBadIDResponse(response);
	        	}
			});
			stop();
		});
	}
