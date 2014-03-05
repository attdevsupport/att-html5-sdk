package com.att.html5sdk;

import java.io.IOException;

//CMS automated sample application testing
public class CMS {
	
	//Calls two methods: CMS positive tests and CMS negative tests
	public static void Cms() throws InterruptedException, IOException{
		
		Cms_Positive();
		//Cms_Negative();

		Global global = new Global();
		TestCms_Positive cmsPos = new TestCms_Positive();
		
		cmsPos.Execute2(global.CMS1Ruby, "ext-element-26", "ext-element-33", "ext-element-93", "ext-element-94", "ext-element-95", "ext-element-96", "ext-element-97", "ext-element-38", "ext-element-44", "ext-button-1", "ext-button-3", "ext-element-63", "ext-element-123", "ext-element-124", "ext-element-125", "ext-button-2");
		cmsPos.Execute2(global.CMS1Ruby, "ext-element-26", "ext-element-33", "ext-element-93", "ext-element-94", "ext-element-95", "ext-element-96", "ext-element-97", "ext-element-38", "ext-element-44", "ext-button-1", "ext-button-3", "ext-element-63", "ext-element-123", "ext-element-124", "ext-element-125", "ext-button-2");
		cmsPos.Execute2(global.CMS1Ruby, "ext-element-26", "ext-element-33", "ext-element-93", "ext-element-94", "ext-element-95", "ext-element-96", "ext-element-97", "ext-element-38", "ext-element-44", "ext-button-1", "ext-button-3", "ext-element-63", "ext-element-123", "ext-element-124", "ext-element-125", "ext-button-2");
	}

	//Includes positive test sweep of CMS application on RESTful and MS back-ends
	private static void Cms_Positive() throws InterruptedException, IOException{
		
		TestCms_Positive cmsPos = new TestCms_Positive();

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
		
		TestCms_Negative cmsNeg = new TestCms_Negative();
		
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
