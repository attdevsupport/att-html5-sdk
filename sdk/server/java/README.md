You must have ANT installed to build the Java server. To build it, run the following command.
    ant clean war
To run the server, use the following command:
    java -classpath lib\*;webapp\WEB-INF\lib\*;dist\att.jar -Datt.api.conf=conf\att-api.properties com.sencha.jetty.EmbeddedServer war 4567
The shell scripts build.sh and run.sh are provided for your convenience.
Access the server by navigating your browser to http://localhost:4567
