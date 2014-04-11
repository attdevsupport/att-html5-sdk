package com.att.html5sdk;

import java.awt.AWTException;
import java.io.IOException;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.ElementNotVisibleException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class PaymentApp3 extends PaymentAppBase {

    private TestResult testResult;
    private String appPath = "/Payment/App3/index.html";
    private String buyButtonId = "btnSubscriptionCreate";
    private String radioButtonSelector = "div.x-field-radio";
    private String subStatusId = "btnSubscriptionStatusGet";
    private String refundButtonId = "btnSubscriptionRefund";
    private String cancelButtonId = "btnSubscriptionCancel";

    public TestResult Execute(String logFile) throws InterruptedException,
            AWTException, IOException {

        String url = global.serverPrefix + appPath;

        testResult = new TestResult("Payment App3 (Subscription)", url,
                logFile);

        try {
            // navigate to the sample page
            driver.get(url);

            try {
                submitSubscriptionRequest();
                getSubscriptionStatus();
                cancelSubscription();
                
                submitSubscriptionRequest();
                getSubscriptionStatus();
                String result = refundSubscription();
                
                testResult.complete(result.contains("Success: true"));
            } catch (Exception e) {
                testResult.error(e.getMessage());
            }
        } finally {
            driver.quit();
        }
        return testResult;
    }

    private String submitSubscriptionRequest() {

        testResult.setAction("Click " + buyButtonId);
        waitLonger.until(
                ExpectedConditions.elementToBeClickable(By.id(buyButtonId)))
                .click();

        authorizePayment(testResult);
        return dismissResults(testResult);
    }

    private String getSubscriptionStatus() {

        testResult.setAction("Find 'Auth Code' radio button");
        WebElement authCodeButton = null;
        List<WebElement> radioButtons = driver.findElements(By
                .cssSelector(radioButtonSelector));
        for (WebElement radio : radioButtons) {
            if (radio.getText().equals("Auth Code")) {
                authCodeButton = radio;
                break;
            }
        }
        if (authCodeButton == null) {
            throw new ElementNotVisibleException("Auth Code radio button");
        }

        testResult.setAction("Click 'Auth Code' radio button");
        authCodeButton.click();

        testResult.setAction("Click " + subStatusId);
        Global.scrollIntoView(driver, subStatusId);
        driver.findElement(By.id(subStatusId)).click();

        return dismissResults(testResult);
    }

    private String cancelSubscription() {
        return undoSubscription(cancelButtonId);
    }
    
    private String refundSubscription() {
        return undoSubscription(refundButtonId);
    }
    
    private String undoSubscription(String undoButtonId) {

        testResult.setAction("Select first transaction in the list");
        Global.scrollIntoView(driver, "ext-dataview-1");
        List<WebElement> transactions = driver.findElements(By
                .cssSelector("div.tx-row"));
        if (transactions.isEmpty()) {
            throw new ElementNotVisibleException("transaction table entry");
        }
        transactions.get(0).click();

        testResult.setAction("Click " + undoButtonId);
        Global.scrollIntoView(driver, undoButtonId);
        driver.findElement(By.id(undoButtonId)).click();

        return dismissResults(testResult);
    }
}
