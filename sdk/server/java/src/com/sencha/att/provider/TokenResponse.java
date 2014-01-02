package com.sencha.att.provider;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

/**
 *
 * An extension of JSONObject that provides methods for extracting the auth token from response.
 * @class com.sencha.att.provider.TokenResponse
 *
 */
public class TokenResponse extends JSONObject {
    /**
     * @property {String} TOKEN
     */
    public static final String TOKEN = "access_token";

    /**
     * @property {String} REFRESH_TOKEN
     */
    public static final String REFRESH_TOKEN = "refresh_token";

    /**
     * @property {String} TOKEN_EXPIRES
     */
    public static final String TOKEN_EXPIRES = "expires_in";

    /**
     * @property {String} REQUESTERROR1
     */
    public static final String REQUESTERROR1 = "requestError";

    /**
     * @property {String} REQUESTERROR2
     */
    public static final String REQUESTERROR2 = "requestError";

    /**
     * @property {String} TEXT
     */
    public static final String TEXT = "text";

    private TokenResponse() {
        super();
    }

    private TokenResponse(JSONTokener x) throws JSONException {
        super(x);
    }

    private TokenResponse(JSONObject x) throws JSONException {
        super(x);
    }

  /**
   *
   * @return true of the token is not set
   * @method hasError
   */
  public boolean hasError() {
    return optString(ServiceProviderConstants.ERROR).length() > 0;
  }

  /**
   * @return extracts the access_token from the token
   * @method getAccessToken
   */
  public String getAccessToken() {
    return optString(TOKEN);
  }


  /**
   * @return extracts the refresh token from the token
   * @method getRefreshToken
   */
  public String getRefreshToken() {
    return optString(REFRESH_TOKEN);
  }



  /**
   * @return extracts the token expiry from the token
   * @method getTokenExpires
   */
  public String getTokenExpires() {
    return optString(TOKEN_EXPIRES);
  }


  /**
   * @method getResponse
   */
  public static TokenResponse getResponse(Exception e) {
    return getResponse(e.getMessage());
  }

  /**
   * @method getResponse
   */
  public static TokenResponse getResponse(String errorMessage) {
    TokenResponse theReturn = new TokenResponse();
    try {
      theReturn.put(ServiceProviderConstants.ERROR, errorMessage);
    } catch (JSONException e) {
    }
    return theReturn;
  }

  /**
   * @method getResponse
   */
  public static TokenResponse getResponse(JSONTokener x) {
    TokenResponse theReturn = null;
    try {
      theReturn = processError(new TokenResponse(x));
    } catch (JSONException e) {
      theReturn = getResponse(x.toString());
    } catch (Exception e) {
      theReturn = getResponse(e.getMessage());
    }
    return theReturn;
  }

  /**
   * @method getResponse
   */
  public static TokenResponse getResponse(JSONObject x) {
    TokenResponse theReturn = null;
    try {
      theReturn = processError(new TokenResponse(x));
    } catch (JSONException e) {
      theReturn = getResponse(x.toString());
    } catch (Exception e) {
      theReturn = getResponse(e.getMessage());
    }
    return theReturn;
  }

  /**
   * @method processError
   */
  private static TokenResponse processError(TokenResponse token) {
    TokenResponse theReturn = token;
    JSONObject error = token.optJSONObject(REQUESTERROR1);
    if (error != null) {
        theReturn = new TokenResponse();
        try {
            theReturn.put(ServiceProviderConstants.APIERROR, token);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    return theReturn;
  }


}
