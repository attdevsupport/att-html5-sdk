package RESTfulSampleApps.sampleApp;

import java.io.IOException;

//CMS automated sample application testing
public class CMS {
	
	//Calls two methods: CMS positive tests and CMS negative tests
	public static void Cms() throws InterruptedException, IOException{
		
		Cms_Positive();
		//Cms_Negative();

	}

	//Includes positive test sweep of CMS application on RESTful and MS back-ends
	private static void Cms_Positive() throws InterruptedException, IOException{
		
		RESTfulSampleApps.sampleApp.TestCMS.TestCms_Positive cmsPos = new RESTfulSampleApps.sampleApp.TestCMS.TestCms_Positive();
		
		//PHP
		cmsPos.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/CMS/app1/CMS.php", "txtNumber", "txtMessageToPlay", "btnupload1", "signal", "btnupload");
		//Java
		cmsPos.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/CMS/app1/CMS.jsp", "txtNumberForFeature", "txtMessageToPlay", "btnCreateSession", "ddlSignal", "btnSendSignal");
		//Ruby
		cmsPos.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/CMS/app1", "txtNumber", "txtMessageToPlay", "btnCreateSession", "signal", "btnupload");
		//C# REST
		cmsPos.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-RESTful/CMS/app1/Default.aspx", "txtNumberForFeature", "txtMessageToPlay", "btnCreateSession", "ddlSignal", "btnSendSignal");
		//VB REST
		cmsPos.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-RESTful/CMS/app1/Default.aspx", "txtNumberForFeature", "txtMessageToPlay", "btnCreateSession", "ddlSignal", "btnSendSignal");
		//C# MS
		cmsPos.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-MSSDK/CMS/app1/Default.aspx", "txtNumberForFeature", "txtMessageToPlay", "btnCreateSession", "ddlSignal", "btnSendSignal");
		//VB MS
		cmsPos.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-MSSDK/CMS/app1/Default.aspx", "txtNumberForFeature", "txtMessageToPlay", "btnCreateSession", "ddlSignal", "btnSendSignal");
		
	}
	
	//Includes negative test sweep of CMS application on RESTful and MS back-ends
	private static void Cms_Negative() throws InterruptedException, IOException {
		
		RESTfulSampleApps.sampleApp.TestCMS.TestCms_Negative cmsNeg = new RESTfulSampleApps.sampleApp.TestCMS.TestCms_Negative();
		
		//PHP
		cmsNeg.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/CMS/app1/CMS.php", "txtNumber", "txtMessageToPlay", "btnupload1", "signal", "btnupload");
		//Java
		cmsNeg.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/CMS/app1/CMS.jsp", "txtNumberForFeature", "txtMessageToPlay", "btnCreateSession", "ddlSignal", "btnSendSignal");
		//Ruby
		cmsNeg.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/CMS/app1", "txtNumber", "txtMessageToPlay", "btnCreateSession", "signal", "btnupload");
		//C# REST
		cmsNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-RESTful/CMS/app1/Default.aspx", "txtNumberForFeature", "txtMessageToPlay", "btnCreateSession", "ddlSignal", "btnSendSignal");
		//VB REST
		cmsNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-RESTful/CMS/app1/Default.aspx", "txtNumberForFeature", "txtMessageToPlay", "btnCreateSession", "ddlSignal", "btnSendSignal");
		//C# MS
		cmsNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-MSSDK/CMS/app1/Default.aspx", "txtNumberForFeature", "txtMessageToPlay", "btnCreateSession", "ddlSignal", "btnSendSignal");
		//VB MS
		cmsNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-MSSDK/CMS/app1/Default.aspx", "txtNumberForFeature", "txtMessageToPlay", "btnCreateSession", "ddlSignal", "btnSendSignal");

	}
}
