package com.html5sdk.att.servlet;

import com.att.api.immn.service.IMMNService;
import com.att.api.oauth.OAuthToken;
import com.att.api.rest.RESTException;
import com.html5sdk.att.AttConstants;
import com.html5sdk.att.provider.ApiRequestException;
import com.html5sdk.att.servlet.Action;
import com.html5sdk.att.servlet.AttAuthorizationException;
import com.html5sdk.att.servlet.ServiceServletBase;
import com.html5sdk.att.servlet.SessionUtils;
import java.io.IOException;
import java.io.PrintStream;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class GetDeltaServlet
extends ServiceServletBase {
    private static final long serialVersionUID = 1;

    public void init() throws ServletException {
        //no-op
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.executeMatchingAction(request, response, new Action[]{new GetDeltaAction()});
    }

    class GetDeltaAction
    implements Action {
        GetDeltaAction() {
        }

        public boolean match(HttpServletRequest request) {
            return true;
        }

        public void handleException(Exception e, HttpServletResponse response) {
            GetDeltaServlet.this.submitJsonResponseFromException(e, response);
        }

        public void execute(HttpServletRequest request, HttpServletResponse response) throws ApiRequestException, RESTException, IOException {
            String state = GetDeltaServlet.this.getRequiredParameter(request, "state");
            OAuthToken token = SessionUtils.getTokenForScope(request.getSession(), "MIM");
            if (token == null) {
                throw new AttAuthorizationException("app not authorized by user");
            }
            IMMNService svc = new IMMNService(AttConstants.HOST, token);
            String jsonResult = svc.getDeltaAndReturnRawJson(state);
            GetDeltaServlet.this.submitJsonResponseFromJsonResult(jsonResult, response);
        }
    }

}

