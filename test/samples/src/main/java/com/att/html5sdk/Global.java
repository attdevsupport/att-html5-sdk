package com.att.html5sdk;

import java.awt.Desktop;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URLDecoder;
import java.sql.Timestamp;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.support.ui.Select;

/**
 * @class Global
 * Variables and methods used throughout the testing framework
 */
public class Global {
	
	public String phoneNumber = "4252863726";
	public String impPhone = "123456789";
	public String webDriverDir = URLDecoder.decode(this.getClass().getResource("/chromedriver.exe").getPath());
	public String authFlowUser = "prodDanny99";
	public String authFlowPass = "welcome1";
	public String urlToPlay = "http://testappdc.net76.net/CMS/music.mp3";
	public String message = "Sample Apps tests by Yana";
	public String subject = "IMMN Send Message";
	
	// MIM
	public String index = "I:200:,u:13:,S:417:, r:11000:,";
	public String authFlowUserWorkaround = "ph4258028620@gmail.com";
	public String partNum = "0";
	public String invHeader = "ABC";
	
	public String helloJpg = "C:\\SDK\\ErikFramework\\hello.jpg";
	public String audioFile = "C:\\SDK\\ErikFramework\\RESTful\\RESTfulSampleApps\\sampleApp\\resource\\Starbucks.amr";
	
	public String mp3Url = "http://bfsdktest.net63.net/CMS/music.mp3";
	public String headerCount = "5";
	public String indexCursor = "I:200:,u:13:,S:417:, r:11000:,";
	public String impHeaderCount = "-1";
	public String impIndexCursor = "abc123";

  /**
   * @method AuthFlow
   * authorization flow automation
   */
  public void AuthFlow(WebDriver driver, String url) throws InterruptedException
  {
    driver.findElement(By.linkText("Sign In to another account")).click();
    driver.findElement(By.name("login[username]")).sendKeys(authFlowUser);
    driver.findElement(By.name("login[password]")).sendKeys(authFlowPass);
    driver.findElement(By.linkText("Allow")).click();
    
    if (url.contains("TL") || (url.contains("IMMN"))) {
      driver.findElement(By.linkText("Close window")).click();
    }
    Thread.sleep(5000);
    
//        if (url.toLowerCase().contains("payment"))
//        	driver.findElement(By.linkText("Continue")).click();
//        else
//        	driver.findElement(By.linkText("Close window")).click();
  }

  /**
   * @method MimAuthFlow
   * MIM workaround authorization flow automation
   */
  public void MimAuthFlow(WebDriver driver, String url)
  {
    driver.findElement(By.linkText("Sign In to another account")).click();
    driver.findElement(By.name("login[username]")).sendKeys("ph4258028620@gmail.com");
    driver.findElement(By.name("login[password]")).sendKeys("welcome1");
    driver.findElement(By.linkText("Allow")).click();
        
    if (url.toLowerCase().contains("payment")) {
      driver.findElement(By.linkText("Continue")).click();
    }
    else {
      driver.findElement(By.linkText("Close window")).click();  
    }
  }

	
  //
  // DO NOT USE ANYTHING BELOW THIS POINT IN NEW CODE
  //
  // This code is kept so legacy code will continue to compile
  // until it has all been converted to use the logging above,
  // at which point the code below can be removed. (And this
  // class will no longer need to derive from 'Global'.)
  //
  
	
	/// Create File /////
  Date date = new Date();
	public void CreateFile(String tempVar) throws InterruptedException, IOException
  {
    try {
      FileWriter fw = new FileWriter ("html5sdk.log", true);
      BufferedWriter out = new BufferedWriter (fw);
      out.append(new Timestamp(date.getTime()) + ": " + tempVar);
      out.close();
    } 
    catch (Exception e) {
      System.err.print ("Error " + e.getMessage());
    }
	}

