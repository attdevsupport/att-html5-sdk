package com.att.api.mms.service;

import org.junit.Test;

import com.att.api.mms.model.MMSStatus;
import com.att.api.mms.model.SendMMSResponse;
import com.att.api.oauth.OAuthToken;
import com.att.api.rest.RESTConfig;
import com.att.api.rest.RESTException;

import static org.junit.Assert.assertTrue;

public class MMSServiceITCase {

    // set these settings to use this integration test
    // TODO: move to config file
    private final String fqdn = "https://api.att.com";
    private final String accessToken = "";
    private final String number = "";
    private final String filePath = "";

    @Test
    public void send() throws RESTException {
        RESTConfig.setDefaultProxy("proxy.entp.attws.com", 8080);

        if (accessToken == null || accessToken.equals("")) {
            final String msg = "MMS integration test settings not set; skipping.";
            System.out.println(msg);
            return; 
        }

        final long noExpiry = OAuthToken.NO_EXPIRATION;
        OAuthToken token = new OAuthToken(accessToken, noExpiry, "");

        MMSService srvc = new MMSService(fqdn, token);
        String[] fPaths = { filePath };
        SendMMSResponse resp = srvc.sendMMS(number, fPaths, null, null, false);
        assertTrue(resp.getMessageId() != null);

        String id = resp.getMessageId();
        final MMSStatus status = srvc.getMMSStatus(id);
        assertTrue(status.getResourceUrl() != null);
    }
}
