package com.att.api.notification;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class NotificationSubscription {
	private String subscriptionId;
	private String[] eventFilters;
	private int expiresIn;
	private String callbackData;
	
	public NotificationSubscription () {
	}

	public NotificationSubscription (String subscriptionId,
	    int expiresIn) {
		this(subscriptionId, expiresIn, null);
	} 

	public NotificationSubscription (String subscriptionId,
	    int expiresIn, String[] eventFilters)
	{
		this.subscriptionId = subscriptionId;
		this.expiresIn = expiresIn;
		if(eventFilters != null) {
			this.eventFilters = eventFilters; 
		}
	}
	
	public static NotificationSubscription valueOf(JSONObject jobj) {
    	JSONObject jsonSubscription = jobj.getJSONObject("subscription");

        NotificationSubscription returnObj = new NotificationSubscription(
            jsonSubscription.getString("subscriptionId"),
            jsonSubscription.optInt("expiresIn", 0));
        
        try {
        	JSONArray eventFiltersJson = jsonSubscription.getJSONArray("eventFilters");
        	String[] parsedEventFilters = new String[eventFiltersJson.length()];
        	for(int iFilter=0; iFilter<eventFiltersJson.length(); iFilter++) {
        		parsedEventFilters[iFilter] = eventFiltersJson.getString(iFilter);
        	}
        } catch (JSONException e) {}

        return returnObj;
	}

	public String getSubscriptionId() {
		return subscriptionId;
	}

	public void setSubscriptionId(String subscriptionId) {
		this.subscriptionId = subscriptionId;
	}

	public String[] getEventFilters() {
		return eventFilters;
	}

	public void setEventFilters(String[] eventFilters) {
		this.eventFilters = eventFilters;
	}

	public int getExpiresIn() {
		return expiresIn;
	}

	public void setExpiresIn(int expiresIn) {
		this.expiresIn = expiresIn;
	}

	public String getCallbackData() {
		return callbackData;
	}
	
	public void setCallbackData(String callbackData) {
		this.callbackData = callbackData;
	}
}
