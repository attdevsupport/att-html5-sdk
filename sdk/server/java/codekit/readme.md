Java Codekit Snapshot
===

This snapshot of the Codekit source code is used to generate the Codekit .jar file, which in turn is used by the HTML5 SDK's Java server. This source code contains some changes from the original Codekit sources, to better integrate with the HTML5 SDK.

Build
===

Use Maven to build the Codekit .jar file:

    mvn package
    
Deploy
===

After building the library, you should copy it into the Java server's 'lib' and WEBINF lib directores:

    cp target\codekit-1.0.jar ..\lib
    cp target\codekit-1.0.jar ..webapp\WEB-INF\lib
