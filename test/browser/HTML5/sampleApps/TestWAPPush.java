package sampleApps;

import java.io.IOException;

public class TestWAPPush {
	
	public void TestWAPPush_Main() throws InterruptedException, IOException {
		
		WAPPush1();
		WAPPush1neg();
	}
	
	private static void WAPPush1() throws InterruptedException, IOException {
		sampleApps.Global global = new sampleApps.Global();
		sampleApp.WAPPushApp1.WAPPushApp1positive WAPPushApp1 = new sampleApp.WAPPushApp1.WAPPushApp1positive();
		WAPPushApp1.Execute(global.WAPPush1Java,"ext-element-25", "ext-button-1", "ext-button-2");
		WAPPushApp1.Execute(global.WAPPush1Ruby,"ext-element-25", "ext-button-1", "ext-button-2");
		WAPPushApp1.Execute(global.WAPPush1PHP,"ext-element-25", "ext-button-1", "ext-button-2");
		
	}
	
	private static void WAPPush1neg() throws InterruptedException, IOException {
		sampleApps.Global global = new sampleApps.Global();
		sampleApp.WAPPushApp1.WAPPushApp1negative WAPPushApp1 = new sampleApp.WAPPushApp1.WAPPushApp1negative();
		WAPPushApp1.Execute(global.WAPPush1Java, "ext-element-25", "ext-button-1");
		WAPPushApp1.Execute(global.WAPPush1Ruby, "ext-element-25", "ext-button-1");
		WAPPushApp1.Execute(global.WAPPush1PHP, "ext-element-25", "ext-button-1");
		
	}

	
	

}







	
	