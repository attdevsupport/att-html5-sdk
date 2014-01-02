package com.sencha.jetty;


import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.nio.SelectChannelConnector;
import org.eclipse.jetty.webapp.WebAppContext;


/**
 * 
 * Create an embedded Servlet container using Jetty.
 * Only use this configuration for development purposes and exploring the
 * API example.  This code should NOT be used for production deployment.
 *
 *  See the SDK documentation for packaging the java server into a WAR for production
 *  deployment.
 *
 *  Starts a server on localhost:8080 to change and assumes that the SDK download
 *  has been extracted and the SDK/client/ directory has not been moved.
 *
 * @author jason
 * @class com.sencha.jetty.EmbeddedServer
 *
 */

public class EmbeddedServer {


    private static void disableHTTPSCertificateChecking() {
            // Create a trust manager that does not validate certificate chains
            TrustManager[] trustAllCerts = new TrustManager[]{
                new X509TrustManager() {

                    public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                        return null;
                    }

                    public void checkClientTrusted(
                            java.security.cert.X509Certificate[] certs, String authType) {
                    }

                    public void checkServerTrusted(
                            java.security.cert.X509Certificate[] certs, String authType) {
                        System.out.println("trust running");
                    }
                }
            };

            //Install the all-trusting trust manager
            try {
                SSLContext sc = SSLContext.getInstance("SSL");
                sc.init(null, trustAllCerts, new java.security.SecureRandom());
                HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
            } catch (Exception e) {
            }
    }

    private static void disableHostnameVerifier() {
        // Create all-trusting host name verifier
        HostnameVerifier allHostsValid = new HostnameVerifier() {
            public boolean verify(String hostname, SSLSession session) {
                return true;
            }
        };

        // Install the all-trusting host verifier
        HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);

    }

    /**
     * @param {String[]} args
     * @method main
     */
    public static void main(String[] args) throws Exception {

         /*
          * TODO Remove when we have a valid SSL cert.
          * Java is very particular about verifying.
          *
          */
         disableHTTPSCertificateChecking();
         disableHostnameVerifier();

            Connector connector = new SelectChannelConnector();

            int port = 8080;
            if(args.length > 0) {
                Integer temp = Integer.parseInt(args[0].trim());
                if(temp!=null) {
                    port = temp.intValue();
                } else {
                    throw new Exception("Port number is optional but must be a valid integer: " + args[0]);
                }
            }

            Server server = new Server();

            connector.setPort(port);
            server.setConnectors(new Connector[]
            { connector });



            WebAppContext webapp = new WebAppContext();

            /*
             *  Point the webapp directly to the client folder in the sdk parent folder.
             *  If it has been moved or doesn't exist, then this won't work.
             */
            webapp.setResourceBase("../../client");


            System.out.println("Serving files from " + webapp.getResourceBase());

            webapp.setDescriptor("webapp/WEB-INF/web.xml");


            webapp.setContextPath("/");


            server.setHandler(webapp);


            server.start();
            server.join();
    }



}
