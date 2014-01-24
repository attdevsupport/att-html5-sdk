package RESTfulSampleApps.sampleApp;

import java.awt.AWTException;
import java.io.IOException;

//MIM automated sample application testing
public class MIM {
	
	//Calls two methods: MIM positive tests and MIM negative tests
	public static void Mim() throws InterruptedException, AWTException, IOException {
		Mim_Positive();
		Mim_Negative();
		
	}
	
	//Includes positive test sweep of MIM application on RESTful and MS back-ends
	private static void Mim_Positive() throws InterruptedException, AWTException, IOException{
		RESTfulSampleApps.sampleApp.TestMIM.TestMIM_Positive mimPos = new RESTfulSampleApps.sampleApp.TestMIM.TestMIM_Positive();
		
		//PHP
		mimPos.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/MIM/app1","headerCntTextBox", "indexCrsrTextBox", "Text1", "Text2", "Submit1", "getMsgContentButton", null);
		//Java
		mimPos.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/MIM/app1/MIM.jsp", "HeaderCount", "IndexCursor", "Text1", "Text2", "Submit1", "msgContent", null);
		//Ruby
		mimPos.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/MIM/app1", "headerCntTextBox", "indexCrsrTextBox", "Text1", "Text2", "getMessageHeaders", "getMessageContent", null);
		//C# REST
		mimPos.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-restful/MIM/app1/Default.aspx", "txtHeaderCount", "txtIndexCursor", "txtMessageId", "txtPartNumber", "GetHeaderButton", "GetMessageContent", "TextBox1");
		//VB REST
		mimPos.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-restful/MIM/app1/Default.aspx", "txtHeaderCount", "txtIndexCursor", "txtMessageId", "txtPartNumber", "GetHeaderButton", "GetMessageContent", "TextBox1");
		//C# MS
		mimPos.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/MIM/app1/Default.aspx", "txtHeaderCount", "txtIndexCursor", "txtMessageId", "txtPartNumber", "GetHeaderButton", "GetMessageContent", "txtSmilContents");
		//C# MS
		mimPos.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-mssdk/MIM/app1/Default.aspx", "txtHeaderCount", "txtIndexCursor", "txtMessageId", "txtPartNumber", "GetHeaderButton", "GetMessageContent", "txtSmil");
		
		
	}
	
	//Includes negative test sweep of MIM application on RESTful and MS back-ends
	private static void Mim_Negative() throws InterruptedException, AWTException, IOException{
		RESTfulSampleApps.sampleApp.TestMIM.TestMIM_Negative mimNeg = new RESTfulSampleApps.sampleApp.TestMIM.TestMIM_Negative();
		
		//PHP
		mimNeg.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/MIM/app1","headerCntTextBox", "indexCrsrTextBox", "Text1", "Text2", "Submit1", "getMsgContentButton");
		//Java
		mimNeg.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/MIM/app1/MIM.jsp", "HeaderCount", "IndexCursor", "Text1", "Text2", "Submit1", "msgContent");
		//Ruby
		mimNeg.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/MIM/app1", "headerCntTextBox", "indexCrsrTextBox", "Text1", "Text2", "getMessageHeaders", "getMessageContent");
		//C# REST
		mimNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-restful/MIM/app1/Default.aspx", "txtHeaderCount", "txtIndexCursor", "txtMessageId", "txtPartNumber", "GetHeaderButton", "GetMessageContent");
		//VB REST
		mimNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-restful/MIM/app1/Default.aspx", "txtHeaderCount", "txtIndexCursor", "Text1", "Text2", "GetHeaderButton", "GetMessageContent");
		//C# MS
		mimNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Csharp-mssdk/MIM/app1/Default.aspx", "txtHeaderCount", "txtIndexCursor", "Text1", "Text2", "GetHeaderButton", "GetMessageContent");
		//C# MS
		mimNeg.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/Vb-mssdk/MIM/app1/Default.aspx", "txtHeaderCount", "txtIndexCursor", "Text1", "Text2", "GetHeaderButton", "GetMessageContent");
		
		
	}
}
