package com.att.html5sdk;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class DCApp1 {

	public TestResult Execute(String logFile)
	{
		//Logger log = Log.getLogger();
		Global global = new Global();
		String url = global.MMS1Ruby;
		TestResult testResult = new TestResult("Device Capabilities App1", url, logFile);
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
				testResult.setAction("Wait for Page Load");
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("btnCapabilitiesShow")));
				
				testResult.info("Getting Device Capabilities");
				
				testResult.setAction("Find success text");
				String result = driver.findElement(By.className("success")).getText();
				testResult.info(result);
				
				testResult.complete(!result.contains("Success: false"));
				
			}
			catch (Exception e){
				testResult.error(e.getMessage());
			}
		}
		
		finally{
			driver.quit();
		}
		return testResult;
	}
}

