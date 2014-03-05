package TestPayment.copy;

import java.io.IOException;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;


//Subscription positive test
public class Payment_Subscription {
	RESTfulSampleApps.sampleApp.Global global = new RESTfulSampleApps.sampleApp.Global();
	RESTfulSampleApps.sampleApp.Log log = new RESTfulSampleApps.sampleApp.Log();
	
	//test code for single test case that exercises positive flow of Subscription
	public void Execute(String url, String buy, String status, String detail, String cancel, String refund, String getRefundRadio, String getDetailRadio) throws InterruptedException, IOException{
		
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
		driver.get(url);
		
		List<WebElement> temp;
		int indexStatus = 0;
		int indexTrxID = 0;
		
		log.HeaderWrite(url);
		
		//try{
		if (url.contains("Csharp") || url.contains("Vb")){
			driver.findElement(By.xpath("//input[@name='"+buy+"']")).click();
			
			global.AuthFlow(driver, url);
			log.InnerWrite("Subscription: Subscribe: \n");
			if (driver.findElements(By.xpath("//*[@id='subscriptionSuccessTable']")).size() != 0)
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='subscriptionSuccessTable']")).getText());
			
			else
				log.InnerWrite(driver.findElements(By.id("getSubscriptionStatusPanel")).get(0).getText());
			
			temp = driver.findElements(By.xpath("//input[@name='Radio_SubscriptionStatus']"));
			temp.get(indexStatus).click();
			
			driver.findElement(By.xpath("//input[@name='"+status+"']")).click();
			
			log.InnerWrite("Get Subscription Status: \n");
			if (driver.findElements(By.xpath("//*[@id='subsGetStatusTable']")).size() != 0){
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='subsGetStatusTable']")).getText());
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='getSubscriptionStatusPanel']")).getText());
			}
			else
				log.InnerWrite(driver.findElements(By.id("getSubscriptionStatusPanel")).get(0).getText());
			
			temp = driver.findElements(By.xpath("//input[@name='SubsDetailsSection']"));
			temp.get(indexTrxID).click();
			
			driver.findElement(By.xpath("//input[@name='"+detail+"']")).click();
			
			log.InnerWrite("Get Subscription Details: \n");
			if (driver.findElements(By.id("subsDetailsSuccessTable")).size() != 0){
				log.InnerWrite(driver.findElements(By.id("subsDetailsSuccessTable")).get(0).getText());
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='subsDetailsPanel']")).getText());
			}
			else
				log.InnerWrite(driver.findElements(By.id("getSubscriptionStatusPanel")).get(0).getText());
			
			if (driver.findElements(By.id("subscriptionSuccessTable")).size() != 0){
				log.InnerWrite(driver.findElements(By.id("subscriptionSuccessTable")).get(0).getText());
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='getSubscriptionStatusPanel']/table")).getText());
			}
			else
				log.InnerWrite(driver.findElements(By.id("getSubscriptionStatusPanel")).get(0).getText());
			
			
			temp = driver.findElements(By.xpath("//input[@name='"+ getRefundRadio +"']"));
			temp.get(indexTrxID).click();
			
			driver.findElement(By.xpath("//input[@name='"+cancel+"']")).click();
			
			log.InnerWrite("Cancel Subscription: \n");
			
			if (driver.findElements(By.id("subsRefundSuccessTable")).size() != 0){
				log.InnerWrite(driver.findElements(By.id("subsRefundSuccessTable")).get(0).getText());
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='subsRefundPanel']")).getText());
			}
			else
				log.InnerWrite(driver.findElements(By.id("getSubscriptionStatusPanel")).get(0).getText());
			
			//log(cancel, driver, url, temp);
			
			temp = driver.findElements(By.xpath("//input[@name='"+ getRefundRadio +"']"));
			temp.get(indexTrxID).click();
			
			log.InnerWrite("Refund Subscription: \n");
			driver.findElement(By.xpath("//input[@name='"+refund+"']")).click();
			
			if (driver.findElements(By.id("subsRefundSuccessTable")).size() != 0){
				log.InnerWrite(driver.findElements(By.id("subsRefundSuccessTable")).get(0).getText());
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='subsRefundPanel']")).getText());
			}
			else
				log.InnerWrite(driver.findElements(By.id("getSubscriptionStatusPanel")).get(0).getText());
			
		}
		
		else{
		driver.findElement(By.xpath("//button[@name='"+buy+"']")).click();
		
		global.AuthFlow(driver, url);
		log.InnerWrite("Subscription: Subscribe: \n");
		log.InnerWrite(driver.findElement(By.xpath("//*[@id='container']/div[3]")).getText());
		
		//global.ResponseDisplay(url, driver);
		
//		temp = driver.findElements(By.xpath("//input[@name='getTransactionType']"));
//		temp.get(indexStatus).click();
		
		log.InnerWrite("Get Subscription Status: \n");
		driver.findElement(By.xpath("//button[@name='"+status+"']")).click();
		
		if (url.contains("Ruby"))
			ResponseBoxes(driver, 5);
		else
			ResponseBoxes(driver, 4);
		
		//log(status, driver, url, temp);
		
//		temp = driver.findElements(By.xpath("//input[@name='trxIdGetDetails']"));
//		temp.get(indexStatus).click();
		//getSubscriptionDetails
		driver.findElements(By.xpath("//input[@name='"+getDetailRadio+"']")).get(0).click();
		
		log.InnerWrite("Get Subscription Details: \n");
		driver.findElement(By.xpath("//button[@name='"+detail+"']")).click();
		
		if (url.contains("Ruby"))
			ResponseBoxes(driver, 6);
		else
			ResponseBoxes(driver, 5);
		
		//log(detail, driver, url, temp);
		
		
//		temp = driver.findElements(By.name(getRefundRadio));
//		temp.get(indexTrxID).click();
		
		driver.findElements(By.xpath("//input[@name='"+getRefundRadio+"']")).get(0).click();
		
		log.InnerWrite("Get Subscription Cancel: \n");
		driver.findElement(By.xpath("//button[@name='"+cancel+"']")).click();
		if (url.contains("Java"))
			ResponseBoxes(driver, 6);
		
		else if (url.contains("Ruby"))
			ResponseBoxes(driver, 8);
		
		else
			ResponseBoxes(driver, 1);
		
		//log(cancel, driver, url, temp);
		
		driver.findElements(By.xpath("//input[@name='"+getRefundRadio+"']")).get(0).click();
		
		log.InnerWrite("Get Subscription Refund: \n");
		driver.findElement(By.xpath("//button[@name='"+refund+"']")).click();
		
		
		if (url.contains("Ruby"))
			ResponseBoxes(driver, 8);
		else
			ResponseBoxes(driver, 6);
		
		//log(refund, driver, url, temp);
		
		driver.findElement(By.xpath("//button[@name='refreshNotifications']")).click();
	
		}
		
      /*  }
		catch (NoSuchElementException e){
			System.out.println(e);
			System.out.println("");
			
		}*/
		
		Thread.sleep(35000);
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
			if (e.getText().contains("IsSuccess"))
				System.out.println(e.getText());
			
		}
		
	}
	
	public void ResponseBoxes(WebDriver driver, int num) throws IOException{
		
		if (num != 1 && num != 6 && num != 5){
			if (driver.findElements(By.xpath("//*[@id='container']/div["+ num +"]")).size() != 0){
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='container']/div["+ num +"]")).getText());
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='container']/div["+ (num+1) +"]/table")).getText());
			}	
			else 
				log.InnerWrite(driver.findElement(By.xpath("//*[@id='container']/div["+ (num+1) +"]")).getText());
		}
		else if (num == 5){
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


