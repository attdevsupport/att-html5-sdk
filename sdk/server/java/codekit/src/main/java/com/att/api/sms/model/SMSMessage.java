/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 */

/*
 * Copyright 2014 AT&T
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
