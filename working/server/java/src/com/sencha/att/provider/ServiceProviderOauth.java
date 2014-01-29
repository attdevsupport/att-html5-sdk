package com.sencha.att.provider;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.logging.Logger;

import org.apache.http.client.methods.HttpPost;
import org.json.JSONObject;

import com.sencha.att.AttConstants;


/**
 *
 * This class handles the low-level oauth calls, including getting the url of the oauth login and fetching the auth token after the user has completed the oauth login sequence.
 * @author jason
 * @class com.sencha.att.provider.ServiceProviderOauth
 *
 */
public class ServiceProviderOauth {
	private String host = "";
	private String clientId = "";
	private String clientSecret = "";
	private String callback = "";
	private static Logger log = Logger.getLogger(ServiceProviderConstants.SERVICEPROVIDERLOGGER);

	/**
	 *
	 * @param host The domain name (or ip address) and port the request is submitted to.
	 * @param clientId The clients id; this may look something like c4c9084c6e9cb6ca01886a15e7dfd486
	 * @param clientSecret
	 * @param callback The URL to callback to when the user has logged in. Example http://localhost:8080
	 * @constructor
	 */
	public ServiceProviderOauth(String host, String clientId, String clientSecret, String callback) {
		this.host = host;
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.callback = callback;

		log.info("ServiceProviderOauth configured for host: "+ host + " and callback: " + callback);
	}

	private String getHost() {
		return host;
	}

	private String getClientID() {
		return clientId;
	}

	private String getClientSecret() {
		return clientSecret;
	}

	private String getCallback() {
		return callback;
	}




	/**
	 * Generates an Authorization URL to log-in the user
	 *
	 * @param scope The scope that will be embedded in the request. Example PAYMENT
	 * @return will return a url where the user can log in. Example
	 *         https://beta-api.att.com/oauth/authorize?scope=PAYMENT&client_id=
	 *         c4c9084c6e9cb6ca01886a15e7dfd486
	 *         &redirect_uri=http://localhost:8080/att/callback
	 * @throws UnsupportedEncodingException 
	 * @method oauthUrl
	 */
	public String oauthUrl(String scope) throws UnsupportedEncodingException {
		return oauthUrl(getHost(), scope, getClientID(), getCallback());
	}

	/**
	 * Generates a Authorization URL to login the user
	 *
	 * @param host The domain name (or ip address) and port the request is submitted to. Example https://beta-api.att.com
	 * @param scope The scope that will be embedded in the request. Example PAYMENT
	 * @param clientId The clients id; this may look something like c4c9084c6e9cb6ca01886a15e7dfd486
	 * @param callback The URL to callback to when the user has logged-in. Example http://localhost:8080
	 * @return will return a url where the user can log in. Example
	 *         https://beta-api.att.com/oauth/authorize?scope=PAYMENT&client_id=
	 *         c4c9084c6e9cb6ca01886a15e7dfd486
	 *         &redirect_uri=http://localhost:8080/att/callback
	 * @throws UnsupportedEncodingException 
	 * @method oauthUrl
	 * @static
	 */
	public static String oauthUrl(String host, String scope, String clientId, String callback) throws UnsupportedEncodingException {
		String url =  host + "/oauth/authorize?"
				+ "scope=" + URLEncoder.encode(scope, "UTF-8") 
				+ "&client_id=" + URLEncoder.encode(clientId, "UTF-8")
				+ "&redirect_uri=" + URLEncoder.encode(callback+"?"+AttConstants.SCOPES+"="+scope, "UTF-8");
		
		log.info("ServiceProviderOauth :: oauthUrl redirect URL: " +url);
		return url;
	}

	/**
	 *
	 * @param clientID The client id; this may look something like c4c9084c6e9cb6ca01886a15e7dfd486
	 * @param clientSecret The clients secret; this may look something like a0725b93040cfe0e
	 * @param code This is the one time code returned when the user has logged-in.
	 * @return returns a TokenResponse which should concern an access_token
	 * @throws ApiRequestException
	 * @throws UnsupportedEncodingException 
	 * @throws ServiceProviderException - throws if any problems occur
	 * @method getToken
	 */
	public JSONObject getToken(String code) throws ApiRequestException, UnsupportedEncodingException {
		return getToken(getHost(), getClientID(), getClientSecret(), code);

	}

	/**
	 *
	 * @param host The domain name (or ip address) and port the request is submitted to. Example https://beta-api.att.com
	 * @param clientId The client id; this may look something like c4c9084c6e9cb6ca01886a15e7dfd486
	 * @param clientSecret The client secret; this may look something like a0725b93040cfe0e
	 * @param code This is the one time code returned when the user has logged-in.
	 * @return returns a TokenResponse which should concern a access_token
	 * @throws ApiRequestException
	 * @throws UnsupportedEncodingException 
	 * @throws ServiceProviderException - throws if any problems occur
	 * @method getToken
	 * @static
	 */
	public static JSONObject getToken(String host, String clientId, String clientSecret, String code) throws ApiRequestException, UnsupportedEncodingException {
		String url, toPost;

//		url = host + "/oauth/token"
//				+ "client_id=" + URLEncoder.encode(clientId, "UTF-8") 
//				+ "&client_secret=" + URLEncoder.encode(clientSecret, "UTF-8") 
//				+ "&code="+ URLEncoder.encode(code, "UTF-8")
//				+ "&grant_type=authorization_code";

		url = host + "/oauth/token";
		toPost = "client_id=" + URLEncoder.encode(clientId, "UTF-8") 
				+ "&client_secret=" + URLEncoder.encode(clientSecret, "UTF-8") 
				+ "&code="+ URLEncoder.encode(code, "UTF-8")
				+ "&grant_type=authorization_code";

		log.info("ServiceProviderOauth :: getToken Getting token using url: " + url);
		
//		ApiResponse response = ApiRequestManager.get(url);
		
		HttpPost post = new HttpPost(url);
        post.addHeader("Content-Type", "application/x-www-form-urlencoded");

        ApiResponse response = ApiRequestManager.post(toPost, post);

		log.info("ServiceProviderOauth :: getToken Response: " + response);

		return response.getResponse();


	}


	/***
	 *
	 * Fetches a new Token with an existing refresh token
	 *
	 * @param host
	 * @param clientId
	 * @param clientSecret
	 * @param refreshToken
	 * @return
	 * @throws ApiRequestException
	 * @throws UnsupportedEncodingException 
	 * @method getTokenUsingRefresh
	 * @static
	 */
	public static JSONObject getTokenUsingRefresh(String host, String clientId, String clientSecret, String refreshToken) throws ApiRequestException, UnsupportedEncodingException {
		String url, toPost;

		url = host + "/oauth/token";

		toPost = "client_id=" + URLEncoder.encode(clientId, "UTF-8") 
				+ "&client_secret=" + URLEncoder.encode(clientSecret, "UTF-8")  
				+ "&refresh_token="+ URLEncoder.encode(refreshToken, "UTF-8") 
				+ "&grant_type=refresh_token";

		log.info("ServiceProviderOauth :: getTokenUsingRefresh Getting token with refresh using url: " + url);

		HttpPost post = new HttpPost(url);
        post.addHeader("Content-Type", "application/x-www-form-urlencoded");
		
        ApiResponse response = ApiRequestManager.post(toPost, post);

		log.info("ServiceProviderOauth :: getTokenUsingRefresh Response: " + response);

		return response.getResponse();


	}

}
