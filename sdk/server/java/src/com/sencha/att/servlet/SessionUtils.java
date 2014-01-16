package com.sencha.att.servlet;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

/**
 * @class com.sencha.att.servlet.SessionUtils
 *
 */
public class SessionUtils {

	private static final String TOKEN_MAP_KEY = "TOKEN_MAP";

	@SuppressWarnings("unchecked")
	private static Map<String, String> getTokenMapFromSession(HttpSession session){
		Map<String, String> map = (Map<String, String>) session.getAttribute(TOKEN_MAP_KEY);

		if(map == null){
			map = new HashMap<String, String>();
			session.setAttribute(TOKEN_MAP_KEY, map);
		}
		
		return map;
	}
	
	/**
	 * Stores the given token for the given scopes in session.
	 * @param session {HttpSession} the current Session.
	 * @param oneOrMoreScopes {String} the scope. You can pass more than one scope as an string separately by commas. ie. "TL, DC"
	 * @param token {String} the token. If more that one scope is given, it will be store for all of them.
	 */
	public static void setTokenForScope(HttpSession session, String oneOrMoreScopes, String token){
		Map<String, String> tokenMap = getTokenMapFromSession(session);
		String[] scopes = oneOrMoreScopes.split(",");

		for (String scope : scopes) {
			tokenMap.put(scope.trim(), token);
		}
		
		session.setAttribute(TOKEN_MAP_KEY, tokenMap);
	}
	
	
	/**
	 * Return the associated token for the given scope.
	 * @param session {HttpSession} the current Session.
	 * @param scope {String} the scope we are retrieving the token for.
	 * @return {String} the token or null if there is no token stored for the given scope.
	 */
	public static String getTokenForScope(HttpSession session, String scope){
		return getTokenMapFromSession(session).get(scope);
	}

	/**
	 * Checks if for all the given scopes there is a token.
	 * @param session {HttpSession} the current Session.
	 * @param oneOrMoreScopes {String} the scope. You can pass more than one scope as an string separately by commas. ie. "TL, DC"
	 * @return {boolean} true if all the given scopes have a token.
	 */
	public static boolean hasTokenForAllScopes(HttpSession session, String oneOrMoreScopes){
		String[] scopes = oneOrMoreScopes.split(",");
		boolean hasToken = false;
		
		for (String scope : scopes) {
			hasToken = hasTokenForScope(session, scope.trim());
			if(!hasToken){
				return false;
			}
		}
		return hasToken;
	}
	
	/**
	 * Checks if there is a token stored for a given scope.
	 * @param session {HttpSession} the current Session.
	 * @param scope {String} the scope we are checking the token for.
	 * @return {boolean} true if there is a token for the given scope.
	 */
	public static boolean hasTokenForScope(HttpSession session, String scope){
		Map<String, String> tokenMap = getTokenMapFromSession(session);
		
		return tokenMap.containsKey(scope);
	}

}
