package com.sencha.att.provider;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import org.apache.http.client.methods.HttpPost;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * Use this class to make SMS API calls.
 * @author jason
 * @class com.sencha.att.provider.ServiceProviderSms
 *
 */
public class ServiceProviderSms {
	private static final String SMS_MESSAGING_URN = "/rest/sms/2/messaging";
    private static final String SMS_MESSAGING_OUTBOX = SMS_MESSAGING_URN + "/outbox";
    private static final String SMS_MESSAGING_INBOX = SMS_MESSAGING_URN + "/inbox";
    
	private static Logger log = Logger.getLogger(ServiceProviderConstants.SERVICEPROVIDERLOGGER);



    /**
     * This method requests information about the device
     *
     * @param host The domain name (or ip address) and port the request is submitted to. Example https://beta-api.att.com
     * @param accessToken The Token representing the logged-in user
     * @param tel The Telephone number of the user
     * @param message The message
     * @return the JSON result
     * @throws ApiRequestException
     * @method sendSms
     * @static
     */
    public static ApiResponse sendSms(String host, String accessToken, String tel, String message) throws ApiRequestException {
        String url = host + SMS_MESSAGING_OUTBOX;
        String[] telArray = tel.split(",");
        JSONObject object = new JSONObject();

        try {
            if (telArray.length == 1) {
                object.put("Address", "tel:" + telArray[0]);
            } else {
                for (int i = 0; i < telArray.length; i++) {
                    telArray[i] = "tel:" + telArray[i];
                }
                object.put("Address", telArray);
            }
            object.put("Message", message);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        
        HttpPost post = new HttpPost(url);
        post.setHeader("Authorization", "Bearer "+accessToken);
        
	    log.info("ServiceProviderSMS :: sendSms POST to url: " + url);
	    log.info("ServiceProviderSMS :: sendSms Request: " + object);
	    
        ApiResponse response = ApiRequestManager.postJSON(object, post);

	    log.info("ServiceProviderSMS :: sendSms Response: " + response.toJson());

        return response;
    }



    /**
     * This method requests the Sms Status
     *
     * @param host The domain name (or ip address) and port the request is submitted to. Example https://beta-api.att.com
     * @param accessToken The Token representing the logged in user
     * @param smsId The Sms Id
     * @return will return a JSONObject of the device information
     * @throws ApiRequestException
     * @method smsStatus
     * @static
     */
    public static ApiResponse smsStatus(String host, String accessToken, String smsId) throws ApiRequestException{
        String url = host + SMS_MESSAGING_OUTBOX + "/" + smsId;
        Map<String, String> headers = new HashMap<String, String>();

        headers.put("Authorization", "Bearer "+accessToken);

	    log.info("ServiceProviderSMS :: smsStatus GET to url: " + url);

        ApiResponse response = ApiRequestManager.get(url, headers);

	    log.info("ServiceProviderSMS :: smsStatus Response: " + response.toJson());
        
        return response;
    }


    /**
     * This method requests the Sms Status
     *
     * @param host The domain name (or ip address) and port the request is submitted to. Example https://beta-api.att.com
     * @param accessToken The Token representing the logged in user
     * @param registrationId The registrationId to receive messages from.
     * @return will return a JSONObject of the device information
     * @throws ApiRequestException
     * @throws UnsupportedEncodingException 
     * @method receiveSms
     * @static
     */
    public static ApiResponse receiveSms(String host, String accessToken, String registrationId) throws ApiRequestException{
    	String url  = host + SMS_MESSAGING_INBOX;
    	Map<String, String> headers = new HashMap<String, String>();
    	headers.put("Authorization", "Bearer "+accessToken);

    	
    	 try {
			url += "?RegistrationID=" + URLEncoder.encode(registrationId, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
    	 
 	    log.info("ServiceProviderSMS :: receiveSms GET to url: " + url);
    	
        ApiResponse response = ApiRequestManager.get(url, headers);

        log.info("ServiceProviderSMS :: receiveSms Response: " + response.toJson());

        return response;

    }

}
