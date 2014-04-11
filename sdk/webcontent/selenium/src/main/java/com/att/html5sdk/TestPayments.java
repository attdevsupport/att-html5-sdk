package com.att.html5sdk;

import java.awt.AWTException;
import java.io.IOException;
import java.util.ArrayList;

public class TestPayments {

    /**
     * @throws AWTException
     * @method Execute
     */
    public static void Execute(ArrayList<TestResult> results, String logFile)
            throws InterruptedException, IOException, AWTException {

        ArrayList<TestResult> localResults = new ArrayList<TestResult>();

        PaymentApp1 paymentApp1 = new PaymentApp1();
        localResults.add(paymentApp1.Execute(logFile));

        PaymentApp2 paymentApp2 = new PaymentApp2();
        localResults.add(paymentApp2.Execute(logFile));

        PaymentApp3 paymentApp3 = new PaymentApp3();
        localResults.add(paymentApp3.Execute(logFile));

        int succeeded = 0;

        Log.getLogger()
                .info("\n\nSummary -------------------------------------------------------------------------\n");
        for (TestResult item : localResults) {
            if (item.pass) {
                succeeded++;
            }
            results.add(item);
        }

        Log.getLogger(logFile).info(
                "\nSucceeded: " + succeeded + " Failed: "
                        + (localResults.size() - succeeded) + "\n\n");
    }
}
