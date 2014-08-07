package com.html5sdk.att.servlet;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;

import com.att.api.oauth.OAuthToken;
import com.html5sdk.att.provider.ApiRequestException;
import com.html5sdk.att.provider.ClientCredentialsManager;
import com.html5sdk.att.provider.TokenResponse;

/**
 * @class com.html5sdk.att.servlet.ClientCredentialsServletBase
 * 
 *        Provides common properties and methods for derived servlets that need
 *        to use client credential auth.
 */
abstract class ServiceServletBase extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected ClientCredentialsManager credentialsManager;
    protected OAuthToken clientToken;

    /*
     * @see HttpServlet#HttpServlet()
     */
    public ServiceServletBase() {
        super();
    }

    /**
     * @method init
     */
    @Override
    public void init() throws ServletException {

        this.credentialsManager = SharedCredentials.getInstance();
        try {
            this.clientToken = this.credentialsManager.fetchOAuthToken();
        } catch (ApiRequestException e) {
            throw new ServletException(e);
        }
    }

    protected void executeMatchingAction(HttpServletRequest request,
            HttpServletResponse response, Action[] actions) {

        Action matchingAction = null;
        for (Action action : actions) {
            if (action.match(request)) {
                if (matchingAction != null) {
                    throw new ActionConfigurationException(
                            "request matched multiple actions");
                }
                matchingAction = action;
            }
        }
        if (matchingAction == null) {
            throw new ActionConfigurationException(
                    "request did not match any configured actions");
        }
        try {
            matchingAction.execute(request, response);
        } catch (Exception e) {
            matchingAction.handleException(e, response);
        }
    }

    /**
     * take care of a lot of error handling boilerplate for service calls that
     * return a JSON payload. Override 'execute' to implement service-specific
     * functionality, and return your JSON string from there.
     * 
     * @method executeWithJsonErrorHandling
     * @param request
     * @param response
     * @throws IOException
     */
    protected void submitJsonResponseFromJsonResult(String jsonResult,
            HttpServletResponse response) throws IOException {

        response.setContentType("application/json");
        Writer writer = response.getWriter();
        try {
            writer.write(jsonResult);
        } finally {
            writer.close();
        }
    }

    protected void submitJsonResponseFromException(Exception exception,
            HttpServletResponse response) {

        try {
            log(exception.toString());
            exception.printStackTrace();
            response.reset();
            if (exception instanceof IllegalArgumentException) {
                response.setStatus(400);
            } else if (exception instanceof AttAuthorizationException) {
                response.setStatus(401);
            } else {
                response.setStatus(500);
            }
            response.setContentType("application/json");
            Writer writer = response.getWriter();
            try {
                TokenResponse.getResponse(exception).write(writer);
            } finally {
                writer.close();
            }
        } catch (Exception e) {
            log(e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * @method getMergedXArgs we'll accept both xarg and xargs input, and merge
     *         them if necessary.
     */
    protected String getMergedXArgs(HttpServletRequest request)
            throws UnsupportedEncodingException {
        String xarg = request.getParameter("xarg");
        String xargs = request.getParameter("xargs");

        if ((xarg != null) && (xargs != null)) {
            xarg = URLEncoder.encode(URLDecoder.decode(xarg, "UTF-8") + ","
                    + URLDecoder.decode(xargs, "UTF-8"), "UTF-8");
        } else if (xarg == null) {
            xarg = xargs;
        }
        return xarg;
    }

    /**
     * @method setClientSdk ensure the ClientSdk X-Arg parameter is set
     *         correctly.
     */
    protected String setClientSdk(String originalXArgs)
    {
        String clientSdk = "ClientSdk=atthtml5.java.3.1";
        if (originalXArgs == null) {
            return clientSdk;
        }
        ArrayList<String> updatedXArgs = new ArrayList<String>();
        String[] originalXArgsArray = originalXArgs.split(",");
        for (String pair : originalXArgsArray) {
            String[] pairArray = pair.split("=");
            String name = pairArray[0];
            if (!name.equalsIgnoreCase("ClientSdk")) {
                updatedXArgs.add(pair);
            }
        }
        updatedXArgs.add(clientSdk);
        return StringUtils.join(updatedXArgs, ",");
    }

    protected String getRequiredParameter(HttpServletRequest request,
            String name) throws RuntimeException {
        String value = request.getParameter(name);
        if (value == null) {
            throw new RuntimeException("'" + name
                    + "' querystring parameter required");
        }
        return value;
    }

    protected boolean getNotifyParameter(HttpServletRequest request) {
        boolean shouldNotify = true;
        String notify = request.getParameter("notify");
        if ((notify == null) || notify.equalsIgnoreCase("false")
                || (notify.equals("0"))) {
            shouldNotify = false;
        }
        return shouldNotify;
    }
}
