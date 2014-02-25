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

public enum CMSStatus {
    QUEUED("QUEUED"), NOTFOUND("NOTFOUND"), FAILED("FAILED");

    final String str;

    private CMSStatus(final String str) {
        this.str = str;
    }

    public String getString() {
        return this.str;
    }

    public static CMSStatus fromString(final String str) {
        final CMSStatus[] statuses = CMSStatus.values();

        for (final CMSStatus status : statuses) {
            if (status.getString().equals(str)) {
                return status;
            }
        }

        return null;
    }
}
