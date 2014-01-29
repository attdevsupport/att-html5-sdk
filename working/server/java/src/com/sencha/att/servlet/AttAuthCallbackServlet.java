package com.sencha.att.servlet;

import java.io.IOException;
import java.io.Writer;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONException;
import org.json.JSONObject;

import com.sencha.att.AttConstants;
import com.sencha.att.provider.ApiRequestException;
import com.sencha.att.provider.ServiceProviderConstants;
import com.sencha.att.provider.ServiceProviderOauth;

/**
 *
 * Once the user has logged-in with their credentials, they get re-directed to
 * this URL with a 'code' parameter. This is exchanged for an access token which
 * can be used in any future calls to the AT&T APIs
 *
 * @class com.sencha.att.servlet.AttAuthCallbackServlet
 */
public class AttAuthCallbackServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static Logger log = Logger.getLogger(ServiceProviderConstants.SERVICEPROVIDERLOGGER);

	private int refreshTokenExpireMilis;


	/*
	 * @see HttpServlet#HttpServlet()
	 */
	public AttAuthCallbackServlet() {
		super();

		this.refreshTokenExpireMilis = (AttConstants.REFRESH_TOKEN_EXPIRE_HOURS*60*60*1000);

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
		String accessToken = null;
		String refreshToken = null;
		JSONObject results = new JSONObject();
		JSONObject json;
		
		response.setContentType("text/html");

		String code = request.getParameter(AttConstants.CODE);
		String scope = request.getParameter(AttConstants.SCOPES);
		

		log.info("Auth Callback " +code);
		log.info("Scopes " +scope);


		Writer out = response.getWriter();

		try{

			HttpSession session = request.getSession();

			if(code != null) {
				ServiceProviderOauth provider = new ServiceProviderOauth(AttConstants.HOST, getClientID(), getClientSecret(), getHost(request));
				
				try {

					json = provider.getToken(code);
					accessToken = json.optString(ServiceProviderConstants.ACCESS_TOKEN);
					refreshToken = json.optString(ServiceProviderConstants.REFRESH_TOKEN);
					
				} catch (ApiRequestException e1) {
					results.put("success", false);
					results.put("msg", e1.toJson());
				}


				if(accessToken != null  && accessToken.length() > 0) {

					Long expires = System.currentTimeMillis() + (AttConstants.TOKEN_EXPIRES_SECONDS * 1000);
					session.setAttribute(ServiceProviderConstants.TOKEN_EXPIRES,expires);

					log.info("Putting token in session " + accessToken);
					SessionUtils.setTokenForScope(session, scope, accessToken);
					
					results.put("success", true);
					results.put("msg", "Process Callback");
				} else {
					results.put("success", false);
					results.put("msg", "No auth code");
				}

				String currentRefreshToken = (String) session.getAttribute(ServiceProviderConstants.REFRESH_TOKEN);
				Long refreshTokenExpiresTime = (Long) session.getAttribute(ServiceProviderConstants.REFRESH_TOKEN_EXPIRY_TIME);


				log.info("Current refresh token " + currentRefreshToken + " new refresh token " + refreshToken);

				if(refreshToken != null) {
					if(refreshToken.equals(currentRefreshToken)) {
						log.info("Refresh token unmodified, using existing expiry time of " + refreshTokenExpiresTime);
					} else {
						refreshTokenExpiresTime = System.currentTimeMillis() + this.refreshTokenExpireMilis;
						session.setAttribute(ServiceProviderConstants.REFRESH_TOKEN, refreshToken);
						session.setAttribute(ServiceProviderConstants.REFRESH_TOKEN_EXPIRY_TIME, refreshTokenExpiresTime);
					}
				}

			} else {
				//Check for errors
				results.put("success", false);
				results.put("error",request.getParameter("error"));
				results.put("error_reason",request.getParameter("error_reason"));
				results.put("error_description",request.getParameter("error_description"));
			}

			out.write(AttConstants.REDIRECT_HTML_PRE);


			results.write(out);

		}catch(JSONException je){
			je.printStackTrace();
		}

		out.write(AttConstants.REDIRECT_HTML_POST);
		out.flush();
		out.close();

	}

	private String getClientID() {
		return AttConstants.CLIENTIDSTRING;
	}

	private String getClientSecret() {
		return AttConstants.CLIENTSECRETSTRING;
	}

	private String getHost(HttpServletRequest request) {
		return "http://" + request.getServerName() + ":" + request.getServerPort();
	}
}
