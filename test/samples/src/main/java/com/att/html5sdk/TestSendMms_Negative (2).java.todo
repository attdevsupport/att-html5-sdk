package RESTfulSampleApps.sampleApp.TestMMS;

import java.awt.AWTException;
import java.awt.Robot;
import java.awt.event.KeyEvent;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

//MMS App 1 negative test
public class TestSendMms_Negative {

	//test code for single test case that exercises negative flow of MMS App 1
	public void Execute(String url, String buttonTag, String address, String sendButton, String getStatus) throws InterruptedException, AWTException, IOException{
		
		RESTfulSampleApps.sampleApp.Log log = new RESTfulSampleApps.sampleApp.Log();
		RESTfulSampleApps.sampleApp.Global global = new RESTfulSampleApps.sampleApp.Global();
        System.setProperty("webdriver.chrome.driver", global.webDriverDir);
        WebDriver driver = new ChromeDriver();
        driver.get(url);
        
        //Robot to exit "Open" window to select file
        Robot r;
        
        log.HeaderWrite(url);
        
        try{
        driver.findElement(By.name(address)).sendKeys(global.impPhone);
        
        if (url.contains("Csharp") || url.contains("Vb"))
        driver.findElement(By.name("messageTextBox")).sendKeys("Test");
		
        List<WebElement> fileTag = driver.findElements(By.xpath("//input[@type='file']"));
        
        Iterator<WebElement> it1 = fileTag.iterator();
        
        while (it1.hasNext()) {
        	
            WebElement we1 = it1.next();
            if (we1.getTagName().contains("input")){
                  //we1.click();
                  we1.sendKeys(global.helloJpg);
                  
                /*  Thread.sleep(1000);
                  r = new Robot();
                  r.keyPress(KeyEvent.VK_ALT);
                  r.keyPress(KeyEvent.VK_F4);
                  r.keyRelease(KeyEvent.VK_ALT);
                  r.keyRelease(KeyEvent.VK_F4);*/
            }
        }
        
        
        if (url.contains("Csharp") || url.contains("Vb")){
        	
            driver.findElement(By.xpath("//input[@name='"+ sendButton +"']")).click();
            log.InnerWrite("Negative Flow: Send MMS message: \n");
            global.ResponseDisplay(url, driver);
            
            driver.findElement(By.xpath("//input[@name='"+ getStatus +"']")).click();
            log.InnerWrite("Negative Flow: Get MMS status: \n");
            global.ResponseDisplay(url, driver);

        }
        	
        else{
        driver.findElement(By.xpath("//button[@name='"+ sendButton +"']")).click();
        log.InnerWrite("Negative Flow: Send MMS message: \n");
        global.ResponseDisplay(url, driver);
        
        driver.findElement(By.xpath("//button[@name='"+ getStatus +"']")).click();
        log.InnerWrite("Negative Flow: Get MMS status: \n");
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