	////////EndPoints///////////////////
	//CMS
	public String CMS1Java = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-SDK/CMS/App1/index.html";
	public String CMS1Ruby = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-SDK/CMS/App1/index.html";
	public String CMS1PHP = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-SDK/CMS/App1/index.html";
	//IMMN
	public String IMMN1Java = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-SDK/IMMN/App1/index.html";
	public String IMMN1Ruby = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-SDK/IMMN/App1/index.html";
	public String IMMN1PHP = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-SDK/IMMN/App1/index.html";
	//MIM
	public String MIM1Java = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-SDK/MIM/App1/index.html";
	public String MIM1Ruby = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-SDK/MIM/App1/index.html";
	public String MIM1PHP = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-SDK/MIM/App1/index.html";
	//MMS1
	public String MMS1Java = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-SDK/MMS/App1/index.html";
	public String MMS1Ruby = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-SDK/MMS/App1/index.html";
	public String MMS1PHP  = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-SDK/MMS/App1/index.html";
	//MMS2
	public String MMS2Java = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-SDK/MMS/App2/index.html";
	public String MMS2Ruby = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-SDK/MMS/App2/index.html";
	public String MMS2PHP = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-SDK/MMS/App2/index.html";	
	//Notary
	public String Notary1Java = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-SDK/Notary/App1/index.html";
	public String Notary1Ruby = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-SDK/Notary/App1/index.html";
	public String Notary1PHP = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-SDK/Notary/App1/index.html";	
	//Payment1
	public String Payment1Java = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-SDK/Payment/App1/index.html";
	public String Payment1Ruby = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-SDK/Payment/App1/index.html";
	public String Payment1PHP = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-SDK/Payment/App1/index.html";	
	//Payment2
	public String Payment2Java = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-SDK/Payment/App2/index.html";
	public String Payment2Ruby = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-SDK/Payment/App2/index.html";
	public String Payment2PHP  = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-SDK/Payment/App2/index.html";	
	//SMS1
	public String SMS1Java = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-SDK/SMS/App1/index.html";
	public String SMS1Ruby = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-SDK/SMS/App1/index.html";
	public String SMS1PHP = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-SDK/SMS/App1/index.html";
	//SMS2
	public String SMS2Java = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-SDK/SMS/App2/index.html";
	public String SMS2Ruby = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-SDK/SMS/App2/index.html";
	public String SMS2PHP = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-SDK/SMS/App2/index.html";
	//Speech
	public String Speech1Java = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-SDK/Speech/App1/index.html";
	public String Speech1Ruby = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-SDK/Speech/App1/index.html";
	public String Speech1PHP = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-SDK/Speech/App1/index.html";
	//TL
	public String TL1Java = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-SDK/TL/App1/index.html";
	public String TL1Ruby = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-SDK/TL/App1/index.html";
	public String TL1PHP = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-SDK/TL/App1/index.html";
	//WAPPush
	public String WAPPush1Java = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-SDK/WAPPush/App1/index.html";
	public String WAPPush1Ruby  = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-SDK/WAPPush/App1/index.html";
	public String WAPPush1PHP = "https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-SDK/WAPPush/App1/index.html";
			
	
	//displaying response to console
  public boolean ResponseDisplay(String url, WebDriver driver) throws IOException
  {
    Log log = new Log();
    List<WebElement> responses;
    Iterator<WebElement> it;
    WebElement we;
    boolean response = false;
    String successWide = "successWide";
    String errorWide = "errorWide";
    String success = "success";
    String error = "error";
    	
    if (url.contains("PHP-RESTful/IMMN")) {
      successWide = success;
      errorWide = error;
    }
    if (url.contains("PHP-RESTful/SMS") || (url.contains("PHP-RESTful/MMS/app1"))) {
      success = success;
      error = error;
    }
    	
    if (url.contains("SMS/app2")) {
      successWide = success;
      errorWide = error;
    }
    	
    if (url.contains("Csharp") || url.contains("Vb")) {
      responses = driver.findElements(By.xpath("//td/../.."));
      it = responses.iterator();
      while (it.hasNext()) {
        we = it.next();
        if (we.getText().contains("ERROR:")) {
          response = false;
          log.InnerWrite(we.getText());
          log.InnerWrite("");
        }
        if (we.getText().contains("SUCCESS:")) {
          response = true;
          log.InnerWrite(we.getText());
          log.InnerWrite("");
        }
      }
    }
    else if (!url.contains("Csharp") || !url.contains("Vb")) {
      responses = driver.findElements(By.tagName("strong"));
      try {
        for (int i = 0; i < responses.size(); i ++) {
          if (responses.get(i).getText().toUpperCase().contains("ERROR")) {
            response = false;
            if (driver.findElement(By.xpath("//div[@class='errorWide']")).isDisplayed()) {
              log.InnerWrite(driver.findElement(By.xpath("//div[@class='errorWide']")).getText());
              log.InnerWrite("\n");
            }
          }
          if (responses.get(i).getText().toUpperCase().contains("SUCCESS")) {
            response = true;
            if (driver.findElement(By.xpath("//div[@class='successWide']")).isDisplayed()) {
              log.InnerWrite(driver.findElement(By.xpath("//div[@class='successWide']")).getText());
              log.InnerWrite("\n");
            }
          }
        }
      }
      catch (NoSuchElementException e) {
        System.out.println(e);
      }
    }
    return response;
  }
    
  public void Log (String input)
  {
  }
}