package com.sencha.att.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Writer;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.sencha.att.AttConstants;
import com.sencha.att.provider.ApiRequestException;
import com.sencha.att.provider.ApiResponse;
import com.sencha.att.provider.ClientCredentialsManager;
import com.sencha.att.provider.Payment;
import com.sencha.att.provider.ServiceProviderConstants;
import com.sencha.att.util.XMLUtils;

/**
 *
 * NotificationServlet handles ATT push notifications.  This servlet is meant to be extended by the developer.
 * This servlet will simply receive a  POST notification from att and it will parse the XML body sent by att.
 * If there are notification IDs in the XML document, then they will be passed as a list to  handleNotifications()
 *
 *
 *
 *  Depending on the needs of the application, the developer will need to call
 *  Payment.getNotification and Payment.acknowledgeNotification
 *
 *  @class com.sencha.att.servlet.NotificationServlet
 *
 */
public class NotificationServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private static Logger log = Logger.getLogger(ServiceProviderConstants.SERVICEPROVIDERLOGGER);

    private ClientCredentialsManager credentialsManager;


    /*
     * @see HttpServlet#HttpServlet()
     */
    public NotificationServlet() {
        super();
        this.credentialsManager  = SharedCredentials.getInstance();

    }

    /**
     * Calls doPost
     * @method doGet
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }

    /**
     * @method doPost
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {




         BufferedReader reader = request.getReader();
            StringBuilder sb = new StringBuilder();
            String line = reader.readLine();
            while (line != null) {
                sb.append(line + "\n");
                line = reader.readLine();
            }

            reader.close();
            String data = sb.toString();

            List<String> notificationIds = XMLUtils.getValuesForNode(data, "hub:notificationId");

            this.handleNotifications(notificationIds);

            Writer out = response.getWriter();
            out.write("OK");
            out.flush();
            out.close();

    }


    /**
     * Method is called when an XML message is posted to this servlet. The XML is parsed and the IDs are extracted
     * before this method is invoked.
     *
     * Override this method to do something useful with the notificationIds.
     *
     * @param notificationIds
     * @method handleNotifications
     */
    public void handleNotifications(List<String> notificationIds) {
        Payment payment = new Payment(AttConstants.HOST, AttConstants.CLIENTSECRETSTRING, AttConstants.CLIENTSECRETSTRING);

         for (Iterator<String> iterator = notificationIds.iterator(); iterator.hasNext();) {
                String notificationId = iterator.next();
                log.info("Received Notification ID: " + notificationId);

                /*
                 * In a real application this servlet would call payment.acknowledgeNotification to stop ATT from sending the notices
                 *
                 * Then, it would fetch the notification details and forward them onto other systems.
                 *
                 * Because these API calls could take time or the app server could crash and they should not be called from the current servlet thread,
                 * notificationId should be sent to an batch processing/persistent storage before sending acknowledge.
                 */
                try {

                    ApiResponse results = payment.getNotification(this.credentialsManager.getCurrentToken(), notificationId);
                    log.info("get: " + results.toJson());

                    results = payment.acknowledgeNotification(this.credentialsManager.getCurrentToken(), notificationId);
                    log.info("ack: " + results.toJson());

                } catch (ApiRequestException e) {
                    /*
                     * Handle ack/get failure
                     */
                    e.printStackTrace();
                }



         }


    }
}
