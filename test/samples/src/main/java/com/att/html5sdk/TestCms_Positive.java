package com.att.html5sdk;

import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

//CMS positive test
public class TestCms_Positive {
	
	//execution scenarios based on feature
	public void Execute(String url, String numParameter, String messagePlay, String button_1, String selection_2, String button_2) throws InterruptedException, IOException{
		
		Scenario(url, numParameter, messagePlay, button_1, selection_2, button_2, "ask");
		//Scenario(url, numParameter, messagePlay, button_1, selection_2, button_2, "conference");
		//Scenario(url, numParameter, messagePlay, button_1, selection_2, button_2, "reject");
		//Scenario(url, numParameter, messagePlay, button_1, selection_2, button_2, "transfer");
		//Scenario(url, numParameter, messagePlay, button_1, selection_2, button_2, "message");
		//Scenario(url, numParameter, messagePlay, button_1, selection_2, button_2, "wait");

	}
	
  //test code for single test case that exercises positive flow of CMS
  private void Scenario(String url, String numParameter, String messagePlay, String button_1, String selection_2, String button_2, String feature) throws InterruptedException, IOException{
    
    Log log = new Log();
    Global global = new Global();
        System.setProperty("webdriver.chrome.driver", global.webDriverDir);
        WebDriver driver = new ChromeDriver();
        driver.get(url);
        WebElement tempElement;
        
        log.HeaderWrite(url);
      
        try{
    tempElement = driver.findElement(By.tagName("select"));
    
    tempElement.sendKeys(feature);
    
    driver.findElement(By.name("txtNumberToDial")).sendKeys(global.phoneNumber);
    driver.findElement(By.name(numParameter)).sendKeys(global.phoneNumber);
    driver.findElement(By.name(messagePlay)).sendKeys(global.mp3Url);
    
    tempElement = driver.findElement(By.name(button_1));
    tempElement.click();
    log.InnerWrite("CMS Create Session: \n");
    global.ResponseDisplay(url, driver);
    
    if(url.contains("Ruby") || url.contains("Java"))
      log.InnerWrite(driver.findElement(By.xpath("//table[@class='successWide']")).getText().trim());
      log.InnerWrite("\n");
     
    //tempElement = driver.findElement(By.name(selection_2));
    
    
    //tempElement.sendKeys("exit");
    
    tempElement = driver.findElement(By.name(button_2));
    tempElement.click();
    log.InnerWrite("CMS Send Signal: \n");
    global.ResponseDisplay(url, driver);
    
    if(url.contains("Ruby") || url.contains("Java"))
      log.InnerWrite(driver.findElement(By.xpath("//table[@class='successWide']")).getText().trim());
      log.InnerWrite("\n");
    
        }
    catch (NoSuchElementException e){
      System.out.println(e);
      System.out.println("");
      
    }
    
    
    Thread.sleep(3000);
    driver.quit();
    
  }

  public void Execute2(String url, String sipOrNumber, String select, String conference, String message, String reject, String transfer, String waitMethod, String numberParameter, String urlToPlay, String createSessionBtn, String done, String select1, String exit, String stopHold, String deQueue, String sendSignalBtn) throws InterruptedException, IOException{
		
		Global global = new Global();
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
