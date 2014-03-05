package RESTfulSampleApps.sampleApp;

import java.io.IOException;

//TL automated sample application testing
public class TL {
	
	//Calls a method: TL positive test
	public static void Tl() throws InterruptedException, IOException {
		Tl_Positive();
		
	}
	
	//Includes positive test sweep of TL application on RESTful and MS back-ends
	private static void Tl_Positive() throws InterruptedException, IOException {
		TestTL.copy.TestTL tl = new TestTL.copy.TestTL();
		
		//PHP
		tl.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/TL/app1");
		//Java
		tl.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/TL/app1/TL.jsp");
		//Ruby
		tl.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/TL/app1");
		//C# REST
		tl.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-restful/TL/app1/Default.aspx");
		//VB REST
		tl.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-restful/TL/app1/Default.aspx");
		//C# MS
		tl.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/TL/app1/Default.aspx");
		//VB MS
		tl.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-mssdk/TL/app1/Default.aspx");
		
	}
}
