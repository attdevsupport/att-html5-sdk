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
import com.att.api.webhooks.service.*;
import com.html5sdk.att.AttConstants;
import com.html5sdk.att.provider.ApiRequestException;

/**
 * @author mattcobb
 *
 */
public class NotificationChannelServlet extends ServiceServletBase {
	/**
	 * 
	 */
	private static final long serialVersionUID = 3259158736613684789L;
    private String channelId; 
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
        
        OAuthToken clientToken;
        try {
            clientToken = SharedCredentials.getInstance().fetchOAuthToken();
        } catch (ApiRequestException ex) {
            throw new ServletException(ex);
        }
        WebhooksService serverAuthorizedWebhooksService = new WebhooksService(AttConstants.HOST, clientToken);
        try {
            CreateChannelArgs args = new CreateChannelArgs("MIM", "application/json", 1.0);
            this.channelId = serverAuthorizedWebhooksService
                    .createNotificationChannel(args)
                    .getChannel()
                    .getChannelId(); 
        }  catch (RESTException ex) {
            try {
                String variables = new JSONObject(ex.getMessage())
                    .getJSONObject("RequestError")
                    .getJSONObject("PolicyException")
                    .getString("Variables");
                String[] parts = variables.split("channelId: ");
                this.channelId = parts[1];
                return;
            } catch (Exception innerEx) {
                // use the error handling below
            }
        	throw new ServletException(ex);
        }
    }

    private boolean requestHasSubscriptionId(HttpServletRequest request) {
        String uriParts[] = request.getRequestURI().split("/");
        
        if ((uriParts == null) || (uriParts.length == 0)) {
            return false;
        }
        
        String lastPart = uriParts[uriParts.length-1];
        if (lastPart.equalsIgnoreCase("subscriptions") ||
            lastPart.equalsIgnoreCase("notifications")) {
            return false;
        }
        return true;
    }
    
    private String getSubscriptionIdFromRequest(HttpServletRequest request) {
        String uriParts[] = request.getRequestURI().split("/");
        
        if ((uriParts == null) || (uriParts.length == 0)) {
            throw new RuntimeException("request uri does not contain a subscription id");
        }
        return uriParts[uriParts.length-1];
    }
    
    private String findSubscriptionId(HttpServletRequest request) {
        String subscriptionId = null;
        
        if (requestHasSubscriptionId(request))  {
            subscriptionId = getSubscriptionIdFromRequest(request);
        } else {
            HttpSession session = request.getSession();
            subscriptionId = (String) session.getAttribute(AttConstants.NOTIFICATION_SUBSCRIPTION_ID);
        }
        return subscriptionId;
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
    	
    	if (subscriptionId.equalsIgnoreCase("all")) {
    	    if (AttConstants.ENABLE_UNSAFE_OPERATIONS) {
                mimEvents = new ArrayList<MimNotificationEvent>();
                for ( String key : notifications.keySet()) {
                    mimEvents.addAll(notifications.get(key));
                }
    	    } else {
    	        throw new RuntimeException("unauthorized");
    	    }
    	} else {
    		mimEvents = notifications.get(subscriptionId);
    	}
    	return mimEvents;
    }  
    
    private synchronized ArrayList<MimNotificationEvent> removeEvents(String subscriptionId)
    {
    	ArrayList<MimNotificationEvent> mimEvents = null;
    	
    	if (subscriptionId.equalsIgnoreCase("all")) {
    	    if (AttConstants.ENABLE_UNSAFE_OPERATIONS) {
    	        mimEvents = new ArrayList<MimNotificationEvent>();
    	        for ( String key : notifications.keySet()) {
    	            mimEvents.addAll(notifications.remove(key));
    	        }
    	    } else {
    	        throw new RuntimeException("unauthorized");
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

        	if(!AttConstants.ENABLE_UNSAFE_OPERATIONS) {
                throw new RESTException("unauthorized");
            }
    	    OAuthToken clientToken = SharedCredentials.getInstance().fetchOAuthToken();
    	    WebhooksService serverAuthorizedWebhooksService = new WebhooksService(AttConstants.HOST, clientToken);
            
            GetChannelResponse getChannelResponse
                = serverAuthorizedWebhooksService.getNotificationChannelDetails(channelId);
            String jsonResult = constructJsonFromGetChannelResponse(getChannelResponse);
            submitJsonResponseFromJsonResult(jsonResult, response);
        }

        private String constructJsonFromGetChannelResponse(
                GetChannelResponse getChannelResponse) throws RESTException {
            try {
                GetChannelResponse.Channel channel = getChannelResponse.getChannel();
                JSONObject jsonChannel = new JSONObject();
                jsonChannel.put("channelId", channel.getChannelId());
                if (channel.getMaxEventsPerNotification() != null) {
                    jsonChannel.put("maxEventsPerNotification", channel.getMaxEventsPerNotification());
                }
                JSONObject jsonResult = new JSONObject();
                jsonResult.put("channel", jsonChannel);
                
                return jsonResult.toString();
            } catch (JSONException ex) {
                throw new RESTException(ex);
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

            String[] events = null;
            String callbackData = null;
            int expiresIn = 0;
            
            OAuthToken userConsentToken = SessionUtils.getTokenForScope(request, "MIM");

            WebhooksService userAuthorizedWebhooksService 
                = new WebhooksService(AttConstants.HOST, userConsentToken);

            try {
	            // Pull out the request body parts
	            String body = IOUtils.toString(request.getInputStream());
	            
	            JSONObject json = new JSONObject(body).getJSONObject("subscription");
	            
	            callbackData = json.optString("callbackData", "dummy callback data");
	            JSONArray eventArray = json.getJSONArray("events");
	            events = new String[eventArray.length()];
	            for(int iArray=0; iArray < eventArray.length(); iArray++) {
	            	events[iArray] = eventArray.getString(iArray);
	            }
	            expiresIn = json.optInt("expiresIn", 0);
            } catch (JSONException ex) {
                throw new RESTException(ex);
            }
            
            System.out.println("channelId: " + channelId);
            
            CreateSubscriptionArgs args 
                = new CreateSubscriptionArgs(channelId, events, callbackData, expiresIn);
            
            CreateSubscriptionResponse createSubscriptionResponse = null;
            try {
            createSubscriptionResponse
                = userAuthorizedWebhooksService.createNotificationSubscription(args);
            } catch (RESTException restEx) {
                System.out.println("message: " + restEx.getMessage());
                System.out.println("error message: " + restEx.getErrorMessage());
                System.out.println("status code: " + restEx.getStatusCode());
                throw restEx;
            }
            HttpSession session = request.getSession();
            session.setAttribute(AttConstants.NOTIFICATION_SUBSCRIPTION_ID, 
                    createSubscriptionResponse.getSubscription().getSubscriptionId());
            
            String jsonResult = constructJsonFromCreateSubscriptionResponse(
                    createSubscriptionResponse);
            submitJsonResponseFromJsonResult(jsonResult, response);
        }

        private String constructJsonFromCreateSubscriptionResponse(
                CreateSubscriptionResponse createSubscriptionResponse) throws RESTException {
            try {
                CreateSubscriptionResponse.Subscription subscription
                    = createSubscriptionResponse.getSubscription();
                
                JSONObject jsonSubscription = new JSONObject();
                jsonSubscription.put("subscriptionId", subscription.getSubscriptionId());
                
                if (subscription.getExpiresIn() != null) {
                    jsonSubscription.put("expiresIn", subscription.getExpiresIn());
                }
                JSONObject jsonResult = new JSONObject();
                jsonResult.put("subscription",  jsonSubscription);
                
                return jsonResult.toString();
            } catch (JSONException ex) {
                throw new RESTException(ex);
            }
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

            String subscriptionId = findSubscriptionId(request);
            OAuthToken userConsentToken = SessionUtils.getTokenForScope(request, "MIM");
            WebhooksService userAuthorizedWebhooksService 
                = new WebhooksService(AttConstants.HOST, userConsentToken);
            GetSubscriptionResponse getSubscriptionResponse = null;
            String result = "";
            try {
                getSubscriptionResponse = userAuthorizedWebhooksService.getNotificationSubscriptionDetails(channelId, subscriptionId);
                result = ConstructJsonFromGetSubscriptionResponse(getSubscriptionResponse);
            } catch (RESTException ex) {
            	if (ex.getStatusCode() == 404) {
            	    response.setStatus(404);
            	} else {
            	    throw new RESTException(ex);
            	}
            }
            submitJsonResponseFromJsonResult(result, response);
        }

        private String ConstructJsonFromGetSubscriptionResponse(
                GetSubscriptionResponse getSubscriptionResponse) throws RESTException {
            try {
                GetSubscriptionResponse.Subscription subscription
                    = getSubscriptionResponse.getSubscription();
                
                JSONArray eventFilters = new JSONArray();
                String[] sourceEvents = subscription.getEvents();
                
                for (int i = 0; i < sourceEvents.length; i++) {
                    eventFilters.put(sourceEvents[i]);
                }
                JSONObject jsonSubscription = new JSONObject();
                jsonSubscription.put("subscriptionId",  subscription.getSubscriptionId());
                jsonSubscription.put("expiresIn", subscription.getExpiresIn());
                jsonSubscription.put("eventFilters", eventFilters);
                jsonSubscription.put("callbackData", subscription.getCallbackData());
                JSONObject jsonResult = new JSONObject();
                jsonResult.put("subscription", jsonSubscription);
                return jsonResult.toString();
            } catch (JSONException ex) {
                throw new RESTException(ex);
            }
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

            String subscriptionId = findSubscriptionId(request);
            OAuthToken userConsentToken = SessionUtils.getTokenForScope(request, "MIM");
            WebhooksService userAuthorizedWebhooksService 
                = new WebhooksService(AttConstants.HOST, userConsentToken);
            
            try {
	            String body = IOUtils.toString(request.getInputStream());
	            JSONObject json = new JSONObject(body);
	
	            String callbackData = json.optString("callbackData", null);
	            JSONArray eventArray = json.getJSONArray("events");
	            String[] events = new String[eventArray.length()];
	            for(int iArray=0; iArray < eventArray.length(); iArray++) {
	            	events[iArray] = eventArray.getString(iArray);
	            }
	            int expiresIn = json.optInt("expiresIn", 0);
            	
	            UpdateSubscriptionArgs args = new UpdateSubscriptionArgs(channelId, subscriptionId, events, callbackData, expiresIn);
	            UpdateSubscriptionResponse updateSubscriptionResponse
	                = userAuthorizedWebhooksService.updateNotificationSubscription(args);
	            
                String result = ConstructJsonFromUpdateSubscriptionResponse(updateSubscriptionResponse);
                submitJsonResponseFromJsonResult(result, response);

            } catch (JSONException ex) {
            	throw new RESTException(ex);
            }
        }

        private String ConstructJsonFromUpdateSubscriptionResponse(
                UpdateSubscriptionResponse updateSubscriptionResponse) throws RESTException {
            
            UpdateSubscriptionResponse.Subscription subscription 
                = updateSubscriptionResponse.getSubscription();
            
            try {
                JSONObject jsonSubscription = new JSONObject()
                    .put("subscriptionId", subscription.getSubscriptionId())
                    .put("expiresIn", subscription.getExpiresIn());
                JSONObject jsonResult = new JSONObject()
                    .put("subscription", jsonSubscription);
                return jsonResult.toString();
            } catch (JSONException ex) {
                throw new RESTException(ex);
            }
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

            String subscriptionId = findSubscriptionId(request);
            OAuthToken userConsentToken = SessionUtils.getTokenForScope(request, "MIM");
            WebhooksService userAuthorizedWebhooksService 
                = new WebhooksService(AttConstants.HOST, userConsentToken);
            userAuthorizedWebhooksService.deleteNotificationSubscription(channelId, subscriptionId);
            response.setStatus(204);
        }
    }

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
        	    ! xChannelId.equalsIgnoreCase(channelId))
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
        	String subscriptionId = findSubscriptionId(request); 
            ArrayList<MimNotificationEvent> events = getEvents(subscriptionId);
            JSONArray eventArray = new JSONArray();
            if(events != null) {
            	for(int i = 0; i < events.size(); i++) {
            		eventArray.put(new JSONObject(events.get(i)));
            	}
            }
            JSONObject jsonResult = new JSONObject();
            jsonResult.put("notificationEvents", eventArray);
            submitJsonResponseFromJsonResult(jsonResult.toString(), response);
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
        	String subscriptionId = findSubscriptionId(request);
            ArrayList<MimNotificationEvent> events = removeEvents(subscriptionId);
            if(events == null) {
            	events = new ArrayList<MimNotificationEvent>();
            }
            JSONObject jsonEvents = new JSONObject(events);
            submitJsonResponseFromJsonResult(jsonEvents.toString(), response);
        }    	
    }    
}
