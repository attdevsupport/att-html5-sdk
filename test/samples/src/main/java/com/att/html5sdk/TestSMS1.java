package com.att.html5sdk;

import java.io.IOException;
import java.util.*;

public class TestSMS1 {
	/**
	* @method Execute
	*/
	public static void Execute() throws InterruptedException, IOException 
	{
		
		ArrayList<TestResult> results = new ArrayList<TestResult>();
	
		SMSApp1positive1 SMSApp1 = new SMSApp1positive1();
		results.add(SMSApp1.Execute(Global.phoneNumber,"address", "This is a test message", "message","ext-button-1", "ext-button-5", "smsId","ext-button-2"));
    
		//TestSpeechRecursive speech = new TestSpeechRecursive();
		//speech.Execute(results);
		
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
