	function basicADSTests() {
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
	
		//Tests utilizing the advertising API
		slowTest("Calling Ads with getValues message for Parameters + Category", function() {
			var jsonObj = 
			{
				udid:'unique opaque anonymous user identifier',
				Category: "auto",
				Gender: "F",
				//UserAgent: "Desktop Chrome",
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
				AgeGroup: "14-25",
				Over18: "",
				Keywords: "",
				IsSizeRequired: "",
				Premium: ""
			}

			AttApiClient.Advertising.getAd(
				jsonObj,
				function(response) {
					start();
					ok(true, "Call to getAd returned successfully." +
						"\nresponse: " + JSON.stringify(response));	
					validateADSResponse(response);
				},
				function(response) {
					start();
					ok(false, "Failed in calling getAd." +
						"\nresponse: " + JSON.stringify(response));	
					validateADSFailResponse(response);
				}
			);
			stop();
		});
        /*
        slowTest("NEGATIVE - INVALID UDID", function() {
			var jsonObj = 
			{
				udid:'invalidUDID',
				Category: "auto",
				Gender: "F",
				//UserAgent: "Desktop Chrome",
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
				AgeGroup: "14-25",
				Over18: "",
				Keywords: "",
				IsSizeRequired: "",
				Premium: ""
			}

			AttApiClient.Advertising.getAd(
				jsonObj,
				function(response) {
					start();
					ok(false, "Call to getAd returned successfully." +
						"\nresponse: " + JSON.stringify(response));	
					//validateADSResponse(response);
				},
				function(response) {
					start();
					ok(true, "Failed in calling getAd." +
						"\nresponse: " + JSON.stringify(response));	
					validateADSFailResponse(response);
				}
			);
			stop();
		});
        */
		
	}
