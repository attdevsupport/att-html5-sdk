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

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Immutable class that holds a Get SMS API response.
 *
 * @author pk9069
 * @version 1.0
 * @since 1.0
 */
public final class SMSGetResponse {
    private final SMSMessage[] msgs;

    private final String numberOfMsgs;
    private final String resourceUrl;
    private final String pendingMsgs;

    public SMSGetResponse(SMSMessage[] msgs, String numberOfMsgs,
            String resourceUrl, String pendingMsgs) {

        this.msgs = msgs;
        this.numberOfMsgs = numberOfMsgs;
        this.resourceUrl = resourceUrl;
        this.pendingMsgs = pendingMsgs;
    }

    public SMSMessage[] getMessages() {
        // TODO: return copy
        return msgs;
    }

    public String getNumberOfMessages() {
        return numberOfMsgs;
    }

    public String getResourceUrl() {
        return resourceUrl;
    }

    public String getPendingMessages() {
        return pendingMsgs;
    }

    public static SMSGetResponse valueOf(JSONObject jobj) {
        JSONObject msgList = jobj.getJSONObject("InboundSmsMessageList");

        String numberOfMsgs = msgList.getString("NumberOfMessagesInThisBatch");
        String resourceUrl = msgList.getString("ResourceUrl");
        String pendingMsgs = msgList.getString("TotalNumberOfPendingMessages");

        JSONArray msgs = msgList.getJSONArray("InboundSmsMessage");
        int length = msgs.length();

        SMSMessage[] msgModels = new SMSMessage[length];
        for (int i = 0; i < length; ++i) {
            JSONObject jmsg = msgs.getJSONObject(i);

            msgModels[i] = SMSMessage.valueOf(jmsg);
        }

        return new SMSGetResponse(
            msgModels, numberOfMsgs, resourceUrl, pendingMsgs
        );

    }
    
}
