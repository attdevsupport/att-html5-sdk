package RESTfulSampleApps.sampleApp.TestMIM;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;

import org.openqa.selenium.chrome.ChromeDriver;

import java.awt.AWTException;
import java.io.IOException;


//MIM negative test
public class TestMIM_Negative {

	//test code for single test case that exercises negative flow of MIM
	public void Execute(String url, String headerCnt, String indexCrsr, String messageContentID, String partNumber, String getMessageHeader, String getContent) throws InterruptedException, AWTException, IOException{
		
		RESTfulSampleApps.sampleApp.Log log = new RESTfulSampleApps.sampleApp.Log();
		RESTfulSampleApps.sampleApp.Global global = new RESTfulSampleApps.sampleApp.Global();
        System.setProperty("webdriver.chrome.driver", global.webDriverDir);
        WebDriver driver = new ChromeDriver();
        driver.get(url);
        String id = "";  
        
        log.HeaderWrite(url);
       
        //try{
        driver.findElement(By.name(headerCnt)).sendKeys(global.impHeaderCount);
        driver.findElement(By.name(indexCrsr)).sendKeys(global.impIndexCursor);
       
      if (url.contains("Ruby-RESTful"))
      	  driver.findElement(By.name("getMessageHeaders")).click();
      	  
      else
        	driver.findElement(By.id(getMessageHeader)).click();
        
      
      if (url.contains("Csharp")||url.contains("Vb")){
    	  //if (url.contains("Csharp")||url.contains("VB")) && (driver.findElements(By.xpath("//*[@id='statusPanel']/table")).size() != 0 {
    	//if (driver.findElement(By.xpath("//*[@id='statusPanel']/table")).isDisplayed() && (url.contains("Csharp")||url.contains("VB"))){
    	  log.InnerWrite("Negative Flow: Get Message Headers: \n");
    	  log.InnerWrite(driver.findElement(By.xpath("//*[@id='statusPanel']/table")).getText());
    	  log.InnerWrite("\r\n");
      
    		Thread.sleep(3000);
            driver.quit();
            
    	}
    	else
    	{
      	global.MimAuthFlow(driver, url);
      	
      	log.InnerWrite("Negative Flow: Get Message Headers:");
        global.ResponseDisplay(url, driver);
        
        if (url.contains("Csharp") || url.contains("Vb"))
        	id = driver.findElement(By.xpath("//*[@id='gvMessageHeaders']/tbody/tr[2]/td[1]")).getText();
        
        else
        //id = driver.findElement(By.xpath("//*[@id='container']/div[4]")).getText().trim();
        id = driver.findElement(By.xpath("//div[@class='errorWide']")).getText().trim();
      //*[@id="container"]/div[4]
      
        //*[@id="pnlHeader"]/div[1]
        
        driver.findElement(By.xpath("//input[@id='"+ messageContentID +"']")).sendKeys(id);
        driver.findElement(By.xpath("//input[@id='"+ partNumber +"']")).sendKeys("0");
        
        driver.findElement(By.name((getContent))).click();
        log.InnerWrite("Negative flow Get Message Content:");
        global.ResponseDisplay(url, driver);
        

/*        }
		catch (NoSuchElementException e){
			System.out.println(e);
			System.out.println("");
			
		}*/
      	
	
        Thread.sleep(3000);
        driver.quit();
      }
	}
}
	
