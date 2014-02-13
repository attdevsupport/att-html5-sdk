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
 * ServiceProvider provides the implementation of Device Info
 * @class com.sencha.att.provider.ServiceProvider
 *
 */
public class ServiceProvider {
	private static Logger log = Logger.getLogger(ServiceProviderConstants.SERVICEPROVIDERLOGGER);
	private static final String DC_URN = "/rest/2/Devices/Info";



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
}
