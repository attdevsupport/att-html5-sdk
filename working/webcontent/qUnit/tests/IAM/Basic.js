	function basicIAMTests(cfg) {
	
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
		/**
         * Tests utilizing the MIM API.
         *
		 * Before retrieving the MIM headers, we must will check to see if the application is
		 * authorized to do so. If not, we attempt to obtain authorization. If authorization is
		 * granted, we send a request to retrieve a set of message headers from the AT&T API by 
		 * making a call to 'doGetMessageHeaders'.
		 */
		 
		 /*
		slowTest("MIM Retrieving a single message header: {headerCount: \"1\", indexCursor: \"\"}", function() {
			/*AttApiClient.isUserAuthorized(
				{authScope : "MIM"},
				function(response) {
					start();
					alert("App authorized us " + JSON.stringify(response));
					doGetMessageHeaders("1");
				},
				function(response) {
					start();
					alert("preparing to authorize app: " + JSON.stringify(response));
					AttApiClient.authorizeUser({
						authScope : "MIM"},
						function(response) {
							start();
						alert("authorizing user response: " + JSON.stringify(response));
							doGetMessageHeaders("1");
						},
						function(response) {
							start();
                            // We never seem to get to the next line.
							alert("failed in  authorizing app: " + JSON.stringify(response));
							ok(false, "Access denied -- the User denied authorization.");
						}
					);
					stop();
			});
			
			var count = 100;
			AttApiClient.getMessageHeaders({
					headerCount: count,
					indexCursor: ""},
					function(response) {
						start();
						ok(true, "Succeeded in Utilizing MIM  to get " + count + " message header(s).");
						validateMIMHeadersResponse(response);
					},
					function(response) {
						start();
						ok(false, "Failed in Utilizing MIM getMessageHeaders." + 
							"\nresponse: " + JSON.stringify(response));
						validateFailToGetMimMessageHeaders(response);
					}
				);
			stop();
		});
		*/
		slowTest("IAM Get MMS Message List from server",function(){
			var count = 100;
			AttApiClient.getMessageList({
				headerCount: count,
				indexCursor: ""},
				function(response) {
					start();
					
					ok(true, "Succeeded in Utilizing MIM  to get up to " + count + " message messages.");
					validateMIMMMSMessageResponse(response);
				},
				function(response) {
					start();
					ok(false, "Failed in Utilizing MIM getMessageHeaders." + 
						"\nresponse: " + JSON.stringify(response));
					validateFailToGetMimMessageHeaders(response);
				}
			);
			stop();
		});
		slowTest("IAM Get TEXT Message List from server",function(){
			var count = 10;
			var offset = 0;
			
			AttApiClient.getMessageList({
				headerCount: count,
				offset: ""},
				function(response) {
					start();
					
					ok(true, "Succeeded in Utilizing MIM  to get up to " + count + " message messages.");
					validateMIMSMSMessageResponse(response);
				},
				function(response) {
					start();
					ok(false, "Failed in Utilizing MIM getMessageHeaders." + 
						"\nresponse: " + JSON.stringify(response));
					validateFailToGetMimMessageHeaders(response);
				}
			);
			stop();
		});
		/* Left over code from Sencha's previous approach; Provider no longer contains a getMessageContents function.
		
		slowTest("getMessageContents: {headerCount: \"6\", indexCursor: \"\"}", function() {
			provider.getMessageHeaders({
				headerCount: "6",
				indexCursor: "",
				success : function(response) {
					start();
					slowFn(function() {
						provider.getMessageContents({
							messageId: response["MessageId"],
							partNumber: partNumber, // Parameter seen in TC6, but getMessageContents gone in TC7D12.
							success : function(response) {
								start();
								validateMIMContentsResponse(response);
							},
							failure : function(response) {
								start();
								ok(false, "Fail On Utilizing MIM getMessageContents" +
								  "\nresponse: " + JSON.stringify(response));
							}
						});
					});
					stop();
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing MIM getMessageHeaders for getMessageContents." + 
					"\nresponse: " + JSON.stringify(response));
					// validateFailToGetMimMessageHeaders(response);
				}
			});
			stop();
		}); */
		
		function doGetMessageHeaders(count) {
			slowFn(function() {
				AttApiClient.getMessageList({
					headerCount: count,
					indexCursor: "",
					success : function(response) {
						start();
						ok(true, "Succeeded in Utilizing MIM  to get " + count + " message header(s).");
						validateMIMHeadersResponse(response);
					},
					failure : function(response) {
						start();
						ok(false, "Failed in Utilizing MIM getMessageHeaders." + 
							"\nresponse: " + JSON.stringify(response));
						validateFailToGetMimMessageHeaders(response);
					}
				});
			});
			stop();
		}
	}
