package sampleApps;

import java.io.IOException;

public class TestMMS {
	
	public void TestMMS_Main() throws InterruptedException, IOException {
		
		Mms1();
		Mms2();
		Mms1neg();
	}
	
		private static void Mms1() throws InterruptedException, IOException {
			sampleApps.Global global = new sampleApps.Global();
			sampleApp.MMSApp1.MMSApp1positive MMSApp1 = new sampleApp.MMSApp1.MMSApp1positive();
			MMSApp1.Execute(global.MMS1Java, "ext-element-25", "ext-button-1", "ext-button-3", "ext-button-2", "ext-button-3");
			MMSApp1.Execute(global.MMS1Ruby, "ext-element-25", "ext-button-1", "ext-button-3", "ext-button-2", "ext-button-3");
			MMSApp1.Execute(global.MMS1PHP, "ext-element-25", "ext-button-1", "ext-button-3", "ext-button-2", "ext-button-3");			
			
		}		
	
	
		private static void Mms2() throws InterruptedException, IOException {
			sampleApps.Global global = new sampleApps.Global();
			sampleApp.MMSApp2.MMSApp2positive MMSApp2 = new sampleApp.MMSApp2.MMSApp2positive();
			MMSApp2.Execute(global.MMS2Java,"ext-button-1", "ext-button-3", "ext-button-2", "ext-button-3");
			MMSApp2.Execute(global.MMS2Ruby,"ext-button-1", "ext-button-3", "ext-button-2", "ext-button-3");
			MMSApp2.Execute(global.MMS2PHP,"ext-button-1", "ext-button-3", "ext-button-2", "ext-button-3");
			
		}
			
		private static void Mms1neg() throws InterruptedException, IOException {
			sampleApps.Global global = new sampleApps.Global();
			sampleApp.MMSApp1.MMSApp1negative MMSApp1 = new sampleApp.MMSApp1.MMSApp1negative();
			MMSApp1.Execute(global.MMS1Java, "ext-element-25", "ext-button-1", "ext-element-66");
			MMSApp1.Execute(global.MMS1Ruby, "ext-element-25", "ext-button-1", "ext-element-66");
			MMSApp1.Execute(global.MMS1PHP, "ext-element-25", "ext-button-1", "ext-element-66");
}
}