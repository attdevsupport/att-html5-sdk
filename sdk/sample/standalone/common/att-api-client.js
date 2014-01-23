function AttApiClient(serverPath)
{
    this.serverPath = serverPath;
}

AttApiClient.prototype = {
    serverSpeechToText: function(filenameOnServer) {
        var requestUrl = this.serverPath 
            + "/att/speech/speechtotext?filename=" 
            + encodeURIComponent(filenameOnServer);
        return jQuery.post(requestUrl);
    }
    
    speechToText: function(audioBlob) {
        var fd = new FormData();
        fd.append("speechaudio", audioBlob);
        return jQuery.post(this.serverPath + "/att/speech/speechtotext", fd);
    }
    
    textToSpeech: function(text) {
        
    }
};