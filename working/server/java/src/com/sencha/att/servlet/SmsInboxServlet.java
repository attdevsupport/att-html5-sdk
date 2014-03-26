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

/**
 * This class processes requests to the SMS inbox endpoint
 * 
 * @class com.sencha.att.servlet.SmsInboxServlet
 */
public class SmsInboxServlet extends ClientCredentialsServletBase {
    private static final long serialVersionUID = 1L;

    public SmsInboxServlet() {
        super();
    }

    /**
     * Handle inbox GET requests
     * 
     * @method doGet
     * 
     */
    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        this.executeWithJsonErrorHandling(request, response);
    }

    @Override
    protected String execute(HttpServletRequest request) throws RESTException {

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
        SMSService svc = new SMSService(AttConstants.HOST, this.clientToken);
        return svc.getSMSAndReturnRawJson(shortcode);
    }
}
