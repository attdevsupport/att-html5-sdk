package com.sencha.att.provider;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import org.json.JSONTokener;


/**
 *
 * ServiceProvider provides implementations of Device Info, Device Location, and WAP Push
 * @class com.sencha.att.provider.ServiceProvider
 *
 */
public class ServiceProvider {
	private static Logger log = Logger.getLogger(ServiceProviderConstants.SERVICEPROVIDERLOGGER);
	private static final String TL_URN = "/2/devices/location?";
	private static final String DC_URN = "/rest/2/Devices/Info";
	private static final String WAP_PUSH_URN = "/1/messages/outbox/wapPush";



	/**
	 * This method requests information about the device
	 * @param host The domain name (or ip address) and port the request is submitted to. Example https://beta-api.att.com
	 * @param accessToken The Token representing the logged-in user
	 * @return will return a JSONObject of the device information
	 * @throws ApiRequestException
	 * @method deviceInfo
	 * @static
	 */
	public static ApiResponse deviceInfo(String host, String accessToken) throws ApiRequestException {
		String url = host + DC_URN;
		Map<String, String> headers = new HashMap<String, String>();
		
		headers.put("Authorization", "Bearer "+accessToken);
		
		log.info("ServiceProvider :: deviceInfo Getting device info using url: " +url);

		ApiResponse results = ApiRequestManager.get(url, headers);
		
		log.info("ServiceProvider :: deviceInfo Response: " + results.toJson());

		return results;
	}


	/**
	 * This method requests information about the device location
	 *
	 * @param host The domain name (or ip address) and port the request is submitted to. Example https://beta-api.att.com
	 * @param accessToken The Token representing the logged-in user
	 * @param accuracy The accuracy of the telephone
	 * @param acceptableAccuracy
	 * @param tolerance
	 * @return will return a JSONObject of the device location
	 * @throws ApiRequestException
	 * @throws UnsupportedEncodingException 
	 * @method deviceLocation
	 * @static
	 */
	public static ApiResponse deviceLocation(String host, String accessToken, int accuracy, int acceptableAccuracy, String tolerance) throws ApiRequestException, UnsupportedEncodingException {
		Map<String, String> headers = new HashMap<String, String>();
		headers.put("Authorization", "Bearer "+accessToken);
		
		String url = host + TL_URN;
		
		if (accuracy > 0) {
			url += "&requestedAccuracy=" + URLEncoder.encode(String.valueOf(accuracy), "UTF-8");
		}

		if (acceptableAccuracy > 0) {
			url += "&acceptableAccuracy=" +  URLEncoder.encode(String.valueOf(acceptableAccuracy), "UTF-8");
		}

		if (null != tolerance && tolerance.trim().length() > 0) {
			url += "&tolerance=" + URLEncoder.encode(tolerance, "UTF-8");
		}


		log.info("ServiceProvider :: deviceLocation Getting device location using url: " +url);

		ApiResponse results = ApiRequestManager.get(url, headers);
		
		log.info("ServiceProvider :: deviceLocation Response: " + results.toJson());
		

		return results;


	}

	/**
	 * This method pushes a WAP Message
	 *
	 * @param host The domain name (or ip address) and port the request is submitted to. Example https://beta-api.att.com
	 * @param accessToken The Token representing the logged-in user
	 * @param tel The Telephone number of the user
	 * @param xml The message to push
	 * @return will return a JSONObject of the device location
	 * @method wapPush
	 * @static
	 */
	public static TokenResponse wapPush(String host, String accessToken, String tel, String xml) {
		TokenResponse theReturn = null;
		URL url = null;
		String boundary = getBoundary();

		try {
			url = new URL(host + WAP_PUSH_URN);

			log.info("ServiceProvider :: wapPush Sending wapPush using url: " + url);

			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Authorization", "Bearer "+accessToken);
			conn.setRequestProperty("content-type", "application/json");
			conn.setRequestProperty("accept", "application/json");
			conn.setRequestProperty("content-type",
					"multipart/form-data; type=\"application/json\"; start=\"<part0@sencha.com>\"; boundary=\"" + boundary + "\"");

			OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
			String request = buildWAPMessage(boundary, tel, xml);
			
			log.info("ServiceProvider :: wapPush Request: " + request);
			
			wr.write(request);
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
			
			log.info("ServiceProvider :: wapPush Response: " + response.toString());
			
			theReturn = TokenResponse.getResponse(new JSONTokener(response.toString()));
		} catch (Exception e) {
			theReturn = TokenResponse.getResponse(e.getMessage());
		}
		return theReturn;
	}

	private static String buildWAPMessage(String boundary, String tel, String message) {

		String[] telArray = tel.split(",", -1); // pass -1 as 2nd arg so we can get trailing empty strings
		StringBuffer telStringBuffer = new StringBuffer("");
		int l = telArray.length;
		
		if(l == 1){
			telStringBuffer.append("\"tel:").append(telArray[0]).append("\"");
		}else{
			telStringBuffer.append("[");
			for (int i = 0; i < l; i++) {
				telStringBuffer.append("\"tel:").append(telArray[i]).append("\"");
				if(i < l - 1){
					telStringBuffer.append(",");
				}
			}
			telStringBuffer.append("]");
		}
		
		
		StringBuffer theReturn = new StringBuffer("--").append(boundary).append("\n");
		theReturn.append("Content-Type: application/json").append("\n");
		theReturn.append("Content-ID: <part0@sencha.com>").append("\n");
		theReturn.append("Content-Disposition: form-data; name=\"root-fields\"").append("\n");
		theReturn.append("\n");
		theReturn.append("{");
		theReturn.append("address:").append(telStringBuffer.toString());
		theReturn.append("}").append("\n");
		theReturn.append("--").append(boundary).append("\n");
		theReturn.append("Content-Type: text/xml").append("\n");
		theReturn.append("Content-ID: <part2@sencha.com>").append("\n");
		theReturn.append("\n");
		theReturn.append("Content-Disposition: form-data; name=\"PushContent\"").append("\n");
		theReturn.append("Content-Type: text/vnd.wap.si").append("\n");
		theReturn.append("Content-Length: 12").append("\n");
		theReturn.append("X-Wap-Application-Id: x-wap-application:wml.ua").append("\n");
		theReturn.append("\n");
		theReturn.append(message);
		theReturn.append("\n");
		theReturn.append("--").append(boundary).append("--");
		return theReturn.toString();
	}

	private static String getBoundary() {
		return "----=_Part_0_1" + Math.round((Math.random() * 10000000)) + "." + new Date().getTime() * 1000;

	}
}
