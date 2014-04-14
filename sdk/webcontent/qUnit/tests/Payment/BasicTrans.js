	function basicPaymentTransTests() {
        //The subscription parameters. Used for all the subscription tests.    
        function slowTest(name, code) {
            test(name, function() {
                slowFn(function() {
                    start();
                    code();
                });
                stop();
            })
        }
        
        //Function inside the slowTest function that allows manipulation of the throttling time.
        function slowFn(code) {
            setTimeout(code, 5000);
        }
ts = Math.floor(Math.random()*10001),
		transactionBLN = {
            "amount":"0.01",
            "category":1,
            //"Channel":"MOBILE_WEB",
            "desc":"better than level 1",
            "merch_trans_id":"MT"+ts,
            "merch_prod_id":"level2",
            "redirect_uri":"http://localhost:4567/att/payment"
        };
        

        slowTest("Transaction", function() {
			AttApiClient.Payment.createTransactionUrl(
				transactionBLN,
				function(response) {
					start();
					ok(true, "Succeeded in calling Create New Transaction." +
						"\nresponse: " + JSON.stringify(response));
					var completeTests = function(response){
                        slowFn(function() {
                            document.body.removeChild(iframe);
                            var r1 = JSON.parse(response["data"]);
                            AttApiClient.Payment.getTransactionStatus({
                                type : 'TransactionAuthCode',
                                id : r1["TransactionAuthCode"]},
                                function(response) {
                                    start();
                                    ok(true, "Succeeded in getting Transaction Status with Transaction Auth Code." +
                                        "\nresponse: " + JSON.stringify(response));

                        slowFn(function() {
                            AttApiClient.Payment.getTransactionStatus({
                                type : 'MerchantTransactionId',
                                id : response["MerchantTransactionId"]},
                                function(response) {
                                    start();
                                    ok(true, "Succeeded in getting Transaction Status via Merchant ID." +
                                        "\nresponse: " + JSON.stringify(response));
                                        },
                                
                                function(response) {
                                            start();
                                            ok(false, "Fail in in getting Transaction Status via Merchant ID." +
                                                "\nresponse: " + JSON.stringify(response));
                                    }
                                );
                            });
                            stop();
                                        
                        slowFn(function() {
                            AttApiClient.Payment.getTransactionStatus({
                                type : 'TransactionId',
                                id : response["TransactionId"]},
                                function(response) {
                                    start();
                                    ok(true, "Succeeded in getting Transaction Status with Transaction ID." +
                                        "\nresponse: " + JSON.stringify(response));
                                            //CancelSubscription(response["SubscriptionId"]);
                                            doARefund(response["TransactionId"]);
                                    },
                                    function(response) {
                                        start();
                                        ok(false, "Fail in getting Transaction Status with Transaction ID." +
                                            "\nresponse: " + JSON.stringify(response));
                                            doARefund(response["TransactionId"]);
                                    }
                                );
                            });
                        stop();
                        
                        },
                                function(response) {
                                    start();
                                    ok(false, "Fail in getting Transaction Status with Transaction Auth Code." +
                                        "\nresponse: " + JSON.stringify(response));
                                        doARefund(response["TransactionId"]);
                                }
                            );
                        });
                    }
                    
                    //Pop open iframe for login before attempting to get subscription status.
                    var iframe = document.createElement('iframe');
                    window.addEventListener('message', completeTests, false);
                    iframe.src = response.url
                    iframe.style.zIndex = "1000";
                    iframe.height = 1200;
                    iframe.width = 800;
                    document.body.appendChild(iframe);
                    console.log('iframe.contentWindow =', iframe.contentWindow);
                    //document.body.removeChild(iframe);  
					stop();


				},
				function(response) {
					start();
					ok(false, "Fail in calling Create New Transaction." +
						"\nresponse: " + JSON.stringify(response));
				}
			);
			stop();
        });
		
		//refund subscription/refund transaction			
		function doARefund(transactionId) {
				slowFn(function() {
					AttApiClient.Payment.refundTransaction({
						transactionId : transactionId,
							reasonId: 1,
							reasonText : "Customer was not happy"},
						function(response) {
							start();
							ok(true, "Refund Portion of Test Succeeded!" +
								"\nresponse: " + JSON.stringify(response));
								
					slowFn(function() {
						AttApiClient.Payment.getTransactionStatus({
							type : 'TransactionId',
							id : response["TransactionId"]},
							function(response) {
								start();
								ok(true, "Succeeded in getting Transaction Status for REFUNDED." +
									"\nresponse: " + JSON.stringify(response));
										//CancelSubscription(response["SubscriptionId"]);
										//doARefund(response["TransactionId"]);
								},
								function(response) {
									start();
									ok(false, "Fail in getting Transaction Status for REFUNDED" +
										"\nresponse: " + JSON.stringify(response));
										//doARefund(response["TransactionId"]);
								}
							);
						});
					stop();
					
						},
						function(response) {
							start();
							ok(false, "Refund Portion of Test Failed." +
								"\nresponse: " + JSON.stringify(response));
						}				
					);
				});
				stop();
			}
			
			
		
		
		
		/*
		//The transaction parameters. Used for all the transaction tests.
		ts = Math.floor(Math.random()*10001),
		chargeBLN = {
            "Amount":"0.99",
            "Category":1,
            "Channel":"MOBILE_WEB",
            "Description":"better than level 1",
            "MerchantTransactionId":"MT"+ts,
            "MerchantProductId":"level2"
        };
		

        slowTest("Create New Transaction Product Basic", function() {
			AttApiClient.Payment.requestPayment({
				paymentOptions : chargeBLN,
				function(response) {
					start();
					ok(true, "Succeeded in calling Create New Transaction Product." +
						"\nresponse: " + JSON.stringify(response));
					validateNewTransactionResponse(response);
					slowFn(function() {
						AttApiClient.Payment.getTransactionStatus({
							codeType : 'TransactionAuthCode',
							transactionId : response["TransactionAuthCode"],
							function(response) {
								start();
								ok(true, "Succeeded in retrieving the transaction status with the TransactionAuthCode." +
									"\nresponse: " + JSON.stringify(response));
								doARefund(response["TransactionId"]);
							},
							function(response) {
								start();
								ok(false, "Failed to retrieve the transaction status." +
									"\nresponse: " + JSON.stringify(response));
							}
						});
					});
					stop();
				},
				function(response) {
					start();
					ok(false, "Fail in calling Create New Transaction Product." +
						"\nresponse: " + JSON.stringify(response));
				}
			});
			stop();
        });
		
		ts = Math.floor(Math.random()*10001),
		chargeA = {
            "Amount":"0.99",
            "Category":1,
            "Channel":"MOBILE_WEB",
            "Description":"better than level 1",
            "MerchantTransactionId":"MT" + ts,
            "MerchantProductId":"level2"
        };
		

        slowTest("Get Transaction Status using the TransactionAuthCode", function() {
			AttApiClient.Payment.requestPayment({
				paymentOptions : chargeA,
				function(response) {
					start();
					ok(true, "Succeeded in calling Create New Transaction Product for Get Transaction Status." +
						"\nresponse: " + JSON.stringify(response));
					slowFn(function() {
						AttApiClient.Payment.getTransactionStatus({
							codeType : 'TransactionAuthCode',
							transactionId : response["TransactionAuthCode"],
							function(response) {
								start();
								ok(true, "Succeeded on getting Transaction Status with Transaction Auth Code." +
									"\nresponse: " + JSON.stringify(response));
								validateTransactionStatus(response);
								doARefund(response["TransactionId"]);
							},
							function(response) {
								start();
								ok(false, "Fail on getting Transaction Status with Transaction Auth Code." +
									"\nresponse: " + JSON.stringify(response));
							}
						});
					});
					stop();
				},
				function(response) {
					start();
					ok(false, "Fail in calling Create New Transaction Product for Get Transaction Status." +
						"\nresponse: " + JSON.stringify(response));
				}
			});
			stop();
        });
		ts = Math.floor(Math.random()*10001),
		chargeD = {
            "Amount":"0.99",
            "Category":1,
            "Channel":"MOBILE_WEB",
            "Description":"better than level 1",
            "MerchantTransactionId":"MT" + ts,
            "MerchantProductId":"level2"
        };
		

        slowTest("Refund Transaction", function() {
			AttApiClient.Payment.requestPayment({
				paymentOptions : chargeD,
				function(response) {
					start();
					ok(true, "Succeeded in calling Create New Transaction Product for Refund Transaction." +
						"\nresponse: " + JSON.stringify(response));
					slowFn(function() {
						AttApiClient.Payment.getTransactionStatus({
							codeType : 'TransactionAuthCode',
							transactionId : response["TransactionAuthCode"],
							function(response) {
								start();
								ok(true, "Succeeded on getting Transaction Status with Transaction Auth Code for Refund Transaction." +
									"\nresponse: " + JSON.stringify(response));
								slowFn(function() {
									AttApiClient.Payment.refundTransaction({
										transactionId : response["TransactionId"],
										refundOptions : {
											"RefundReasonCode": 1,
											"RefundReasonText": "Customer was not happy"
										},
										function(response) {
											start();
											ok(true, "Succeeded on refunding the Transaction." +
												"\nresponse: " + JSON.stringify(response));
											validateRefund(response);
										},
										function(response) {
											start();
											ok(false, "Fail in refunding the Transaction." +
												"\nresponse: " + JSON.stringify(response));
										}
									});
								});
								stop();
							},
							function(response) {
								start();
								ok(false, "Fail on getting Transaction Status with Transaction Auth Code for Refund Transaction." +
									"\nresponse: " + JSON.stringify(response));
							}
						});
					});
					stop();
				},
				function(response) {
					start();
					ok(false, "Fail in calling Create New Transaction Product for Refund Transaction." +
						"\nresponse: " + JSON.stringify(response));
				}
			});
			stop();
        });
		*/
		//Function to refund transactions created in tests that are not refunded for testing purposes.

	}
