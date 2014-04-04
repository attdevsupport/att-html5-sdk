package com.att.html5sdk;

import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PaymentApp1positive {

	/**
	 * @param args
	 * @throws IOException 
	 */
	
	public void Execute(String url, String buyProductBtn) throws InterruptedException, IOException{
		
		
		Global global = new Global();
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		driver.get(url);
		WebDriverWait wait = new WebDriverWait(driver,10);
		
		global.CreateFile(url + "r/n");
		try{
		//Buy Product
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id(buyProductBtn))).click();
	
		WebElement iframe = findElementById(driver, "ext-element-96");
		driver.switchTo().frame(iframe);
		
		findElementByLinkText(driver, "Sign In to another account").click();
		WebElement login = findElementById(driver, "login_username");
		login.sendKeys(global.authFlowUser);
		WebElement password = findElementById(driver, "login_password");
		password.sendKeys(global.authFlowPass);
		WebElement allow = findElementByLinkText(driver, "Allow");
		allow.click();
		
		Thread.sleep(5000);
		
		if (driver.findElements(By.tagName("h1")).size() != 0)
			global.CreateFile(driver.findElement(By.tagName("body")).getText() + "r/n");
		
		else{
		if (driver.findElement(By.id("ext-element-112")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n"); 
	
		if (url.contains("Java-SDK/Payment/App1"))
	    	 global.CreateFile("***** Transaction JAVA Buy Product : " + "\r\n" + driver.findElement(By.id("ext-element-112")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/Payment/App1"))
	    	 global.CreateFile("***** Transaction RUBY Buy Product: " + "\r\n" + driver.findElement(By.id("ext-element-112")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** Transaction PHP Buy Product: " + "\r\n" + driver.findElement(By.id("ext-element-112")).getText() + "\r\n\r\n");  
		
		
		//Attempts to catch exceptions
		/*if (driver.findElement(By.id("ext-element-112")).getText().contains("Success: false"))
			driver.quit();*/
		
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-4"))).click();
		
		//Get Transaction Status by Merchant Transaction ID:
		Thread.sleep(3000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-element-44"))).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-2"))).click();
		
		Thread.sleep(5000);
		
		if (driver.findElement(By.id("ext-element-112")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/Payment/App1"))
	    	 global.CreateFile("**** Transaction JAVA Get Transaction Status : " + "\r\n" + driver.findElement(By.id("ext-element-112")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/Payment/App1"))
	    	 global.CreateFile("**** Transaction RUBY Get Transaction Status: " + "\r\n" + driver.findElement(By.id("ext-element-112")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("**** Transaction PHP Get Transaction Status: " + "\r\n" + driver.findElement(By.id("ext-element-112")).getText() + "\r\n\r\n");  
		
		// For Not Successful oauth flow	
		if (driver.findElements(By.id("ext-sheet-1")).size() != 0)
			global.CreateFile("\r\n" + "FAILED" + "\r\n" + driver.findElement(By.id("ext-sheet-1")).getText() + "\r\n\r\n");
								
		else{
		
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-4"))).click();
		
		//Get Transaction Status by Auth Code:
		/*Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-element-57"))).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-2"))).click();
			
		Thread.sleep(5000);
		
		if (driver.findElement(By.id("ext-element-112")).getText().contains("Success: true"))
	     	global.CreateFile("PASSED" + "\r\n");
	     else
	    	global.CreateFile("FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/Payment/App1"))
	    	 global.CreateFile("***** Transaction JAVA Get Transaction Status : " + "\n\n" + driver.findElement(By.id("ext-element-112")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/Payment/App1"))
	    	 global.CreateFile("***** Transaction RUBY Get Transaction Status: " + "\n\n" + driver.findElement(By.id("ext-element-112")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** Transaction PHP Get Transaction Status: " + "\n\n" + driver.findElement(By.id("ext-element-112")).getText() + "\r\n\r\n");  
		
		
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-4"))).click();*/
		
		//Refund Transaction
		Thread.sleep(5000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-element-85"))).click();
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-3"))).click();
	
		Thread.sleep(5000);
		
		if (driver.findElement(By.id("ext-element-112")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
	
		if (url.contains("Java-SDK/Payment/App1"))
	    	 global.CreateFile("Transaction JAVA Refund Transaction : " + "\r\n" + driver.findElement(By.id("ext-element-112")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/Payment/App1"))
	    	 global.CreateFile("Transaction RUBY Refund Transaction: " + "\r\n" + driver.findElement(By.id("ext-element-112")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("Transaction PHP Refund Transaction: " + "\r\n" + driver.findElement(By.id("ext-element-112")).getText() + "\r\n\r\n");  
		}
		}
		//Long wait to make sure that enough time passed for the next transaction flow
		}
	    catch (NoSuchElementException e){
			System.out.println(e);
	    }
	
		Thread.sleep(30000);
		driver.quit();
}

    public static WebElement findElementById(WebDriver d, final String id) {
       
       //This waits up to 10 seconds before throwing a TimeoutException or if it finds the element will return it in 0 - 10 seconds. 
       //WebDriverWait by default calls the ExpectedCondition every 500 milliseconds until it returns successfully. 
       //A successful return is for ExpectedCondition type is Boolean return true or not null return value for all other ExpectedCondition types.
       WebElement myDynamicElement = (new WebDriverWait(d, 5000)).until(new ExpectedCondition<WebElement>(){
                           public WebElement apply(WebDriver d) {
                                  return d.findElement(By.id(id));
       }});
       return myDynamicElement;
    }
    
    public static WebElement findElementByLinkText(WebDriver d, final String text) {
        
        //This waits up to 10 seconds before throwing a TimeoutException or if it finds the element will return it in 0 - 10 seconds. 
        //WebDriverWait by default calls the ExpectedCondition every 500 milliseconds until it returns successfully. 
        //A successful return is for ExpectedCondition type is Boolean return true or not null return value for all other ExpectedCondition types.
        WebElement myDynamicElement = (new WebDriverWait(d, 5000)).until(new ExpectedCondition<WebElement>(){
                            public WebElement apply(WebDriver d) {
                                   return d.findElement(By.linkText(text));
        }});
        return myDynamicElement;
     }
}

