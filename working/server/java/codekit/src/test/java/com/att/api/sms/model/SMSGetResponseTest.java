package com.att.api.sms.model;

import java.text.ParseException;

import org.json.JSONObject;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class SMSGetResponseTest {

    @Test
    public void constructor() {
        SMSGetResponse response = new SMSGetResponse(null, "1",
                "http://att.com", "1");

        assertTrue(response.getMessages() == null);
        assertEquals(response.getNumberOfMessages(), "1");
        assertEquals(response.getResourceUrl(), "http://att.com");
        assertEquals(response.getPendingMessages(), "1");
    }

    @Test
    public void valueOf() throws ParseException {

        final String jstr = new StringBuilder()
            .append("{ ")
            .append("    \"InboundSmsMessageList\": { ")
            .append("        \"InboundSmsMessage\": [ ")
            .append("        { ")
            .append("            \"MessageId\":\"msg0\", ")
            .append("                \"Message\":\"Hello\", ")
            .append("                \"SenderAddress\":\"tel:1234\" ")
            .append("        } ")
            .append("        ], ")
            .append("            \"NumberOfMessagesInThisBatch\":\"1\", ")
            .append("            \"ResourceUrl\":\"http://att.com\", ")
            .append("            \"TotalNumberOfPendingMessages\":\"0\" ")
            .append("    } ")
            .append("}  ")
            .toString();

        final JSONObject jobj = new JSONObject(jstr);

        SMSGetResponse response = SMSGetResponse.valueOf(jobj);
        
        assertEquals(response.getNumberOfMessages(), "1");
        assertEquals(response.getResourceUrl(), "http://att.com");
        assertEquals(response.getPendingMessages(), "0");
        assertEquals(response.getMessages().length, 1);

        SMSMessage msg = response.getMessages()[0];

        assertEquals(msg.getMessageId(), "msg0");
        assertEquals(msg.getMessage(), "Hello");
        assertEquals(msg.getSenderAddress(), "tel:1234");
    }

}
