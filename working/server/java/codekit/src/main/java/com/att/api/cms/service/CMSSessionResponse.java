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

package com.att.api.cms.service;

import org.json.JSONObject;

/**
 * Immutable class used to hold CMS response after creating a session.
 *
 * @author pk9069
 * @version 1.0
 * @since 1.0
 */
public final class CMSSessionResponse {

    /** Session id. */
    private String id;

    /** Whether session creation was successful. */
    private boolean success;

    /**
     * Creates a CMSSessionResponse object.
     *
     * @param id session id
     * @param success whether creating session was successful
     */
    public CMSSessionResponse(String id, boolean success) {
        this.id = id;
        this.success = success;
    }

    /**
     * Gets session id.
     *
     * @return session id
     */
    public String getId() {
        return id;
    }

    /**
     * Gets success status.
     *
     * @return return success status
     */
    public boolean getSuccess() {
        return success;
    }

    public static CMSSessionResponse valueOf(final JSONObject jobj) {
        final String id = jobj.getString("id");
        final boolean success = jobj.getBoolean("success");
        return new CMSSessionResponse(id, success);
    }

}
