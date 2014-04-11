package com.att.html5sdk;

import java.io.IOException;
import java.util.*;

public class TestAds {
    /**
     * @method Execute
     */
    public static void Execute(ArrayList<TestResult> results, String logFile)
            throws InterruptedException, IOException {

        ArrayList<TestResult> localResults = new ArrayList<TestResult>();

        AdsApp1 adsApp1 = new AdsApp1();
        // localResults.add(adsApp1.Execute(Global.phoneNumber,"address",
        // "This is a test message", "message","btnSendMessage",
        // "btnCloseResponse", "smsId","btnGetStatus"));
        // localResults.add(adsApp1.ExecuteGetSMS("btnGetMessages",
        // "btnCloseResponse"));

        // Test Recursively
        TestAdsRecursive TAR = new TestAdsRecursive();
        TAR.Execute(localResults, logFile);
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

        Log.getLogger().info(
                "\nSucceeded: " + succeeded + " Failed: "
                        + (localResults.size() - succeeded) + "\n\n");

    }

}
