package com.att.html5sdk;

import java.io.IOException;

/**
 * @class TestSpeech
 * call all speech-related test cases
 */
public class TestSpeech {
	
  /**
   * @method Execute
   */
	public static void Execute() throws InterruptedException, IOException 
	{
		SpeechApp1positive SpeechApp1 = new SpeechApp1positive();
		SpeechApp1.Execute("buttonSubmit", "buttonDone");
    
		TestSpeechRecursive speech = new TestSpeechRecursive();
		speech.Execute();
		
		//SpeechApp2positive SpeechApp2 = new SpeechApp2positive();
		//SpeechApp2.Execute("ext-button-1", "ext-button-2");
	}
}
