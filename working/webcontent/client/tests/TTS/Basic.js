	function basicSpeechTests() {
 //Function that wraps all of the tests. Slows the tests for throttling purposes.
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

		//Tests utilizing speech API
			slowTest("8khz WAV Not Chunked", function() {
						
				var jsonObj = {
					ClientApp: 'TestApp1'
						}
			AttApiClient.setServerPath("http://localhost:4567")			
			AttApiClient.textToSpeech(
				 'hello michael.',
				 function(response) {
					response.start();
					start();
					ok(true, "Worked On Utilizing Speech with WAV." +
						"\nresponse: ") 	
				},
				function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with WAV." +
						"\nresponse: " );	
				}
			);
			stop();
		});
	}
