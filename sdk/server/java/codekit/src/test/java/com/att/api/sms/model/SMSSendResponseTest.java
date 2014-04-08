package com.att.api.sms.model;

import java.text.ParseException;

import org.json.JSONObject;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class SMSSendResponseTest {

    @Test
    public void constructor() {
        final String msgid = "1";
        final String url = "https://api.att.com";
        SMSSendResponse response = new SMSSendResponse(msgid, url);

        assertEquals(response.getMessageId(), msgid);
        assertEquals(response.getResourceUrl(), url);
    }

    @Test
    public void valueOf() throws ParseException {
        final String jstr = new StringBuilder()
            .append("{")
            .append("    \"outboundSMSResponse\": {")
            .append("        \"messageId\":\"1\",")
            .append("            \"resourceReference\": {")
            .append("                \"resourceURL\":\"https://api.att.com\"")
            .append("            }")
            .append("    }")
            .append("}  ")
            .toString();

        JSONObject jobj = new JSONObject(jstr);

        SMSSendResponse response = SMSSendResponse.valueOf(jobj);

        assertEquals(response.getMessageId(), "1");
        assertEquals(response.getResourceUrl(), "https://api.att.com");
    }

}
