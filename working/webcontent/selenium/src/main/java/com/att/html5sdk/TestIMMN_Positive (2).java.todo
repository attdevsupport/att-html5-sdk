package RESTfulSampleApps.sampleApp.TestIMMN;

import java.util.Iterator;
import java.util.List;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import java.awt.AWTException;
import java.awt.Robot;
import java.awt.event.KeyEvent;
import java.io.IOException;

//IMMN positive test
public class TestIMMN_Positive {

	//test code for single test case that exercises positive flow of IMMN
	public void Execute(String url, String msisdn, String message, String subject, String btnSendMessage) throws InterruptedException, AWTException, IOException{
		
		RESTfulSampleApps.sampleApp.Log log = new RESTfulSampleApps.sampleApp.Log();
		RESTfulSampleApps.sampleApp.Global global = new RESTfulSampleApps.sampleApp.Global();
        System.setProperty("webdriver.chrome.driver", global.webDriverDir);
        WebDriver driver = new ChromeDriver();
        driver.get(url);
        Robot r;
        
        log.HeaderWrite(url);
        
        try {
        driver.findElement(By.name(msisdn)).sendKeys(global.phoneNumber);
        driver.findElement(By.name(message)).sendKeys("This is automation framework");
        driver.findElement(By.name(subject)).sendKeys("Sample Apps Testing");
       
                  
            List<WebElement> fileTag = driver.findElements(By.xpath("//input[@type='file']"));
            
            Iterator<WebElement> it1 = fileTag.iterator();
            
            while (it1.hasNext()) {
                  
                WebElement we1 = it1.next();
                if (we1.getTagName().contains("input")){
                      //we1.click();
                      we1.sendKeys(global.helloJpg);

                   /*   r = new Robot();
                      Thread.sleep(500);
                      r.keyPress(KeyEvent.VK_ALT);
                      r.keyPress(KeyEvent.VK_F4);
                      r.keyRelease(KeyEvent.VK_ALT);
                      r.keyRelease(KeyEvent.VK_F4);*/

                }
                
            }
            
            driver.findElement(By.id(btnSendMessage)).click();
            
            global.AuthFlow(driver, url);          
            log.InnerWrite("IMMN Send Message: \n");       		          
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
	



