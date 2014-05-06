
function validateSpeechResponse(response, expectedWords, language) {
    language = language || "en-US";
    notEqual(response["Recognition"], undefined, "Recognition");
    var recog = response["Recognition"];
    if (recog != null) {
        var nbe = recog["NBest"]["0"]["Words"];
        var wordCount = expectedWords.split(' ');
        var errorMargin= Math.ceil(wordCount.length * 0.10);
        if(wordCount.length != nbe.length)
        {
            if(nbe.length >= (wordCount.length - errorMargin) && nbe.length <= (wordCount.length + errorMargin))
            {
                ok(true,"Count falls within Margin");
            }
            else
            {
                ok(false, "Count does not fall within error margin of 10%. NBest: " + nbe.length + " Expected: " + wordCount.length + "\nMargin: " + errorMargin);
            }
        }
        else 
        {
            ok(true,"Word count came back exact");
        }
        notEqual(recog["ResponseId"], undefined, "ResponseId");
        var nb = recog["NBest"];
        var nBestElement = nb.shift();
        var hyp = nBestElement["Hypothesis"];
        var expectedResultText = expectedWords.charAt(0).toUpperCase() + expectedWords.slice(1) + ".";
        if (nBestElement) {
            //equal(hyp, expectedWords, "Expected Words");
            notEqual(nBestElement["Hypothesis"], undefined, "Hypothesis");
            notEqual(nBestElement["LanguageId"], undefined, "LanguageId");
            equal(nBestElement["LanguageId"], language, "Language ISO code");
            notEqual(nBestElement["Confidence"], undefined, "Confidence");
            notEqual(nBestElement["Grade"], undefined, "Grade");
            //equal(nBestElement["Grade"], "accept", "Acceptable");
            notEqual(nBestElement["ResultText"], undefined, "ResultText");
            //equal(nBestElement["ResultText"], expectedResultText, "Expected Result Text");
            notEqual(nBestElement["Words"].shift(), undefined, "Words");
            notEqual(nBestElement["WordScores"].shift(), undefined, "WordScores");
        }
    }
    else {
        validateSpeechResponseLowerCase(response, expectedWords);
    }
}

//Validate the response received after sending a valid speech request
function validateSpeechResponseLowerCase(response, expectedWords) {
    notEqual(response["recognition"], undefined, "recognition");
    var recog = response["recognition"];
    notEqual(recog["responseID"], undefined, "responseID");
    var nb = recog["nbest"];
    var nBestElement = nb.shift();
    var hyp = nBestElement["hypothesis"];
    var expectedResultText = expectedWords.charAt(0).toUpperCase() + expectedWords.slice(1) + ".";
    
    if (nBestElement) {
        equal(hyp, expectedWords, "Expected Words");
        notEqual(nBestElement["hypothesis"], undefined, "hypothesis");
        notEqual(nBestElement["languageID"], undefined, "languageID");
        equal(nBestElement["languageID"], "en-US", "American English");
        notEqual(nBestElement["confidence"], undefined, "confidence");
        notEqual(nBestElement["grade"], undefined, "grade");
        //equal(nBestElement["grade"], "accept", "acceptable");
        notEqual(nBestElement["resultText"], undefined, "resultText");
        equal(nBestElement["resultText"], expectedResultText, "expected result text");
        notEqual(nBestElement["words"].shift(), undefined, "words");
        notEqual(nBestElement["wordScores"].shift(), undefined, "wordScores");
    }
}

//Validate the response received after sending a speech request with non-specified audio coding
function validateSpeechFailACNSResponse(response) {
    notEqual(response["requestError"], undefined, "requestError");
    var re = response["requestError"];
    if (re != null) {
        notEqual(re["serviceException"], undefined, "serviceException");
        var se = re["serviceException"];
        if (se != null) {
            equal(se["messageId"], "SVC0001", "messageId");
            equal(se["text"], "Audio coding not specified", "text");
            equal(se["variables"], "", "variables");
        }
    }
}

//Validate the response received after sending a speech request with idle time out
function validateSpeechFailITOResponse(response) {
    notEqual(response["requestError"], undefined, "requestError");
    var re = response["requestError"];
    if (re != null) {
        notEqual(re["serviceException"], undefined, "serviceException");
        var se = re["serviceException"];
        if (se != null) {
            equal(se["messageId"], "SVC0001", "messageId");
            equal(se["text"], "Idle Time out", "text");
            equal(se["variables"], "", "variables");
        }
    }
}

//Validate the response received after sending a speech request with the HTTP Chunk length bad
function validateSpeechFailHCLBResponse(response) {
    notEqual(response["requestError"], undefined, "requestError");
    var re = response["requestError"];
    if (re != null) {
        notEqual(re["serviceException"], undefined, "serviceException");
        var se = re["serviceException"];
        if (se != null) {
            equal(se["messageId"], "SVC0001", "messageId");
            equal(se["text"], "HTTP Chunk length bad", "text");
            equal(se["variables"], "", "variables");
        }
    }
}

