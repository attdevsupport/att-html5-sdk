package com.att.api.dc.service;

import org.junit.Test;

import com.att.api.dc.model.DCResponse;
import com.att.api.oauth.OAuthToken;
import com.att.api.rest.RESTConfig;
import com.att.api.rest.RESTException;

import static org.junit.Assert.assertTrue;

public class DCServiceITCase {

    @Test
    public void getDeviceCapabilities() throws RESTException {
        // set these settings to use this integration test
        // TODO: move to config file
        final String fqdn = "";
        final String accessToken = "";
        //RESTConfig.setDefaultProxy("proxy.host", 8080);

        if (fqdn == null || fqdn.equals("")) {
            final String msg = "DC integration test settings not set; skipping.";
            System.out.println(msg);
            return; 
        }

        final long noExpiry = OAuthToken.NO_EXPIRATION;
        OAuthToken token = new OAuthToken(accessToken, noExpiry, "");

        DCService srvc = new DCService(fqdn, token);
        DCResponse response = srvc.getDeviceCapabilities();

        assertTrue(response.getName() != null);
    }

}
