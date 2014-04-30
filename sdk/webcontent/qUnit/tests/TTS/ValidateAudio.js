function validateAudioResponse(audio, expectedWords, lang) {
    lang = lang || "en-US";
    AttApiClient.Speech.speechToText(
        {
            audioBlob: audio,
            language: lang,
        },
        function(response) {
            start();
            ok(true, "Worked On Utilizing Speech with WAV." +
                "\nresponse: " + JSON.stringify(response)); 
            validateSpeechResponse(response, expectedWords, lang);
        },
        function(response) {
            start();
            ok(false, "Fail On Utilizing Speech with WAV." +
                "\nresponse: " + JSON.stringify(response)); 
        }
    );
    stop();
}
