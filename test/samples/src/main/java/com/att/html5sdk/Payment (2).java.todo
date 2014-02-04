package RESTfulSampleApps.sampleApp;

import java.awt.AWTException;
import java.io.IOException;

//Payment automated sample application testing
public class Payment {
	
	//Calls two methods: Single Pay positive test and Subscription positive test
	public static void Payments() throws InterruptedException, AWTException, IOException{
		
		SinglePay();
		//Subscription();

}

	//Includes positive test sweep of Payment (single pay) application on RESTful and MS back-ends
	private static void SinglePay() throws InterruptedException, IOException {
		RESTfulSampleApps.sampleApp.TestPayment.Payment_Single singlepay = new RESTfulSampleApps.sampleApp.TestPayment.Payment_Single();
		
		//PHP
		singlepay.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/Payment/app1/singlepay.php", "newTransaction", "getTransactionStatus", "trxIdGetRefund", "refundTransaction");
		//Java
		singlepay.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/Payment/app1/singlepay.jsp", "newTransaction", "getTransactionStatus", "trxIdRefund", "refundTransaction");
		//Ruby
		singlepay.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/Payment/app1", "newTransaction", "getTransactionStatus", "trxId", "refundTransaction");
		//C# REST
		singlepay.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-restful/payment/app1/Default.aspx", "newTransactionButton", "getTransactionButton", "RefundSection", "ctl00");
		//VB REST
		singlepay.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-restful/payment/app1/Default.aspx", "newTransactionButton", "getTransactionButton", "RefundSection", "ctl00");
		//C# MS
		singlepay.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/payment/app1/Default.aspx", "newTransactionButton", "getTransactionButton", "RefundSection", "ctl00");
		//VB MS
		singlepay.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-mssdk/payment/app1/Default.aspx", "newTransactionButton", "getTransactionButton", "RefundSection", "Button1");
	}

	//Includes positive test sweep of Payment (subscription) application on RESTful and MS back-ends
	private static void Subscription() throws InterruptedException, IOException {
		RESTfulSampleApps.sampleApp.TestPayment.Payment_Subscription subscription = new RESTfulSampleApps.sampleApp.TestPayment.Payment_Subscription();
		
		//PHP
		subscription.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/Payment/app2/subscription.php", "newSubscription", "getSubscriptionStatus", "getSubscriptionDetails","cancelSubscription", "refundSubscription", "trxIdGetRefund", "trxIdGetDetails");
		//Java
		subscription.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/Payment/app2/subscription.jsp", "newSubscription", "getSubscriptionStatus", "getSubscriptionDetails","cancelSubscription", "refundSubscription", "trxIdRefund", "trxIdGetDetails");
		//Ruby
		subscription.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/Payment/app2", "newSubscription", "getSubscriptionStatus", "getSubscriptionDetails", "cancelSubscription", "refundSubscription", "trxId", "consumer_id");
		//C# REST
		subscription.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-restful/payment/app2/Default.aspx", "newSubscriptionButton", "getSubscriptionButton", "btnGetSubscriptionDetails", "btnCancelSubscription", "btnGetSubscriptionRefund", "SubsRefundSection", "SubsDetailsSection");
		//VB REST
		subscription.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-restful/payment/app2/Default.aspx", "newSubscriptionButton", "getSubscriptionButton","btnGetSubscriptionDetails", "btnCancelSubscription", "btnGetSubscriptionRefund", "SubsRefundSection", "SubsDetailsSection");
		//C# MS
		subscription.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/payment/app2/Default.aspx", "newSubscriptionButton", "getSubscriptionButton","btnGetSubscriptionDetails", "btnCancelSubscription", "btnGetSubscriptionRefund", "SubsRefundSection", "SubsDetailsSection");
		//VB MS
		subscription.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-mssdk/payment/app2/Default.aspx", "newSubscriptionButton", "getSubscriptionButton", "btnGetSubscriptionDetails", "btnCancelSubscription", "btnGetSubscriptionRefund", "SubsRefundSection", "SubsDetailsSection");
	}
}