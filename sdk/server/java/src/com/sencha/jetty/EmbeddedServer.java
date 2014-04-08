package com.sencha.jetty;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.GnuParser;
import org.apache.commons.cli.Options;
import org.eclipse.jetty.http.ssl.SslContextFactory;
import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.server.nio.SelectChannelConnector;
import org.eclipse.jetty.server.ssl.SslSelectChannelConnector;
import org.eclipse.jetty.webapp.WebAppContext;

/**
 * 
 * Create an embedded Servlet container using Jetty. Only use this configuration
 * for development purposes and exploring the API example. This code should NOT
 * be used for production deployment.
 * 
 * See the SDK documentation for packaging the java server into a WAR for
 * production deployment.
 * 
 * Starts a server on localhost:4567
 * 
 * @author jason
 * @class com.sencha.jetty.EmbeddedServer
 * 
 */

public class EmbeddedServer {

    /**
     * @param {String[]} args
     * @method main
     */
    public static void main(String[] args) throws Exception {

        Options opts = new Options();

        opts.addOption("war", false, "load site from .war file");
        opts.addOption("p", "port", true, "HTTP port for sample site");
        opts.addOption("s", "sslPort", true, "HTTPS port for sample site");
        opts.addOption("k", "keystorePath", true,
                "path to the SSL keystore file");
        opts.addOption("pw", "keystorePassword", true,
                "password for specified keystore file");

        opts.getOption("keystorePath").setRequired(true);
        opts.getOption("keystorePassword").setRequired(true);

        CommandLineParser parser = new GnuParser();
        CommandLine cmd = parser.parse(opts, args);

        boolean useWar = cmd.hasOption("war");
        int port = cmd.hasOption("port") ? Integer.parseInt(cmd
                .getOptionValue("port")) : 4567;
        int sslPort = cmd.hasOption("sslPort") ? Integer.parseInt(cmd
                .getOptionValue("sslPort")) : 4568;

        Connector connector = new SelectChannelConnector();
        connector.setPort(port);

        SslContextFactory scf = new SslContextFactory();
        scf.setKeyStorePath(cmd.getOptionValue("keystorePath"));
        scf.setKeyStorePassword(cmd.getOptionValue("keystorePassword"));
        SslSelectChannelConnector sslConnector = new SslSelectChannelConnector(
                scf);
        sslConnector.setPort(sslPort);

        Server server = new Server();
        server.setConnectors(new Connector[] { connector, sslConnector });

        if (useWar) {
            WebAppContext webapp = new WebAppContext();
            webapp.setWar("dist/att.war");
            webapp.setContextPath("/");
            server.setHandler(webapp);
        } else {
            WebAppContext webapp = new WebAppContext();
            webapp.setResourceBase("webapp");
            webapp.setDescriptor("webapp/WEB-INF/web.xml");
            webapp.setContextPath("/");

            ResourceHandler webcontent = new ResourceHandler();
            webcontent.setDirectoriesListed(true);
            webcontent.setWelcomeFiles(new String[] { "index.html" });
            webcontent.setResourceBase("../../webcontent");

            HandlerList handlers = new HandlerList();
            handlers.setHandlers(new Handler[] { webcontent, webapp });

            server.setHandler(handlers);
        }
        server.start();
        server.join();
    }
}
