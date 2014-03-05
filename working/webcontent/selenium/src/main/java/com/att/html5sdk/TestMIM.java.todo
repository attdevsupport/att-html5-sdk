package sampleApps;

import java.io.IOException;

public class TestMIM {
	
	public void TestMIM_Main() throws InterruptedException, IOException {
		
		MIM1();
		MIM1neg();
	}
		
		private static void MIM1() throws InterruptedException, IOException {
			sampleApps.Global global = new sampleApps.Global();
			sampleApp.MIMApp1.MIMApp1positive MIMApp1 = new sampleApp.MIMApp1.MIMApp1positive();
			MIMApp1.Execute(global.MIM1Java, "ext-element-29");
			MIMApp1.Execute(global.MIM1Ruby, "ext-element-29");
			MIMApp1.Execute(global.MIM1PHP, "ext-element-29");
			
		}
		
		
		
		private static void MIM1neg() throws InterruptedException, IOException {
			sampleApps.Global global = new sampleApps.Global();
			sampleApp.MIMApp1.MIMApp1negative MIMApp1 = new sampleApp.MIMApp1.MIMApp1negative();
			//DEFECT: MIMApp1.Execute(global.MIM1Java, "ext-element-25", "ext-element-29");
			MIMApp1.Execute(global.MIM1Ruby, "ext-element-25", "ext-element-29");
			MIMApp1.Execute(global.MIM1PHP, "ext-element-25", "ext-element-29");
			
		}
}








