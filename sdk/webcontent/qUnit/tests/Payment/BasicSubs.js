function basicPaymentSubsTests() {
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
        setTimeout(code, 200);
    }
    
    ts = Math.floor(Math.random()*10001),
    
    subscriptionBLN = {
        "category":1,
        "amount":"0.01",
        "desc":"D",
        "merch_trans_id":"MT"+ts,
        "merch_prod_id":"P",
        "merch_sub_id_list":"T"+ts,
        "sub_recurrences":99999,
        "redirect_uri":"http://localhost:4567/att/payment"
    };
    

    slowTest("Subscription", function() {
        AttApiClient.Payment.createSubscriptionUrl(
            subscriptionBLN,
            function(response) {
                start();
                ok(true, "Succeeded in calling Create New Subscription." +
                    "\nresponse: " + JSON.stringify(response));
                    
                var completeTests = function(response){
                    slowFn(function() {
                        document.body.removeChild(iframe);
                        var r1 = response;
                        AttApiClient.Payment.getSubscriptionStatus({
                            type : 'SubscriptionAuthCode',
                            id : r1["TransactionAuthCode"]},
                            function(response) {
                                start();
                                ok(true, "Succeeded in getting Subscription Status with Subscription Auth Code." +
                                    "\nresponse: " + JSON.stringify(response));

                                slowFn(function() {
                                    AttApiClient.Payment.getSubscriptionStatus({
                                        type : 'MerchantTransactionId',
                                        id : response["MerchantTransactionId"]},
                                        function(response) {
                                            start();
                                            ok(true, "Succeeded in getting Subscription Status via Merchant ID." +
                                                "\nresponse: " + JSON.stringify(response));
                                        },                            
                                        function(response) {
                                            start();
                                            ok(false, "Fail in in getting Subscription Status via Merchant ID." +
                                                "\nresponse: " + JSON.stringify(response));
                                        }
                                    );
                                });
                                stop();
                                
                                slowFn(function() {
                                    AttApiClient.Payment.getSubscriptionStatus({
                                        type : 'SubscriptionId',
                                        id : response["SubscriptionId"]},
                                        function(response) {
                                        start();
                                        ok(true, "Succeeded in getting Subscription Status with Subscription ID." +
                                            "\nresponse: " + JSON.stringify(response));
                                                CancelSubscription(response["SubscriptionId"]);
                                                doARefund(response["SubscriptionId"]);
                                        },
                                        function(response){
                                            start();
                                            ok(false, "Fail in getting Subscription Status with Subscription ID." +
                                                "\nresponse: " + JSON.stringify(response)
                                            );
                                            CancelSubscription(response["SubscriptionId"]);
                                            doARefund(response["SubscriptionId"]);
                                        }
                                    );
                                });
                                stop();
                                
                                slowFn(function() {
                                    AttApiClient.Payment.getSubscriptionDetails({
                                        merchantSubscriptionId : response["MerchantSubscriptionId"],
                                        consumerId : response["ConsumerId"]},
                                        function(response) {
                                            start();
                                            ok(true, "Succeeded in getting Subscription Details." +
                                                "\nresponse: " + JSON.stringify(response));
                                        },
                                        function(response) {
                                            start();
                                            ok(false, "Fail in getting Subscription Details." +
                                                "\nresponse: " + JSON.stringify(response));
                                        }
                                    );
                                });
                                stop();
                            },
                            function(response) {
                                start();
                                ok(false, "Fail in getting Subscription Status with Subscription Auth Code." +
                                    "\nresponse: " + JSON.stringify(response));
                            }
                        );
                    });
                };
                
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
                ok(false, "Fail in calling Create New Subscription." +
                    "\nresponse: " + JSON.stringify(response));
            }
        );
        stop();
    });
    
    //refund subscription/refund transaction            
    function doARefund(transactionId) {
        slowFn(function() {
            AttApiClient.Payment.refundTransaction({
                id : transactionId,
                refundOptions : {
                    "RefundReasonCode": 1,
                    "RefundReasonText": "Customer was way too happy"
                }},
                function(response) {
                    start();
                    ok(true, "Refund Portion of Test Succeeded!" +
                        "\nresponse: " + JSON.stringify(response));
                },
                function(response) {
                    start();
                    ok(false, "Refund Portion of Test Failed." +
                        "\nresponse: " + JSON.stringify(response));
                }                
            );
            stop();
        });
    }
        
    //cancel subscription
    function CancelSubscription(transactionId) {
        slowFn(function() {
            AttApiClient.Payment.cancelSubscription({
                id : transactionId,
                refundOptions : {
                    "RefundReasonCode": 1,
                    "RefundReasonText": "Customer was not happy"
                }},
                function(response) {
                    start();
                    ok(true, "Succeeded on Cancelling Subscription." +
                        "\nresponse: " + JSON.stringify(response));
                    validateRefund(response);
                },
                function(response) {
                    start();
                    ok(false, "Fail on Cancelling Subscription." +
                        "\nresponse: " + JSON.stringify(response));
                }
            );
            stop();
        });
    }
}
