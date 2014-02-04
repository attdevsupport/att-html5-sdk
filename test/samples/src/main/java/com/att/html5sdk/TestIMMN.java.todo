package sampleApps;

import java.io.IOException;

public class TestIMMN {
	
	public void TestIMMN_Main() throws InterruptedException, IOException {
		
		IMMN1();
		IMMN1neg();
	
	}

	/**
	 * @param args
	 * @throws IOException 
	 */
	private static void IMMN1() throws InterruptedException, IOException {
	sampleApps.Global global = new sampleApps.Global();
	sampleApp.IMMNApp1.IMMNApp1positive IMMNApp1 = new sampleApp.IMMNApp1.IMMNApp1positive();
	IMMNApp1.Execute(global.IMMN1Java, "ext-element-25", "ext-element-31", "ext-element-35", "ext-element-50", "ext-element-72", "ext-button-1");
	IMMNApp1.Execute(global.IMMN1Ruby, "ext-element-25", "ext-element-31", "ext-element-35", "ext-element-50", "ext-element-72", "ext-button-1");
	IMMNApp1.Execute(global.IMMN1PHP, "ext-element-25", "ext-element-31", "ext-element-35", "ext-element-50", "ext-element-72", "ext-button-1");

	}
	
		
	private static void IMMN1neg() throws InterruptedException, IOException {
	sampleApps.Global global = new sampleApps.Global();
	sampleApp.IMMNApp1.IMMNApp1negative IMMNApp1 = new sampleApp.IMMNApp1.IMMNApp1negative();
	//IMMNApp1.Execute(global.IMMN1Java, "ext-element-25", "ext-element-31", "ext-element-35", "ext-element-50", "ext-element-72", "ext-button-1");
	IMMNApp1.Execute(global.IMMN1Ruby, "ext-element-25", "ext-element-31", "ext-element-35", "ext-element-50", "ext-element-72", "ext-button-1");
	IMMNApp1.Execute(global.IMMN1PHP, "ext-element-25", "ext-element-31", "ext-element-35", "ext-element-50", "ext-element-72", "ext-button-1");
}
}