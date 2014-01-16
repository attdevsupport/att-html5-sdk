Sencha SDK
=======

The Sencha Provider API provides an example of how to integrate AT&T's API with Sencha Touch.  This SDK is divided into two parts: client and server.
The client is a Sencha Touch application comprised of JavaScript, HTML and CSS which can be served by any static web server.  The Server code works as a proxy to connect the JavaScript code running on the user's browser and the AT&T API.

Server
====

Because of cross domain access and other security concerns the Sencha SDK provides example server code that acts as a proxy between the Sencha Touch application and AT&T API. It provides convenience methods to request the OAUTH login sequence, fetch an access token and then make requests to the AT&T APIs.

The implementation in each language provides a consistent HTTP api for the Client to access. The client can connect to any of the server implementations without modification.


Sencha has provided example code in three popular languages: Java, Ruby and PHP.  In server/language you will find a getting started guide that will walk through the process of configuring and starting a standalone server.


This code is designed to run with a minimal number of external dependancies to make integration into your specific environment as simple as possible. Depending on the specific language and development tools you use in your environment modifications may need to be made to the provided proxy code.


Client
===

A Sencha Touch application that demonstrates how to allow a user to login to the AT&T API via OAUTH and make API requests via the Server proxy code.