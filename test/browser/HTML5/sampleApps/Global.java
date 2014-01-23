package sampleApps;

import java.awt.Desktop;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class Global {
	
	public String phoneNumber = "4252863726";
	public String impPhone = "123456789";
	public String webDriverDir = "C:\\SDK\\chromedriver_win_22_0_1203_0b\\chromedriver.exe";
	public String authFlowUser = "prodDanny99";
	public String authFlowPass = "welcome1";
	public String urlToPlay = "http://testappdc.net76.net/CMS/music.mp3";
	public String message = "Sample Apps tests by Yana";
	public String subject = "IMMN Send Message";
	Date date = new Date();

	/// Create File /////
	public void CreateFile(String tempVar) throws InterruptedException, IOException{
	try{
		FileWriter fw = new FileWriter ("C:\\HTML5 SampleApps.txt", true);
		BufferedWriter out = new BufferedWriter (fw);
		out.append(new Timestamp(date.getTime()) + ": " + tempVar);
		out.close();
	} catch (Exception e) {
		System.err.print ("Error " + e.getMessage());
	}
	}

	
	/*/// To locate elements ////
	public boolean isElementPresent(String locator, String locatorType){
		if (getWebElements(locator, locatorType).isEmpty()) {
			return false;
		} else {
			return true;
		}
		}
		
	public boolean isVisible (String locator, String locatorType) {
		boolean visibility = false;
		if (isElementPresent(locator, locatorType)) {
			visibility = 
					getWebElement(locator, locatorType).isDisplayed();
		}
		return visibility;
		}
	
	
	public WebElement getWebElement(String locator, String locatorType) {
		// TODO Auto-generated method stub
		return null;
	}
	
	
	public String getWebElements(String locator, String locatorType) {
		// TODO Auto-generated method stub
		return null;
	}*/

	// MIM
	public String index = "I:200:,u:13:,S:417:, r:11000:,";
	public String authFlowUserWorkaround = "ph4258028620@gmail.com";
	public String partNum = "0";
	public String invHeader = "ABC";
	
	
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
			
	
	
    	}
   

	

