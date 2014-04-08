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
 * Immutable class for holding MMS delivery information.
 *
 * @author pk9069
 * @version 1.0
 * @since 1.0
 */
public final class MMSDeliveryInfo {

    private final String msgId;
    private final String addr;
    private final String deliveryStatus;

    public MMSDeliveryInfo(String msgId, String addr, String deliveryStatus) {
        this.msgId = msgId;
        this.addr = addr;
        this.deliveryStatus = deliveryStatus;
    }

    /**
     * Gets message id.
     *
     * @return msg id
     */
    public String getMessageId() {
        return msgId;
    }

    /**
     * Gets address.
     *
     * @return address
     */
    public String getAddress() {
        return addr;
    }

    /**
     * Gets delivery status.
     *
     * @return delivery status
     */
    public String getDeliveryStatus() {
        return deliveryStatus;
    }

    public static MMSDeliveryInfo valueOf(JSONObject jobj) {
        final String msgId = jobj.getString("Id");
        final String addr = jobj.getString("Address");
        final String dStatus = jobj.getString("DeliveryStatus");

        return new MMSDeliveryInfo(msgId, addr, dStatus);
    }
}