//Validate the response received after sending a speech request with the app package not found
function validateSpeechFailAPNFResponse(response) {
    notEqual(response["requestError"], undefined, "requestError");
    var re = response["requestError"];
    if (re != null) {
        notEqual(re["serviceException"], undefined, "serviceException");
        var se = re["serviceException"];
        if (se != null) {
            equal(se["messageId"], "SVC0001", "messageId");
            equal(se["text"], "App package not found", "text");
            equal(se["variables"], "", "variables");
        }
    }
}

//Validate the response received after sending a speech request with no speech
function validateSpeechFailNSResponse(response) {
    notEqual(response["requestError"], undefined, "requestError");
    var re = response["requestError"];
    if (re != null) {
        notEqual(re["serviceException"], undefined, "serviceException");
        var se = re["serviceException"];
        if (se != null) {
            equal(se["messageId"], "SVC0001", "messageId");
            equal(se["text"], "No Speech", "text");
            equal(se["variables"], "", "variables");
        }
    }
}

//Validate the response received after sending a speech request with not enough speech
function validateSpeechFailNESResponse(response) {
    notEqual(response["requestError"], undefined, "requestError");
    var re = response["requestError"];
    if (re != null) {
        notEqual(re["serviceException"], undefined, "serviceException");
        var se = re["serviceException"];
        if (se != null) {
            equal(se["messageId"], "SVC0001", "messageId");
            equal(se["text"], "Not Enough Speech", "text");
            equal(se["variables"], "", "variables");
        }
    }
}

//Validate the response received after sending a speech request with too much speech
function validateSpeechFailTMSResponse(response) {
    notEqual(response["requestError"], undefined, "requestError");
    var re = response["requestError"];
    if (re != null) {
        notEqual(re["serviceException"], undefined, "serviceException");
        var se = re["serviceException"];
        if (se != null) {
            equal(se["messageId"], "SVC0001", "messageId");
            equal(se["text"], "Too Much Speech", "text");
            equal(se["variables"], "", "variables");
        }
    }
}

//Validate the response received after sending a speech request that is too quiet
function validateSpeechFailTQResponse(response) {
    notEqual(response["requestError"], undefined, "requestError");
    var re = response["requestError"];
    if (re != null) {
        notEqual(re["serviceException"], undefined, "serviceException");
        var se = re["serviceException"];
        if (se != null) {
            equal(se["messageId"], "SVC0001", "messageId");
            equal(se["text"], "Too Quiet", "text");
            equal(se["variables"], "", "variables");
        }
    }
}

//Validate the response received after sending a speech request that has speech too soon
function validateSpeechFailSTSResponse(response) {
    notEqual(response["requestError"], undefined, "requestError");
    var re = response["requestError"];
    if (re != null) {
        notEqual(re["serviceException"], undefined, "serviceException");
        var se = re["serviceException"];
        if (se != null) {
            equal(se["messageId"], "SVC0001", "messageId");
            equal(se["text"], "Speech Too Soon", "text");
            equal(se["variables"], "", "variables");
        }
    }
}

//Validate the response received after sending a speech request with an unsupported bitrate
function validateSpeechFailBNSResponse(response) {
    notEqual(response["requestError"], undefined, "requestError");
    var re = response["requestError"];
    if (re != null) {
        notEqual(re["serviceException"], undefined, "serviceException");
        var se = re["serviceException"];
        if (se != null) {
            equal(se["messageId"], "SVC0001", "messageId");
            equal(se["text"], "Bitrate not supported", "text");
            equal(se["variables"], "", "variables");
        }
    }
}

//Validate the response received after sending a speech request with an invalid parameter
function validateSpeechFailIPResponse(response) {
    notEqual(response["requestError"], undefined, "requestError");
    var re = response["requestError"];
    if (re != null) {
        notEqual(re["serviceException"], undefined, "serviceException");
        var se = re["serviceException"];
        if (se != null) {
            equal(se["messageId"], "SVC0002", "messageId");
            equal(se["text"], "Invalid Parameter", "text");
            equal(se["variables"], "%1", "variables");
        }
    }
}

//Validate the response received after sending a speech request with an undefined parameter
function validateSpeechFailUPResponse(response) {
    notEqual(response["requestError"], undefined, "requestError");
    var re = response["requestError"];
    if (re != null) {
        notEqual(re["serviceException"], undefined, "serviceException");
        var se = re["serviceException"];
        if (se != null) {
            equal(se["messageId"], "SVC0002", "messageId");
            equal(se["text"], "Undefined Parameter", "text");
            equal(se["variables"], "%1", "variables");
        }
    }
}

//Validate the response received after sending a speech request that is too long
function validateSpeechFailTooLongResponse(response) {
    notEqual(response["requestError"], undefined, "requestError");
    var re = response["requestError"];
    if (re != null) {
        notEqual(re["serviceException"], undefined, "serviceException");
        var se = re["serviceException"];
        if (se != null) {
            equal(se["messageId"], "POL0001", "messageId");
            equal(se["text"], "The audio length is larger than the allowed length", "text");
            equal(se["variables"], "", "variables");
        }
    }
}

function validateSpeechFailResponse(response){
    ok(true, "Expected fail with error: " + JSON.stringify(JSON.parse(response['responseText'])['error']));
}
