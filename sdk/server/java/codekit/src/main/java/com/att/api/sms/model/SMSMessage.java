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
 * Immutable class that holds an SMS message.
 *
 * @author pk9069
 * @version 1.0
 * @since 1.0
 */
public final class SMSMessage {

    private final String msgId;

    private final String msg;

    private final String senderAddr;

    public SMSMessage(String msgId, String msg, String senderAddr) {
        this.msgId = msgId;
        this.msg = msg;
        this.senderAddr = senderAddr;
    }

    public String getMessageId() {
        return msgId;
    }

    public String getMessage() {
        return msg;
    }

    public String getSenderAddress() {
        return senderAddr;
    }

    public static SMSMessage valueOf(JSONObject jobj) {
        final String msgId = jobj.getString("MessageId");
        final String msg = jobj.getString("Message");
        final String senderAddr = jobj.getString("SenderAddress");

        return new SMSMessage(msgId, msg, senderAddr);
    }

}
