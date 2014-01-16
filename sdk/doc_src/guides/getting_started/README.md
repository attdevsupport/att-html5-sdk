Getting Started
=======
The Getting Started Guide for the AT&T API Platform provides detailed instructions on how to get, use, and manage the AT&T APIs:

 - [Getting Started Guide for the AT&T API Platform](https://developer.att.com/home/api/APIGetting_Started.pdf).

For details on how to use the Call Management, Location, Device Capabilities, MMS, In App Messaging (MIM/MOBO), OAuth, Payment, SMS, Speech, and WAP Push APIs, see the AT&T API Platform page on the AT&T Developer Program website:

 - [AT&T API Platform](https://developer.att.com/docs).

**Note** To use the AT&T API Platform SDK to build an application, you will be required to obtain an API key set for each application intended to utilize the [AT&T API Platform](https://developer.att.com/docs). If you choose to utilize the SMS or MMS APIs, AT&T provides a means of obtaining Short Codes (virtual phone numbers) which will be associated with your application.

Overview
---

The AT&T API Platform SDK for HTML5 has three main layers: Client/Browser, HTML5 SDK Server, and AT&T API Platform:

![overview](resources/images/att-overview.png)

**Client/Browser** This is the layer that contains your application code, and is the layer that the end user interacts with. The AT&T SDK for HTML5 uses Sencha Touch to give developers an easier way to develop cross-platform mobile web apps. Also included in the AT&T SDK for HTML5 is Sencha Direct. Sencha Direct provides a Remote Procedure Call (RPC) framework that connects JavaScript code running in the browser to the server side function calls. For complete documentation on Sencha Direct visit the [Sencha Direct website](http://www.sencha.com/products/extjs/extdirect). The SDK uses Sencha Direct to send AT&T API requests from the browser to the HTML5 SDK Server. Additionally, this SDK contains the Att.Provider class, which is used to make API calls to the AT&T API Platform. 

**HTML5 SDK Server** This layer provides reusable and extend-able server code written in Java, PHP, and Ruby. The HTML5 SDK Server takes requests from the Att.Provider object and sends them to the AT&T API Platform.


**AT&T API Platform** This layer exposes a core set of APIs that allow an application to access AT&T network-based services.


About the Guides
---

The guides in this document are directed towards intermediate to advanced web application developers who have a good understanding of HTML, JavaScript, and related browser and server technologies. Server implementations of the SDK are provided in Java, Ruby, and PHP. Whichever language you choose to deploy on, you should to be familiar with installing, configuring and developing applications in that language.

All of the client-side code in the AT&T API Platform SDK for HTML5 is written in JavaScript using the Sencha Touch SDK. The guides in this document are designed to get the application up and running, and to make calls to the AT&T APIs. If you want to customize the behavior of the Sencha Touch based application, or develop custom applications using the provided JavaScript code, you will need to become familiar with the Sencha Touch SDK. To gain a better understanding of Sencha Touch, visit [Sencha Learn](http://www.sencha.com/learn/touch/) for in depth tutorials and API documentation.


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
5.	Check all of the AT&T service APIs: Multimedia Messaging Service (MMS), Short Messaging Service (SMS), WAP Push, Terminal Location, Payment, My Messages (MIM), Message On Behalf Of (MOBO) and Speech to text. As you create your application, you should enable all of these services.


OAuth Redirect URL
---

When creating the application, an OAuth Redirect URL is required.

The OAuth Redirect URL is the URL to your application, where the user is redirect once the login process is completed. When the application attempts an OAuth login, AT&T servers verify that the passed callback matches the one provisioned for your application.

The HTML5 SDK is using iframes to handle the OAuth login, because of this cross-domain access, controls come into effect.
When the AT&T API redirects the user (in the iframe) back to http://yourhost:yourport/att/callback, yourhost:yourport will need to match exactly with the yourhost:yourport where the application was loaded.

For example, if your application is hosted on mynewapp.com, and the user loads mynewapp.com, then your redirect URL should be http://mynewapp.com/att/callback

In these examples and guides we assume that you are using a 127.0.0.1 host (your local development server).  However, any valid DNS name will work. If you plan to test the client on a different computer or on a mobile device, using 127.0.0.1 will not work. In that case you should use a real DNS name that maps to your server.

Once your application is provisioned with the AT&T Developer Program, you can proceed with configuring the HTML SDK server.


HTML5 SDK Server
----

The AT&T API Platform SDK for HTML5 provides examples to address cross domain access and other security concerns. The SDK provides a proxy between the Sencha Touch application and the AT&T APIs. It also provides appropriate methods to request the OAuth login sequence, fetch an access token, and make requests to the AT&T APIs.

The HTML5 SDK Server layer has been implemented in three popular languages: Java, Ruby, and PHP.

The implementation in each language provides a consistent HTTP API for Client access. The HTTP API allows Clients to connect to any of the server implementations without modification.

The code is designed to run with a minimum number of external dependencies, to make integration into your specific environment more conveniently. However, depending on the language and development tools used in your environment, modifications may be required to the provided proxy code.


Quick Start
---

To get started, choose the server guide for the language of your choice from the menu on the left. The guide will walk you through the process of configuring, building, and running a Sencha Touch application that uses the AT&T API Platform.