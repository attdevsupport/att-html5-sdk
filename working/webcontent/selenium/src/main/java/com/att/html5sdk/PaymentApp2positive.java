package com.att.html5sdk;

import java.io.IOException;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PaymentApp2positive {

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
		
		global.CreateFile(url);
		
		try{
		//Buy Product
		Thread.sleep(5000);	
		wait.until(ExpectedConditions.elementToBeClickable(By.id(buyProductBtn))).click();
	
		WebElement iframe = findElementById(driver, "ext-element-98");
		driver.switchTo().frame(iframe);
		
		findElementByLinkText(driver, "Sign In to another account").click();
		WebElement login = findElementById(driver, "login_username");
		login.sendKeys(global.authFlowUser);
		WebElement password = findElementById(driver, "login_password");
		password.sendKeys(global.authFlowPass);
		WebElement allow = findElementByLinkText(driver, "Allow");
		allow.click();
		
		/*if (driver.findElements(By.id("ext-element-114")).size() != 0) {
			global.CreateFile("ERROR" + (driver.getPageSource().toString()) + "r\n\r\n");
			//global.CreateFile("ERROR: " + driver.findElements(By.id("ext-element-120")));
			driver.quit();
		}*/
		
		//System.out.println(driver.getPageSource().toString());
		
//		List<WebElement> p = driver.findElements(By.tagName("p"));
//		
//		for (WebElement e : p){
//			if (e.getAttribute("id").contains("net_error_id")){
//				global.CreateFile("Error: " + e.getText());
//				driver.quit();
//			}
//		}
//		
//		if (driver.findElements(By.tagName("p")).get(2).getText().contains("Either")) {
//			global.CreateFile("Error: " + driver.findElement(By.id("net_error_id")).getText());
//			driver.quit();
//		}
		
		Thread.sleep(5000);
		
		if (driver.findElements(By.tagName("h1")).size() != 0)
			global.CreateFile(driver.findElement(By.tagName("body")).getText() + "r/n");
		
		else{
		
		if (driver.findElement(By.id("ext-element-114")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/Payment/App2"))
	    	 global.CreateFile("***** Subscription JAVA Subscribe : " + "\r\n" + driver.findElement(By.id("ext-element-114")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/Payment/App2"))
	    	 global.CreateFile("***** Subscription RUBY Subscribe: " + "\r\n" + driver.findElement(By.id("ext-element-114")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** Subcription PHP Subscribe: " + "\r\n" + driver.findElement(By.id("ext-element-114")).getText() + "\r\n\r\n");  
		
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-6"))).click();

		//Get Subscription Status by Merchant Transaction ID:
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-element-44"))).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-2"))).click();
		
		Thread.sleep(5000);
		
		if (driver.findElement(By.id("ext-element-112")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		 
		if (url.contains("Java-SDK/Payment/App1"))
	    	 global.CreateFile("***** Subscription JAVA Get Transaction Status : " + "\r\n" + driver.findElement(By.id("ext-element-112")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/Payment/App1"))
	    	 global.CreateFile("***** Subscription RUBY Get Transaction Status: " + "\r\n" + driver.findElement(By.id("ext-element-112")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** Subscription PHP Get Transaction Status: " + "\r\n" + driver.findElement(By.id("ext-element-112")).getText() + "\r\n\r\n");  
		
		//For Error Message	
		if (driver.findElements(By.id("ext-element-99")).size() != 0 || driver.findElements(By.id("ext-element-120")).size() != 0) {
			
			global.CreateFile("ERROR: Please select a value to use to obtain subscription status" + "r\n\r\n");
		}
			//global.CreateFile("ERROR: " + driver.findElements(By.id("ext-element-120")));
			//driver.quit();
			
			//driver.get(url);
		else{	
		
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-6"))).click(); 	
	
		/*//Get Subscription Status by Auth Code:
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-element-57"))).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-2"))).click();
		
		Thread.sleep(5000);
		
		if (driver.findElement(By.id("ext-element-114")).getText().contains("Success: true"))
			global.CreateFile("\r\n" +"PASSED" + "\r\n");
		else
			global.CreateFile("\r\n" +"FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/Payment/App2"))
			global.CreateFile("***** Subscription JAVA Get Subscription Status by Auth : " + "\r\n" + driver.findElement(By.id("ext-element-114")).getText() + "\r\n\r\n");
		else if (url.contains("Ruby-SDK/Payment/App2"))
			global.CreateFile("***** Subscription RUBY Get Subscription Status by Auth: " + "\r\n" + driver.findElement(By.id("ext-element-114")).getText() + "\r\n\r\n");   	  
		else 
			global.CreateFile("***** Subscription PHP Get Subscription Status by Auth: " + "\r\n" + driver.findElement(By.id("ext-element-114")).getText() + "\r\n\r\n"); 
	
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-6"))).click();*/
	
		if (driver.findElements(By.id("ext-element-99")).size() != 0) {
			//global.CreateFile("ERROR: " + driver.findElement(By.id("ext-element-99")));
			global.CreateFile("ERROR: Please select a value to use to obtain subscription status" +  "r\n\r\n");
			
		
			//System.out.println(driver.getPageSource().toString());
		
		}
		
		//Get Subscription Details
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-element-85"))).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-element-87"))).click();
	
		Thread.sleep(5000);
		if (driver.findElement(By.id("ext-element-114")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/Payment/App2"))
	    	 global.CreateFile("***** Subscription JAVA Get Subscription Details : " + "\r\n" + driver.findElement(By.id("ext-element-114")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/Payment/App2"))
	    	 global.CreateFile("***** Subscription RUBY Get Subscription Details: " + "\r\n" + driver.findElement(By.id("ext-element-114")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** Subscription PHP Get Subscription Details: " + "\r\n" + driver.findElement(By.id("ext-element-114")).getText() + "\r\n\r\n"); 
		
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-6"))).click();
		
		// Cancel Subscription
		Thread.sleep(10000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-element-88"))).click();
		
		Thread.sleep(5000);
		
		if (driver.findElement(By.id("ext-element-114")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
	 
		if (url.contains("Java-SDK/Payment/App2"))
	    	 global.CreateFile("***** Subscription JAVA Cancel Subscription : " + "\r\n" + driver.findElement(By.id("ext-element-114")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/Payment/App2"))
	    	 global.CreateFile("***** Subscription RUBY Cancel Subscription : " + "\r\n" + driver.findElement(By.id("ext-element-114")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** Subscription PHP Cancel Subscription : " + "\r\n" + driver.findElement(By.id("ext-element-114")).getText() + "\r\n\r\n");  
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-6"))).click();
		
		//Refund Subscription
		Thread.sleep(1000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-element-89"))).click();
		
		Thread.sleep(5000);
		if (driver.findElement(By.id("ext-element-114")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/Payment/App2"))
	    	 global.CreateFile("***** Subscription JAVA Refund Subscription : " + "\r\n" + driver.findElement(By.id("ext-element-114")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/Payment/App2"))
	    	 global.CreateFile("***** Subscription RUBY Refund Subscription : " + "\r\n" + driver.findElement(By.id("ext-element-114")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** Subscription PHP Refund Subscription : " + "\r\n" + driver.findElement(By.id("ext-element-114")).getText() + "\r\n\r\n"); 
		
		Thread.sleep(2000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-6"))).click();
		}
		}}
	    catch (NoSuchElementException e){
			System.out.println(e);
	    }
		//Long wait to make sure that enough time passed for the next transaction flow
		
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

