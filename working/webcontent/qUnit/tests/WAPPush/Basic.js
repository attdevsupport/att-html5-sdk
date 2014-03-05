	function basicWAPTests(cfg) {	
		//Tests sending WAP
		slowTest("wapPush", function() {
			var messageTest = '<?xml version ="1.0"?>\n<!DOCTYPE si PUBLIC "-//WAPFORUM//DTD SI 1.0//EN" "">http://www.wapforum.org/DTD/si.dtd">\n<si>\n<indication href="http://wap.uni-wise.com/hswap/zh_1/index.jsp?MF=N&Dir=23724" si-id="1">\n     CDMA Push test!!\n</indication>\n</si>';
        	provider.wapPush({
				address : cfg.phoneNumberPrimary,
				message : messageTest,
				subject : "test wapPush message from client-side test",
				priority : "High",
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
