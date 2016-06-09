package com.att.html5sdk;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.sql.Timestamp;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

/**
 * @class Global Variables and methods used throughout the testing framework
 */
public class Global {

    public static String phoneNumber = "4252832032";
    public String serverPrefix = App.server_url.isEmpty() ? "http://localhost:4567"
            : App.getURL();
    public String impPhone = "123456789";
    public String webDriverDir;
    public String authFlowUser = "prodDanny99";
    public String authFlowPass = "welcome1";
    public String message = "Sample Apps tests from Selenium";
    public String subject = "IMMN Send Message from Selenium";

    // MIM
    public String index = "I:200:,u:13:,S:417:, r:11000:,";
    public String authFlowUserWorkaround = "ph4258028620@gmail.com";
    public String partNum = "0";
    public String invHeader = "ABC";

    public String helloJpg = "C:\\SDK\\ErikFramework\\hello.jpg";
    public String audioFile = "C:\\SDK\\ErikFramework\\RESTful\\RESTfulSampleApps\\sampleApp\\resource\\Starbucks.amr";

    public String mp3Url = "http://bfsdktest.net63.net/CMS/music.mp3";
    public String headerCount = "5";
    public String indexCursor = "I:200:,u:13:,S:417:, r:11000:,";
    public String impHeaderCount = "-1";
    public String impIndexCursor = "abc123";

    public Global() {
        try {
            webDriverDir = URLDecoder.decode(
                    this.getClass().getResource("/chromedriver.exe").getPath(),
                    "UTF-8");
        } catch (UnsupportedEncodingException e) {
        }
    }

    /**
     * Add scroll into view
     */
    public static void scrollIntoView(WebDriver driver, String elementId) {
        ((JavascriptExecutor) driver).executeScript("document.getElementById('"
                + elementId + "').scrollIntoView(true);");

    }

    /**
     * @method AuthFlow authorization flow automation
     */
    public void AuthFlow(WebDriver driver, String url)
            throws InterruptedException {
        driver.findElement(By.linkText("Sign In to another account")).click();
        driver.findElement(By.name("login[username]")).sendKeys(authFlowUser);
        driver.findElement(By.name("login[password]")).sendKeys(authFlowPass);
        driver.findElement(By.linkText("Allow")).click();

        if (url.contains("IMMN")) {
            driver.findElement(By.linkText("Close window")).click();
        }
        Thread.sleep(5000);
    }

    /**
     * @method MimAuthFlow MIM workaround authorization flow automation
     */
    public void MimAuthFlow(WebDriver driver, String url) {
        driver.findElement(By.linkText("Sign In to another account")).click();
        driver.findElement(By.name("login[username]")).sendKeys(
                "ph4258028620@gmail.com");
        driver.findElement(By.name("login[password]")).sendKeys("welcome1");
        driver.findElement(By.linkText("Allow")).click();

        driver.findElement(By.linkText("Close window")).click();
    }

    //
    // DO NOT USE ANYTHING BELOW THIS POINT IN NEW CODE
    //
    // This code is kept so legacy code will continue to compile
    // until it has all been converted to use the logging above,
    // at which point the code below can be removed.
    //

    // / Create File /////
    Date date = new Date();

    public void CreateFile(String tempVar) throws InterruptedException,
            IOException {
        try {
            FileWriter fw = new FileWriter("html5sdk.log", true);
            BufferedWriter out = new BufferedWriter(fw);
            out.append(new Timestamp(date.getTime()) + ": " + tempVar);
            out.close();
        } catch (Exception e) {
            System.err.print("Error " + e.getMessage());
        }
    }

    // //////EndPoints///////////////////

    // DC
    public String DC1Ruby = "/DC/App1/index.html";
    // IMMN
    public String IMMN1Ruby = "/IMMN/App1/index.html";
    public String IMMN3Ruby = "/IMMN/App3/index.html";
    // MIM
    public String MIM1Ruby = "/MIM/App1/index.html";
    // MMS1
    public String MMS1Ruby = "/MMS/App1/index.html";
    // SMS1
    public String SMS1Ruby = "/SMS/App1/index.html";
    // SMS2
    public String SMS2Ruby = "/SMS/App2/index.html";

    // displaying response to console
    public boolean ResponseDisplay(String url, WebDriver driver)
            throws IOException {
        Log log = new Log();
        List<WebElement> responses;
        Iterator<WebElement> it;
        WebElement we;
        boolean response = false;

        if (url.contains("PHP-RESTful/IMMN")) {
        }
        if (url.contains("PHP-RESTful/SMS")
                || (url.contains("PHP-RESTful/MMS/app1"))) {
        }

        if (url.contains("SMS/app2")) {
        }

        if (url.contains("Csharp") || url.contains("Vb")) {
            responses = driver.findElements(By.xpath("//td/../.."));
            it = responses.iterator();
            while (it.hasNext()) {
                we = it.next();
                if (we.getText().contains("ERROR:")) {
                    response = false;
                    log.InnerWrite(we.getText());
                    log.InnerWrite("");
                }
                if (we.getText().contains("SUCCESS:")) {
                    response = true;
                    log.InnerWrite(we.getText());
                    log.InnerWrite("");
                }
            }
        } else if (!url.contains("Csharp") || !url.contains("Vb")) {
            responses = driver.findElements(By.tagName("strong"));
            try {
                for (int i = 0; i < responses.size(); i++) {
                    if (responses.get(i).getText().toUpperCase()
                            .contains("ERROR")) {
                        response = false;
                        if (driver.findElement(
                                By.xpath("//div[@class='errorWide']"))
                                .isDisplayed()) {
                            log.InnerWrite(driver.findElement(
                                    By.xpath("//div[@class='errorWide']"))
                                    .getText());
                            log.InnerWrite("\n");
                        }
                    }
                    if (responses.get(i).getText().toUpperCase()
                            .contains("SUCCESS")) {
                        response = true;
                        if (driver.findElement(
                                By.xpath("//div[@class='successWide']"))
                                .isDisplayed()) {
                            log.InnerWrite(driver.findElement(
                                    By.xpath("//div[@class='successWide']"))
                                    .getText());
                            log.InnerWrite("\n");
                        }
                    }
                }
            } catch (NoSuchElementException e) {
                System.out.println(e);
            }
        }
        return response;
    }

    public void Log(String input) {
    }
}