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

package com.att.api.mms.model;

import org.json.JSONObject;

/**
 * Immutable class for holding a Send MMS response.
 *
 * @author pk9069
 * @version 1.0
 * @since 1.0
 */
public final class SendMMSResponse {

    /** Message id. */
    private final String msgId;

    /** Resource url. */
    private final String resourceUrl;

    public SendMMSResponse(String msgId) {
        this(msgId, null);
    }

    public SendMMSResponse(String msgId, String resourceUrl) {
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

    // factory method
    public static SendMMSResponse valueOf(JSONObject jobj) {
        JSONObject response = jobj.getJSONObject("outboundMessageResponse");

        final String msgId = response.getString("messageId");

        String resourceUrl = null;
        if (response.has("resourceReference")) {
            JSONObject ref = response.getJSONObject("resourceReference");
            if (ref.has("resourceURL")) {
                resourceUrl = ref.getString("resourceURL");
            }
        }

        return new SendMMSResponse(msgId, resourceUrl);
    }

}
