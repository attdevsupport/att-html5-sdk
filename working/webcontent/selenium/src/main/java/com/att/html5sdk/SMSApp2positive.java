package com.att.html5sdk;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class SMSApp2positive {

	public TestResult Execute(String btnDisplayVotes, String btnDone, String logFile)
	{
		Global global = new Global();
		TestResult testResult = new TestResult("Display/Refresh Votes",global.SMS2Ruby,logFile);
		// start and connect to the Chrome browser
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		
		try{
			WebDriverWait wait = new WebDriverWait(driver, 10);
			
			testResult.setAction("Waiting for Vote Refresh button to become visible");
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(btnDisplayVotes)));
			
			testResult.setAction("Click Vote Refresh button");
			driver.findElement(By.id(btnDisplayVotes)).click();
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("resultsHeader")));
			
			testResult.setAction("Find success text");
			String result = driver.findElement(By.className("success")).getText();
			testResult.info(result);
				
			testResult.complete(result.contains("Success:true"));
		}
		catch (Exception e){
			testResult.error(e.getMessage());
		}
		finally {
			driver.quit();
		}
		return testResult;
	}
}
