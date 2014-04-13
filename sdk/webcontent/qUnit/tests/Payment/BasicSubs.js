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
        setTimeout(code, 5000);
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
                        var r1 = JSON.parse(response["data"]);
                        AttApiClient.Payment.getSubscriptionStatus({

                            type : 'SubscriptionAuthCode',
                            id : r1["TransactionAuthCode"]},
                            function(response) {
                                var subId = response["SubscriptionId"];
                                var merchantSubId = response["MerchantSubscriptionId"];
                                var merchantTransId = response["MerchantTransactionId"];
                                start();
                                ok(true, "Succeeded in getting Subscription Status with Subscription Auth Code." +
                                    "\nresponse: " + JSON.stringify(response));

                                slowFn(function() {
                                    AttApiClient.Payment.getSubscriptionStatus({
                                        type : 'MerchantTransactionId',
                                        id : merchantTransId},
                                        function(response) {
                                            start();
                                            ok(true, "Succeeded in getting Subscription Status via Merchant ID." +
                                                "\nresponse: " + JSON.stringify(response));
                                            slowFn(function() {
                                                AttApiClient.Payment.getSubscriptionDetail({
                                                    merchantSubscriptionId : response["MerchantSubscriptionId"],
                                                    consumerId : response["ConsumerId"]},
                                                    function(response) {
                                                        start();
                                                        ok(true, "Succeeded in getting Subscription Details." +
                                                            "\nresponse: " + JSON.stringify(response));
                                                        slowFn(function() {
                                                            AttApiClient.Payment.getSubscriptionStatus({
                                                                type : 'SubscriptionId',
                                                                id : subId},
                                                                function(response) {
                                                                start();
                                                                ok(true, "Succeeded in getting Subscription Status with Subscription ID." +
                                                                    "\nresponse: " + JSON.stringify(response));
                                                                        //CancelSubscription(response["SubscriptionId"]);
                                                                        doARefund(response["SubscriptionId"]);
                                                                },
                                                                function(response){
                                                                    start();
                                                                    ok(false, "Fail in getting Subscription Status with Subscription ID." +
                                                                        "\nresponse: " + JSON.stringify(response)
                                                                    );
                                                                    //CancelSubscription(subId);
                                                                    doARefund(subId);
                                                                }
                                                            );
                                                        });
                                                        stop();
                                                    },
                                                    function(response) {
                                                        start();
                                                        ok(false, "Fail in getting Subscription Details." +
                                                            "\nresponse: " + JSON.stringify(response));
                                                        //CancelSubscription(subId);
                                                        doARefund(subId);
                                                    }
                                                );
                                                stop();
                                            });
                                            stop();
                                        },                            
                                        function(response) {
                                            start();
                                            ok(false, "Fail in in getting Subscription Status via Merchant ID." +
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
    function doARefund(tId) {
        slowFn(function() {
            AttApiClient.Payment.refundTransaction({
                transactionId : tId,
                reasonId: 1,
                reasonText: "Customer was way too happy"
                },
                function(response) {
                    start();
                    ok(true, "Refund Portion of Test Succeeded!" +
                        "\nresponse: " + JSON.stringify(response));
                },
                function(response) {
                    start();
                    ok(false, "Refund Portion of Test Failed." +
                        "\nresponse: " + JSON.stringify(response) + " transactionId: " + tId);
                }                
            );
            stop();
        });
    }
        
    //cancel subscription
    function CancelSubscription(tId) {
        slowFn(function() {
            var status;
            AttApiClient.Payment.cancelSubscription({
                transactionId : tId,
                reasonId : 1,
                reasonText : "Customer was not happy"
                },
                function(response) {
                    start();
                    ok(true, "Succeeded on Cancelling Subscription." +
                        "\nresponse: " + JSON.stringify(response));
                        status = response;
                    validateRefund(response);
                },
                function(response) {
                    start();
                    ok(false, "Fail on Cancelling Subscription." +
                        "\nresponse: " + JSON.stringify(response) + " transactionId: " + tId);
                }
            );
            //if(status!=null)
                    stop();
            
        });
    }
}
