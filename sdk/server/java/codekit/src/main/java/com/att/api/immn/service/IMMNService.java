package com.att.api.immn.service;

import com.att.api.immn.service.DeltaChange;
import com.att.api.immn.service.DeltaResponse;
import com.att.api.immn.service.Message;
import com.att.api.immn.service.MessageContent;
import com.att.api.immn.service.MessageIndexInfo;
import com.att.api.immn.service.MessageList;
import com.att.api.immn.service.MessageListArgs;
import com.att.api.immn.service.MessageType;
import com.att.api.immn.service.SendResponse;
import com.att.api.oauth.OAuthToken;
import com.att.api.rest.APIResponse;
import com.att.api.rest.RESTClient;
import com.att.api.rest.RESTException;
import com.att.api.service.APIService;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.util.Arrays;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class IMMNService
extends APIService {
    public IMMNService(String fqdn, OAuthToken token) {
        super(fqdn, token);
    }

    public SendResponse sendMessage(String address, String msg) throws RESTException {
        String[] addrs = new String[]{address};
        return this.sendMessage(addrs, msg);
    }

    public SendResponse sendMessage(String[] addresses, String msg) throws RESTException {
        return this.sendMessage(addresses, msg, null, false, null);
    }

    public SendResponse sendMessage(String address, String subject, boolean group) throws RESTException {
        return this.sendMessage(address, null, subject, group);
    }

    public SendResponse sendMessage(String address, String msg, String subject, boolean group) throws RESTException {
        String[] addrs = new String[]{address};
        return this.sendMessage(addrs, null, subject, group);
    }

    public SendResponse sendMessage(String[] addresses, String subject, boolean group) throws RESTException {
        return this.sendMessage(addresses, null, subject, group);
    }

    public SendResponse sendMessage(String[] addresses, String msg, String subject, boolean group) throws RESTException {
        return this.sendMessage(addresses, msg, subject, group, null);
    }

    public SendResponse sendMessage(String address, String msg, String subject, boolean group, String[] attachments) throws RESTException {
        String[] addrs = new String[]{address};
        return this.sendMessage(addrs, msg, subject, group, attachments);
    }

    public SendResponse sendMessage(String[] addresses, String msg, String subject, boolean group, String[] attachments) throws RESTException {
        try {
            JSONObject jobj = new JSONObject(this.sendMessageAndReturnRawJson(addresses, msg, subject, group, attachments));
            return SendResponse.valueOf(jobj);
        }
        catch (JSONException pe) {
            throw new RESTException((Throwable)pe);
        }
    }

    public String sendMessageAndReturnRawJson(String[] addresses, String msg, String subject, boolean group, String[] attachments) throws RESTException {
        String endpoint = this.getFQDN() + "/myMessages/v2/messages";
        JSONObject jsonBody = new JSONObject();
        JSONObject body = new JSONObject();
        addresses = IMMNService.formatAddresses(addresses);
        if (msg != null) {
            body.put("text", (Object)msg);
        }
        if (subject != null) {
            body.put("subject", (Object)subject);
        }
        if (addresses.length <= 1) {
            group = false;
        }
        body.put("isGroup", group);
        JSONArray jaddrs = new JSONArray();
        for (String addr : addresses) {
            jaddrs.put((Object)addr);
        }
        body.put("addresses", (Object)jaddrs);
        jsonBody.put("messageRequest", (Object)body);
        
        RESTClient rest = new RESTClient(endpoint).setHeader("Accept", "application/json").setHeader("Content-Type", "application/json").addAuthorizationHeader(this.getToken());
        
        APIResponse response = attachments != null && attachments.length > 0 ? rest.httpPost(jsonBody, attachments) : rest.httpPost(jsonBody.toString());
        return response.getResponseBody();
    }

    public MessageList getMessageList(int limit, int offset) throws RESTException {
        return this.getMessageList(new MessageListArgs.Builder(limit, offset).build());
    }

    public MessageList getMessageList(MessageListArgs args) throws RESTException {
        try {
            JSONObject jobj = new JSONObject(this.getMessageListAndReturnRawJson(args));
            return MessageList.valueOf(jobj);
        }
        catch (JSONException pe) {
            throw new RESTException((Throwable)pe);
        }
    }

    public String getMessageListAndReturnRawJson(MessageListArgs args) throws RESTException {
        String endpoint = this.getFQDN() + "/myMessages/v2/messages";
        RESTClient client = new RESTClient(endpoint).addAuthorizationHeader(this.getToken()).setHeader("Accept", "application/json").setParameter("limit", "" + args.getLimit()).setParameter("offset", "" + args.getOffset());
        if (args.getMessageIds() != null) {
            String msgIds = StringUtils.join((Object[])args.getMessageIds(), (String)",");
            client.addParameter("messageIds", msgIds);
        }
        if (args.isFavorite() != null) {
            client.addParameter("isFavorite", args.isFavorite() != false ? "true" : "false");
        }
        if (args.isUnread() != null) {
            client.addParameter("isUnread", args.isUnread() != false ? "true" : "false");
        }
        if (args.getType() != null) {
            client.addParameter("type", args.getType().getString());
        }
        if (args.getKeyword() != null) {
            client.addParameter("keyword", args.getKeyword());
        }
        if (args.isIncoming() != null) {
            client.addParameter("isIncoming", args.isIncoming() != false ? "true" : "false");
        }
        return client.httpGet().getResponseBody();
    }

    public Message getMessage(String msgId) throws RESTException {
        try {
            JSONObject jobj = new JSONObject(this.getMessageAndReturnRawJson(msgId));
            return Message.valueOf(jobj.getJSONObject("message"));
        }
        catch (JSONException pe) {
            throw new RESTException((Throwable)pe);
        }
    }

    public String getMessageAndReturnRawJson(String msgId) throws RESTException {
        String endpoint = this.getFQDN() + "/myMessages/v2/messages/" + msgId;
        String responseBody = new RESTClient(endpoint).addAuthorizationHeader(this.getToken()).setHeader("Accept", "application/json").httpGet().getResponseBody();
        return responseBody;
    }

    public MessageContent getMessageContent(String msgId, String partNumber) throws RESTException {
        byte[] content;
        String endpoint = this.getFQDN() + "/myMessages/v2/messages/" + msgId + "/parts/" + partNumber;
        APIResponse response = new RESTClient(endpoint).addAuthorizationHeader(this.getToken()).setHeader("Accept", "application/json").httpGet();
        String ctype = response.getHeader("Content-Type");
        String clength = response.getHeader("Content-Length");
        try {
            content = response.getResponseBody().getBytes("ISO-8859-1");
        }
        catch (Exception e) {
            throw new RESTException(e);
        }
        return new MessageContent(ctype, clength, content);
    }

    public InputStream getMessageContentAndReturnStream(String msgId, String partNumber) throws RESTException {
        String endpoint = this.getFQDN() + "/myMessages/v2/messages/" + msgId + "/parts/" + partNumber;
        try {
            return new RESTClient(endpoint).addAuthorizationHeader(this.getToken()).httpGetAndReturnRawResponse().getEntity().getContent();
        }
        catch (IOException e) {
            throw new RESTException(e);
        }
    }

    public DeltaResponse getDelta(String state) throws RESTException {
        try {
            JSONObject jobj = new JSONObject(this.getDeltaAndReturnRawJson(state));
            return DeltaResponse.valueOf(jobj);
        }
        catch (JSONException pe) {
            throw new RESTException((Throwable)pe);
        }
    }

    public String getDeltaAndReturnRawJson(String state) throws RESTException {
        String endpoint = this.getFQDN() + "/myMessages/v2/delta";
        String responseBody = new RESTClient(endpoint).addAuthorizationHeader(this.getToken()).setHeader("Accept", "application/json").addParameter("state", state).httpGet().getResponseBody();
        return responseBody;
    }

    public void updateMessages(DeltaChange[] messages) throws RESTException {
        String endpoint = this.getFQDN() + "/myMessages/v2/messages";
        JSONArray jmsgs = new JSONArray();
        for (DeltaChange change : messages) {
            JSONObject jchange = new JSONObject();
            jchange.put("messageId", (Object)change.getMessageId());
            if (change.isUnread() != null) {
                jchange.put("isUnread", (Object)change.isUnread());
            }
            if (change.isFavorite() != null) {
                jchange.put("isFavorite", (Object)change.isFavorite());
            }
            jmsgs.put((Object)jchange);
        }
        JSONObject jobj = new JSONObject();
        jobj.put("messages", (Object)jmsgs);
        APIResponse response = new RESTClient(endpoint).addAuthorizationHeader(this.getToken()).setHeader("Accept", "application/json").setHeader("Content-Type", "application/json").httpPut(jobj.toString());
        if (response.getStatusCode() != 204) {
            int code = response.getStatusCode();
            String body = response.getResponseBody();
            throw new RESTException(code, body);
        }
    }

    public void updateMessage(String msgId, Boolean isUnread, Boolean isFavorite) throws RESTException {
        String endpoint = this.getFQDN() + "/myMessages/v2/messages/" + msgId;
        JSONObject jmsg = new JSONObject();
        if (isUnread != null) {
            jmsg.put("isUnread", (Object)isUnread);
        }
        if (isFavorite != null) {
            jmsg.put("isFavorite", (Object)isFavorite);
        }
        JSONObject jobj = new JSONObject();
        jobj.put("message", (Object)jmsg);
        APIResponse response = new RESTClient(endpoint).addAuthorizationHeader(this.getToken()).setHeader("Accept", "application/json").setHeader("Content-Type", "application/json").httpPut(jobj.toString());
        if (response.getStatusCode() != 204) {
            int code = response.getStatusCode();
            String body = response.getResponseBody();
            throw new RESTException(code, body);
        }
    }

    public void deleteMessages(String[] msgIds) throws RESTException {
        String endpoint = this.getFQDN() + "/myMessages/v2/messages";
        String msgIdsStr = StringUtils.join((Object[])msgIds, (String)",");
        APIResponse response = new RESTClient(endpoint).setHeader("Accept", "application/json").addAuthorizationHeader(this.getToken()).addParameter("messageIds", msgIdsStr).httpDelete();
        if (response.getStatusCode() != 204) {
            int code = response.getStatusCode();
            String body = response.getResponseBody();
            throw new RESTException(code, body);
        }
    }

    public void deleteMessage(String msgId) throws RESTException {
        String endpoint = this.getFQDN() + "/myMessages/v2/messages/" + msgId;
        APIResponse response = new RESTClient(endpoint).setHeader("Accept", "application/json").addAuthorizationHeader(this.getToken()).httpDelete();
        if (response.getStatusCode() != 204) {
            int code = response.getStatusCode();
            String body = response.getResponseBody();
            throw new RESTException(code, body);
        }
    }

    public void createMessageIndex() throws RESTException {
        String endpoint = this.getFQDN() + "/myMessages/v2/messages/index";
        APIResponse response = new RESTClient(endpoint).setHeader("Accept", "application/json").addAuthorizationHeader(this.getToken()).httpPost();
        if (response.getStatusCode() != 202) {
            int code = response.getStatusCode();
            String body = response.getResponseBody();
            throw new RESTException(code, body);
        }
    }

    public MessageIndexInfo getMessageIndexInfo() throws RESTException {
        try {
            JSONObject jobj = new JSONObject(this.getMessageIndexInfoAndReturnRawJson());
            return MessageIndexInfo.valueOf(jobj);
        }
        catch (JSONException pe) {
            throw new RESTException((Throwable)pe);
        }
    }

    public String getMessageIndexInfoAndReturnRawJson() throws RESTException {
        String endpoint = this.getFQDN() + "/myMessages/v2/messages/index/info";
        String jsonResponse = new RESTClient(endpoint).setHeader("Accept", "application/json").addAuthorizationHeader(this.getToken()).httpGet().getResponseBody();
        return jsonResponse;
    }
}

