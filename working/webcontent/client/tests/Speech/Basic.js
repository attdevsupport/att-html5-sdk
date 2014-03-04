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
			AttApiClient.serverSpeechToText({
				filename : 'test-8khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : false,
				context  : 'Generic',
				xarg     : jsonObj},
				function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
				}
			);
			stop();
		});
            slowTest("8khz WAV Not Chunked #2", function() {
						
				var jsonObj = {
					ClientApp: 'TestApp1'
						}
			AttApiClient.serverSpeechToText({
				filename : 'test-8khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : false,
				context  : 'Generic',
				xarg     : jsonObj},
				function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
				}
			);
			stop();
		});
	}
