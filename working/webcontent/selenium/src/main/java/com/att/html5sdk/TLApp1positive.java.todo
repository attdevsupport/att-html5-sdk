package sampleApp.TLApp1;

import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class TLApp1positive {

	/**
	 * @param args
	 * @throws IOException 
	 */
	
	public void Execute(String url, String getLocation, String done) throws InterruptedException, IOException{
		
		sampleApps.Global global = new sampleApps.Global();
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		driver.get(url);
		WebDriverWait wait = new WebDriverWait(driver,10);
		
		global.CreateFile(url);
		try{
		//Get Phone Location
		wait.until(ExpectedConditions.elementToBeClickable(By.id(getLocation))).click();
	
		WebElement iframe = findElementById(driver, "ext-element-104");
		driver.switchTo().frame(iframe);
			
		findElementByLinkText(driver, "Sign In to another account").click();
		WebElement login = findElementById(driver, "login_username");
		login.sendKeys(global.authFlowUser);
		WebElement password = findElementById(driver, "login_password");
		password.sendKeys(global.authFlowPass);
		WebElement allow = findElementByLinkText(driver, "Allow");
		allow.click();
			
		WebElement closewindow = findElementByLinkText(driver, "Close window");
		closewindow.click();	
		Thread.sleep(20000);	
		
		// For "Access Denied. User Denied Authorization error"	
		if (driver.findElements(By.id("ext-sheet-1")).size() != 0)
			global.CreateFile("\r\n" + "FAILED" + "\r\n" + driver.findElement(By.id("ext-sheet-1")).getText() + "\r\n\r\n");
								
		else{
		
		if (driver.findElement(By.id("ext-element-120")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n"+"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n"+"FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/TL/App1"))
	    	 global.CreateFile("***** TL JAVA Get Phone Location : " + "\r\n" + driver.findElement(By.id("ext-element-120")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/TL/App1"))
	    	 global.CreateFile("***** TL RUBY Get Phone Location : " + "\r\n" + driver.findElement(By.id("ext-element-120")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** TL PHP Get Phone Location : " + "\r\n" + driver.findElement(By.id("ext-element-120")).getText() + "\r\n\r\n");  
		
		wait.until(ExpectedConditions.elementToBeClickable(By.id(done))).click();
		}}
	    catch (NoSuchElementException e){
			System.out.println(e);
	    }
		
		driver.quit();
		}
			
		
	    public static WebElement findElementById(WebDriver d, final String id) {
	       
	       //This waits up to 10 seconds before throwing a TimeoutException or if it finds the element will return it in 0 - 10 seconds. 
	       //WebDriverWait by default calls the ExpectedCondition every 500 milliseconds until it returns successfully. 
	       //A successful return is for ExpectedCondition type is Boolean return true or not null return value for all other ExpectedCondition types.
	       WebElement myDynamicElement = (new WebDriverWait(d, 5000)).until(new ExpectedCondition<WebElement>(){
	                           @Override
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
	                            @Override
	                            public WebElement apply(WebDriver d) {
	                                   return d.findElement(By.linkText(text));
	        }});
	        return myDynamicElement;
	     }
	}

