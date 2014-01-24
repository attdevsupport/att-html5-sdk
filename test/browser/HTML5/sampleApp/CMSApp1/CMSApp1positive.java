package sampleApp.CMSApp1;

import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class CMSApp1positive {

	/**
	 * @param args
	 * @throws IOException 
	 */
	
	public void Execute(String url, String sipOrNumber, String select, String conference, String message, String reject, String transfer, String waitMethod, String numberParameter, String urlToPlay, String createSessionBtn, String done, String select1, String exit, String stopHold, String deQueue, String sendSignalBtn) throws InterruptedException, IOException{
		
		sampleApps.Global global = new sampleApps.Global();
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		driver.get(url);
		WebDriverWait wait = new WebDriverWait(driver,10);
		
		global.CreateFile(url);
		try{
		// Create Session
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(sipOrNumber))).sendKeys(global.phoneNumber);
		
		//To select Methods:
		wait.until(ExpectedConditions.elementToBeClickable(By.id(select))).click();
		
		//Conference Method
		//wait.until(ExpectedConditions.elementToBeClickable(By.id(conference))).click();
		
		//Message method
		//wait.until(ExpectedConditions.elementToBeClickable(By.id(message))).click();

		//Reject method
		wait.until(ExpectedConditions.elementToBeClickable(By.id(reject))).click();
		
		//Transfer method
		//wait.until(ExpectedConditions.elementToBeClickable(By.id(transfer))).click();
		
		//Wait method
		//wait.until(ExpectedConditions.elementToBeClickable(By.id(waitMethod))).click();
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(numberParameter))).sendKeys(global.phoneNumber);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(urlToPlay))).sendKeys(global.urlToPlay);
		wait.until(ExpectedConditions.elementToBeClickable(By.id(createSessionBtn))).click();
		
		Thread.sleep(7000);  
		if (driver.findElement(By.id("ext-element-115")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" + "PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
	     if (url.contains("Java-SDK/CMS")) 
	    	 global.CreateFile("***** CMS JAVA Create Session : " + "\r\n" + driver.findElement(By.id("ext-element-115")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/CMS"))
	    	 global.CreateFile("***** CMS RUBY Create Session: " + "\r\n" + driver.findElement(By.id("ext-element-115")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** CMS PHP Create Session: " + "\r\n" + driver.findElement(By.id("ext-element-115")).getText() + "\r\n\r\n");    
	     
	    Thread.sleep(2000);
	    
	    wait.until(ExpectedConditions.elementToBeClickable(By.id(done))).click();
		
		//Exit Signal
	    Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id(select1))).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.id(exit))).click();
	
		//Stop/Hold Signal
	    /*Thread.sleep(500);
	    wait.until(ExpectedConditions.elementToBeClickable(By.id(select1))).click();
	    wait.until(ExpectedConditions.elementToBeClickable(By.id(stopHold))).click();*/
		
		//DeQueue Signal
		/*Thread.sleep(500);
	    wait.until(ExpectedConditions.elementToBeClickable(By.id(select1))).click();
	    wait.until(ExpectedConditions.elementToBeClickable(By.id(deQueue))).click();*/
		
		Thread.sleep(2000);
	    wait.until(ExpectedConditions.elementToBeClickable(By.id(sendSignalBtn))).click();
		
	    Thread.sleep(5000);
	    if (driver.findElement(By.id("ext-element-115")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" + "PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		if (url.contains("Java-SDK/CMS"))
	    	 global.CreateFile("***** CMS JAVA Send Signal : " + "\r\n" +  driver.findElement(By.id("ext-element-115")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/CMS"))
	    	 global.CreateFile("***** CMS RUBY Send Signal: " + "\r\n" + driver.findElement(By.id("ext-element-115")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** CMS PHP Send Signal: " + "\r\n" + driver.findElement(By.id("ext-element-115")).getText() + "\r\n\r\n"); 
		
		
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id(done))).click();
		}
	    catch (NoSuchElementException e){
			System.out.println(e);
	    }
		Thread.sleep(2000);
		driver.quit();
		
		
}
	
	
}