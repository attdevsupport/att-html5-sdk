package sampleApps;

import java.io.IOException;

public class TestSMS {
	
	public void TestSMS_Main() throws InterruptedException, IOException {
		
		Sms1();
		Sms2();
		Sms1neg();
	}
	private static void Sms1() throws InterruptedException, IOException {
		sampleApps.Global global = new sampleApps.Global();
		sampleApp.SMSApp1.SMSApp1positive SMSApp1 = new sampleApp.SMSApp1.SMSApp1positive();
		SMSApp1.Execute(global.SMS1Java, "ext-element-25","ext-button-1", "ext-button-5", "ext-element-49", "ext-button-5", "ext-button-3", "ext-button-5", "ext-button-4");
		SMSApp1.Execute(global.SMS1Ruby, "ext-element-25","ext-button-1", "ext-button-5", "ext-button-2", "ext-button-5", "ext-button-3", "ext-button-5", "ext-button-4");
		SMSApp1.Execute(global.SMS1PHP, "ext-element-25","ext-button-1", "ext-button-5", "ext-button-2", "ext-button-5", "ext-button-3", "ext-button-5", "ext-button-4");
		
	}
	

	private static void Sms2() throws InterruptedException, IOException {
		sampleApps.Global global = new sampleApps.Global();
		sampleApp.SMSApp2.SMSApp2positive SMSApp2 = new sampleApp.SMSApp2.SMSApp2positive();
		SMSApp2.Execute(global.SMS2Java, "ext-button-1", "ext-button-2");
		SMSApp2.Execute(global.SMS2Ruby, "ext-button-1", "ext-button-2");
		SMSApp2.Execute(global.SMS2PHP, "ext-button-1", "ext-button-2");
		
	}
	
	private static void Sms1neg() throws InterruptedException, IOException {
		sampleApps.Global global = new sampleApps.Global();
		sampleApp.SMSApp1.SMSApp1negative SMSApp1 = new sampleApp.SMSApp1.SMSApp1negative();
		//SMSApp1.Execute(global.SMS1Java, "ext-element-25", "ext-button-1", "ext-element-42");
		SMSApp1.Execute(global.SMS1Ruby, "ext-element-25", "ext-button-1", "ext-element-42");
		SMSApp1.Execute(global.SMS1PHP, "ext-element-25", "ext-button-1", "ext-element-42");
		
	}
	}





