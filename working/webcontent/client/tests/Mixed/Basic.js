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
		
		//Tests sending a SMS and WAP at the same time
		slowTest("two simultaneous SMS/WAP calls", function() {
            JTF.provider.sendSms({
				address : cfg.phoneNumberPrimary,
				message : "test SMS message from client-side test paired with WAP", 
				success : function(response) {
					start();
					validateSmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on SMS paired with WAP");
				}
			});
			JTF.provider.wapPush({
				address : cfg.phoneNumberPrimary,
				message : "http://www.google.com", 
				subject : "test wapPush message from client-side test with SMS",
        		success : function(response) {
					start();
					validateWapResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on WAP paired with SMS");
				}
        	});
        	stop(2);
        });
		
		//Tests sending a SMS and TL at the same time
		slowTest("two simultaneous SMS/TL calls", function() {
          JTF.provider.sendSms({
			  address : cfg.phoneNumberPrimary,
			  message : "test SMS message from client-side test paired with TL", 
              success : function(response) {
					start();
					validateSmsResponse(response);
              },
              failure : function(response) {
					start();
					ok(false, "Fail on SMS paired with TL");
              }
         });
        	JTF.provider.deviceLocation({
				address : cfg.phoneNumberPrimary,
        		success : function(response) {
					start();
					validateTlResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on TL paired with SMS");
				}
        	});
        	stop(2);
        });
		
		//Tests sending a SMS and DC at the same time
		slowTest("two simultaneous SMS/DC calls", function() {
			JTF.provider.sendSms({
				address : cfg.phoneNumberPrimary,
				message : "test SMS message from client-side test paired with DC", 
				success: function(response) {
					start();
					validateSmsResponse(response);
				},
				failure: function(response) {
					start();
					ok(false, "Fail on SMS paired with DC");
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
					ok(false, "Fail on DC paired with SMS");
				}
        	});
        	stop(2);
        });
		
        ts = new Date().getTime(),
		charge = {
            "Amount":0.99,
            "Category":1,
            "Channel":"MOBILE_WEB",
            "Description":"better than level 1",
            "MerchantTransactionId":"MT" + ts,
            "MerchantProductId":"level2"
        };
		
		//Tests sending a SMS and Transaction at the same time
		slowTest("two simultaneous SMS/TRANS calls", function() {
			JTF.provider.sendSms({
				address : cfg.phoneNumberPrimary,
				message : "test SMS message from client-side test paired with DC", 
				success: function(response) {
					start();
					validateSmsResponse(response);
				},
				failure: function(response) {
					start();
					ok(false, "Fail on SMS paired with Create New Transaction Product");
				}
			});
			JTF.provider.requestPayment({
				paymentOptions : charge,
				success : function(response) {
					start();
					validateNewTransactionResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Create New Transaction Product paired with SMS");
				}
			});
        	stop(2);
        });
		
        ts = new Date().getTime(),
		subscription = {
            "Amount":"1.99",
            "Category":1,
            "Channel":"MOBILE_WEB",
            "Description":"D",
            "MerchantTransactionId":"MT" + ts,
            "MerchantProductId":"P",
            "MerchantSubscriptionIdList":"T" + ts,
            "SubscriptionRecurringNumber":99999,
            "SubscriptionRecurringPeriod":"MONTHLY",
            "SubscriptionRecurringPeriodAmount":"1",
            "IsPurchaseOnNoActiveSubscription":"false"
        };
		
		//Tests sending a SMS and Subscription at the same time
		slowTest("two simultaneous SMS/Sub calls", function() {
			JTF.provider.sendSms({
				address : cfg.phoneNumberPrimary, 
				message : "test SMS message from client-side test paired with DC", 
				success: function(response) {
					start();
					validateSmsResponse(response);
				},
				failure: function(response) {
					start();
					ok(false, "Fail on SMS paired with Create New Subscription");
				}
			});
			JTF.provider.requestPaidSubscription({
				paymentOptions : subscription,
				success : function(response) {
					start();
					validateNewSubscriptionResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Create New Subscription paired with SMS");
				}
			});
        	stop(2);
        });
		
		//Tests sending a MMS and WAP at the same time
		slowTest("two simultaneous MMS/WAP calls", function() {
			JTF.provider.sendMms({
				address  : cfg.phoneNumberPrimary,
				fileId   : "hello.jpg", 
				message  : "test MMS message from client-side test paired with WAP", 
				priority : "High", 
				success : function(response) {
					start();
					validateMmsResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on MMS paired with WAP");
				}
			});
        	JTF.provider.wapPush({
				address : cfg.phoneNumberPrimary,
				message : "http://www.google.com", 
				subject : "test wapPush message from client-side test paired with MMS", 
        		success : function(response) {
					start();
					validateWapResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on WAP paired with MMS");
				}
        	});
        	stop(2);
        });
		
		//Tests sending a MMS and TL at the same time
		slowTest("two simultaneous MMS/TL calls", function() {
			JTF.provider.sendMms({
				address  : cfg.phoneNumberPrimary,
				fileId   : "bottle.jpg", 
				message  : "test MMS message from client-side test paired with TL", 
				priority : "High", 
				success  : function(response) {
					start();
					validateMmsResponse(response);
				},
				failure  : function(response) {
					start();
					ok(false, "Fail on MMS paired with TL");
				}
			});
        	JTF.provider.deviceLocation({
				address : cfg.phoneNumberPrimary,
        		success : function(response) {
					start();
					validateTlResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on TL paired with MMS");
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
		
		//Tests sending a MMS and New Transaction at the same time	
		slowTest("two simultaneous MMS/Trans calls", function() {
			JTF.provider.sendMms({
				address  : cfg.phoneNumberPrimary,
				fileId   : "bottle.jpg", 
				message  : "test MMS message from client-side test paired with Create New Transaction Product", 
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
			JTF.provider.requestPayment({
				paymentOptions : charge,
				success : function(response) {
					start();
					validateNewTransactionResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Create New Transaction Product paired with MMS");
				}
			});
        	stop(2);
        });
		
		//Tests sending a MMS and New Subscription at the same time
		slowTest("two simultaneous MMS/Sub calls", function() {
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
					ok(false, "Fail on MMS paired with Create New Subscription");
				}
			});
			JTF.provider.requestPaidSubscription({
				paymentOptions : subscription,
				success : function(response) {
					start();
					validateNewSubscriptionResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Create New Subscription paired with MMS");
				}
			});
        	stop(2);
        });
		
		//Tests sending a WAP and TL at the same time
		slowTest("two simultaneous WAP/TL calls", function() {
        	JTF.provider.wapPush({
				address : cfg.phoneNumberPrimary,
				message : "http://www.google.com", 
				subject : "test wapPush message from client-side test paired with TL", 
        		success : function(response) {
					start();
					validateWapResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on WAP paired with TL");
				}
        	});
        	JTF.provider.deviceLocation({
				address : cfg.phoneNumberPrimary,
        		success : function(response) {
					start();
					validateTlResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on TL paired with WAP");
				}
        	});
        	stop(2);
        });

		//Tests sending a WAP and DC at the same time
		slowTest("two simultaneous WAP/DC calls", function() {
        	JTF.provider.wapPush({
				address : cfg.phoneNumberPrimary,
				message : "http://www.google.com", 
				subject : "test wapPush message from client-side test paired with DC", 
        		success : function(response) {
					start();
					validateWapResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on WAP paired with DC");
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
					ok(false, "Fail on TL paired with WAP");
				}
        	});
        	stop(2);
        });
		
		//Tests sending a WAP and New Transaction at the same time
		slowTest("two simultaneous WAP/Trans calls", function() {
        	JTF.provider.wapPush({
				address : cfg.phoneNumberPrimary,
				message : "http://www.google.com", 
				subject : "test wapPush message from client-side test paired with DC", 
        		success : function(response) {
					start();
					validateWapResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on WAP paired with Create New Transaction Product");
				}
        	});
			JTF.provider.requestPayment({
				paymentOptions : charge,
				success : function(response) {
					start();
					validateNewTransactionResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Create New Transaction Product paired with WAP");
				}
			});
        	stop(2);
        });
		
		//Tests sending a WAP and New Subscription at the same time
		slowTest("two simultaneous WAP/Subs calls", function() {
        	JTF.provider.wapPush({
				address : cfg.phoneNumberPrimary,
				message : "http://www.google.com", 
				subject : "test wapPush message from client-side test paired with DC", 
        		success : function(response) {
					start();
					validateWapResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on WAP paired with Create New Subscription");
				}
        	});
			JTF.provider.requestPaidSubscription({
				paymentOptions : subscription,
				success : function(response) {
					start();
					validateNewSubscriptionResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Create New Subscription paired with WAP");
				}
			});
        	stop(2);
        });
		
		//Tests sending a TL and DC at the same time
		slowTest("two simultaneous TL/DC calls", function() {
        	JTF.provider.deviceLocation({
				address : cfg.phoneNumberPrimary,
        		success : function(response) {
					start();
					validateTlResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on TL paired with DC");
				}
        	});
        	JTF.provider.deviceInfo({
				address : cfg.phoneNumberPrimary,
        		success: function(response) {
					start();
					validateDcResponse(response);
				},
				failure: function(response) {
					start();
					ok(false, "Fail on DC paired with TL");
				}
        	});
        	stop(2);
        });
		
		//Tests sending a TL and New Transaction at the same time
		slowTest("two simultaneous TL/Trans calls", function() {
        	JTF.provider.deviceLocation({
				address : cfg.phoneNumberPrimary,
        		success : function(response) {
					start();
					validateTlResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on TL paired with Create New Transaction Product");
				}
        	});
			JTF.provider.requestPayment({
				paymentOptions : charge,
				success : function(response) {
					start();
					validateNewTransactionResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Create New Transaction Product paired with TL");
				}
			});
        	stop(2);
        });
		
		//Tests sending a TL and New Subscription at the same time
		slowTest("two simultaneous TL/Subs calls", function() {
        	JTF.provider.deviceLocation({
				address : cfg.phoneNumberPrimary,
        		success : function(response) {
					start();
					validateTlResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail on TL paired with Create New Subscription");
				}
        	});
			JTF.provider.requestPaidSubscription({
				paymentOptions : subscription,
				success : function(response) {
					start();
					validateNewSubscriptionResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Create New Subscription paired with TL");
				}
			});
        	stop(2);
        });
		
		//Tests sending a DC and New Transaction at the same time
		slowTest("two simultaneous DC/Trans calls", function() {
        	JTF.provider.deviceInfo({
				address : cfg.phoneNumberPrimary,
        		success: function(response) {
					start();
					validateDcResponse(response);
				},
				failure: function(response) {
					start();
					ok(false, "Fail on DC paired with Create New Transaction Productb");
				}
        	});
			JTF.provider.requestPayment({
				paymentOptions : charge,
				success : function(response) {
					start();
					validateNewTransactionResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Create New Transaction Product paired with DC");
				}
			});
        	stop(2);
        });
		
		//Tests sending a DC and New Subscription at the same time
		slowTest("two simultaneous DC/Subs calls", function() {
        	JTF.provider.deviceInfo({
				address : cfg.phoneNumberPrimary,
        		success: function(response) {
					start();
					validateDcResponse(response);
				},
				failure: function(response) {
					start();
					ok(false, "Fail on DC paired with Create New Subscription");
				}
        	});
			JTF.provider.requestPaidSubscription({
				paymentOptions : subscription,
				success : function(response) {
					start();
					validateNewSubscriptionResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Create New Subscription paired with DC");
				}
			});
        	stop(2);
        });
		
		//Tests sending a New Transaction and New Subscription at the same time
		slowTest("two simultaneous Trans/Subs calls", function() {
			JTF.provider.requestPayment({
				paymentOptions : charge,
				success : function(response) {
					start();
					validateNewTransactionResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Create New Transaction Product paired with Create New Subscription");
				}
			});
			JTF.provider.requestPaidSubscription({
				paymentOptions : subscription,
				success : function(response) {
					start();
					validateNewSubscriptionResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Create New Subscription paired with Create New Transaction Product");
				}
			});
        	stop(2);
        });
	}