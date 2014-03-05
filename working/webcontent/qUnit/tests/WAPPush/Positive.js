    function positiveWAPTests(cfg) { 
		//Tests sending WAP with dashed address. Address is passed through normalizePhoneNumber to parse out ill characters.	
		slowTest("Send WAP with dashed address", function() {
			var messageTest = '<?xml version ="1.0"?>\n<!DOCTYPE si PUBLIC "-//WAPFORUM//DTD SI 1.0//EN" "">http://www.wapforum.org/DTD/si.dtd">\n<si>\n<indication href="http://wap.uni-wise.com/hswap/zh_1/index.jsp?MF=N&Dir=23724" si-id="1">\n     CDMA Push test!!\n</indication>\n</si>';
			tel = Att.Provider.normalizeAddress(cfg.phoneNumberDashes);
        	provider.wapPush({
				address : tel, 
				message : messageTest,
				subject : "test wapPush message from client-side test with dashed address",
				priority : "High",
        		success: function(response) {
					start();
					validateWapResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on sending WAP with dashed address." +
						"\nresponse: " + JSON.stringify(response));	
				}
        	});
        	stop();
        });
		
		//Tests sending WAP with leading 1 in address.
		slowTest("Send WAP with leading 1 in address", function() {
			var messageTest = '<?xml version ="1.0"?>\n<!DOCTYPE si PUBLIC "-//WAPFORUM//DTD SI 1.0//EN" "">http://www.wapforum.org/DTD/si.dtd">\n<si>\n<indication href="http://wap.uni-wise.com/hswap/zh_1/index.jsp?MF=N&Dir=23724" si-id="1">\n     CDMA Push test!!\n</indication>\n</si>';
        	provider.wapPush({
				address : cfg.phoneNumberLeadOne, 
				message : messageTest,
				subject : "test wapPush message from client-side test with leading 1 in address",
				priority : "High",
        		success: function(response) {
					start();
					validateWapResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on sending WAP with leading 1 in address." +
						"\nresponse: " + JSON.stringify(response));	
				}
        	});
        	stop();
        });
		
		//Tests sending WAP with parenthesis around area code. Address is passed through normalizePhoneNumber to parse out ill characters.
		slowTest("Send WAP with parenthesis around area code", function() {
			var messageTest = '<?xml version ="1.0"?>\n<!DOCTYPE si PUBLIC "-//WAPFORUM//DTD SI 1.0//EN" "">http://www.wapforum.org/DTD/si.dtd">\n<si>\n<indication href="http://wap.uni-wise.com/hswap/zh_1/index.jsp?MF=N&Dir=23724" si-id="1">\n     CDMA Push test!!\n</indication>\n</si>';
			tel = Att.Provider.normalizeAddress(cfg.phoneNumberParenthesis);
        	provider.wapPush({
				address : tel, 
				message : messageTest,
				subject : "test wapPush message from client-side test with parenthesis around area code",
				priority : "High",
        		success: function(response) {
					start();
					validateWapResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on sending WAP with parenthesis around area code." +
						"\nresponse: " + JSON.stringify(response));	
				}
        	});
        	stop();
        });
		
		//Tests sending wapPush to multiple addresses in the same call
		slowTest("wapPush to multiple addresses in one call", function() {
			var messageTest = '<?xml version ="1.0"?>\n<!DOCTYPE si PUBLIC "-//WAPFORUM//DTD SI 1.0//EN" "">http://www.wapforum.org/DTD/si.dtd">\n<si>\n<indication href="http://wap.uni-wise.com/hswap/zh_1/index.jsp?MF=N&Dir=23724" si-id="1">\n     CDMA Push test!!\n</indication>\n</si>';
			provider.wapPush({
				address  : cfg.phoneNumberPrimary+","+cfg.phoneNumberSecondary, 
				message  : messageTest, 
				subject  : "test wapPush message from client-side test", 
				priority : "High",
				success  : function(response) {
					start();
					validateWapResponse(response);
				},
				failure  : function(response) {
					start();
					ok(false, "Fail On Sending Single wapPush with multiple addresses in one call." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
		//Tests sending wapPush to multiple addresses in the same call, first good second bad
		slowTest("wapPush to multiple addresses in one call, first good second bad", function() {
		var messageTest = '<?xml version ="1.0"?>\n<!DOCTYPE si PUBLIC "-//WAPFORUM//DTD SI 1.0//EN" "">http://www.wapforum.org/DTD/si.dtd">\n<si>\n<indication href="http://wap.uni-wise.com/hswap/zh_1/index.jsp?MF=N&Dir=23724" si-id="1">\n     CDMA Push test!!\n</indication>\n</si>';
			provider.wapPush({
				address  : cfg.phoneNumberPrimary+","+cfg.phoneNumberLandline,  
				message  : messageTest, 
				subject  : "test wapPush message from client-side test to multiple addresses in one call first good second bad",
				priority : "High",
				success  : function(response) {
					start();
					validateWapResponse(response);
				},
				failure  : function(response) {
					start();
					ok(false, "Fail On Sending Single wapPush with multiple addresses in one call, first good second bad." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
		//Tests sending wapPush to multiple addresses in the same call, first bad second good
		slowTest("wapPush to multiple addresses in one call, first bad second good", function() {
		var messageTest = '<?xml version ="1.0"?>\n<!DOCTYPE si PUBLIC "-//WAPFORUM//DTD SI 1.0//EN" "">http://www.wapforum.org/DTD/si.dtd">\n<si>\n<indication href="http://wap.uni-wise.com/hswap/zh_1/index.jsp?MF=N&Dir=23724" si-id="1">\n     CDMA Push test!!\n</indication>\n</si>';
			provider.wapPush({
				address  : cfg.phoneNumberLandline+","+cfg.phoneNumberPrimary, 
				message  : messageTest, 
				subject  : "test wapPush message from client-side test to multiple addresses in one call first bad second good", 
				priority : "High",
				success  : function(response) {
					start();
					validateWapResponse(response);
				},
				failure  : function(response) {
					start();
					ok(false, "Fail On Sending Single wapPush with multiple addresses in one call, first bad second good." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
		slowTest("wapPush with priority changed to low ", function() {
			var messageTest = '<?xml version ="1.0"?>\n<!DOCTYPE si PUBLIC "-//WAPFORUM//DTD SI 1.0//EN" "">http://www.wapforum.org/DTD/si.dtd">\n<si>\n<indication href="http://wap.uni-wise.com/hswap/zh_1/index.jsp?MF=N&Dir=23724" si-id="1">\n     CDMA Push test!!\n</indication>\n</si>';
        	provider.wapPush({
				address : cfg.phoneNumberPrimary,
				message : messageTest,
				subject : "test wapPush message from client-side test",
				priority : "Low",
        		success: function(response) {
					start();
					validateWapResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on sending single WAP." +
						"\nresponse: " + JSON.stringify(response));	
				}
        	});
        	stop();
        });
	}
