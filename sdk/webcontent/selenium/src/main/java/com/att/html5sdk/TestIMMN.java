package com.att.html5sdk;

import java.io.IOException;
import java.util.ArrayList;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class TestIMMN {

    public static void Execute(ArrayList<TestResult> results, String logFile)
            throws InterruptedException, IOException {
        ArrayList<TestResult> localResults = new ArrayList<TestResult>();
        try {
            // INITIALIZE DRIVERS TEST
            Global global = new Global();

            // start and connect to the Chrome browser
            System.setProperty("webdriver.chrome.driver", global.webDriverDir);
            WebDriver driver = new ChromeDriver();
            try {

                // IMMN1();
                IMMNApp1Positive IMMNApp1 = new IMMNApp1Positive();
                localResults.add(IMMNApp1.Login(driver, logFile));
                // localResults.add(IMMNApp1.Execute("btnCloseResponse",
                // logFile));
                localResults.add(IMMNApp1.GetMessageList(driver, logFile));
                localResults.add(IMMNApp1.Reply(driver, logFile));
                localResults.add(IMMNApp1.SendMessage(driver, logFile)
                localResults.add(IMMNApp1.GetMessageStateAndDelta(driver,
                        logFile));
                localResults.add(IMMNApp1.UpdateMessage(driver, logFile));
                localResults.add(IMMNApp1.GetMessageContent(driver, logFile));
                localResults.add(IMMNApp1.DeleteMessage(driver, logFile));
                localResults.add(IMMNApp1.DeleteMessages(driver, logFile));

            } catch (Exception e) {
                System.out.println(e.getMessage());
            } finally {
                driver.quit();
            }
        } finally {
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
}