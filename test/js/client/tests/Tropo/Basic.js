	function basicTropoTests() {
		//Tests utilizing the advertising API
		
	slowTest("Tropo + Send Signal", function() {
		
		var jsonObj = {
				"feature" : "call",
				"numberToDial" : "4252863726",
				"cmsMessage" : "",
			};
			
			
			provider.cmsCreateSession({
				parameters : jsonObj,
				success : function(response) {
					start();
					ok(true, "Succeeded in calling Create Session." +
						"\nresponse: " + JSON.stringify(response));
					validateTropoResponse(response);
					
					slowFn(function() {
						provider.cmsSendSignal({
							sessionId : response['id'],
							signal : "exit",
							success : function(response) {
								start();
									ok(true, "Call to cmsSendSignal returned successfully." +
										"\nresponse: " + JSON.stringify(response));
							},
							failure : function(response) {
								start();
									ok(false, "Failed in calling cmsSendSignal." +
										"\nresponse: " + JSON.stringify(response));	
							}
						});
					});
					stop();
				},
				failure : function(response) {
					start();
					ok(false, "Fail in calling Create Session." +
						"\nresponse: " + JSON.stringify(response));
				}
			});
			stop();
        });

	}
