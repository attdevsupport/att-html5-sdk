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
	
		MMSApp1positive MMSApp1 = new MMSApp1positive();
		results.add(MMSApp1.ExecuteUploadTest
				(Global.phoneNumber, "address", "Test Message MMS Upload", "subject", "btnSendMessage", "btnCloseResponse", 
						"mmsId", "btnGetStatus"));
    
		TestMMSRecursive mms = new TestMMSRecursive();
		mms.Execute(results);
		
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
