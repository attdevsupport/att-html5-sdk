package sampleApps;

import java.awt.AWTException;
import java.io.IOException;

public class Main {

	public static void main(String[] args) throws InterruptedException, AWTException, IOException {
		
		
		
		sampleApps.TestSMS SMS = new sampleApps.TestSMS();
		sampleApps.TestSpeech Speech = new sampleApps.TestSpeech();
		sampleApps.TestTL TL = new sampleApps.TestTL();
		sampleApps.TestWAPPush WAPPush= new sampleApps.TestWAPPush();
		sampleApps.TestCMS CMS = new sampleApps.TestCMS();
		sampleApps.TestIMMN IMMN = new sampleApps.TestIMMN();
		sampleApps.TestMIM MIM = new sampleApps.TestMIM();
		sampleApps.TestMMS MMS = new sampleApps.TestMMS();
		sampleApps.TestNotary Notary = new sampleApps.TestNotary();
		sampleApps.TestPayments Payments = new sampleApps.TestPayments();
		
		
		
//		SMS.TestSMS_Main();
//		Speech.TestSpeech_Main();
//		TL.TestTL_Main();
//		WAPPush.TestWAPPush_Main();
//		CMS.TestCMS_Main();
//		IMMN.TestIMMN_Main();
//		MIM.TestMIM_Main();
//		MMS.TestMMS_Main();
//		Notary.TestNotary_Main();
		Payments.TestPayments_Main();
		
		
		
		
	
	
	}
}
	


	
	