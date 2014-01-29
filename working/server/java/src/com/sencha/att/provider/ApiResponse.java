package com.sencha.att.provider;

import org.json.JSONException;
import org.json.JSONObject;


/**
 *
 * ApiResponse contains the raw HTTP body, a parsed JSON response, and the HTTP status code from the API request.
 * @class com.sencha.att.provider.ApiResponse
 *
 */
public class ApiResponse {

    private String rawBody;
    private String redirectUrl;
    private JSONObject response;


    private int statusCode;

    public ApiResponse(int status, String rawBody, JSONObject response, String redirectUrl) {
        this.statusCode = status;
        this.rawBody = rawBody;
        this.response = response;
        this.redirectUrl = redirectUrl;
    }

    /**
     * @method getRawBody
     */
    public String getRawBody() {
        return rawBody;
    }

    /**
     * @method getRedirectUrl
     */
    public String getRedirectUrl() {
        return redirectUrl;
    }

    /**
     * @method getResponse
     */
    public JSONObject getResponse() {
        return response;
    }

    /**
     * @method getStatusCode
     */
    public int getStatusCode() {
        return statusCode;
    }

    /**
     * @method toString
     */
    public String toString() {
        return "ApiResponse: status: " + statusCode + " body:" + rawBody;
    }

    /**
     * @method toJson
     */
    public JSONObject toJson() {
        JSONObject obj = new JSONObject();
        try {
            obj.put(ServiceProviderConstants.RESULT, this.response);
            obj.put(ServiceProviderConstants.APISTATUSCODE, this.statusCode);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return obj;

    }
}
