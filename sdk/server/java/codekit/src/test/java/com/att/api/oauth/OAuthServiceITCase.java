package com.att.api.oauth;

import org.junit.Test;

import com.att.api.rest.RESTException;

import static org.junit.Assert.assertTrue;

public class OAuthServiceITCase {

    @Test
    public void testGetToken() throws RESTException {
        // set these settings to use this integration test
        // TODO: move to config file
        final String fqdn = "";
        final String clientId = "";
        final String clientSecret = "";
        // RESTClient.setDefaultProxy("proxy.host", 8080);

        if (fqdn == null || fqdn.equals("")) {
            final String msg = "OAuth integration test settings not set; skipping.";
            System.out.println(msg);
            return; 
        }

        OAuthService osrvc = new OAuthService(fqdn, clientId, clientSecret);
        OAuthToken token = osrvc.getToken("SMS");

        assertTrue(token.getAccessToken() != null);
    }

}
