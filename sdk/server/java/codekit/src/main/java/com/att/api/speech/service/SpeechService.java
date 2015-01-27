package com.att.api.speech.service;

import java.io.File;

import org.json.JSONException;
import org.json.JSONObject;

import com.att.api.oauth.OAuthToken;
import com.att.api.rest.APIResponse;
import com.att.api.rest.RESTClient;
import com.att.api.rest.RESTException;
import com.att.api.service.APIService;
import com.att.api.speech.model.SpeechResponse;

/**
 * Class that handles communication with the speech server.
 *
 */
public class SpeechService extends APIService {
    private boolean chunked;
    
    public SpeechService(String fqdn, OAuthToken token) {
        super(fqdn, token);
        this.chunked = false;
    }

    /**
     * Sets whether to send the request body chunked or non-chunked.
     *
     * @param chunked
     *            value to set
     */
    public void setChunked(boolean chunked) {
        this.chunked = chunked;
    }

    /**
     * Sends the request to the server.
     *
     * @param audio audio file to convert to text
     *
     * @return SpeechResponse object
     * @throws RESTException
     * @see SpeechResponse
     */
    public SpeechResponse speechToText(File audio) throws Exception {
        return speechToText(audio, null);
    }

    /**
     * Sends the request to the server.
     *
     * @param audio audio file to convert to text
     * @param xArgs Special information about the request 
     *
     * @return SpeechResponse object
     * @throws RESTException
     * @see SpeechResponse
     */
    public SpeechResponse speechToText(File audio, 
            String xArgs) throws Exception {
        return speechToText(audio, xArgs, null);
    }

    /**
     * Sends the request to the server.
     *
     * @param audio audio file to convert to text
     * @param xArgs Special information about the request 
     * @param speechContext additional context information about the audio
     *
     * @return SpeechResponse object
     * @throws RESTException
     * @see SpeechResponse
     */
    public SpeechResponse speechToText(File audio, String xArgs, 
            String speechContext) throws Exception {
        return speechToText(audio, xArgs, speechContext, null);
    }

    /**
     * Sends the request to the server.
     *
     * @param audio audio file to convert to text
     * @param xArgs Special information about the request 
     * @param speechContext additional context information about the audio
     * @param subContext speechContext additional information
     *
     * @return SpeechResponse object
     * @throws RESTException
     * @see SpeechResponse
     */
    public SpeechResponse speechToText(File audio, String xArg, 
            String speechContext, String subContext) throws Exception {
        return SpeechResponse.valueOf(new JSONObject(sendRequestAndReturnRawJson(audio, xArg, speechContext, subContext, "en-US")));
    }
    
    public String sendRequestAndReturnRawJson(File file, String xArg, 
            String speechContext, String subContext, String isoLanguage) throws Exception {
        final String endpoint = getFQDN() + "/speech/v3/speechToText";

        RESTClient restClient = new RESTClient(endpoint)
            .addAuthorizationHeader(getToken())
            .addHeader("Accept", "application/json")
            .addHeader("X-SpeechContext", speechContext)
            .addHeader("Content-Language", isoLanguage);

        if (xArg != null && !xArg.equals("")) {
            restClient.setHeader("X-Arg", xArg);
        }
        if (subContext != null && !subContext.equals("")
                && speechContext.equals("Gaming")) {
            restClient.addHeader("X-SpeechSubContext", subContext);
        }
        APIResponse apiResponse = restClient.httpPost(file);
        return apiResponse.getResponseBody();
    }
}
