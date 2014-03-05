package RESTfulSampleApps.sampleApp.TestNotary;

import java.io.IOException;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

//Notary positive test
public class TestNotary {
		
		//test code for single test case that exercises positive flow of Notary
		public void Execute(String url, String payloadButton) throws InterruptedException, IOException{
			
			RESTfulSampleApps.sampleApp.Log log = new RESTfulSampleApps.sampleApp.Log();
			RESTfulSampleApps.sampleApp.Global global = new RESTfulSampleApps.sampleApp.Global();
	        System.setProperty("webdriver.chrome.driver", global.webDriverDir);
	        WebDriver driver = new ChromeDriver();
	        driver.get(url);
	        List<WebElement> cells;
	        
	        log.HeaderWrite(url);
	       
	        try{
	        if (url.contains("Csharp") || url.contains("Vb"))
	        	driver.findElement(By.xpath("//input[@name='"+ payloadButton +"']")).click();
	        
	        else 
	        	driver.findElement(By.xpath("//button[@type='submit']")).click();
	        
	        
	        cells = driver.findElements(By.xpath("//td[@class='cell']"));
	        
	        for (WebElement e : cells){
	        	if (!e.getTagName().contains("button") || !e.getTagName().contains("input")){
	        		log.InnerWrite("*********Sign Payload Result: *******" +  "\n");
		        	log.InnerWrite(e.getText());
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
