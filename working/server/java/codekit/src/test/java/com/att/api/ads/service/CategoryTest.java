package com.att.api.ads.service;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class CategoryTest {

    @Test
    public void conversion() {
        assertEquals(Category.AUTO.getString(), "auto");
    }
}
