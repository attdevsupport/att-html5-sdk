	function pairwiseMoboTests() {
		//Variable containing the phone numbers the JTF uses.
		var cfg = JTF.tests.config;
		//Tests sending Mobo twice with two calls at once
        slowTest("Mobo", function() {
			JTF.provider.sendMobo({
				address : cfg.phoneNumberPrimary, 
				message : "test Mobo message from client-side test",
				subject : "test Mobo subject from client-side test",
				success : function(response) {
					start();
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo");
				}
			});
			JTF.provider.sendMobo({
				address : cfg.phoneNumberPrimary, 
				message : "test Mobo message from client-side test",
				subject : "test Mobo subject from client-side test",
				success : function(response) {
					start();
					validateMoboResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Sending Mobo");
				}
			});
			stop(2);
        });
	}