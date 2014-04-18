package com.att.html5sdk;

import java.awt.AWTException;
import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PaymentApp1 {

    private String appPath = "/Payment/App1/index.html";
    private String submit = "btnPayloadSign";
    private String done = "ext-button-1";
    
    public TestResult Execute(String logFile) throws InterruptedException, AWTException, IOException
    {
        Global global = new Global();
        String url = global.serverPrefix + appPath;

        TestResult testResult = new TestResult("Payment App1 (Notary)", url,
                logFile);

        // start and connect to the Chrome browser
        System.setProperty("webdriver.chrome.driver", global.webDriverDir);
        WebDriver driver = new ChromeDriver();

        try {

            WebDriverWait wait = new WebDriverWait(driver, 30);
            WebDriverWait waitLonger = new WebDriverWait(driver, 60);

            // navigate to the sample page
            driver.get(url);
            try {
                // Submit notary request
                testResult.setAction("Click " + submit);
                wait.until(
                        ExpectedConditions.elementToBeClickable(By.id(submit)))
                        .click();

                testResult.setAction("Visibility of success");
                wait.until(ExpectedConditions.visibilityOfElementLocated(By
                        .className("success")));

                testResult.setAction("Find success text");
                String result = driver.findElement(By.className("success"))
                        .getText();
                testResult.info(result);

                testResult.setAction("Wait for Done");
                waitLonger.until(
                        ExpectedConditions.elementToBeClickable(By.id(done)))
                        .click();

                testResult.complete(result.contains("Success: true"));

            } catch (Exception e) {
                testResult.error(e.getMessage());
            }
        } finally {
            driver.quit();
        }
        return testResult;
    }
}
