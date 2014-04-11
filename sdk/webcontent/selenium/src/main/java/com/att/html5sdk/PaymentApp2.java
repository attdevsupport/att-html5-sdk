package com.att.html5sdk;

import java.awt.AWTException;
import java.io.IOException;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.ElementNotVisibleException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class PaymentApp2 extends PaymentAppBase {

    private String appPath = "/Payment/App2/index.html";
    private String buyButtonId = "btnProductBuy";
    private String radioButtonSelector = "div.x-field-radio";
    private String txStatusId = "btnTransactionStatusGet";
    private String refundButtonId = "btnTransactionRefund";

    public TestResult Execute(String logFile) throws InterruptedException,
            AWTException, IOException {

        String url = global.serverPrefix + appPath;

        TestResult testResult = new TestResult("Payment App2 (Single Payment)",
                url, logFile);

        try {
            // navigate to the sample page
            driver.get(url);

            try {
                submitPurchaseRequest(testResult);
                getPurchaseStatus(testResult);
                String result = refundPayment(testResult);
                testResult.complete(result.contains("Success: true"));
            } catch (Exception e) {
                testResult.error(e.getMessage());
            }
        } finally {
             driver.quit();
        }
        return testResult;
    }

    private String submitPurchaseRequest(TestResult testResult) {

        testResult.setAction("Click " + buyButtonId);
        waitLonger.until(
                ExpectedConditions.elementToBeClickable(By.id(buyButtonId)))
                .click();

        authorizePayment(testResult);
        return dismissResults(testResult);
    }
    
    private String getPurchaseStatus(TestResult testResult) {
        
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

        testResult.setAction("Click " + txStatusId);
        driver.findElement(By.id(txStatusId)).click();

        return dismissResults(testResult);
    }
    
    private String refundPayment(TestResult testResult) {
        
        testResult.setAction("Select first transaction in the list");
        Global.scrollIntoView(driver, "ext-dataview-1");
        List<WebElement> transactions = driver.findElements(By
                .cssSelector("div.tx-row"));
        if (transactions.isEmpty()) {
            throw new ElementNotVisibleException("transaction table entry");
        }
        transactions.get(0).click();

        testResult.setAction("Click " + refundButtonId);
        Global.scrollIntoView(driver, refundButtonId);
        driver.findElement(By.id(refundButtonId)).click();

        return dismissResults(testResult);
    }
}
