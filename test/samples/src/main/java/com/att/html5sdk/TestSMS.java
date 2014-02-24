package com.att.html5sdk;

import java.io.IOException;
import java.util.*;

public class TestSMS {
	/**
	* @method Execute
	*/
	public static void Execute() throws InterruptedException, IOException 
	{
		
		ArrayList<TestResult> results = new ArrayList<TestResult>();
	
		SMSApp1positive SMSApp1 = new SMSApp1positive();
		results.add(SMSApp1.Execute(Global.phoneNumber,"address", "This is a test message", "message","btnSendMessage", "btnCloseResponse", "smsId","btnGetStatus"));

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
