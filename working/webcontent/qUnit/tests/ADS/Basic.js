	function basicADSTests() {
		//Tests utilizing the advertising API
		slowTest("Calling Ads with getValues message for Parameters + Category", function() {
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
		
	}
