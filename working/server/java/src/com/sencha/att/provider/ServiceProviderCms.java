package com.sencha.att.provider;

import java.util.logging.Logger;

import org.apache.http.client.methods.HttpPost;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * @class com.sencha.att.provider.ServiceProviderCms
 * 
 */
public class ServiceProviderCms {
	private static final String CMS_SESSION_URN = "/rest/1/Sessions";
    
	private static Logger log = Logger.getLogger(ServiceProviderConstants.SERVICEPROVIDERLOGGER);

	
	/**
	 * @method createSession
	 * Create a new CMS session 
	 * @param host
	 * @param accessToken
	 * @param params
	 * @return
	 * @throws ApiRequestException
	 */
	public static ApiResponse createSession(String host, String accessToken, JSONObject params) throws ApiRequestException{
		String url = host + CMS_SESSION_URN;

		HttpPost post = new HttpPost(url);
        post.setHeader("Authorization", "Bearer "+accessToken);
        
        ApiResponse response = ApiRequestManager.postJSON(params, post);

	    log.info("ServiceProviderCms :: createSession Response: " + response.toJson());

        return response;
	}
	
	/**
	 * @method sendSignal
	 * Send a signal to the given CMS sessionId  
	 * @param host
	 * @param accessToken
	 * @param sessionId
	 * @param signal
	 * @return
	 * @throws ApiRequestException
	 * @throws JSONException
	 */
	public static ApiResponse sendSignal(String host, String accessToken, String sessionId, String signal) throws ApiRequestException, JSONException{
		String url = host + CMS_SESSION_URN + "/" + sessionId + "/Signals";
		JSONObject params = new JSONObject();
		HttpPost post = new HttpPost(url);
		
        post.setHeader("Authorization", "Bearer "+accessToken);
        
        params.put("signal", signal);
        
        ApiResponse response = ApiRequestManager.postJSON(params, post);

	    log.info("ServiceProviderCms :: sendSignal Response: " + response.toJson());

        return response;
	}
}
