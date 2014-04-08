/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 */

/*
 * ====================================================================
 * LICENSE: Licensed by AT&T under the 'Software Development Kit Tools
 * Agreement.' 2013.
 * TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTIONS:
 * http://developer.att.com/sdk_agreement/
 *
 * Copyright 2013 AT&T Intellectual Property. All rights reserved.
 * For more information contact developer.support@att.com
 * ====================================================================
 */

package com.att.api.sms.model;

import org.json.JSONObject;

/**
 * Immutable class that holds response after a Send SMS api request.
 *
 * @author pk9069
 * @version 1.0
 * @since 1.0
 */
public final class SMSSendResponse {

    private final String msgId;

    private final String resourceUrl;

    public SMSSendResponse(String msgId, String resourceUrl) {
        this.msgId = msgId;
        this.resourceUrl = resourceUrl;
    }

    /**
     * Gets message id.
     *
     * @return message id
     */
    public String getMessageId() {
        return msgId;
    }

    /**
     * Gets resource url.
     *
     * @return resource url
     */
    public String getResourceUrl() {
        return resourceUrl;
    }

    public static SMSSendResponse valueOf(JSONObject jobj) {
        JSONObject response = jobj.getJSONObject("outboundSMSResponse");
        final String msgId = response.getString("messageId");

        String resourceUrl = null;
        if (response.has("resourceReference")) {
            JSONObject ref = response.getJSONObject("resourceReference");
            if (ref.has("resourceURL")) {
                resourceUrl = ref.getString("resourceURL");
            }
        }

        return new SMSSendResponse(msgId, resourceUrl);
    }

}
