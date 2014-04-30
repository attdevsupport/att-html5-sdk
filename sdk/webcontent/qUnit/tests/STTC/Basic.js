function basicSpeechTests() {

    //Function that wraps all of the tests. Slows the tests for throttling purposes.
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
        setTimeout(code, 200);
    }

    //Tests utilizing speech API
    slowTest("8khz WAV Not Chunked", function() {
        AttApiClient.Speech.serverSpeechToTextCustom({
            filename : 'messageQiang.wav',
            fileContentType :'audio/wav',
            chunked : false,
            context  : 'GrammarList',
            xarg     : "ClientApp=TestApp1"},
            function(response) {
                start();
                ok(true, "Worked On Utilizing Speech with WAV." +
                    "\nresponse: " + JSON.stringify(response)); 
                validateSpeechResponse(response, "send message to Qiang.");
            },
            function(response) {
                start();
                ok(false, "Fail On Utilizing Speech with WAV." +
                    "\nresponse: " + JSON.stringify(response)); 
            }
        );
        stop();
    });

    slowTest("8khz WAV Not Chunked #2", function() {
        AttApiClient.Speech.serverSpeechToTextCustom({
            filename : 'textDavid.wav',
            fileContentType :'audio/wav',
            chunked : false,
            context  : 'GrammarList',
            xarg     : "ClientApp=TestApp1"},
            function(response) {
                start();
                ok(true, "Worked On Utilizing Speech with WAV." +
                    "\nresponse: " + JSON.stringify(response)); 
                validateSpeechResponse(response, "text David");
            },
            function(response) {
                start();
                ok(false, "Fail On Utilizing Speech with WAV." +
                    "\nresponse: " + JSON.stringify(response)); 
            }
        );
        stop();
    });

    slowTest("Content-Language = es-US", function() {
        AttApiClient.Speech.serverSpeechToTextCustom({
            filename : 'spanish.wav',
            fileContentType :'audio/wav',
            language : 'es-US',
            chunked : false,
            context  : 'GrammarList',
            xarg     : "ClientApp=TestApp1"},
            function(response) {
                start();
                ok(false, "Expected Fail: Worked On Utilizing Speech with WAV." +
                    "\nresponse: " + JSON.stringify(response)); 
                validateSpeechResponse(response, "quiero comprar un boleto de ida y vuelta Juan es alto", "es-US");
            },
            function(response) {
                start();
                ok(true, "Fail On Utilizing Speech with WAV." +
                    "\nresponse: " + JSON.stringify(JSON.stringify(JSON.parse(response['responseText'])['error'])));    
            }
        );
        stop();
    });

    slowTest("Negative test - Invalid FileName", function() {
        AttApiClient.Speech.serverSpeechToTextCustom({
            filename : 'invalid.wav',
            fileContentType :'audio/wav',
            chunked : false,
            context  : 'GrammarList',
            xarg     : "ClientApp=TestApp1"},
            function(response) {
                start();
                ok(false, "Expected Fail: Worked On Utilizing Speech with WAV." +
                    "\nresponse: " + JSON.stringify(response)); 
                validateSpeechResponse(response, "text David");
            },
            function(response) {
                start();
                ok(true, "Fail On Utilizing Speech with WAV." +
                    "\nresponse: " + JSON.stringify(JSON.stringify(JSON.parse(response['responseText'])['error'])));    
            }
        );
        stop();
    });
}
