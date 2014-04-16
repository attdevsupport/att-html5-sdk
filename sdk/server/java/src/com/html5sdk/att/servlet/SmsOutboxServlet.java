package com.html5sdk.att.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.att.api.rest.RESTException;
import com.att.api.sms.service.SMSService;
import com.html5sdk.att.AttConstants;
import com.html5sdk.att.provider.ApiRequestException;

/**
 * This class processes requests to the sendSms endpoint
 * 
 * @class com.html5sdk.att.servlet.SmsOutboxServlet
 */
public class SmsOutboxServlet extends ServiceServletBase {

    // first version of this servlet
    private static final long serialVersionUID = 1L;

    public SmsOutboxServlet() {
        super();
    }

    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response,
                new Action[] { new GetSmsStatusAction() });
    }

    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response,
                new Action[] { new SendSmsAction() });
    }

    class GetSmsStatusAction implements Action {

        public boolean match(HttpServletRequest request) {

            String pathInfo = request.getPathInfo();
            return pathInfo != null;
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            // pathInfo includes the leading forward-slash in front of the SMS
            // ID - the substring() call gets rid of it.
            String smsId = request.getPathInfo().substring(1);
            SMSService svc = new SMSService(AttConstants.HOST, clientToken);
            String jsonResult = svc.getSMSDeliveryStatusAndReturnRawJson(smsId);
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }

    class SendSmsAction implements Action {

        public boolean match(HttpServletRequest request) {

            String pathInfo = request.getPathInfo();
            return pathInfo == null;
        }

        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            String addresses = getRequiredParameter(request, "addresses");
            String message = getRequiredParameter(request, "message");
            boolean shouldNotify = getNotifyParameter(request);

            SMSService svc = new SMSService(AttConstants.HOST, clientToken);
            String jsonResult = svc.sendSMSAndReturnRawJson(addresses, message,
                    shouldNotify);
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }
}
