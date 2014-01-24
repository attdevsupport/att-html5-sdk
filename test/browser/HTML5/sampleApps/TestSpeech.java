package sampleApps;

import java.io.IOException;

public class TestSpeech {
	
	public void TestSpeech_Main() throws InterruptedException, IOException {
		
		Speech1();
	}
	
	private static void Speech1() throws InterruptedException, IOException {
		sampleApps.Global global = new sampleApps.Global();
		sampleApp.SpeechApp1.SpeechApp1positive SpeechApp1 = new sampleApp.SpeechApp1.SpeechApp1positive();
		SpeechApp1.Execute(global.Speech1Java,"ext-button-1", "ext-button-2");
		SpeechApp1.Execute(global.Speech1Ruby,"ext-button-1", "ext-button-2");
		SpeechApp1.Execute(global.Speech1PHP,"ext-button-1", "ext-button-2");
		
	}
}
		