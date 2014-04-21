package com.att.html5sdk;

import java.io.IOException;
import java.util.*;

public class TestSMS {
    /**
     * @method Execute
     */
    public static void Execute(ArrayList<TestResult> results, String logFile)
            throws InterruptedException, IOException {

        ArrayList<TestResult> localResults = new ArrayList<TestResult>();

        SMSApp1positive SMSApp1 = new SMSApp1positive();
        SMSApp2positive SMSApp2 = new SMSApp2positive();
        localResults.add(SMSApp1.Execute(Global.phoneNumber, "address",
                "This is a test message", "message", "btnSendMessage",
                "btnCloseResponse", "smsId", "btnGetStatus"));
        localResults.add(SMSApp1.ExecuteGetSMS("btnGetMessages",
                "btnCloseResponse"));
        localResults.add(SMSApp2.Execute("btnShowVotes", "btnCloseResponse", logFile));
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
