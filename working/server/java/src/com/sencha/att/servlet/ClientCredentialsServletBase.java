package com.sencha.att.servlet;

import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.net.URLDecoder;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.att.api.oauth.OAuthToken;
import com.sencha.att.provider.ApiRequestException;
import com.sencha.att.provider.ClientCredentialsManager;
import com.sencha.att.provider.TokenResponse;

/**
 * @class com.sencha.att.servlet.ClientCredentialsServletBase
 * 
 *        Provides common properties and methods for derived servlets that need
 *        to use client credential auth.
 */
abstract class ClientCredentialsServletBase extends HttpServlet {

    // first version of this servlet
    private static final long serialVersionUID = 1L;

    protected ClientCredentialsManager credentialsManager;
    protected OAuthToken clientToken;

    /*
     * @see HttpServlet#HttpServlet()
     */
    public ClientCredentialsServletBase() {
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

    /**
     * take care of a lot of error handling boilerplate for service calls that
     * return a JSON payload. Override 'execute' to implement service-specific
     * functionality, and return your JSON string from there.
     * 
     * @method executeWithJsonErrorHandling
     * @param request
     * @param response
     */
    protected void executeWithJsonErrorHandling(HttpServletRequest request,
            HttpServletResponse response) {
        try {
            String responseJson = execute(request);

            response.setContentType("application/json");
            Writer writer = response.getWriter();
            try {
                writer.write(responseJson);
            } finally {
                writer.close();
            }
        } catch (Exception se) {
            try {
                log(se.toString());
                se.printStackTrace();
                response.reset();
                if (se instanceof IllegalArgumentException) {
                    response.setStatus(400);
                } else {
                    response.setStatus(500);
                }
                response.setContentType("application/json");
                Writer writer = response.getWriter();
                try {
                    TokenResponse.getResponse(se).write(writer);
                } finally {
                    writer.close();
                }
            } catch (Exception e) {
                log(e.getMessage());
                e.printStackTrace();
            }
        }

    }

    protected String execute(HttpServletRequest request) throws Exception {
        throw new RuntimeException(
                "You must override the 'execute' method when using executeWithJsonErrorHandling");
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

    protected String getRequiredParameter(HttpServletRequest request,
            String name) throws RuntimeException {
        String value = request.getParameter(name);
        if (value == null) {
            throw new RuntimeException("'" + name
                    + "' querystring parameter required");
        }
        return value;
    }
}
