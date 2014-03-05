	function positiveMimTests(cfg) {
		/**
         * Tests utilizing the MIM API.
         *
		 * Before retrieving the MIM headers, we must will check to see if the application is
		 * authorized to do so. If not, we attempt to obtain authorization. If authorization is
		 * granted, we send a request to retrieve a set of message headers from the AT&T API by 
		 * making a call to 'doGetMessageHeaders'.
		 */
		slowTest("MIM getContentSrc URL for Headers with Content and PartNumber: {headerCount: \"24\", indexCursor: \"\"}", function() {
			provider.isAuthorized({
				authScope : "MIM",
				success   : function(response) {
					start();
					doGetMessageHeadersThenContent("24");
				},
				failure : function(response) {
					start();
					provider.authorizeApp({
						authScope : "MIM",
						success   : function(response) {
							start();
							doGetMessageHeadersThenContent("24");
						},
						failure : function(response) {
							start();
							ok(false, "Access denied -- the User denied authorization.");
						},
					});
					stop();
				}
			});
			stop();
		});
		
		slowTest("MIM getMessageHeaders: {headerCount: \"5\", indexCursor: \"\"}", function() {
			provider.isAuthorized({
				authScope : "MIM",
				success   : function(response) {
					start();
					doGetMessageHeaders("5");
				},
				failure : function(response) {
					start();
					provider.authorizeApp({
						authScope : "MIM",
						success   : function(response) {
							start();
							doGetMessageHeaders("5");
						},
						failure : function(response) {
							start();
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
		
		function doGetMessageHeadersThenContent(count) {
			slowFn(function() {
				provider.getMessageHeaders({
					headerCount: count,
					indexCursor: "",
					success : function(response) {
						start();
						ok(true, "In For Content, Succeeded in Utilizing MIM  to get " + count + " message header(s).");
						// validateMIMHeadersResponse(response);
						messageHeadersList = response["MessageHeadersList"];
						theHeaders = messageHeadersList["Headers"];
						// ok(true, "theHeaders are: " +  JSON.stringify(theHeaders));
						var i;
						for (i = 0; i < count; i++)
						{
							aHeader = theHeaders.shift();
							theMessageId = aHeader["MessageId"];
							mmsContent = aHeader["MmsContent"];
							if (mmsContent) {
								ok(true, "aHeader " + i + " is: " +  JSON.stringify(aHeader));
								ok(true, "theMessageId " + i + " is: " +  JSON.stringify(theMessageId));
								ok(true, "mmsContent " + i + " is: " +  JSON.stringify(mmsContent));
								anMmsContentElement = mmsContent.shift();
								ok(true, "anMmsContentElement " + i + " is: " +  JSON.stringify(anMmsContentElement));
								partNum = anMmsContentElement["PartNumber"];
								ok(true, "partNum " + i + " is: " +  JSON.stringify(partNum));
								// since the getContentSrc function is static, we seem unable to call it with "provider".
								url = Att.Provider.getContentSrc(theMessageId, partNum);
								ok(true, "URL " + i + " is: " +  url);
							}
					    }
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
