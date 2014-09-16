package com.html5sdk.att.servlet;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONException;
import org.json.JSONObject;

import com.att.api.oauth.OAuthToken;
import com.html5sdk.att.AttConstants;

/**
 * 
 * Return the token for this session
 * 
 * @class com.html5sdk.att.servlet.AttShowSessionTokenServlet
 */
public class AttShowSessionTokenServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /*
     * @see HttpServlet#HttpServlet()
     */
    public AttShowSessionTokenServlet() {
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

        response.setContentType("application/json");

        // make sure this page never gets cached
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
        
        try {
        	String scopes[] = new String[3];
        	scopes[0] = "IMMN"; scopes[1] = "MIM"; scopes[2]="DC";
        	int iScope;
            HttpSession session = request.getSession();
        	JSONObject object = new JSONObject();
        	OAuthToken token = null;
        	String info = null; 
        	
        	for(iScope=0; iScope<scopes.length; iScope++) {
        		token = SessionUtils.getTokenForScope(session, scopes[iScope]);
        		if(token!=null) {
        			if(info!=null) {
        				info += ", " + scopes[iScope] + ": " + token.toBluredString();
        			} else {
        				info = scopes[iScope] + ": " + token.toBluredString();
        			}
        		}
        	}

            object.put("tokens", info);
            
            Writer out = response.getWriter();
            object.write(out);
            out.flush();
            out.close();
        } catch (JSONException se) {
            try {
                Writer out = response.getWriter();
                JSONObject resp = new JSONObject();
                resp.put(AttConstants.ERROR, se.getMessage());
                resp.write(out);
                out.flush();
                out.close();

            } catch (Exception e) {
                log(se.getMessage());
                e.printStackTrace();
            }
        }
    }
}
