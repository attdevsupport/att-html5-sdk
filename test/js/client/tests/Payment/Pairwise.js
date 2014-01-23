	function pairwisePaymentTests() {
        ts = new Date().getTime(),
		charge = {
            "Amount":0.99,
            "Category":1,
            "Channel":"MOBILE_WEB",
            "Description":"better than level 1",
            "MerchantTransactionId":"MT" + ts,
            "MerchantProductId":"level2"
        };
		
		//Tests making two new transactions at the same time
        slowTest("two simultaneous new transactions", function() {
			JTF.provider.requestPayment({
				paymentOptions : charge,
				success : function(response) {
					start();
					validateNewTransactionResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Create Two New Transaction Products #1." +
						"\nresponse: " + JSON.stringify(response));	
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
					ok(false, "Fail On Create Two New Transaction Products #2." +
						"\nresponse: " + JSON.stringify(response));	
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
		
		//Tests making two new subscription at the same time
		slowTest("two simultaneous new subscriptions", function() {
			JTF.provider.requestPaidSubscription({
				paymentOptions : subscription,
				success : function(response) {
					start();
					validateNewSubscriptionResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Create Two New Subscriptions #1." +
						"\nresponse: " + JSON.stringify(response));	
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
					ok(false, "Fail On Create Two New Subscriptions #2." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop(2);	
		});
	}
