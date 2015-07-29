package com.att.api.oauth;

import java.io.File;
import java.io.IOException;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertEquals;

// TODO (pk9069): test file locking?
public class OAuthTokenTest {
    @Rule
    public TemporaryFolder folder = new TemporaryFolder();

    @Test
    public void testConstructor() {
        OAuthToken token = new OAuthToken("1234", -100, "123");
        assertEquals(token.getAccessToken(), "1234");
        assertEquals(token.getRefreshToken(), "123");
        assertTrue(token.isAccessTokenExpired());
    }

    @Test(timeout = 10000)
    public void testIsExpired() {
        OAuthToken token = new OAuthToken("1234", 10000, "123", 10);
        assertTrue(token.isAccessTokenExpired());

        token = new OAuthToken("1234", 10000, "123");
        assertFalse(token.isAccessTokenExpired());

        token = new OAuthToken("1234", -10, "123");
        assertTrue(token.isAccessTokenExpired());

        token = new OAuthToken("1234", OAuthToken.NO_EXPIRATION, "123");
        assertFalse(token.isAccessTokenExpired());
    }

    @Test
    public void testSaveLoadToken() throws IOException {
        long expiresIn = OAuthToken.NO_EXPIRATION;
        OAuthToken token = new OAuthToken("1234", expiresIn, "123");
        File f1 = folder.newFile();
        token.saveToken(f1.getAbsolutePath());
        token = OAuthToken.loadToken(f1.getAbsolutePath());
        assertEquals(token.getAccessToken(), "1234");
        assertFalse(token.isAccessTokenExpired());
        assertEquals(token.getAccessTokenExpiry(), OAuthToken.NO_EXPIRATION);
        assertEquals(token.getRefreshToken(), "123");

        expiresIn = time() + 157700000000L;
        OAuthToken largeExpiryToken = new OAuthToken("1234", expiresIn, "123");
        File f2 = folder.newFile();
        largeExpiryToken.saveToken(f2.getAbsolutePath());
        token = OAuthToken.loadToken(f2.getAbsolutePath());
        assertEquals(token.getAccessToken(), "1234");
        assertFalse(token.isAccessTokenExpired());
        assertEquals(token.getRefreshToken(), "123");
        assertEquals(token.getExpiresIn(), expiresIn);
        assertEquals(token.getExpiresIn(), largeExpiryToken.getExpiresIn());
        assertEquals(token.getAccessTokenExpiry(), largeExpiryToken.getAccessTokenExpiry());
        assertEquals(token.getAccessTokenExpiry(), token.getExpiresIn() + token.getCreationTime());
        assertEquals(token.getCreationTime(),
                largeExpiryToken.getCreationTime());
    }

    private long time(){
        return System.currentTimeMillis() / 1000;
    }

    @Test
    public void testCacheToken() throws IOException {
        // OAuthToken.useCaching(true);
        File f = folder.newFile();
        String fullPath = f.getAbsolutePath();
        f.delete();
        assertTrue(OAuthToken.loadToken(fullPath) == null);

        f = folder.newFile();
        fullPath = f.getAbsolutePath();
        OAuthToken token = new OAuthToken("1", 0, "2");
        token.saveToken(fullPath);
        f.delete();

        token = OAuthToken.loadToken(fullPath);
        assertEquals(token.getAccessToken(), "1");
    }
}
