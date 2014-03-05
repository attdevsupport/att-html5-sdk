function negativeTransactionsTests() {
		
		
		ts = Math.floor(Math.random()*10001)+ 1,
		transactionA = {
            "Amount":"1.99",
            "Category":1,
            "Channel":"MOBILE_WEB",
            "Description":"better than level 1",
            "MerchantTransactionId":"MT"+ts,
            "MerchantProductId":"level2"
        };
        

        slowTest("Transaction Negative Test", function() {
			provider.requestPayment({
				paymentOptions : transactionA,
				success : function(response) {
					start();
					ok(true, "Succeeded in calling Create New Transaction." +
						"\nresponse: " + JSON.stringify(response));
						
					slowFn(function() {
						provider.getTransactionStatus({
							codeType : 'TransactionAuthCode',
							transactionId : response["TransactionAuthCode"],
							success : function(response) {
								start();
								ok(true, "Succeeded in getting Transaction Status with Transaction Auth Code." +
									"\nresponse: " + JSON.stringify(response));

					slowFn(function() {
						provider.getTransactionStatus({
							codeType : 'MerchantTransactionId',
							transactionId : response["abc123doremi"],
							success : function(response) {
								start();
								ok(true, "Succeeded in getting Transaction Status via Merchant ID." +
									"\nresponse: " + JSON.stringify(response));
									},
							
							failure : function(response) {
										start();
										ok(false, "Fail in in getting Transaction Status via Merchant ID." +
											"\nresponse: " + JSON.stringify(response));
								}
							});
						});
						stop();
									
					slowFn(function() {
						provider.getTransactionStatus({
							codeType : 'TransactionId',
							transactionId : response["TransactionId"],
							success : function(response) {
								start();
								ok(true, "Succeeded in getting Transaction Status with Transaction ID." +
									"\nresponse: " + JSON.stringify(response));
										//CancelSubscription(response["SubscriptionId"]);
										doARefund(response["TransactionId"]);
								},
								failure : function(response) {
									start();
									ok(false, "Fail in getting Transaction Status with Transaction ID." +
										"\nresponse: " + JSON.stringify(response));
										doARefund(response["TransactionId"]);
								}
							});
						});
					stop();
					
					},
							failure : function(response) {
								start();
								ok(false, "Fail in getting Transaction Status with Transaction Auth Code." +
									"\nresponse: " + JSON.stringify(response));
									doARefund(response["TransactionId"]);
							}
						});
					});
					stop();


				},
				failure : function(response) {
					start();
					ok(false, "Fail in calling Create New Transaction." +
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
							//"RefundReasonCode": 1,
							//"RefundReasonText": "Customer was not happy"
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
	}
