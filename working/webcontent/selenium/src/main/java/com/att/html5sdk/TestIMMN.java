package com.att.html5sdk;

import java.io.IOException;
import java.util.ArrayList;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class TestIMMN {
	
	public static void Execute(ArrayList<TestResult> results, String logFile) throws InterruptedException, IOException {
		ArrayList<TestResult> localResults = new ArrayList<TestResult>();
		try{
			//INITIALIZE DRIVERS TEST
			Global global = new Global();
			
			// start and connect to the Chrome browser
			System.setProperty("webdriver.chrome.driver", global.webDriverDir);
			WebDriver driver = new ChromeDriver();
			String url = global.serverPrefix + global.IMMN3Ruby;
			try{
				
				//IMMN1();
				IMMNApp3Positive IMMNApp3 = new IMMNApp3Positive();
				localResults.add(IMMNApp3.Login(driver, logFile));
				//localResults.add(IMMNApp3.Execute("btnCloseResponse", logFile));
				localResults.add(IMMNApp3.GetMessageList(driver, logFile));
				localResults.add(IMMNApp3.DeleteMessage(driver, logFile));
				localResults.add(IMMNApp3.DeleteMessages(driver, logFile));
				localResults.add(IMMNApp3.SendMessage(driver, logFile));
				//localResults.add(IMMNApp3.GetMessageStateAndDelta(driver, logFile));
				
			}
			catch(Exception e)
			{
				System.out.println(e.getMessage());
			}
			finally
			{
				driver.quit();
			}
		}
		finally{
			Integer succeeded = 0;
			Integer i;
			
			Log.getLogger().info("\n\nSummary -------------------------------------------------------------------------\n");
			for (i=0; i < localResults.size(); i++)
			{	
				TestResult item = localResults.get(i);
				if (item.pass) {
					succeeded++;
				}
				results.add(item);
				//item.logShortResults();
			}
			
			Log.getLogger(logFile).info ( "\nSucceeded: " + succeeded + " Failed: " + (localResults.size() - succeeded) + "\n\n");
		}
	}

	/**
	 * @param args
	 * @throws IOException 
	 */
	private static void IMMN1() throws InterruptedException, IOException {
	
	//IMMNApp1.Execute(global.IMMN1Ruby, "ext-element-25", "ext-element-31", "ext-element-35", "ext-element-50", "ext-element-72", "ext-button-1");
	//IMMNApp1.Execute(global.IMMN1Ruby, "ext-element-25", "ext-element-31", "ext-element-35", "ext-element-50", "ext-element-72", "ext-button-1");

	}
}