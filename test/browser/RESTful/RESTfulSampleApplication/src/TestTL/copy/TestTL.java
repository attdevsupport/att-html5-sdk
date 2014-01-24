package TestTL.copy;

import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

//TL positive test
public class TestTL {
	
	//test code for single test case that exercises positive flow of TL
	public void Execute(String url) throws InterruptedException, IOException{
		
		RESTfulSampleApps.sampleApp.Log log = new RESTfulSampleApps.sampleApp.Log();
		RESTfulSampleApps.sampleApp.Global global = new RESTfulSampleApps.sampleApp.Global();
        System.setProperty("webdriver.chrome.driver", global.webDriverDir);
        WebDriver driver = new ChromeDriver();
        driver.get(url);
        
        log.HeaderWrite(url);
      
        try{
      if (url.contains("Csharp") || url.contains("Vb"))
    	  driver.findElement(By.name("GetDeviceLocationButton")).click();
      
      else
    	  driver.findElement(By.tagName("button")).click();
       	
      	global.AuthFlow(driver, url); 	          
      	
      	
      	log.InnerWrite("Get Phone Location: \n");
        global.ResponseDisplay(url, driver);
        
        }
		catch (NoSuchElementException e){
			System.out.println(e);
			System.out.println("");
			
		}
      	Thread.sleep(2000);
      	driver.quit();
	}
}
