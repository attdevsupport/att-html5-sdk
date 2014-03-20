package com.att.html5sdk;

import java.util.*;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * @class SpeechApp1positive
 * run a simple positive test case for speech to text App1
 */
public class IMMNApp3Positive {

	/**
	 * @method Execute
     * run a simple positive test case for speech to text App1
     *
	 * @param submit
     * The DOM id of the HTML element that submits the sample request
     *
     * @param done
     * The DOM id of the HTML element that dismisses the sample result
	 *
	 * @returns TestResult
	 */
	
	/**
	public TestResult Execute(String btnCloseResponse, String logFile) throws InterruptedException, IOException
	{
		/*
		//Logger log = Log.getLogger();
		Global global = new Global();
		String url = global.serverPrefix + global.IMMN3Ruby;

		TestResult testResult = new TestResult("IAM App3 Positive", url, logFile);
		String result="";
		// start and connect to the Chrome browser
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		WebDriver driver = new ChromeDriver();

		try {
			
			WebDriverWait wait = new WebDriverWait(driver, 10);
			WebDriverWait waitLonger = new WebDriverWait(driver, 30);

			// navigate to the sample page
			driver.get(url);
			Thread.sleep(2000);
			//Check if consent page
			try
			{
				testResult.info("trying to find tab userid");
				wait.until(ExpectedConditions.visibilityOf(driver.findElement(By.className("last")))).click();
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("login"))).sendKeys("sdktest1");
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("password"))).sendKeys("Welcome1_");
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("commit"))).click();
				testResult.info("Clicked!");
				testResult.info("something something");
				Thread.sleep(20000);
			}
			catch(Exception ex)
			{
				
			}
			testResult.info(driver.getCurrentUrl());
			testResult.info(url);
			if(driver.getCurrentUrl().equals(url))
				{
				testResult.info("Got In");
				try {
					testResult.info("Got 1");
					testResult.setAction("Retrieve all messages in current view");
					List<WebElement> Messages  = driver.findElements(By.className("iam_message"));
					testResult.info("Got 2");
					if(Messages != null && Messages.size() > 0)
					{
						testResult.setAction("Selecting DataCount");
						int dataCount = Integer.parseInt(driver.findElement(By.name("dataCount")).getAttribute("value"));
						testResult.info("Data Count: " + dataCount);
						testResult.setAction("Acquiring total messages in index");
						int msgCount = Integer.parseInt(driver.findElement(By.id("msgCount")).getText());
						testResult.info("Message Count: " + msgCount);
						testResult.info("Actual listed messages: " + Messages.size());
						testResult.setAction("Checking to see if there are enough messages");
						if(msgCount > dataCount && dataCount > 5)
						{
							testResult.setAction("Delete a message");
							
							testResult.setAction("Reply to a message");
							
							testResult.setAction("Delete multiple 3 messages");
							
							testResult.setAction("Refresh the messages list");
							// Submit speech request
							testResult.setAction("Click btnCloseResponse");	
							wait.until(ExpectedConditions.elementToBeClickable(By.id(btnCloseResponse))).click();
							
							testResult.setAction("Visibility of success");
							wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("success")));
							
							testResult.setAction("Find success text");
							//String result = driver.findElement(By.className("success")).getText();
							testResult.info(result);
							
							testResult.setAction("Wait for Done");
							waitLonger.until(ExpectedConditions.elementToBeClickable(By.id(btnCloseResponse))).click();
						}
					}
					
				}
				catch (Exception e){
					testResult.error(e.getMessage());
				}			
			}
		}
		finally {
			testResult.complete(result.contains("Success: true"));
			driver.quit();
		}
		return testResult;
	}
*/	

