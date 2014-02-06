package com.att.html5sdk;

import java.awt.Desktop;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import org.apache.logging.log4j.Logger;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * @class SpeechApp1positive
 * run a simple positive test case for speech to text App1
 */
public class SpeechApp1positive {

	/**
   * @method Execute
   * run a simple positive test case for speech to text App1
   *
	 * @param submit
   * The DOM id of the HTML element that submits the sample request
   *
   * @param done
   * The DOM id of the HTML element that dismisses the sample result
	 */
	public static void Execute(String submit, String done) throws InterruptedException, IOException
  {
    Logger log = Log.getLogger();
		Global global = new Global();
    String url = "http://localhost:4567/Speech/App1/index.html";

    // start and connect to the Chrome browser
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();

    try {
      WebDriverWait wait = new WebDriverWait(driver, 10);

      // navigate to the sample page
      driver.get(url);
      log.info(url);

      try {
        // Submit speech request
        wait.until(ExpectedConditions.elementToBeClickable(By.id(submit))).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("success")));
        String result = driver.findElement(By.className("success")).getText();
        log.info(result.contains("Success: true") ? "PASSED" : "FAILED");
        log.info("Speech Submit : " + result);
        wait.until(ExpectedConditions.elementToBeClickable(By.id(done))).click();
      }
      catch (NoSuchElementException e){
        log.error(e.getMessage());
      }
    }
    finally {
      driver.quit();
    }
  }
}
