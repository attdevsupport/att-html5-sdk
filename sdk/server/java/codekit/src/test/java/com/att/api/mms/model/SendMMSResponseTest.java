package com.att.api.mms.model;

import java.text.ParseException;

import org.json.JSONObject;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class SendMMSResponseTest {

    @Test
    public void constructor() {
        SendMMSResponse response = new SendMMSResponse("1", "http://att.com");

        assertEquals(response.getMessageId(), "1");
        assertEquals(response.getResourceUrl(), "http://att.com");

        response = new SendMMSResponse("1");
        assertEquals(response.getMessageId(), "1");
        assertEquals(response.getResourceUrl(), null);
    }

    @Test
    public void valueOf() throws ParseException {
        String jstr  = new StringBuilder()
            .append("{ ")
            .append("   \"outboundMessageResponse\": {")
            .append("       \"messageId\":\"msgid123\",")
            .append("       \"resourceReference\": {")
            .append("           \"resourceURL\":\"http://att.com\"")
            .append("       }")
            .append("   }")
            .append("}  ")
            .toString();

        JSONObject jobj = new JSONObject(jstr);

        SendMMSResponse response = SendMMSResponse.valueOf(jobj);
        assertEquals(response.getMessageId(), "msgid123");
        assertEquals(response.getResourceUrl(), "http://att.com");

    }
}
