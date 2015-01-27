/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 */

/*
 * Copyright 2015 AT&T
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.att.api.notification;

import org.json.JSONException;
import org.json.JSONObject;

import com.att.api.oauth.OAuthToken;
import com.att.api.service.APIService;
import com.att.api.rest.*;

/**
 * @author mattcobb
 *
 */
public class NotificationService extends APIService
{
	public NotificationService(String fqdn, OAuthToken token)
	{
		super(fqdn, token);
	}
	
	private final String endpointBase = getFQDN() + "/notification/v1/channels";
	
	public NotificationChannel createNotificationChannel(
    	String serviceName) throws RESTException, JSONException
    {
		return this.createNotificationChannel(serviceName, "application/json", 1.0);
	}
	
    public NotificationChannel createNotificationChannel(
		String serviceName,
		String ncType,
		double version) throws RESTException, JSONException
	{
        JSONObject jobj = new JSONObject(
            createNotificationChannelJSON(serviceName, ncType, version));

        return NotificationChannel.valueOf(jobj);
    }
    
    public String createNotificationChannelJSON(
		String serviceName,
		String ncType,
		double version) throws RESTException, JSONException
	{
    	JSONObject jsonChannel = new JSONObject();
    	jsonChannel.put("serviceName", serviceName);
    	jsonChannel.put("notificationContentType", ncType);
    	jsonChannel.put("notificationVersion", version);
    	
    	JSONObject jsonPostBody = new JSONObject();
    	jsonPostBody.put("channel", jsonChannel);
    	
        final APIResponse response = new RESTClient(endpointBase)
            .setHeader("Accept", "application/json")
            .setHeader("Content-Type", "application/json")
            .addAuthorizationHeader(getToken())
            .httpPost(jsonPostBody.toString());

        return response.getResponseBody();
    }
 
    public NotificationChannel getNotificationChannel(
    	String channelId) throws RESTException, JSONException
    {
        JSONObject jobj = new JSONObject(
        		getNotificationChannelJSON(channelId));

        return NotificationChannel.valueOf(jobj);
    }
    
    public String getNotificationChannelJSON(
		String channelId) throws RESTException, JSONException
    {
        final APIResponse response = new RESTClient(endpointBase + "/" + channelId)
            .setHeader("Accept", "application/json")
            .setHeader("Content-Type", "application/json")
            .addAuthorizationHeader(getToken())
            .httpGet();

        return response.getResponseBody();
    }
    
    public void deleteNotificationChannel(
        String channelId) throws RESTException
    {
        final APIResponse response = new RESTClient(endpointBase + "/" + channelId)
        .setHeader("Content-Type", "application/json")
        .addAuthorizationHeader(getToken())
        .httpDelete();
        
        if (response.getStatusCode() != 204) {
            final int code = response.getStatusCode();
            final String body = response.getResponseBody();
            throw new RESTException(code, body);
        }
    }
    
    public NotificationSubscription createNotificationSubscription(
    	NotificationChannel channel, OAuthToken serviceToken,
    	String[] events, String callbackData, int expiresIn)
        throws RESTException, JSONException
    {
        JSONObject jobj = new JSONObject(
            createNotificationSubscriptionJSON(channel, serviceToken,
                events, callbackData, expiresIn));

        return NotificationSubscription.valueOf(jobj);
    }

	public String createNotificationSubscriptionJSON(
		NotificationChannel channel, OAuthToken serviceToken,
		String[] events, String callbackData, int expiresIn) 
		throws RESTException
	{
		return sendSubscription(channel, serviceToken, events, callbackData, expiresIn,
	        true).getResponseBody();	
	}
	
    public NotificationSubscription getNotificationSubscription(
		NotificationChannel channel,
		String subscriptionId,
		OAuthToken serviceToken) throws RESTException, JSONException
    {
        JSONObject jobj = new JSONObject(
        		getNotificationSubscriptionJSON(channel, subscriptionId, serviceToken));

        return NotificationSubscription.valueOf(jobj);
    }
    
    public String getNotificationSubscriptionJSON(
		NotificationChannel channel,
		String subscriptionId,
		OAuthToken serviceToken) throws RESTException, JSONException
    {
        final APIResponse response = new RESTClient(endpointBase + "/" + channel.getChannelId() +
        		"/subscriptions/" + subscriptionId)
            .setHeader("Accept", "application/json")
            .setHeader("Content-Type", "application/json")
            .addAuthorizationHeader(serviceToken.getAccessToken())
            .httpGet();

        return response.getResponseBody();
    }
    
    public void deleteNotificationSubscription(
		NotificationChannel channel,
	    String subscriptionId,
	    OAuthToken serviceToken) throws RESTException
    {
        final APIResponse response = new RESTClient(endpointBase + "/" +
            channel.getChannelId() + "/subscriptions/" + subscriptionId)
            .setHeader("Content-Type", "application/json")
            .addAuthorizationHeader(serviceToken.getAccessToken())
            .httpDelete();
        
        if (response.getStatusCode() != 204) {
            final int code = response.getStatusCode();
            final String body = response.getResponseBody();
            throw new RESTException(code, body);
        }
    }
    public NotificationSubscription updateNotificationSubscription(
        	NotificationChannel channel, OAuthToken serviceToken,
        	String[] events, String callbackData, int expiresIn)
            throws RESTException, JSONException
    {
        JSONObject jobj = new JSONObject(
            createNotificationSubscriptionJSON(channel, serviceToken,
                events, callbackData, expiresIn));

        return NotificationSubscription.valueOf(jobj);
    }

	public String updateNotificationSubscriptionJSON(
		NotificationChannel channel, OAuthToken serviceToken,
		String[] events, String callbackData, int expiresIn) 
		throws RESTException, JSONException
	{
		return sendSubscription(channel, serviceToken, events, callbackData, expiresIn,
		     false).getResponseBody();
	}
	
	private APIResponse sendSubscription(
		NotificationChannel channel, OAuthToken serviceToken,
		String[] events, String callbackData, int expiresIn, boolean create) 
	    throws RESTException, JSONException
	{
    	JSONObject jsonSubscription = new JSONObject();
    	jsonSubscription.put("events", events);
    	
    	if(callbackData != null && callbackData.length()>0) {
    		jsonSubscription.put("callbackData", callbackData);
    	}
    	
    	jsonSubscription.put("expiresIn", expiresIn);
    	
    	JSONObject jsonBody = new JSONObject();
    	jsonBody.put("subscription", jsonSubscription);
    	
        RESTClient subscriptionClient = new RESTClient(endpointBase + "/" + 
            channel.getChannelId() + "/subscriptions")
            .setHeader("Accept", "application/json")
            .setHeader("Content-Type", "application/json")
            .addAuthorizationHeader(serviceToken.getAccessToken());
        
        final APIResponse response;
        if(create) {
        	response = subscriptionClient.httpPost(jsonBody.toString());
        } else {
        	response = subscriptionClient.httpPut(jsonBody.toString());
        }
        
        return response;
	}
}