package com.sencha.att.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.att.api.rest.RESTException;
import com.att.api.sms.service.SMSService;
import com.sencha.att.AttConstants;
import com.sencha.att.provider.ApiRequestException;

/**
 * This class processes requests to the sendSms endpoint
 * 
 * @class com.sencha.att.servlet.SmsOutboxServlet
 */
public class SmsOutboxServlet extends ClientCredentialsServletBase {

    // first version of this servlet
    private static final long serialVersionUID = 1L;

    public SmsOutboxServlet() {
        super();
    }

    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }

    /**
     * Handle sendSms POST requests
     * 
     * @method doPost
     */
    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        executeWithJsonErrorHandling(request, response);
    }

    @Override
    protected String execute(HttpServletRequest request) throws RESTException,
            ApiRequestException {
        SMSService svc = new SMSService(AttConstants.HOST, clientToken);

        // requests sent to the outbox URL can be sendSms, if it is a POST to
        // the outbox URL with no SMS ID specified in the path; or it can be
        // smsStatus, if it is a GET with the SMS ID specified in the request
        // URL path. We use the path to tell the difference; pathInfo tells us
        // if an SMS ID was specified.
        String responseJson;
        String pathInfo = request.getPathInfo();
        if (pathInfo == null || pathInfo.equals("")) {
            responseJson = sendSms(request, svc);
        } else {
            responseJson = smsStatus(request, svc, pathInfo);
        }
        return responseJson;
    }

    private String sendSms(HttpServletRequest request, SMSService svc)
            throws RESTException, ApiRequestException {

        String addresses = getRequiredParameter(request, "addresses");
        String message = getRequiredParameter(request, "message");
        boolean shouldNotify = getNotifyParameter(request);

        return svc.sendSMSAndReturnRawJson(addresses, message, shouldNotify);
    }

    private String smsStatus(HttpServletRequest request, SMSService svc,
            String pathInfo) throws RESTException {
        // pathInfo includes the leading forward-slash in front of the SMS ID -
        // the substring() call gets rid of it.
        return svc.getSMSDeliveryStatusAndReturnRawJson(pathInfo.substring(1));
    }

    private boolean getNotifyParameter(HttpServletRequest request) {
        boolean shouldNotify = true;
        String notify = request.getParameter("notify");
        if ((notify == null) || notify.equalsIgnoreCase("false")
                || (notify.equals("0"))) {
            shouldNotify = false;
        }
        return shouldNotify;
    }
}
