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
	function basicMMSTests(cfg) {	
		//Tests sending MMS
		slowTest("sendMms", function() {
			AttApiClient.MMS.sendMms({
				addresses  : cfg.primaryTestPhoneNumber,
				fileId   : "coupon.jpg", 
				message  : "test MMS message from client-side test", 
				priority : "High"},
				null,
				function(response) {
					start();
					validateMmsResponse(response);
                    s=true;
				},
				function(response) {
					start();
					ok(false, "Fail On Sending Single MMS." +
						"\nresponse: " + JSON.stringify(response));
				}
			);
			stop();
		});
		
		/*
		 * Tests checking the status of an MMS message. Note that the tests first sends a MMS and validates the response, then gets the status of
		 * that MMS if the MMS sends successfully.
		 */
        slowTest("mmsStatus", function() {
        	var messageTestMms = "MmsTest" + Math.random().toString();
        	AttApiClient.MMS.sendMms({
				addresses  : cfg.primaryTestPhoneNumber,
				fileId   : "hello.jpg",
				message  : messageTestMms,
				priority : "High"},
				null,
        		function(response) {
        			start();
        			slowFn(function() {
        				AttApiClient.MMS.mmsStatus({
							id   : response["outboundMessageResponse"]["messageId"]},
	        				function(response) {
	        					start();
								ok(true, "Received status message");
	        					validateMmsStatusResponse(response);
	        				},
	        				function(response) {
	        					start();
	        					ok(false, "Fail on checking status of an MMS message." +
	        						"\nresponse: " + JSON.stringify(response));
	        				}
        				);
    				}); 
					stop();
        		},
        		function(response) {
        			start();
                  ok(false, "Fail on sending MMS message for checking status." +
                    "\nresponse: " + JSON.stringify(response));
        		}
        	);
        	stop();
        });
        
        //NEGATIVE TESTS
        slowTest("Negative - invalid Address", function() {
			AttApiClient.MMS.sendMms({
				addresses  : '1234567890',
				fileId   : "coupon.jpg", 
				message  : "test MMS message from client-side test", 
				priority : "High"},
				null,
				function(response) {
					start();
					validateMmsResponse(response);
				},
				function(response) {
					start();
					ok(true, "Fail On Sending Single MMS." +
						"\nresponse: " + JSON.stringify(JSON.parse(response['responseText'])['error']));
				}
			);
			stop();
		});
        
        slowTest("Negative - Invalid Message ID", function() {
            AttApiClient.MMS.mmsStatus({
                id   : 'InvalidMessageId'},
                function(response) {
                    start();
                    ok(false, "Received status message");
                    validateMmsStatusResponse(response);
                },
                function(response) {
                    start();
                    ok(true, "Fail on checking status of an MMS message." +
                        "\nresponse: " + JSON.stringify(JSON.parse(response['responseText'])['error']));
                }
            );
            stop();
        }); 
	}
