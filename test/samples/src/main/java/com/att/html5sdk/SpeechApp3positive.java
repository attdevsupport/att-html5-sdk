package com.att.html5sdk;

import java.awt.Desktop;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import java.util.concurrent.*;

import org.apache.logging.log4j.Logger;

import com.google.common.base.*;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.*;

/**
 * @class SpeechApp3positive
 * run a simple positive test case for speech to text App1
 */
public class SpeechApp3positive {

	/**
	 * @method Execute
	 * run a simple positive test case for speech to text App1
	 *
	 * @param textArea
	 * The DOM id of the HTML element that allows the user to input text to be converted to speech
	 *
	 * @param submitButton
	 * The DOM id of the HTML element that submits the sample request
	 *
	 * @param resultWindow
	 * The DOM id of the HTML element that displays the result
	 *
	 * @param resultText
	 * The text displayed by the UI when the test is successful
	 */
	
	public static void Execute(String textArea, String submitButton, String resultWindow, String successText) throws InterruptedException, IOException
	{
		//Logger log = Log.getLogger();
		Global global = new Global();
		String url = "http://localhost:4567/Speech/App3/index.html";

		// start and connect to the Chrome browser
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();
			
		try {
			
			WebDriverWait wait = new WebDriverWait(driver, 20);
			
			// navigate to the sample page
			driver.get(url);
			Log.info(url);
			
			try {
			    // Submit speech request
				Log.setAction("Find textbox");
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(textArea)));
				
				Log.setAction("Send Keys");
				
				WebElement ta = driver.findElement(By.id(textArea));
				
				ta.sendKeys("one two three");
				ta.sendKeys(" four five");
				
				driver.findElement(By.id(submitButton)).click();
				WebElement rw = driver.findElement(By.id(resultWindow));
				
				new FluentWait<WebElement>(rw).
					withTimeout(30, TimeUnit.SECONDS).
					pollingEvery(300,TimeUnit.MILLISECONDS).
					until(new Function<WebElement, Boolean>() {
						@Override
						public Boolean apply(WebElement element) {
							return element.getText().length() > 0;
						}
					}
				);
				
				String result = rw.getText();
				Log.info(result == successText ? "Passed" : "Failed");
			    
			}
				catch (Exception e){
				Log.error(e.getMessage());
			}
		}
		finally {
		  driver.quit();
		}
	}
}
