package com.att.html5sdk;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class TestMMSRecursive extends MMS_Variables {
    Global global = new Global();
    String url = global.serverPrefix + global.MMS1Ruby;
    String number = Global.phoneNumber;

    /**
     * @method Execute
     */
    public void Execute(ArrayList<TestResult> results, String logFile)
            throws IOException {

        // start and connect to the Chrome browser
        System.setProperty("webdriver.chrome.driver", global.webDriverDir);
        WebDriver driver = new ChromeDriver();

        try {

            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebDriverWait waitLonger = new WebDriverWait(driver, 30);

            for (int i = 0; i < Image_List().size(); i++) {

                // Setting phone number

                String imageName = Image_List().get(i);

                TestResult testResult = new TestResult("MMS: Address(" + number
                        + "), message(This is a test message with the image: "
                        + imageName + ")", url, logFile);

                try {

                    testResult.setAction("Navigate");
                    // navigate to the sample page
                    driver.get(url);
                    waitLonger.until(ExpectedConditions
                            .visibilityOfElementLocated(By.name("address")));
                    testResult.info("setting Address");
                    WebElement address = driver.findElement(By.name("address"));
                    address.clear();
                    address.sendKeys(number);

                    testResult.info("Selecting image " + imageName
                            + " from listbox");
                    // select the desired image from the listbox
                    SelectFromListbox(driver, wait, "attachment", imageName);

                    testResult.info("Send Message");
                    testResult.setAction("Click btnMessageSend");
                    driver.findElement(By.id("btnMessageSend")).click();

                    testResult.setAction("Get Success");
                    wait.until(ExpectedConditions.visibilityOfElementLocated(By
                            .id("serverResponse")));

                    // Get Result and verify delivery attempt
                    String result = driver.findElement(By.id("resultsHeader"))
                            .getText();

                    String DeliveryAttempt = driver.findElement(
                            By.id("serverResponse")).getAttribute("innerText");
                    if (DeliveryAttempt.contains("messageId")) {
                        // Close Response
                        testResult.setAction("Wait for close button");
                        wait.until(ExpectedConditions.elementToBeClickable(By
                                .id("btnCloseResponse")));
                        testResult.setAction("Click close button");
                        driver.findElement(By.id("btnCloseResponse")).click();
                        testResult.info("messageId: " + DeliveryAttempt);
                        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id("btnCloseResponse")));
                        
                        // Wait for visibility of Get Status Button
                        testResult.setAction("Wait for visibility of getStatus button ");
                        global.scrollIntoView(driver, "btnStatusGet");

                        testResult.setAction("Click button: btnStatusGet");
                        driver.findElement(By.id("btnStatusGet")).click();

                        // Wait for server Response
                        testResult
                                .setAction("Wait For Visiblity of ServerResponse");
                        wait.until(ExpectedConditions
                                .visibilityOfElementLocated(By
                                        .id("serverResponse")));
                        result = driver.findElement(By.id("resultsHeader"))
                                .getText();
                        if (result.contains("Success: true"))
                            testResult.complete(true);
                        else
                            testResult.complete(false);
                    } else {
                        testResult.complete(false);
                    }

                } catch (Exception e) {
                    testResult.error(e.getMessage());
                } finally {
                    results.add(testResult);
                }
            }
        } finally {
            driver.quit();
        }
    }

    private void SelectFromListbox(WebDriver driver, WebDriverWait wait,
            String type, String instance) {
        // ExtJS 'covers' the input element with a div, so Selenium won't let us
        // click the input directly.
        // instead we use the selector to get the covering div, and click on
        // that instead.
        wait.until(
                ExpectedConditions.elementToBeClickable(By
                        .cssSelector("input[name=" + type
                                + "] + div.x-field-mask"))).click();

        // wait until the list items in the popup listbox show up
        wait.until(ExpectedConditions.visibilityOfElementLocated(By
                .cssSelector("div.x-list-item")));

        // find the specific listbox item we want, click on it, and wait for it
        // (and
        // presumably the popup listbox as well) to disappear.
        List<WebElement> listitems = driver.findElements(By
                .cssSelector("div.x-list-item"));
        Log.getLogger().debug("instance[" + instance + "]");
        for (WebElement element : listitems) {
            Log.getLogger().debug("text[" + element.getText() + "]");
            if (element.getText().equals(instance)) {
                element.click();
                wait.until(ExpectedConditions.not(ExpectedConditions
                        .visibilityOf(element)));
                break;
            }
        }
    }
}
