	function basicPaymentSubsTests() {
			//The subscription parameters. Used for all the subscription tests.	
	ts = Math.floor(Math.random()*10001),
		
		subscriptionBLN = {
            "Amount":"1.99",
            "Category":1,
            "Channel":"MOBILE_WEB",
            "Description":"D",
            "MerchantTransactionId":"MT"+ts,
            "MerchantProductId":"P",
            "MerchantSubscriptionIdList":"T"+ts,
            "SubscriptionRecurrences":99999,
            "SubscriptionPeriod":"MONTHLY",
            "SubscriptionPeriodAmount":"1",
            "IsPurchaseOnNoActiveSubscription":"false"
        };
        

        slowTest("Subscription", function() {
			provider.requestPaidSubscription({
				paymentOptions : subscriptionBLN,
				success : function(response) {
					start();
					ok(true, "Succeeded in calling Create New Subscription." +
						"\nresponse: " + JSON.stringify(response));
						
					slowFn(function() {
						provider.getSubscriptionStatus({
							codeType : 'SubscriptionAuthCode',
							transactionId : response["TransactionAuthCode"],
							success : function(response) {
								start();
								ok(true, "Succeeded in getting Subscription Status with Subscription Auth Code." +
									"\nresponse: " + JSON.stringify(response));

					slowFn(function() {
						provider.getSubscriptionStatus({
							codeType : 'MerchantTransactionId',
							transactionId : response["MerchantTransactionId"],
							success : function(response) {
								start();
								ok(true, "Succeeded in getting Subscription Status via Merchant ID." +
									"\nresponse: " + JSON.stringify(response));
									},
							
							failure : function(response) {
										start();
										ok(false, "Fail in in getting Subscription Status via Merchant ID." +
											"\nresponse: " + JSON.stringify(response));
								}
							});
						});
						stop();
									
					slowFn(function() {
						provider.getSubscriptionStatus({
							codeType : 'SubscriptionId',
							transactionId : response["SubscriptionId"],
							success : function(response) {
								start();
								ok(true, "Succeeded in getting Subscription Status with Subscription ID." +
									"\nresponse: " + JSON.stringify(response));
										CancelSubscription(response["SubscriptionId"]);
										doARefund(response["SubscriptionId"]);
								},
								failure : function(response) {
									start();
									ok(false, "Fail in getting Subscription Status with Subscription ID." +
										"\nresponse: " + JSON.stringify(response));
										CancelSubscription(response["SubscriptionId"]);
										doARefund(response["SubscriptionId"]);
								}
							});
						});
					stop();
					
					slowFn(function() {
						provider.getSubscriptionDetails({
							merchantSubscriptionId : response["MerchantSubscriptionId"],
							consumerId : response["ConsumerId"],
							success : function(response) {
								start();
								ok(true, "Succeeded in getting Subscription Details." +
									"\nresponse: " + JSON.stringify(response));
								},
								failure : function(response) {
									start();
									ok(false, "Fail in getting Subscription Details." +
										"\nresponse: " + JSON.stringify(response));
								}
							});
						});
					stop();
					
					
					},
							failure : function(response) {
								start();
								ok(false, "Fail in getting Subscription Status with Subscription Auth Code." +
									"\nresponse: " + JSON.stringify(response));
							}
						});
					});
					stop();


				},
				failure : function(response) {
					start();
					ok(false, "Fail in calling Create New Subscription." +
						"\nresponse: " + JSON.stringify(response));
				}
			});
			stop();
        });
		
		//refund subscription/refund transaction			
		function doARefund(transactionId) {
				slowFn(function() {
					provider.refundTransaction({
						transactionId : transactionId,
						refundOptions : {
							"RefundReasonCode": 1,
							"RefundReasonText": "Customer was way too happy"
						},
						success : function(response) {
							start();
							ok(true, "Refund Portion of Test Succeeded!" +
								"\nresponse: " + JSON.stringify(response));
						},
						failure : function(response) {
							start();
							ok(false, "Refund Portion of Test Failed." +
								"\nresponse: " + JSON.stringify(response));
						}				
					});
				});
				stop();
			}
			
	//cancel subscription
		function CancelSubscription(transactionId) {
				slowFn(function() {
					provider.cancelSubscription({
						transactionId : transactionId,
						refundOptions : {
							"RefundReasonCode": 1,
							"RefundReasonText": "Customer was not happy"
						},
						success : function(response) {
							start();
							ok(true, "Succeeded on Cancelling Subscription." +
								"\nresponse: " + JSON.stringify(response));
							validateRefund(response);
						},
						failure : function(response) {
							start();
							ok(false, "Fail on Cancelling Subscription." +
								"\nresponse: " + JSON.stringify(response));
						}
					});
				});
			stop();
		}
	}
