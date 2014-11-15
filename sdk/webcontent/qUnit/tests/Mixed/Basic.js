	/*
	 * Runs every possible basic API call in mixed pairs in every combination possible. Currently (3/16/12) non-functioning due to the way API calls 
	 * are pushed through, will be useful in the future when this issue is fixed.
	 */

	function mixedTests() {
		//Variable containing the phone numbers the JTF uses.
		var cfg = JTF.tests.config;
		//Tests sending a SMS and MMS at the same time
		slowTest("two simultaneous SMS/MMS calls", function() {
            JTF.provider.sendSms({
				address : cfg.phoneNumberPrimary,
				message : "test SMS message from client-side test paired with MMS",
				success : function(response) {
					start();
					validateSmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on SMS paired with MMS");
				}
			});
			JTF.provider.sendMms({
				address  : cfg.phoneNumberPrimary,
				fileId   : "hello.jpg", 
				message  : "test MMS message from client-side test pair with SMS", 
				priority : "High", 
				success  : function(response) {
					start();
					validateMmsResponse(response);
				},
				failure  : function(response) {
					start();
					ok(false, "Fail on MMS paired with SMS");
				}
			});
        	stop(2);
        });
		
		//Tests sending a MMS and DC at the same time
		slowTest("two simultaneous MMS/DC calls", function() {
			JTF.provider.sendMms({
				address  : cfg.phoneNumberPrimary,
				fileId   : "bottle.jpg", 
				message  : "test MMS message from client-side test paired with DC", 
				priority : "High", 
				success : function(response) {
					start();
					validateMmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on MMS paired with DC");
				}
			});
        	JTF.provider.deviceInfo({
				address : cfg.phoneNumberPrimary,
        		success : function(response) {
					start();
					validateDcResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on DC paired with MMS");
				}
        	});
        	stop(2);
        });
	}