package RESTfulSampleApps.sampleApp;

import java.io.IOException;

//SMS automated sample application testing
public class SMS {
	
	//Calls three methods: send/receive SMS (1) (positive and negative) and SMS voting application
	public static void Sms() throws InterruptedException, IOException{
		
		Sms_1();
		Sms_2();
		Sms_1_Negative();
		

		
	}
	
	//Includes positive test sweep of send/receive SMS application on RESTful and MS back-ends
	private static void Sms_1() throws InterruptedException, IOException{
		RESTfulSampleApps.sampleApp.TestSMS.TestSendReceiveSms_Positive sendReceiveSms = new RESTfulSampleApps.sampleApp.TestSMS.TestSendReceiveSms_Positive();
		
		String testMessage = " Test";
		//PHP
		sendReceiveSms.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/SMS/app1", "address", "message", testMessage, "sendSms", "getSmsDeliveryStatus", "receiveSms", "49501004", "49501009");
		//Java
		sendReceiveSms.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/SMS/app1/SMS.jsp", "address", "message", testMessage, "sendSms", "getSmsDeliveryStatus", "getReceivedSms", "49501003", "49501008");
		//Ruby
		sendReceiveSms.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/SMS/app1", "address", "message", testMessage, "sendSms", "submit","getReceivedSms", "49501010", null);
		//C# REST
		sendReceiveSms.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-restful/sms/app1/Default.aspx", "txtmsisdn", "txtmsg", testMessage, "BtnSendSMS", "getDeliveryStatusButton", "input", "ctl01", "ctl02");
		//VB REST
		sendReceiveSms.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-restful/sms/app1/Default.aspx", "txtmsisdn", "txtmsg", testMessage, "BtnSendSMS", "getDeliveryStatusButton", "input", "ctl01", "ctl02");
		//C# MS
		sendReceiveSms.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/sms/app1/Default.aspx", "txtmsisdn", "txtmsg", testMessage, "BtnSendSMS", "getDeliveryStatusButton", "input", "ctl01", "ctl02");
		//VB MS
		sendReceiveSms.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-mssdk/sms/app1/Default.aspx", "txtmsisdn", "txtmsg", testMessage, "BtnSendSMS", "getDeliveryStatusButton", "input", "ctl01", "ctl02");

	}
	
	//Includes positive test sweep of SMS voting application on RESTful and MS back-ends
	private static void Sms_2() throws InterruptedException, IOException{
		RESTfulSampleApps.sampleApp.TestSMS.TestVoting vote = new RESTfulSampleApps.sampleApp.TestSMS.TestVoting();
		
		//PHP
		vote.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/SMS/app2");
		//Java
		vote.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/SMS/app2/SMS2.jsp");
		//Ruby
		vote.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/SMS/app2");
		//C# REST
		vote.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-restful/sms/app2/Default.aspx");
		//VB REST
		vote.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-restful/sms/app2/Default.aspx");
		//C# MS
		vote.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/sms/app2/Default.aspx");
		//VB MS
		vote.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-mssdk/sms/app2/Default.aspx");

	}
	
	//Includes negative test sweep of send/receive SMS application on RESTful and MS back-ends
	private static void Sms_1_Negative() throws InterruptedException, IOException {
		RESTfulSampleApps.sampleApp.TestSMS.TestSendReceiveSms_Negative sendReceiveSms_Neg = new RESTfulSampleApps.sampleApp.TestSMS.TestSendReceiveSms_Negative();
		
		String testMessage = " Test";
		
		//PHP
		sendReceiveSms_Neg.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/SMS/app1", "address", "message", testMessage, "sendSms", "getSmsDeliveryStatus", "receiveSms", "49501004", "49501009");
		//Java
		sendReceiveSms_Neg.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/SMS/app1/SMS.jsp", "address", "message", testMessage, "sendSms", "getSmsDeliveryStatus", "getReceivedSms", "49501003", "49501008");
		//Ruby
		sendReceiveSms_Neg.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/SMS/app1", "address", "message", testMessage, "sendSms", "submit","getReceivedSms", "49501010", null);
		//C# REST
		sendReceiveSms_Neg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-restful/sms/app1/Default.aspx", "txtmsisdn", "txtmsg", testMessage, "BtnSendSMS", "getDeliveryStatusButton", "input", "ctl01", "ctl02");
		//VB REST
		sendReceiveSms_Neg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-restful/sms/app1/Default.aspx", "txtmsisdn", "txtmsg", testMessage, "BtnSendSMS", "getDeliveryStatusButton", "input", "ctl01", "ctl02");
		//C# MS
		sendReceiveSms_Neg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/sms/app1/Default.aspx", "txtmsisdn", "txtmsg", testMessage, "BtnSendSMS", "getDeliveryStatusButton", "input", "ctl01", "ctl02");
		//VB MS
		sendReceiveSms_Neg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-mssdk/sms/app1/Default.aspx", "txtmsisdn", "txtmsg", testMessage, "BtnSendSMS", "getDeliveryStatusButton", "input", "ctl01", "ctl02");

	}

}
