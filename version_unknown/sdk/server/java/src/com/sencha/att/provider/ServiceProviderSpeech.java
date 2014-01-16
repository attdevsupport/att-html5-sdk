package com.sencha.att.provider;

import java.io.File;
import java.util.logging.Logger;

import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.FileEntity;

/**
 * Service Provider to access Speech To Text API.  
 * @class com.sencha.att.provider.ServiceProviderSpeech
 */
public class ServiceProviderSpeech {

    private static final String URN_SPEECH_TO_TEXT = "/rest/1/SpeechToText";
	private static Logger log = Logger.getLogger(ServiceProviderConstants.SERVICEPROVIDERLOGGER);


    /**
     * Sends audio file (audio/wav or audio/amr) to Translate to text using generic SpeechToText API. 
     * @param host The domain name (or ip address) and port the request is submitted to. Example https://beta-api.att.com
     * @param accessToken The Token representing the logged-in user
     * @param fileType {String} MIME type for the audio file "audio/wav" or "audio/amr"
     * @param audioFilePath {String} audio file name 
     * @param streamed {boolean} true to send the file as stream
     * @return ApiResponse
     * @throws ApiRequestException 
     * @method sendSpeech
     * @static
     */
	public static ApiResponse sendSpeech(String host, String accessToken, String fileType, String audioFilePath, boolean streamed) throws ApiRequestException {
		
		ApiResponse response = null;
		String url = host + URN_SPEECH_TO_TEXT;
		boolean chunked = streamed;
		
		
		FileEntity entity = new FileEntity(new File(audioFilePath), fileType);
		entity.setChunked(chunked);
		HttpPost post = new HttpPost(url);	
	    post.addHeader("Authorization", "Bearer "+accessToken);
	    post.setEntity(entity);
	    
	    log.info("ServiceProviderSpeech :: sendSpeech POST to url: "+url+" chunked: "+ chunked + " file: " + audioFilePath + " with mime type: " + fileType);
	    
	    response = ApiRequestManager.execute(post);

	    log.info("ServiceProviderSpeech :: sendSpeech Response: " + response.toJson());
	    		
	    return response;
	}
}
