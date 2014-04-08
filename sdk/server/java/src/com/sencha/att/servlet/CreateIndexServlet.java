package com.sencha.att.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.att.api.immn.service.CacheStatus;
import com.att.api.immn.service.IMMNService;
import com.att.api.immn.service.MessageIndexInfo;
import com.att.api.oauth.OAuthToken;
import com.att.api.rest.RESTException;
import com.sencha.att.AttConstants;

/**
 * This class processes requests to the in-app messaging create index endpoint
 * 
 * @class com.sencha.att.servlet.CreateIndexServlet
 */
public class CreateIndexServlet extends ServiceServletBase {
    private static final long serialVersionUID = 1L;

    public CreateIndexServlet() {
        super();
    }

    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        // Refer to
        // http://developer.att.com/static-assets/documents/apis/ATT-In-App-Messaging-Index-Management.pdf
        // for details of the algorithm used below.

        OAuthToken token = SessionUtils.getTokenForScope(request.getSession(),
                "MIM");

        if (token == null) {
            response.sendError(401, "app not authorized by user");
            return;
        }

        IMMNService svc = new IMMNService(AttConstants.HOST, token);
        MessageIndexInfo info;

        try {
            info = svc.getMessageIndexInfo();
            CacheStatus status = info.getStatus();
            if ((status == CacheStatus.NOT_INITIALIZED)
                    || (status == CacheStatus.ERROR)) {
                svc.createMessageIndex();
            }
            while (status != CacheStatus.INITIALIZED) {
                status = svc.getMessageIndexInfo().getStatus();
            }
        } catch (RESTException e) {
            e.printStackTrace();
            response.sendError(500, e.getErrorMessage());
        }
    }
}
