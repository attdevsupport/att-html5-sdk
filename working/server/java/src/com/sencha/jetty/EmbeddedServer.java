package com.sencha.jetty;


import org.eclipse.jetty.server.Connector;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
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


	/**
	 * @param {String[]} args
	 * @method main
	 */
	public static void main(String[] args) throws Exception {
		boolean useWar = false;
		//         disableHTTPSCertificateChecking();
		//         disableHostnameVerifier();

		Connector connector = new SelectChannelConnector();

		int port = 8080;
		if(args.length > 0) {
			String war = args[0].trim();

			useWar = ("war".equalsIgnoreCase(war));

			if(args.length > 1) {

				Integer temp = Integer.parseInt(args[1].trim());
				if(temp!=null) {
					port = temp.intValue();
				} else {
					throw new Exception("Port number is optional but must be a valid integer: " + args[1]);
				}
			}
		}

		Server server = new Server();

		connector.setPort(port);
		server.setConnectors(new Connector[] { connector });

		if(useWar){
			WebAppContext webapp = new WebAppContext();
			webapp.setWar("dist/att.war");
			webapp.setContextPath("/");
			server.setHandler(webapp);
		}else{
			WebAppContext webapp = new WebAppContext();
			webapp.setResourceBase("webapp");
			webapp.setDescriptor("webapp/WEB-INF/web.xml");
			webapp.setContextPath("/");

			ResourceHandler webcontent = new ResourceHandler();
			webcontent.setDirectoriesListed(true);
			webcontent.setWelcomeFiles(new String[]{ "index.html" });
			webcontent.setResourceBase("../../webcontent");

			HandlerList handlers = new HandlerList();
			handlers.setHandlers(new Handler[] { webcontent, webapp });

			server.setHandler(handlers);
		}

		server.start();
		server.join();
	}



}
