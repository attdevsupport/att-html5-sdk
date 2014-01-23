	function basicSpeechTests() {
		//Tests utilizing speech API
			slowTest("8khz WAV Not Chunked", function() {
						
				var jsonObj = {
					ClientApp: 'TestApp1'
						}
				
			provider.speechToText({
				fileName : 'test-8khz-linear-pcm.wav',
				fileContentType :'audio/wav',
				chunked : false,
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
	}
