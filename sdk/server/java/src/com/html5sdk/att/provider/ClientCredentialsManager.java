package com.html5sdk.att.provider;

import java.util.TimerTask;
import java.util.logging.Logger;

import com.att.api.oauth.OAuthService;
import com.att.api.oauth.OAuthToken;
import com.att.api.rest.RESTException;
import com.html5sdk.att.AttConstants;

/**
 * 
 * ClientCredentialsManager provides a valid OAuth token for use on API
 * services. Once ClientCredentialsManager is created, it will fetch an OAuth 
 * token using the supplied credentials and scope. On a timer, it will fetch a
 * new auth_token before the token expires, so that the server will always 
 * have a valid token.
 * 
 * @class com.html5sdk.att.provider.ClientCredentialsManager
 */
public class ClientCredentialsManager
{
    private static Logger log = Logger
            .getLogger(AttConstants.SERVICEPROVIDERLOGGER);

    private final String host;
    private final String apiKey;
    private final String scope;
    private final String apiSecret;
    private OAuthToken currentOAuthToken;
    private final long expiresInOverride;
    
    private static OAuthService openAuthService;

    /**
     * This creates a ClientCredentialsManager for an application. Depending on
     * your application you may want more than one of these, if you have more
     * than one application registered with ATT.
     * 
     * @param host
     *            where to make the call
     * @param apiKey
     *            your app key
     * @param apiSecret
     *            your app secret
     * @param scope
     *            scopes to authorize for
     * @param long expiresInOverride
     *            how long the token stays valid for - overrides the service if > 0
     *
     * @constructor ClientCredentialsManager
     */
    public ClientCredentialsManager(String host, String apiKey,
            String apiSecret, String scope, long expiresInOverride) {
        this.host = host;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.scope = scope;
        this.expiresInOverride = expiresInOverride;
        
        if(openAuthService == null) {
        	openAuthService = new OAuthService(this.host,            		
                    this.apiKey, this.apiSecret, this.expiresInOverride); 
        }
    	try {
    		fetchOAuthToken();
    	} catch (ApiRequestException fex) {
    		log.info("CCM fetch failed: " + fex.toString());
    	} catch (Exception fex) {
    		log.info("CCM fetch failed: " + fex.toString());
    	}        	
    }

    /**
     * Attempts to get an authToken from ATT. It will block execution until the
     * API request completes.
     * 
     * @return OAuthToken
     * @throws ApiRequestException
     * @method fetchOAuthToken
     */
    public OAuthToken fetchOAuthToken() throws ApiRequestException {
        if (this.currentOAuthToken != null)
        {
        	if(!this.currentOAuthToken.isAccessTokenExpired()) {
               return this.currentOAuthToken;
        	} else {
        		try {
        			log.info("ClientCredentialsManager.fetchOAuthToken: Refreshing token...");
	                this.currentOAuthToken = openAuthService.refreshToken(currentOAuthToken.getRefreshToken());
	                log.info("ClientCredentialManager.fetchOAuthToken: Refresh success: " + currentOAuthToken.toString());
	                return this.currentOAuthToken;
        		} catch(RESTException refreshEx) {
        	        try {
        	        	log.info("ClientCredentialManager.fetchOAuthToken failed. " + refreshEx.toString());
        	            log.info("ClientCredentialsManager.fetchOAuthToken: Fetching new token...");
        	
        	            this.currentOAuthToken = openAuthService.getToken(this.scope);
        	
        	            log.info("ClientCredentialsManager.fetchOAuthToken successful: " +
        	                currentOAuthToken.toString());
        	            return this.currentOAuthToken;
        	        } catch (RESTException ex) {
        	        	log.info("ClientCredentialsManager.fetchOAuthToken failed. " + ex.toString());
        	            throw new ApiRequestException("could not get oauth token", 403,
        	                    "{\"error\":\"could not get oauth token\"}", ex);
        	        }
        		}
        	}
        } else {
	        try {
	            log.info("ClientCredentialsManager.fetchOAuthToken: Fetching new token from " + this.host + " for client " + this.apiKey);
	
	            this.currentOAuthToken = openAuthService.getToken(this.scope);
	
	            log.info("ClientCredentialsManager.fetchOAuthToken successful: " +
	            		currentOAuthToken.toString());
	            return this.currentOAuthToken;
	        } catch (RESTException ex) {
	        	log.info("ClientCredentialsManager.fetchOAuthToken failed. " + ex.toString());
	            throw new ApiRequestException("could not get oauth token", 403,
	                    "{\"error\":\"could not get oauth token\"}", ex);
	        }
        }
    }

    /*
     * An inner class that executes fetchToken() in a different thread and will
     * update the shared auth token when it completes.
     */
    class FetchToken extends TimerTask {

        @Override
        public void run() {
            try {
                fetchOAuthToken();
            } catch (Exception e) {
                log.severe("Could not fetch auth token" + e.getMessage());
                e.printStackTrace();
            }

        }
    }

    /**
     * Returns the current valid Client Credentials token. If a valid token is
     * not present, then null will be returned. Callers should check for null
     * before proceeding. Fetch errors are logged and should be monitored for
     * system failure.
     * 
     * @method getCurrentToken
     */
    public String getCurrentToken() {
        try {
        	currentOAuthToken = fetchOAuthToken();
        } catch (Exception e) {
            log.severe("Could not fetch auth token" + e.getMessage());
            e.printStackTrace();
        }
        return currentOAuthToken.getAccessToken();
    }
    
    /**
     * Revokes the refresh and access tokens
     * 
     * @method revokeAllTokens
     */
    public void revokeAllTokens() {
        try {
        	openAuthService.revokeToken(this.currentOAuthToken.getRefreshToken(), "refresh_token");
        	log.info("client tokens revoked");
        } catch (Exception e) {
            log.severe("Could not revoke auth token" + e.getMessage());
            e.printStackTrace();
        }
    	this.currentOAuthToken = null;
    }
}