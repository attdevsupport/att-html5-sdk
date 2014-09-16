package com.html5sdk.att.servlet;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.http.HttpSession;

import com.att.api.oauth.OAuthService;
import com.att.api.oauth.OAuthToken;
import com.html5sdk.att.AttConstants;

/**
 * @class com.html5sdk.att.servlet.SessionUtils
 * 
 */
public class SessionUtils
{
    private static Logger log = Logger
            .getLogger(AttConstants.SERVICEPROVIDERLOGGER);
    
    @SuppressWarnings("unchecked")
    private static Map<String, OAuthToken> getTokenMapFromSession(
            HttpSession session)
    {
        Map<String, OAuthToken> map = (Map<String, OAuthToken>) session
                .getAttribute(AttConstants.TOKEN_MAP_KEY);

        if (map == null) {
            map = new HashMap<String, OAuthToken>();
            session.setAttribute(AttConstants.TOKEN_MAP_KEY, map);
        }

        return map;
    }

    /**
     * Stores the given token for the given scopes in session.
     * 
     * @param session
     *            {HttpSession} the current Session.
     * @param oneOrMoreScopes
     *            {String} the scope. You can pass more than one scope as an
     *            string separately by commas. ie. "MIM, DC"
     * @param token
     *            {String} the token. If more that one scope is given, it will
     *            be store for all of them.
     */
    public static void setTokenForScope(HttpSession session,
            String oneOrMoreScopes, OAuthToken token)
    {
        Map<String, OAuthToken> tokenMap = getTokenMapFromSession(session);
        String[] scopes = oneOrMoreScopes.split(",");

        for (String scope : scopes) {
            tokenMap.put(scope.trim(), token);
        }

        session.setAttribute(AttConstants.TOKEN_MAP_KEY, tokenMap);
    }

    /**
     * Return the associated token for the given scope.
     * 
     * @param session
     *            {HttpSession} the current Session.
     * @param scope
     *            {String} the scope we are retrieving the token for.
     * @return {String} the token or null if there is no token stored for the
     *         given scope.
     */
    public static OAuthToken getTokenForScope(HttpSession session, String scope) {
    	Map<String, OAuthToken> map = getTokenMapFromSession(session);
    	OAuthToken currentToken = map.get(scope);
    	
    	if(currentToken!=null && currentToken.isAccessTokenExpired())
    	{
    	   log.info("SessionUtils: Session " + session.getId() + " has expired token " + currentToken.getAccessToken());
    	   
           OAuthService authService = new OAuthService(
	           AttConstants.HOST,
	           AttConstants.CLIENTIDSTRING,
	           AttConstants.CLIENTSECRETSTRING,
	           AttConstants.TOKEN_EXPIRES_SECONDS);
           
           try {
           	  OAuthToken newToken = authService.refreshToken(currentToken.getRefreshToken());
              
           	  if(newToken != null) {
           		  log.info("SessionUtils: Session " + session.getId() + " got new token " + currentToken.getAccessToken());
           		  
	           	  // Replace all tokens matching the old one, with this new one
	           	  String scopeSet = scopesForToken(session, currentToken.getAccessToken());
	           	  setTokenForScope(session, scopeSet, newToken);
           	  } else {
           		  log.info("SessionUtils: Session " + session.getId() + " failed to refresh token. Removing token from session.");
           		  // Clear token map for all scopes with the matching token
            	  session.removeAttribute(AttConstants.TOKEN_MAP_KEY);           		  
           	  }
              currentToken = newToken;
           } catch (Exception refreshEx) {
        	   log.info("SessionUtils: Session " + session.getId() + " " + refreshEx.getMessage() + " Failed to refresh token. Removing token from session. ");
        	   // Clear token map for all scopes with the matching token
        	  session.removeAttribute(AttConstants.TOKEN_MAP_KEY);
        	  currentToken = null;
           }
    	}
    	
        return currentToken;
    }

    /**
     * Checks if for all the given scopes there is a token.
     * 
     * @param session
     *            {HttpSession} the current Session.
     * @param oneOrMoreScopes
     *            {String} the scope. You can pass more than one scope as an
     *            string separately by commas. ie. "MIM, DC"
     * @return {boolean} true if all the given scopes have a token.
     */
    public static boolean hasTokenForAllScopes(HttpSession session,
            String oneOrMoreScopes) {
        String[] scopes = oneOrMoreScopes.split(",");
        boolean hasToken = false;

        for (String scope : scopes) {
            hasToken = hasTokenForScope(session, scope.trim());
            if (!hasToken) {
                return false;
            }
        }
        return hasToken;
    }

    /**
     * Checks if there is a token stored for a given scope.
     * 
     * @param session
     *            {HttpSession} the current Session.
     * @param scope
     *            {String} the scope we are checking the token for.
     * @return {boolean} true if there is a token for the given scope.
     */
    public static boolean hasTokenForScope(HttpSession session, String scope) {
        Map<String, OAuthToken> tokenMap = getTokenMapFromSession(session);

        return tokenMap.containsKey(scope);
    }

    /**
     * Returns all scopes with the given token
     * 
     * @param session
     *            {HttpSession} the current Session.
     * @param token
     *            {String} the token we are matching
     * @return {String} The comma separated list of scopes or null
     */
    public static String scopesForToken(HttpSession session, String token) {
        Map<String, OAuthToken> tokenMap = getTokenMapFromSession(session);
        String scopes = null;
        
        for(String scope : tokenMap.keySet()) {
        	if(tokenMap.get(scope).getAccessToken().equals(token)) {
        		if(scopes == null) {
        			scopes = scope;
        		} else {
        			scopes += "," + scope;
        		}
        	}
        }
        return scopes;
    }
}
