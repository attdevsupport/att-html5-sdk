package com.sencha.att.servlet.votes;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.json.JSONArray;
import org.json.JSONException;


public class Votes {
	
	private static final String FILE_PATH = "votes.json";
	private static final String FILE_STRUCTURE = "[{\"sport\":\"Football\",\"votes\":0},{\"sport\":\"Baseball\",\"votes\":0},{\"sport\":\"Basketball\",\"votes\":0}]";
	
	
	private static FileInputStream getTmpFile() throws IOException {
		FileInputStream stream = null;
		
		File file = new File(FILE_PATH);

		if(!file.exists()){
			file.createNewFile();
			FileOutputStream fos = new FileOutputStream(file);
			fos.write(FILE_STRUCTURE.getBytes());
			fos.close();
		}

		stream = new FileInputStream(file);
		
		return stream;
	}
	
	
	
	
	public static void saveVotes(JSONArray votes) throws IOException{
		FileOutputStream fos = new FileOutputStream(FILE_PATH);
		fos.write(votes.toString().getBytes());
		fos.close();
	}

	public static JSONArray getVotes() throws IOException, JSONException{
		JSONArray votes;
		FileInputStream stream = getTmpFile();
		StringBuilder stringBuilder = new StringBuilder();
		BufferedReader bufferedReader = null;
		try {
		  InputStream inputStream = stream;
		  if (inputStream != null) {
		   bufferedReader = new BufferedReader(new InputStreamReader(
		inputStream));
		   char[] charBuffer = new char[128];
		   int bytesRead = -1;
		   while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
		    stringBuilder.append(charBuffer, 0, bytesRead);
		   }
		  } else {
		   stringBuilder.append("");
		  }
		} catch (IOException ex) {

		} finally {
		  if (bufferedReader != null) {
		   try {
		    bufferedReader.close();
		   } catch (IOException ex) {

		   }
		  }
		}
		
		votes = new JSONArray(stringBuilder.toString());
		
		return votes;
	}	
	
	
}
