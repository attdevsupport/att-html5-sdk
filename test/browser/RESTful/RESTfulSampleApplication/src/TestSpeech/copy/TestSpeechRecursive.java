package TestSpeech.copy;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.Select;



public class TestSpeechRecursive extends Speech_Variables{
	
	RESTfulSampleApps.sampleApp.Log log = new RESTfulSampleApps.sampleApp.Log();
	RESTfulSampleApps.sampleApp.Global global = new RESTfulSampleApps.sampleApp.Global();
	
 	int counterFile = 0;
	int counterContext = 0;
	int counter = 0;
	
	
	public void Execute (String url, String contextName, String audioFileName, boolean chunked) throws IOException{			
		
		
		if (counter < Audio_File_List().size()){
			
			String tempVarString;
	        System.setProperty("webdriver.chrome.driver", global.webDriverDir);
	        WebDriver driver = new ChromeDriver();
	        driver.get(url);
	        log.HeaderWrite(url);   
			
			
	        //try{	
	 			 
	        	tempVarString = ResourceLoaded(url);
	        	
	        	log.InnerWrite("....." + tempVarString + "\r\n");
	        	
	        	if (Integer.parseInt(tempVarString.substring(0, 1)) != 2){
	        		log.InnerWrite("Server returned " + tempVarString + ".  Terminating test for " + url);
	        		driver.quit();
	        	}
	        	        		        		
		       /* if(counter == 0)
		        	Integrity_Check(driver, contextName, audioFileName);*/
	        	
		  
				   Select context = new Select(driver.findElement(By.xpath("//select[@name='" + contextName + "']")));
				   
				   if (url.contains("mssdk")){
					   driver.findElement(By.xpath(("//input[@name='" + audioFileName + "']"))).sendKeys(global.audioFile);
					   //driver.findElement(By.xpath(("//input[@name='" + audioFileName + "']")));
					   
					   
					   
					   ///////////////////////////				   
					   
				   }
				  
				   else{
					   Select audioFile = new Select(driver.findElement(By.xpath("//select[@name='" + audioFileName + "']")));
					   audioFile.selectByIndex(counterFile);
					   tempVarString = audioFile.getFirstSelectedOption().getText();
				   }
				   
				        if (chunked)
			        	driver.findElement(By.xpath("//input[@value='Send Chunked']")).click();
			        	
			        	context.selectByIndex(counterContext);
			        	
			        	
			        	tempVarString = context.getFirstSelectedOption().getText();
			        	log.InnerWrite("Using ["+ tempVarString +"] for Context");
			       
			        	
			        	log.InnerWrite("Using ["+ tempVarString +"] for Audio File");
			        	
			        	if (url.contains("csharp") || url.contains("vb")){
				  	    	  driver.findElement(By.xpath("//input[@type='submit']")).click();
				  	    	  
				  	    	  
				  	    	  if (global.ResponseDisplay(url, driver) == true){
				  	    	  	System.out.println(driver.findElement(By.id("resultsPanel")).getText());
				  	    	  	log.InnerWrite(driver.findElement(By.id("resultsPanel")).getText());
					      }
			        	}
			        	 else {
				  	    	  driver.findElement(By.xpath("//button[@type='submit']")).click();
				  	    	  
				  	    	  if (global.ResponseDisplay(url, driver) == true){
				  	    	  	System.out.println(driver.findElement(By.xpath("//table[@class='kvp']")).getText());
				  	    	  	log.InnerWrite(driver.findElement(By.xpath("//table[@class='kvp']")).getText());
				  	      }
			        	 }
				   
				        
				  	      
				  	      counterFile++;
				  	      counterContext = counterFile-1;
				  	      
				          driver.quit();
			        	
				          counter++;
				          
				  	    Execute(url, contextName, audioFileName, chunked);
		
				        

	        	
        }
//	        
//					catch (NoSuchElementException e){
//						System.out.println(e);
//						System.out.println("");
//					
//					}
			
		
			counter = 0;
			counterContext = 0;
			counterFile = 0;
			
		}
	
