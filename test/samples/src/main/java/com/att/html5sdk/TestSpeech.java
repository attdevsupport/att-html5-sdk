package com.att.html5sdk;

import java.io.IOException;

public class TestSpeech {
	
	public static void Execute() throws InterruptedException, IOException 
  {
		SpeechApp1positive SpeechApp1 = new SpeechApp1positive();
		SpeechApp1.Execute("ext-button-1", "ext-button-2");
    
    TestSpeechRecursive speech = new TestSpeechRecursive();
    speech.Execute();
	}
}
