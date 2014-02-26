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

public class MMSApp1positive {
	/**
	 * This test is a single run for MMS which selects a file from the server
	 * @param phoneNumber
	 * AT&T phonenumber to send the MMS to
	 * 
	 * @param txtElementPhoneName
	 * Element name for the Phonenumber input
	 * 
	 * @param message
	 * Message you would like to include with the MMS
	 * 
	 * @param txtElementMessageName
	 * Element name for the Message input
	 *  
	 * @param btnSubmit
	 * Submit button ID
	 * 
	 * @param btnDone
	 * Response Close Button ID
	 * 
	 * @param statusElementName
	 * MMS Status ID Element Name
	 * 
	 * @param btnGetStatus
	 * Status Button ID
	 * 
	 * @return
	 * @throws InterruptedException
	 * @throws IOException
	 */
	public TestResult Execute(String phoneNumber, String txtElementPhoneName, String message, String txtElementMessageName, String btnSubmit, String btnDone, String statusElementName, String btnGetStatus) throws InterruptedException, IOException
	{
		
		//Logger log = Log.getLogger();
		Global global = new Global();
		String url = global.MMS1Ruby;
		TestResult testResult = new TestResult("MMS App1 Positive - Select image from Server", url);
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
				
				// Modify MMS Message
				testResult.setAction("Modify Message");
				testResult.info("Inputing message into: " + txtElementMessageName);
				ta = driver.findElement(By.name(txtElementMessageName));
				ta.clear();
				ta.sendKeys(message);
				
				// Submit MMS request
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
					result = "";
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

						wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(btnGetStatus)));
						//WebElement statusButton = driver.findElement(By.id(btnGetStatus));
						Global.scrollIntoView(driver, btnGetStatus);
						driver.findElement(By.id(btnGetStatus)).click();
						testResult.info("Visibility of success");
						wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("resultsHeader")));
						result = driver.findElement(By.className("success")).getText();

						testResult.info("Found Result: " + result);
						
						if(result.contains("Success: true"))
							testResult.info("Status: Delivered To Network/Terminal");
						
						else
							testResult.info("Status: Failed to Deliver message");
						
						testResult.setAction("Wait for Done");
						wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(btnDone)));
						testResult.setAction("Click Done: Close result window");
						driver.findElement(By.id(btnDone)).click();
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
	
	/**
	 * This test is a single run for MMS which selects a local file as an attachment
	 * @param phoneNumber
	 * AT&T phone number to send the MMS to
	 * 
	 * @param txtElementPhoneName
	 * Element name for the Phone number input
	 * 
	 * @param message
	 * Message you would like to include with the MMS
	 * 
	 * @param txtElementMessageName
	 * Element name for the Message input
	 *  
	 * @param btnSubmit
	 * Submit button ID
	 * 
	 * @param btnDone
	 * Response Close Button ID
	 * 
	 * @param statusElementName
	 * MMS Status ID Element Name
	 * 
	 * @param btnGetStatus
	 * Status Button ID
	 * 
	 * @return
	 * @throws InterruptedException
	 * @throws IOException
	 */
	public TestResult ExecuteUploadTest(String phoneNumber, String txtElementPhoneName, String message, String txtElementMessageName, String btnSubmit, String btnDone, String statusElementName, String btnGetStatus) throws InterruptedException, IOException
	{
		
		//Logger log = Log.getLogger();
		Global global = new Global();
		String url = global.MMS1Ruby;
		TestResult testResult = new TestResult("MMS App1 Positive - Upload local file to MMS", url);
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
				
				// Modify MMS Message
				testResult.setAction("Modify Message");
				testResult.info("Inputing message into: " + txtElementMessageName);
				ta = driver.findElement(By.name(txtElementMessageName));
				ta.clear();
				ta.sendKeys(message);
				
				//Upload Image
				
				testResult.setAction("Locate Attachment fields");
				driver.findElement(By.id("uploadAttachment")).click();
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("f1")));
				Thread.sleep(500);
				WebElement fileSelect = driver.findElement(By.name("f1"));
				testResult.setAction("Locate Image(s) for upload"); 
				File file = new File(MMSApp1positive.class.getProtectionDomain().getCodeSource().getLocation().getPath());
				file = new File(file.getPath(),"\\images\\image1.jpg");
				testResult.info(file.getPath());
				testResult.info("Populate attachment field with image");
				Global.scrollIntoView(driver, "ext-fileinput-1");
				fileSelect.sendKeys(file.getPath());
				
				// Submit MMS request
				testResult.setAction("Click " + btnSubmit);
				Global.scrollIntoView(driver, btnSubmit);
				driver.findElement(By.id(btnSubmit)).click();
				
				testResult.setAction("Visibility of success");
				waitLonger.until(ExpectedConditions.visibilityOfElementLocated(By.id("resultsHeader")));
				
				testResult.setAction("Find success text");
				String result = driver.findElement(By.className("success")).getText();
				testResult.info(result);
				testResult.setAction("Wait for Done");
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(btnDone)));
				testResult.setAction("Click Done: Close result window");
				driver.findElement(By.id(btnDone)).click();
				
				if(result.contains("Success: true"))
				{
					result = "";
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

						wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(btnGetStatus)));
						//WebElement statusButton = driver.findElement(By.id(btnGetStatus));
						Global.scrollIntoView(driver, btnGetStatus);
						driver.findElement(By.id(btnGetStatus)).click();
						testResult.info("Visibility of success");
						wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("resultsHeader")));
						result = driver.findElement(By.className("success")).getText();

						testResult.info("Found Result: " + result);
						
						if(result.contains("Success: true"))
							testResult.info("Status: Delivered To Network/Terminal");
						
						else
							testResult.info("Status: Failed to Deliver message");
						
						testResult.setAction("Wait for Done");
						wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(btnDone)));
						testResult.setAction("Click Done: Close result window");
						driver.findElement(By.id(btnDone)).click();
					}
				}
				testResult.complete(result.contains("Success: true"));
				
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
