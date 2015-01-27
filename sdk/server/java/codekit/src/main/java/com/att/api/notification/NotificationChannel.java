package com.att.api.notification;

import org.json.JSONException;
import org.json.JSONObject;

public class NotificationChannel {
	private String channelId;
	private int maxEventsPerNotification;
	private String serviceName;
	private String channelType;
	private String contentType;
	private double version;
	
	public NotificationChannel() {
	}
	
	public NotificationChannel(String channelId, int maxEvents) {
		this(channelId, maxEvents, null, null, null, 1.0);
	}
	
	public NotificationChannel(String channelId, int maxEvents,
	    String serviceName, String channelType, String contentType, double version)
	{
		this.setChannelId(channelId);
		this.setMaxEvents(maxEvents);
		if(serviceName != null) this.setServiceName(serviceName);
		if(channelType != null) this.setChannelType(channelType);
		if(contentType != null) this.setContentType(contentType);
		this.version = version;
		return;
	}
	
    public static NotificationChannel valueOf(JSONObject jobj) throws JSONException {
    	JSONObject jsonChannel = jobj.getJSONObject("channel");

        NotificationChannel returnObj = new NotificationChannel(
        	jsonChannel.getString("channelId"),
            jsonChannel.optInt("maxEventsPerNotification", 0));
        
        try {
        	returnObj.setServiceName(jsonChannel.getString("serviceName"));
        } catch (Exception e) {}
        
        try {
        	returnObj.setChannelType(jsonChannel.getString("channelType"));
        } catch (Exception e) {}
        
        try {
        	returnObj.setContentType(jsonChannel.getString("notificationContentType"));
        } catch (Exception e) {};
 
        try {
        	returnObj.setVersion(jsonChannel.getDouble("notificationVersion"));
        } catch (Exception e) {};
        
        return returnObj;
    }

	public String getChannelId() {
		return channelId;
	}

	public void setChannelId(String channelId) {
		this.channelId = channelId;
	}
	public Integer getMaxEvents() {
		return maxEventsPerNotification;
	}
	public void setMaxEvents(Integer maxEvents) {
		this.maxEventsPerNotification = maxEvents;
	}

	public String getServiceName() {
		return serviceName;
	}

	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}

	public String getChannelType() {
		return channelType;
	}

	public void setChannelType(String channelType) {
		this.channelType = channelType;
	}

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public double getVersion() {
		return version;
	}

	public void setVersion(double version) {
		this.version = version;
	}
}
