package com.sencha.att.provider;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

/**
 * @class com.sencha.att.provider.ServiceProviderMim 
 * 
 */
public class ServiceProviderMim {
	private static Logger log = Logger.getLogger(ServiceProviderConstants.SERVICEPROVIDERLOGGER);

	public static String MIM_URN = "/rest/1/MyMessages";
	
	
	/**
	 * Retrieve message headers
	 * @param host
	 * @param accessToken
	 * @param headerCount
	 * @param indexCursor
	 * @return ApiResponse
	 * @throws ApiRequestException
	 * @throws UnsupportedEncodingException 
	 * @method getMessageHeaders
	 * @static
	 */
	public static ApiResponse getMessageHeaders(String host, String accessToken, String headerCount, String indexCursor) throws ApiRequestException, UnsupportedEncodingException{
		ApiResponse response = null;
		String url = host + MIM_URN + "?HeaderCount="+URLEncoder.encode(headerCount, "UTF-8");
		Map<String, String> headers = new HashMap<String, String>();
	
		if(indexCursor != null && !"".equals(indexCursor)){
			url+= "&IndexCursor=" + URLEncoder.encode(indexCursor, "UTF-8");
		}
		
		log.info("ServiceProviderMIM :: getMessageHeaders GET to url: " + url);
		
		headers.put("Authorization", "Bearer " + accessToken);
		response = ApiRequestManager.get(url, headers);
		
		log.info("ServiceProviderMIM :: getMessageHeaders Response: " + response.toJson());
		
		return response;
	}
	

	

}
