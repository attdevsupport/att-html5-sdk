package RESTfulSampleApps.sampleApp.TestPayment;

import java.io.IOException;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;



//Transaction positive test
public class Payment_Single extends RESTfulSampleApps.sampleApp.Global{
	
	RESTfulSampleApps.sampleApp.Global global = new RESTfulSampleApps.sampleApp.Global();
	RESTfulSampleApps.sampleApp.Log log = new RESTfulSampleApps.sampleApp.Log();
	
	//test code for single test case that exercises positive flow of Transaction
	public void Execute(String url, String buy, String status, String trxID, String refund) throws InterruptedException, IOException{
		
	
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		driver.get(url);
		List<WebElement> temp;
		int indexStatus = 0;
		int indexTrxID = 0;
		
		log.HeaderWrite(url);
		
		try{
		if (url.contains("Csharp") || url.contains("Vb")){
			driver.findElement(By.xpath("//input[@name='"+buy+"']")).click();
			
			global.AuthFlow(driver, url);
			log.InnerWrite("Single Pay Buy Product: \n");
			if (driver.findElements(By.xpath("//*[@id='transactionSuccessTable']")).size() != 0)
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='transactionSuccessTable']")).getText());
			
			else if (driver.findElements(By.id("getTransactionStatusPanel")).size() != 0)
				log.InnerWrite(driver.findElements(By.id("getTransactionStatusPanel")).get(0).getText());
			
			
			driver.findElement(By.xpath("//input[@name='"+status+"']")).click();
			
			log.InnerWrite("Get Transaction status: \n");
			if (driver.findElements(By.xpath("//*[@id='tranGetStatusTable']")).size() != 0){
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='tranGetStatusTable']")).getText());
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='newTransactionStatusPanel']")).getText());
			}
			else if (driver.findElements(By.id("newTransactionStatusPanel")).size() != 0)
				log.InnerWrite(driver.findElements(By.id("newTransactionStatusPanel")).get(0).getText());
			
			
			temp = driver.findElements(By.xpath("//input[@name='"+trxID+"']"));
			temp.get(indexTrxID).click();
			
			driver.findElement(By.xpath("//input[@name='"+refund+"']")).click();
			
			log.InnerWrite("Refund Transaction: \n");
			if (driver.findElements(By.xpath("//*[@id='refundSuccessTable']")).size() != 0){
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='refundSuccessTable']")).getText());
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='refundPanel']")).getText());
			}
			else if (driver.findElements(By.id("refundPanel")).size() != 0)
				log.InnerWrite(driver.findElements(By.id("refundPanel")).get(0).getText());
			
			

		}
		
		else{
			driver.findElement(By.xpath("//button[@name='"+buy+"']")).click();
			
			global.AuthFlow(driver, url);
			log.InnerWrite("Single Pay Buy Product: \n");
			ResponseBoxes(driver, 3);
			
			temp = driver.findElements(By.xpath("//input[@name='getTransactionType']"));
			temp.get(indexStatus).click();
			
			driver.findElement(By.xpath("//button[@name='"+status+"']")).click();
			
			log.InnerWrite("Get Transaction status: \n");
			ResponseBoxes(driver, 4);
			
			
			temp = driver.findElements(By.xpath("//input[@name='"+trxID+"']"));
			temp.get(indexTrxID).click();
			
			driver.findElement(By.xpath("//button[@name='"+refund+"']")).click();
			
			log.InnerWrite("Refund Transaction: \n");
			ResponseBoxes(driver, 5);
			
			}
		
        }
		catch (NoSuchElementException e){
			System.out.println(e);
			System.out.println("");
			
		}
		
		Thread.sleep(3000);
		driver.quit();
		
	}
	
	public void log(String stuff, WebDriver driver, String url, List<WebElement> temp) throws IOException{
		
		if (url.contains("Csharp") || url.contains("Vb"))
			driver.findElement(By.xpath("//input[@name='"+stuff+"']")).click();
		else
		driver.findElement(By.xpath("//button[@name='"+stuff+"']")).click();
		
		global.ResponseDisplay(url, driver);
		temp = driver.findElements(By.tagName("tbody"));
		
		for (WebElement e : temp){
			if (e.getText().contains("IsSuccess")){
				System.out.println(e.getText());
				System.out.println("");
			}
		}
		
	}
	
	public void ResponseBoxes(WebDriver driver, int num) throws IOException{
		
		if (num != 1 && num != 6 && num != 3){
			if (driver.findElements(By.xpath("//*[@id='container']/div["+ num +"]")).size() != 0){
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='container']/div["+ num +"]")).getText());
				if (driver.findElements(By.xpath("//*[@id='container']/div["+ (num+1) +"]/table")).size() != 0)
					log.InnerWrite(driver.findElement(By.xpath("//*[@id='container']/div["+ (num+1) +"]/table")).getText());
			}	
			else 
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='container']/div["+ (num+1) +"]")).getText());
		}
		else if (num == 3){
			if (driver.findElements(By.xpath("//*[@id='container']/div["+ num +"]")).size() != 0){
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='container']/div["+ num +"]")).getText());
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='container']/div["+ (num+1) +"]")).getText());
			}	
			else 
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='container']/div["+ (num+1) +"]")).getText());
		}
	else if (num == 6){
		if (driver.findElements(By.xpath("//*[@id='container']/div["+ num +"]")).size() != 0){
			log.InnerWrite(driver.findElement(By.xpath("//*[@id='container']/div["+ num +"]")).getText());
			log.InnerWrite(driver.findElement(By.xpath("//*[@id='container']/div["+ (num+1) +"]/table")).getText());
		}	
		else 
			log.InnerWrite(driver.findElement(By.xpath("//*[@id='container']/div["+ num +"]")).getText());
	}
	else if (num == 1){
		if (driver.findElements(By.xpath("//*[@id='content']/div["+ num +"]")).size() != 0){
			log.InnerWrite(driver.findElement(By.xpath("//*[@id='content']/div["+ num +"]")).getText());
			log.InnerWrite(driver.findElement(By.xpath("//*[@id='content']/div["+ (num+1) +"]/table")).getText());
		}	
		else 
			log.InnerWrite(driver.findElement(By.xpath("//*[@id='content']/div["+ num +"]")).getText());
		
		
	}
		
		}
}

