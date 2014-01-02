package com.sencha.att.provider;

import org.json.JSONException;
import org.json.JSONObject;


/**
 * @class com.sencha.att.provider.ApiRequestException
 * @author jason
 *
 */
public class ApiRequestException extends Exception {


    private static final long serialVersionUID = 1L;


    private int httpStatusCode;

    /**
     * @method getHttpStatusCode
     */
    public int getHttpStatusCode() {
        return httpStatusCode;
    }

    /**
     * @method setHttpStatusCode
     * @param {int} httpStatusCode
     */
    public void setHttpStatusCode(int httpStatusCode) {
        this.httpStatusCode = httpStatusCode;
    }

    /**
     * @method getHttpResponseBody
     */
    public String getHttpResponseBody() {
        return httpResponseBody;
    }

    /**
     * @param {String} httpResponseBody
     * @method setHttpResponseBody
     */
    public void setHttpResponseBody(String httpResponseBody) {
        this.httpResponseBody = httpResponseBody;
    }

    /**
     * @property httpResponseBody
     */
    private String httpResponseBody;



    public ApiRequestException(String message, int httpStatusCode, String httpResponseBody) {
        super(message);
        this.httpStatusCode = httpStatusCode;
        this.httpResponseBody = httpResponseBody;
    }

    /**
     * @param {String} message
     * @param {int} httpStatusCode
     * @param {String} httResponseBody
     * @param {Throwable} cause
     * @constructor
     */
    public ApiRequestException(String message, int httpStatusCode, String httpResponseBody, Throwable cause) {
        super(message, cause);
        this.httpStatusCode = httpStatusCode;
        this.httpResponseBody = httpResponseBody;
    }

    /**
     * @method getMessage
     * @return {java.lang.String} the message
     */
    public String getMessage(){
        return super.getMessage() + " http status code " + this.httpStatusCode + " response body " + this.httpResponseBody;
    }

    /**
     * @method toJson
     * Returns the exception in a JSONObject with error, details and status code.
     */
    public JSONObject toJson() {
        JSONObject obj = new JSONObject();
        try {
            if(this.httpResponseBody != null){
            	JSONObject error = new JSONObject(httpResponseBody);
            	obj.put(ServiceProviderConstants.ERROR, error);
            }else if(this.getCause() != null){
            	obj.put(ServiceProviderConstants.ERROR, super.getMessage());
            	obj.put(ServiceProviderConstants.ERROR_DETAILS, this.getCause().getMessage());
            }
            obj.put(ServiceProviderConstants.APISTATUSCODE, this.httpStatusCode);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return obj;

    }
}
