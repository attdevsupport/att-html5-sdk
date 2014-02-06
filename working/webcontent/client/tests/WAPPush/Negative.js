    function negativeWAPTests(cfg) {
		//Tests sending WAP with improper address. Should fail and produce an error response.
		slowTest("Send WAP with improper address", function() {
			var messageTest = '<?xml version ="1.0"?>\n<!DOCTYPE si PUBLIC "-//WAPFORUM//DTD SI 1.0//EN" "">http://www.wapforum.org/DTD/si.dtd">\n<si>\n<indication href="http://wap.uni-wise.com/hswap/zh_1/index.jsp?MF=N&Dir=23724" si-id="1">\n     CDMA Push test!!\n</indication>\n</si>';
        	provider.wapPush({
				address : cfg.phoneNumberInvalid, 
				message : messageTest,
				subject : "test wapPush message from client-side test with improper address",
				priority : "High",
				success : function(response) {
					start();
					ok(true, "Sending WAP with improper address." +
						"\nresponse: " + JSON.stringify(response));	
					validateWapResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Sending WAP with improper address." +
						"\nresponse: " + JSON.stringify(response));	
					validateWapFailBadAddressResponse(response);
				}
        	});
        	stop();
        });
		
		//Tests sending WAP with landline address. Should fail and produce an error response.
		slowTest("Send WAP with landline address", function() {
			var messageTest = '<?xml version ="1.0"?>\n<!DOCTYPE si PUBLIC "-//WAPFORUM//DTD SI 1.0//EN" "">http://www.wapforum.org/DTD/si.dtd">\n<si>\n<indication href="http://wap.uni-wise.com/hswap/zh_1/index.jsp?MF=N&Dir=23724" si-id="1">\n     CDMA Push test!!\n</indication>\n</si>';
        	provider.wapPush({
				address : cfg.phoneNumberLandline, 
				message : messageTest,
				subject : "test wapPush message from client-side test with landline address",
				priority : "High",
				success : function(response) {
					start();
					ok(true, "Sending WAP with landline address." +
						"\nresponse: " + JSON.stringify(response));	
					validateWapResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Sending WAP with landline address." +
						"\nresponse: " + JSON.stringify(response));	
					validateWapFailResponse(response);
				}
        	});
        	stop();
        });
		
		//Tests sending WAP with null address. Should fail and produce an error response.
		slowTest("Send WAP with null address", function() {
			var messageTest = '<?xml version ="1.0"?>\n<!DOCTYPE si PUBLIC "-//WAPFORUM//DTD SI 1.0//EN" "">http://www.wapforum.org/DTD/si.dtd">\n<si>\n<indication href="http://wap.uni-wise.com/hswap/zh_1/index.jsp?MF=N&Dir=23724" si-id="1">\n     CDMA Push test!!\n</indication>\n</si>';
        	provider.wapPush({
				address : null, 
				message : messageTest,
				subject : "test wapPush message from client-side test with null address",
				priority : "High",
				success : function(response) {
					start();
					ok(true, "Sending WAP with null address." +
						"\nresponse: " + JSON.stringify(response));	
					validateWapResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Sending WAP with null address." +
						"\nresponse: " + JSON.stringify(response));	
					validateWapFailBadAddressResponse(response);
				}
        	});
        	stop();
        });
		
		//Tests sending WAP with improper message. Should fail and produce an error response.
		slowTest("Send WAP with improper message", function() {
			var messageTest = "Improper message";
        	provider.wapPush({
				address : cfg.phoneNumberPrimary, 
				message : messageTest,
				subject : "test wapPush message from client-side test with improper message",
				priority : "High",
				success : function(response) {
					start();
					ok(true, "Sending WAP with improper message." +
						"\nresponse: " + JSON.stringify(response));	
					validateWapResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Sending WAP with improper message." +
						"\nresponse: " + JSON.stringify(response));	
					validateWapFailBadMessageResponse(response);
				}
        	});
        	stop();
        });
		
		//Tests sending WAP with null message. Should fail before sending the request and get no response back.
		slowTest("Send WAP with null message", function() {
			var messageTest = null;
        	provider.wapPush({
				address : cfg.phoneNumberPrimary, 
				message : messageTest,
				subject : "test wapPush message from client-side test with null message",
				priority : "High",
				success : function(response) {
					start();
					ok(true, "Sending WAP with null message." +
						"\nresponse: " + JSON.stringify(response));	
					validateWapResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Sending WAP with null message." +
						"\nresponse: " + JSON.stringify(response));	
					validateWapFailBadMessageResponse(response);
				}
        	});
        	stop();
        });
		
		//Tests sending WAP with null subject. Should fail before sending the request and get no response back.
		slowTest("Send WAP with null subject", function() {
			var messageTest = '<?xml version ="1.0"?>\n<!DOCTYPE si PUBLIC "-//WAPFORUM//DTD SI 1.0//EN" "">http://www.wapforum.org/DTD/si.dtd">\n<si>\n<indication href="http://wap.uni-wise.com/hswap/zh_1/index.jsp?MF=N&Dir=23724" si-id="1">\n     CDMA Push test!!\n</indication>\n</si>';
        	provider.wapPush({
				address : cfg.phoneNumberPrimary, 
				message : messageTest,
				subject : null,
				priority : "High",
				success : function(response) {
					start();
					ok(true, "Sending WAP with null subject." +
						"\nresponse: " + JSON.stringify(response));	
					validateWapResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Sending WAP with null subject." +
						"\nresponse: " + JSON.stringify(response));	
					validateWapFailBadMessageResponse(response);
				}
        	});
        	stop();
        });
	}
