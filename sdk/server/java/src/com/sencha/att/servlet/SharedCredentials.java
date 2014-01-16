package com.sencha.att.servlet;

import com.sencha.att.AttConstants;
import com.sencha.att.provider.ClientCredentialsManager;


/**
 *
 * A singleton form of ClientCredentialsManager using the AttConstants values.
 *
 * @singleton
 * @class com.sencha.att.servlet.SharedCredentials
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
                AttConstants.REFRESH_TOKEN_EXPIRE_HOURS,
                true);

    }


}
