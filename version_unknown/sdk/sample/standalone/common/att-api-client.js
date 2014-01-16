function AttApiClient(serverPath)
{
    this.serverPath = serverPath;
}

AttApiClient.prototype = {
    speechToText: function(filenameOnServer) {
        var speechRequest = {
            data: [filenameOnServer]
        };
        return jQuery.post(this.serverPath, JSON.stringify(speechRequest));
    }
};