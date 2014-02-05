package com.att.html5sdk;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.Logger;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;


public class TestSpeechRecursive extends Speech_Variables
{
  Logger log = Log.getLogger();
  Global global = new Global();
  String url = "http://localhost:4567/Speech/App1/index.html";
	
	public void Execute () throws IOException
  {
    Boolean chunked = true;
    Boolean custom = false;
    int contextIndex = 0;

    log.info(url);   

    System.setProperty("webdriver.chrome.driver", global.webDriverDir);
    WebDriver driver = new ChromeDriver();
    try
    {
      WebDriverWait wait = new WebDriverWait(driver,10);

      // iterate through a selection of parameter combinations from the
      // speech to text sample UI
      for (int fileIndex = 0; fileIndex < Audio_File_List().size(); fileIndex++) {
      
        String contextName = Context_List().get(contextIndex++);
        String audioFileName = Audio_File_List().get(fileIndex);
        chunked = !chunked;
        custom = !custom;
        
        if (contextIndex >= Context_List().size()) {
          contextIndex = 0;
        }

        log.info("speech to text: context(" + contextName + "), file(" + audioFileName + "), chunked(" + chunked.toString() + ")");
      
        // navigate to the sample page
        driver.get(url);

        // select the desired options from the listboxes
        SelectFromListbox(driver, wait, "context", contextName);
        SelectFromListbox(driver, wait, "file", audioFileName);
       
        if (chunked) {
          driver.findElement(By.cssSelector("input[name=chunked] + div.x-field-mask")).click();
        }
        if (custom) {
          driver.findElement(By.cssSelector("input[name=customDictionary] + div.x-field-mask")).click();
        }
        
        // submit the speech to text request and process the response
        driver.findElement(By.className("x-button")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.success + div")));
        log.info(driver.findElement(By.cssSelector("div.success + div")).getText());
      }
    }
    finally
    {
      driver.quit();
    }
  }
	
  private void SelectFromListbox(WebDriver driver, WebDriverWait wait, String type, String instance)
  {
    // ExtJS 'covers' the input element with a div, so Selenium won't let us click the input directly.
    // instead we use the selector to get the covering div, and click on that instead.
    wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("input[name=" + type + "] + div.x-field-mask"))).click();
    wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.x-list-item")));
    List<WebElement> listitems = driver.findElements(By.cssSelector("div.x-list-item"));
    log.debug("instance[" + instance + "]");
    for (WebElement element : listitems) {
      log.debug("text[" + element.getText() + "]");
      if (element.getText().equals(instance)) {
        element.click();
        wait.until(ExpectedConditions.not(ExpectedConditions.visibilityOf(element)));
        break;
      }
    }
  }
  
	private void Integrity_Check(WebDriver driver, String contextName, String audioFileName) throws IOException{
		
		log.info(TagCheck(driver));
		// log.info(ContextCheck(driver, contextName));
		// log.info(AudioFileCheck(driver, audioFileName));
		log.info(ChunkedCheck(driver));
		log.info(XArgCheck(driver));
	}
	
	private String TagCheck(WebDriver driver) throws IOException{
		int tagFailCount = 0;
		boolean testSuccess = true;
		String testName = "TAG TEST PASSED: ";
		String result = "";
		String failLoc = "";
		
		log.info("***** TEST: COMPARING TAGS\r\n");
		
		if (driver.findElements(By.xpath("//select[@name='SpeechContext']")).size() == 0){
			log.info("XPATH Element :" + "\"//select[@name='SpeechContext']\"" + " NOT FOUND.");
			failLoc = failLoc + "SpeechContext".concat(", ");
			tagFailCount++;
		}
		
		else
			log.info("XPATH Element :" + "\"//select[@name='SpeechContext']\"" + " FOUND.");
		
		if (driver.findElements(By.xpath("//select[@name='audio_file']")).size() == 0){
			log.info("XPATH Element :" + "\"//select[@name='audio_file']\"" + " NOT FOUND.");
			failLoc = failLoc + "audio_file".concat(", ");
			tagFailCount++;
		}
		
		else
			log.info("XPATH Element :" + "\"//select[@name='audio_file']\"" + " FOUND.");
		
		if (driver.findElements(By.xpath("//input[@name='chkChunked']")).size() == 0){
			log.info("XPATH Element :" + "\"//input[@name='chkChunked']\"" + " NOT FOUND.");
			failLoc = failLoc + "chkChunked".concat(", ");
			tagFailCount++;
		}
		
		else
			log.info("XPATH Element :" + "\"//input[@name='chkChunked']\"" + " FOUND.");
		
		if (driver.findElements(By.xpath("//textarea[@name='x_arg']")).size() == 0){
			log.info("XPATH Element :" + "\"//textarea[@name='x_arg']\"" + " NOT FOUND.");
			failLoc = failLoc + "x-arg".concat(", ");
			tagFailCount++;
		}
		
		else
			log.info("XPATH Element :" + "\"//textarea[@name='x_arg']\"" + " FOUND.");
		
		if (driver.findElements(By.xpath("//button[@name='SpeechToText']")).size() == 0){
			log.info("XPATH Element :" + "\"//button[@name='SpeechToText']\"" + " NOT FOUND.");
			failLoc = failLoc + "SpeechToText".concat(", ");
			tagFailCount++;
		}
		
		else
			log.info("XPATH Element :" + "\"//button[@name='SpeechToText']\"" + " FOUND.");
		
		
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
	
	
	// private String ContextCheck(WebDriver driver, String contextName) throws IOException{
		
		// int optionFailCount = 0;
		// boolean testSuccess = true;
		// String testName = "CONTEXT LIST TEST PASSED: ";
		// String result = "";
		// String failLoc = "";
		// List<String> contextList = Context_List();
		
		// List<String> tempList;

		// log.info("***** TEST: COMPARING CONTEXT OPTIONS\r\n");
		
		// tempList = StringifyList(driver, contextName);
		
		// for(int i = 0; i < contextList.size(); i++){
			// log.info(tempList.get(i) + "/" + contextList.get(i));
			
			// if (!tempList.get(i).contains(contextList.get(i))){
				// optionFailCount++;
				// failLoc = failLoc + (tempList.get(i) + "/" + contextList.get(i).concat(", "));
			// }
		// }
		
		// if (optionFailCount > 0){
			// testSuccess = false;
			// result = "\r\n" + testName + testSuccess + " ==== Failed At: " + failLoc;
		// }
		// else{
			// testSuccess = true;
			// result = "\r\n" + testName + testSuccess;
		// }
		// return result;
	// }
	
	// private String AudioFileCheck(WebDriver driver, String audioFileName){
		// int optionFailCount = 0;
		// boolean testSuccess = true;
		// String testName = "AUDIO FILE LIST TEST PASSED: ";
		// String result = "";
		// String failLoc = "";
		// List<String> audioFileList = Audio_File_List();
		// List<String> tempList;

		// log.info("***** TEST: COMPARING AUDIO FILE OPTIONS\r\n");
		
		// tempList = StringifyList(driver, audioFileName);
		
		// for(int i = 0; i < audioFileList.size(); i++){
			// log.info(tempList.get(i) + "/" + audioFileList.get(i));
			
			// if (!tempList.get(i).contains(audioFileList.get(i))){
				// optionFailCount++;
				// failLoc = failLoc + (tempList.get(i) + "/" + audioFileList.get(i).concat(", "));
			// }
		// }
		
		// if (optionFailCount > 0){
			// testSuccess = false;
			// result = testName + testSuccess + "\r\n\r\n Failed At: " + failLoc;
		// }
		// else{
			// testSuccess = true;
			// result = "\r\n" + testName + testSuccess;
		// }
		// return result;
	// }
	
	private String ChunkedCheck(WebDriver driver) throws IOException{
		
		String testName = "CHUNKED BOX CHECK TEST PASSED: ";
		String result = "";
		boolean testSuccess = true;
		
		log.info("***** TEST: CHUNK BOX UNCHECKED\r\n");
		
		if (driver.findElement(By.tagName("input")).isSelected()){
			log.info("\"CHUNKED\" WAS CHECKED.");
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
		
		log.info("***** TEST: X-ARG TEXT BOX PROPERTIES\r\n");
		
		if (driver.findElement(By.tagName("textarea")).isEnabled()){
			log.info("textarea WAS ABLE TO BE EDITED.");
			xargFailCount++;
			failLoc = failLoc + "EDITABLE".concat(", ");
		}
		
		if (!driver.findElement(By.tagName("textarea")).getText().contains("test=123")){
			log.info("textarea DID NOT HAVE THE CORRECT VALUES POPULATED. (test=123)");
			xargFailCount++;
			failLoc = failLoc + "INCORRECT VALUES POPULATED".concat(", ");
		}
			
		if (xargFailCount > 0){
				testSuccess = false;
				result = testName + testSuccess + "\r\n\r\n Failed At: " + failLoc;
			
		}
		
		else{
			testSuccess = true;
			
			log.info(driver.findElement(By.tagName("textarea")).getText());
			result = "\r\n" + testName + testSuccess;
		
		}
		
		return result;
	}
	
	// private List<String> StringifyList(WebDriver driver, String optionsList){
		
		// List<WebElement> tempListWeb = new ArrayList<WebElement>();
		// List<String> tempListString = new ArrayList<String>();
		
		// tempListWeb = new Select(driver.findElement(By.xpath("//select[@name='"+ optionsList +"']"))).getOptions();
		
		// for(WebElement e : tempListWeb){
			// tempListString.add(e.getText());
		// }
		
		// return tempListString;
	// }
	
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


