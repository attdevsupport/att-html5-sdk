/**
 * 
 */
package com.html5sdk.att.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tika.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.att.api.oauth.OAuthToken;
import com.att.api.rest.RESTException;
import com.html5sdk.att.AttConstants;
import com.html5sdk.att.provider.ApiRequestException;
import com.att.api.notification.*;

/**
 * @author mattcobb
 *
 */
public class NotificationChannelServlet extends ServiceServletBase {
	/**
	 * 
	 */
	private static final long serialVersionUID = 3259158736613684789L;
    private NotificationChannel channel; 
	private NotificationService notificationSvc;
	
	/**
	 * 
	 */
	public NotificationChannelServlet() {
		super();
	}

    /**
     * @method init
     */
    @Override
    public void init() throws ServletException
    {
        super.init();
        
        notificationSvc = new NotificationService(AttConstants.HOST, clientToken);
        try {
        	// TODO: Pull the service name from config 
        	// in case we ever support another notification API in this SDK
            this.channel = notificationSvc.createNotificationChannel("MIM");
        } catch (JSONException jException) {
        	throw new ServletException(jException);
        }  catch (RESTException rException) {
        	throw new ServletException(rException);
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response,
                new Action[] { new GetChannel(), new GetSubscription() });
    }

    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        executeMatchingAction(request, response,
                new Action[] { new CreateSubscription(), new NotificationFromService() });
    }

    @Override
    protected void doPut(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response,
                new Action[] { new UpdateSubscription() });
    }
 
    @Override
    protected void doDelete(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response,
                new Action[] { new DeleteSubscription() });
    }
    
    class GetChannel implements Action
    {
        public boolean match(HttpServletRequest request) {
        	return request.getRequestURI().endsWith("/notification/v1");
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            notificationSvc.updateToken(SharedCredentials.getInstance().fetchOAuthToken());
            
            String jsonResult;
            try {
                jsonResult = notificationSvc.getNotificationChannelJSON(channel.getChannelId());
            } catch (JSONException jEx) {
            	throw new RESTException(jEx);
            }
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }
    
    // TODO: Add administrative role actions for create & delete notification channel

    class CreateSubscription implements Action {
        public boolean match(HttpServletRequest request) {
            return request.getRequestURI().endsWith("/notification/v1/subscription");
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException, JSONException {

            notificationSvc.updateToken(SharedCredentials.getInstance().fetchOAuthToken());
            
            // Pull the service (MIM) access token from the session
            OAuthToken serviceToken = SessionUtils.getTokenForScope(request.getSession(),
                    "MIM");
            
            String jsonResult = null;
            
            try {
	            // Pull out the request body parts
	            String body = IOUtils.toString(request.getInputStream());
	            JSONObject json = new JSONObject(body);
	
	            String callbackData = json.optString("callbackData", null);
	            JSONArray eventArray = json.getJSONArray("events");
	            String[] events = new String[eventArray.length()];
	            for(int iArray=0; iArray < eventArray.length(); iArray++) {
	            	events[iArray] = eventArray.getString(iArray);
	            }
	            int expiresIn = json.optInt("expiresIn", 0);
	            
	            jsonResult = notificationSvc.createNotificationSubscriptionJSON(channel, 
	                serviceToken, events, callbackData, expiresIn);
            } catch (JSONException jEx) {
            	throw new RESTException(jEx);
            }
            
            // Set the subscription object in the session object
            NotificationSubscription notificationSubscription = 
            		NotificationSubscription.valueOf(new JSONObject(jsonResult));
            
            // TODO: Put the callbackData 
            submitJsonResponseFromJsonResult(jsonResult, response);
        }    	
    }
    
    class GetSubscription implements Action
    {
        public boolean match(HttpServletRequest request) {
        	return request.getRequestURI().matches("/notification/v1/subscription/.*");
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            notificationSvc.updateToken(SharedCredentials.getInstance().fetchOAuthToken());
            
            String jsonResult;
            try {
                jsonResult = notificationSvc.getNotificationChannelJSON(channel.getChannelId());
            } catch (JSONException jEx) {
            	throw new RESTException(jEx);
            }
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }
    
    class UpdateSubscription implements Action
    {
        public boolean match(HttpServletRequest request) {
        	return request.getRequestURI().matches("/notification/v1/subscription/.*");
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            notificationSvc.updateToken(SharedCredentials.getInstance().fetchOAuthToken());
            
            String jsonResult;
            try {
                jsonResult = notificationSvc.getNotificationChannelJSON(channel.getChannelId());
            } catch (JSONException jEx) {
            	throw new RESTException(jEx);
            }
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }
    
    class DeleteSubscription implements Action
    {
        public boolean match(HttpServletRequest request) {
        	return request.getRequestURI().matches("/notification/v1/subscription/.*");
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            notificationSvc.updateToken(SharedCredentials.getInstance().fetchOAuthToken());
            
            String jsonResult;
            try {
                jsonResult = notificationSvc.getNotificationChannelJSON(channel.getChannelId());
            } catch (JSONException jEx) {
            	throw new RESTException(jEx);
            }
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }
    
    // TODO: Add administrative role actions for create & delete notification channel

    class NotificationFromService implements Action {
        public boolean match(HttpServletRequest request) {
            return request.getRequestURI().endsWith("/notification/v1/callback");
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException, JSONException
        {
        	// Check for channel id match with request.header.x-channelid
        	// Parse the body
        	// Walk the subscriptions
        	//// Find the callback data
        	//// Store (synchronized) the notification in a map by callbackData hash
        }    	
    }
}
