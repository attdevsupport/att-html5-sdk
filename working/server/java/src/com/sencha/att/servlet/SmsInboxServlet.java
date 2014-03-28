package com.sencha.att.servlet;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.att.api.rest.RESTException;
import com.att.api.sms.service.SMSService;
import com.sencha.att.AttConstants;
import com.sencha.att.provider.ApiRequestException;

public class SmsInboxServlet extends ServiceServletBase {
    private static final long serialVersionUID = 1L;

    public SmsInboxServlet() {
        super();
    }

    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response,
                new Action[] { new GetSmsAction() });
    }

    class GetSmsAction implements Action {

        @Override
        public boolean match(HttpServletRequest request) {
            return true; // matches all paths for this servlet
        }

        @Override
        public void handleException(Exception e, HttpServletResponse response) {
            submitJsonResponseFromException(e, response);
        }

        @Override
        public void execute(HttpServletRequest request,
                HttpServletResponse response) throws ApiRequestException,
                RESTException, IOException {

            String shortcode = request.getPathInfo();
            if (shortcode == null || shortcode.equals("")) {
                throw new IllegalArgumentException(
                        "a shortcode must be specified in the path");
            }
            try {
                shortcode = URLDecoder.decode(shortcode, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                log("can't decode shortcode from URL path; using encoded version");
            }
            SMSService svc = new SMSService(AttConstants.HOST,
                    SharedCredentials.getInstance().fetchOAuthToken());
            String jsonResult = svc.getSMSAndReturnRawJson(shortcode);
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }
}
