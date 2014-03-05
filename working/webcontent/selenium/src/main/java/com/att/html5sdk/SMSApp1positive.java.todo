package sampleApp.SMSApp1;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class SMSApp1positive {

	/**
	 * @param args
	 * @throws IOException 
	 */
	//SMS
	public void Execute(String url, String msisdn, String sendMsgBtn, String done, String getStatusBtn, String done1, String getMessageForShortcode1, String done2, String getMessageForShortcode2) throws InterruptedException, IOException{
		
		sampleApps.Global global = new sampleApps.Global();
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		driver.get(url);
		WebDriverWait wait = new WebDriverWait(driver,10);
		
		global.CreateFile(url);
		try{
		//Send SMS
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(msisdn))).sendKeys(global.phoneNumber);
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id(sendMsgBtn))).click();
		
		// For "Message: Please enter a Message ID error"	
		if (driver.findElements(By.id("ext-sheet-1")).size() != 0)
			global.CreateFile("\r\n" + "FAILED" + "\r\n" + driver.findElement(By.id("ext-sheet-1")).getText() + "\r\n\r\n");
								
		else{
		
		
		Thread.sleep(5000);
		
		if (driver.findElement(By.id("ext-element-73")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/SMS/App1"))
	    	 global.CreateFile("***** SMS1 JAVA Send Message : " + "\r\n" + driver.findElement(By.id("ext-element-73")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/SMS/App1"))
	    	 global.CreateFile("***** SMS1 RUBY Send Message: " + "\r\n" + driver.findElement(By.id("ext-element-73")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** SMS1 PHP Send Message: " + "\r\n" + driver.findElement(By.id("ext-element-73")).getText() + "\r\n\r\n");
		
		Thread.sleep(3000);
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(done))).click();

		// Get Status
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id(getStatusBtn))).click();
		
		Thread.sleep(2000);
		if (driver.findElement(By.id("ext-element-73")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/SMS/App1"))
	    	 global.CreateFile("***** SMS1 JAVA Get Status : " + "\r\n" + driver.findElement(By.id("ext-element-73")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/SMS/App1"))
	    	 global.CreateFile("***** SMS1 RUBY Get Status: " + "\r\n" + driver.findElement(By.id("ext-element-73")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** SMS1 PHP Get Status: " + "\r\n" + driver.findElement(By.id("ext-element-73")).getText() + "\r\n\r\n");  
		
		Thread.sleep(3000);
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(done1))).click();
		Thread.sleep(500);
	
		// Get Messages for Short Code#1
		Thread.sleep(5000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id(getMessageForShortcode1))).click();

		Thread.sleep(2000);
		if (driver.findElement(By.id("ext-element-73")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/SMS/App1"))
	    	 global.CreateFile("***** SMS1 JAVA Get Messages for ShortCode #1 : " + "\r\n" + driver.findElement(By.id("ext-element-73")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/SMS/App1"))
	    	 global.CreateFile("***** SMS1 RUBY Get Messages for ShortCode #1: " + "\r\n" + driver.findElement(By.id("ext-element-73")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** SMS1 PHP Get Messages for ShortCode #1: " + "\r\n" + driver.findElement(By.id("ext-element-73")).getText() + "\r\n\r\n"); 
		
		Thread.sleep(5000);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(done2))).click();
		
		// Get Messages for Short Code#2
		Thread.sleep(3000);
	
		wait.until(ExpectedConditions.elementToBeClickable(By.id(getMessageForShortcode2))).click();
	
		Thread.sleep(2000);
		if (driver.findElement(By.id("ext-element-73")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/SMS/App1"))
	    	 global.CreateFile("***** SMS1 JAVA Get Messages for ShortCode #2 : " + "\r\n" + driver.findElement(By.id("ext-element-73")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/SMS/App1"))
	    	 global.CreateFile("***** SMS1 RUBY Get Messages for ShortCode #2: " + "\r\n" + driver.findElement(By.id("ext-element-73")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** SMS1 PHP Get Messages for ShortCode #2: " + "\r\n" + driver.findElement(By.id("ext-element-73")).getText() + "\r\n\r\n"); 
		
		Thread.sleep(5000);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(done2))).click();
		}}
	    catch (NoSuchElementException e){
			System.out.println(e);
	    
		}
		driver.quit();

	}
	

}
