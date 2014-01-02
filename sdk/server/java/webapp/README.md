This directory contains the Java specific webapp files.  All of the html/css/javascript that is common between implementations is kept in sdk/client

The example application deployment using Jetty will pull the pieces together each time it is started so no copying is required.

the deploy ant task will generate a self-contained web application archive (war) that can be deployed to any servlet container. 