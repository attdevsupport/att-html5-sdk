package com.sencha.att.servlet;

import java.io.IOException;
import java.io.Writer;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.sencha.att.AttConstants;
import com.sencha.att.provider.ServiceProviderConstants;

/**
 *
 * Once the user has logged-in with their credentials, they are re-directed to
 * this URL with a 'code' parameter. This is exchanged for an access token, which
 * can be used in any future calls to the AT&T APIs
 *
 * @class com.sencha.att.servlet.PaymentCallbackServlet
 *
 */
public class PaymentCallbackServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private static Logger log = Logger.getLogger(ServiceProviderConstants.SERVICEPROVIDERLOGGER);


	/*
	 * @see HttpServlet#HttpServlet()
	 */
	public PaymentCallbackServlet() {
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


		response.setContentType("text/html");

		//Find the TransactionAuthCode or SubscriptionAuthCode on the query string.
		String transactionAuthCode = request.getParameter(AttConstants.TransactionAuthCode);

		if(transactionAuthCode == null ) {
			transactionAuthCode = request.getParameter(AttConstants.SubscriptionAuthCode);
		}



		log.info("Transaction Auth Code " + transactionAuthCode);

		JSONObject results = new JSONObject();
		try {
			if(transactionAuthCode != null) {

				results.put("success", true);
				results.put("TransactionAuthCode", transactionAuthCode);

			} else {
				//Check for errors
				//attempt to normalize error messsages...
				results.put("success", false);

				//If the payment fails to complete the app will have one set of query params
				if("false".equals(request.getParameter("success"))){
					results.put("error_reason",request.getParameter("faultCode"));
					results.put("error_description",request.getParameter("faultDescription"));
				} else {
					//If the user clicks cancel then we get a different set of errors.
					results.put("error",request.getParameter("error"));
					results.put("error_reason",request.getParameter("error_reason"));
					results.put("error_description",request.getParameter("error_description"));
				}
			}

			Writer out = response.getWriter();

			out.write(AttConstants.REDIRECT_HTML_PRE);

			results.write(out);

			out.write(AttConstants.REDIRECT_HTML_POST);
			out.flush();
			out.close();
		} catch (JSONException e) {
			e.printStackTrace();
		}

	}
}
