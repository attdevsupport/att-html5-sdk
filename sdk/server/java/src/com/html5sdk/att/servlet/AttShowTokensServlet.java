package com.html5sdk.att.servlet;

import com.att.api.oauth.OAuthToken;
import com.html5sdk.att.AttConstants;
import com.html5sdk.att.provider.ApiRequestException;
import com.html5sdk.att.provider.ClientCredentialsManager;
import com.html5sdk.att.servlet.ServiceServletBase;
import com.html5sdk.att.servlet.SessionUtils;
import com.html5sdk.att.servlet.SharedCredentials;
import com.html5sdk.att.util.TokenUtil;
import java.io.IOException;
import java.io.PrintStream;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class AttShowTokensServlet
extends ServiceServletBase {
    private static final long serialVersionUID = 1;

    public void init() throws ServletException {
        //no-op
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String revoke;
        String blurredClientOAuthToken;
        OAuthToken token = null;
        try {
            String cleartextToken = this.credentialsManager.fetchOAuthToken().getAccessToken();
            blurredClientOAuthToken = TokenUtil.convertTokenToPartialTokenByReplacingTrailingCharacters(cleartextToken);
        }
        catch (ApiRequestException are) {
            blurredClientOAuthToken = "internal error: " + are.getMessage();
        }
        if (AttConstants.ENABLE_UNSAFE_OPERATIONS && (revoke = request.getParameter("revokeClientTokens")) != null) {
            SharedCredentials.getInstance().revokeAllTokens();
            blurredClientOAuthToken = "revoked";
        }
        response.setContentType("text/html");
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
        PrintWriter out = response.getWriter();
        try {
            String[] scopes = new String[]{"IMMN", "MIM"};
            HttpSession session = request.getSession();
            String info = "";
            out.println("<html><head><title>Tokens</title></head><body>");
            try {
                if (!AttConstants.ENABLE_UNSAFE_OPERATIONS) {
                    out.println("clientToken: " + blurredClientOAuthToken + "<br>");
                } else {
                    out.println("clientToken: <button type=\"button\" onclick=\"window.location.href='./showTokens?revokeClientTokens=true'\">Revoke All</button> " + blurredClientOAuthToken);
                }
            }
            catch (Exception fetchEx) {
                out.println("clientToken: failed revoke<br>");
            }
            for (int iScope = 0; iScope < scopes.length; ++iScope) {
                token = SessionUtils.getTokenForScope(session, scopes[iScope]);
                if (token == null) continue;
                if (info.length() > 0) {
                    info = info + ",<br> ";
                }
                info = info + scopes[iScope] + ": " + TokenUtil.convertTokenToPartialTokenByReplacingTrailingCharacters(token.getAccessToken());
            }
            out.println(info);
            out.println("</body></html>");
            out.flush();
            out.close();
        }
        catch (Exception se) {
            try {
                out.println("error: " + se.getMessage());
                out.flush();
                out.close();
            }
            catch (Exception e) {
                this.log(se.getMessage());
                e.printStackTrace();
            }
        }
    }
}

