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

package com.att.api.immn.service;

import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import com.att.api.oauth.OAuthToken;
import com.att.api.rest.APIResponse;
import com.att.api.rest.RESTClient;
import com.att.api.rest.RESTException;
import com.att.api.service.APIService;

/**
 * Used to interact with version 1 of the In-app Messaging from Mobile
 * Number(IMMN) API.
 * 
 * @author pk9069
 * @author kh455g
 * @version 1.0
 * @since 1.0
 * @see <a
 *      href="https://developer.att.com/docs/apis/rest/1/In-app%20Messaging%20from%20Mobile%20Number">Documentation</a>
 */
public class IMMNService extends APIService {

    /**
     * Creates an IMMNService object.
     * 
     * @param fqdn
     *            fully qualified domain name to use for sending requests
     * @param token
     *            OAuth token to use for authorization
     */
    public IMMNService(String fqdn, OAuthToken token) {
        super(fqdn, token);
    }

    public SendResponse sendMessage(String address, String msg)
            throws RESTException {
        String[] addrs = { address };
        return this.sendMessage(addrs, msg);
    }

    public SendResponse sendMessage(String[] addresses, String msg)
            throws RESTException {
        return this.sendMessage(addresses, msg, null, false, null);
    }

    public SendResponse sendMessage(String address, String subject,
            boolean group) throws RESTException {
        return sendMessage(address, null, subject, group);
    }

    public SendResponse sendMessage(String address, String msg, String subject,
            boolean group) throws RESTException {
        String[] addrs = { address };
        return sendMessage(addrs, null, subject, group);
    }

    public SendResponse sendMessage(String[] addresses, String subject,
            boolean group) throws RESTException {
        return sendMessage(addresses, null, subject, group);
    }

    public SendResponse sendMessage(String[] addresses, String msg,
            String subject, boolean group) throws RESTException {
        return sendMessage(addresses, msg, subject, group, null);
    }

    public SendResponse sendMessage(String address, String msg, String subject,
            boolean group, String[] attachments) throws RESTException {
        String[] addrs = { address };
        return sendMessage(addrs, msg, subject, group, attachments);
    }

    public SendResponse sendMessage(String[] addresses, String msg,
            String subject, boolean group, String[] attachments)
            throws RESTException {

        try {
            JSONObject jobj = new JSONObject(sendMessageAndReturnRawJson(addresses, msg, subject, group, attachments));
            return SendResponse.valueOf(jobj);
        } catch (JSONException pe) {
            throw new RESTException(pe);
        }
    }

    public String sendMessageAndReturnRawJson(String[] addresses, String msg,
            String subject, boolean group, String[] attachments)
            throws RESTException {

        final String endpoint = getFQDN() + "/myMessages/v2/messages";

        JSONObject jsonBody = new JSONObject();
        JSONObject body = new JSONObject();
        addresses = formatAddresses(addresses);

        if (msg != null)
            body.put("text", msg);

        if (subject != null)
            body.put("subject", subject);

        // group messages must specify multiple addresses
        if (addresses.length <= 1)
            group = false;
        body.put("isGroup", group);

        JSONArray jaddrs = new JSONArray();
        for (String addr : addresses)
            jaddrs.put(addr);

        body.put("addresses", jaddrs);
        jsonBody.put("messageRequest", body);

        final RESTClient rest = new RESTClient(endpoint)
                .setHeader("Accept", "application/json")
                .setHeader("Content-Type", "application/json")
                .addAuthorizationHeader(this.getToken());

        final APIResponse response = (attachments == null) ? rest
                .httpPost(jsonBody.toString()) : rest.httpPost(jsonBody,
                attachments);

        return response.getResponseBody();
    }

    public MessageList getMessageList(int limit, int offset)
            throws RESTException {
        return getMessageList(new MessageListArgs.Builder(limit, offset)
                .build());
    }

    public MessageList getMessageList(MessageListArgs args)
            throws RESTException {
        try {
            JSONObject jobj = new JSONObject(
                    getMessageListAndReturnRawJson(args));
            return MessageList.valueOf(jobj);
        } catch (JSONException pe) {
            throw new RESTException(pe);
        }
    }

