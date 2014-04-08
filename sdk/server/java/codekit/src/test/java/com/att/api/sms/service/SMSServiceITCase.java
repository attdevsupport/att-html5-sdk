package com.att.api.sms.service;

import org.junit.Test;

import com.att.api.oauth.OAuthToken;
import com.att.api.rest.RESTConfig;
import com.att.api.rest.RESTException;
import com.att.api.sms.model.SMSGetResponse;
import com.att.api.sms.model.SMSSendResponse;
import com.att.api.sms.model.SMSStatus;

import static org.junit.Assert.assertTrue;

public class SMSServiceITCase {

    // set these settings to use this integration test
    // TODO: move to config file
    private final String fqdn = "https://api.att.com";
    private final String accessToken = "";
    private final String number = "";
    private final String registrationId = "";

    @Test
    public void send() throws RESTException {
        RESTConfig.setDefaultProxy("proxy.entp.attws.com", 8080);

        if (accessToken == null || accessToken.equals("")) {
            final String msg = "SMS integration test settings not set; skipping.";
            System.out.println(msg);
            return; 
        }

        final long noExpiry = OAuthToken.NO_EXPIRATION;
        OAuthToken token = new OAuthToken(accessToken, noExpiry, "");

        SMSService srvc = new SMSService(fqdn, token);
        SMSSendResponse sendR = srvc.sendSMS(number, "test", false);

        assertTrue(sendR.getMessageId() != null);

        SMSStatus status = srvc.getSMSDeliveryStatus(sendR.getMessageId());
        assertTrue(status.getResourceUrl() != null);

        SMSGetResponse getR = srvc.getSMS(registrationId);
        assertTrue(getR.getNumberOfMessages() != null);
    }
}
