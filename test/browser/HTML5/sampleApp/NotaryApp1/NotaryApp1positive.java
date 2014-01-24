package sampleApp.NotaryApp1;

import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class NotaryApp1positive {

	/**
	 * @param args
	 * @throws IOException 
	 */
	
	public void Execute(String url, String signPayload, String result, String done) throws InterruptedException, IOException{
		
		sampleApps.Global global = new sampleApps.Global();
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		driver.get(url);
		WebDriverWait wait = new WebDriverWait(driver,10);
		
		global.CreateFile(url);
		try{
		// Sign Payload
		wait.until(ExpectedConditions.elementToBeClickable(By.id(signPayload))).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.id(result))).click();
	
		Thread.sleep(5000);
		if (driver.findElement(By.id("ext-element-62")).getText().contains("Success: true"))
	     	global.CreateFile("\r\n" +"PASSED" + "\r\n");
	     else
	    	global.CreateFile("\r\n" +"FAILED" + "\r\n");
		
		if (url.contains("Java-SDK/Notary"))
	    	 global.CreateFile("**** Notary JAVA Sign Payload : " + "\r\n" + driver.findElement(By.id("ext-element-62")).getText() + "\r\n\r\n");
	     else if (url.contains("Ruby-SDK/Notary"))
	    	 global.CreateFile("**** Notary RUBY Sign Payload: " + "\r\n" + driver.findElement(By.id("ext-element-62")).getText() + "\r\n\r\n");   	  
	     else 
	    	global.CreateFile("**** Notary PHP Sign Payload: " + "\r\n" + driver.findElement(By.id("ext-element-62")).getText() + "\r\n\r\n"); 
		 
		wait.until(ExpectedConditions.elementToBeClickable(By.id(done))).click();
		}
	    catch (NoSuchElementException e){
			System.out.println(e);
	    }
		driver.quit();

	}

}
