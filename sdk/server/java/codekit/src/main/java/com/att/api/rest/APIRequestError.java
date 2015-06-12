/**
 * 
 */
package com.att.api.rest;

import org.json.JSONObject;

/**
 * @author mattcobb
 *
 */
public class APIRequestError
{
	private String exceptionType;
	private String messageId;
	private String variables;
	private String raw;
	private String text;

	public APIRequestError(String requestError) {
		JSONObject errorJson = new JSONObject(requestError);
		try {
			JSONObject requestErrorObj = errorJson.getJSONObject("RequestError");
			
            if (null != requestErrorObj.optJSONObject("PolicyException")) {
                requestErrorObj = requestErrorObj.optJSONObject("PolicyException");
            }
            else if (null != requestErrorObj.optJSONObject("ServiceException")) {
                requestErrorObj = requestErrorObj.optJSONObject("ServiceException");
            }
			
		    setExceptionType(requestErrorObj.optString("ExceptionType", "missing"));
		    setMessageId(requestErrorObj.optString("MessageId", "missing"));
		    setText(requestErrorObj.optString("Text", "missing"));
		    setVariables(requestErrorObj.optString("Variables", "missing"));
		    raw = requestError;
		} catch (Exception errEx) {
	    }
	}

	public String getExceptionType() {
		return exceptionType;
	}

	public void setExceptionType(String exceptionType) {
		this.exceptionType = exceptionType;
	}

	public String getMessageId() {
		return messageId;
	}

	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}

	public String getVariables() {
		return variables;
	}

	public void setVariables(String variables) {
		this.variables = variables;
	}

	public String getRaw() {
		return raw;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}
	
	public boolean isNotificationChannelAlreadyExistsError() {
		return(text.startsWith("Channel already exists"));
	}
	
	public String getNotificationChannelId() {
		String channelId = null;
		if(! variables.equalsIgnoreCase("missing")) {
			String[] varParts = variables.split(":");
			if(varParts.length > 1) {
				channelId = varParts[1].trim();
			}
		}
		return channelId;
	}
}
