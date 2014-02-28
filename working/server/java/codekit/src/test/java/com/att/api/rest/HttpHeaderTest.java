package com.att.api.rest;

import org.junit.BeforeClass;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class HttpHeaderTest {
    private static HttpHeader header;
    private static final String NAME = "name";
    private static final String VALUE = "value";

    @BeforeClass
    public static void createHeader() {
        HttpHeaderTest.header = new HttpHeader(NAME, VALUE); 
    }

    @Test
    public void testGetName() {
        assertEquals(header.getName(), NAME);
    }

    @Test
    public void testGetValue() {
        assertEquals(header.getValue(), VALUE);
    }
}
