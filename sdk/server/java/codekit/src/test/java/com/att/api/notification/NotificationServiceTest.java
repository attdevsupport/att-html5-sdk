package com.att.api.notification;

import org.junit.Test;

import com.att.api.oauth.OAuthService;
import com.att.api.oauth.OAuthToken;
import com.att.api.rest.APIRequestError;
import com.att.api.rest.RESTConfig;
import com.att.api.rest.RESTException;

import static org.junit.Assert.assertTrue;
//import com.att.api.notification.*;

public class NotificationServiceTest {

    // set these settings to use this integration test
    // TODO: move to config file
    private final String fqdn = "https://api.att.com";
    //private final String fqdn = "https://api-uat.mars.bf.sl.attcompute.com";
    private final String accessToken = "";
    private final String clientId = "";
    private final String clientSecret = "";

    @Test
    public void send() throws RESTException {
    	try {
    		// TODO: move to config file
		// Uncomment this when on AT&T Internal network...
	        //RESTConfig.setDefaultProxy("one.proxy.att.com", 8080);
	    	// Uncomment this when in UAT...
		//RESTConfig.setDefaultTrustAllCerts(true);
	
	        /*if (accessToken == null || accessToken.equals("")) {
	            final String msg = "Notification integration test settings not set; skipping.";
	            System.out.println(msg);
	            return; 
	        }*/
	    	
	    	if ((clientId == null || clientId.equals("") || clientSecret == null || clientSecret.equals("")) &&
	    		(accessToken == null || accessToken.equals("")))
	    	{
	            final String msg = "Notification integration test settings missing; skipping.";
	            System.out.println(msg);
	            return; 
	        }
	
	    	OAuthToken token;
	    	if(accessToken==null || accessToken.length()==0) {
	    		OAuthService oAuthSrvc = new OAuthService(fqdn, clientId, clientSecret); 
	        	token = oAuthSrvc.getToken("NOTIFICATIONCHANNEL");
	    	} else {
	    		token = new OAuthToken(accessToken, OAuthToken.NO_EXPIRATION, "");
	    	}
	        NotificationService notificationSrvc = new NotificationService(fqdn, token);
	
	        NotificationChannel channel=null;
	        try {
	            channel = notificationSrvc.createNotificationChannel("MIM");
	        } catch (RESTException createChanEx) {
	        	// If a channel already exists for this key, delete it and continue the test
	        	APIRequestError reqErr = new APIRequestError(createChanEx.getErrorMessage());
	        	if(reqErr.isNotificationChannelAlreadyExistsError() && reqErr.getNotificationChannelId()!=null) {
	        		notificationSrvc.deleteNotificationChannel(reqErr.getNotificationChannelId());
	        		channel = notificationSrvc.createNotificationChannel("MIM");
	        	} else {
	        		throw createChanEx;
	        	}
	        }
	        assertTrue(channel.getChannelId() != null);
	        
	        NotificationChannel channelDetails = notificationSrvc.getNotificationChannel(channel.getChannelId());
	        assertTrue(channelDetails.getMaxEvents() > 0);
	        assertTrue(channelDetails.getChannelId().equals(channel.getChannelId()));
	        assertTrue(channelDetails.getChannelType().equals("http_callback"));
	        assertTrue(channelDetails.getServiceName().equals("MIM"));
	        
	        // Clean up the channel so the test runs successfully next time
	        notificationSrvc.deleteNotificationChannel(channel.getChannelId());
    	} catch (Exception testEx) {
    		System.out.println(testEx.toString());
    		assertTrue(testEx == null);
    	}
    }
}
