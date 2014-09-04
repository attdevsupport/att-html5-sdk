package com.html5sdk.att.servlet;

import com.html5sdk.att.AttConstants;
import com.html5sdk.att.provider.ClientCredentialsManager;


/**
 *
 * A singleton form of ClientCredentialsManager using the AttConstants values.
 *
 * @singleton
 * @class com.html5sdk.att.servlet.SharedCredentials
 *
 */
public class SharedCredentials {

    private static ClientCredentialsManager manager;

    static{
        init();
    }

    /**
     * @method getInstance
     * @return {ClientCredentialsManager} manager
     */
    public static ClientCredentialsManager getInstance() {
        return manager;
    }


    private static void init() {

        manager = new ClientCredentialsManager(
                AttConstants.HOST,
                AttConstants.CLIENTIDSTRING,
                AttConstants.CLIENTSECRETSTRING,
                AttConstants.CLIENTMODELSCOPE,
                AttConstants.TOKEN_EXPIRES_SECONDS);
    }
}
