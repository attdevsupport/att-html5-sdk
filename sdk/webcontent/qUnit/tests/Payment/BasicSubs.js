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
            createSubscriptionUrlSuccess,
            function(response) {
                start();
                ok(false, "Fail in calling Create New Subscription." +
                    "\nresponse: " + JSON.stringify(response));
            }
        );
        stop(); // 1
    });

    function createSubscriptionUrlSuccess(response) {
        start(); // 1
        ok(true, "Succeeded in calling Create New Subscription." +
            "\nresponse: " + JSON.stringify(response));
            
        //Pop open iframe for login before attempting to get subscription status.
        globalTestFrame = document.createElement('iframe');
        window.addEventListener('message', authSuccess, false);
        globalTestFrame.src = response.url
        globalTestFrame.style.zIndex = "1000";
        globalTestFrame.height = 1200;
        globalTestFrame.width = 800;
        document.body.appendChild(globalTestFrame);
        console.log('iframe.contentWindow =', globalTestFrame.contentWindow);
        //document.body.removeChild(globalTestFrame);     

        stop(); // 2
    }

    function authSuccess(response){
        slowFn(function() {
            start(); // 2
            document.body.removeChild(globalTestFrame);
            var r1 = JSON.parse(response["data"]);
            AttApiClient.Payment.getSubscriptionStatus({

                type : 'SubscriptionAuthCode',
                id : r1["TransactionAuthCode"]},
                getSubscriptionStatusSuccess,
                function(response) {
                    start();
                    ok(false, "Fail in getting Subscription Status with Subscription Auth Code." +
                        "\nresponse: " + JSON.stringify(response));
                }
            );
            stop(); // 3
        });
    };

    function getSubscriptionStatusSuccess(response) {
        start(); // 3
        globalTestSubscriptionId = response["SubscriptionId"];
        var merchantSubId = response["MerchantSubscriptionId"];
        var merchantTransId = response["MerchantTransactionId"];
        ok(true, "Succeeded in getting Subscription Status with Subscription Auth Code." +
            "\nresponse: " + JSON.stringify(response));
        slowFn(function() {
            start(); // 4
            AttApiClient.Payment.getSubscriptionStatus({
                type : 'MerchantTransactionId',
                id : merchantTransId},
                getSubscriptionStatusWithMerchantTransIdSuccess,
                function(response) {
                    start();
                    ok(false, "Fail in in getting Subscription Status via Merchant ID." +
                        "\nresponse: " + JSON.stringify(response));
                }
            );
            stop(); // 5
        });
        stop(); // 4
    }

    function getSubscriptionStatusWithMerchantTransIdSuccess(response) {
        start(); // 5
        ok(true, "Succeeded in getting Subscription Status via Merchant ID." +
            "\nresponse: " + JSON.stringify(response));
        slowFn(function() {
            start(); // 6
            AttApiClient.Payment.getSubscriptionDetail({
                merchantSubscriptionId : response["MerchantSubscriptionId"],
                consumerId : response["ConsumerId"]},
                getSubscriptionDetailSuccess,
                function(response) {
                    start();
                    ok(false, "Fail in getting Subscription Details." +
                        "\nresponse: " + JSON.stringify(response));
                    //CancelSubscription(subId);
                    doARefund(globalTestSubscriptionId);
                }
            );
            stop(); // 7
        });
        stop(); // 6
    }

    function getSubscriptionDetailSuccess(response) {
        start(); // 7
        ok(true, "Succeeded in getting Subscription Details." +
            "\nresponse: " + JSON.stringify(response));
        slowFn(function() {
            start(); // 8
            AttApiClient.Payment.getSubscriptionStatus({
                type : 'SubscriptionId',
                id : globalTestSubscriptionId},
                function(response) {
                    start(); // 9
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
                    doARefund(globalTestSubscriptionId);
                }
            );
            stop(); // 9
        });
        stop(); // 8
    }
                
    //refund subscription/refund transaction            
    function doARefund(tId) {
        slowFn(function() {
            start(); // 10
            AttApiClient.Payment.refundTransaction({
                transactionId : tId,
                reasonId: 1,
                reasonText: "Customer was way too happy"
                },
                function(response) {
                    start(); // 11
                    ok(true, "Refund Portion of Test Succeeded!" +
                        "\nresponse: " + JSON.stringify(response));
                },
                function(response) {
                    start();
                    ok(false, "Refund Portion of Test Failed." +
                        "\nresponse: " + JSON.stringify(response) + " transactionId: " + tId);
                }                
            );
            stop(); // 11
        });
        stop(); // 10
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
