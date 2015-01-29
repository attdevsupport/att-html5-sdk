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
	//private final String fqdn = "https://api.att.com";
    private final String fqdn = "https://api-uat.mars.bf.sl.attcompute.com";
    private final String accessToken = "";
    private final String clientId = "";
    private final String clientSecret = "";

    @Test
    public void send() throws RESTException {
    	try {
    		// TODO: move to config file
	        RESTConfig.setDefaultProxy("one.proxy.att.com", 8080);
	    	RESTConfig.setDefaultTrustAllCerts(true);
	
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
	        
	        channel = notificationSrvc.createNotificationChannel("MIM", notificationSrvc.REUSE_EXISTING_CHANNEL);

	        assertTrue(channel.getChannelId() != null);
	        
	        NotificationChannel channelDetails = notificationSrvc.getNotificationChannel(channel.getChannelId());
	        assert(channelDetails.getMaxEvents() > 0);
	        assert(channelDetails.getChannelId() == channel.getChannelId());
	        assert(channelDetails.getChannelType().equalsIgnoreCase("http_callback"));
	        assert(channelDetails.getServiceName() == "MIM");
	        
	        // Clean up the channel so the test runs successfully next time
	        notificationSrvc.deleteNotificationChannel(channel.getChannelId());
    	} catch (Exception testEx) {
    		System.out.println(testEx.toString());
    		assertTrue(testEx == null);
    	}
    }
}
