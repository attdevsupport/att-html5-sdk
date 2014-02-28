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
 * Immutable class that holds SMS delivery information.
 *
 * @author pk9069
 * @version 1.0
 * @since 1.0
 */
public final class SMSDeliveryInfo {

    private final String msgId;

    private final String addr;

    private final String status;

    public SMSDeliveryInfo(String msgId, String addr, String status) {
        this.msgId = msgId;
        this.addr = addr;
        this.status = status;
    }

    public String getMessageId() {
        return msgId;
    }

    public String getAddress() {
        return addr;
    }

    public String getDeliveryStatus() {
        return status;
    }

    public static SMSDeliveryInfo valueOf(JSONObject jobj) {
        final String id = jobj.getString("Id");
        final String addr = jobj.getString("Address");
        final String status = jobj.getString("DeliveryStatus");

        return new SMSDeliveryInfo(id, addr, status);
    }
}

