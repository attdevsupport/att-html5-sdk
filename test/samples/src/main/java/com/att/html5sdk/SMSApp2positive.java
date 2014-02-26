package com.att.html5sdk;

public class SMSApp2positive {

	public TestResult Execute(String btnDisplayVotes, String btnDone)
	{
		Global global = new Global();
		TestResult testResult = new TestResult("Display/Refresh Votes",global.SMS2Ruby);
		// start and connect to the Chrome browser
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		
		try{
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
			return testResult;
		}
	}
}
