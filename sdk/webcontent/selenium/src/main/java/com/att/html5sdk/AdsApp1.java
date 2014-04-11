package com.att.html5sdk;

import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class AdsApp1 {
	public TestResult Execute(String phoneNumber, String txtElementPhoneName, String message, String txtElementMessageName, String btnSubmit, String btnDone, String statusElementName, String btnGetStatus, String logFile) throws InterruptedException, IOException
	{
	//Logger log = Log.getLogger();
		Global global = new Global();
		String url = global.MMS1Ruby;
		TestResult testResult = new TestResult("MMS App1 Positive - Select image from Server", url, logFile);
		// start and connect to the Chrome browser
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		//driver.manage().timeouts().pageLoadTimeout(10,TimeUnit.SECONDS);

		try {
			WebDriverWait wait = new WebDriverWait(driver, 10);
			
			// navigate to the sample page
			driver.get(url);
			try {
				//Wait for visibility
				testResult.setAction("Find textbox");
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("picker")));
				
				
			}
			catch (Exception e){
				testResult.error(e.getMessage());
			}
		}
		finally {
			driver.quit();
		}
		return testResult;
	}
}
