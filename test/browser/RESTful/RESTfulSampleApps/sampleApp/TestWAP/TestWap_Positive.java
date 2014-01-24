package RESTfulSampleApps.sampleApp.TestWAP;

import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

//WAPPush positive test
public class TestWap_Positive {
	
	//test code for single test case that exercises positive flow of WAPPush
	public void Execute(String url, String msisdn, String sendBtn) throws InterruptedException, IOException{
		
		RESTfulSampleApps.sampleApp.Log log = new RESTfulSampleApps.sampleApp.Log();
		RESTfulSampleApps.sampleApp.Global global = new RESTfulSampleApps.sampleApp.Global();
        System.setProperty("webdriver.chrome.driver", global.webDriverDir);
        WebDriver driver = new ChromeDriver();
        driver.get(url);
        
        log.HeaderWrite(url);
        
        try{
        driver.findElement(By.name(msisdn)).sendKeys(global.phoneNumber);
        
        List<WebElement> wd = driver.findElements(By.name(sendBtn));
        
        Iterator<WebElement> it = wd.iterator();
        while (it.hasNext()) {
               WebElement we = it.next();
               if (we.getTagName().contains("button") || we.getTagName().contains("input")) {
                     we.click();
               }              
               		          
     
        }
        
        log.InnerWrite("Send WAP Message: \n");
        global.ResponseDisplay(url, driver);
        
        }
		catch (NoSuchElementException e){
			System.out.println(e);
			System.out.println("");
			
		}
        Thread.sleep(1000);
        driver.quit();
	}
}