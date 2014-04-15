	function basicPaymentNotaryTests() {
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
        
        slowTest("Notary - Sign Payload", function(){
            var tx = new Date().getTime();
            var payload = {
                Amount:0.99,
                Category:1,
                Channel :"MOBILE_WEB",
                Description :"Word game 1",
                MerchantTransactionId :"User" + tx + "Transaction",
                MerchantProductId :"wordGame1"
            };
            AttApiClient.Notary.signPayload(
                payload,
                function success(response){
                    start();
                    ok(true, "Payload Signed: \n" + JSON.stringify(response));                    
                },
                function failure(error){
                    start();
                    ok(false, "Payload signing failed: \n" + JSON.stringify(response));
                }
            );
            stop();
        });
    }