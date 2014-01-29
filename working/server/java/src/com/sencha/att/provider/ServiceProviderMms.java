package com.sencha.att.provider;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import org.apache.commons.codec.binary.Base64InputStream;
import org.json.JSONTokener;


/**
 *
 * Use this class to make MMS API calls.
 * @class com.sencha.att.provider.ServiceProviderMms
 *
 */
public class ServiceProviderMms {

	/**
	 * @property {String} SEPARATOR
	 */
	public static final String SEPERATOR = "--";

	private static final String MMS_MESSAGING_URN = "/rest/mms/2/messaging/outbox";

	private static Logger log = Logger.getLogger(ServiceProviderConstants.SERVICEPROVIDERLOGGER);
	private String host = "";

	public ServiceProviderMms(String host) {
		this.host = host;
	}

	private String getHost() {
		return host;
	}

	/**
	 * This method sends a MMS Message
	 *
	 * @param host The domain name (or ip address) and port the request is submitted to. Example https://beta-api.att.com
	 * @param accessToken The Token representing the logged-in user
	 * @param tel The Telephone number of the user
	 * @param fileName The name of the file
	 * @param stream The Stream of the data object
	 * @param fileType type of file
	 * @return the JSON result
	 * @method sendMms
	 * @static
	 */
	public TokenResponse sendMms(String accessToken, String tel, String fileType, String fileName, InputStream stream, String subject, String priority) {
		return sendMms(getHost(), accessToken, tel, fileType, fileName, stream, subject, priority);

	}


	/**
	 * This method sends a MMS Message
	 *
	 * MMS allows for the delivery of different file types. Please see the developer documentation for an updated list:
	 *  https://developer.att.com/docs
	 *
	 * @param host The domain name (or ip address) and port the request is submitted to. Example https://beta-api.att.com
	 * @param accessToken The Token representing the logged in user
	 * @param tel The Telephone number of the user
	 * @param fileName The name of the file
	 * @param stream The Stream of the data object
	 * @param fileType type of file
	 * @return the JSON result
	 * @method sendMms 
	 * @static
	 */
	public static TokenResponse sendMms(String host, String accessToken, String tel, String fileType, String fileName, InputStream stream, String subject,  String priority) {
		TokenResponse theReturn = null;

		URL url;
		try {
			url = new URL(host + MMS_MESSAGING_URN);
			
	 	    log.info("ServiceProviderMMS :: sendMms POST to url: " + url);

			String boundary = getBoundary();

			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Authorization", "Bearer " + accessToken);
			conn.setRequestProperty("content-type", "application/json");
			conn.setRequestProperty("accept", "application/json");
			conn.setRequestProperty("content-type",
					"multipart/form-data; type=\"application/json\"; start=\"<part0@sencha.com>\"; boundary=\"" + boundary + "\"");

			OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
			String content = buildBeginMMSMessage(boundary, tel, fileName, fileType, subject, priority);
			wr.write(content);
			
	 	    log.info("ServiceProviderMMS :: sendMms Request: " + content);
			
			Base64InputStream b64is = new Base64InputStream(stream, true, -1, null);
			BufferedReader reader = new BufferedReader(new InputStreamReader(b64is));
			String thisLine;
			while ((thisLine = reader.readLine()) != null) {
				wr.write(thisLine);
				wr.write("\n");
			}
			wr.write(buildEndMMSMessage(boundary));
			wr.flush();
			wr.close();

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
		
 	    log.info("ServiceProviderMMS :: sendMMS Response: " + theReturn);

		return theReturn;
	}

	/**
	 * This method gets the MMS Status
	 *
	 * @param host The domain name (or ip address) and port the request is submitted to. Example https://beta-api.att.com
	 * @param accessToken The Token representing the logged-in user
	 * @param mmsId The MMS id
	 * @return the JSON result
	 * @throws ApiRequestException
	 * @method mmsStatus
	 * @static
	 */
	public static ApiResponse mmsStatus(String host, String accessToken, String mmsId) throws ApiRequestException{
		Map<String, String> headers = new HashMap<String, String>();
		String url =host + MMS_MESSAGING_URN + "/" + mmsId;

		headers.put("Authorization", "Bearer " + accessToken);

 	    log.info("ServiceProviderMMS :: mmsStatus GET to url: " + url);
		
		ApiResponse response = ApiRequestManager.get(url, headers);

 	    log.info("ServiceProviderMMS :: mmsStatus Response: " + response.toJson());

 	    return response;

	}

	private static String buildBeginMMSMessage(String boundary, String tel, String fileName, String type, String subject, String priority) {

		String[] telArray = tel.split(",");


		if (telArray.length == 1) {
			tel = "\"tel:" + telArray[0] + "\"";
		} else {
			for (int i = 0; i < telArray.length; i++) {
				telArray[i] = "\"tel:" + telArray[i] + "\"";
			}
			tel = "[" + combine(telArray, ",") + "]";
		}

		StringBuffer theReturn = new StringBuffer("--").append(boundary).append("\n");
		theReturn.append("Content-Type: application/json").append("\n");
		theReturn.append("Content-ID: <part0@sencha.com>").append("\n");
		theReturn.append("Content-Disposition: form-data; name=\"root-fields\"").append("\n");
		theReturn.append("\n");
		theReturn.append("{ \"Address\" : ").append(tel).append(
				", \"Subject\" : \"" + subject + "\", \"Priority\": \"" + priority + "\" }").append("\n");
		theReturn.append("--").append(boundary).append("\n");
		theReturn.append("Content-Type: ").append(type).append(";name=").append(fileName).append("\n");
		theReturn.append("Content-ID: <").append(fileName).append(">").append("\n");
		theReturn.append("Content-Transfer-Encoding: base64").append("\n");
		theReturn.append("Content-Disposition: attachment; filename=\"").append(fileName).append("\"").append("\n");
		theReturn.append("\n");

		return theReturn.toString();
	}

	private static String buildEndMMSMessage(String boundary) {
		StringBuffer theReturn = new StringBuffer();
		theReturn.append("\n");
		theReturn.append("--").append(boundary).append("--");
		return theReturn.toString();
	}

	private static String getBoundary() {
		return "----=_Part_0_1" + Math.round((Math.random() * 10000000)) + "." + new Date().getTime() * 1000;

	}

	private static String combine(String[] s, String glue){
		int k=s.length;
		if (k==0)
			return null;
		StringBuilder out=new StringBuilder();
		out.append(s[0]);
		for (int x=1;x<k;++x)
			out.append(glue).append(s[x]);
		return out.toString();
	}


}
