package com.sencha.att.provider;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Timer;
import java.util.TimerTask;
import java.util.logging.Logger;

import org.apache.http.client.methods.HttpPost;
import org.json.JSONObject;


/**
 *
 * ClientCredentialsManager provides a valid OAuth token for use on API services.
 * Currently, those APIs include SMS, MMS, WapPush, and Notary.
 * Once ClientCredentialsManager is created, it will fetch an OAuth token using the supplied credentials and scope.
 * On a timer, it will fetch a new auth_token before the token expires, so that the server will always have a valid token.
 *
 * @class com.sencha.att.provider.ClientCredentialsManager
 */
public class ClientCredentialsManager {

    private static Logger log = Logger.getLogger(ServiceProviderConstants.SERVICEPROVIDERLOGGER);


    private String host;
    private String apiKey;
    private String scope;
    private String apiSecret;
    private Timer timer;

    private String currentAuthToken;


    private String currentRefreshToken;


    private int refreshTokenExpireMilis = 0;


    /*
     * This is the epoch, in milliseconds, after which the refresh token will be invalid.
     */
    private long refreshTokenExpiresTime  = 0;

    /**
     * This creates a ClientCredentialsManager for an application.  Depending on your application you may want more than
     * one of these, if you have more than one application registered with ATT.
     *
     * ClientCredentialsManager can be configured to fetch new tokens automatically on a timer set by refreshSeconds.
     * If you set timedFetch to 'true', then it will fetch a new token every refreshSeconds.
     *
     * @param host where to make the call
     * @param apiKey your app key
     * @param apiSecret your app secret
     * @param scope scopes to authorize for
     * @param refreshTokenExpireHours how long the refresh token stays valid for
     * @param timedFetch 'true' the app calls the api every refreshSeconds, 'false' - fetchToken() must be called manually.
     *
     * @constructor ClientCredentialsManager
     */
    public ClientCredentialsManager(String host, String apiKey, String apiSecret, String scope, int refreshTokenExpireHours,  boolean timedFetch) {
        this.host = host;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.scope = scope;
        this.refreshTokenExpireMilis = (refreshTokenExpireHours*60*60*1000);

        if(timedFetch) {
            this.timer = new  Timer();
            this.timer.schedule(new FetchToken(), 0);
        }
    }


    /**
     * Attempts to get an authToken from ATT. It will block execution until the API request completes.
     * It will use the stored refresh token if it has not expired to fetch a new auth token.
     *
     * @return
     * @throws Exception
     * @method fetchToken
     */
    public String fetchToken() throws ApiRequestException {
        return fetchToken(false);
    }

    /**
     * Attempts to get an authToken from ATT. It will block execution until the API request completes.
     *
     * @param force boolean 'true' means a new auth token will be fetched even if there is a valid refresh token.
     *
     * @return
     * @throws Exception
     * @param {Boolean} force (optional)
     * @method fetchToken
     */
    public String fetchToken(boolean force) throws ApiRequestException {

        String url = host + "/oauth/token";
        String toPost = "client_id=" + apiKey + "&client_secret=" + apiSecret;

        if(!force && this.isRefreshTokenValid()) {
            toPost += "&grant_type=refresh_token&refresh_token=" + currentRefreshToken;
            log.info("Fetching new token using refresh token " + currentRefreshToken);
        } else {
            try {
                toPost += "&grant_type=client_credentials&scope=" + URLEncoder.encode(scope, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            log.info("Fetching new token using scope " + scope);
        }

        log.info("OAuth POST URL: "+url+ " Params: " + toPost);
        
        HttpPost post = new HttpPost(url);
        post.addHeader("Content-Type", "application/x-www-form-urlencoded");

        ApiResponse response = ApiRequestManager.post(toPost, post);


        JSONObject json = response.getResponse();

        log.info("ClientCredentialsManager: " + response);

        String accessToken = json.optString(ServiceProviderConstants.ACCESS_TOKEN);
        String refreshToken = json.optString(ServiceProviderConstants.REFRESH_TOKEN);

        if(accessToken != null  && accessToken.length() > 0) {
            currentAuthToken = accessToken;
            log.info("ClientCredentials access token updated " + currentAuthToken);
        } else {
            currentAuthToken = null;
            throw new ApiRequestException("API error received when fetching token ",  response.getStatusCode(), response.getRawBody());
        }

        log.info("Current refresh token " + currentRefreshToken + " new refresh token " + refreshToken);
        if(refreshToken != null) {
            if(refreshToken.equals(currentRefreshToken)) {
                log.info("Refresh token unmodified, using existing expiry time of " + refreshTokenExpiresTime);
            } else {
                refreshTokenExpiresTime = System.currentTimeMillis() + this.refreshTokenExpireMilis;
                currentRefreshToken  = refreshToken;
            }
        }
        return accessToken;
    }


    /**
     * @private
     * @return
     */
    private boolean isRefreshTokenValid() {
		return currentRefreshToken != null && (refreshTokenExpireMilis == 0  || System.currentTimeMillis() < refreshTokenExpiresTime);
	}



	/*
     * An inner class that executes fetchToken() in a different thread
     * and will update the shared auth token when it completes.
     */
    class FetchToken extends TimerTask {

        @Override
        public void run() {
            try {

                fetchToken(false);

            } catch (Exception e) {
                log.severe("Could not fetch auth token" +  e.getMessage());
                e.printStackTrace();
            }


        }
    }

    /**
     * Returns the current valid Client Credentials token.
     * If a valid token is not present, then null will be returned.
     * Callers should check for null before proceeding.
     * Fetch errors are logged and should be monitored for system failure.
     *
     * @method getCurrentToken
     */
    public String getCurrentToken() {
        return currentAuthToken;
    }

}
