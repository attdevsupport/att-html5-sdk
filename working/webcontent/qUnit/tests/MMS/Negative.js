    function negativeMMSTests(cfg) {
		//Tests sending MMS with improper address. Should fail and produce an error response.
		slowTest("Send MMS with improper address", function() {
			provider.sendMms({
				address : cfg.phoneNumberInvalid, 
				fileId   : "hello.jpg",
				message : "test MMS message from client-side test with improper address",
				priority : "High", 
				success : function(response) {
					start();
					ok(true, "Succeeded in sending MMS with improper address." +
						"\nresponse: " + JSON.stringify(response));
					validateMmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in sending MMS with improper address." +
						"\nresponse: " + JSON.stringify(response));
					validateMmsFailBadAddressResponse(response);
				}
			});
			stop();
        });
		
		//Tests sending MMS with landline address. Should fail and produce an error response.
		slowTest("Send MMS with landline address", function() {
			provider.sendMms({
				address  : cfg.phoneNumberLandline,
				fileId   : "hello.jpg",
				message  : "test MMS message from client-side test with landline address",
				priority : "High", 
				success  : function(response) {
					start();
					ok(true, "Succeeded in sending MMS with landline address." +
						"\nresponse: " + JSON.stringify(response));
					validateMmsResponse(response);
				},
				failure  : function(response) {
					start();
					ok(false, "Failed in sending MMS with landline address." +
						"\nresponse: " + JSON.stringify(response));
					validateMmsFailResponse(response);
				}
			});
			stop();
        });

		// 12 destination addresses, to trigger a service exception with SMS and MMS.
		slowTest("MMS to 12 destination addresses", function() {
			provider.sendMms({
				address : cfg.destination12SansShort,
				fileId : "hello.jpg",
				message : "test Mms message from client-side test",
				priority : "High", 
				success : function(response) {
					start();
					ok(true, "Strangely succeeded in Sending Mms to more than 12 addresses!" +
						"\nresponse: " + JSON.stringify(response));	
					validateMmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in sending Mms to more than 12 addresses." +
						"\nresponse: " + JSON.stringify(response));	
					validateMmsServiceException(response);
				}
			});
			stop();
        });

		// MMS to email destination, which generates a service exception, since it is not a permitted address.
		slowTest("Mms to personal email address", function() {
			provider.sendMms({
				address : cfg.personalEmail,
				fileId  : "hello.jpg",
				message : "test Mms message from client-side test",
				subject : "test Mms subject from client-side test",
				success : function(response) {
					start();
					ok(true, "Succeeded in sending Mms to an email address." +
						"\nresponse: " + JSON.stringify(response));	
					validateMmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in sending Mms to an email address." +
						"\nresponse: " + JSON.stringify(response));	
					validateMmsServiceException(response);
				}
			});
			stop();
        });
		
		// Duplicate destination phone, to trigger policy errors or service exceptions with SMS, MMS, and MOBO.
		slowTest("Mms to duplicate phone numbers", function() {
			provider.sendMms({
				address : cfg.duplicatePhone,
				fileId  : "hello.jpg",
				message : "test Mms message from client-side test",
				subject : "test Mms subject from client-side test",
				success : function(response) {
					start();
					ok(true, "Succeeded in sending Mms to duplicate phone numbers." +
						"\nresponse: " + JSON.stringify(response));	
					validateMmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail in sending Mms to duplicate phone numbers." +
						"\nresponse: " + JSON.stringify(response));	
					validateMmsDuplicatePolicyFailure(response);
				}
			});
			stop();
        });
		
		//Tests sending MMS with null address. Should fail and produce an error response.
		slowTest("Send MMS with null address", function() {
			provider.sendMms({
				address : null, 
				fileId   : "hello.jpg",
				message : "test MMS message from client-side test with null address",
				priority : "High", 
				success : function(response) {
					start();
					ok(true, "Succeeded in sending MMS with null address." +
						"\nresponse: " + JSON.stringify(response));
					validateMmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in sending MMS with null address." +
						"\nresponse: " + JSON.stringify(response));
					validateMmsFailBadAddressResponse(response);
				}
			});
			stop();
        });
		
		//Tests sending MMS with null message. Should fail and produce an error response.
		slowTest("Send MMS with null message & no fileId", function() {
			provider.sendMms({
				address : cfg.phoneNumberPrimary,  
				message : null,
				priority : "High", 
				success : function(response) {
					start();
					ok(true, "Succeeded in sending MMS with null message & no attachment." +
						"\nresponse: " + JSON.stringify(response));
					validateMmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in sending MMS with null message & no attachment." +
						"\nresponse: " + JSON.stringify(response));
					validateMmsFailNullMessageResponse(response);
				}
			});
			stop();
        });
		
		//Tests sending MMS with null message. Should work fine.
		slowTest("Send MMS with null message but attached file", function() {
			provider.sendMms({
				address : cfg.phoneNumberPrimary,  
				fileId   : "hello.jpg",
				message : null,
				priority : "High", 
				success : function(response) {
					start();
					ok(true, "Succeeded in sending MMS with null message but attached file." +
						"\nresponse: " + JSON.stringify(response));
					validateMmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in sending MMS with null message but attached file." +
						"\nresponse: " + JSON.stringify(response));
					validateMmsFailNullMessageResponse(response);
				}
			});
			stop();
        });
		
		//Tests sending MMS with nonexistent fileId. Should fail before sending the request and get no response back.
		slowTest("Send MMS with a nonexistent fileId", function() {
			provider.sendMms({
				address : cfg.phoneNumberPrimary,  
				fileId   : "hello1.jpg",
				message : "test MMS message from client-side with a nonexistent fileId",
				priority : "High", 
				success : function(response) {
					start();
					ok(true, "Succeeded in sending MMS with a nonexistent fileId." +
						"\nresponse: " + JSON.stringify(response));
					validateMmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in sending MMS with a nonexistent fileId." +
						"\nresponse: " + JSON.stringify(response));
				}
			});
			stop();
        });
		
		//Tests sending MMS with null fileId. Should fail before sending the request and get no response back.
		slowTest("Send MMS with a null fileId", function() {
			provider.sendMms({
				address : cfg.phoneNumberPrimary, 
				fileId   : null,
				message : "test MMS message from client-side test with null fileId",
				priority : "High", 
				success : function(response) {
					start();
					ok(true, "Succeeded in sending MMS with a null fileId." +
						"\nresponse: " + JSON.stringify(response));
					validateMmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in ending MMS with a null fileId." +
						"\nresponse: " + JSON.stringify(response));
				}
			});
			stop();
        });
		
		//Tests sending MMS with an invalid priority. Should fail and produce an error response.
		slowTest("Send MMS with an invalid priority", function() {
			provider.sendMms({
				address : cfg.phoneNumberPrimary, 
				fileId   : "hello.jpg",
				message : "test MMS message from client-side test with an invalid priority",
				priority : "High1", 
				success : function(response) {
					start();
					ok(true, "Succeeded in sending MMS with an invalid priority." +
						"\nresponse: " + JSON.stringify(response));
					validateMmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in sending MMS with an invalid priority." +
						"\nresponse: " + JSON.stringify(response));
					validateMmsFailBadPriorityResponse(response);
				}
			});
			stop();
        });
		
		//Tests requesting MMS status with an invalid mmsId. Should fail and produce an error response. 
		slowTest("Request mmsStatus with an invalid mmsId", function() {
			provider.getMmsStatus({
				mmsId : "thisIsNotAValidmmsId",
				success : function(response) {
	        		start();
					ok(true, "Succeeded in sending mmsStatus with an invalid mmsId." +
						"\nresponse: " + JSON.stringify(response));
					validateMmsResponse(response);
	        	},
	        	failure : function(response) {
	        		start();
					ok(false, "Failed in retrieving mmsStatus with an invalid mmsId." +
						"\nresponse: " + JSON.stringify(response));
					validateMmsFailBadMmsIdResponse(response);
	        	}
			});
			stop();
		});
	}
