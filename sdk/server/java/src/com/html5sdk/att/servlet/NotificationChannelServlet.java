/**
 * 
 */
package com.html5sdk.att.servlet;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

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
    HashMap<String, ArrayList<MimNotificationEvent>> notifications = 
            new HashMap<String, ArrayList<MimNotificationEvent>>();

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

    private NotificationSubscription findSubscription(HttpServletRequest request) {
    	HttpSession session = request.getSession();
        NotificationSubscription subscription = null;
        
        String uriParts[] = request.getRequestURI().split("/");
        
        if (uriParts != null && 
        	uriParts.length > 0 &&
        	(uriParts[uriParts.length-1].equalsIgnoreCase("subscriptions") ||
             uriParts[uriParts.length-1].equalsIgnoreCase("notifications")))
        {
            subscription = (NotificationSubscription) session.getAttribute(AttConstants.NOTIFICATION_SUBSCRIPTION);
        } else {
        	subscription = new NotificationSubscription();
        	subscription.setSubscriptionId(uriParts[uriParts.length-1]);
        }
        
        return subscription;
    }
    
    private synchronized void saveEvents(String subscriptionId, JSONArray jsonEvents) 
        throws JSONException
    {
    	ArrayList<MimNotificationEvent> subscriberEvents = null;
    	MimNotificationEvent mimEvent;
    	
    	subscriberEvents = notifications.get(subscriptionId);
    	if(subscriberEvents == null) {
    		subscriberEvents = new ArrayList<MimNotificationEvent>();
    	}
    	
    	for(int iEvent=0; iEvent < jsonEvents.length(); iEvent++) {
    		mimEvent = MimNotificationEvent.valueOf(jsonEvents.getJSONObject(iEvent));
    		subscriberEvents.add(mimEvent);
    	}
    	notifications.put(subscriptionId, subscriberEvents);
    }

    private synchronized ArrayList<MimNotificationEvent> getEvents(String subscriptionId)
    {
    	ArrayList<MimNotificationEvent> mimEvents = null;
    	
    	if (AttConstants.ENABLE_UNSAFE_OPERATIONS &&
    	    subscriptionId.equalsIgnoreCase("all")) {
    		mimEvents = new ArrayList<MimNotificationEvent>();
    		for ( String key : notifications.keySet()) {
    			mimEvents.addAll(notifications.get(key));
    		}
    	} else {
    		mimEvents = notifications.get(subscriptionId);
    	}
    	return mimEvents;
    }  
    
    private synchronized ArrayList<MimNotificationEvent> removeEvents(String subscriptionId)
    {
    	ArrayList<MimNotificationEvent> mimEvents = null;
    	
    	if (AttConstants.ENABLE_UNSAFE_OPERATIONS &&
    	    subscriptionId.equalsIgnoreCase("all"))
    	{
    		mimEvents = new ArrayList<MimNotificationEvent>();
    		for ( String key : notifications.keySet()) {
    			mimEvents.addAll(notifications.remove(key));
    		}
    	} else {
    	    mimEvents = notifications.remove(subscriptionId);
    	}
    	return mimEvents;
    }
    
    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response,
            new Action[] {
        		new GetChannel(),
        		new GetSubscription(),
        		new GetNotifications()
            });
    }

    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        executeMatchingAction(request, response,
            new Action[] {
        		new CreateSubscription(),
        		new NotificationFromService()
        	});
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
                new Action[] {
        		   new DeleteSubscription(),
        		   new DeleteNotifications()
        		});
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

        	if(AttConstants.ENABLE_UNSAFE_OPERATIONS) {
	            notificationSvc.updateToken(SharedCredentials.getInstance().fetchOAuthToken());
	            
	            String jsonResult;
	            try {
	                jsonResult = notificationSvc.getNotificationChannelJSON(channel.getChannelId());
	            } catch (JSONException jEx) {
	            	throw new RESTException(jEx);
	            }
	            submitJsonResponseFromJsonResult(jsonResult, response);
        	} else {
        		throw new RESTException("unauthorized");
        	}
        }
    }
    
    class CreateSubscription implements Action {
        public boolean match(HttpServletRequest request) {
            return request.getRequestURI().endsWith("/notification/v1/subscriptions");
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
            String callbackData;
            try {
	            // Pull out the request body parts
	            String body = IOUtils.toString(request.getInputStream());
	            
	            JSONObject json = new JSONObject(body).getJSONObject("subscription");
	            
	            callbackData = json.optString("callbackData", null);
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
            
            // Set the callback data in the subscription object
            if(callbackData != null) {
            	notificationSubscription.setCallbackData(callbackData);
            }
            HttpSession session = request.getSession();
            // Set the subscription object in the session
            session.setAttribute(AttConstants.NOTIFICATION_SUBSCRIPTION, notificationSubscription);
            
            submitJsonResponseFromJsonResult(jsonResult, response);
        }    	
    }
    
    class GetSubscription implements Action
    {
        public boolean match(HttpServletRequest request) {
        	return request.getRequestURI().matches(".*/notification/v1/subscriptions.*");
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            notificationSvc.updateToken(SharedCredentials.getInstance().fetchOAuthToken());

            String jsonResult;
            NotificationSubscription subscription = findSubscription(request);
            
            try {
                jsonResult = notificationSvc.getNotificationSubscriptionJSON(
                   channel, 
                   subscription.getSubscriptionId(),
                   SessionUtils.getTokenForScope(request.getSession(), "MIM"));
            } catch (JSONException jEx) {
            	throw new RESTException(jEx);
            } catch (RESTException rEx) {
            	if(rEx.getStatusCode()==404) {
            	    response.setStatus(rEx.getStatusCode());
            	    jsonResult = "";
            	} else {
            	    throw new RESTException(rEx);
            	}
            }
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }
    
    class UpdateSubscription implements Action
    {
        public boolean match(HttpServletRequest request) {
        	return request.getRequestURI().matches("/notification/v1/subscriptions/.*");
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            notificationSvc.updateToken(SharedCredentials.getInstance().fetchOAuthToken());
            
            String jsonResult;
            String callbackData;
            
            // Pull the service (MIM) access token from the session
            OAuthToken serviceToken = SessionUtils.getTokenForScope(request.getSession(),
                    "MIM");

            try {
            	NotificationSubscription subscription = findSubscription(request);
            	
	            // Pull out the request body parts
	            String body = IOUtils.toString(request.getInputStream());
	            JSONObject json = new JSONObject(body);
	
	            callbackData = json.optString("callbackData", null);
	            JSONArray eventArray = json.getJSONArray("events");
	            String[] events = new String[eventArray.length()];
	            for(int iArray=0; iArray < eventArray.length(); iArray++) {
	            	events[iArray] = eventArray.getString(iArray);
	            }
	            int expiresIn = json.optInt("expiresIn", 0);
            	
                jsonResult = notificationSvc.updateNotificationSubscriptionJSON(
                    channel, serviceToken, subscription.getSubscriptionId(),  
                		events, callbackData, expiresIn);
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

            NotificationSubscription subscription = findSubscription(request);
            
            // Pull the service (MIM) access token from the session
            OAuthToken serviceToken = SessionUtils.getTokenForScope(request.getSession(), "MIM");
            
            try {
                notificationSvc.deleteNotificationSubscription(
                    channel, subscription.getSubscriptionId(), serviceToken);
            } catch (RESTException jEx) {
            	throw new RESTException(jEx);
            }
            
            response.setStatus(204);
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
        	// Check subscription version
        	String xChannelId = request.getHeader(AttConstants.NOTIFICATION_CHANNELID_HEADER);
        	if (xChannelId == null ||
        	    ! xChannelId.equalsIgnoreCase(channel.getChannelId()))
        	{
        		throw new RESTException("ChannelID Mismatch");
        	}
        	String xNotificationVersion = request.getHeader("x-notificationVersion");        	
        	if (xNotificationVersion == null ||
        	    ! xNotificationVersion.equalsIgnoreCase("1.0"))
        	{
        		throw new RESTException("Unsupported notification version " + 
        	       xNotificationVersion + " Supported version: 1.0");
        	}

        	String body = IOUtils.toString(request.getInputStream());
            JSONArray subscriptionsArray = new JSONObject(body)
               .getJSONObject("notification")
               .getJSONArray("subscriptions");
            JSONObject subJsonObj;
            
            for(int iSub=0; iSub < subscriptionsArray.length(); iSub++) {
            	subJsonObj = subscriptionsArray.getJSONObject(iSub);
            	
            	// Store the Notification Events
            	// TODO: A single event comes not as an array but as a single object
            	saveEvents(subJsonObj.getString("subscriptionId"),
            	    subJsonObj.getJSONArray("notificationEvents"));
            }
        }    	
    }
    
    class GetNotifications implements Action {
        public boolean match(HttpServletRequest request) {
            return request.getRequestURI().matches(".*/notification/v1/notifications.*");
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException, JSONException
        {
        	NotificationSubscription subscription = findSubscription(request); 
        	
        	// Get notification events
            ArrayList<MimNotificationEvent> events = getEvents(subscription.getSubscriptionId());
            
            String eventArrayString = "[]";
            JSONArray eventArray = new JSONArray();
            if(events != null) {
            	eventArray = new JSONArray();
            	for(int iEvent=0; iEvent < events.size(); iEvent++) {
            		eventArray.put(new JSONObject(events.get(iEvent)));
            	}
            	eventArrayString = eventArray.toString();
            }
            
        	// return json of events
            submitJsonResponseFromJsonResult("{ \"notificationEvents\": " + eventArrayString + " }",
               response);
        }
    }    

    class DeleteNotifications implements Action {
        public boolean match(HttpServletRequest request) {
            return request.getRequestURI().matches(".*/notification/v1/notifications/.*");
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException, JSONException
        {
        	// Get subscription
        	NotificationSubscription subscription = findSubscription(request);
        	
        	// Get notification events
            ArrayList<MimNotificationEvent> events = removeEvents(subscription.getSubscriptionId());
            
            if(events == null) {
            	events = new ArrayList<MimNotificationEvent>();
            }
            JSONObject jsonEvents = new JSONObject(events);
            
        	// return json of events
            submitJsonResponseFromJsonResult(jsonEvents.toString(), response);
        }    	
    }    
}
