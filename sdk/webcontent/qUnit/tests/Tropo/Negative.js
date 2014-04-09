
		
	function negativeTropoTests() {
		// Negative tests utilizing the call management service API
		
		
		slowTest("Calling Tropo with null message for Parameters ", function() {
			var jsonObj = null;
			provider.cmsCreateSession({
				parameters : jsonObj,
				success : function(response) {
					start();
					ok(true, "Call to cmsCreateSession returned successfully." +
						"\nresponse: " + JSON.stringify(response));	
					validateTropoResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in calling cmsCreateSession." +
						"\nresponse: " + JSON.stringify(response));	
					validateTropoFailResponse(response);
				}
			});
			stop();
		});
		
			slowTest("Tropo + Send Signal negative test", function() {
		
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
							sessionId : 'abc123doremi',//response['id'],
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
					slowFn(function() {
						provider.cmsSendSignal({
							sessionId : 'abc123doremi',//response['id'],
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
				}
			});
			stop();
        });
}
