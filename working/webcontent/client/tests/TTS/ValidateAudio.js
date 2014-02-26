function validateAudioResponse(Audio, expectedWords)
{
        var jsonObj = {
            ClientApp: 'TestApp1'
                }
    AttApiClient.speechToText(Audio,
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
