package com.att.api.mms.model;

import java.text.ParseException;

import org.json.JSONObject;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class MMSDeliveryInfoTest {

    @Test
    public void constructor() {
        MMSDeliveryInfo info = new MMSDeliveryInfo("1", "1", "failed");

        assertEquals(info.getMessageId(), "1");
        assertEquals(info.getAddress(), "1");
        assertEquals(info.getDeliveryStatus(), "failed");
    }

    @Test
    public void valueOf() throws ParseException {
        final String jstr = new StringBuilder()
            .append("{")
            .append("   \"Id\" : \"msg0\", ")
            .append("   \"Address\" : \"tel:555555555\", ")
            .append("   \"DeliveryStatus\" : \"DeliveredToTerminal\"")
            .append("}")
            .toString();

        MMSDeliveryInfo info = MMSDeliveryInfo.valueOf(new JSONObject(jstr));

        assertEquals(info.getMessageId(), "msg0");
        assertEquals(info.getAddress(), "tel:555555555");
        assertEquals(info.getDeliveryStatus(), "DeliveredToTerminal");
    }
}
