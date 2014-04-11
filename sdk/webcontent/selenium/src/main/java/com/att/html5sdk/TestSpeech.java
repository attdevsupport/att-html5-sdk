package com.att.html5sdk;

import java.io.IOException;
import java.util.*;

/**
 * @class TestSpeech call all speech-related test cases
 */
public class TestSpeech {

    /**
     * @method Execute
     */
    public static void Execute(ArrayList<TestResult> results, String logFile)
            throws InterruptedException, IOException {

        ArrayList<TestResult> localResults = new ArrayList<TestResult>();

        SpeechApp1positive SpeechApp1 = new SpeechApp1positive();
        localResults.add(SpeechApp1.Execute("btnSubmit", "btnCloseResponse",
                logFile));

        TestSpeechRecursive speech = new TestSpeechRecursive();
        speech.Execute(localResults, logFile);

        SpeechApp3positive SpeechApp3 = new SpeechApp3positive();
        localResults.add(SpeechApp3.Execute("textToConvert", "btnSubmitText",
                "resultWindow",
                "Success, click Play to hear the converted audio", logFile));

        Integer succeeded = 0;
        Integer i;

        Log.getLogger()
                .info("\n\nSummary -------------------------------------------------------------------------\n");
        for (i = 0; i < localResults.size(); i++) {
            TestResult item = localResults.get(i);
            if (item.pass) {
                succeeded++;
            }
            results.add(item);
            // item.logShortResults();
        }

        Log.getLogger(logFile).info(
                "\nSucceeded: " + succeeded + " Failed: "
                        + (localResults.size() - succeeded) + "\n\n");

    }

}
