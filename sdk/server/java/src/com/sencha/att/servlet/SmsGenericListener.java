package com.sencha.att.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * 
 * @class com.sencha.att.servlet.SmsGenericListener
 */
public class SmsGenericListener extends HttpServlet {

	private static final long serialVersionUID = 1L;
	
	
	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		String body = this.extractBody(req);
		try {
			JSONObject smsJson = new JSONObject(body);
			this.processSmsMessage(smsJson);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
	}

	/**
	 * @method processSmsMessage
	 * This method should be override on child class of this generic listener.
	 * @param message
	 */
	public void processSmsMessage(JSONObject message) {
		//NO OP
	}
	
	private String extractBody(HttpServletRequest request) {
		StringBuilder stringBuilder = new StringBuilder();
		BufferedReader bufferedReader = null;
		try {
		  InputStream inputStream = request.getInputStream();
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
		return stringBuilder.toString();
	}
	
}
