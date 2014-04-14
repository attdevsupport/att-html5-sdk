java -classpath lib\*;webapp\WEB-INF\lib\*;dist\att.jar -Datt.api.conf=conf\att-api.properties com.html5sdk.jetty.EmbeddedServer -war -keystorePath=certs\.keystore -keystorePassword=password
