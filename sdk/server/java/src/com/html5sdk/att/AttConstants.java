package com.html5sdk.att;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * 
 * AttConstants provides a central location for application configuration and
 * other constants throughout the application. Via a static init() method
 * AttConstants will attempt to load att-api.properties which contains the att
 * keys for your application. Please see the main SDK documentation for details
 * on how to configure att-api.properties.
 * 
 * - AttConstants.CLIENTIDSTRING - AttConstants.CLIENTSECRETSTRING -
 * AttConstants.HOST - and others are populated from the values found in
 * att-api.properties
 * 
 * The SDK server code uses these constants when making api calls to AT&T.
 * 
 * To provide some flexibility in the deployment of the application there are
 * two ways to load the properties file. The default is to look on the classpath
 * using the classloader for att-api.properties You can override this behavior
 * by specifying a java system property. By specifying a system property the
 * application can be re-configured without recompiling the war file.
 * 
 * com.html5sdk.example.servlet.AttConstants will look first for a system property
 * att.api.conf
 * 
 * String apiFile = System.getProperty("att.api.conf"); If it finds att.api.conf
 * it will assume that its value is the full path to the att config file.
 * 
 * if att.api.conf is not found, then it will attempt to load the file using the
 * classloader:
 * 
 * Thread.currentThread().getContextClassLoader().getResourceAsStream(
 * "att-api.properties"); If neither of these methods will meet your deployment
 * needs you will need to modify AttConstants to load your configuration files
 * from an alternate location.
 * 
 * 
 * @class com.html5sdk.att.AttConstants
 */
public class AttConstants {

    /**
     * The api key of the application provisioned with AT&T.
     * 
     * @property {String} CLIENTIDSTRING
     */
    public static String CLIENTIDSTRING;

    /**
     * The api secret key of the application provisioned with AT&T.
     * 
     * @property {String} CLIENTSECRETSTRING
     */
    public static String CLIENTSECRETSTRING;

    /**
     * enables debugging output
     * 
     * @property {Boolean} DEBUG
     */
    public static final boolean DEBUG = false;

    /**
     * The https url where the AT&T api resides.
     * 
     * @property {String} HOST
     */
    public static String HOST;

    /**
     * The url of this application that AT&T will return the user to when the
     * user completes their auth flow.
     * 
     * @property {String} CALLBACK_SERVER
     */
    public static String CALLBACK_SERVER;

    /**
     * The list of scopes that the application wants to gain access to when
     * making API calls that use Autonomous Client.
     * 
     * @property {String} CLIENTMODELSCOPE
     */
    public static String CLIENTMODELSCOPE;

    /**
     * The fully qualified class name of the FileMapper used to send
     * files.
     * 
     * @property {String} FILEMAPPERCLASSNAME
     */
    public static String FILEMAPPERCLASSNAME;

    /**
     * @property {long} TOKEN_EXPIRES_SECONDS
     */
    public static long TOKEN_EXPIRES_SECONDS;
    
    /**
     * @property {boolean} ENABLE_UNSAFE_OPERATIONS
     */
    public static boolean ENABLE_UNSAFE_OPERATIONS;

    public static boolean ENABLE_SSL_CHECK;

    static {
        init();
    }

