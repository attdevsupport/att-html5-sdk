package RESTfulSampleApps.sampleApp;

import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;


//Globally used variables and methods encompassing String used multiple times through out the testing framework.
//Additionally, includes a method displaying the response visible in the GUI of application and auth flow method for global use.

public class Global {

	//variables used throughout the testing framework
	public String webDriverDir = "C:\\SDK\\chromedriver_win_22_0_1203_0b\\chromedriver.exe";
	public String helloJpg = "C:\\SDK\\ErikFramework\\hello.jpg";
	public String audioFile = "C:\\SDK\\ErikFramework\\RESTful\\RESTfulSampleApps\\sampleApp\\resource\\Starbucks.amr";
	
	//C:\SDK\ErikFramework
	
	public String phoneNumber = "4252863726";
	public String impPhone = "123456789";
	public String mp3Url = "http://bfsdktest.net63.net/CMS/music.mp3";
	public String authFlowUser = "prodDanny99";
	public String authFlowPass = "welcome1";
	public String headerCount = "5";
	public String indexCursor = "I:200:,u:13:,S:417:, r:11000:,";
	public String impHeaderCount = "-1";
	public String impIndexCursor = "abc123";
	
	
	//displaying response to console
    public boolean ResponseDisplay(String url, WebDriver driver) throws IOException{
    	RESTfulSampleApps.sampleApp.Log log = new RESTfulSampleApps.sampleApp.Log();
    	
    	List<WebElement> responses;
    	Iterator<WebElement> it;
    	WebElement we;
    	boolean response = false;
    	
    	String successWide = "successWide";
    	String errorWide = "errorWide";
    	
    	
    	String success = "success";
    	String error = "error";
    	
    	if (url.contains("PHP-RESTful/IMMN")){
    		successWide = success;
    		errorWide = error;
    	}
    	
    	if (url.contains("PHP-RESTful/SMS") || (url.contains("PHP-RESTful/MMS/app1"))){
    		success = success;
    		error = error;
    		
    	}
    	
    	if (url.contains("SMS/app2")){
    		successWide = success;
    		errorWide = error;
    	}
    	
    	if (url.contains("Csharp") || url.contains("Vb")){
    		responses = driver.findElements(By.xpath("//td/../.."));
    		
             it = responses.iterator();
            
            while (it.hasNext()) {
            	we = it.next();
            	
		    	if (we.getText().contains("ERROR:")){
		    		response = false;
		    		log.InnerWrite(we.getText());
		    		log.InnerWrite("");
		    		
		    	}
		    	
		    	if (we.getText().contains("SUCCESS:")){
		    		response = true;
		    		log.InnerWrite(we.getText());
		    		log.InnerWrite("");
		    		
		    		
		    		
		    	}
            }
    	}
    	
	    else if (!url.contains("Csharp") || !url.contains("Vb")){
    		responses = driver.findElements(By.tagName("strong"));
    		
    		try{
    			
    		for (int i = 0; i < responses.size(); i ++){
	    	if (responses.get(i).getText().toUpperCase().contains("ERROR")){
	    		response = false;
	    		if (driver.findElement(By.xpath("//div[@class='errorWide']")).isDisplayed()){
		    		log.InnerWrite(driver.findElement(By.xpath("//div[@class='errorWide']")).getText());
		    		log.InnerWrite("\n");
	    		}
	    	}
	    	
	    	if (responses.get(i).getText().toUpperCase().contains("SUCCESS")){
	    		response = true;
	    		if (driver.findElement(By.xpath("//div[@class='successWide']")).isDisplayed()){
	    			log.InnerWrite(driver.findElement(By.xpath("//div[@class='successWide']")).getText());
	    			log.InnerWrite("\n");
	    		
	    		}
	    	
	    			
	    		}
	    		}
    		}
    		
	    		catch (NoSuchElementException e){
	    			System.out.println(e);
	    			
	    			
	    		}
	    		
	    	}
    		
    		
    		return response;
    	}
    
    public void Log (String input){
    	
    	
    	
    	
    }
    
    
    //authorization flow automation
    public void AuthFlow(WebDriver driver, String url) throws InterruptedException{
    	
        driver.findElement(By.linkText("Sign In to another account")).click();
        driver.findElement(By.name("login[username]")).sendKeys(authFlowUser);
        driver.findElement(By.name("login[password]")).sendKeys(authFlowPass);
        driver.findElement(By.linkText("Allow")).click();
        
        if (url.contains("TL") || (url.contains("IMMN")))
        	driver.findElement(By.linkText("Close window")).click();
        
        
        Thread.sleep(5000);
//        if (url.toLowerCase().contains("payment"))
//        	driver.findElement(By.linkText("Continue")).click();
//        
//        else
//        	driver.findElement(By.linkText("Close window")).click();
    	
    }

     //MIM workaround authorization flow automation
      public void MimAuthFlow(WebDriver driver, String url){
        	
    	  driver.findElement(By.linkText("Sign In to another account")).click();
          driver.findElement(By.name("login[username]")).sendKeys("ph4258028620@gmail.com");
          driver.findElement(By.name("login[password]")).sendKeys("welcome1");
          driver.findElement(By.linkText("Allow")).click();
            
          if (url.toLowerCase().contains("payment"))
        	  driver.findElement(By.linkText("Continue")).click();
            
          else
        	  driver.findElement(By.linkText("Close window")).click();  
        
      
    }
    
    
    	}

	