    public String getMessageListAndReturnRawJson(MessageListArgs args)
            throws RESTException {
        final String endpoint = getFQDN() + "/myMessages/v2/messages";

        final RESTClient client = new RESTClient(endpoint)
                .addAuthorizationHeader(getToken())
                .setHeader("Accept", "application/json")
                .setParameter("limit", "" + args.getLimit())
                .setParameter("offset", "" + args.getOffset());

        if (args.getMessageIds() != null) {
            String msgIds = StringUtils.join(args.getMessageIds(), ",");
            client.addParameter("messageIds", msgIds);
        }

        if (args.isFavorite() != null)
            client.addParameter("isFavorite", args.isFavorite() ? "true"
                    : "false");

        if (args.isUnread() != null)
            client.addParameter("isUnread", args.isUnread() ? "true" : "false");

        if (args.getType() != null)
            client.addParameter("type", args.getType().getString());

        if (args.getKeyword() != null)
            client.addParameter("keyword", args.getKeyword());

        if (args.isIncoming() != null)
            client.addParameter("isIncoming", args.isIncoming() ? "true"
                    : "false");

        return client.httpGet().getResponseBody();
    }

    public Message getMessage(final String msgId) throws RESTException {
        try {
            JSONObject jobj = new JSONObject(getMessageAndReturnRawJson(msgId));
            return Message.valueOf(jobj.getJSONObject("message"));
        } catch (JSONException pe) {
            throw new RESTException(pe);
        }
    }

    public String getMessageAndReturnRawJson(final String msgId)
            throws RESTException {
        final String endpoint = getFQDN() + "/myMessages/v2/messages/" + msgId;

        final String responseBody = new RESTClient(endpoint)
                .addAuthorizationHeader(getToken())
                .setHeader("Accept", "application/json").httpGet()
                .getResponseBody();
        return responseBody;
    }

    public MessageContent getMessageContent(String msgId, String partNumber)
            throws RESTException {

        final String endpoint = getFQDN() + "/myMessages/v2/messages/" + msgId
                + "/parts/" + partNumber;

        final APIResponse response = new RESTClient(endpoint)
                .addAuthorizationHeader(getToken())
                .setHeader("Accept", "application/json").httpGet();

        String ctype = response.getHeader("Content-Type");
        String clength = response.getHeader("Content-Length");
        byte[] content;
        try {
            content = response.getResponseBody().getBytes("ISO-8859-1");
        } catch (Exception e) {
            // Wrapping into RESTException
            throw new RESTException(e);
        }
        return new MessageContent(ctype, clength, content);
    }

    public InputStream getMessageContentAndReturnStream(String msgId,
            String partNumber) throws RESTException {

        final String endpoint = getFQDN() + "/myMessages/v2/messages/" + msgId
                + "/parts/" + partNumber;

        try {
            return new RESTClient(endpoint).addAuthorizationHeader(getToken())
                .httpGetAndReturnRawResponse().getEntity().getContent();
        } catch (IOException e) {
            throw new RESTException(e);
        }
    }

    public DeltaResponse getDelta(final String state) throws RESTException {
        try {
            JSONObject jobj = new JSONObject(getDeltaAndReturnRawJson(state));
            return DeltaResponse.valueOf(jobj);
        } catch (JSONException pe) {
            throw new RESTException(pe);
        }
    }

    public String getDeltaAndReturnRawJson(final String state)
            throws RESTException {
        final String endpoint = getFQDN() + "/myMessages/v2/delta";

        final String responseBody = new RESTClient(endpoint)
                .addAuthorizationHeader(getToken())
                .setHeader("Accept", "application/json")
                .addParameter("state", state).httpGet().getResponseBody();
        return responseBody;
    }

