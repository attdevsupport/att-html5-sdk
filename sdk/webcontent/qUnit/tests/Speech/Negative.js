//No negative speech test cases outside basic at this time
	function negativeSpeechTests() {
    
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
                setTimeout(code, 1200);
        }
        
/*         slowTest("Invalid chunked type - 8khz WAV Not Chunked", function() {
						
				var jsonObj = {
					ClientApp: 'TestApp1'
						}
			AttApiClient.serverSpeechToText({
				filename : 'test-8khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : true,
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
		}); */
		
            //Tests utilizing speech API
   /*      slowTest("Invalid ContentType - test-8khz-linear-pcm.wav", function() {
                    
            var jsonObj = {
                ClientApp: 'SpeechToText'
                    }	
            AttApiClient.serverSpeechToText({
                filename : 'test-8khz-linear-pcm.wav',
                fileContentType :'video/wmv',
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
		}); */
        
        slowTest("No File Name", function() {
                    
            var jsonObj = {
                ClientApp: 'SpeechToText'
                    }	
            AttApiClient.serverSpeechToText({
                
                fileContentType :'video/wmv',
                chunked : false,
                context  : 'Generic',
                xarg     : jsonObj},
                function(response) {
                    start();
                    ok(false, "Worked On Utilizing Speech with WAV without filename" +
                        "\nresponse: " + JSON.stringify(response));	
                    //validateSpeechResponse(response, "this is a test");
                },
                function(response) {
                    start();
                    ok(true, "Fail On Utilizing Speech with WAV. without filename" +
                        "\nresponse: " + JSON.stringify(response));	
                }
            );
            stop();
		});
        
        slowTest("No content type", function() {
                    
            var jsonObj = {
                ClientApp: 'SpeechToText'
                    }	
            AttApiClient.serverSpeechToText({
                filename : 'test-8khz-linear-pcm.wav',
                chunked : false,
                context  : 'Generic',
                xarg     : jsonObj},
                function(response) {
                    start();
                    ok(false, "Worked without content type" +
                        "\nresponse: " + JSON.stringify(response));	
                    //validateSpeechResponse(response, "this is a test");
                },
                function(response) {
                    start();
                    ok(true, "Failed without contenttype" +
                        "\nresponse: " + JSON.stringify(response));	
                }
            );
            stop();
		});

	}