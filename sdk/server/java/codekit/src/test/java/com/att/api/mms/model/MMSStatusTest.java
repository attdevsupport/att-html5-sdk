package com.att.api.mms.model;

import java.text.ParseException;

import org.json.JSONObject;
import org.junit.Test;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertEquals;

public class MMSStatusTest {
    @Test
    public void constructor() {
        MMSStatus status = new MMSStatus("http://api.att.com", null);

        assertTrue(status.getInfoList() == null);
        assertEquals(status.getResourceUrl(), "http://api.att.com");
    }

    @Test
    public void valueOf() throws ParseException {

        final String jstr = new StringBuilder()
            .append("{ ")
            .append("    \"DeliveryInfoList\": { ")
            .append("        \"DeliveryInfo\": [ {  ")
            .append("            \"Id\" : \"msg0\", ")
            .append("                \"Address\" : \"tel:5555555555\", ")
            .append("                \"DeliveryStatus\" : \"DeliveredToTerminal\" } ] , ")
            .append("            \"ResourceUrl\": \"https://api.att.com\" ")
            .append("    } ")
            .append("}")
            .toString();


        final JSONObject jobj = new JSONObject(jstr);

        MMSStatus status = MMSStatus.valueOf(jobj);
        assertEquals(status.getResourceUrl(), "https://api.att.com");
        assertTrue(status.getInfoList().length == 1);

        assertEquals(status.getInfoList()[0].getAddress(), "tel:5555555555");
    }
}
