package com.html5sdk.att.util;

public class TokenUtil {
    public static String convertTokenToPartialTokenByReplacingTrailingCharacters(String token) {
        if ((token == null) || token.length() < 5) {
            return "****";
        }
        return token.substring(0, 3) + "************";
    }
}
