package com.sencha.att.provider;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.Date;
import java.util.logging.Logger;

import org.apache.commons.codec.binary.Base64InputStream;
import org.json.JSONArray;
import org.json.JSONTokener;

import com.sencha.att.provider.FileMapper.FileMapping;
import com.sencha.att.util.AddressUtil;

/**
 * @class com.sencha.att.provider.ServiceProviderMobo
 * This class performs calls to Message on behalf of (MOBO) functionality 
 *
 */
public class ServiceProviderMobo {
	private static Logger log = Logger.getLogger(ServiceProviderConstants.SERVICEPROVIDERLOGGER);
	private static String MOBO_MESSAGING_URN = "/rest/1/MyMessages";
	
	
	/**
	 * Sends Message on Behalf of the given user
	 * MOBO (Message on behalf of) allows a user to send MMS or SMS to a list of addresses using the user account.
	 * These addresses can be phone numbers, emails or even short codes.
     * @param host The domain name (or ip address) and port the request is submitted to. Example https://beta-api.att.com
     * @param accessToken The Token representing the logged-in user
	 * @param tel The phone number, email or shortcode list where the message will be sent
	 * @param message the message
	 * @param subject a message subject
	 * @param group whether or not the message has to be broadcasted
	 * @param files a file or list of files to be sent
	 * @return TokenResponse json response
	 * @throws ApiRequestException
	 * @method sendMessageOnBehalfOf
	 * @static
	 */
	public static TokenResponse sendMessageOnBehalfOf(String host, String accessToken, String tel, String message, String subject, boolean group, FileMapping[] files) throws ApiRequestException {
		TokenResponse theReturn = null;
		URL url;
		String content;
		int payloadSize = message.length() + subject.length();
		
		try {
			url = new URL(host + MOBO_MESSAGING_URN);
			
	 	    log.info("ServiceProviderMOBO :: sendMessageOnBehalfOf POST to url: " + url);

			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Authorization", "Bearer " + accessToken);
			conn.setRequestProperty("content-type", "application/json");
			conn.setRequestProperty("accept", "application/json");
			
			if(group == true || payloadSize > 160 || (files != null && files.length > 0)){
				//MMS
				String boundary = getBoundary();
				conn.setRequestProperty("content-type", "multipart/form-data; type=\"application/json\"; start=\"<part0@sencha.com>\"; boundary=\"" + boundary + "\"");

				OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
				
				content = buildBeginMessage(boundary); 
				wr.write(content);
				
		 	    log.info("ServiceProviderMOBO :: sendMessageOnBehalfOf MMS Request: " + content);

				content = buildMessage(tel, message, subject, group);
				wr.write(content);

		 	    log.info("ServiceProviderMOBO :: sendMessageOnBehalfOf MMS Request: " + content);
	
				if(files != null && files.length > 0){
					
					for(FileMapping file: files){
						wr.write(buildFileHeaderMessage(file.fileName, file.fileType, boundary));
						Base64InputStream b64is = new Base64InputStream(file.stream, true, -1, null);
						BufferedReader reader = new BufferedReader(new InputStreamReader(b64is));
						String thisLine;
						while ((thisLine = reader.readLine()) != null) {
							wr.write(thisLine);
							wr.write("\n");
							log.info(thisLine);
						}
					}
				}
				wr.write(buildEndMessage(boundary));

				wr.flush();
				wr.close();
			}else{
				//SMS
				OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
				
				content = buildMessage(tel, message, subject, group);
				wr.write(content);
				wr.flush();
				wr.close();

				log.info("ServiceProviderMOBO :: sendMessageOnBehalfOf SMS Request: " + content);
			}

			StringBuffer response = new StringBuffer();
			if (conn.getResponseCode() < 400) {

				BufferedReader is = new BufferedReader(new InputStreamReader(conn.getInputStream()));
				String str;
				while (null != ((str = is.readLine()))) {
					response.append(str);
				}
				is.close();
			} else {
				BufferedReader is = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
				String str;
				while (null != ((str = is.readLine()))) {
					response.append(str);
				}
				is.close();
			}
			theReturn = TokenResponse.getResponse(new JSONTokener(response.toString()));
		} catch (Exception e) {
			theReturn = TokenResponse.getResponse(e.getMessage());
		}
		
 	    log.info("ServiceProviderMOBO :: sendMessageOnBehalfOf Response: " + theReturn);

		return theReturn;

	}
	
	private static String buildFileHeaderMessage(String fileName, String fileType, String boundary) {
		StringBuffer theReturn = new StringBuffer("--").append(boundary).append("\n");
		theReturn.append("Content-Type: ").append(fileType).append("\n");
		theReturn.append("Content-ID: <").append(fileName).append(">").append("\n");
		theReturn.append("Content-Transfer-Encoding: base64").append("\n");
		theReturn.append("Content-Disposition: attachment; name=\"").append(fileName).append("\"").append("\n");
		theReturn.append("\n");
		
		log.info(theReturn.toString());
		
		return theReturn.toString();
	}


	private static String buildBeginMessage(String boundary) {
		
		StringBuffer theReturn = new StringBuffer("--").append(boundary).append("\n");
		theReturn.append("Content-Type: application/json").append("\n")
				 .append("Content-ID: <part0@sencha.com>").append("\n");
		
		return theReturn.toString();
	}

	private static String buildMessage(String tel,String message, String subject, boolean group) {
		JSONArray address = new JSONArray(Arrays.asList(AddressUtil.parseAddresses(tel.split(","))));
		
		
		StringBuffer theReturn = new StringBuffer()
		         .append("\n {")
			     .append("\"Addresses\" : ").append(address.toString()).append(",")
				 .append("\"Subject\" : \"").append(subject).append("\",")
				 .append("\"Text\" : \"").append(message).append("\",")
				 .append("\"Group\": \"" ).append(group).append("\"")
				 .append("}\n");
		
		return theReturn.toString();
	}
	
	private static String buildEndMessage(String boundary) {
		StringBuffer theReturn = new StringBuffer();
		theReturn.append("\n");
		theReturn.append("--").append(boundary).append("--");

		log.info(theReturn.toString());

		return theReturn.toString();
	}

	private static String getBoundary() {
		return "----=_Part_0_1" + Math.round((Math.random() * 10000000)) + "." + new Date().getTime() * 1000;

	}

}