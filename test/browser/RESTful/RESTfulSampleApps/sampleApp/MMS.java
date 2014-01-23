package RESTfulSampleApps.sampleApp;

import java.awt.AWTException;
import java.io.IOException;

//MMS automated sample application testing
public class MMS {
	
	//Calls four methods: send/receive MMS (1) (positive and negative), coupon MMS app (2) and gallery MMS app (3).
	public static void Mms() throws InterruptedException, AWTException, IOException{
		
		Mms_1();
		Mms_2();
		Mms_3();
		Mms_1_Negative();

	}
	
	//Includes positive test sweep of send/receive MMS application on RESTful and MS back-ends
	private static void Mms_1() throws InterruptedException, AWTException, IOException{
		RESTfulSampleApps.sampleApp.TestMMS.TestSendMms_Positive sendMms = new RESTfulSampleApps.sampleApp.TestMMS.TestSendMms_Positive();
		
		//PHP
		sendMms.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/MMS/app1", "button","address", "sendMMS", "getMmsDeliveryStatus");
		//Java
		sendMms.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/MMS/app1/MMS.jsp", "button","address", "sendMms", "getMmsDeliveryStatus");
		//Ruby
		sendMms.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/MMS/app1", "button", "address", "sendMms", "submit");
		//C# REST
		sendMms.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-restful/mms/app1/Default.aspx", "input", "phoneTextBox", "sendMMSMessageButton", "getStatusButton");
		//VB REST
		sendMms.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-restful/mms/app1/Default.aspx", "input", "phoneTextBox", "sendMMSMessageButton", "getStatusButton");
		//C# MS
		sendMms.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/mms/app1/Default.aspx", "input", "phoneTextBox", "sendMMSMessageButton", "getStatusButton");
		//VB MS
		sendMms.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-mssdk/mms/app1/Default.aspx", "input", "phoneTextBox", "sendMMSMessageButton", "getStatusButton");
		
	}
	
	//Includes positive test sweep of coupon MMS application on RESTful and MS back-ends
	private static void Mms_2() throws InterruptedException, IOException{
		RESTfulSampleApps.sampleApp.TestMMS.TestCouponMms couponMms = new RESTfulSampleApps.sampleApp.TestMMS.TestCouponMms();
		
		//PHP
		couponMms.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/MMS/app2", "getMmsDeliveryStatus");
		//Java
		couponMms.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/MMS/app2/MMS2.jsp", "getMmsDeliveryStatus");
		//Ruby
		couponMms.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/MMS/app2", "checStatus");
		//C# REST
		couponMms.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-restful/mms/app2/Default.aspx", "statusButton");
		//VB REST
		couponMms.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-restful/mms/app2/Default.aspx", "statusButton");
		//C# MS
		couponMms.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/mms/app2/Default.aspx", "statusButton");
		//VB MS
		couponMms.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-mssdk/mms/app2/Default.aspx","statusButton");
	}
	
	//Includes positive test sweep of gallery MMS application on RESTful and MS back-ends
	private static void Mms_3() throws InterruptedException, AWTException, IOException{
		RESTfulSampleApps.sampleApp.TestMMS.TestGalleryMms galleryMms = new RESTfulSampleApps.sampleApp.TestMMS.TestGalleryMms();
		
		//PHP
		galleryMms.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/MMS/app3");
		//Java
		galleryMms.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/MMS/app3/MMS3.jsp");
		//Ruby
		galleryMms.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/MMS/app3");
		//C# REST
		galleryMms.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-restful/mms/app3/Default.aspx");
		//VB REST
		galleryMms.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-restful/mms/app3/Default.aspx");
		//C# MS
		galleryMms.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/mms/app3/Default.aspx");
		//VB MS - Does not exists
		galleryMms.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-mssdk/mms/app3/Default.aspx");
		
	}
	
	//Includes negative test sweep of send/receive MMS application on RESTful and MS back-ends
	private static void Mms_1_Negative() throws InterruptedException, AWTException, IOException {
		RESTfulSampleApps.sampleApp.TestMMS.TestSendMms_Negative sendMmsNeg = new RESTfulSampleApps.sampleApp.TestMMS.TestSendMms_Negative();
		
		//PHP
		sendMmsNeg.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/MMS/app1", "button","address", "sendMMS", "getMmsDeliveryStatus");
		//Java
		sendMmsNeg.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/MMS/app1/MMS.jsp", "button","address", "sendMms", "getMmsDeliveryStatus");
		//Ruby
		sendMmsNeg.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/MMS/app1", "button", "address", "sendMms", "submit");
		//C# REST
		sendMmsNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-restful/mms/app1/Default.aspx", "input", "phoneTextBox", "sendMMSMessageButton", "getStatusButton");
		//VB REST
		sendMmsNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-restful/mms/app1/Default.aspx", "input", "phoneTextBox", "sendMMSMessageButton", "getStatusButton");
		//C# MS
		sendMmsNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/mms/app1/Default.aspx", "input", "phoneTextBox", "sendMMSMessageButton", "getStatusButton");
		//VB MS
		sendMmsNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/mms/app1/Default.aspx", "input", "phoneTextBox", "sendMMSMessageButton", "getStatusButton");
		
		
		
	}
}
