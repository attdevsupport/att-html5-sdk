Getting Started
=======
Your first step will be to visit the AT&T Developer Program website; it has getting-started documentation for the AT&T API and application infrastructure, as well as detailed descriptions of the individual APIs.

 - [AT&T API Platform](https://developer.att.com/docs).

**Note** To use the AT&T API Platform SDK to build an application, you will be required to obtain an API key set for each application intended to utilize the [AT&T API Platform](https://developer.att.com/docs). If you choose to utilize the SMS or MMS APIs, AT&T provides a means of obtaining Short Codes (virtual phone numbers) which will be associated with your application.

Overview
---

The AT&T API Platform SDK for HTML5 has three main layers: Client/Browser, HTML5 SDK Server, and AT&T API Platform:

**Client/Browser** This is the layer that contains your application code, and is the layer that the end user interacts with. The AT&T SDK for HTML5 uses a JavaScript library (att-api-client.js) to give developers an easier way to develop cross-platform mobile web apps. 

**HTML5 SDK Server** This layer provides reusable and extend-able server code written in Java, PHP, and Ruby. The HTML5 SDK Server takes requests from the AttApiClient object and sends them to the AT&T API Platform.


**AT&T API Platform** This layer exposes a core set of APIs that allow an application to access AT&T network-based services.

![overview](resources/images/att-overview.png)


About the Guides
---

The guides in this document are directed towards intermediate to advanced web application developers who have a good understanding of HTML, JavaScript, and related browser and server technologies. Server implementations of the SDK are provided in Java, Ruby, and PHP. Whichever language you choose to deploy on, you should to be familiar with installing, configuring and developing applications in that language.

All of the client-side code in the AT&T API Platform SDK for HTML5 is written in JavaScript. All samples use the Sencha Touch SDK. The guides in this document are designed to get the application up and running, and to make calls to the AT&T APIs. If you want to customize the behavior of the Sencha Touch based application, you will need to become familiar with the Sencha Touch SDK. To gain a better understanding of Sencha Touch, visit [Sencha Learn](http://www.sencha.com/learn/touch/) for in depth tutorials and API documentation.

If you want to write HTML5 applications without using Sencha Touch, you can use the provided JavaScript library (att-api-client.js) to take advantage of the AT&T APIs in a library-neutral way.

**You will need a WebKit-based browser to run the Samples. Desktop WebKit browsers include Google Chrome and Apple Safari. Supported mobile devices include Android and iOS. **


Creating an AT&T Developer Account
---

In order to access the AT&T API Platform you must first join for the [AT&T Developer Program](https://developer.att.com) by creating an account. Once your account is created and validated, and you have followed the instructions on the AT&T Developer Program site to get access to the AT&T API Platform, you will be ready to setup an application within your AT&T Developer account. 


Setting Up Your Application
----

1.	Login to the developer [website](https://developer.att.com) and locate the My Apps section.
2.	Setup and define each application you plan to develop.
3.	Define the name of your application.
4.	Take note of the keys generated for your application setup. 
These values are used to configure the server software so that it may properly be authenticated when it attempts to communicate with the AT&T APIs. The short code is used as the address from which your application sends messages, and as the destination address for your application to process incoming messages.  
5.	Check all of the AT&T service APIs, including but not limited to: Multimedia Messaging Service (MMS), Short Messaging Service (SMS), and Speech to text. As you create your application, you should enable all of these services.


OAuth Redirect URL
---

When creating the application, an OAuth Redirect URL is required.

The OAuth Redirect URL is the URL to your application, where the user is redirect once the login process is completed. When the application attempts an OAuth login, AT&T servers verify that the passed callback matches the one provisioned for your application.

When the AT&T API redirects the user back to http://yourhost:yourport/att/callback, yourhost:yourport will need to match exactly with the yourhost:yourport where the application was loaded.

For example, if your application is hosted on mynewapp.com, and the user loads mynewapp.com, then your redirect URL should be http://mynewapp.com/att/callback

In these examples and guides we assume that you are using a 127.0.0.1 host (your local development server).  However, any valid DNS name will work. If you plan to test the client on a different computer or on a mobile device, using 127.0.0.1 will not work. In that case you should use a real DNS name that maps to your server.

Once your application is provisioned with the AT&T Developer Program, you can proceed with configuring the HTML SDK server.


HTML5 SDK Server
----

The AT&T API Platform SDK for HTML5 provides examples to address cross domain access and other security concerns. The SDK Server provides a proxy between the web application and the AT&T APIs. It also provides appropriate methods to request the OAuth login sequence, fetch an access token, and make requests to the AT&T APIs.

The HTML5 SDK Server layer has been implemented in three popular languages: Java, Ruby, and PHP.

The implementation in each language provides a consistent HTTP API for Client access. The HTTP API allows Clients to connect to any of the server implementations without modification.

The code is designed to run with a minimum number of external dependencies, to make integration into your specific environment more conveniently. However, depending on the language and development tools used in your environment, modifications may be required to the provided proxy code.


Quick Start
---

To get started, choose the server guide for the language of your choice from the menu on the left. The guide will walk you through the process of configuring, building, and running a web application that uses the AT&T API Platform.