    /**
     * Reads config information from a properties file
     * 
     * @method init
     * @static
     */
    private static void init() {

        String apiFile = System.getProperty("att.api.conf");

        Properties properties = new Properties();

        InputStream inputStream = null;

        if (apiFile != null) {
            System.out.println("using api config " + apiFile);
            try {
                inputStream = new FileInputStream(new File(apiFile));
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }
        } else {

            inputStream = Thread.currentThread().getContextClassLoader()
                    .getResourceAsStream("att-api.properties");

        }

        try {
            properties.load(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }

        CLIENTIDSTRING = properties.getProperty("AppKey");
        CLIENTSECRETSTRING = properties.getProperty("Secret");
        HOST = properties.getProperty("apiHost");

        // remove trailing slash
        if (HOST != null && HOST.endsWith("/")) {
            HOST = HOST.substring(0, HOST.length() - 1);
        }

        CALLBACK_SERVER = properties.getProperty("authCallbackUrl");

        CLIENTMODELSCOPE = properties.getProperty("clientModelScope");

        TOKEN_EXPIRES_SECONDS = Long.parseLong(properties
                .getProperty("tokenExpireSeconds"));

        ENABLE_UNSAFE_OPERATIONS = Boolean.parseBoolean(properties
                .getProperty("enableUnsafeOperations", "false"));
        
        FILEMAPPERCLASSNAME = properties.getProperty("fileMapperClassName");

        ENABLE_SSL_CHECK = Boolean.parseBoolean(properties
                .getProperty("enableSSLCheck", "true"));
    }

    /**
     * @property {String} SCOPE
     */
    public static final String SCOPE = "scope";

    /**
     * @property {String} CODE
     */
    public static final String CODE = "code";

    /**
     * @property {String} REDIRECT
     */
    public static final String REDIRECT = "redirect";

    /**
     * @property {String} ISAUTHORIZED
     */
    public static final String ISAUTHORIZED = "isAuthorized";

    /**
     * @property {String} STARTHTML
     */
    public static final String STARTHTML = "/index.html";

    /**
     * @property {String} REDIRECTHTML
     */
    public static final String REDIRECTHTML = "/redirect.html";

    /**
     * @property {String} ERRORHTML
     */
    public static final String ERRORHTML = "/error.html    ";

    /**
     * @property {String} CALLBACKHTML
     */
    public static final String CALLBACKHTML = "/callback.html";

    /**
     * @property {String} AUTHCHECKSTRING
     */
    public static final String AUTHCHECKSTRING = "/auth/check";

    /**
     * @property {String} AUTHURLSTRING
     */
    public static final String AUTHURLSTRING = "/auth/url";

    /**
     * @property {String} PROVIDER
     */
    public static final String PROVIDER = "ServiceProvider";

    /**
     * @property {String} TID
     */
    public static final String TID = "tid";

    /**
     * @property {String} TYPE
     */
    public static final String TYPE = "type";

    /**
     * @property {String} ACTION
     */
    public static final String ACTION = "action";

    /**
     * @property {String} METHOD
     */
    public static final String METHOD = "method";

    /**
     * @property {String} TOKEN
     */
    public static final String TOKEN = "token";

    /**
     * @property {String} ERROR
     */
    public static final String ERROR = "error";

    /**
     * @property {String} ID
     */
    public static final String ID = "id";

    /**
     * @property {String} SUCCESS
     */
    public static final String SUCCESS = "success";

    /**
     * @property {String} TRXID
     */
    public static final String TRXID = "trxID";

    /**
     * @property {String} RPC
     */
    public static final String RPC = "rpc";

    /**
     * @property {String} EXCEPTION
     */
    public static final String EXCEPTION = "exception";

    /**
     * @property {String} REDIRECT_HTML_PRE
     */
    public static final String REDIRECT_HTML_PRE = "<!DOCTYPE html><html><head><script>window.parent.postMessage('";

    /**
     * @property {String} REDIRECT_HTML_POST
     */
    public static final String REDIRECT_HTML_POST = "', '*');</script></head><body></body></html>";

    public static final String SCOPES = "scopes";

    public static final String RETURN_URL = "returnUrl";

    public static final String ACTION_ATTRIBUTE = "com.att.html5sdk.action";

    public static final String SERVICE_ATTRIBUTE = "com.att.html5sdk.service";

    public static final String SERVICEPROVIDERLOGGER = "ServiceProviderLogger";

    public static final String ERROR_DETAILS = "error_details";

    public static final String APISTATUSCODE = "apiStatusCode";

    public static final String RESULT = "result";

    public static final String ACCESS_TOKEN = "access_token";

    public static final String REFRESH_TOKEN = "refresh_token";

    public static final String APIERROR = "apiError";

    /**
     * @property {String} XARG_CLIENT_SDK
     */
    public static final String XARG_CLIENT_SDK = "ClientSdk=att.html5.js.java.4.2";
    
    public static final String TOKEN_MAP_KEY = "ATT_TOKEN_MAP";

	public static final String NOTIFICATION_SUBSCRIPTION = "ATT_NOTIFICATION_SUBSCRIPTION";

	public static final String NOTIFICATION_CHANNELID_HEADER = "x-channelId";
}
