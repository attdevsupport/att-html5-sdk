package sampleApp.MIMApp1;

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

public class MIMApp1positive {

	/**
	 * @param args
	 * @throws IOException 
	 */
	public void Execute(String url, String index) throws InterruptedException, IOException{
		
		sampleApps.Global global = new sampleApps.Global();
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		driver.get(url);
		WebDriverWait wait = new WebDriverWait(driver,10);
		
		global.CreateFile(url);
		try{
		//Get Message Headers
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(index))).sendKeys(global.index);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-1"))).click();
	
		WebElement iframe = findElementById(driver, "ext-element-74");
		driver.switchTo().frame(iframe);
		
		findElementByLinkText(driver, "Sign In to another account").click();
		WebElement login = findElementById(driver, "login_username");
		login.sendKeys(global.authFlowUserWorkaround);
		WebElement password = findElementById(driver, "login_password");
		password.sendKeys(global.authFlowPass);
		WebElement allow = findElementByLinkText(driver, "Allow");
		allow.click();
		
		WebElement closewindow = findElementByLinkText(driver, "Close window");
		closewindow.click();
		
		// For "Access Denied. User Denied Authorization error"	
		if (driver.findElements(By.id("ext-sheet-1")).size() != 0)
			global.CreateFile("\r\n" + "FAILED" + "\r\n" + driver.findElement(By.id("ext-sheet-1")).getText() + "\r\n\r\n");
						
		else{
		
		Thread.sleep(5000);
		if (driver.findElement(By.id("ext-element-90")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" + "PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" + "FAILED" + "\r\n");
		if (url.contains("Java-SDK/MIM"))
	    	 global.CreateFile("***** MIM JAVA Get Message Headers : " + "\r\n" + driver.findElement(By.id("ext-element-90")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/MIM"))
	    	 global.CreateFile("***** MIM RUBY Get Message Headers: " + "\r\n" + driver.findElement(By.id("ext-element-90")).getText() + "\r\n\r\n");   	  
	     else 
	    	 global.CreateFile("***** MIM PHP Get Message Headers: " + "\r\n" + driver.findElement(By.id("ext-element-90")).getText() + "\r\n\r\n");  	
		
		Thread.sleep(3000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-4"))).click();
		
		//Get Message Headers
		List <WebElement> messages = driver.findElements(By.xpath("//div [@class='x-list-item-label']"));
		Thread.sleep(1000);
		
		messages.get(0).click();
		
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("ext-element-50"))).sendKeys(global.partNum);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-2"))).click();
		
		Thread.sleep(5000);
		if (driver.findElement(By.id("ext-element-65")).getText().contains("Success:"))
	     	global.CreateFile("\r\n" + "PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n"+ "FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/MIM"))
	    	 global.CreateFile("***** MIM JAVA Get Message Content : " + "\r\n" + driver.findElement(By.id("ext-element-65")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/MIM"))
	    	 global.CreateFile("***** MIM RUBY Get Message Content: " + "\r\n" + driver.findElement(By.id("ext-element-65")).getText() + "\r\n\r\n");   	  
	     else 
	    	global.CreateFile("***** MIM PHP Get Message Content: " + "\r\n" + driver.findElement(By.id("ext-element-65")).getText() + "\r\n\r\n");   
		
		Thread.sleep(3000);
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-3"))).click();
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
