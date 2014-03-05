package RESTfulSampleApps.sampleApp.TestSMS;

import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

//SMS App 2 positive test
public class TestVoting {
	
	//test code for single test case that exercises positive flow of SMS App 2
	public void Execute(String url) throws InterruptedException, IOException{
		
		RESTfulSampleApps.sampleApp.Log log = new RESTfulSampleApps.sampleApp.Log();
		RESTfulSampleApps.sampleApp.Global global = new RESTfulSampleApps.sampleApp.Global();
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
        WebDriver driver = new ChromeDriver();
        driver.get(url);
        
        log.HeaderWrite(url);
   
        try {
        
        if(url.contains("Csharp") || url.contains("Vb"))
        	driver.findElement(By.name("UpdateButton")).click();
        
        else
        driver.findElement(By.tagName("button")).click();
		
        log.InnerWrite("SMS App2 Voting: \n");
        global.ResponseDisplay(url, driver);
        
		}
		catch (NoSuchElementException e){
			System.out.println(e);
			System.out.println("");
			
		}
        Thread.sleep(3000);
        
        driver.quit();
	}
}
