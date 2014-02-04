package com.att.html5sdk;

import java.awt.AWTException;
import java.io.IOException;

public class App 
{
    public static void main( String[] args )
     throws InterruptedException, AWTException, IOException
    {
      TestSpeech Speech = new TestSpeech();
      // sampleApps.TestSMS SMS = new sampleApps.TestSMS();
      // sampleApps.TestTL TL = new sampleApps.TestTL();
      // sampleApps.TestWAPPush WAPPush= new sampleApps.TestWAPPush();
      // sampleApps.TestCMS CMS = new sampleApps.TestCMS();
      // sampleApps.TestIMMN IMMN = new sampleApps.TestIMMN();
      // sampleApps.TestMIM MIM = new sampleApps.TestMIM();
      // sampleApps.TestMMS MMS = new sampleApps.TestMMS();
      // sampleApps.TestNotary Notary = new sampleApps.TestNotary();
      // sampleApps.TestPayments Payments = new sampleApps.TestPayments();
      
  		Speech.TestSpeech_Main();
  		// SMS.TestSMS_Main();
  		// TL.TestTL_Main();
  		// WAPPush.TestWAPPush_Main();
  		// CMS.TestCMS_Main();
  		// IMMN.TestIMMN_Main();
  		// MIM.TestMIM_Main();
  		// MMS.TestMMS_Main();
  		// Notary.TestNotary_Main();
      // Payments.TestPayments_Main();	
    }
}
