package com.html5sdk.att.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.att.api.oauth.OAuthToken;
import com.html5sdk.att.AttConstants;

/**
 * 
 * Return the token for this session
 * 
 * @class com.html5sdk.att.servlet.AttShowTokensServlet
 */
public class AttShowTokensServlet extends ServiceServletBase {
    private static final long serialVersionUID = 1L;

    /*
     * @see HttpServlet#HttpServlet()
     */
    public AttShowTokensServlet() {
        super();
    }

    /**
     * Calls doPost
     * 
     * @method doGet
     */
    @Override
    protected void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }

    /**
     * @method doPost
     */

    @Override
    protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        response.setContentType("text/html");

        // make sure this page never gets cached
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");

        PrintWriter out = response.getWriter();
        
        try {
        	String scopes[] = new String[3];
        	scopes[0] = "IMMN"; scopes[1] = "MIM"; scopes[2]="DC";
        	int iScope;
            HttpSession session = request.getSession();
        	OAuthToken token = null;
        	String info = null; 



            out.println("<html><head><title>Tokens</title></head><body>");
        	
            try {
               out.println("clientToken: " + this.credentialsManager.fetchOAuthToken().toBluredString() + "<br>");
            } catch (Exception fetchEx) {
               out.println("clientToken: " + "failed<br>");
            }
        	
        	for(iScope=0; iScope<scopes.length; iScope++) {
        		token = SessionUtils.getTokenForScope(session, scopes[iScope]);
        		if(token!=null) {
        			if(info!=null) {
        				info += ",<br> " + scopes[iScope] + ": " + token.toBluredString();
        			} else {
        				info = scopes[iScope] + ": " + token.toBluredString();
        			}
        		}
        	}
            
            out.println(info);
            
            out.println("</body></html>");  
            out.flush();
            out.close();
        } catch (Exception se) {
            try {
                out.println(AttConstants.ERROR + ": " + se.getMessage());
                out.flush();
                out.close();

            } catch (Exception e) {
                log(se.getMessage());
                e.printStackTrace();
            }
        }
    }
}
