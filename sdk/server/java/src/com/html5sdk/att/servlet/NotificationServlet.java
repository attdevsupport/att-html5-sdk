/**
 * 
 */
package com.html5sdk.att.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;

import com.att.api.ads.service.ADSArguments;
import com.att.api.ads.service.ADSService;
import com.att.api.ads.service.Category;
import com.att.api.ads.service.Gender;
import com.att.api.ads.service.Type;
import com.att.api.notification.NotificationChannel;
import com.att.api.notification.NotificationService;
import com.att.api.oauth.OAuthToken;
import com.att.api.rest.RESTException;
import com.html5sdk.att.AttConstants;
import com.html5sdk.att.provider.ApiRequestException;
import com.html5sdk.att.servlet.GetAdServlet.GetAdAction;

/**
 * @author mattcobb
 *
 */
public class NotificationServlet extends ServiceServletBase {
	/**
	 * 
	 */
	private static final long serialVersionUID = 3259158736613684789L;
    private NotificationChannel channel; 
	private NotificationService notificationSvc;
	
	/**
	 * 
	 */
	public NotificationServlet() {
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
            this.channel= notificationSvc.createNotificationChannel("MIM");
        } catch (JSONException jException) {
        	throw new ServletException(jException);
        }  catch (RESTException rException) {
        	throw new ServletException(rException);
        }
        
        // TODO: Start the listener here or in permanent configuration??
    }
    
    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response,
                new Action[] { new GetChannelNotification() });
    }

    class GetChannelNotification implements Action
    {
        public boolean match(HttpServletRequest request) {
            return true; // matches all paths for this servlet
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
}
