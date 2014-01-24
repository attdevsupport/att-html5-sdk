package sampleApp.SMSApp1;

import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class SMSApp1negative {

	/**
	 * @param args
	 * @throws IOException 
	 */
	public void Execute(String url, String msisdn, String sendMsgBtn, String messageId) throws InterruptedException, IOException{
		
		sampleApps.Global global = new sampleApps.Global();
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		driver.get(url);
		WebDriverWait wait = new WebDriverWait(driver,10);
		
		global.CreateFile(url);
		try{
		//Send SMS with invalid msisdn
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(msisdn))).sendKeys(global.impPhone);
		wait.until(ExpectedConditions.elementToBeClickable(By.id(sendMsgBtn))).click();
		
		Thread.sleep(3000);
		if (driver.findElement(By.id("ext-element-65")).getText().contains("Phone number is not valid"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		
		
		if (url.contains("Java-SDK/SMS/App1"))
	    	 global.CreateFile("***** SMS1 JAVA Send Message negative flow  : " + "\r\n" + driver.findElement(By.id("ext-element-65")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/SMS/App1"))
	    	 global.CreateFile("***** SMS1 RUBY Send Message negative flow  : " + "\r\n" + driver.findElement(By.id("ext-element-65")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** SMS1 PHP Send Message negative flow : " + "\r\n" + driver.findElement(By.id("ext-element-65")).getText() + "\r\n\r\n");  
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("ext-element-67"))).click();
	
		// Get Status with invalid Message id: 
		Thread.sleep(1000);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(messageId))).sendKeys("adfadfad");
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-element-49"))).click();
		
		Thread.sleep(5000);
		if (driver.findElement(By.id("ext-element-81")).getText().contains("Success: false"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/SMS/App1"))
	    	 global.CreateFile("***** SMS1 JAVA Get Status negative flow : " + "\r\n" + driver.findElement(By.id("ext-element-81")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/SMS/App1"))
	    	 global.CreateFile("***** SMS1 RUBY Get Status negative flow : " + "\r\n" + driver.findElement(By.id("ext-element-81")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** SMS1 PHP Get Status negative flow : " + "\r\n" + driver.findElement(By.id("ext-element-81")).getText() + "\r\n\r\n");  
		
		Thread.sleep(500);
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("ext-button-6"))).click();
		}
	    catch (NoSuchElementException e){
			System.out.println(e);
	    }
		Thread.sleep(1000);
		
		driver.quit();
		
	}
}