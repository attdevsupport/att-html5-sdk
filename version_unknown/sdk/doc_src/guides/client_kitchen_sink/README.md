Kitchen Sink
===

Kitchen Sink is a simple Sencha Touch application that exercises the AT&T APIs. For a general introduction on how to build a Sencha Touch Application, see [Sencha Touch Hello World](http://www.sencha.com/learn/hello-world).

![KS](resources/images/test-screenshots/home.png)



Code Organization
---
All of the client code for the Kitchen Sink application is located in the folder **sdk/client**.  The server code located under **sdk/server** serves the static files under the client folder.

Entry into the application is **client/index.html**, it loads all of the CSS and JavaScript needed to run the application:

Standard Include Files
---
To build a Sencha Touch Application that can access the AT&T APIs, the following files must be included in the index.html:

sencha-touch.css - The stylesheet for Sencha Touch applications.

    <link rel="stylesheet" href="sdk/resources/css/sencha-touch.css" type="text/css">

sencha-touch.js - The Sencha Touch debug file version.

    <script type="text/javascript" src="sdk/sencha-touch.js"></script>

Kitchen Sink Application - Specific Include Files
---

The rest of the files included in index.html are specific to the Kitchen Sink Application. 

Include KitchenSink.application

    <script type="text/javascript" src="app/app.js"></script>

