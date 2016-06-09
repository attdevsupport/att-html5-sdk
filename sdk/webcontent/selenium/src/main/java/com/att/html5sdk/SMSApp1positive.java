package com.att.html5sdk;

import java.io.IOException;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class SMSApp1positive {
    /**
     * @method Execute run a simple positive test case for SMS App1
     * 
     * @param submit
     *            The DOM id of the HTML element that submits the sample request
     * 
     * @param done
     *            The DOM id of the HTML element that dismisses the sample
     *            result
     * 
     * @returns TestResult
     */
    public TestResult Execute(String phoneNumber, String txtElementPhoneName,
            String message, String txtElementMessageName, String btnSubmit,
            String btnDone, String statusElementName, String btnGetStatus)
            throws InterruptedException, IOException {

        // Logger log = Log.getLogger();
        Global global = new Global();
        String url = global.serverPrefix + global.SMS1Ruby;
        TestResult testResult = new TestResult("SMS App1 Positive", url);
        String responseText = "";
        // start and connect to the Chrome browser
        System.setProperty("webdriver.chrome.driver", global.webDriverDir);
        WebDriver driver = new ChromeDriver();
        // driver.manage().timeouts().pageLoadTimeout(10,TimeUnit.SECONDS);

        try {

            WebDriverWait wait = new WebDriverWait(driver, 10);

            // navigate to the sample page
            driver.get(url);
            try {
                // Wait for visibility
                testResult.setAction("Find textbox");
                wait.until(ExpectedConditions.visibilityOfElementLocated(By
                        .name(txtElementPhoneName)));

                testResult.info("Inputing Phone number into: "
                        + txtElementPhoneName);

                // Enter phone number
                WebElement ta = driver
                        .findElement(By.name(txtElementPhoneName));
                ta.clear();
                ta.sendKeys(phoneNumber);

                // Modify SMS Message
                testResult.setAction("Modify Message");
                testResult.info("Inputing message into: "
                        + txtElementMessageName);
                ta = driver.findElement(By.name(txtElementMessageName));
                ta.clear();
                ta.sendKeys(message);

                // Submit SMS request
                testResult.setAction("Click " + btnSubmit);
                Global.scrollIntoView(driver, btnSubmit);
                driver.findElement(By.id(btnSubmit)).click();

                testResult.setAction("Visibility of success");
                wait.until(ExpectedConditions.visibilityOfElementLocated(By
                        .id("resultsHeader")));

                testResult.setAction("Find success text");
                String result = driver.findElement(By.className("success"))
                        .getText();
                testResult.info(result);
                testResult.setAction("Wait for Done");
                wait.until(ExpectedConditions.visibilityOfElementLocated(By
                        .id(btnDone)));
                testResult.setAction("Click Done: Close result window");
                driver.findElement(By.id(btnDone)).click();
                if (result.contains("Success: true")) {
                    testResult.info("Waiting For MessageID");
                    wait.until(ExpectedConditions.visibilityOfElementLocated(By
                            .name(statusElementName)));
                    testResult.info("done waiting");
                    testResult.setAction("Retrieving Message ID");
                    String messageID = driver.findElement(
                            By.name(statusElementName)).getAttribute("value");
                    testResult.info("message ID: " + messageID);
                    if (messageID.length() < 1)
                        result = ("Success: false");
                    else {
                        testResult
                                .setAction("Checking Message status of messageID:"
                                        + messageID);
                        result = "";
                        responseText = "DeliveredToNetwork";
                        testResult
                                .info("Starting loop until delivered to terminal or success: fail");
                        while (responseText.contains("DeliveredToNetwork")) {
                            responseText = "";
                            wait.until(ExpectedConditions
                                    .visibilityOfElementLocated(By
                                            .id(btnGetStatus)));
                            // WebElement statusButton =
                            // driver.findElement(By.id(btnGetStatus));
                            Global.scrollIntoView(driver, btnGetStatus);
                            Thread.sleep(1000);
                            driver.findElement(By.id(btnGetStatus)).click();
                            testResult.info("Visibility of success");
                            wait.until(ExpectedConditions
                                    .visibilityOfElementLocated(By
                                            .id("resultsHeader")));
                            result = driver
                                    .findElement(By.className("success"))
                                    .getText();
                            testResult.info(result);
                            testResult.info("Found Result");
                            testResult.setAction("Getting text from Span");
                            WebElement we = driver.findElement(By
                                    .id("serverResponse"));
                            responseText = we.getAttribute("innerText");
                            if (result.contains("Success: true")) {
                                testResult.info("Status: " + result);
                                break;
                            } else if (result.contains("Success: false")) {
                                testResult.info("Received Success: false");
                                break;
                            }

                        }
                    }
                }
                testResult.complete(result.contains("Success: true"));

            } catch (Exception e) {
                testResult.error(e.getMessage());
            }
        } finally {
            driver.quit();
        }
        return testResult;
    }

    public TestResult ExecuteGetSMS(String btnSendMessage, String btnGetMessage, String btnDone) {
        Global global = new Global();
        String url = global.serverPrefix + global.SMS1Ruby;
        TestResult testResult = new TestResult("Test Get Pending SMS Messages",
                url);
        System.setProperty("webdriver.chrome.driver", global.webDriverDir);
        WebDriver driver = new ChromeDriver();
        try {
            WebDriverWait wait = new WebDriverWait(driver, 10);

            // navigate to the sample page
            driver.get(url);

            // Check for page Load
            testResult.setAction("Waiting for page to load");

            // wait for the send button because its near the top of the page
            wait.until(ExpectedConditions.visibilityOfElementLocated(By
                    .id(btnSendMessage)));
            
            // get the 'get messages' button on-screen
            Global.scrollIntoView(driver, btnGetMessage);

            // make sure the 'get messages' button is clickable
            wait.until(ExpectedConditions.visibilityOfElementLocated(By
                    .id(btnGetMessage)));

            // Click button after 500ms timeout
            testResult.setAction("Click Get Messages button: " + btnGetMessage);
            Thread.sleep(500);
            Global.scrollIntoView(driver, btnGetMessage);
            driver.findElement(By.id(btnGetMessage)).click();

            // wait for response
            testResult.setAction("Get Response");
            wait.until(ExpectedConditions.visibilityOfElementLocated(By
                    .id("resultsHeader")));
            testResult.info(driver.findElement(By.id("serverResponse")).getAttribute("innerText"));
            String result = driver.findElement(By.id("resultsHeader")).getText();
            testResult.info(result);

            // TestResult Complete
            testResult.complete(result.contains("Success: true"));

        } catch (Exception e) {
            testResult.error(e.getMessage());
            testResult.error(e.getStackTrace().toString());
        } finally {
            driver.quit();
        }
        return testResult;
    }
}