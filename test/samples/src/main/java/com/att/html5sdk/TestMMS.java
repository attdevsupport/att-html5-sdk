package com.att.html5sdk;

import java.io.IOException;
import java.util.ArrayList;

public class TestMMS {
	/**
	* @method Execute
	*/
	public static void Execute(ArrayList<TestResult> results) throws InterruptedException, IOException 
	{
		
		ArrayList<TestResult> localResults = new ArrayList<TestResult>();
	
		MMSApp1positive MMSApp1 = new MMSApp1positive();
		localResults.add(MMSApp1.ExecuteUploadTest
				(Global.phoneNumber, "address", "Test Message MMS Upload", "subject", "btnSendMessage", "btnCloseResponse", 
						"mmsId", "btnGetStatus"));
    
		TestMMSRecursive mms = new TestMMSRecursive();
		mms.Execute(localResults);
		
		Integer succeeded = 0;
		Integer i;
		
		Log.getLogger().info("\n\nSummary -------------------------------------------------------------------------\n");
		for (i=0; i < localResults.size(); i++)
		{	
			TestResult item = localResults.get(i);
			if (item.pass) {
				succeeded++;
			}
			//item.logShortResults();
			results.add(item);
		}
		
		Log.getLogger().info ( "\nSucceeded: " + succeeded + " Failed: " + (localResults.size() - succeeded) + "\n\n");
	
	}
}
