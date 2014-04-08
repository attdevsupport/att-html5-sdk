package com.att.api.ads.service;

import java.text.ParseException;

import org.json.JSONObject;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ADSResponseTest {
    @Test
    public void valueOf() throws ParseException {

        final String jstr = new StringBuilder()
            .append("{")
            .append("    \"AdsResponse\": {")
            .append("        \"Ads\": {")
            .append("            \"Type\": \"thirdparty\",")
            .append("            \"ClickUrl\": \"http://att.com\",")
            .append("            \"TrackUrl\": \"http://att.com\",")
            .append("            \"Text\": \"\",")
            .append("            \"Content\":\"content\"")
            .append("        }")
            .append("    }")
            .append("}  ")
            .toString();

        final JSONObject jobj = new JSONObject(jstr);

        ADSResponse r = ADSResponse.valueOf(jobj);
        
        assertEquals(r.getType(), "thirdparty");
        assertEquals(r.getClickUrl(), "http://att.com");
        assertEquals(r.getTrackUrl(), "http://att.com");
        assertEquals(r.getContent(), "content");
    }
}
