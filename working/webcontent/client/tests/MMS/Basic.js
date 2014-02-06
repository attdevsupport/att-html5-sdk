	function basicMMSTests(cfg) {	
		//Tests sending MMS
		slowTest("sendMms", function() {
			provider.sendMms({
				address  : cfg.phoneNumberPrimary,
				fileId   : "hello.jpg", 
				message  : "test MMS message from client-side test", 
				priority : "High", 
				success  : function(response) {
					start();
					validateMmsResponse(response);
				},
				failure  : function(response) {
					start();
					ok(false, "Fail On Sending Single MMS." +
						"\nresponse: " + JSON.stringify(response));
				}
			});
			stop();
		});
		
		/*
		 * Tests checking the status of an MMS message. Note that the tests first sends a MMS and validates the response, then gets the status of
		 * that MMS if the MMS sends successfully.
		 */
        slowTest("mmsStatus", function() {
        	var messageTestMms = "MmsTest" + Math.random().toString();
        	provider.sendMms({
				address  : cfg.phoneNumberPrimary,
				fileId   : "hello.jpg",
				message  : messageTestMms,
				priority : "High",
        		success  : function(response) {
        			start();
        			slowFn(function() {
        				provider.getMmsStatus({
							mmsId   : response.Id,
	        				success : function(response) {
	        					start();
	        					validateMmsStatusResponse(response);
	        				},
	        				failure : function(response) {
	        					start();
	        					ok(false, "Fail on checking status of an MMS message." +
	        						"\nresponse: " + JSON.stringify(response));
	        				}
        				});
    				}); 
					stop();
        		},
        		failure  : function(response) {
        			start();
                  ok(false, "Fail on sending MMS message for checking status." +
                    "\nresponse: " + JSON.stringify(response));
        		}
        	});
        	stop();
        });
	}
