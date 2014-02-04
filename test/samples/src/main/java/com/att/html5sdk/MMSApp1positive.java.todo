package sampleApp.MMSApp1;

import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class MMSApp1positive {

	/**
	 * @param args
	 * @throws IOException 
	 */
	//MMS App1
	public void Execute(String url, String msisdn, String sendMessageBtn, String done, String getStatusBtn, String done1) throws InterruptedException, IOException{
		
		sampleApps.Global global = new sampleApps.Global();
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		driver.get(url);
		WebDriverWait wait = new WebDriverWait(driver,10);
		
		global.CreateFile(url);
		try{
		// Send MMS Message
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(msisdn))).sendKeys(global.phoneNumber);
		wait.until(ExpectedConditions.elementToBeClickable(By.id(sendMessageBtn))).click();
		
		Thread.sleep(7000);
		if (driver.findElement(By.id("ext-element-91")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/MMS"))
	    	 global.CreateFile("***** MMS1 JAVA Send Message : "+ "\r\n" + driver.findElement(By.id("ext-element-91")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/MMS"))
	    	 global.CreateFile("***** MMS1 RUBY Send Message: " + "\r\n" + driver.findElement(By.id("ext-element-91")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** MMS1 PHP Send Message: " + "\r\n" + driver.findElement(By.id("ext-element-91")).getText() + "\r\n\r\n");  
		
		
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id(done))).click();
		
		// GetStatus
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id(getStatusBtn))).click();
		
		Thread.sleep(5000);
		if (driver.findElement(By.id("ext-element-91")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/MMS"))
	    	 global.CreateFile("*****: MMS1 JAVA Get Status : " + "\r\n" + driver.findElement(By.id("ext-element-91")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/MMS"))
	    	 global.CreateFile("*****: MMS1 RUBY Get Status: " + "\r\n" + driver.findElement(By.id("ext-element-91")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("*****: MMS1 PHP Get Status: " + "\r\n" + driver.findElement(By.id("ext-element-91")).getText() + "\r\n\r\n");   
		
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id(done1))).click();
		}
	    catch (NoSuchElementException e){
			System.out.println(e);
	    }
		driver.quit();
}
	    

	
}