    public void updateMessages(DeltaChange[] messages) throws RESTException {
        final String endpoint = getFQDN() + "/myMessages/v2/messages";

        JSONArray jmsgs = new JSONArray();
        for (final DeltaChange change : messages) {
            JSONObject jchange = new JSONObject();
            jchange.put("messageId", change.getMessageId());

            if (change.isUnread() != null)
                jchange.put("isUnread", change.isUnread());

            if (change.isFavorite() != null)
                jchange.put("isFavorite", change.isFavorite());

            jmsgs.put(jchange);
        }

        JSONObject jobj = new JSONObject();
        jobj.put("messages", jmsgs);

        final APIResponse response = new RESTClient(endpoint)
                .addAuthorizationHeader(getToken())
                .setHeader("Accept", "application/json")
                .setHeader("Content-Type", "application/json")
                .httpPut(jobj.toString());

        if (response.getStatusCode() != 204) {
            final int code = response.getStatusCode();
            final String body = response.getResponseBody();
            throw new RESTException(code, body);
        }
    }

    public void updateMessage(String msgId, Boolean isUnread, Boolean isFavorite)
            throws RESTException {

        final String endpoint = getFQDN() + "/myMessages/v2/messages/" + msgId;

        JSONObject jmsg = new JSONObject();
        if (isUnread != null)
            jmsg.put("isUnread", isUnread);
        if (isFavorite != null)
            jmsg.put("isFavorite", isFavorite);

        JSONObject jobj = new JSONObject();
        jobj.put("message", jmsg);

        final APIResponse response = new RESTClient(endpoint)
                .addAuthorizationHeader(getToken())
                .setHeader("Accept", "application/json")
                .setHeader("Content-Type", "application/json")
                .httpPut(jobj.toString());

        if (response.getStatusCode() != 204) {
            final int code = response.getStatusCode();
            final String body = response.getResponseBody();
            throw new RESTException(code, body);
        }
    }

    public void deleteMessages(String[] msgIds) throws RESTException {
        final String endpoint = getFQDN() + "/myMessages/v2/messages";

        String msgIdsStr = StringUtils.join(msgIds, ",");

        final APIResponse response = new RESTClient(endpoint)
                .setHeader("Accept", "application/json")
                .addAuthorizationHeader(getToken())
                .addParameter("messageIds", msgIdsStr).httpDelete();

        if (response.getStatusCode() != 204) {
            final int code = response.getStatusCode();
            final String body = response.getResponseBody();
            throw new RESTException(code, body);
        }
    }

    public void deleteMessage(String msgId) throws RESTException {
        final String endpoint = getFQDN() + "/myMessages/v2/messages/" + msgId;

        final APIResponse response = new RESTClient(endpoint)
                .setHeader("Accept", "application/json")
                .addAuthorizationHeader(getToken()).httpDelete();

        if (response.getStatusCode() != 204) {
            final int code = response.getStatusCode();
            final String body = response.getResponseBody();
            throw new RESTException(code, body);
        }
    }

    public void createMessageIndex() throws RESTException {
        final String endpoint = getFQDN() + "/myMessages/v2/messages/index";

        final APIResponse response = new RESTClient(endpoint)
                .setHeader("Accept", "application/json")
                .addAuthorizationHeader(getToken()).httpPost();

        if (response.getStatusCode() != 202) {
            final int code = response.getStatusCode();
            final String body = response.getResponseBody();
            throw new RESTException(code, body);
        }
    }

    public MessageIndexInfo getMessageIndexInfo() throws RESTException {
        try {
            JSONObject jobj = new JSONObject(
                    getMessageIndexInfoAndReturnRawJson());
            return MessageIndexInfo.valueOf(jobj);
        } catch (JSONException pe) {
            throw new RESTException(pe);
        }
    }

    public String getMessageIndexInfoAndReturnRawJson() throws RESTException {
        final String endpoint = getFQDN()
                + "/myMessages/v2/messages/index/info";

        final String jsonResponse = new RESTClient(endpoint)
                .setHeader("Accept", "application/json")
                .addAuthorizationHeader(getToken()).httpGet().getResponseBody();
        return jsonResponse;
    }
}
