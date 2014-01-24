package sampleApp.WAPPushApp1;

import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class WAPPushApp1negative {

	/**
	 * @param args
	 * @throws IOException 
	 */
	
	public void Execute(String url, String msisdn, String sendWAPBtn) throws InterruptedException, IOException{
		
		sampleApps.Global global = new sampleApps.Global();
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		driver.get(url);
		WebDriverWait wait = new WebDriverWait(driver,10);
		
		global.CreateFile(url);
		
		// Send WAP Message with invalid msisdn
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(msisdn))).sendKeys(global.impPhone);
		wait.until(ExpectedConditions.elementToBeClickable(By.id(sendWAPBtn))).click();
		
		Thread.sleep(3000);
		if (driver.findElement(By.id("ext-element-70")).getText().contains("Phone number is not valid"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/WAPPush/App1"))
	    	 global.CreateFile("***** WAPPush JAVA Send WAP Message negative flow : " + "\r\n" + driver.findElement(By.id("ext-element-70")).getText()+ "\r\n");
	     else if (url.contains("Ruby-SDK/WAPPush/App1"))
	    	 global.CreateFile("***** WAPPush RUBY Send WAP Message negative flow : " + "\r\n" + driver.findElement(By.id("ext-element-70")).getText()+ "\r\n");   	  
	     else 
	    	 global.CreateFile("***** WAPPush PHP Send WAP Message negative flow : " + "\r\n" + driver.findElement(By.id("ext-element-70")).getText()+ "\r\n");  
		
		
		wait.until(ExpectedConditions.elementToBeClickable(By.id("ext-button-2"))).click();
	
		driver.quit();
		
	}
}