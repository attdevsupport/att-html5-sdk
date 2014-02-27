package com.att.html5sdk;
import java.io.IOException;
import java.util.*;


/**
 * @class TestResult
 * standardized data for 
 */
public class TestResult {
	
	public String testName;
	public ArrayList<String> messages;
	public String testUrl;
	public Boolean pass = true;
	public Boolean completed = false;
	private String lastActionWritten = "";
	private String logFile="";
	
	private static String logAction = "";
	private static String lastAction = "";
	
	private Integer labelPad = 15;
		
	public TestResult (String name, String url) {
		testName = name;
		testUrl = url;
		messages = new ArrayList<String>();
		writeToLog("\n-------------------------------------------------------------------------------------");
		writeToLog(getLabel("Test") + name);
		writeToLog(getLabel("Url") + url);
	}
	
	public TestResult (String name, String url, String logFile) {
		testName = name;
		testUrl = url;
		messages = new ArrayList<String>();
		writeToLog("\n-------------------------------------------------------------------------------------");
		writeToLog(getLabel("Test") + name);
		writeToLog(getLabel("Url") + url);
		this.logFile=logFile;
	}
	
	private String getLabel(String x) 
	{
		return repeat(" ", labelPad-x.length()) + x + ": ";
	}
	
	private String repeat(String x, Integer length) 
	{
		String p = "";
		Integer i;
		for (i = 0; i < length; i++)
		{
			p += x;
		}
		return p;
	}
	
	private void writeToLog(String x) {
		if(logFile.isEmpty())
			Log.getLogger().info(x);
		else
			Log.getLogger(logFile).info(x);
		
		messages.add(x);
	}
	
	private void writeLastAction(Boolean isError) {
		if (lastAction.length() > 0 && !logAction.equals(lastAction) ) {
			
			String success = "";
			if (!lastActionWritten.equals(lastAction)) {
				if (!isError) {
					success = ">> Success";
				}
				lastActionWritten = lastAction;
			}
			writeToLog("\n" + getLabel("Action") + lastAction + success);
		}
		lastAction = logAction;
	}
		
	private void write(String msg, Boolean isError) {
		writeLastAction(isError);
		if (msg.length() > 0) {
			writeToLog("\n" + repeat(" ", labelPad + 3) + msg + "\n");
		}
	}
	
	public void setAction(String action) {
		logAction = action;
		writeLastAction(false);
	}
		
	public void error(String msg) {
		write("   Error:" + msg, true);
		pass = false;
	}
	
	public void info(String msg) {
		write(msg, false);
	}
	
	public void complete(Boolean succeeded) {
		pass = pass && succeeded;
		completed = true;
		writeToLog("\n" + getLabel("Test complete") + (succeeded ? "Passed" : "Failed") + "\n\n");
	}
	
	public String getShortResults() {
		return getLabel(testName) + (pass ? "Passed" : "Failed");
	}
	
	public void logShortResults() {
		writeToLog(getShortResults());
	}
}
