package com.att.html5sdk;

import java.io.*;
import java.util.Calendar;
import java.util.GregorianCalendar;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


public class Log extends Global{

  private static Logger logger = null;
  
  public static Logger getLogger()
  {
    if (logger == null) {
      
      logger = LogManager.getLogger("html5sdk");
    }
    return logger;
  }
  
	private String MDY(){
		GregorianCalendar calendar = new GregorianCalendar();
		String MDY = calendar.get(Calendar.MONTH)+1 + "-" + calendar.get(Calendar.DATE) + "-" + calendar.get(Calendar.YEAR);

		return MDY;
	}
	
	private String HMS(){
		GregorianCalendar calendar = new GregorianCalendar();
		String HMS = calendar.get(Calendar.HOUR_OF_DAY) + ":" + calendar.get(Calendar.MINUTE) + ":" +calendar.get(Calendar.SECOND);
		
		return HMS;
	}
	
	
	private File CreateLogFile(){

		String logPath = "C://";
		File file = null;
		
		
		try{
		file = new File(logPath + "RESTful SampleApps" + ".txt");
		
		//file = new File(logPath + "//" + "log_" + MDY() + ".txt");
		
		if (!file.exists())
			file.createNewFile();
		}
		
		catch (IOException e){
			System.out.println(e);
			
		}
		
		return file;
	}
	
	
	public void HeaderWrite(String var_0)throws IOException{
		
		try{
		FileWriter fw = new FileWriter(CreateLogFile(), true);
		
		fw.append("\r\n");
		fw.append("\r\n");
		
		if (var_0.contains("https") || var_0.contains("Case: ")){
			fw.append(MDY() + "_" + HMS() + ">>>>>" + var_0);
			fw.append("\r\n");
		}
		
		fw.close();
		
		}
		catch (IOException e){
			System.out.println(e);
			
		}
		
	}

	public void InnerWrite(String var_2) throws IOException{
		
		try{
			
			FileWriter fw = new FileWriter(CreateLogFile(), true);
			
			fw.append("\r\n");
			fw.append(var_2);
			
			fw.close();
		}
		catch (IOException e){
			System.out.println(e);
			
		}		
		
	}
	public void InnerWrite_1(CharSequence var_2) throws IOException{
		
		try{
			
			FileWriter fw_1 = new FileWriter(CreateLogFile(), true);
			
			fw_1.append("\r\n");
			fw_1.append(var_2);
			
			fw_1.close();
		}
		catch (IOException e){
			System.out.println(e);
			
	
}
	}
}
