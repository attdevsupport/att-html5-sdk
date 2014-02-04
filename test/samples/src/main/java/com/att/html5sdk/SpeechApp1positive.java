package com.att.html5sdk;

import java.awt.Desktop;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class SpeechApp1positive {

	/**
	 * @param args
	 * @throws IOException 
	 */
	
	public void Execute(String url, String submit, String done) throws InterruptedException, IOException{
		
		Global global = new Global();
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		driver.get(url);
		WebDriverWait wait = new WebDriverWait(driver,10);
		
		global.CreateFile(url);
		try {
		// Submit speech request
		wait.until(ExpectedConditions.elementToBeClickable(By.id(submit))).click();
		
		Thread.sleep(7000);
		
		 if (driver.findElement(By.id("ext-element-73")).getText().contains("Success: true"))
			 global.CreateFile(("\r\n"+"PASSED" + "\r\n"));
	     else
	    	 global.CreateFile(("\r\n"+"FAILED" + "\r\n"));
		
		 if (url.contains("Java-SDK/Speech/App1")){
	    	global.CreateFile("***** Speech JAVA Submit : " + "\r\n" + driver.findElement(By.id("ext-element-73")).getText() + "\r\n\r\n");
		}
	     else if (url.contains("Ruby-SDK/Speech/App1"))
	    	 global.CreateFile("***** Speech PHP Submit: " + "\r\n" + driver.findElement(By.id("ext-element-73")).getText() + "\r\n\r\n"); 
	     else 
	    	 global.CreateFile("***** Speech PHP Submit: " + "\r\n" + driver.findElement(By.id("ext-element-73")).getText() + "\r\n\r\n");      
		
		
	 
	    wait.until(ExpectedConditions.elementToBeClickable(By.id(done))).click();
		}
	    catch (NoSuchElementException e){
			System.out.println(e);
	    }
		driver.quit();
		
		/*Desktop dt = Desktop.getDesktop();
		dt.open(file);*/
}
	    
	
}

