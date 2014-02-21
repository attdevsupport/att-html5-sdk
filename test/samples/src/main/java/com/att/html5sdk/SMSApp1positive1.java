package com.att.html5sdk;

import java.awt.Desktop;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.apache.logging.log4j.Logger;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class SMSApp1positive1 {
	/**
	 * @method Execute
     * run a simple positive test case for speech to text App1
     *
	 * @param submit
     * The DOM id of the HTML element that submits the sample request
     *
     * @param done
     * The DOM id of the HTML element that dismisses the sample result
	 *
	 * @returns TestResult
	 */
	public TestResult Execute(String phoneNumber, String txtElementPhoneName, String message, String txtElementMessageName, String btnSubmit, String btnDone, String statusElementName, String btnGetStatus) throws InterruptedException, IOException
	{
		
		//Logger log = Log.getLogger();
		Global global = new Global();
		String url = global.SMS1Ruby;
		TestResult testResult = new TestResult("SMS App1 Positive", url);
		String responseText = "";
		// start and connect to the Chrome browser
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		//driver.manage().timeouts().pageLoadTimeout(10,TimeUnit.SECONDS);

		try {
			
			WebDriverWait wait = new WebDriverWait(driver, 10);
			WebDriverWait waitLonger = new WebDriverWait(driver, 30);
			
			// navigate to the sample page
			driver.get(url);
			try {
				//Wait for visibility
				testResult.setAction("Find textbox");
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.name(txtElementPhoneName)));
				
				testResult.info("Inputing Phone number into: " + txtElementPhoneName);
				
				// Enter phone number
				WebElement ta = driver.findElement(By.name(txtElementPhoneName));
				ta.sendKeys(phoneNumber);
				
				// Modify SMS Message
				testResult.setAction("Modify Message");
				testResult.info("Inputing message into: " + txtElementMessageName);
				ta = driver.findElement(By.name(txtElementMessageName));
				ta.clear();
				ta.sendKeys(message);
				
				// Submit SMS request
				testResult.setAction("Click " + btnSubmit);
				Global.scrollIntoView(driver, btnSubmit);
				driver.findElement(By.id(btnSubmit)).click();
				
				testResult.setAction("Visibility of success");
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("resultsHeader")));
				
				testResult.setAction("Find success text");
				String result = driver.findElement(By.className("success")).getText();
				testResult.info(result);
				testResult.setAction("Wait for Done");
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(btnDone)));
				testResult.setAction("Click Done: Close result window");
				driver.findElement(By.id(btnDone)).click();
				if(result.contains("Success: true"))
				{
					final String innerStatus = statusElementName;
					testResult.info("Waiting For MessageID");
					wait.until(ExpectedConditions.visibilityOfElementLocated(By.name(statusElementName)));
					testResult.info("done waiting");
					testResult.setAction("Retrieving Message ID");
					String messageID = driver.findElement(By.name(statusElementName)).getAttribute("value");
					testResult.info("message ID: " + messageID);
					if(messageID.length() < 1)
						result=("Success: false");
					else
					{
						testResult.setAction("Checking Message status of messageID:" + messageID);
						result = "";
						responseText="DeliveredToNetwork";
						testResult.info("Starting loop until delivered to terminal or success: fail");
						while(responseText.contains("DeliveredToNetwork"))
						{
							responseText = "";
							wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(btnGetStatus)));
							//WebElement statusButton = driver.findElement(By.id(btnGetStatus));
							Global.scrollIntoView(driver, btnGetStatus);
							driver.findElement(By.id(btnGetStatus)).click();
							testResult.info("Visibility of success");
							wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("resultsHeader")));
							result = driver.findElement(By.className("success")).getText();
							testResult.info(result);
							testResult.info("Found Result");
							testResult.setAction("Getting text from Span");
							WebElement we = driver.findElement(By.xpath("//div[text()='Server Response:']/span"));
							responseText = we.getAttribute("innerText");
							if(responseText.contains("DeliveredToTerminal"))
							{
								testResult.info("Status: DeliveredToTerminal");
								break;
							}
							else if(responseText.contains("DeliveredToNetwork"))
							{
								testResult.info("Status: DeliveredToNetwork");
								testResult.setAction("Wait for Done");
								wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(btnDone)));
								testResult.setAction("Click Done: Close result window");
								driver.findElement(By.id(btnDone)).click();
							}
							else if(result.contains("Success: false"))
							{
								testResult.info("Received Success: false");
								break;
							}
								
						}
					}
				}
				testResult.complete(!result.contains("Success: false"));
				
			}
			catch (Exception e){
				testResult.error(e.getMessage());
			}
		}
		finally {
			driver.quit();
			return testResult;
		}
	}
}
