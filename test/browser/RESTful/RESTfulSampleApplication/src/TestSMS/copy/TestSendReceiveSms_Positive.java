package TestSMS.copy;


import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

//SMS App 1 positive test
public class TestSendReceiveSms_Positive{
	
	   //test code for single test case that exercises positive flow of SMS App 1
       public void Execute(String url, String msisdn, String message, String txt, String sendBtn, String statusBtn, String formId, String short1, String short2) throws InterruptedException, IOException{
    	   
    	   RESTfulSampleApps.sampleApp.Log log = new RESTfulSampleApps.sampleApp.Log();
    	   RESTfulSampleApps.sampleApp.Global global = new RESTfulSampleApps.sampleApp.Global();
              System.setProperty("webdriver.chrome.driver", global.webDriverDir);
              WebDriver driver = new ChromeDriver();
              driver.get(url);
              
              log.HeaderWrite(url);
            
              
              try{
              	
              driver.findElement(By.name(msisdn)).sendKeys(global.phoneNumber);
              
              driver.findElement(By.name(message)).sendKeys(" " + txt);
              
            /*  if (driver.findElement(By.id("ext-element-115")).getText().contains("Success: true"))
      	     	global.CreateFile("PASSED" + "\r\n");
      	     	else
      	    	global.CreateFile("FAILED" + "\r\n");*/
              
              if (url.contains("Csharp") || url.contains("Vb")){
            	  
                  driver.findElement(By.xpath("//input[@name='" + sendBtn +"']")).click();
                  log.InnerWrite("Send SMS status: \n");
                  global.ResponseDisplay(url, driver);
                  
                  driver.findElement(By.xpath("//input[@name='" + statusBtn +"']")).click();
                  log.InnerWrite("Get SMS Status: \n");
                  global.ResponseDisplay(url, driver);
                  
            	  driver.findElement(By.xpath("//input[@name='" + short1 +"']")).click();
            	  log.InnerWrite("Get Messages for shortcode 1: \n");
            	  global.ResponseDisplay(url, driver);
            	  
  	            if (short2 != null){
  	            	driver.findElement(By.xpath("//input[@name='" + short2 +"']")).click();
  	            	log.InnerWrite("Get Messages for shortcode 2: n");
  	            	global.ResponseDisplay(url, driver);

	            }

              }
              
              else{
            	  
                  driver.findElement(By.xpath("//button[@name='" + sendBtn +"']")).click();
                  log.InnerWrite("Send SMS status: \n\n");
                  global.ResponseDisplay(url, driver);
                  
                  driver.findElement(By.xpath("//button[@name='" + statusBtn +"']")).click();
                  log.InnerWrite("Get SMS status: \n");
                  global.ResponseDisplay(url, driver);
            	  
            	  driver.findElement(By.xpath("//button[@value='" + short1 +"']")).click();
            	  log.InnerWrite("Get Messages for shortcode 1: \n");
            	  global.ResponseDisplay(url, driver);
            	  
  	            if (short2 != null){
  	            	driver.findElement(By.xpath("//button[@value='" + short2 +"']")).click();
  	            	 log.InnerWrite("Get Messages for shortcode 2: \n");
  	            	global.ResponseDisplay(url, driver);
	            }

              }
              
		        }
				catch (NoSuchElementException e){
					System.out.println(e);
					System.out.println("");
					
				}
              
              Thread.sleep(3000);
              driver.quit();
            
       }
}