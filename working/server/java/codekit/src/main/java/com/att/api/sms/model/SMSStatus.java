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
 * Immutable class that holds SMS API status information.
 *
 * @author pk9069
 * @version 1.0
 * @since 1.0
 */
public final class SMSStatus {
    private final String resourceUrl;

    private final SMSDeliveryInfo[] infoList;

    public SMSStatus(String resourceUrl, SMSDeliveryInfo[] infoList) {
        this.resourceUrl = resourceUrl;
        this.infoList = infoList;
    }

    public String getResourceUrl() {
        return resourceUrl;
    }

    public SMSDeliveryInfo[] getInfoList() {
        if (infoList == null)
            return null;

        // provide a copy instead of exposing internal array
        SMSDeliveryInfo[] list = new SMSDeliveryInfo[infoList.length];
        for (int i = 0; i < list.length; ++i) {
            list[i] = infoList[i];
        }

        return list;
    }

    public static SMSStatus valueOf(JSONObject jobj) {
        JSONObject deliveryInfoList = jobj.getJSONObject("DeliveryInfoList");

        final String resourceUrl = deliveryInfoList.getString("ResourceUrl");

        JSONArray infos = deliveryInfoList.getJSONArray("DeliveryInfo");
        final int length = infos.length();

        SMSDeliveryInfo[] infoList = new SMSDeliveryInfo[length];

        for (int i = 0; i < length; ++i) {
            infoList[i] = SMSDeliveryInfo.valueOf(infos.getJSONObject(i));
        }

        return new SMSStatus(resourceUrl, infoList);
    }

}
