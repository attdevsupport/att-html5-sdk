package com.att.html5sdk;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;



import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;

/**
 * @class TestSpeechRecursive
 * @extends Speech_Variables
 * This class exercises the SpeechToText App1 sample. In particular,
 * it cycles through combinations of input values in the UI, and
 * verifies that they work correctly when submitted to the back-end.
 */
public class TestAdsRecursive extends Ads_Variables
{
	
	Global global = new Global();
	String url = global.serverPrefix + global.ADS1Ruby;
	
	/**
	 * @method Execute
	 */
	public void Execute (ArrayList<TestResult> results, String logFile) throws IOException
	{
		Boolean chunked = true;
		Boolean custom = false;
		int contextIndex = 0;

		// start and connect to the Chrome browser
			System.setProperty("webdriver.chrome.driver", global.webDriverDir);
			WebDriver driver = new ChromeDriver();
		
		try
		{
		
			WebDriverWait wait = new WebDriverWait(driver,10);
			WebDriverWait waitLonger = new WebDriverWait(driver, 30);

			// iterate through a selection of parameter combinations from the
			// speech to text sample UI

				for(String category : Category_List()){
					for(String userAgent : UserAgentList()){
						for(String ageGroup : AgeGroupList()){
							for(String gender : GenderList()){

								chunked = !chunked;
								custom = !custom;
								
								TestResult testResult = new TestResult("Speech to Text: category(" + category + 
									"), userAgent(" + userAgent + "), ageGroup(" + ageGroup + "), gender(" + 
										gender + ")", url, logFile);
							
								try
								{									
									testResult.setAction("Navigate");
									// navigate to the sample page
									driver.get(url);
				
									
									// select the desired options from the listboxes
									SelectFromListbox(driver, waitLonger, "categoryPicker", category);
									SelectFromListbox(driver, waitLonger, "userAgentPicker", userAgent);
									SelectFromListbox(driver, waitLonger, "ageGroupPicker", ageGroup);
									SelectFromListbox(driver, waitLonger, "genderPicker", gender);
									
									// submit the speech to text request and process the response
									testResult.setAction("Click btnAdShow");
									driver.findElement(By.id("btnAdShow")).click();
									Thread.sleep(2000);
									testResult.setAction("Get Success");
									waitLonger.until(ExpectedConditions.visibilityOfElementLocated(By.id("adImage")));
									
									//String result = driver.findElement(By.id("resultsHeader")).getText();
									testResult.complete(true);
									
								} 
								catch (Exception e)
								{
									testResult.error(e.getMessage());
									testResult.complete(false);
								} 
								finally 
								{
									results.add(testResult);
								}
							}
						}
					}
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
		// wait until the list items in the popup listbox show up
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div.x-list-item")));
		
		// find the specific listbox item we want, click on it, and wait for it (and 
		// presumably the popup listbox as well) to disappear.
		List<WebElement> listitems = driver.findElements(By.cssSelector("div.x-list-item"));
		Log.getLogger().debug("instance[" + instance + "]");
		for (WebElement element : listitems) {
			Log.getLogger().debug("text[" + element.getText() + "]");
			if (element.getText().equals(instance)) {
				Global.scrollIntoView(driver, element.getAttribute("id"));
				element.click();
				wait.until(ExpectedConditions.not(ExpectedConditions.visibilityOf(element)));
				break;
			}
		}
	}
}


