package com.att.html5sdk;
import java.io.IOException;
import java.util.*;

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
		
		ArrayList<TestResult> results = new ArrayList<TestResult>();
	
		SpeechApp1positive SpeechApp1 = new SpeechApp1positive();
		results.add(SpeechApp1.Execute("buttonSubmit", "btnCloseResponse"));
    
		TestSpeechRecursive speech = new TestSpeechRecursive();
		speech.Execute(results);
		
		SpeechApp3positive SpeechApp3 = new SpeechApp3positive();
		results.add(SpeechApp3.Execute("textToConvert", "submitText", "resultWindow", "Success, click Play to hear the converted audio"));
	
		Integer succeeded = 0;
		Integer i;
		
		Log.getLogger().info("\n\nSummary -------------------------------------------------------------------------\n");
		for (i=0; i < results.size(); i++)
		{	
			TestResult item = results.get(i);
			if (item.pass) {
				succeeded++;
			}
			item.logShortResults();
		}
		
		Log.getLogger().info ( "\nSucceeded: " + succeeded + " Failed: " + (results.size() - succeeded) + "\n\n");
	
	}
	
}


