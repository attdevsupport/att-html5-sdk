package com.sencha.att.provider;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.logging.Logger;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.entity.InputStreamEntity;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Service Provider to access Speech To Text API.  
 * @class com.sencha.att.provider.ServiceProviderSpeech
 */
public class ServiceProviderSpeech {

    private static final String URN_SPEECH_TO_TEXT = "/rest/2/SpeechToText";
	private static Logger log = Logger.getLogger(ServiceProviderConstants.SERVICEPROVIDERLOGGER);


    /**
     * Sends audio file to translate to text using generic SpeechToText API. 
     * @param host The domain name (or ip address) and port the request is submitted to. Example https://beta-api.att.com
     * @param accessToken The Token representing the logged-in user
     * @param contentType {String} MIME type for the audio file. i.e."audio/x-wav" ,"audio/amr"
     * @param stream {InputStream} the stream to be sent 
     * @param chunked {boolean} true to send the file as stream
     * @param context {String} the context where the speech is going to be parsed.
     * @param xargs {JSONObject} a value pair of xargs. 
     * @return ApiResponse
     * @throws ApiRequestException 
     * @throws JSONException 
     * @throws IOException 
     * @method sendSpeech
     * @static
     */
	public static ApiResponse sendSpeech(String host, String accessToken, String contentType, InputStream stream, boolean chunked, String context, JSONObject xargs) throws ApiRequestException, JSONException, IOException {
		
		ApiResponse response = null;
		String url = host + URN_SPEECH_TO_TEXT;
		String xArgsValue = parseXArgs(xargs);
		HttpEntity entity;


		if(chunked){
			entity = new InputStreamEntity(stream, -1);
		}else{
			entity = new ByteArrayEntity(IOUtils.toByteArray(stream));
		}
		
		HttpPost post = new HttpPost(url);	
		post.addHeader("Authorization", "Bearer "+accessToken);
	    post.addHeader("Content-Type", contentType);
	    
	    if(context != null){
	    	post.addHeader("X-SpeechContext",context);
	    }

	    if(xArgsValue != null){
	    	post.addHeader("X-Args", xArgsValue);
	    }
	    
	    post.setEntity(entity);
	    
	    log.info("ServiceProviderSpeech :: sendSpeech POST to url: "+url+" chunked: "+ chunked + " with mime type: " + contentType);
	    
	    response = ApiRequestManager.execute(post);

	    log.info("ServiceProviderSpeech :: sendSpeech Response: " + response.toJson());
	    		
	    return response;
	}


	private static String parseXArgs(JSONObject xargs) throws JSONException, UnsupportedEncodingException {
		String str = null;
		
		if(null != xargs && JSONObject.NULL != xargs){
	    	String[] names = JSONObject.getNames(xargs);
	    	int l = 0;
	    	for (String name : names) {
				Object value = xargs.get(name);
				if(value != null && value != JSONObject.NULL){
					String v = (String)value;
					str += name + "=" + URLEncoder.encode(v, "utf-8") ;
					
					if(l<names.length-1){
						str += ",";
					}
				}

				l++;
			}
	    	
	    }
		return str;
	}
}
