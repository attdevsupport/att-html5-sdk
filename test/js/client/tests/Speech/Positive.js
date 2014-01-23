//No positive payment test cases outside basic at this time
	function positiveSpeechTests() {
		
				var jsonObj = {
					ClientApp: 'TestApp1'
						}
						
		slowTest("Streamed Speech with wav 8khz WITHOUT context or x-arg JSON Object", function() {
			provider.speechToText({
				fileName : 'test-8khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : 'true',
				success : function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
								
				slowTest("Streamed Speech with wav (16000 sample rate)", function() {
			provider.speechToText({
				fileName : 'test-16khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : 'true',
				context  : 'Generic',
				xarg     : jsonObj,
				success : function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
		slowTest("Streamed Speech with amr", function() {
			provider.speechToText({
				fileName : 'test-8khz-amrnb-MR475.amr',
				fileContentType :'audio/amr',
				chunked : 'true',
				context  : 'Generic',
				xarg     : jsonObj,
				success : function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with AMR." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with AMR." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
				slowTest("Streamed Speech with amr (16000 sample rate)", function() {
			provider.speechToText({
				fileName : 'qt_16khz_awb.awb',
				fileContentType :'audio/amr-wb',
				chunked : 'true',
				context  : 'Generic',
				xarg     : jsonObj,
				success : function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with AMR." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with AMR." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
		slowTest("Streamed Speech with ogg", function() {
			provider.speechToText({
				fileName : 'test1_8khz_speex.spx',
				fileContentType :'audio/x-speex',
				chunked : 'true',
				context  : 'Generic',
				xarg     : jsonObj,
				success : function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with OGG." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with OGG." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
					slowTest("Streamed Speech with ogg (16000 sample rate)", function() {
			provider.speechToText({
				fileName : 'test-16khz peexwb-16.spx',
				fileContentType :'audio/x-speex',
				chunked : 'true',
				context  : 'Generic',
				xarg     : jsonObj,
				success : function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with OGG." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with OGG." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		

				slowTest("Streamed Speech with wav no-stream", function() {
			provider.speechToText({
				fileName : 'test-8khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : 'false',
				context  : 'Generic',
				xarg     : jsonObj,
				success : function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
				slowTest("Streamed Speech with wav (16000 sample rate) no-stream", function() {
			provider.speechToText({
				fileName : 'test-16khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : 'false',
				context  : 'Generic',
				xarg     : jsonObj,
				success : function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
		slowTest("Streamed Speech with amr no-stream", function() {
			provider.speechToText({
				fileName : 'test-8khz-amrnb-MR475.amr',
				fileContentType :'audio/amr',
				chunked : 'false',
				context  : 'Generic',
				xarg     : jsonObj,
				success : function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with AMR." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with AMR." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
				slowTest("Streamed Speech with amr (16000 sample rate) no-stream", function() {
			provider.speechToText({
				fileName : 'qt_16khz_awb.awb',
				fileContentType :'audio/amr-wb',
				chunked : 'false',
				context  : 'Generic',
				xarg     : jsonObj,
				success : function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with AMR." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with AMR." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
		slowTest("Streamed Speech with ogg no-stream", function() {
			provider.speechToText({
				fileName : 'test1_8khz_speex.spx',
				fileContentType :'audio/x-speex',
				chunked : 'false',
				context  : 'Generic',
				xarg     : jsonObj,
				success : function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with OGG." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with OGG." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
		
		slowTest("Streamed Speech with ogg (16000 sample rate) no-stream", function() {
			provider.speechToText({
				fileName : 'test-16khz peexwb-16.spx',
				fileContentType :'audio/x-speex',
				chunked : 'false',
				context  : 'Generic',
				xarg     : jsonObj,
				success : function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with OGG." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with OGG." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
		
		
		slowTest("context = generic", function() {
			provider.speechToText({
				fileName : 'test-8khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : 'true',
				context  : 'Generic',
				xarg     : jsonObj,
				success : function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
		slowTest("context = voicemail", function() {
			provider.speechToText({
				fileName : 'test-8khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : 'true',
				context  : 'Voicemail',
				xarg     : jsonObj,
				success : function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
		
		slowTest("context = webSeasrch", function() {
			provider.speechToText({
				fileName : 'test-8khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : 'true',
				context  : 'Websearch',
				xarg     : jsonObj,
				success : function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
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
					
			provider.speechToText({
				fileName : 'test-8khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : 'true',
				context  : 'Generic',
				xarg     : jsonObjFull,
				success : function(response) {
					start();
					ok(true, "Worked On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
					validateSpeechResponse(response, "this is a test");
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing Speech with WAV." +
						"\nresponse: " + JSON.stringify(response));	
				}
			});
			stop();
		});
}