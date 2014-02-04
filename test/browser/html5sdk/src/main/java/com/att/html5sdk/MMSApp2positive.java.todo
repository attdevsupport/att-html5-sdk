package sampleApp.MMSApp2;

import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class MMSApp2positive {

	/**
	 * @param args
	 * @throws IOException 
	 */
	
	public void Execute(String url, String sendCouponBtn, String done, String checkStatusBtn, String done1) throws InterruptedException, IOException{
		
		sampleApps.Global global = new sampleApps.Global();
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		driver.get(url);
		WebDriverWait wait = new WebDriverWait(driver,10);
		
		global.CreateFile(url);
		try{
		// Send Coupon
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id(sendCouponBtn))).click();
		
		Thread.sleep(7000);
		if (driver.findElement(By.id("ext-element-77")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/MMS"))
	    	 global.CreateFile("***** MMS2 JAVA Send Coupon : " + "\r\n" + driver.findElement(By.id("ext-element-77")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/MMS"))
	    	 global.CreateFile("***** MMS2 RUBY Send Coupon: " + "\r\n" + driver.findElement(By.id("ext-element-77")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** MMS2 PHP Send Coupon: " + "\r\n" + driver.findElement(By.id("ext-element-77")).getText() + "\r\n\r\n"); 
		
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id(done))).click();
		
		
		
		// Check Status	
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id(checkStatusBtn))).click();
		Thread.sleep(5000);
		
		if (driver.findElement(By.id("ext-element-77")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n"); 
	
		if (url.contains("Java-SDK/MMS"))
	    	 global.CreateFile("***** MMS2 JAVA Check Status : " + "\r\n" + driver.findElement(By.id("ext-element-77")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/MMS"))
	    	 global.CreateFile("***** MMS2 RUBY Check Status: " + "\r\n" + driver.findElement(By.id("ext-element-77")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** MMS2 PHP Check Status: " + "\r\n" + driver.findElement(By.id("ext-element-77")).getText() + "\r\n\r\n"); 
		
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id(done1))).click();
		}
	    catch (NoSuchElementException e){
			System.out.println(e);
	    }
		driver.quit();
}
	   
	
}