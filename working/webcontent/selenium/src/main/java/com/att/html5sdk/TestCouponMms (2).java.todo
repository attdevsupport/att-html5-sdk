package RESTfulSampleApps.sampleApp.TestMMS;

import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

//MMS App 2 positive test
public class TestCouponMms {

	//test code for single test case that exercises positive flow of MMS App 2
	public void Execute(String url, String attributeName) throws InterruptedException, IOException {
		
		RESTfulSampleApps.sampleApp.Log log = new RESTfulSampleApps.sampleApp.Log();
		RESTfulSampleApps.sampleApp.Global global = new RESTfulSampleApps.sampleApp.Global();
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
        WebDriver driver = new ChromeDriver();
        driver.get(url);

        log.HeaderWrite(url);
        
        try{
     if (url.contains("Csharp") || url.contains("Vb")){
    	 driver.findElement(By.id("phoneListTextBox")).sendKeys(global.phoneNumber);
         
	     driver.findElement(By.xpath("//input[@name='sendButton']")).click();
	     log.InnerWrite("Send Coupon status: \n");
	     global.ResponseDisplay(url, driver);
	     
	     driver.findElement(By.xpath("//input[@name='"+attributeName +"']")).click();
	     log.InnerWrite("Check Status: \n");
	     global.ResponseDisplay(url, driver);
	     
     }

    	 
     	
     else{
    	 driver.findElement(By.tagName("input")).sendKeys(global.phoneNumber);
     
	     driver.findElement(By.tagName("button")).click();
	     log.InnerWrite("Send Coupon status: \n");
	     global.ResponseDisplay(url, driver);
	     
	     driver.findElement(By.xpath("//button[@name='"+attributeName +"']")).click();
	     log.InnerWrite("Check Status: \n");
	     global.ResponseDisplay(url, driver);

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
		
