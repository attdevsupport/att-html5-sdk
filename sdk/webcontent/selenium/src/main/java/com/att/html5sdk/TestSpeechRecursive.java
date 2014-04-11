package com.att.html5sdk;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;

/**
 * @class TestSpeechRecursive
 * @extends Speech_Variables This class exercises the SpeechToText App1 sample.
 *          In particular, it cycles through combinations of input values in the
 *          UI, and verifies that they work correctly when submitted to the
 *          back-end.
 */
public class TestSpeechRecursive extends Speech_Variables {

    Global global = new Global();
    String url = global.serverPrefix + global.Speech1Ruby;

    /**
     * @method Execute
     */
    public void Execute(ArrayList<TestResult> results, String logFile)
            throws IOException {
        Boolean chunked = true;
        Boolean custom = false;
        int contextIndex = 0;

        // start and connect to the Chrome browser
        System.setProperty("webdriver.chrome.driver", global.webDriverDir);
        WebDriver driver = new ChromeDriver();

        try {

            WebDriverWait wait = new WebDriverWait(driver, 10);
            WebDriverWait waitLonger = new WebDriverWait(driver, 30);

            // iterate through a selection of parameter combinations from the
            // speech to text sample UI
            for (int fileIndex = 0; fileIndex < Audio_File_List().size(); fileIndex++) {

                String contextName = Context_List().get(contextIndex++);
                String audioFileName = Audio_File_List().get(fileIndex);

                chunked = !chunked;
                custom = !custom;

                TestResult testResult = new TestResult(
                        "Speech to Text: context(" + contextName + "), file("
                                + audioFileName + "), chunked("
                                + chunked.toString() + ")", url, logFile);

                try {

                    if (contextIndex >= Context_List().size()) {
                        contextIndex = 0;
                    }

                    testResult.setAction("Navigate");
                    // navigate to the sample page
                    driver.get(url);

                    // select the desired options from the listboxes
                    SelectFromListbox(driver, wait, "context", contextName);
                    SelectFromListbox(driver, wait, "file", audioFileName);

                    if (chunked) {
                        driver.findElement(
                                By.cssSelector("input[name=chunked] + div.x-field-mask"))
                                .click();
                    }
                    if (custom) {
                        driver.findElement(
                                By.cssSelector("input[name=customDictionary] + div.x-field-mask"))
                                .click();
                    }

                    // submit the speech to text request and process the
                    // response
                    testResult.setAction("Click x-button");
                    driver.findElement(By.className("x-button")).click();

                    testResult.setAction("Get Success");
                    waitLonger.until(ExpectedConditions
                            .visibilityOfElementLocated(By
                                    .cssSelector("div.success + div")));

                    String result = driver.findElement(By.id("resultsHeader"))
                            .getText();
                    testResult.complete(result.contains("Success"));

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
