package com.sencha.att.servlet;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONException;
import org.json.JSONObject;

import com.sencha.att.AttConstants;

/**
 *
 * Return a JSON Object with either 'true' or 'false' depending on whether an
 * access_token has been set. This servlet will check the servelt session for the presence of an auth token
 * This indicates whether the user is logged in and can make api calls to the ATT API.
 *
 * @class com.sencha.att.servlet.AttAuthCheckServlet
 */
public class AttAuthCheckServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/*
	 * @see HttpServlet#HttpServlet()
	 */
	public AttAuthCheckServlet() {
		super();
	}

	/**
	 * Calls doPost
	 * @method doGet
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @method doPost
	 */

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			JSONObject object = new JSONObject();
			HttpSession session = request.getSession();

			String scope = request.getParameter("scope");

			object.put("authorized", SessionUtils.hasTokenForAllScopes(session, scope));

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

//	private boolean isTokenValidForScopes(String scope, HttpSession session) {
//		String token = SessionUtils.getTokenFromSession(session);
//		String tScope = SessionUtils.getTokenScopeFromSession(session);
//		
//		if(token != null && token.length() > 0 && tScope != null && tScope.length() > 0 && scope != null && scope.length() > 0){
//
//			return Arrays.asList(tScope.split(",")).containsAll(Arrays.asList(scope.split(",")));
//			
//		}
//		
//		return false;
//	}

}
