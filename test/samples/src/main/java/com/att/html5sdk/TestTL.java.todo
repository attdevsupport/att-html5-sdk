package sampleApps;

import java.io.IOException;

public class TestTL {
	
	public void TestTL_Main() throws InterruptedException, IOException {
		
		TL1();
	}
	private static void TL1() throws InterruptedException, IOException {
		sampleApps.Global global = new sampleApps.Global();
		sampleApp.TLApp1.TLApp1positive TLApp1 = new sampleApp.TLApp1.TLApp1positive();
		TLApp1.Execute(global.TL1Java,"ext-button-1", "ext-button-3");
		TLApp1.Execute(global.TL1Ruby,"ext-button-1", "ext-button-3");
		TLApp1.Execute(global.TL1PHP, "ext-button-1", "ext-button-3");
		
	}
}