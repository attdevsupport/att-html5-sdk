package RESTfulSampleApps.sampleApp;

import java.awt.AWTException;
import java.io.IOException;

//IMMN automated sample application testing
public class IMMN {
	
	//Calls two methods: IMMN positive tests and IMMN negative tests
	public static void Immn() throws InterruptedException, AWTException, IOException {
		Immn_Positive();
		Immn_Negative();
		
	}
	
	//Includes positive test sweep of IMMN application on RESTful and MS back-ends
	private static void Immn_Positive() throws InterruptedException, AWTException, IOException{
		RESTfulSampleApps.sampleApp.TestIMMN.TestIMMN_Positive immnPos = new RESTfulSampleApps.sampleApp.TestIMMN.TestIMMN_Positive();
		//RESTfulSampleApps.sampleApp.TestCMS.TestCms_Positive cmsPos = new RESTfulSampleApps.sampleApp.TestCMS.TestCms_Positive();
		//PHP
		immnPos.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/IMMN/app1","phoneTextBox", "messageTextBox", "subjectTextBox", "sendMessageButton");
		//Java
		immnPos.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/IMMN/app1/index.jsp", "phoneTextBox", "messageTextBox", "subjectTextBox", "sendMessageButton");
		//Ruby
		immnPos.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/IMMN/app1", "address", "message", "subject", "sendMessages");
		//C# REST
		immnPos.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-restful/IMMN/app1/Default.aspx","txtPhone", "txtMessage", "txtSubject", "btnSendMessage");
		//VB REST
		immnPos.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-restful/IMMN/app1/Default.aspx","txtPhone", "txtMessage", "txtSubject", "btnSendMessage");
		//C# MS
		immnPos.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/IMMN/app1/Default.aspx","txtPhone", "txtMessage", "txtSubject", "btnSendMessage");
		//VB MS
		immnPos.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-mssdk/IMMN/app1/Default.aspx", "txtPhone", "txtMessage", "txtSubject", "btnSendMessage");
		
		
	}
	
	//Includes negative test sweep of IMMN application on RESTful and MS back-ends
	private static void Immn_Negative() throws InterruptedException, AWTException, IOException{
		
		RESTfulSampleApps.sampleApp.TestIMMN.TestIMMN_Negative immnNeg = new RESTfulSampleApps.sampleApp.TestIMMN.TestIMMN_Negative();

		//PHP
		immnNeg.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/IMMN/app1","phoneTextBox", "messageTextBox", "subjectTextBox", "sendMessageButton");
		//Java
		immnNeg.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/IMMN/app1/index.jsp", "phoneTextBox", "messageTextBox", "subjectTextBox", "sendMessageButton");
		//Ruby
		immnNeg.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/IMMN/app1", "address", "message", "subject", "sendMessages");
		//C# REST
		immnNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-restful/IMMN/app1/Default.aspx","txtPhone", "txtMessage", "txtSubject", "btnSendMessage");
		//VB REST
		immnNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-restful/IMMN/app1/Default.aspx","txtPhone", "txtMessage", "txtSubject", "btnSendMessage");
		//C# MS
		immnNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/IMMN/app1/Default.aspx","txtPhone", "txtMessage", "txtSubject", "btnSendMessage");
		//VB MS
		immnNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-mssdk/IMMN/app1/Default.aspx", "txtPhone", "txtMessage", "txtSubject", "btnSendMessage");
		
	}
}