	private int Integrity_Check(WebDriver driver, String contextName, String audioFileName) throws IOException{
		
		String tempVarString = TagCheck(driver);
		int tempVarInt = 0;

		log.InnerWrite(tempVarString + " *****" + "\r\n");
		log.InnerWrite(ContextCheck(driver, contextName) + " *****" + "\r\n");
		log.InnerWrite(AudioFileCheck(driver, audioFileName) + " *****" + "\r\n");
		log.InnerWrite(ChunkedCheck(driver) + " *****" + "\r\n");
		log.InnerWrite(XArgCheck(driver) + " *****" + "\r\n");
		
		
		return tempVarInt;
		
	}
	
	private String TagCheck(WebDriver driver) throws IOException{
		int tagFailCount = 0;
		boolean testSuccess = true;
		String testName = "TAG TEST PASSED: ";
		String result = "";
		String failLoc = "";
		
		log.InnerWrite("***** TEST: COMPARING TAGS\r\n");
		
		if (driver.findElements(By.xpath("//select[@name='SpeechContext']")).size() == 0){
			log.InnerWrite("XPATH Element :" + "\"//select[@name='SpeechContext']\"" + " NOT FOUND.");
			failLoc = failLoc + "SpeechContext".concat(", ");
			tagFailCount++;
		}
		
		else
			log.InnerWrite("XPATH Element :" + "\"//select[@name='SpeechContext']\"" + " FOUND.");
		
		if (driver.findElements(By.xpath("//select[@name='audio_file']")).size() == 0){
			log.InnerWrite("XPATH Element :" + "\"//select[@name='audio_file']\"" + " NOT FOUND.");
			failLoc = failLoc + "audio_file".concat(", ");
			tagFailCount++;
		}
		
		else
			log.InnerWrite("XPATH Element :" + "\"//select[@name='audio_file']\"" + " FOUND.");
		
		if (driver.findElements(By.xpath("//input[@name='chkChunked']")).size() == 0){
			log.InnerWrite("XPATH Element :" + "\"//input[@name='chkChunked']\"" + " NOT FOUND.");
			failLoc = failLoc + "chkChunked".concat(", ");
			tagFailCount++;
		}
		
		else
			log.InnerWrite("XPATH Element :" + "\"//input[@name='chkChunked']\"" + " FOUND.");
		
		if (driver.findElements(By.xpath("//textarea[@name='x_arg']")).size() == 0){
			log.InnerWrite("XPATH Element :" + "\"//textarea[@name='x_arg']\"" + " NOT FOUND.");
			failLoc = failLoc + "x-arg".concat(", ");
			tagFailCount++;
		}
		
		else
			log.InnerWrite("XPATH Element :" + "\"//textarea[@name='x_arg']\"" + " FOUND.");
		
		if (driver.findElements(By.xpath("//button[@name='SpeechToText']")).size() == 0){
			log.InnerWrite("XPATH Element :" + "\"//button[@name='SpeechToText']\"" + " NOT FOUND.");
			failLoc = failLoc + "SpeechToText".concat(", ");
			tagFailCount++;
		}
		
		else
			log.InnerWrite("XPATH Element :" + "\"//button[@name='SpeechToText']\"" + " FOUND.");
		
		
		if (tagFailCount > 0){
			testSuccess = false;
			
			result = testName + testSuccess + "\r\n\r\n Failed At: " + failLoc;
		}
		
		else{
			testSuccess = true;
		
			result = "\r\n" + testName + testSuccess;
		}
		
		return result;
	}
	
	
	private String ContextCheck(WebDriver driver, String contextName) throws IOException{
		
		int optionFailCount = 0;
		boolean testSuccess = true;
		String testName = "CONTEXT LIST TEST PASSED: ";
		String result = "";
		String failLoc = "";
		List<String> contextList = Context_List();
		
		List<String> tempList;

		try{
		log.InnerWrite("***** TEST: COMPARING CONTEXT OPTIONS\r\n");
		
		tempList = StringifyList(driver, contextName);
		
		for(int i = 0; i < contextList.size(); i++){
			log.InnerWrite(tempList.get(i) + "/" + contextList.get(i));
			
			if (!tempList.get(i).contains(contextList.get(i))){
				optionFailCount++;
				failLoc = failLoc + (tempList.get(i) + "/" + contextList.get(i).concat(", "));
			}
		}
		
		if (optionFailCount > 0){
			testSuccess = false;
			result = "\r\n" + testName + testSuccess + " ==== Failed At: " + failLoc;
		}
			
		
		else{
			testSuccess = true;
		
			result = "\r\n" + testName + testSuccess;
		
		}
		
		}
		catch (IOException e){
			System.out.println(e);
		}
		
		return result;
	}
	
