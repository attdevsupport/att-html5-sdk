//No positive payment test cases outside basic at this time
	function positivePaymentTests() {
		ts = Math.floor(Math.random()*10001),
		chargeB = {
            "Amount":"0.99",
            "Category":1,
            "Channel":"MOBILE_WEB",
            "Description":"better than level 1",
            "MerchantTransactionId":"MT" + ts,
            "MerchantProductId":"level2"
        };
		/*
		 * Tests getting transaction status of a transaction using the Merchant Transaction ID. Note that the test first runs code to create a new 
		 * transaction, then attempts to get the status of that transaction. Also note that the test then sends the TransactionId to refund the 
		 * transaction. Since there is a merchant account limit at this time, it is necessary that all transactions and subscriptions created be 
		 * refunded after being utilized.
		 */

        slowTest("Get Transaction Status using the Merchant Transaction ID", function() {
			provider.requestPayment({
				paymentOptions : chargeB,
				success : function(response) {
					start();
					ok(true, "Succeeded in calling Create New Transaction Product for Get Transaction Status with Merchant Transaction ID." +
						"\nresponse: " + JSON.stringify(response));
					slowFn(function() {
						provider.getTransactionStatus({
							codeType : 'TransactionAuthCode',
							transactionId : response["TransactionAuthCode"],
							success : function(response) {
								start();
								ok(true, "Succeeded in getting Transaction Status with Transaction Auth Code for Merchant Transaction ID." +
									"\nresponse: " + JSON.stringify(response));
								slowFn(function() {
									provider.getTransactionStatus({
										codeType : 'MerchantTransactionId',
										transactionId : response["MerchantTransactionId"],
										success : function(response) {
											start();
											ok(true, "Succeeded in getting Transaction Status with Merchant Transaction ID." +
												"\nresponse: " + JSON.stringify(response));
											validateTransactionStatus(response);
											// alert("About to call doARefund from line 44 with: " + JSON.stringify(response["TransactionId"]));
											doARefund(response["TransactionId"]);
										},
										failure : function(response) {
											start();
											ok(false, "Fail in getting Transaction Status with Merchant Transaction ID." +
												"\nresponse: " + JSON.stringify(response));
										}
									});
								});
								stop();
							},
							failure : function(response) {
								start();
								ok(false, "Fail in getting Transaction Status with Transaction Auth Code for Merchant Transaction ID." +
									"\nresponse: " + JSON.stringify(response));
							}
						});
					});
					stop();
				},
				failure : function(response) {
					start();
					ok(false, "Fail in calling Create New Transaction Product for Get Transaction Status with Merchant Transaction ID." +
						"\nresponse: " + JSON.stringify(response));
				}
			});
			stop();
        });
		
		ts = Math.floor(Math.random()*10001),
		chargeC = {
            "Amount":"0.99",
            "Category":1,
            "Channel":"MOBILE_WEB",
            "Description":"better than level 1",
            "MerchantTransactionId":"MT" + ts,
            "MerchantProductId":"level2"
        };
		
		/*
		 * Tests getting transaction status of a transaction using the Transaction ID. Note that the test first runs code to create a new 
		 * transaction, then attempts to get the status of that transaction. Also note that the test then sends the TransactionId to refund the 
		 * transaction. Since there is a merchant account limit at this time, it is necessary that all transactions and subscriptions created be 
		 * refunded after being utilized.
		 */

        slowTest("Get Transaction Status using the Transaction ID", function() {
			provider.requestPayment({
				paymentOptions : chargeC,
				success : function(response) {
					start();
					ok(true, "Succeeded in calling Create New Transaction Product for Get Transaction Status with Transaction ID." +
						"\nresponse: " + JSON.stringify(response));
					slowFn(function() {
						provider.getTransactionStatus({
							codeType : 'TransactionAuthCode',
							transactionId : response["TransactionAuthCode"],
							success : function(response) {
								start();
								ok(true, "Succeeded in getting Transaction Status with Transaction Auth Code for Transaction ID." +
									"\nresponse: " + JSON.stringify(response));
								slowFn(function() {
									provider.getTransactionStatus({
										codeType : 'TransactionId',
										transactionId : response["TransactionId"],
										success : function(response) {
											start();
											ok(true, "Succeeded in getting Transaction Status with Transaction ID." +
												"\nresponse: " + JSON.stringify(response));
											validateTransactionStatus(response);
											// alert("About to call doARefund from line 113 with: " + JSON.stringify(response["TransactionId"]));
											
											doARefund(response["TransactionId"]);
										},
										failure : function(response) {
											start();
											ok(false, "Fail in getting Transaction Status with Transaction ID." +
												"\nresponse: " + JSON.stringify(response));
										}
									});
								});
								stop();
							},
							failure : function(response) {
								start();
								ok(false, "Fail in getting Transaction Status with Transaction Auth Code for Transaction ID." +
									"\nresponse: " + JSON.stringify(response));
							}
						});
					});
					stop();
				},
				failure : function(response) {
					start();
					ok(false, "Fail in calling Create New Transaction Product for Get Transaction Status with Transaction ID." +
						"\nresponse: " + JSON.stringify(response));
				}
			});
			stop();
        });
		
		//Function to refund transactions created in tests that are not refunded for testing purposes.
		function doARefund(transactionId) {
			// alert("Arrived in the local doARefund.");
			slowFn(function() {
				provider.refundTransaction({
					transactionId : transactionId,
					refundOptions : {
						"RefundReasonCode": 1,
						"RefundReasonText": "Customer was not happy"
					},
					success : function(response) {
						start();
						ok(true, "Refund Portion of Test Succeeded!" +
							"\nresponse: " + JSON.stringify(response));
						// validateRefund(response);
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
