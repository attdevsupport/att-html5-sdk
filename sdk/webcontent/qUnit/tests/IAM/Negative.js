    function negativeMimTests(cfg) {
        /**
         * Tests utilizing the MIM API.
         *
         * Before retrieving the MIM headers, we must will check to see if the application is
         * authorized to do so. If not, we attempt to obtain authorization. If authorization is
         * granted, we send a request to retrieve a set of message headers from the AT&T API by 
         * making a call to 'doGetMessageHeaders'.
         */
        slowTest("MIM Bad Data Retrieving a single message header: {headerCount: \"0\", indexCursor: \"\"}", function() {
            provider.isAuthorized({
                authScope : "MIM",
                success   : function(response) {
                    start();
                    doGetMessageHeaders("0");
                },
                failure : function(response) {
                    start();
                    // alert("preparing to authorize app: " + JSON.stringify(response));
                    provider.authorizeApp({
                        authScope : "MIM",
                        success   : function(response) {
                            start();
                            doGetMessageHeaders("0");
                        },
                        failure : function(response) {
                            start();
                            // We never seem to get to the next line.
                            // alert("failed in  authorizing app: " + JSON.stringify(response));
                            ok(false, "Access denied -- the User denied authorization.");
                        },
                    });
                    stop();
                }
            });
            stop();
        });
        
        slowTest("MIM Bad Data Retrieving a single message header: {headerCount: \"-1\", indexCursor: \"\"}", function() {
            provider.isAuthorized({
                authScope : "MIM",
                success   : function(response) {
                    start();
                    doGetMessageHeaders("-1");
                },
                failure : function(response) {
                    start();
                    // alert("preparing to authorize app: " + JSON.stringify(response));
                    provider.authorizeApp({
                        authScope : "MIM",
                        success   : function(response) {
                            start();
                            doGetMessageHeaders("-1");
                        },
                        failure : function(response) {
                            start();
                            // We never seem to get to the next line.
                            // alert("failed in  authorizing app: " + JSON.stringify(response));
                            ok(false, "Access denied -- the User denied authorization.");
                        },
                    });
                    stop();
                }
            });
            stop();
        });
        
        function doGetMessageHeaders(count) {
            slowFn(function() {
                provider.getMessageHeaders({
                    headerCount: count,
                    indexCursor: "",
                    success : function(response) {
                        start();
                        ok(true, "Succeeded in Utilizing MIM  to get " + count + " message header(s).");
                        validateMIMHeadersResponse(response);
                    },
                    failure : function(response) {
                        start();
                        ok(false, "Failed in Utilizing MIM getMessageHeaders." + 
                            "\nresponse: " + JSON.stringify(response));
                        validateFailToGetMimMessageHeaders(response);
                    }
                });
            });
            stop();
        }
    }
