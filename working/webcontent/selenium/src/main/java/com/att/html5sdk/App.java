package com.att.html5sdk;

import java.awt.AWTException;
import java.io.IOException;
import java.util.ArrayList;

public class App 
{
	public static String server_url = "";
	public static String getURL()
	{
		return server_url;
	}
	
    public static void main( String[] args )
     throws InterruptedException, AWTException, IOException
    {
		for(String arg : args){
			if (arg.length() > 3)
			{
				if(arg.lastIndexOf('/') == arg.length()-1)
				{
					arg = arg.substring(0, arg.length()-1);
				}
				server_url = arg;
			}
		}
    	ArrayList<TestResult> results = new ArrayList<TestResult>();
    	String logFile = Log.createLogFile();
    	Log.getLogger(logFile).info("user passed host = " + getURL());
    	
      // sampleApps.TestSMS SMS = new sampleApps.TestSMS();
      // sampleApps.TestTL TL = new sampleApps.TestTL();
      // sampleApps.TestCMS CMS = new sampleApps.TestCMS();
      // sampleApps.TestIMMN IMMN = new sampleApps.TestIMMN();
      // sampleApps.TestMIM MIM = new sampleApps.TestMIM();
      // sampleApps.TestMMS MMS = new sampleApps.TestMMS();
      // sampleApps.TestNotary Notary = new sampleApps.TestNotary();
      // sampleApps.TestPayments Payments = new sampleApps.TestPayments();
      
    	TestSpeech.Execute(results, logFile);
  		TestSMS.Execute(results, logFile);
  		// TL.TestTL_Main();
  		// CMS.TestCMS_Main();
  		// IMMN.TestIMMN_Main();
  		// MIM.TestMIM_Main();
  		TestMMS.Execute(results, logFile);
  		// Notary.TestNotary_Main();
  		// Payments.TestPayments_Main();	
  		
  		//Display Full Summary of tests and log it
  		displayFullSummary(results, logFile);
    }
    public static void displayFullSummary(ArrayList<TestResult> endResult, String logFile)
    {	
    	int succeeded = 0;
    
    	Log.getLogger(logFile).info("\n\n Final Summary --------------------------------------------------------------------\n");
		for (int i=0; i < endResult.size(); i++)
		{	
			TestResult item = endResult.get(i);
			if (item.pass) {
				succeeded++;
			}
			item.logShortResults();
		}
		
		Log.getLogger(logFile).info ( "\nSucceeded: " + succeeded + " Failed: " + (endResult.size() - succeeded) + "\n\n");
	    	
    }
}
