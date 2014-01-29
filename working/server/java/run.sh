#!/usr/bin/env bash  

echo "starting server"

java -classpath lib/*:webapp/WEB-INF/lib/*:dist/att.jar: -Datt.api.conf=conf/att-api.properties com.sencha.jetty.EmbeddedServer war $1