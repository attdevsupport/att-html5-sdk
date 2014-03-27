package com.sencha.att.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.att.api.immn.service.IMMNService;
import com.att.api.oauth.OAuthToken;
import com.att.api.rest.RESTException;
import com.sencha.att.AttConstants;

/**
 * This class processes requests to the in-app messaging index info endpoint
 * 
 * @class com.sencha.att.servlet.IndexInfoServlet
 */
public class IndexInfoServlet extends ServiceServletBase {
    private static final long serialVersionUID = 1L;

    public IndexInfoServlet() {
        super();
    }

    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        this.executeWithJsonErrorHandling(request, response);
    }

    @Override
    protected String execute(HttpServletRequest request) throws RESTException {

        OAuthToken token = SessionUtils.getTokenForScope(request.getSession(),
                "MIM");

        if (token == null) {
            throw new AttAuthorizationException("app not authorized by user");
        }

        IMMNService svc = new IMMNService(AttConstants.HOST, token);
        return svc.getMessageIndexInfoAndReturnRawJson();
    }
}
