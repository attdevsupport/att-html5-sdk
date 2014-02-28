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

package com.att.api.ads.service;

public enum Category {
    AUTO("auto"), BUSINESS("business"), FINANCE("finance"), CHAT("chat"),
    COMMUNITY("community"), SOCIAL("social"), PERSONALS("personals"),
    COMMUNICATION("communication"), TECHNOLOGY("technology"), GAMES("games"),
    HEALTH("health"), MEDICAL("medical"), MAPS("maps"), LOCAL("local"),
    ENTERTAINMENT("entertainment"), MOVIES("movies"), TV("tv"), MUSIC("music"),
    PHOTOS("photos"), VIDEO("video"), NEWS("news"), WEATHER("weather"),
    SPORTS("sports"), SHOPPING("shopping"), TOOLS("tools"), TRAVEL("travel"),
    OTHER("other");

    private final String val;

    private Category(String val) {
        this.val = val;
    }

    public String getString() {
        return this.val;
    }

    public static Category fromString(final String str) {
        Category[] categories = Category.values();
        for (Category c : categories) {
            if (c.getString().equals(str)) {
                return c;
            }
        }

        return null;
    }

    public static String[] stringValues() {
        Category[] categories = Category.values();
        String[] strs = new String[categories.length];

        for (int i = 0; i < categories.length; ++i) {
            strs[i] = categories[i].getString();
        }

        return strs;
    }
}
