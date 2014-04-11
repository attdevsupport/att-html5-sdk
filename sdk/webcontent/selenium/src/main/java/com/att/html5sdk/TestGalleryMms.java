package com.att.html5sdk;

import java.io.IOException;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

//MMS App 3 positive test
public class TestGalleryMms {
		
			//test code for single test case that exercises positive flow of MMS App 3
			public TestResult Execute(String logFile) throws InterruptedException, IOException{
				
				Global global = new Global();
				String url = global.serverPrefix + global.MMS3Ruby;
				TestResult testResult = new TestResult("Gallery MMS Test", url);
				System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		        WebDriver driver = new ChromeDriver();
		        driver.get(url);
		        int photoCount = 0;
		        
		        //log.HeaderWrite(url);
		        
		        try{
//		        if (!url.contains("Csharp") || !url.contains("Vb")){
			        testResult.setAction("Finding Elements");
			        List<WebElement>  images = driver.findElements(By.className("imageItem"));
			      //  Pattern p = Pattern.compile("([0-9])$");
			      //  Matcher m = p.matcher(s);
			        
			        //if (m.find()){
			        	photoCount = images.size();
			       // }
//		        }
//			        else
//			        	 photoCount = Integer.parseInt(driver.findElement(By.id("lbl_TotalCount")).getText());
//			        
			        testResult.setAction("Verifying images");
			        List <WebElement> img = driver.findElements(By.tagName("img"));
			        testResult.setAction("Counting and verifying elements");
			        if (img.size() == photoCount)
			        	testResult.info("Number of MMS photos sent to short code: \n");
			        	testResult.info (Integer.toString(img.size()));
			        testResult.complete(img.size() == photoCount);
		        }
				catch (NoSuchElementException e){
					//System.out.println(e);
					//System.out.println("");
					testResult.error(e.getMessage());
				}

		        
		        Thread.sleep(3000);
				driver.quit();
				return testResult;
			}
}