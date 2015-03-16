Getting Started
=======
For details on using the Device Capabilities, MMS, In-App Messaging, OAuth, SMS, and Speech APIs, see the AT&T Developer Program website:

 - [AT&T API Platform](https://developer.att.com/).

**Note:** To use the AT&T API Platform SDK to build an app, you must obtain an API key set for each app in which you intend to utilize the [AT&T API Platform](https://developer.att.com/docs). If you wish to use the SMS or MMS APIs, the AT&T Developer Program will provide short codes (virtual phone numbers) to associate with your app.

Overview
---

The AT&T API Platform SDK for HTML5 has three main layers: Client/Browser, HTML5 SDK Server, and AT&T API Platform:

**Client/Browser** Contains your app code; this layer is for user interaction. The AT&T SDK for HTML5 uses a JavaScript library (att-api-client.js) to enable development of cross-platform mobile Web apps. 

**HTML5 SDK Server** Provides reusable and extendable server code written in Java, PHP, and Ruby. The HTML5 SDK Server takes requests from the AttApiClient object and sends them to the AT&T API Platform.


**AT&T API Platform** Exposes a core set of APIs that allow an app to access AT&T network-based services.

![overview](resources/images/att-overview.png)


About the Guides
---

These guides are for intermediate to advanced Web app developers who have a good understanding of HTML, JavaScript, and related browser and server technologies. Server implementations of the SDK are provided in Java, Ruby, and PHP. You should be familiar with installing, configuring and developing apps in the language of your choice.

JavaScript is the language used for all of the client-side code in the AT&T API Platform SDK for HTML5. All samples use the Sencha Touch SDK. These guides are designed to get an app up and running, and to make calls to the AT&T APIs. To customize the behavior of a Sencha Touch-based app, you should become familiar with the Sencha Touch SDK. To gain a better understanding of Sencha Touch, visit [Sencha Learn](http://www.sencha.com/) for in-depth tutorials and API documentation.

If you want to write HTML5 apps without using Sencha Touch, you can use the provided JavaScript library (att-api-client.js) to utilize AT&T APIs in a library-neutral way.

**You will need a WebKit-based browser to run the sample code. Desktop WebKit browsers include Google Chrome and Apple Safari. Supported mobile devices include Android and iOS. **


Creating an AT&T Developer Account
---

In order to access the AT&T API Platform, you must first join the [AT&T Developer Program](https://developer.att.com) by creating an account. Once your account is created and validated and you have followed the instructions on the AT&T Developer Program site to get access to the AT&T API Platform, you will be ready to set up an app within your AT&T Developer account. 


Setting Up Your App
----

1.	Log in to the [AT&T Developer Program website](https://developer.att.com) and click the My Apps button.
2.	Click Set Up New App, complete the required fields, and select the APIs you wish to enable.
3.	Click Submit App. Take note of the App Key and App Secret generated for your app setup. 
These values are used to configure the server software for authentication when communicating with the AT&T APIs. The short code is used as the address from which your application sends messages, and as the destination address for your application to process incoming messages.  
5.	Select all of the AT&T APIs to enable them for your app. As you create your app you will be able to integrate only the APIs you want to use.


OAuth Redirect URL
---

An OAuth Redirect URL is required for all apps using the Device Capabilities and In-App Messaging APIs. The OAuth Redirect URL is the URL to your application, where the user is redirected once the user consent process is completed. When the app attempts an OAuth authentication, AT&T servers verify that the passed callback matches the one provisioned for your app.

After authentication, the AT&T API redirects the user back to http://yourhost:yourport/att/callback, yourhost:yourport will need to match exactly with the yourhost:yourport from which the app was loaded.

For example, if your app is hosted on mynewapp.com, and the user loads mynewapp.com, then your redirect URL should be http://mynewapp.com/att/callback .

In these examples and guides, we assume that you are using a host address of 127.0.0.1 (often used for a local development server). However, any valid DNS name will work. If you plan to test the client from a different computer or on a mobile device, using 127.0.0.1 will not work. In that case you should use a real DNS name that maps to your server.

Once your application is provisioned with the AT&T Developer Program, you can proceed with configuring the HTML SDK server.

Notifications Callback URL
---
You can use a Webhooks callback URL to receive notifications of changes to your In-App Messaging message box. After initial app setup on the [AT&T Developer Program website](https://developer.att.com), edit the app and click Push Notifications.  Enter the Notification Callback URL for your server at https://yourdomain:yoursslport/att/notification/v1/callback.

HTML5 SDK Server
----

The AT&T API Platform SDK for HTML5 provides examples to address cross-domain access and other security concerns. The SDK Server provides a proxy between the Web app and the AT&T APIs. It also provides appropriate methods for requesting the OAuth login sequence, fetching an access token, and making requests to the AT&T APIs.

The HTML5 SDK Server layer has been implemented in three popular languages: Java, Ruby, and PHP.

The implementation in each language provides a consistent HTTP API for client access. The HTTP API allows clients to connect to any of the server implementations without modification.

The HTML5 SDK server proxy is designed to run with a minimum number of external dependencies, making integration into your specific environment more convenient. However, depending on the language and development tools used in your environment, modifications may be required to the provided proxy code.


Quick Start
---

To get started, choose the server guide for the language of your choice from the menu on the left. The guide will walk you through the process of configuring, building, and running a Web app that uses the AT&T API Platform.
