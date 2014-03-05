	function pairwiseADSTests() {
		//Test utilizing Speech with two calls at once
		slowTest("Speech (ADS)", function() {
			JTF.provider.speechToText({
				fileName : audioFile,
				success : function(response) {
					start();
					validateSpeechADSResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing Speech Pairwise #1");
				}
			});
			JTF.provider.speechToText({
				fileName : audioFile,
				success : function(response) {
					start();
					validateSpeechADSResponse(response);
				},
				failure : function(response) {
					start();
					ok(false, "Fail On Utilizing Speech Pairwise #2");
				}
			});
			stop(2);
		});
	}
