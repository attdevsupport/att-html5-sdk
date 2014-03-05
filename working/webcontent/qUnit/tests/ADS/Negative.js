
		
	function negativeADSTests() {
		// Negative tests utilizing the advertising API
		
		slowTest("Calling Ads with an empty String for Parameters", function() {
			provider.getAd({
				udid : '123456789012345678901234567890',
				parameters : "",
				success : function(response) {
					start();
					ok(true, "Call to getAd returned successfully." +
						"\nresponse: " + JSON.stringify(response));	
					validateADSResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in calling getAd." +
						"\nresponse: " + JSON.stringify(response));	
					validateADSFailResponse(response);
				}
			});
			stop();
		});
		
		slowTest("Calling Ads with a null for the Parameters", function() {
			provider.getAd({
				udid : '123456789012345678901234567890',
				parameters : null,
				success : function(response) {
					start();
					ok(true, "Call to getAd returned successfully." +
						"\nresponse: " + JSON.stringify(response));	
					validateADSResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in calling getAd." +
						"\nresponse: " + JSON.stringify(response));	
					validateADSFailResponse(response);
				}
			});
			stop();
		});
		
		slowTest("Calling Ads with getValues message for Parameters (Gender male instead of M)", function() {
			var jsonObj = 
			{
				Category: "Auto",
				Gender: "male",
				ZipCode: "",
				AreaCode: "",
				City: "",
				Country: "",
				Longitude: "",
				Latitude: "",
				MaxHeight: "",
				MinHeight: "",
				MaxWidth: "",
				MinWidth: "",
				Type: "",
				Timeout: "",
				AgeGroup: "",
				Over18: "",
				Keywords: "",
				IsSizeRequired: "",
				Premium: ""
			}

			provider.getAd({
				udid : '123456789012345678901234567890',
				parameters : jsonObj,
				success : function(response) {
					start();
					ok(true, "Call to getAd returned successfully." +
						"\nresponse: " + JSON.stringify(response));	
					validateADSResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in calling getAd." +
						"\nresponse: " + JSON.stringify(response));	
					//
					validateADSInvalidGenderResponse(response);				}
			});
			stop();
		});
		
		slowTest("Calling Ads with Array ['Auto', 'M'] for Parameters", function() {
			var mydata = ['Auto', 'M'];
			provider.getAd({
				udid : '123456789012345678901234567890',
				parameters : mydata,
				success : function(response) {
					start();
					ok(true, "Call to getAd returned successfully." +
						"\nresponse: " + JSON.stringify(response));	
					validateADSResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in calling getAd." +
						"\nresponse: " + JSON.stringify(response));	
					validateADSFailResponse(response);
				}
			});
			stop();
		});
		
		slowTest("Calling Ads with CSV 'Auto,M' for Parameters", function() {
			var mydata = 'Auto,M';
			provider.getAd({
				udid : '123456789012345678901234567890',
				parameters : mydata,
				success : function(response) {
					start();
					ok(true, "Call to getAd returned successfully." +
						"\nresponse: " + JSON.stringify(response));	
					validateADSResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in calling getAd." +
						"\nresponse: " + JSON.stringify(response));	
					validateADSFailResponse(response);
				}
			});
			stop();
		});
		
		slowTest("Calling Ads with 'Auto' as a String for Parameters", function() {
			provider.getAd({
				udid : '123456789012345678901234567890',
				parameters : 'Auto',
				success : function(response) {
					start();
					ok(true, "Call to getAd returned successfully." +
						"\nresponse: " + JSON.stringify(response));	
					validateADSResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Failed in calling getAd." +
						"\nresponse: " + JSON.stringify(response));	
					validateADSFailResponse(response);
				}
			});
			stop();
		});
		

	}