	private String AudioFileCheck(WebDriver driver, String audioFileName){
		int optionFailCount = 0;
		boolean testSuccess = true;
		String testName = "AUDIO FILE LIST TEST PASSED: ";
		String result = "";
		String failLoc = "";
		List<String> audioFileList = Audio_File_List();
		List<String> tempList;

		try{
		log.InnerWrite("***** TEST: COMPARING AUDIO FILE OPTIONS\r\n");
		
		tempList = StringifyList(driver, audioFileName);
		
		for(int i = 0; i < audioFileList.size(); i++){
			log.InnerWrite(tempList.get(i) + "/" + audioFileList.get(i));
			
			if (!tempList.get(i).contains(audioFileList.get(i))){
				optionFailCount++;
				failLoc = failLoc + (tempList.get(i) + "/" + audioFileList.get(i).concat(", "));
			}
		}
		
		if (optionFailCount > 0){
			testSuccess = false;
			result = testName + testSuccess + "\r\n\r\n Failed At: " + failLoc;
		}
			
		
		else{
			testSuccess = true;
		
			result = "\r\n" + testName + testSuccess;
		}
		
		}
		catch (IOException e){
			System.out.println(e);
		}
		
		return result;
	}
	
	private String ChunkedCheck(WebDriver driver) throws IOException{
		
		String testName = "CHUNKED BOX CHECK TEST PASSED: ";
		String result = "";
		boolean testSuccess = true;
		
		log.InnerWrite("***** TEST: CHUNK BOX UNCHECKED\r\n");
		
		if (driver.findElement(By.tagName("input")).isSelected()){
			log.InnerWrite("\"CHUNKED\" WAS CHECKED.");
			testSuccess = false;
		}
			
		else
			testSuccess = true;
		
		result = "\r\n" + testName + testSuccess;
		
		return result;

	}
	
	private String XArgCheck(WebDriver driver) throws IOException{
		int xargFailCount = 0;
		String testName = "X-ARG TEXT BOX CHECK TEST PASSED: ";
		String result = "";
		String failLoc = "";
		
		boolean testSuccess = true;
		
		log.InnerWrite("***** TEST: X-ARG TEXT BOX PROPERTIES\r\n");
		
		if (driver.findElement(By.tagName("textarea")).isEnabled()){
			log.InnerWrite("textarea WAS ABLE TO BE EDITED.");
			xargFailCount++;
			failLoc = failLoc + "EDITABLE".concat(", ");
		}
		
		if (!driver.findElement(By.tagName("textarea")).getText().contains("test=123")){
			log.InnerWrite("textarea DID NOT HAVE THE CORRECT VALUES POPULATED. (test=123)");
			xargFailCount++;
			failLoc = failLoc + "INCORRECT VALUES POPULATED".concat(", ");
		}
			
		if (xargFailCount > 0){
				testSuccess = false;
				result = testName + testSuccess + "\r\n\r\n Failed At: " + failLoc;
			
		}
		
		else{
			testSuccess = true;
			
			log.InnerWrite(driver.findElement(By.tagName("textarea")).getText());
			result = "\r\n" + testName + testSuccess;
		
		}
		
		return result;
	}
	
	private List<String> StringifyList(WebDriver driver, String optionsList){
		
		List<WebElement> tempListWeb = new ArrayList<WebElement>();
		List<String> tempListString = new ArrayList<String>();
		
		tempListWeb = new Select(driver.findElement(By.xpath("//select[@name='"+ optionsList +"']"))).getOptions();
		
		for(WebElement e : tempListWeb){
			tempListString.add(e.getText());
		}
		
		return tempListString;
	}
	
	private String ResourceLoaded(String url) throws IOException{
		int responseCode;
		String responseMessage;
		
		URL urlFormatted = new URL(url);
		HttpURLConnection connection = (HttpURLConnection) urlFormatted.openConnection();
		responseCode = connection.getResponseCode();
		responseMessage = connection.getResponseMessage();
		responseMessage = responseCode + ":" + responseMessage;
		
		return responseMessage;
	}
	
	
}


