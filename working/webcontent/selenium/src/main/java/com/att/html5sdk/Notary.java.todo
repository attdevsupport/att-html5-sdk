package RESTfulSampleApps.sampleApp;

import java.awt.AWTException;
import java.io.IOException;

//Notary automated sample application testing
public class Notary {
	
	//Calls a method: CMS positive test
	public static void Notary() throws InterruptedException, AWTException, IOException{
		
		Notary_Positive();
	}

	//Includes positive test sweep of notary application on RESTful and MS back-ends
	private static void Notary_Positive() throws InterruptedException, IOException {
		TestNotary.copy.TestNotary notary = new TestNotary.copy.TestNotary();
		
		//PHP
		notary.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/Notary/app1/index.php", "signPayload");
		//Java
		notary.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/Notary/app1/notary.jsp", "signPayload");
		//Ruby
		notary.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/Notary/app1", "signPayload");
		//C# REST
		notary.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-restful/notary/app1/Default.aspx", "signPayLoadButton");
		//VB REST
		notary.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-restful/notary/app1/Default.aspx", "signPayLoadButton");
		//C# MS
		notary.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/notary/app1/Default.aspx", "signPayLoadButton");
		//VB MS
		notary.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/notary/app1/Default.aspx", "signPayLoadButton");
		
		
	}
}