	public TestResult Login(WebDriver driver, String logFile){
		Global global = new Global();
		String url = global.serverPrefix + global.IMMN3Ruby;

		TestResult testResult = new TestResult("IAM App3 Login", url, logFile);
		// start and connect to the Chrome browser
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		try {
			
			WebDriverWait wait = new WebDriverWait(driver, 10);

			// navigate to the sample page
			testResult.setAction("Navigating to login page");
			driver.get(url);
			Thread.sleep(2000);
			//Check if consent page
			try
			{
				testResult.info("Locating UserID login tab");
				wait.until(ExpectedConditions.visibilityOf(driver.findElement(By.className("last")))).click();
				
				testResult.setAction("Inputing Credentials");
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("login"))).sendKeys("sdktest1");
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("password"))).sendKeys("Welcome1_");
				
				testResult.setAction("Submitting login Info");
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("commit"))).click();
				
				testResult.setAction("Waiting 20 seconds for IAM App to get called back");
				Thread.sleep(20000);
				testResult.complete(driver.getCurrentUrl().equals(url));
			}
			catch(Exception ex)
			{
				testResult.complete(false);
				testResult.info(ex.getMessage());
			}
		}
		catch(Exception e)
		{
			testResult.complete(false);
			testResult.info(e.getMessage());
		}
		return testResult;
		
	}
	
	public TestResult GetMessageList(WebDriver driver, String logFile){
		Global global = new Global();
		String url = global.serverPrefix + global.IMMN3Ruby;

		TestResult testResult = new TestResult("IAM Get Message List", url, logFile);
		String result="";
		// start and connect to the Chrome browser
		try{
			testResult.setAction("Retrieve all messages in current view");
			List<WebElement> Messages  = driver.findElements(By.className("iam_message"));
			if(Messages != null && Messages.size() > 0)
			{
				testResult.setAction("Selecting DataCount");
				int dataCount = Integer.parseInt(driver.findElement(By.name("dataCount")).getAttribute("value"));
				testResult.info("Data Count: " + dataCount);
				testResult.setAction("Acquiring total messages in index");
				int msgCount = Integer.parseInt(driver.findElement(By.id("msgCount")).getText());
				testResult.info("Message Count: " + msgCount);
				testResult.info("Actual listed messages: " + Messages.size());
				if(msgCount > 0 && Messages.size() > 0)
				{
					result = "success";
				}
			}
			testResult.complete(result.contains("success"));
		}
		catch(Exception e){
			testResult.error(e.getMessage());
		}
		return testResult;
		
	}
	
	public TestResult DeleteMessage(WebDriver driver, String logFile){
		Global global = new Global();
		String url = global.serverPrefix + global.IMMN3Ruby;

		TestResult testResult = new TestResult("IAM App3 Delete Message", url, logFile);
		String result="";
		// start and connect to the Chrome browser
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		try{
			WebDriverWait wait = new WebDriverWait(driver, 10);

			testResult.setAction("Retrieve all messages in current view");
			List<WebElement> Messages  = driver.findElements(By.className("iam_message"));
			if(Messages.size() > 0)
			{
				WebElement button = Messages.get(0).findElement(By.className("iam_buttons"));
				
				//Buttons.findElement(By.cssSelector(selector))
				String id = "";
				testResult.info("Entering ForEach Loop");
				//button = button.findElement(By.xpath("//*[regx:matches(@id, 'del.*')]"));
				List<WebElement> buttons = button.findElements(By.tagName("button"));
				for( WebElement ele : buttons){
					testResult.setAction("Deleting Message");
					if(ele.getAttribute("id").contains("del"))
					{
						testResult.info("Getting ID");
						id = ele.getAttribute("id");
						testResult.info("Deleting message with ID: " + id);
						ele.click();
						wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id(id)));
						result = "success";
						break;
					}
				}
			}
			testResult.complete(result.contains("success"));
		}
		catch(Exception e){
			testResult.error(e.getMessage());
			testResult.complete(false);
		}
		return testResult;
		
	}
	
	public TestResult SendMessage(WebDriver driver, String logFile){
		Global global = new Global();
		String url = global.serverPrefix + global.IMMN3Ruby;

		TestResult testResult = new TestResult("IAM App3 Send Message", url, logFile);
		String result="";
		// start and connect to the Chrome browser
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		try{
			WebDriverWait wait = new WebDriverWait(driver, 10);

			testResult.setAction("Retrieve all messages in current view");
			List<WebElement> Messages  = driver.findElements(By.className("iam_message"));
			if(Messages.size() > 0)
			{
				WebElement button = Messages.get(0).findElement(By.className("iam_buttons"));
				
				//Buttons.findElement(By.cssSelector(selector))
				String id = "";
				testResult.info("Entering ForEach Loop");
				List<WebElement> buttons = button.findElements(By.tagName("button"));
				for( WebElement ele : buttons){
					testResult.setAction("Select a message to reply to ");
					if(ele.getAttribute("id").contains("reply"))
					{
						testResult.info("Getting ID");
						id = ele.getAttribute("id");
						testResult.info("Creating new message from: " + id);
						ele.click();
						
						testResult.setAction("Entering address to send message to");
						WebElement tempElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("messageTo")));
						tempElement = tempElement.findElement(By.tagName("input"));
						tempElement.clear();
						tempElement.sendKeys(Global.phoneNumber);
						
						testResult.setAction("Editing message subject");
						tempElement = driver.findElement(By.id("messageSubject")).findElement(By.tagName("input"));
						tempElement.clear();
						tempElement.sendKeys("Selenium Test Message");
						
						testResult.setAction("Editing message content");
						tempElement = driver.findElement(By.id("messageContent")).findElement(By.tagName("textarea"));
						tempElement.clear();
						tempElement.sendKeys("This is a test message sent via the IMMN app using Selenium");
						
						testResult.setAction("Sending message");
						driver.findElement(By.id("btnSend")).click();
						Thread.sleep(5000);
						result = "success";
						break;
					}
				}
			}
			testResult.complete(result.contains("success"));
		}
		catch(Exception e){
			testResult.error(e.getMessage());
		}
		return testResult;
		
	}
	
	public TestResult DeleteMessages(WebDriver driver, String logFile){
		Global global = new Global();
		String url = global.serverPrefix + global.IMMN3Ruby;

		TestResult testResult = new TestResult("IAM App3 Delete Messages", url, logFile);
		String result="";
		// start and connect to the Chrome browser
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		try{
			WebDriverWait wait = new WebDriverWait(driver, 10);
			WebDriverWait waitLonger = new WebDriverWait(driver, 30);
			
			testResult.setAction("Retrieve all messages in current view");
			Thread.sleep(2000);
			List<WebElement> messages  = driver.findElements(By.tagName("input"));
			List<String> messageId = new ArrayList<String>();
			//List<WebElement> checkboxes = Messages
			testResult.info("Entering forloop for messages");
			testResult.info("" + messages.size());
			int count = 0;
			testResult.setAction("selecting some messaages for deletion");
			for (WebElement ele:messages)
			{
				if(ele.getAttribute("id").contains("sel"))
				{
					Global.scrollIntoView(driver, ele.getAttribute("id"));
					messageId.add(ele.getAttribute("id"));
					testResult.info("ID of checkbox: " + ele.getAttribute("id"));
					ele.click();
					count++;
					if(count > 3)
						break;
					
				}
			}
			testResult.info("exit for loop for messages");
			testResult.setAction("Delete selected messages: " + messageId.get(0)+ " " + messageId.get(0) + " " + messageId.get(0) + " ");
			driver.findElement(By.id("btnDeleteSelected")).click();
			waitLonger.until(ExpectedConditions.invisibilityOfElementLocated(By.id(messageId.get(0))));
			result = "success";
			testResult.complete(result.contains("success"));
		}
		catch(Exception e){
			testResult.error(e.getMessage());
			testResult.complete(false);
		}
		return testResult;
		
		
	}

	public TestResult GetMessageStateAndDelta(WebDriver driver, String logFile){
		Global global = new Global();
		String url = global.serverPrefix + global.IMMN3Ruby;

		WebDriverWait wait = new WebDriverWait(driver, 10);
		
		TestResult testResult = new TestResult("IAM App3 get Message State and Delta", url, logFile);
		String result="";
		// start and connect to the Chrome browser
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		try{
			Thread.sleep(2000);
			testResult.setAction("Get current index state");
			WebElement eState = wait.until(ExpectedConditions.presenceOfElementLocated(
					By.id("indexState")));
			String state = eState.getAttribute("innerText");
			testResult.setAction("Get List of Messages");
			
			List<WebElement> Messages  = driver.findElements(By.className("iam_message"));
			if(Messages.size() > 0)
			{
				WebElement button = Messages.get(0).findElement(By.className("iam_buttons"));
				
				//Buttons.findElement(By.cssSelector(selector))
				String id = "";
				testResult.info("Entering ForEach Loop");
				//button = button.findElement(By.xpath("//*[regx:matches(@id, 'del.*')]"));
				List<WebElement> buttons = button.findElements(By.tagName("button"));
				for( WebElement ele : buttons){
					testResult.setAction("Deleting Message");
					if(ele.getAttribute("id").contains("del"))
					{
						testResult.info("Getting ID");
						id = ele.getAttribute("id");
						testResult.info("Deleting message with ID: " + id);
						ele.click();
						wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id(id)));
						break;
					}
				}
				testResult.setAction("Getting new message index state");
				Thread.sleep(2000);
				WebElement ele = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("indexState")));
				testResult.info("old state: " + state);
				testResult.info("new state: " + ele.getAttribute("innerText"));
				if(!state.equals(ele.getAttribute("innerText")))
				{
					result = "success";
				}
			}
			testResult.complete(result.contains("success"));
		}
		catch(Exception e){
			testResult.error(e.getMessage());
		}
		return testResult;
		
	}

	public TestResult GetMessageContent(WebDriver driver, String logFile){
		Global global = new Global();
		String url = global.serverPrefix + global.IMMN3Ruby;

		TestResult testResult = new TestResult("IAM App3 Get Message Content", url, logFile);
		String result="";
		// start and connect to the Chrome browser
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		try{
			WebDriverWait wait = new WebDriverWait(driver, 10);

			testResult.setAction("Retrieve all messages in current view");
			wait.until(ExpectedConditions.visibilityOf(driver.findElement(By.className("iam_message"))));
			Thread.sleep(1000);
			List<WebElement> Messages  = driver.findElements(By.className("iam_message"));
			
			if(Messages.size() > 0)
			{
				String iamContentLoading = "iam_content";
				testResult.info("Got Here");
				WebElement button = null;
				testResult.info("Got Here 2");
				String id = "";
				testResult.info("Getting current state");
				//wait.until(ExpectedConditions.
				for(int i = 0; i < Messages.size(); i++)
				{
					try{
						button =  Messages.get(i);
						button = Messages.get(i).findElement(By.className(iamContentLoading));
						if(!button.getAttribute("innerText").contains("Click to load content"))
							continue;
						id = Messages.get(i).getAttribute("id");
						testResult.info("Found message with content: " + id);
						break;
					}
					catch(Exception e){
						testResult.error(e.getMessage());
					}
				}
				
				testResult.info("id = " + id);
				wait.until(ExpectedConditions.elementToBeClickable(button)).click();
				wait.until(ExpectedConditions.stalenessOf(button));
				Thread.sleep(10000);
				button = wait.until(ExpectedConditions.visibilityOf(driver.findElement(By.id(id))));
				wait.until(ExpectedConditions.visibilityOf(button.findElement(By.className("iam_content"))));
				result = "success";
			}
			testResult.complete(result.contains("success"));
		}
		catch(Exception e){
			testResult.error(e.getMessage());
		}
		return testResult;
	}

	public TestResult UpdateMessage(WebDriver driver, String logFile){
		Global global = new Global();
		String url = global.serverPrefix + global.IMMN3Ruby;

		TestResult testResult = new TestResult("IAM App3 Update Message", url, logFile);
		String result="";
		// start and connect to the Chrome browser
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		try{
			WebDriverWait wait = new WebDriverWait(driver, 10);

			testResult.setAction("Retrieve all messages in current view");
			Thread.sleep(2000);
			List<WebElement> Messages  = driver.findElements(By.className("iam_message"));
			if(Messages.size() > 0)
			{
				WebElement button;
				String id = "";
				testResult.setAction("Getting current state");
					try{
					 button =  Messages.get(0).findElement(By.className("iam_unread_state_true"));
					}
					catch(Exception ex){
						button = Messages.get(0).findElement(By.className("iam_unread_state_false"));
					}
				id = Messages.get(0).getAttribute("id");
				testResult.info("id = " + id);
				String state = button.getAttribute("class");
				testResult.info("Current state: " + state);
				if(state.equals("iam_unread_state_false"))
				{
					testResult.setAction("Setting state to Unread");
				}
				else if(state.equals("iam_unread_state_true"))
				{
					testResult.setAction("Setting state to Read");
				}
				button.click();
				testResult.info("Get new state");
				WebElement Message = driver.findElement(By.id(id));
				try{
					wait.until(ExpectedConditions.stalenessOf(button));
				}
				finally{Thread.sleep(5000);}
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(id)));
				Message = driver.findElement(By.id(id));
				try{
					 Message =  Message.findElement(By.className("iam_unread_state_true"));
					}
					catch(Exception ex){
						Message = Message.findElement(By.className("iam_unread_state_false"));
					}
				
				Thread.sleep(2000);
				if(!state.equals(Message.getAttribute("class")))
				{
					testResult.info("old state: " + state); 
					testResult.info("New state: " + Message.getAttribute("class"));
					result = "success";
				}
				else
				{
					testResult.info("old state: " + state + "\nNew state: " + Message.getAttribute("class"));
				}
			}
			testResult.complete(result.contains("success"));
		}
		catch(Exception e){
			testResult.error(e.getMessage());
		}
		return testResult;
		
	}

	public TestResult GetMessageContentImage(WebDriver driver, String logFile){
		Global global = new Global();
		String url = global.serverPrefix + global.IMMN3Ruby;

		TestResult testResult = new TestResult("IAM App3 Get Message Content", url, logFile);
		String result="";
		// start and connect to the Chrome browser
		System.setProperty("webdriver.chrome.driver", global.webDriverDir);
		try{
			WebDriverWait wait = new WebDriverWait(driver, 10);

			testResult.setAction("Retrieve all messages in current view");
			List<WebElement> Messages  = driver.findElements(By.className("iam_message"));
			
			if(Messages.size() > 0)
			{
				String iamContentLoading = "iam_content";
				WebElement button = null;
				String id = "";
				testResult.info("Getting current state");
				//wait.until(ExpectedConditions.
				for(int i = 0; i < Messages.size(); i++)
				{
					try{
						button =  Messages.get(i);
						button = Messages.get(i).findElement(By.className(iamContentLoading));
						if(!button.getAttribute("innerText").contains("Click to load content"))
							continue;
						id = Messages.get(i).getAttribute("id");
						testResult.info("Found message with content: " + id);
						break;
					}
					catch(Exception e){
						testResult.error(e.getMessage());
					}
				}
				
				testResult.info("id = " + id);
				button.click();
				wait.until(ExpectedConditions.stalenessOf(button));
				Thread.sleep(10000);
				button = wait.until(ExpectedConditions.visibilityOf(driver.findElement(By.id(id))));
				wait.until(ExpectedConditions.visibilityOf(button.findElement(By.className("iam_content"))));
				try{
					WebElement message = button.findElement(By.className("iam_image"));
					message.click();
				}
				catch(Exception e){
					
				}
				result = "success";
			}
			testResult.complete(result.contains("success"));
		}
		catch(Exception e){
			testResult.error(e.getMessage());
		}
		return testResult;
	}

}
