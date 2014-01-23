package RESTfulSampleApps.sampleApp;

import java.io.IOException;

//WAP automated sample application testing
public class WAP {
	
	//Calls two methods: WAP positive tests and WAP negative tests
	public static void Wap() throws InterruptedException, IOException {
		Wap_Positive();
		Wap_Negative();
		
	}

	//Includes positive test sweep of WAP application on RESTful and MS back-ends
	private static void Wap_Positive() throws InterruptedException, IOException {
		TestWAP.copy.TestWap_Positive wapPos = new TestWAP.copy.TestWap_Positive();
		
		//PHP
		wapPos.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/WAP/app1", "address", "sendWAP");
		//Java
		wapPos.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/WAP/app1/WAP.jsp", "address", "sendWap");
		//Ruby
		wapPos.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/WAP/app1","address", "submit");
		//C# REST
		wapPos.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-restful/WAP/app1/Default.aspx","txtAddressWAPPush", "btnSendWAP");
		//VB REST
		wapPos.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-restful/WAP/app1/Default.aspx", "txtAddressWAPPush", "btnSendWAP");
		//C# REST
		wapPos.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/WAP/app1/Default.aspx", "txtAddressWAPPush", "btnSendWAP");
		//VB MS
		wapPos.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-mssdk/WAP/app1/Default.aspx", "txtAddressWAPPush", "btnSendWAP");
		
	}
	
	//Includes negative test sweep of WAP application on RESTful and MS back-ends
	private static void Wap_Negative() throws InterruptedException, IOException {
		TestWAP.copy.TestWap_Negative wapNeg = new TestWAP.copy.TestWap_Negative();
		
		//PHP
		wapNeg.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/WAP/app1", "address", "sendWAP");
		//Java
		wapNeg.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/WAP/app1/WAP.jsp", "address", "sendWap");
		//Ruby
		wapNeg.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/WAP/app1","address", "submit");
		//C# REST
		wapNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-restful/WAP/app1/Default.aspx","txtAddressWAPPush", "btnSendWAP");
		//VB REST
		wapNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-restful/WAP/app1/Default.aspx", "txtAddressWAPPush", "btnSendWAP");
		//C# REST
		wapNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/WAP/app1/Default.aspx", "txtAddressWAPPush", "btnSendWAP");
		//VB MS
		wapNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-mssdk/WAP/app1/Default.aspx", "txtAddressWAPPush", "btnSendWAP");
		
	}
}
