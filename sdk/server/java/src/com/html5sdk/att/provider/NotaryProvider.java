package com.html5sdk.att.provider;

import java.util.logging.Logger;

import org.apache.http.client.methods.HttpPost;
import org.json.JSONObject;

import com.html5sdk.att.AttConstants;

/**
 * @class com.html5sdk.att.provider.NotaryProvider
 * @author jackratcliff
 * 
 */
public class NotaryProvider {

    private static Logger log = Logger
            .getLogger(AttConstants.SERVICEPROVIDERLOGGER);

    private final String host;
    private final String clientId;
    private final String clientSecret;

    /**
     * @param {String} host
     * @param {String} clientId
     * @param {String} clientSecret
     * @constructor
     */
    public NotaryProvider(String host, String clientId, String clientSecret) {
        this.host = host;
        this.clientId = clientId;
        this.clientSecret = clientSecret;

    }

    /**
     * 
     * @param toSign
     *            JSON Object representing the payload to sign
     * @return {ApiResponse}
     * @throws ApiRequestException
     * @method signPayload
     */
    public ApiResponse signPayload(JSONObject toSign)
            throws ApiRequestException {

        ApiResponse results = null;

        HttpPost post = new HttpPost(host
                + "/Security/Notary/Rest/1/SignedPayload");

        log.info("host " + host);

        post.setHeader("client_id", this.clientId);

        post.setHeader("client_secret", this.clientSecret);

        log.info("tosign " + toSign.toString());

        results = ApiRequestManager.postJSON(toSign, post);

        log.info("results " + results.toJson());

        return results;

    }

}
