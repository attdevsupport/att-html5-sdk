    function positiveDCTests(cfg) {
		//Tests getting DC with dashed address. Address is passed through normalizePhoneNumber to parse out ill characters.
		slowTest("Get DC with dashed address", function() {
			tel = Att.Provider.normalizeAddress(cfg.phoneNumberDashes);
			provider.getDeviceInfo({
				address : tel,
				success : function(response) {
					start();
					validateDcResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on getting DC with dashed address");
				}
			});
			stop();
        });
		
		//Tests getting DC with leading 1 in address.
		slowTest("Get DC with leading 1 in address", function() {
			provider.getDeviceInfo({
				address : cfg.phoneNumberLeadOne,
				success : function(response) {
					start();
					validateDcResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on getting DC with leading 1 in address");
				}
			});
			stop();
        });		
		
		//Tests getting DC with parenthesis around area code. Address is passed through normalizePhoneNumber to parse out ill characters.
		slowTest("Get DC with parenthesis around area code", function() {
			tel = Att.Provider.normalizeAddress(cfg.phoneNumberParenthesis);
			provider.getDeviceInfo({
				address : tel,
				success : function(response) {
					start();
					validateDcResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on getting DC with parenthesis around area code");
				}
			});
			stop();
        });
	}
		