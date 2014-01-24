package RESTfulSampleApps.sampleApp;

import java.io.IOException;

//Speech automated sample application testing
public class Speech {
	
	//Calls a method: Speech positive test
	public static void Speech() throws InterruptedException, IOException {

		Speech_Positive();
		
	}
	
	//Includes positive test sweep of Speech application on RESTful and MS back-ends
	public static void Speech_Positive() throws InterruptedException, IOException {
		
		TestSpeech.copy.TestSpeechRecursive speech = new TestSpeech.copy.TestSpeechRecursive();

		//PHP
		speech.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/Speech/app1/index.php", "context", "filename", false);
		//speech.Execute("https://ldev.code-api-att.com/APIPlatform/2/2/0/UAT/PHP-RESTful/Speech/app1/index.php", "SpeechContext", "audio_file", true);
		//Java
		speech.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Java-RESTful/Speech/app1/Speech.jsp", "context", "filename", false);
		//speech.Execute("https://ldev.code-api-att.com/APIPlatform/2/2/0/UAT/Java-RESTful/Speech/app1/Speech.jsp", "SpeechContext", "audio_file", true);
		//Ruby
		speech.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/Ruby-RESTful/Speech/app1/", "SpeechContext", "audio_file", false);
		//speech.Execute("https://ldev.code-api-att.com/APIPlatform/2/2/0/UAT/Ruby-RESTful/Speech/app1/", "SpeechContext", "audio_file", true);
		//C# REST
		speech.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/csharp-restful/Speech/app1/default.aspx","ddlSpeechContext", "ddlAudioFile", false);
		//speech.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/csharp-restful/Speech/app1/default.aspx","dd1SpeechContext", "dd1AudioFile", true);
		//VB REST
		speech.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/vb-restful/Speech/app1/default.aspx","ddlSpeechContext", "ddlAudioFile", false);
		//speech.Execute("http://wdev.code-api-att.com/APIPlatform/2/2/0/UAT/vb-restful/Speech/app1/default.aspx","SpeechContext", "audio_file", true);
		//C# MS
		speech.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/csharp-mssdk/Speech/app1/default.aspx","ddlSpeechContext", "fileUpload1", false);
		//speech.Execute("http://wdev.code-api-att.com/APIPlatform/2/2/0/UAT/csharp-mssdk/Speech/app1/default.aspx","SpeechContext", "audio_file", true);
		//VB MS
		speech.Execute("https://wprod.code-api-att.com/APIPlatform/2/2/0/PROD/vb-mssdk/Speech/app1/default.aspx", "ddlSpeechContext", "fileUpload1", false);
		//speech.Execute("http://wdev.code-api-att.com/APIPlatform/2/2/0/UAT/vb-mssdk/Speech/app1/default.aspx", "SpeechContext", "audio_file", true);
	}
	
	/*public static void SpeechFlowRegular() throws InterruptedException, IOException {
			
		RESTfulSampleApps.sampleApp.TestSpeech.SpeechFlowRegular speech = new RESTfulSampleApps.sampleApp.TestSpeech.SpeechFlowRegular();
			
		//PHP
		speech.Execute("https://lprod.code-api-att.com/APIPlatform/2/2/0/PROD/PHP-RESTful/Speech/app1/index.php");*/
	}

