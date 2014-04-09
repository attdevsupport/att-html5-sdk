package TestMIM.copy;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;

import org.openqa.selenium.chrome.ChromeDriver;

import java.awt.AWTException;
import java.io.IOException;


//MIM positive test
public class TestMIM_Positive {

	//test code for single test case that exercises positive flow of MIM
	public void Execute(String url, String headerCnt, String indexCrsr, String messageContentID, String partNumber, String getMessageHeader, String getContent, String textArea) throws InterruptedException, AWTException, IOException{
		
		RESTfulSampleApps.sampleApp.Log log = new RESTfulSampleApps.sampleApp.Log();
		RESTfulSampleApps.sampleApp.Global global = new RESTfulSampleApps.sampleApp.Global();
        System.setProperty("webdriver.chrome.driver", global.webDriverDir);
        WebDriver driver = new ChromeDriver();
        driver.get(url);
        
        String id = ""; 
        
        log.HeaderWrite(url);
 
        //try{
        driver.findElement(By.name(headerCnt)).sendKeys(global.headerCount);
        driver.findElement(By.name(indexCrsr)).sendKeys(global.indexCursor);
        
      if (url.contains("Ruby-RESTful"))
      	  driver.findElement(By.name(getMessageHeader)).click();
      	  
      else
        	driver.findElement(By.id(getMessageHeader)).click();
        
      	global.MimAuthFlow(driver, url);  
      	
      	log.InnerWrite("Get Message Headers");
        global.ResponseDisplay(url, driver);
        
        if (url.contains("Csharp") || url.contains("Vb"))
        	id = driver.findElement(By.xpath("//*[@id='gvMessageHeaders']/tbody/tr[2]/td[1]")).getText();
        
        else
        //id = driver.findElement(By.xpath("//td[@class='style3']")).getText().trim();
        id = "";
        
        
        /// To grab MessageId and PartNumber for Ruby/Java/PHP
        if (url.contains("Ruby") || url.contains("Java")|| url.contains("PHP"))
        	driver.findElement(By.xpath("//input[@id='"+ messageContentID +"']")).sendKeys("S630");
        	//driver.findElement(By.xpath("//input[@id='"+ partNumber +"']")).sendKeys("0");
        
        	
        driver.findElement(By.xpath("//input[@id='"+ messageContentID +"']")).sendKeys(id);
        driver.findElement(By.xpath("//input[@id='"+ partNumber +"']")).sendKeys("0");
	
        
        driver.findElement(By.name((getContent))).click();
        log.InnerWrite("Get Message Content");
        global.ResponseDisplay(url, driver);
        
        if (textArea != null){
	        try{
	        System.out.println(driver.findElement(By.name(textArea)).getText());
	        System.out.println("");
	        }
	   
	    catch (NoSuchElementException e){
	    	System.out.println(e);
	    	System.out.println("");
	        	
	    }
        }
	        	
	        
        Thread.sleep(3000);
		driver.quit();
	}
				
        }
	




		

	  