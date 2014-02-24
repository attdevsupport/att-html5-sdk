package com.att.html5sdk;

import java.io.IOException;
import java.util.ArrayList;

public class TestMMS {
	/**
	* @method Execute
	*/
	public static void Execute() throws InterruptedException, IOException 
	{
		
		ArrayList<TestResult> results = new ArrayList<TestResult>();
	
		//MMSApp1positive MMSApp1 = new MMSApp1positive();
		///results.add(MMSApp1.Execute(Global.phoneNumber,"address", "MMS Test Message via Selenium", "subject", "Hello.jpg","attachment","btnSendMessage", "btnCloseResponse", "smsId","btnGetStatus"));
    
		TestMMSRecursive mms = new TestMMSRecursive();
		mms.Execute(results);
		
		//SpeechApp3positive SpeechApp3 = new SpeechApp3positive();
		//results.add(SpeechApp3.Execute("textToConvert", "submitText", "resultWindow", "Success, click Play to hear the converted audio"));
	
		Integer succeeded = 0;
		Integer i;
		
		Log.getLogger().info("\n\nSummary -------------------------------------------------------------------------\n");
		for (i=0; i < results.size(); i++)
		{	
			TestResult item = results.get(i);
			if (item.pass) {
				succeeded++;
			}
			item.logShortResults();
		}
		
		Log.getLogger().info ( "\nSucceeded: " + succeeded + " Failed: " + (results.size() - succeeded) + "\n\n");
	
	}
}
