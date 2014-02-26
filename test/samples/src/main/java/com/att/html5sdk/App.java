package com.att.html5sdk;

import java.awt.AWTException;
import java.io.IOException;
import java.util.ArrayList;

public class App 
{
    public static void main( String[] args )
     throws InterruptedException, AWTException, IOException
    {
    	ArrayList<TestResult> results = new ArrayList<TestResult>();
      // sampleApps.TestSMS SMS = new sampleApps.TestSMS();
      // sampleApps.TestTL TL = new sampleApps.TestTL();
      // sampleApps.TestCMS CMS = new sampleApps.TestCMS();
      // sampleApps.TestIMMN IMMN = new sampleApps.TestIMMN();
      // sampleApps.TestMIM MIM = new sampleApps.TestMIM();
      // sampleApps.TestMMS MMS = new sampleApps.TestMMS();
      // sampleApps.TestNotary Notary = new sampleApps.TestNotary();
      // sampleApps.TestPayments Payments = new sampleApps.TestPayments();
      
    	TestSpeech.Execute(results);
  		TestSMS.Execute(results);
  		// TL.TestTL_Main();
  		// CMS.TestCMS_Main();
  		// IMMN.TestIMMN_Main();
  		// MIM.TestMIM_Main();
  		TestMMS.Execute(results);
  		// Notary.TestNotary_Main();
      // Payments.TestPayments_Main();	
  		
  		//Display Full Summary of tests and log it
  		displayFullSummary(results);
    }
    public static void displayFullSummary(ArrayList<TestResult> endResult)
    {	
    	int succeeded = 0;
    
    	Log.getLogger().info("\n\n Final Summary --------------------------------------------------------------------\n");
		for (int i=0; i < endResult.size(); i++)
		{	
			TestResult item = endResult.get(i);
			if (item.pass) {
				succeeded++;
			}
			item.logShortResults();
		}
		
		Log.getLogger().info ( "\nSucceeded: " + succeeded + " Failed: " + (endResult.size() - succeeded) + "\n\n");
	    	
    }
}
