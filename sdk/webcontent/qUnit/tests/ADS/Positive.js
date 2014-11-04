//No positive advertising test cases outside basic at this time
	function positiveADSTests() {

				slowTest("Calling Ads with proper full getValues message for Parameters", function() {
			var jsonObj = 
			{
				Category: "Medical",
				Gender: "F",
				ZipCode: "98008",
				AreaCode: "425",
				City: "Bellevue",
				Country: "US",
				Longitude: "47N",
				Latitude: "122W",
				MaxHeight: "20",
				MinHeight: "10",
				MaxWidth: "20",
				MinWidth: "10",
				Type: "1",
				Timeout: "2999",
				AgeGroup: "14-25",
				Over18: "3",
				Keywords: "music",
				IsSizeRequired: "true",
				Premium: "0"
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
					validateADSFailResponse(response);
				}
			});
			stop();
		});
		
				slowTest("Calling Ads with another getValues message for Parameters + GENDER", function() {
			var jsonObj = 
			{
				Category: "Medical",
				Gender: "F",
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
					validateADSFailResponse(response);
				}
			});
			stop();
		});
				slowTest("Calling Ads with another getValues message for Parameters + ZIP", function() {
			var jsonObj = 
			{
				Category: "Medical",
				Gender: "",
				ZipCode: "98008",
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
					validateADSFailResponse(response);
				}
			});
			stop();
		});
				slowTest("Calling Ads with another getValues message for Parameters + AREACODE", function() {
			var jsonObj = 
			{
				Category: "Medical",
				Gender: "",
				ZipCode: "",
				AreaCode: "425",
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
					validateADSFailResponse(response);
				}
			});
			stop();
		});
				slowTest("Calling Ads with another getValues message for Parameters + CITY", function() {
			var jsonObj = 
			{
				Category: "Medical",
				Gender: "",
				ZipCode: "",
				AreaCode: "",
				City: "Bellevue",
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
					validateADSFailResponse(response);
				}
			});
			stop();
		});
		
				slowTest("Calling Ads with another getValues message for Parameters + COUNTRY", function() {
			var jsonObj = 
			{
				Category: "Medical",
				Gender: "",
				ZipCode: "",
				AreaCode: "",
				City: "",
				Country: "US",
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
					validateADSFailResponse(response);
				}
			});
			stop();
		});
		
				slowTest("Calling Ads with another getValues message for Parameters + COORDINATES", function() {
			var jsonObj = 
			{
				Category: "Medical",
				Gender: "",
				ZipCode: "",
				AreaCode: "",
				City: "",
				Country: "",
				Longitude: "47N",
				Latitude: "122W",
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
					validateADSFailResponse(response);
				}
			});
			stop();
		});
		
				slowTest("Calling Ads with another getValues message for Parameters + MAX HEIGHT", function() {
			var jsonObj = 
			{
				Category: "Medical",
				Gender: "",
				ZipCode: "",
				AreaCode: "",
				City: "",
				Country: "",
				Longitude: "",
				Latitude: "",
				MaxHeight: "20",
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
					validateADSFailResponse(response);
				}
			});
			stop();
		});
		
						slowTest("Calling Ads with another getValues message for Parameters + MIN HEIGHT", function() {
			var jsonObj = 
			{
				Category: "Medical",
				Gender: "",
				ZipCode: "",
				AreaCode: "",
				City: "",
				Country: "",
				Longitude: "",
				Latitude: "",
				MaxHeight: "",
				MinHeight: "20",
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
					validateADSFailResponse(response);
				}
			});
			stop();
		});
		
				slowTest("Calling Ads with another getValues message for Parameters + MAX WIDTH", function() {
			var jsonObj = 
			{
				Category: "Medical",
				Gender: "",
				ZipCode: "",
				AreaCode: "",
				City: "",
				Country: "",
				Longitude: "",
				Latitude: "",
				MaxHeight: "",
				MinHeight: "",
				MaxWidth: "20",
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
					validateADSFailResponse(response);
				}
			});
			stop();
		});
		
		slowTest("Calling Ads with another getValues message for Parameters + MIN WIDTH", function() {
			var jsonObj = 
			{
				Category: "BMedical",
				Gender: "",
				ZipCode: "",
				AreaCode: "",
				City: "",
				Country: "",
				Longitude: "",
				Latitude: "",
				MaxHeight: "",
				MinHeight: "",
				MaxWidth: "",
				MinWidth: "20",
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
					validateADSFailResponse(response);
				}
			});
			stop();
		});
		
				slowTest("Calling Ads with another getValues message for Parameters + TYPE", function() {
			var jsonObj = 
			{
				Category: "Medical",
				Gender: "",
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
				Type: "2",
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
					validateADSFailResponse(response);
				}
			});
			stop();
		});
				slowTest("Calling Ads with another getValues message for Parameters + TIMEOUT", function() {
			var jsonObj = 
			{
				Category: "Medical",
				Gender: "",
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
				Timeout: "3000",
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
					validateADSFailResponse(response);
				}
			});
			stop();
		});
		
				slowTest("Calling Ads with another getValues message for Parameters + AGEGROUP", function() {
			var jsonObj = 
			{
				Category: "Medical",
				Gender: "",
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
				AgeGroup: "55-100",
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
					validateADSFailResponse(response);
				}
			});
			stop();
		});
		
				slowTest("Calling Ads with another getValues message for Parameters + OVER18", function() {
			var jsonObj = 
			{
				Category: "Medical",
				Gender: "",
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
				Over18: "3",
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
					validateADSFailResponse(response);
				}
			});
			stop();
		});
		
				slowTest("Calling Ads with another getValues message for Parameters + KEYWORD", function() {
			var jsonObj = 
			{
				Category: "Medical",
				Gender: "",
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
				Keywords: "music",
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
					validateADSFailResponse(response);
				}
			});
			stop();
		});
				slowTest("Calling Ads with another getValues message for Parameters + ISSIZE REQURIED", function() {
			var jsonObj = 
			{
				Category: "Medical",
				Gender: "",
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
				IsSizeRequired: 'true',
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
					validateADSFailResponse(response);
				}
			});
			stop();
		});
				slowTest("Calling Ads with another getValues message for Parameters + PREMIUM", function() {
			var jsonObj = 
			{
				Category: "Medical",
				Gender: "",
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
				Premium: "2"
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
					validateADSFailResponse(response);
				}
			});
			stop();
		});
	
	}
