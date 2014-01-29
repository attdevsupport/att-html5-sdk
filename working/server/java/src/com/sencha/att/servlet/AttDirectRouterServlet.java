package com.sencha.att.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Writer;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.sencha.att.AttConstants;
import com.sencha.att.provider.ApiRequestException;
import com.sencha.att.provider.ClientCredentialsManager;
import com.sencha.att.provider.DirectServiceProvider;
import com.sencha.att.provider.ServiceProviderConstants;
import com.sencha.att.provider.TokenResponse;

/**
 * This method passes white listed methods through to the Provider instance.
 * @class com.sencha.att.servlet.AttDirectRouterServlet
 */
public class AttDirectRouterServlet extends HttpServlet {
  private static final long serialVersionUID = 1L;


  /**
   * These are the whitelist API methods
   * @property {String[]} whitelist
   */
  public static final String[] whiteList = {"oauthUrl"};


  /**
   * These are API methods which use the client credentials auth token.
   * @property {String[]} clientCredentialsMethods
   */
  public static final String[] clientCredentialsMethods = {"cmsCreateSession", "cmsSendSignal", "getAd", "sendSms", "smsStatus", "receiveSms", "sendMms", "mmsStatus", "wapPush", "requestChargeAuth", "subscriptionDetails", "subscriptionStatus", "refundTransaction", "transactionStatus", "signPayload", "speechToText"};
  
 /*
  * The servlets instance of the ClientCredentialsManager configured using ATTConstatnts.
  */
  private ClientCredentialsManager credentialsManager;

  
  private Map<String, String> authScopeMethods;
  
  /*
   * @see HttpServlet#HttpServlet()
   */
  public AttDirectRouterServlet() {
    super();
  }

  /**
   * @method init
   */
  public void init() throws ServletException {

    if(AttConstants.DEBUG){
      log("AT&T Provider initialized.");
      log("");
      log("API endpoint:  " + AttConstants.HOST);
      log("Client ID:     " + getClientID());
      log("Client Secret: " + getClientSecret());
    }

    this.credentialsManager  = SharedCredentials.getInstance();
    
    this.initAuthScopeMethods();
  }
  
  
  private void initAuthScopeMethods() {
	  authScopeMethods = new HashMap<String, String>();
	  authScopeMethods.put("deviceInfo", "DC");
	  authScopeMethods.put("deviceLocation", "TL");
	  authScopeMethods.put("sendMobo", "IMMN");
	  authScopeMethods.put("getMessageHeaders", "MIM");
  }
  
  /**
   * Calls doPost
   * @method doGet
   */
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    doPost(request, response);
  }

  /**
   * All HTTP methods are routed through doPost.
   *
   * RPC calls to API methods are validated against the authentication method required for that method.
   * A user's auth token is fetched from the session if it is required for the quest;
   * if the request is for an autonomous client method, then the credentialsManager is called to fetch that
   * auth token
   *
   * If a valid auth token is not found, then an API error is returned to the caller.
   * If the method is not a recognized method, then an API error is returned to the caller.
   *
   * @method doPost
   *
   */

  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    Writer out = response.getWriter();
    try {

      JSONObject requestJSON = getData(request);
      JSONObject responseJSON = new JSONObject();

      String action = requestJSON.getString(AttConstants.ACTION);
      String method = requestJSON.getString(AttConstants.METHOD);

      boolean authorized = false;

      requestJSON.put(ServiceProviderConstants.USER_AGENT, request.getHeader("User-Agent"));
      
      String token = null;


      if(inList(clientCredentialsMethods, method)) {
          token = this.credentialsManager.getCurrentToken();
          log("using clientCredentials token " + token);
      } else if(authScopeMethods.containsKey(method)){
          token = SessionUtils.getTokenForScope(request.getSession(), authScopeMethods.get(method));
      }

      log("Using access token  " + token + " method " + method);


      if (null != token && token.length() > 0) {
        authorized = true;
        requestJSON.put(ServiceProviderConstants.TOKEN, token);

      } else if (AttConstants.PROVIDER.equals(action) && inList(whiteList, method)) {
        authorized = true;
      } else {
        responseJSON.put(AttConstants.TYPE, AttConstants.EXCEPTION);
        responseJSON.put(ServiceProviderConstants.ERROR, "Unauthorized request");
      }

      if (authorized) {
        requestJSON.put(ServiceProviderConstants.HOST, AttConstants.HOST);
        requestJSON.put(ServiceProviderConstants.CLIENTID, getClientID());
        requestJSON.put(ServiceProviderConstants.CALLBACK, AttConstants.CALLBACK_SERVER);

        try {
          Method foundMethod = DirectServiceProvider.class.getMethod(method, JSONObject.class);
          responseJSON = (JSONObject) foundMethod.invoke(DirectServiceProvider.class, requestJSON);
          responseJSON.put(AttConstants.TYPE, AttConstants.RPC);

        } catch (NoSuchMethodException nsme) {
            responseJSON.put(AttConstants.TYPE, AttConstants.EXCEPTION);
            responseJSON.put(ServiceProviderConstants.ERROR, "Unrecognised method");
        }  catch (InvocationTargetException e) {
            Throwable exp = e.getCause();
            if(exp instanceof ApiRequestException) {
            	responseJSON = ((ApiRequestException) exp).toJson();
            	responseJSON.put(AttConstants.TYPE, AttConstants.EXCEPTION);
            } else {
                responseJSON.put(AttConstants.TYPE, AttConstants.EXCEPTION);
            	responseJSON.put(ServiceProviderConstants.ERROR, exp.getMessage());
            }
        }
        responseJSON.put(AttConstants.TID, requestJSON.get(AttConstants.TID));
        responseJSON.put(AttConstants.ACTION, action);
        responseJSON.put(AttConstants.METHOD, method);
      }
      log(responseJSON.toString());
      responseJSON.write(out);
    } catch (Exception se) {
      try {
        TokenResponse.getResponse(se).write(out);
      } catch (Exception e) {
        log(se.getMessage());
        e.printStackTrace();
      }
    } finally {
      out.flush();
      out.close();
    }
  }

  private String getClientID() {
    return AttConstants.CLIENTIDSTRING;
  }

  private String getClientSecret() {
    return AttConstants.CLIENTSECRETSTRING;
  }

  private boolean inList(String[] stringArray, String name) {
    List<String> list = Arrays.asList(stringArray);
    Set<String> set = new HashSet<String>(list);
    return set.contains(name);
  }

  private JSONObject getData(HttpServletRequest request) throws JSONException {
    StringBuffer jb = new StringBuffer();
    String line = null;
    try {
      BufferedReader reader = request.getReader();
      while ((line = reader.readLine()) != null)
        jb.append(line);
    } catch (Exception e) {
      return new JSONObject().put(AttConstants.ERROR, e.getMessage());
    }
    return new JSONObject(jb.toString());
  }

}
