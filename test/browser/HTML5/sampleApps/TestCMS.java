package sampleApps;

import java.io.IOException;

public class TestCMS {
	public void TestCMS_Main() throws InterruptedException, IOException {
		
		
		CMSApp1();
	}

	/**
	 * @param args
	 * @throws IOException 
	 */
	private static void CMSApp1() throws InterruptedException, IOException {
		sampleApps.Global global = new sampleApps.Global();
		sampleApp.CMSApp1.CMSApp1positive CMSApp1 = new sampleApp.CMSApp1.CMSApp1positive();
		
		CMSApp1.Execute(global.CMS1Java, "ext-element-26", "ext-element-33", "ext-element-93", "ext-element-94", "ext-element-95", "ext-element-96", "ext-element-97", "ext-element-38", "ext-element-44", "ext-button-1", "ext-button-3", "ext-element-63", "ext-element-123", "ext-element-124", "ext-element-125", "ext-button-2");
		CMSApp1.Execute(global.CMS1Ruby, "ext-element-26", "ext-element-33", "ext-element-93", "ext-element-94", "ext-element-95", "ext-element-96", "ext-element-97", "ext-element-38", "ext-element-44", "ext-button-1", "ext-button-3", "ext-element-63", "ext-element-123", "ext-element-124", "ext-element-125", "ext-button-2");
		CMSApp1.Execute(global.CMS1PHP, "ext-element-26", "ext-element-33", "ext-element-93", "ext-element-94", "ext-element-95", "ext-element-96", "ext-element-97", "ext-element-38", "ext-element-44", "ext-button-1", "ext-button-3", "ext-element-63", "ext-element-123", "ext-element-124", "ext-element-125", "ext-button-2");
		

	}

}
