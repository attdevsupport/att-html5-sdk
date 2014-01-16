Sencha Java SDK
===

This guide provides instructions for creating a web application using Java. At the end of this guide you will have a Sencha Touch web application that can connect to the AT&T APIs.

To simplify the deployment of the SDK using Java we have included an embedded Jetty servlet container.  The Java code is built using Apache Ant.

Prerequisites
----

 - Java version 1.6 or later. You can obtain this from [http://java.com](http://java.com).

 - Optional:
   - Ant version 1.8 or later
   - Eclipse IDE for Java Developers


If you can execute the following commands from the command line, you should be able to build and run the Java server:


    $ java -version
    java version "1.6.0_24"

    $ ant -version
    Apache Ant(TM) version 1.8.2 compiled on February 28 2011


If you are using Ant: The SDK download includes the file att.jar; this can be used to run the example. However, if you want to automatically generate a .war file for deployment with a different servlet container, you can use the provided ant build file.


If you are using the Eclipse IDE: We have provided the .project and .classpath files needed to automatically create an eclipse project. You can then build and run the application from within Eclipse, and you won't need the command line instructions.


**Windows Users** We recommend you use the **Build and Run using Eclipse** instructions below, as you can build and run the SDK using eclipse without needing to configure a command line environment.


Java Server Documentation
---
The SDK download includes javadoc formatted documentation in [sdk/server/java/docs/index.html](../server/java/docs/index.html).


Server configuration
---

Open the file sdk/server/java/conf/att-api.properties and find the following settings:

    # Replace these values with AppKey and Secret found in your 
    # application
    AppKey=XXXXXX
    Secret=XXXXXX

    # the OAuth Redirect Url setup above.
    authCallbackUrl=http://127.0.0.1:8080/att/callback

    # This is the main endpoint through which all API requests are made
    apiHost=https://api.att.com


Command Line (Mac, Linux, Unix)
====

Run using the command line
---

Once the source code has been built and the .war file is created, you can run the application using Jetty.  If you want to deploy the .war in a different Java servlet container such as Tomcat, you can copy the .war file from  dist/att.war into your servlet container's deployment directory and follow your vendor's instructions for deploying .war files.


To run the application, using the included jetty, you can use the included shell script, just type the following at a command prompt (in the sdk/server/java directory):

    $ sh run.sh

Or, if your OS does not support the shell script, you can run the command directly by typing the following at a command prompt (in the sdk/server/java directory):

    $ java -classpath lib/*:webapp/WEB-INF/lib/*:dist/att.jar -Datt.api.conf=conf/att-api.properties com.sencha.jetty.EmbeddedServer

You can also use the 'nohup' command to run the server in the background (<http://en.wikipedia.org/wiki/Nohup>)

    $ nohup sh run.sh &

The application should now be running on http://yourhost:8080/

To change the port number, pass a different port as the first argument:

    $ sh run.sh 8484

Stopping the server
---

If you run the server as an interactive process you will need to end the process manually using control-c.
If you use the 'nohup' command to run the server in the background just remember to manually end the process when you are done with it.

**Please note that we don't recommend deploying your application using the provided embedded jetty.** It should be used for development and testing purposes only.
If you want your application to run for an extended period of time, we recommend deploying the application as a .war file. See "Deploy the .war File" below.
That way you can take advantage of the deployment management options on your application server.




Build using the command line (Apache Ant)
---

To build the application using Ant from the command line:

    $ sh build.sh

A directory called *dist* will be created, as well the __att.jar__ and __att.war__ files. 


Eclipse IDE (Mac, Linux, Unix, Windows)
====

Build and Run using Eclipse
---

With Eclipse running create a new project using File->New->Project.

![overview](resources/images/eclipse-new.png)

 1 On the "Select a Wizard" screen choose "Java Project"
 2 Click Next
 3 Give the project a name.
 4 Uncheck "Use default location"
 5 Click the browse button to locate the SDK/server/java directory on your computer.
 6 Choose the SDK/server/java directory.
 7 The rest of the New Project settings can be left at default. Our included .project and .classpath will correctly configure the project.
 8 Click Finish

Once the project is created it should build automatically without error.

Using the package *explorer* expand com.sencha.jetty and open EmbeddedServer.

From the Run menu choose the Run command.

If you have the console view open you should see output similar to the following:

        2011-11-08 14:23:37.142:INFO:oejs.AbstractConnector:Started SelectChannelConnector@0.0.0.0:8080 STARTING
        2011-11-08 14:23:41.555:INFO:/:AttDirectRouter: AT&T Provider initialized.
        2011-11-08 14:23:41.555:INFO:/:AttDirectRouter:
        2011-11-08 14:23:41.557:INFO:/:AttDirectRouter: API endpoint:  https://api.att.com
        2011-11-08 14:23:41.557:INFO:/:AttDirectRouter: Client ID:     0d335f38dd5c0e8da0c569211563c099dddd
        2011-11-08 14:23:41.557:INFO:/:AttDirectRouter: Client Secret: 2dc632bcd4628137
        2011-11-08 14:23:41.557:INFO:/:AttDirectRouter: Shortcode:     37367231


The application should now be running on http://yourhost:8080/

When you are done using running the server, simply stop the process (using the Stop button from Eclipse's console view or debug view).


Ant build using Eclipse
---

Eclipse provides an easy way to run ant builds. 

    1 Right-Click (command click, etc.) on the file **build.xml** in the Package Explorer to open the contextual menu  
    2 Select Run As -> Ant Build  
    3 The default target will build the entire SDK and produce a .war file.  
    4 Choose a target and click **Run**.  


Deploy the .war File
====


The ant build.xml provided by the SDK creates a deployable .war file.  It will bundle the client directory, java code, and the contents of **webapp/WEB-INF/**.

**att-api.properties** will be copied to **WEB-INF/classes/**, so you need to configure your application before creating the build.

Follow the directions in **Build using the command line (Apache Ant)** and copy the **att.war** to your application server. Every application server deployment is different, but the build .war file is self-contained and should deploy on any standard compliant application server.

Alternate locations for att-api.properties
---

To provide some flexibility in the application deployment, there are two ways to load the properties file. The default is to look on the classpath using the classloader for  **att-api.properties.**  You can override this behavior by specifying a java system property. By specifying a system property the application can be re-configured without recompiling the .war file.

**com.sencha.example.servlet.AttConstants** will look first for the system property **att.api.conf**

    String apiFile = System.getProperty("att.api.conf");

If it finds **att.api.conf**, it will assume that its value is the full path to the att config file.

If **att.api.conf** is not found, then it will attempt to load the file using the classloader:

    Thread.currentThread().getContextClassLoader().getResourceAsStream("att-api.properties");

If neither of these methods meets your deployment needs, modify **AttConstants** to load your configuration files from an alternate location.