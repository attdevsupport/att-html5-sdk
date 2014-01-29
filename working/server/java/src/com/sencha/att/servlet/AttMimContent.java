package com.sencha.att.servlet;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;

import com.sencha.att.AttConstants;
import com.sencha.att.provider.ApiRequestManager;
import com.sencha.att.provider.ServiceProviderMim;


/**
 * AttMimContent will perform a call to get Message Content on MIM API feature. It will retrieve the content as is, adding the 
 * token into the headers previously obtained on the call to Message Headers. 
 * @class com.sencha.att.servlet.AttMimContent
 */
public class AttMimContent extends HttpServlet {

	private static final long serialVersionUID = 1L;

	@Override
	/**
	 * @method doGet will proxy the call to MIM get message content AT&T API by getting the messageId and partNumber parameters 
	 * and adding the access token into the headers to provide authentication.  
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String token = SessionUtils.getTokenForScope(request.getSession(),  "MIM");
		String MIM_URN = ServiceProviderMim.MIM_URN;
		String host = AttConstants.HOST;
		String messageId = request.getParameter("messageId");
		String partNumber = request.getParameter("partNumber");
		HttpClient client = ApiRequestManager.getHTTPClient();
		String url = host + MIM_URN+ "/" + messageId + "/" + partNumber;
		HttpGet remoteRequest = new HttpGet(url);
		remoteRequest.setHeader("Authorization", "Bearer "+token);
		HttpResponse remoteResponse = client.execute(remoteRequest);
		HttpEntity remoteEntity = remoteResponse.getEntity();

		//status
		response.setStatus(remoteResponse.getStatusLine().getStatusCode());
		//headers
		Header[] headers = remoteResponse.getAllHeaders();
		for (Header header : headers) {
			response.setHeader(header.getName(), header.getValue());
		}
		//content
		BufferedInputStream bis = new BufferedInputStream(remoteEntity.getContent());
		OutputStream os = response.getOutputStream();
		int nb;
		while( (nb = bis.read()) != -1 ){
			os.write(nb);
		}
		os.flush();
		os.close();
	}
}
