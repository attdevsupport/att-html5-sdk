function validateAudioResponse(Audio, expectedWords)
{
        var jsonObj = {
            ClientApp: 'TestApp1'
                }
    var blob = new Blob([Audio], { type: "audio/wav"});
	AttApiClient.speechToText(blob,
        function(response) {
            start();
            ok(true, "Worked On Utilizing Speech with WAV." +
                "\nresponse: " + JSON.stringify(response));	
            validateSpeechResponse(response, expectedWords);
        },
        function(response) {
            start();
            ok(false, "Fail On Utilizing Speech with WAV." +
                "\nresponse: " + JSON.stringify(response));	
        }
    );
    stop();
}
