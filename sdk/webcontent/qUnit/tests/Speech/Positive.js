//No positive payment test cases outside basic at this time
	function positiveSpeechTests() {
		
				var jsonObj = {
					ClientApp: 'TestApp1'
						}
						
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
                setTimeout(code, 1700);
        }
        
        //Positive tests for Speech
		slowTest("Streamed Speech with wav 8khz WITHOUT context or x-arg JSON Object", function() {
			AttApiClient.serverSpeechToText({
				filename : 'test-8khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : 'true'},
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
								
				slowTest("Streamed Speech with wav (16000 sample rate)", function() {
			AttApiClient.serverSpeechToText({
				filename : 'test-16khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : 'true',
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
		
		slowTest("Streamed Speech with amr", function() {
			AttApiClient.serverSpeechToText({
				filename : 'test-8khz-amrnb-MR475.amr',
				fileContentType :'audio/amr',
				chunked : 'true',
				context  : 'Generic',
				xarg     : jsonObj},
				function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with AMR." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with AMR." +
						"\nresponse: " + JSON.stringify(response));	
				}
			);
			stop();
		});
		
				slowTest("Streamed Speech with amr (16000 sample rate)", function() {
			AttApiClient.serverSpeechToText({
				filename : 'qt_16khz_awb.awb',
				fileContentType :'audio/amr-wb',
				chunked : 'true',
				context  : 'Generic',
				xarg     : jsonObj},
				function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with AMR." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with AMR." +
						"\nresponse: " + JSON.stringify(response));	
				}
			);
			stop();
		});
		
		slowTest("Streamed Speech with ogg", function() {
			AttApiClient.serverSpeechToText({
				filename : 'test1_8khz_speex.spx',
				fileContentType :'audio/x-speex',
				chunked : 'true',
				context  : 'Generic',
				xarg     : jsonObj},
				function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with OGG." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "This is ben wakeman pointe consulting services. I'm currently not able to take your call.");
				},
				function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with OGG." +
						"\nresponse: " + JSON.stringify(response));	
				}
			);
			stop();
		});
		
					slowTest("Streamed Speech with ogg (16000 sample rate)", function() {
			AttApiClient.serverSpeechToText({
				filename : 'test-16khz peexwb-16.spx',
				fileContentType :'audio/x-speex',
				chunked : 'true',
				context  : 'Generic',
				xarg     : jsonObj},
				function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with OGG." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with OGG." +
						"\nresponse: " + JSON.stringify(response));	
				}
			);
			stop();
		});
		

				slowTest("Streamed Speech with wav no-stream", function() {
			AttApiClient.serverSpeechToText({
				filename : 'test-8khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : 'false',
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
		
				slowTest("Streamed Speech with wav (16000 sample rate) no-stream", function() {
			AttApiClient.serverSpeechToText({
				filename : 'test-16khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : 'false',
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
		
		slowTest("Streamed Speech with amr no-stream", function() {
			AttApiClient.serverSpeechToText({
				filename : 'test-8khz-amrnb-MR475.amr',
				fileContentType :'audio/amr',
				chunked : 'false',
				context  : 'Generic',
				xarg     : jsonObj},
				function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with AMR." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with AMR." +
						"\nresponse: " + JSON.stringify(response));	
				}
			);
			stop();
		});
		
				slowTest("Streamed Speech with amr (16000 sample rate) no-stream", function() {
			AttApiClient.serverSpeechToText({
				filename : 'qt_16khz_awb.awb',
				fileContentType :'audio/amr-wb',
				chunked : 'false',
				context  : 'Generic',
				xarg     : jsonObj},
				function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with AMR." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with AMR." +
						"\nresponse: " + JSON.stringify(response));	
				}
			);
			stop();
		});
		
		slowTest("Streamed Speech with ogg no-stream", function() {
			AttApiClient.serverSpeechToText({
				filename : 'test1_8khz_speex.spx',
				fileContentType :'audio/x-speex',
				chunked : 'false',
				context  : 'Generic',
				xarg     : jsonObj},
				function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with OGG." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "This is ben wakeman pointe consulting services. I'm currently not able to take your call.");
				},
				function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with OGG." +
						"\nresponse: " + JSON.stringify(response));	
				}
			);
			stop();
		});
		
		
		slowTest("Streamed Speech with ogg (16000 sample rate) no-stream", function() {
			AttApiClient.serverSpeechToText({
				filename : 'test-16khz peexwb-16.spx',
				fileContentType :'audio/x-speex',
				chunked : 'false',
				context  : 'Generic',
				xarg     : jsonObj},
				function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with OGG." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with OGG." +
						"\nresponse: " + JSON.stringify(response));	
				}
			);
			stop();
		});
		
		
		
		slowTest("context = generic", function() {
			AttApiClient.serverSpeechToText({
				filename : 'test-8khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : 'true',
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
		
		slowTest("context = voicemail", function() {
			AttApiClient.serverSpeechToText({
				filename : 'test-8khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : 'true',
				context  : 'Voicemail',
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
		
		slowTest("context = webSeasrch", function() {
			AttApiClient.serverSpeechToText({
				filename : 'test-8khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : 'true',
				context  : 'Websearch',
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
		
		slowTest("Full parameter for xarg", function() {
					var jsonObjFull = {
					
								ClientApp: 'TestApp1',
								ClientVersion: '1.0.1',
								ClientScreen: 'widget',
								ClientSdk: 'SenchaSDK',
								DeviceType: 'SGHT999',
								DeviceOs: 'Android-1.0',
								//DeviceTime: '2012-08-08 07:08:10 EDT'
								}
					
			AttApiClient.serverSpeechToText({
				filename : 'test-8khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : 'true',
				context  : 'Generic',
				xarg     : jsonObjFull},
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
        
        slowTest("Negative test - No filename", function() {
            var jsonObjFull = {
            
                ClientApp: 'TestApp1',
                ClientVersion: '1.0.1',
                ClientScreen: 'widget',
                ClientSdk: 'SenchaSDK',
                DeviceType: 'SGHT999',
                DeviceOs: 'Android-1.0',
                //DeviceTime: '2012-08-08 07:08:10 EDT'
            }
					
			AttApiClient.serverSpeechToText({
				filename : 'x.jpg',
				fileContentType :'audio/wav',
				chunked : 'true',
				context  : 'Generic',
				xarg     : jsonObjFull},
				function(response) {
					start();
					ok(false, "Expected Fail, but instead worked On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));
				},
				function(response) {
					start();
					validateSpeechFailResponse(response);	
				}
			);
			stop();
            
		});
        
    }