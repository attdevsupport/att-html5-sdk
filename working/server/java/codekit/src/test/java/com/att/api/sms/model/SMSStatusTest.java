package com.att.api.sms.model;

import java.text.ParseException;

import org.json.JSONObject;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class SMSStatusTest {

    @Test
    public void constructor() {
        final String resourceUrl = "http://www.att.com";

        SMSStatus status = new SMSStatus(resourceUrl, null);

        assertEquals(status.getResourceUrl(), "http://www.att.com");
        assertTrue(status.getInfoList() == null);
    }

    @Test
    public void valueOf() throws ParseException {
        
        final String jstr = new StringBuilder()
            .append("{ ")
            .append("    \"DeliveryInfoList\": { ")
            .append("        \"DeliveryInfo\": [ { ")
            .append("            \"Id\":\"msg0\", ")
            .append("            \"Address\":\"+1234\", ")
            .append("            \"DeliveryStatus\":\"DeliveredToTerminal\" ")
            .append("        } ], ")
            .append("            \"ResourceUrl\":\"https://www.att.com\" ")
            .append("    } ")
            .append("}  ")
            .toString();

        JSONObject jobj = new JSONObject(jstr);

        SMSStatus status = SMSStatus.valueOf(jobj);

        assertEquals(status.getResourceUrl(), "https://www.att.com");
        assertEquals(status.getInfoList().length, 1);

        SMSDeliveryInfo info = status.getInfoList()[0];

        assertEquals(info.getMessageId(), "msg0");
        assertEquals(info.getAddress(), "+1234");
        assertEquals(info.getDeliveryStatus(), "DeliveredToTerminal");
    }
}
