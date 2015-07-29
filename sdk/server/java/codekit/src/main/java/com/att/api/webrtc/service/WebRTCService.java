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

package com.att.api.webrtc.service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import com.att.api.oauth.OAuthToken;
import com.att.api.rest.APIResponse;
import com.att.api.rest.RESTClient;
import com.att.api.rest.RESTException;
import com.att.api.service.APIService;

/**
 * Used to interact with version 1 of the WebRTC API.
 *
 * <p>
 * This class is thread safe.
 * </p>
 *
 */
public class WebRTCService extends APIService {
    /**
     * Creates a WebRTCService object.
     *
     * @param fqdn fully qualified domain name to use for sending requests
     * @param token OAuth token to use for authorization
     */
    public WebRTCService(final String fqdn, final OAuthToken token) {
        super(fqdn, token);
    }

    /**
     * Sends request to the API Gateway for associating token.
     *
     * @param userId user id to associate with token
     * @throws RESTException if request was not successful
     */
    public void associateToken(String userId) throws RESTException {
        String endpoint = getFQDN() + "/RTC/v1/userIds/" + userId;

        APIResponse response = new RESTClient(endpoint)
            .addHeader("Accept", "application/json")
            .addAuthorizationHeader(getToken())
            .httpPut("");

        if (response.getStatusCode() != 204) {
            throw new RESTException(response.getResponseBody());
        }
    }
}
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
