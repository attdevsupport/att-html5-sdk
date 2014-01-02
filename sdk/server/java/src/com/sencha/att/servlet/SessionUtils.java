package com.sencha.att.servlet;

import javax.servlet.http.HttpSession;

/**
 * @class com.sencha.att.servlet.SessionUtils
 *
 */
public class SessionUtils {


    /**
     * Retrieve the token from Session
     *
     * @param session
     * @return
     * @method getTokenFromSession
     * @static
     */
    public static String getTokenFromSession(HttpSession session) {
        String token = (String) session.getAttribute("token");
        return token;
    }
}
