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

public class MMSApp1negative {

	/**
	 * @param args
	 * @throws IOException 
	 */
	//
	public void Execute(String url, String msisdn, String sendMsgBtn, String messageId) throws InterruptedException, IOException{
		
		sampleApps.Global global = new sampleApps.Global();
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		driver.get(url);
		WebDriverWait wait = new WebDriverWait(driver,10);
		
		global.CreateFile(url);
		try{
		//Send MMS with invalid msisdn
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(msisdn))).sendKeys(global.impPhone);
		wait.until(ExpectedConditions.elementToBeClickable(By.id(sendMsgBtn))).click();
		
		Thread.sleep(5000);
		if (driver.findElement(By.id("ext-element-83")).getText().contains("Phone number is not valid"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		 
		if (url.contains("Java-SDK/MMS"))
	    	 global.CreateFile("*****: MMS1 JAVA Send Message negative flow  : " + "\r\n" + driver.findElement(By.id("ext-element-83")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/MMS"))
	    	global.CreateFile("*****: MMS1 RUBY Send Message negative flow : " + "\r\n" + driver.findElement(By.id("ext-element-83")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("*****: MMS1 PHP Send Message negative flow : " + "\r\n" + driver.findElement(By.id("ext-element-83")).getText() + "\r\n\r\n");  
		
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-3"))).click();
		
		// Get Status with invalid Message id: 
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(messageId))).sendKeys(global.impPhone);
		Thread.sleep(1000);
		
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-2"))).click();
		
		Thread.sleep(6000);
		if (driver.findElement(By.id("ext-element-99")).getText().contains("Success: false"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/MMS"))
	    	 global.CreateFile("*****: MMS1 JAVA Get Status negative flow  : " + "\r\n" + driver.findElement(By.id("ext-element-99")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/MMS"))
	    	 global.CreateFile("*****: MMS1 RUBY Get Status negative flow : " + "\r\n" + driver.findElement(By.id("ext-element-99")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("*****: MMS1 PHP Get Status negative flow: " + "\r\n" + driver.findElement(By.id("ext-element-99")).getText() + "\r\n\r\n");   
		
		
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-4"))).click();
		}
	    catch (NoSuchElementException e){
			System.out.println(e);
	    }	
		driver.quit();
	}
}