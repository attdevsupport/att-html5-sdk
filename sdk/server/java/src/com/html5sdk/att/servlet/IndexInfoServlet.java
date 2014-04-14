package com.html5sdk.att.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.att.api.immn.service.IMMNService;
import com.att.api.oauth.OAuthToken;
import com.att.api.rest.RESTException;
import com.html5sdk.att.AttConstants;
import com.html5sdk.att.provider.ApiRequestException;

/**
 * This class processes requests to the in-app messaging index info endpoint
 * 
 * @class com.html5sdk.att.servlet.IndexInfoServlet
 */
public class IndexInfoServlet extends ServiceServletBase {
    private static final long serialVersionUID = 1L;

    public IndexInfoServlet() {
        super();
    }

    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response,
                new Action[] { new GetMessageIndexInfoAction() });
    }

    class GetMessageIndexInfoAction implements Action {

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

            OAuthToken token = SessionUtils.getTokenForScope(
                    request.getSession(), "MIM");

            if (token == null) {
                throw new AttAuthorizationException(
                        "app not authorized by user");
            }

            IMMNService svc = new IMMNService(AttConstants.HOST, token);
            String jsonResult = svc.getMessageIndexInfoAndReturnRawJson();
            submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }
}
