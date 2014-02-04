package sampleApp.SMSApp2;

import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class SMSApp2positive {

	/**
	 * @param args
	 * @throws IOException 
	 */
	//SMS App2
	public void Execute(String url, String voteTotals, String done) throws InterruptedException, IOException{
		
		sampleApps.Global global = new sampleApps.Global();
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		driver.get(url);
		WebDriverWait wait = new WebDriverWait (driver,10);
		
		global.CreateFile(url);
		try{
		// SMS Voting		
		wait.until(ExpectedConditions.elementToBeClickable(By.id(voteTotals))).click();
	
		Thread.sleep(1000);
		if (driver.findElement(By.id("ext-element-54")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/SMS/App2"))
	    	 global.CreateFile("SMS2 JAVA Display/Refresh Vote Totals : " + "\r\n" + driver.findElement(By.id("ext-element-54")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/SMS/App2"))
	    	 global.CreateFile("SMS2 RUBY Display/Refresh Vote Totals : " + "\r\n" + driver.findElement(By.id("ext-element-54")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("SMS2 PHP Display/Refresh Vote Totals : " + "\r\n" + driver.findElement(By.id("ext-element-54")).getText() + "\r\n\r\n");    
		
		
		Thread.sleep(500);
		
		wait.until(ExpectedConditions.elementToBeClickable(By.id(done))).click();
		}
	    catch (NoSuchElementException e){
			System.out.println(e);
	    }
		driver.quit();

	}
	

}
