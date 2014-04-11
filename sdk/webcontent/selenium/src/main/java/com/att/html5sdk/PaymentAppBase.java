package com.att.html5sdk;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.By.ByName;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PaymentAppBase {

    protected Global global;
    protected WebDriver driver;
    protected WebDriverWait wait, waitLonger;

    private String authWithPasswordTabSelector = "a[href=\"#tab-userid\"]";
    private String useDifferentNumberSelector = "div.consent_mobile_number > a";
    private String consentFrameName = "authorization-sheet";
    private String usernameInputName = "login";
    private String passwordInputName = "password";
    private String submitInputSelector = "input.att_login";
    private String username = "sdktest1";
    private String password = "Welcome1_";
    private String done = "ext-button-1";

    public PaymentAppBase() {

        global = new Global();

        // start and connect to the Chrome browser
        System.setProperty("webdriver.chrome.driver", global.webDriverDir);
        driver = new ChromeDriver();

        wait = new WebDriverWait(driver, 10);
        waitLonger = new WebDriverWait(driver, 30);
    }

    protected void authorizePayment(TestResult testResult) {

        testResult.setAction("wait for auth page load");
        waitLonger.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(By
                .name(consentFrameName)));

        testResult.setAction("Check for AT&T account");
        List<WebElement> differentNumberButtons = driver.findElements(By
                .cssSelector(useDifferentNumberSelector));
        if (!differentNumberButtons.isEmpty()) {
            testResult.setAction("AT&T account detected; force user selection");
            differentNumberButtons.get(0).clear();
        }

        testResult.setAction("Click on username/password tab");
        waitLonger.until(
                ExpectedConditions.elementToBeClickable(By
                        .cssSelector(authWithPasswordTabSelector))).click();

        testResult.setAction("Enter username");
        wait.until(
                ExpectedConditions.visibilityOfElementLocated(By
                        .name(usernameInputName))).sendKeys(username);

        testResult.setAction("Enter password");
        wait.until(
                ExpectedConditions.visibilityOfElementLocated(By
                        .name(passwordInputName))).sendKeys(password);

        testResult.setAction("Press submit button");
        driver.findElement(By.cssSelector(submitInputSelector)).click();
    }

    protected String dismissSuccess(TestResult testResult) {

        testResult.setAction("Visibility of success");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By
                .className("success")));

        testResult.setAction("Find success text");
        String result = driver.findElement(By.className("success")).getText();
        testResult.info(result);

        testResult.setAction("Wait for Done");
        waitLonger.until(ExpectedConditions.elementToBeClickable(By.id(done)))
                .click();
        
        return result;
    }
}
