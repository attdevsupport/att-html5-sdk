	function basicMimTests(cfg) {
		/**
         * Tests utilizing the MIM API.
         *
		 * Before retrieving the MIM headers, we must will check to see if the application is
		 * authorized to do so. If not, we attempt to obtain authorization. If authorization is
		 * granted, we send a request to retrieve a set of message headers from the AT&T API by 
		 * making a call to 'doGetMessageHeaders'.
		 */
		slowTest("MIM Retrieving a single message header: {headerCount: \"1\", indexCursor: \"\"}", function() {
			provider.isAuthorized({
				authScope : "MIM",
				success   : function(response) {
					start();
					doGetMessageHeaders("1");
				},
				failure : function(response) {
					start();
					// alert("preparing to authorize app: " + JSON.stringify(response));
					provider.authorizeApp({
						authScope : "MIM",
						success   : function(response) {
							start();
							doGetMessageHeaders("1");
						},
						failure : function(response) {
							start();
                            // We never seem to get to the next line.
							// alert("failed in  authorizing app: " + JSON.stringify(response));
							ok(false, "Access denied -- the User denied authorization.");
						},
					});
					stop();
				}
			});
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
				provider.getMessageHeaders({
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
