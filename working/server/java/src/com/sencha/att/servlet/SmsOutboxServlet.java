package com.sencha.att.servlet;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.att.api.oauth.OAuthToken;
import com.att.api.rest.RESTException;
import com.att.api.sms.service.SMSService;
import com.sencha.att.AttConstants;
import com.sencha.att.provider.ApiRequestException;
import com.sencha.att.provider.TokenResponse;

/**
 * This class processes requests to the sendSms endpoint
 * 
 * @class com.sencha.att.servlet.SmsOutboxServlet
 */
public class SmsOutboxServlet extends ClientCredentialsServletBase {
    private static final long serialVersionUID = 1L; // first version of this
                                                     // servlet

    /*
     * @see HttpServlet#HttpServlet()
     */
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
     * 
     */
    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        try {
            OAuthToken token = this.credentialsManager.fetchOAuthToken();
            SMSService svc = new SMSService(AttConstants.HOST, token);

            String responseJson;
            String pathInfo = request.getPathInfo();
            if (pathInfo == null || pathInfo.equals("")) {
                responseJson = sendSms(request, svc);
            } else {
                responseJson = smsStatus(request, svc, pathInfo);
            }

            response.setContentType("application/json");
            Writer writer = response.getWriter();
            try {
                writer.write(responseJson);
            } finally {
                writer.close();
            }
        } catch (Exception se) {
            try {
                log(se.toString());
                se.printStackTrace();
                response.reset();
                response.setStatus(500);
                response.setContentType("application/json");
                Writer writer = response.getWriter();
                try {
                    TokenResponse.getResponse(se).write(writer);
                } finally {
                    writer.close();
                }
            } catch (Exception e) {
                log(e.getMessage());
                e.printStackTrace();
            }
        }
    }

    private String sendSms(HttpServletRequest request, SMSService svc)
            throws RESTException, ApiRequestException {

        String addresses = getRequiredParameter(request, "addresses");
        String message = getRequiredParameter(request, "message");

        boolean shouldNotify = true;
        String notify = request.getParameter("notify");
        if ((notify == null) || notify.equalsIgnoreCase("false")
                || (notify.equals("0"))) {
            shouldNotify = false;
        }

        return svc.sendSMSAndReturnRawJson(addresses, message, shouldNotify);
    }

    private String smsStatus(HttpServletRequest request, SMSService svc,
            String pathInfo) throws RESTException {
        log("pathInfo: " + pathInfo);
        return svc.getSMSDeliveryStatusAndReturnRawJson(pathInfo.substring(1));
    }
}
