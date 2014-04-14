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

public class GetNotificationConnectionDetailsServlet extends ServiceServletBase {
    private static final long serialVersionUID = 1L;

    public GetNotificationConnectionDetailsServlet() {
        super();
    }

    @Override
    protected void service(HttpServletRequest request,
            HttpServletResponse response) throws IOException, ServletException {

        OAuthToken token = SessionUtils.getTokenForScope(request.getSession(),
                "MIM");

        if (token == null) {
            response.sendError(401, "app not authorized by user");
            return;
        }

        IMMNService service = new IMMNService(AttConstants.HOST, token);
        request.setAttribute(AttConstants.SERVICE_ATTRIBUTE, service);

        super.service(request, response);
    }

    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        executeMatchingAction(request, response,
                new Action[] { new GetNotificationConnectionDetailsAction() });
    }

    class GetNotificationConnectionDetailsAction implements Action {

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

            String queues = getRequiredParameter(request, "queues");
            String details = ((IMMNService) request
                    .getAttribute(AttConstants.SERVICE_ATTRIBUTE))
                    .getNotificationConnectionDetailsAndReturnRawJson(queues);
            submitJsonResponseFromJsonResult(details, response);
        }
    }
}
