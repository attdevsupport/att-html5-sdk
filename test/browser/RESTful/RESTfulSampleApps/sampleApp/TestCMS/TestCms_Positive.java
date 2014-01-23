package RESTfulSampleApps.sampleApp.TestCMS;

import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

//CMS positive test
public class TestCms_Positive {
	
	//execution scenarios based on feature
	public void Execute(String url, String numParameter, String messagePlay, String button_1, String selection_2, String button_2) throws InterruptedException, IOException{
		
		Scenario(url, numParameter, messagePlay, button_1, selection_2, button_2, "ask");
		//Scenario(url, numParameter, messagePlay, button_1, selection_2, button_2, "conference");
		//Scenario(url, numParameter, messagePlay, button_1, selection_2, button_2, "reject");
		//Scenario(url, numParameter, messagePlay, button_1, selection_2, button_2, "transfer");
		//Scenario(url, numParameter, messagePlay, button_1, selection_2, button_2, "message");
		//Scenario(url, numParameter, messagePlay, button_1, selection_2, button_2, "wait");

	}
	
		//test code for single test case that exercises positive flow of CMS
		private void Scenario(String url, String numParameter, String messagePlay, String button_1, String selection_2, String button_2, String feature) throws InterruptedException, IOException{
			
			RESTfulSampleApps.sampleApp.Log log = new RESTfulSampleApps.sampleApp.Log();
			RESTfulSampleApps.sampleApp.Global global = new RESTfulSampleApps.sampleApp.Global();
	        System.setProperty("webdriver.chrome.driver", global.webDriverDir);
	        WebDriver driver = new ChromeDriver();
	        driver.get(url);
	        WebElement tempElement;
	        
	        log.HeaderWrite(url);
	     	
	        try{
			tempElement = driver.findElement(By.tagName("select"));
			
			tempElement.sendKeys(feature);
			
			driver.findElement(By.name("txtNumberToDial")).sendKeys(global.phoneNumber);
			driver.findElement(By.name(numParameter)).sendKeys(global.phoneNumber);
			driver.findElement(By.name(messagePlay)).sendKeys(global.mp3Url);
			
			tempElement = driver.findElement(By.name(button_1));
			tempElement.click();
			log.InnerWrite("CMS Create Session: \n");
			global.ResponseDisplay(url, driver);
			
			if(url.contains("Ruby") || url.contains("Java"))
				log.InnerWrite(driver.findElement(By.xpath("//table[@class='successWide']")).getText().trim());
				log.InnerWrite("\n");
			 
			//tempElement = driver.findElement(By.name(selection_2));
			
			
			//tempElement.sendKeys("exit");
			
			tempElement = driver.findElement(By.name(button_2));
			tempElement.click();
			log.InnerWrite("CMS Send Signal: \n");
			global.ResponseDisplay(url, driver);
			
			if(url.contains("Ruby") || url.contains("Java"))
				log.InnerWrite(driver.findElement(By.xpath("//table[@class='successWide']")).getText().trim());
				log.InnerWrite("\n");
			
	        }
			catch (NoSuchElementException e){
				System.out.println(e);
				System.out.println("");
				
			}
			
			
			Thread.sleep(3000);
			driver.quit();
			
		}
}
