package RESTfulSampleApps.sampleApp.TestMMS;

import java.awt.AWTException;
import java.io.IOException;
import java.util.List;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

//MMS App 3 positive test
public class TestGalleryMms {
		
			//test code for single test case that exercises positive flow of MMS App 3
			public void Execute(String url) throws InterruptedException, AWTException, IOException{
				
				RESTfulSampleApps.sampleApp.Log log = new RESTfulSampleApps.sampleApp.Log();
				RESTfulSampleApps.sampleApp.Global global = new RESTfulSampleApps.sampleApp.Global();
				System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		        WebDriver driver = new ChromeDriver();
		        driver.get(url);
		        int photoCount = 0;
		        
		        log.HeaderWrite(url);
		        
		        try{
		        if (!url.contains("Csharp") || !url.contains("Vb")){
			        
			        String s = driver.findElement(By.tagName("p")).getText();
			        Pattern p = Pattern.compile("([0-9])$");
			        Matcher m = p.matcher(s);
			        
			        if (m.find()){
			        	photoCount = Integer.parseInt(m.group());
			        }
		        }
			        else
			        	 photoCount = Integer.parseInt(driver.findElement(By.id("lbl_TotalCount")).getText());
			        
			        List <WebElement> img = driver.findElements(By.tagName("img"));
			        
			        if (img.size() == photoCount)
			        	log.InnerWrite("Number of MMS photos sent to short code: \n");
			        	log.InnerWrite (Integer.toString(img.size()));
			        
		        }
				catch (NoSuchElementException e){
					System.out.println(e);
					System.out.println("");
					
				}

		        
		        Thread.sleep(3000);
				driver.quit();
			}
}