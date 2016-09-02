package com.html5sdk.att.servlet;

import com.att.api.immn.service.CacheStatus;
import com.att.api.immn.service.IMMNService;
import com.att.api.immn.service.MessageIndexInfo;
import com.att.api.oauth.OAuthToken;
import com.att.api.rest.RESTException;
import com.html5sdk.att.AttConstants;
import com.html5sdk.att.servlet.ServiceServletBase;
import com.html5sdk.att.servlet.SessionUtils;
import java.io.IOException;
import java.io.PrintStream;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class CreateIndexServlet
extends ServiceServletBase {
    private static final long serialVersionUID = 1;

    public void init() throws ServletException {
        //no-op
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        OAuthToken token = SessionUtils.getTokenForScope(request.getSession(), "MIM");
        if (token == null) {
            response.sendError(401, "app not authorized by user");
            return;
        }
        IMMNService svc = new IMMNService(AttConstants.HOST, token);
        try {
            MessageIndexInfo info = svc.getMessageIndexInfo();
            CacheStatus status = info.getStatus();
            if (status == CacheStatus.NOT_INITIALIZED || status == CacheStatus.ERROR) {
                svc.createMessageIndex();
            }
            while (status != CacheStatus.INITIALIZED) {
                status = svc.getMessageIndexInfo().getStatus();
            }
        }
        catch (RESTException e) {
            e.printStackTrace();
            response.sendError(500, e.getErrorMessage());
        }
    }
}

